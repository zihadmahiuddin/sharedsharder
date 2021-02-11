"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Session_1 = require("../../util/Session");
const Packet_1 = __importDefault(require("../Packet"));
class ShardReadyPacket extends Packet_1.default {
    constructor() {
        super(...arguments);
        this.id = 10102;
        this.shardIds = [];
    }
    encode() {
        this.payload.writeInt16(this.shardIds.length);
        for (const shardId of this.shardIds) {
            this.payload.writeInt16(shardId);
        }
    }
    decode() {
        const shardIdCount = this.payload.readInt16();
        for (let i = 0; i < shardIdCount; i++) {
            this.shardIds.push(this.payload.readInt16());
        }
    }
    processReceive() {
        if (this.session instanceof Session_1.ServerSession) {
            this.session.ready = true;
        }
        // const handshakeOk = new HandshakeOkPacket();
        // this.session.sendPacket(handshakeOk);
    }
}
exports.default = ShardReadyPacket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhcmRSZWFkeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvcGFja2V0cy9jbGllbnQvU2hhcmRSZWFkeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUFtRDtBQUNuRCx1REFBK0I7QUFFL0IsTUFBcUIsZ0JBQWlCLFNBQVEsZ0JBQU07SUFBcEQ7O1FBQ0UsT0FBRSxHQUFHLEtBQUssQ0FBQztRQUNYLGFBQVEsR0FBYSxFQUFFLENBQUM7SUF1QjFCLENBQUM7SUFyQkMsTUFBTTtRQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQztJQUVELE1BQU07UUFDSixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzlDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1NBQzlDO0lBQ0gsQ0FBQztJQUVELGNBQWM7UUFDWixJQUFJLElBQUksQ0FBQyxPQUFPLFlBQVksdUJBQWEsRUFBRTtZQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7U0FDM0I7UUFDRCwrQ0FBK0M7UUFDL0Msd0NBQXdDO0lBQzFDLENBQUM7Q0FDRjtBQXpCRCxtQ0F5QkMifQ==