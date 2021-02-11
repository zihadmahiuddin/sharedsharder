import Packet from "../Packet";
export default class HeartbeatPacket extends Packet {
    id: number;
    processReceive(): void;
}
