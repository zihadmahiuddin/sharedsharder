import Logger from "../../util/Logger";
import Packet from "../Packet";
export default class DisconnectPacket extends Packet {
    constructor() {
        super(...arguments);
        this.id = 20109;
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
        Logger.error(`Disconnected: ${this.code}${this.message ? `, ${this.message}` : ""}`);
        if (this.code === 2) {
            process.exit(0);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzY29ubmVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvcGFja2V0cy9zZXJ2ZXIvRGlzY29ubmVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLE1BQU0sTUFBTSxtQkFBbUIsQ0FBQztBQUN2QyxPQUFPLE1BQU0sTUFBTSxXQUFXLENBQUM7QUFFL0IsTUFBTSxDQUFDLE9BQU8sT0FBTyxnQkFBaUIsU0FBUSxNQUFNO0lBQXBEOztRQUNFLE9BQUUsR0FBRyxLQUFLLENBQUM7SUF1QmIsQ0FBQztJQWxCQyxNQUFNO1FBQ0osSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELGNBQWM7UUFDWixNQUFNLENBQUMsS0FBSyxDQUNWLGlCQUFpQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FDdkUsQ0FBQztRQUNGLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7WUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqQjtJQUNILENBQUM7Q0FDRiJ9