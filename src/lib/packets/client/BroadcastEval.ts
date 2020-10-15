import { ServerSession } from "../../util/Session";
import Packet from "../Packet";
import BroadcastEvalResultPacket from "../server/BroadcastEvalResult";
import EvalRequestPacket from "../server/EvalRequest";
import EvalResponsePacket from "./EvalResponse";

export default class BroadcastEvalPacket extends Packet {
  id = 10106;

  /**
   * The amount of time to wait for response from all the shards, in milliseconds
   */
  timeout = 10000;

  /**
   * Code to execute on the other shards
   */
  code = "";

  responseSent = false;
  responses: string[] = [];

  evalId: number;

  encode() {
    this.payload.writeInt32(this.timeout);
    this.payload.writeIString(this.code);
  }

  decode() {
    this.timeout = this.payload.readInt32();
    this.code = this.payload.readIString();
  }

  async processReceive() {
    if (this.session instanceof ServerSession) {
      this.evalId = this.session.totalEvals++;
      const receivedAt = Date.now();
      let sessionCount = 0;
      const evalRequestPacket = new EvalRequestPacket();
      evalRequestPacket.code = this.code;
      evalRequestPacket.evalId = this.evalId;
      const onResponse = (packet: Packet) => {
        if (packet instanceof EvalResponsePacket) {
          if (packet.evalId === this.evalId) {
            this.responses.push(packet.result);
            packet.session.off("packetReceived", onResponse);
          }
        }
      };
      for (const session of this.session.server.sessions) {
        session.sendPacket(evalRequestPacket);
        session.on("packetReceived", onResponse);
        const interval = setInterval(() => {
          if (
            this.responseSent ||
            this.responses.length === sessionCount ||
            Date.now() >= receivedAt + this.timeout
          ) {
            clearInterval(interval);
            session.off("packetReceived", onResponse);
          }
        }, this.timeout);
        sessionCount++;
      }
      const responseInterval = setInterval(() => {
        if (!this.responseSent) {
          if (
            this.responses.length === sessionCount ||
            Date.now() >= receivedAt + this.timeout
          ) {
            const broadcastEvalResultPacket = new BroadcastEvalResultPacket();
            broadcastEvalResultPacket.evalId = this.evalId;
            broadcastEvalResultPacket.responses = this.responses;
            broadcastEvalResultPacket.totalEvals = this.session.totalEvals;
            this.session.sendPacket(broadcastEvalResultPacket);
            this.responseSent = true;
            clearInterval(responseInterval);
          }
        }
      }, 100);
    }
  }
}
