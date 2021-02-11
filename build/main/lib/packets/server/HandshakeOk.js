"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const Session_1 = require("../../util/Session");
const Login_1 = __importDefault(require("../client/Login"));
const Packet_1 = __importDefault(require("../Packet"));
class HandshakeOkPacket extends Packet_1.default {
    constructor() {
        super(...arguments);
        this.id = 20100;
    }
    encode() {
        if (!this.session.sessionKey && this.session instanceof Session_1.ServerSession) {
            this.session.sessionKey = Buffer.from(tweetnacl_1.default.randomBytes(24));
        }
        this.payload.append(this.session.sessionKey);
    }
    processReceive() {
        var _a;
        if (this.session instanceof Session_1.ClientSession) {
            const loginPacket = new Login_1.default();
            loginPacket.botToken = this.session.client.token;
            if ((_a = this.session.client.shardIds) === null || _a === void 0 ? void 0 : _a.length) {
                loginPacket.shardIds = this.session.client.shardIds;
            }
            this.session.sendPacket(loginPacket);
        }
    }
}
exports.default = HandshakeOkPacket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZHNoYWtlT2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3BhY2tldHMvc2VydmVyL0hhbmRzaGFrZU9rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMERBQTZCO0FBQzdCLGdEQUFrRTtBQUNsRSw0REFBMEM7QUFFMUMsdURBQStCO0FBRS9CLE1BQXFCLGlCQUFrQixTQUFRLGdCQUFNO0lBQXJEOztRQUNFLE9BQUUsR0FBRyxLQUFLLENBQUM7SUFtQmIsQ0FBQztJQWpCQyxNQUFNO1FBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxPQUFPLFlBQVksdUJBQWEsRUFBRTtZQUNyRSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDN0Q7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxjQUFjOztRQUNaLElBQUksSUFBSSxDQUFDLE9BQU8sWUFBWSx1QkFBYSxFQUFFO1lBQ3pDLE1BQU0sV0FBVyxHQUFHLElBQUksZUFBVyxFQUFFLENBQUM7WUFDdEMsV0FBVyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakQsVUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLDBDQUFFLE1BQU0sRUFBRTtnQkFDeEMsV0FBVyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7YUFDckQ7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN0QztJQUNILENBQUM7Q0FDRjtBQXBCRCxvQ0FvQkMifQ==