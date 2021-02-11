"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = __importDefault(require("../Packet"));
class EvalResponsePacket extends Packet_1.default {
    constructor() {
        super(...arguments);
        this.id = 10107;
        this.result = "";
    }
    decode() {
        this.evalId = this.payload.readInt32();
        this.result = this.payload.readIString();
    }
    encode() {
        this.payload.writeInt32(this.evalId);
        this.payload.writeIString(this.result);
    }
}
exports.default = EvalResponsePacket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhbFJlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9wYWNrZXRzL2NsaWVudC9FdmFsUmVzcG9uc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1REFBK0I7QUFFL0IsTUFBcUIsa0JBQW1CLFNBQVEsZ0JBQU07SUFBdEQ7O1FBQ0UsT0FBRSxHQUFHLEtBQUssQ0FBQztRQUVYLFdBQU0sR0FBRyxFQUFFLENBQUM7SUFhZCxDQUFDO0lBVEMsTUFBTTtRQUNKLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Q0FDRjtBQWhCRCxxQ0FnQkMifQ==