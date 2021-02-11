import Packet from "../Packet";
export default class ShardReadyPacket extends Packet {
    id: number;
    shardIds: number[];
    encode(): void;
    decode(): void;
    processReceive(): void;
}
