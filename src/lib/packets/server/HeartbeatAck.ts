import Packet from "../Packet";

export default class HeartbeatAckPacket extends Packet {
  id = 20108;

  processReceive() {
    this.session.lastHeartbeat = Date.now();
  }
}
