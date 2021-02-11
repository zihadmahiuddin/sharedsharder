import nacl from "tweetnacl";
import { ClientSession, ServerSession } from "../../util/Session";
import LoginPacket from "../client/Login";
import Packet from "../Packet";
export default class HandshakeOkPacket extends Packet {
    constructor() {
        super(...arguments);
        this.id = 20100;
    }
    encode() {
        if (!this.session.sessionKey && this.session instanceof ServerSession) {
            this.session.sessionKey = Buffer.from(nacl.randomBytes(24));
        }
        this.payload.append(this.session.sessionKey);
    }
    processReceive() {
        if (this.session instanceof ClientSession) {
            const loginPacket = new LoginPacket();
            loginPacket.botToken = this.session.client.token;
            if (this.session.client.shardIds?.length) {
                loginPacket.shardIds = this.session.client.shardIds;
            }
            this.session.sendPacket(loginPacket);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZHNoYWtlT2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3BhY2tldHMvc2VydmVyL0hhbmRzaGFrZU9rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLFdBQVcsQ0FBQztBQUM3QixPQUFPLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xFLE9BQU8sV0FBVyxNQUFNLGlCQUFpQixDQUFDO0FBRTFDLE9BQU8sTUFBTSxNQUFNLFdBQVcsQ0FBQztBQUUvQixNQUFNLENBQUMsT0FBTyxPQUFPLGlCQUFrQixTQUFRLE1BQU07SUFBckQ7O1FBQ0UsT0FBRSxHQUFHLEtBQUssQ0FBQztJQW1CYixDQUFDO0lBakJDLE1BQU07UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLE9BQU8sWUFBWSxhQUFhLEVBQUU7WUFDckUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDN0Q7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxjQUFjO1FBQ1osSUFBSSxJQUFJLENBQUMsT0FBTyxZQUFZLGFBQWEsRUFBRTtZQUN6QyxNQUFNLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ3RDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRTtnQkFDeEMsV0FBVyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7YUFDckQ7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN0QztJQUNILENBQUM7Q0FDRiJ9