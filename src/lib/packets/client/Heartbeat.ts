import Packet from "../Packet";
import HeartbeatAckPacket from "../server/HeartbeatAck";

export default class HeartbeatPacket extends Packet {
  id = 10108;

  processReceive() {
    this.session.lastHeartbeat = Date.now();
    const heartbeatAck = new HeartbeatAckPacket();
    this.session.sendPacket(heartbeatAck);
  }
}
