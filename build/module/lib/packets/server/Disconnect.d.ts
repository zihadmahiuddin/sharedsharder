import Packet from "../Packet";
export default class DisconnectPacket extends Packet {
    id: number;
    code: number;
    message: string;
    decode(): void;
    encode(): void;
    processReceive(): void;
}
