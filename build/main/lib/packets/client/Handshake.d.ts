import Packet from "../Packet";
export default class HandshakePacket extends Packet {
    id: number;
    maxShardCount: number;
    encode(): void;
    decode(): void;
    processReceive(): void;
}
