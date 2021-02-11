import Packet from "../Packet";
export default class HeartbeatAckPacket extends Packet {
    id: number;
    processReceive(): void;
}
