"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const Session_1 = require("../../util/Session");
const Packet_1 = __importDefault(require("../Packet"));
const LoginFailed_1 = __importDefault(require("../server/LoginFailed"));
const LoginOk_1 = __importDefault(require("../server/LoginOk"));
dotenv_1.config();
class LoginPacket extends Packet_1.default {
    constructor() {
        super(...arguments);
        this.shardIds = [];
        this.id = 10101;
    }
    encode() {
        this.payload.writeIString(this.botToken);
        this.payload.writeInt16(this.shardIds.length);
        for (const shardId of this.shardIds) {
            this.payload.writeInt16(shardId);
        }
    }
    decode() {
        this.botToken = this.payload.readIString();
        const shardIdCount = this.payload.readInt16();
        this.shardIds = [];
        for (let i = 0; i < shardIdCount; i++) {
            this.shardIds.push(this.payload.readInt16());
        }
    }
    processReceive() {
        if (this.session instanceof Session_1.ServerSession) {
            if (this.botToken === this.session.botToken) {
                if (this.session.server.connectedShardIds.length >=
                    this.session.server.options.shardCount) {
                    const loginFailed = new LoginFailed_1.default();
                    loginFailed.code = 2;
                    loginFailed.message = "No more shards needed";
                    this.session.sendPacket(loginFailed);
                }
                else {
                    const loginOk = new LoginOk_1.default();
                    this.session.loggedIn = true;
                    if (this.shardIds.length) {
                        this.session.shardIds = this.shardIds;
                    }
                    this.session.sendPacket(loginOk);
                }
            }
            else {
                const loginFailed = new LoginFailed_1.default();
                loginFailed.code = 1;
                loginFailed.message = "Invalid token";
                this.session.sendPacket(loginFailed);
            }
        }
    }
}
exports.default = LoginPacket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3BhY2tldHMvY2xpZW50L0xvZ2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUNBQTJDO0FBQzNDLGdEQUFtRDtBQUVuRCx1REFBK0I7QUFDL0Isd0VBQXNEO0FBQ3RELGdFQUE4QztBQUU5QyxlQUFPLEVBQUUsQ0FBQztBQUVWLE1BQXFCLFdBQVksU0FBUSxnQkFBTTtJQUEvQzs7UUFFRSxhQUFRLEdBQWEsRUFBRSxDQUFDO1FBQ3hCLE9BQUUsR0FBRyxLQUFLLENBQUM7SUE4Q2IsQ0FBQztJQTVDQyxNQUFNO1FBQ0osSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDM0MsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM5QyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztTQUM5QztJQUNILENBQUM7SUFFRCxjQUFjO1FBQ1osSUFBSSxJQUFJLENBQUMsT0FBTyxZQUFZLHVCQUFhLEVBQUU7WUFDekMsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO2dCQUMzQyxJQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU07b0JBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQ3RDO29CQUNBLE1BQU0sV0FBVyxHQUFHLElBQUkscUJBQWlCLEVBQUUsQ0FBQztvQkFDNUMsV0FBVyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7b0JBQ3JCLFdBQVcsQ0FBQyxPQUFPLEdBQUcsdUJBQXVCLENBQUM7b0JBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN0QztxQkFBTTtvQkFDTCxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFhLEVBQUUsQ0FBQztvQkFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO29CQUM3QixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO3dCQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO3FCQUN2QztvQkFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDbEM7YUFDRjtpQkFBTTtnQkFDTCxNQUFNLFdBQVcsR0FBRyxJQUFJLHFCQUFpQixFQUFFLENBQUM7Z0JBQzVDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUNyQixXQUFXLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDdEM7U0FDRjtJQUNILENBQUM7Q0FDRjtBQWpERCw4QkFpREMifQ==