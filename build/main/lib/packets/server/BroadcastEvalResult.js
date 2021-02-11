"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flatted_1 = __importDefault(require("flatted"));
const Session_1 = require("../../util/Session");
const Packet_1 = __importDefault(require("../Packet"));
class BroadcastEvalResultPacket extends Packet_1.default {
    constructor() {
        super(...arguments);
        this.id = 20106;
        this.responses = [];
    }
    encode() {
        this.payload.writeInt16(this.evalId);
        this.payload.writeInt16(this.totalEvals);
        this.payload.writeInt16(this.responses.length);
        for (const response of this.responses) {
            this.payload.writeIString(response);
        }
    }
    decode() {
        this.evalId = this.payload.readInt16();
        this.totalEvals = this.payload.readInt16();
        if (this.session instanceof Session_1.ClientSession) {
            this.session.totalEvals = this.totalEvals;
        }
        const responseCount = this.payload.readInt16();
        for (let i = 0; i < responseCount; i++) {
            this.responses.push(flatted_1.default.parse(this.payload.readIString()));
        }
    }
    processReceive() { }
}
exports.default = BroadcastEvalResultPacket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnJvYWRjYXN0RXZhbFJlc3VsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvcGFja2V0cy9zZXJ2ZXIvQnJvYWRjYXN0RXZhbFJlc3VsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUE4QjtBQUU5QixnREFBbUQ7QUFDbkQsdURBQStCO0FBRS9CLE1BQXFCLHlCQUEwQixTQUFRLGdCQUFNO0lBQTdEOztRQUNFLE9BQUUsR0FBRyxLQUFLLENBQUM7UUFFWCxjQUFTLEdBQVUsRUFBRSxDQUFDO0lBMkJ4QixDQUFDO0lBdEJDLE1BQU07UUFDSixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsS0FBSyxNQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzNDLElBQUksSUFBSSxDQUFDLE9BQU8sWUFBWSx1QkFBYSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDM0M7UUFDRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQy9DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsaUJBQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDaEU7SUFDSCxDQUFDO0lBRUQsY0FBYyxLQUFJLENBQUM7Q0FDcEI7QUE5QkQsNENBOEJDIn0=