import { config as loadenv } from "dotenv";
import { ServerSession } from "../../util/Session";
import Packet from "../Packet";
import LoginFailedPacket from "../server/LoginFailed";
import LoginOkPacket from "../server/LoginOk";
loadenv();
export default class LoginPacket extends Packet {
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
        if (this.session instanceof ServerSession) {
            if (this.botToken === this.session.botToken) {
                if (this.session.server.connectedShardIds.length >=
                    this.session.server.options.shardCount) {
                    const loginFailed = new LoginFailedPacket();
                    loginFailed.code = 2;
                    loginFailed.message = "No more shards needed";
                    this.session.sendPacket(loginFailed);
                }
                else {
                    const loginOk = new LoginOkPacket();
                    this.session.loggedIn = true;
                    if (this.shardIds.length) {
                        this.session.shardIds = this.shardIds;
                    }
                    this.session.sendPacket(loginOk);
                }
            }
            else {
                const loginFailed = new LoginFailedPacket();
                loginFailed.code = 1;
                loginFailed.message = "Invalid token";
                this.session.sendPacket(loginFailed);
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3BhY2tldHMvY2xpZW50L0xvZ2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLElBQUksT0FBTyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLE1BQU0sTUFBTSxXQUFXLENBQUM7QUFDL0IsT0FBTyxpQkFBaUIsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RCxPQUFPLGFBQWEsTUFBTSxtQkFBbUIsQ0FBQztBQUU5QyxPQUFPLEVBQUUsQ0FBQztBQUVWLE1BQU0sQ0FBQyxPQUFPLE9BQU8sV0FBWSxTQUFRLE1BQU07SUFBL0M7O1FBRUUsYUFBUSxHQUFhLEVBQUUsQ0FBQztRQUN4QixPQUFFLEdBQUcsS0FBSyxDQUFDO0lBOENiLENBQUM7SUE1Q0MsTUFBTTtRQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlDLEtBQUssTUFBTSxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzNDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDOUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7U0FDOUM7SUFDSCxDQUFDO0lBRUQsY0FBYztRQUNaLElBQUksSUFBSSxDQUFDLE9BQU8sWUFBWSxhQUFhLEVBQUU7WUFDekMsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO2dCQUMzQyxJQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU07b0JBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQ3RDO29CQUNBLE1BQU0sV0FBVyxHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztvQkFDNUMsV0FBVyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7b0JBQ3JCLFdBQVcsQ0FBQyxPQUFPLEdBQUcsdUJBQXVCLENBQUM7b0JBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN0QztxQkFBTTtvQkFDTCxNQUFNLE9BQU8sR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO29CQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JBQzdCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7d0JBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7cUJBQ3ZDO29CQUNELElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNsQzthQUNGO2lCQUFNO2dCQUNMLE1BQU0sV0FBVyxHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztnQkFDNUMsV0FBVyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLFdBQVcsQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFDO2dCQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUN0QztTQUNGO0lBQ0gsQ0FBQztDQUNGIn0=