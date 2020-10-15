import Packet from "../Packet";
import HandshakeOkPacket from "../server/HandshakeOk";

export default class HandshakePacket extends Packet {
  id = 10100;
  maxShardCount: number;

  encode() {
    this.payload.writeInt16(this.maxShardCount);
  }

  decode() {
    this.maxShardCount = this.payload.readInt16();
  }

  processReceive() {
    this.session.maxShardCount = this.maxShardCount;
    const handshakeOk = new HandshakeOkPacket();
    this.session.sendPacket(handshakeOk);
  }
}
