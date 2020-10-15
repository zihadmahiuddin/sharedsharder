import Packet from "../Packet";

export default class EvalResponsePacket extends Packet {
  id = 10107;

  result = "";

  evalId: number;

  decode() {
    this.evalId = this.payload.readInt32();
    this.result = this.payload.readIString();
  }

  encode() {
    this.payload.writeInt32(this.evalId);
    this.payload.writeIString(this.result);
  }
}
