"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Session_1 = require("../../util/Session");
const Packet_1 = __importDefault(require("../Packet"));
const BroadcastEvalResult_1 = __importDefault(require("../server/BroadcastEvalResult"));
const EvalRequest_1 = __importDefault(require("../server/EvalRequest"));
const EvalResponse_1 = __importDefault(require("./EvalResponse"));
class BroadcastEvalPacket extends Packet_1.default {
    constructor() {
        super(...arguments);
        this.id = 10106;
        /**
         * The amount of time to wait for response from all the shards, in milliseconds
         */
        this.timeout = 10000;
        /**
         * Code to execute on the other shards
         */
        this.code = "";
        this.responseSent = false;
        this.responses = [];
    }
    encode() {
        this.payload.writeInt32(this.timeout);
        this.payload.writeIString(this.code);
    }
    decode() {
        this.timeout = this.payload.readInt32();
        this.code = this.payload.readIString();
    }
    async processReceive() {
        if (this.session instanceof Session_1.ServerSession) {
            this.evalId = this.session.totalEvals++;
            const receivedAt = Date.now();
            let sessionCount = 0;
            const evalRequestPacket = new EvalRequest_1.default();
            evalRequestPacket.code = this.code;
            evalRequestPacket.evalId = this.evalId;
            const onResponse = (packet) => {
                if (packet instanceof EvalResponse_1.default) {
                    if (packet.evalId === this.evalId) {
                        this.responses.push(packet.result);
                        packet.session.off("packetReceived", onResponse);
                    }
                }
            };
            for (const session of this.session.server.sessions) {
                session.sendPacket(evalRequestPacket);
                session.on("packetReceived", onResponse);
                const interval = setInterval(() => {
                    if (this.responseSent ||
                        this.responses.length === sessionCount ||
                        Date.now() >= receivedAt + this.timeout) {
                        clearInterval(interval);
                        session.off("packetReceived", onResponse);
                    }
                }, this.timeout);
                sessionCount++;
            }
            const responseInterval = setInterval(() => {
                if (!this.responseSent) {
                    if (this.responses.length === sessionCount ||
                        Date.now() >= receivedAt + this.timeout) {
                        const broadcastEvalResultPacket = new BroadcastEvalResult_1.default();
                        broadcastEvalResultPacket.evalId = this.evalId;
                        broadcastEvalResultPacket.responses = this.responses;
                        broadcastEvalResultPacket.totalEvals = this.session.totalEvals;
                        this.session.sendPacket(broadcastEvalResultPacket);
                        this.responseSent = true;
                        clearInterval(responseInterval);
                    }
                }
            }, 100);
        }
    }
}
exports.default = BroadcastEvalPacket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnJvYWRjYXN0RXZhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvcGFja2V0cy9jbGllbnQvQnJvYWRjYXN0RXZhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUFtRDtBQUNuRCx1REFBK0I7QUFDL0Isd0ZBQXNFO0FBQ3RFLHdFQUFzRDtBQUN0RCxrRUFBZ0Q7QUFFaEQsTUFBcUIsbUJBQW9CLFNBQVEsZ0JBQU07SUFBdkQ7O1FBQ0UsT0FBRSxHQUFHLEtBQUssQ0FBQztRQUVYOztXQUVHO1FBQ0gsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUVoQjs7V0FFRztRQUNILFNBQUksR0FBRyxFQUFFLENBQUM7UUFFVixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQixjQUFTLEdBQWEsRUFBRSxDQUFDO0lBK0QzQixDQUFDO0lBM0RDLE1BQU07UUFDSixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsS0FBSyxDQUFDLGNBQWM7UUFDbEIsSUFBSSxJQUFJLENBQUMsT0FBTyxZQUFZLHVCQUFhLEVBQUU7WUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3hDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUM5QixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7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