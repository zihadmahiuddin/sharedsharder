"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = __importDefault(require("../Packet"));
class HeartbeatAckPacket extends Packet_1.default {
    constructor() {
        super(...arguments);
        this.id = 20108;
    }
    processReceive() {
        this.session.lastHeartbeat = Date.now();
    }
}
exports.default = HeartbeatAckPacket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhcnRiZWF0QWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9wYWNrZXRzL3NlcnZlci9IZWFydGJlYXRBY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1REFBK0I7QUFFL0IsTUFBcUIsa0JBQW1CLFNBQVEsZ0JBQU07SUFBdEQ7O1FBQ0UsT0FBRSxHQUFHLEtBQUssQ0FBQztJQUtiLENBQUM7SUFIQyxjQUFjO1FBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQzFDLENBQUM7Q0FDRjtBQU5ELHFDQU1DIn0=