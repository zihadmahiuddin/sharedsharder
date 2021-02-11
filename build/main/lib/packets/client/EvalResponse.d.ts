import Packet from "../Packet";
export default class EvalResponsePacket extends Packet {
    id: number;
    result: string;
    evalId: number;
    decode(): void;
    encode(): void;
}
