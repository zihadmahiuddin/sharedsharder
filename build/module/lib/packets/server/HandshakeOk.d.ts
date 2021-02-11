import Packet from "../Packet";
export default class HandshakeOkPacket extends Packet {
    id: number;
    encode(): void;
    processReceive(): void;
}
