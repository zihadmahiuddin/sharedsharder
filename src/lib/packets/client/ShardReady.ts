import { ServerSession } from "../../util/Session";
import Packet from "../Packet";

export default class ShardReadyPacket extends Packet {
  id = 10102;
  shardIds: number[] = [];

  encode() {
    this.payload.writeInt16(this.shardIds.length);
    for (const shardId of this.shardIds) {
      this.payload.writeInt16(shardId);
    }
  }

  decode() {
    const shardIdCount = this.payload.readInt16();
    for (let i = 0; i < shardIdCount; i++) {
      this.shardIds.push(this.payload.readInt16());
    }
  }

  processReceive() {
    if (this.session instanceof ServerSession) {
      this.session.ready = true;
    }
    // const handshakeOk = new HandshakeOkPacket();
    // this.session.sendPacket(handshakeOk);
  }
}
