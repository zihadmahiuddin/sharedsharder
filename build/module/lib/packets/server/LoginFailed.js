import Logger from "../../util/Logger";
import Packet from "../Packet";
export default class LoginFailedPacket extends Packet {
    constructor() {
        super(...arguments);
        this.id = 20103;
    }
    decode() {
        this.code = this.payload.readByte();
        this.message = this.payload.readIString();
    }
    encode() {
        this.payload.writeByte(this.code);
        this.payload.writeIString(this.message);
    }
    processReceive() {
        Logger.error(`Login Failed: ${this.code}${this.message ? `, ${this.message}` : ""}`);
        if (this.code === 2) {
            process.exit(0);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW5GYWlsZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3BhY2tldHMvc2VydmVyL0xvZ2luRmFpbGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sTUFBTSxNQUFNLG1CQUFtQixDQUFDO0FBQ3ZDLE9BQU8sTUFBTSxNQUFNLFdBQVcsQ0FBQztBQUUvQixNQUFNLENBQUMsT0FBTyxPQUFPLGlCQUFrQixTQUFRLE1BQU07SUFBckQ7O1FBQ0UsT0FBRSxHQUFHLEtBQUssQ0FBQztJQXVCYixDQUFDO0lBbEJDLE1BQU07UUFDSixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzVDLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsY0FBYztRQUNaLE1BQU0sQ0FBQyxLQUFLLENBQ1YsaUJBQWlCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUN2RSxDQUFDO1FBQ0YsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtZQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztDQUNGIn0=