import Packet from "../Packet";
export default class ShardInfoPacket extends Packet {
    id: number;
    shardCount: number;
    shardIds: number[];
    decode(): void;
    encode(): void;
    processReceive(): void;
}
