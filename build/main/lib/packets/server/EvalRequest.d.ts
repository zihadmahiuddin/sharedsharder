import Packet from "../Packet";
export default class EvalRequestPacket extends Packet {
    id: number;
    code: string;
    evalId: number;
    decode(): void;
    encode(): void;
    processReceive(): Promise<void>;
}
