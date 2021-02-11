import Packet from "../Packet";
export default class LoginPacket extends Packet {
    botToken: string;
    shardIds: number[];
    id: number;
    encode(): void;
    decode(): void;
    processReceive(): void;
}
