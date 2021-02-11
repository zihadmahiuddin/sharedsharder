import Packet from "../Packet";
export default class BroadcastEvalPacket extends Packet {
    id: number;
    /**
     * The amount of time to wait for response from all the shards, in milliseconds
     */
    timeout: number;
    /**
     * Code to execute on the other shards
     */
    code: string;
    responseSent: boolean;
    responses: string[];
    evalId: number;
    encode(): void;
    decode(): void;
    processReceive(): Promise<void>;
}
