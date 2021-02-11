"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flatted_1 = __importDefault(require("flatted"));
const Session_1 = require("../../util/Session");
const EvalResponse_1 = __importDefault(require("../client/EvalResponse"));
const Packet_1 = __importDefault(require("../Packet"));
class EvalRequestPacket extends Packet_1.default {
    constructor() {
        super(...arguments);
        this.id = 20107;
        this.code = "";
    }
    decode() {
        this.evalId = this.payload.readInt32();
        this.code = this.payload.readIString();
    }
    encode() {
        this.payload.writeInt32(this.evalId);
        this.payload.writeIString(this.code);
    }
    async processReceive() {
        if (this.session instanceof Session_1.ClientSession) {
            const result = flatted_1.default.stringify(await this.session.client.__eval(this.code));
            const evalResponsePacket = new EvalResponse_1.default();
            evalResponsePacket.evalId = this.evalId;
            evalResponsePacket.result = result;
            this.session.sendPacket(evalResponsePacket);
        }
    }
}
exports.default = EvalRequestPacket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhbFJlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3BhY2tldHMvc2VydmVyL0V2YWxSZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBRTlCLGdEQUFtRDtBQUNuRCwwRUFBd0Q7QUFDeEQsdURBQStCO0FBRS9CLE1BQXFCLGlCQUFrQixTQUFRLGdCQUFNO0lBQXJEOztRQUNFLE9BQUUsR0FBRyxLQUFLLENBQUM7UUFFWCxTQUFJLEdBQUcsRUFBRSxDQUFDO0lBeUJaLENBQUM7SUFyQkMsTUFBTTtRQUNKLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxLQUFLLENBQUMsY0FBYztRQUNsQixJQUFJLElBQUksQ0FBQyxPQUFPLFlBQVksdUJBQWEsRUFBRTtZQUN6QyxNQUFNLE1BQU0sR0FBRyxpQkFBTyxDQUFDLFNBQVMsQ0FDOUIsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUM1QyxDQUFDO1lBQ0YsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLHNCQUFrQixFQUFFLENBQUM7WUFDcEQsa0JBQWtCLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDeEMsa0JBQWtCLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1NBQzdDO0lBQ0gsQ0FBQztDQUNGO0FBNUJELG9DQTRCQyJ9