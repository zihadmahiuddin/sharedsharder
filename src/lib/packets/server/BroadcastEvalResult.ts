import flatted from "flatted";

import { ClientSession } from "../../util/Session";
import Packet from "../Packet";

export default class BroadcastEvalResultPacket extends Packet {
  id = 20106;

  responses: any[] = [];

  evalId: number;
  totalEvals: number;

  encode() {
    this.payload.writeInt16(this.evalId);
    this.payload.writeInt16(this.totalEvals);
    this.payload.writeInt16(this.responses.length);
    for (const response of this.responses) {
      this.payload.writeIString(response);
    }
  }

  decode() {
    this.evalId = this.payload.readInt16();
    this.totalEvals = this.payload.readInt16();
    if (this.session instanceof ClientSession) {
      this.session.totalEvals = this.totalEvals;
    }
    const responseCount = this.payload.readInt16();
    for (let i = 0; i < responseCount; i++) {
      this.responses.push(flatted.parse(this.payload.readIString()));
    }
  }

  processReceive() {}
}
