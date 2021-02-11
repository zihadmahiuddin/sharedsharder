import ByteBuffer from "bytebuffer";
import { Session } from "../util/Session";
export default abstract class Packet {
    id: number;
    payload: ByteBuffer;
    session: Session;
    get isClientToServer(): boolean;
    get isServerToClient(): boolean;
    decode(): void;
    encode(): void;
    processSend(): void;
    processReceive(): void;
    static isClientToServer(id: number): boolean;
    static isServerToClient(id: number): boolean;
}
