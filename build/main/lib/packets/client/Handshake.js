"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = __importDefault(require("../Packet"));
const HandshakeOk_1 = __importDefault(require("../server/HandshakeOk"));
class HandshakePacket extends Packet_1.default {
    constructor() {
        super(...arguments);
        this.id = 10100;
    }
    encode() {
        this.payload.writeInt16(this.maxShardCount);
    }
    decode() {
        this.maxShardCount = this.payload.readInt16();
    }
    processReceive() {
        this.session.maxShardCount = this.maxShardCount;
        const handshakeOk = new HandshakeOk_1.default();
        this.session.sendPacket(handshakeOk);
    }
}
exports.default = HandshakePacket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZHNoYWtlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9wYWNrZXRzL2NsaWVudC9IYW5kc2hha2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1REFBK0I7QUFDL0Isd0VBQXNEO0FBRXRELE1BQXFCLGVBQWdCLFNBQVEsZ0JBQU07SUFBbkQ7O1FBQ0UsT0FBRSxHQUFHLEtBQUssQ0FBQztJQWdCYixDQUFDO0lBYkMsTUFBTTtRQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBRUQsY0FBYztRQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDaEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxxQkFBaUIsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Q0FDRjtBQWpCRCxrQ0FpQkMifQ==