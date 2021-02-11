"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../../util/Logger"));
const Packet_1 = __importDefault(require("../Packet"));
class DisconnectPacket extends Packet_1.default {
    constructor() {
        super(...arguments);
        this.id = 20109;
    }
    decode() {
        this.code = this.payload.readByte();
        this.message = this.payload.readIString();
    }
    encode() {
        this.payload.writeByte(this.code);
        this.payload.writeIString(this.message);
    }
    processReceive() {
        Logger_1.default.error(`Disconnected: ${this.code}${this.message ? `, ${this.message}` : ""}`);
        if (this.code === 2) {
            process.exit(0);
        }
    }
}
exports.default = DisconnectPacket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzY29ubmVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvcGFja2V0cy9zZXJ2ZXIvRGlzY29ubmVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLCtEQUF1QztBQUN2Qyx1REFBK0I7QUFFL0IsTUFBcUIsZ0JBQWlCLFNBQVEsZ0JBQU07SUFBcEQ7O1FBQ0UsT0FBRSxHQUFHLEtBQUssQ0FBQztJQXVCYixDQUFDO0lBbEJDLE1BQU07UUFDSixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzVDLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsY0FBYztRQUNaLGdCQUFNLENBQUMsS0FBSyxDQUNWLGlCQUFpQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FDdkUsQ0FBQztRQUNGLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7WUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqQjtJQUNILENBQUM7Q0FDRjtBQXhCRCxtQ0F3QkMifQ==