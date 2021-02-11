import Packet from "../Packet";
export default class BroadcastEvalResultPacket extends Packet {
    id: number;
    responses: any[];
    evalId: number;
    totalEvals: number;
    encode(): void;
    decode(): void;
    processReceive(): void;
}
