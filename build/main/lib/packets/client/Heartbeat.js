"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = __importDefault(require("../Packet"));
const HeartbeatAck_1 = __importDefault(require("../server/HeartbeatAck"));
class HeartbeatPacket extends Packet_1.default {
    constructor() {
        super(...arguments);
        this.id = 10108;
    }
    processReceive() {
        this.session.lastHeartbeat = Date.now();
        const heartbeatAck = new HeartbeatAck_1.default();
        this.session.sendPacket(heartbeatAck);
    }
}
exports.default = HeartbeatPacket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhcnRiZWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9wYWNrZXRzL2NsaWVudC9IZWFydGJlYXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1REFBK0I7QUFDL0IsMEVBQXdEO0FBRXhELE1BQXFCLGVBQWdCLFNBQVEsZ0JBQU07SUFBbkQ7O1FBQ0UsT0FBRSxHQUFHLEtBQUssQ0FBQztJQU9iLENBQUM7SUFMQyxjQUFjO1FBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3hDLE1BQU0sWUFBWSxHQUFHLElBQUksc0JBQWtCLEVBQUUsQ0FBQztRQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN4QyxDQUFDO0NBQ0Y7QUFSRCxrQ0FRQyJ9