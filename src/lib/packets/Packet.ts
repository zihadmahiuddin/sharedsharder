import ByteBuffer from "bytebuffer";

import { Session } from "../util/Session";

export default abstract class Packet {
  id: number;
  payload: ByteBuffer;
  session: Session;

  get isClientToServer() {
    return Packet.isClientToServer(this.id);
  }

  get isServerToClient() {
    return Packet.isServerToClient(this.id);
  }

  decode() {}

  encode() {}

  processSend() {}
  processReceive() {}

  static isClientToServer(id: number) {
    return id >= 10000 && id < 20000;
  }

  static isServerToClient(id: number) {
    return id >= 20000 && id < 30000;
  }
}
