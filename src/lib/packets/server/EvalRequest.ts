import flatted from "flatted";

import { ClientSession } from "../../util/Session";
import EvalResponsePacket from "../client/EvalResponse";
import Packet from "../Packet";

export default class EvalRequestPacket extends Packet {
  id = 20107;

  code = "";

  evalId: number;

  decode() {
    this.evalId = this.payload.readInt32();
    this.code = this.payload.readIString();
  }

  encode() {
    this.payload.writeInt32(this.evalId);
    this.payload.writeIString(this.code);
  }

  async processReceive() {
    if (this.session instanceof ClientSession) {
      const result = flatted.stringify(
        await this.session.client.__eval(this.code)
      );
      const evalResponsePacket = new EvalResponsePacket();
      evalResponsePacket.evalId = this.evalId;
      evalResponsePacket.result = result;
      this.session.sendPacket(evalResponsePacket);
    }
  }
}
