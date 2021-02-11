import Packet from "../Packet";
export default class LoginFailedPacket extends Packet {
    id: number;
    code: number;
    message: string;
    decode(): void;
    encode(): void;
    processReceive(): void;
}
