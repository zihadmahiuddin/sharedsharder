import flatted from "flatted";
import { ClientSession } from "../../util/Session";
import EvalResponsePacket from "../client/EvalResponse";
import Packet from "../Packet";
export default class EvalRequestPacket extends Packet {
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
        if (this.session instanceof ClientSession) {
            const result = flatted.stringify(await this.session.client.__eval(this.code));
            const evalResponsePacket = new EvalResponsePacket();
            evalResponsePacket.evalId = this.evalId;
            evalResponsePacket.result = result;
            this.session.sendPacket(evalResponsePacket);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhbFJlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3BhY2tldHMvc2VydmVyL0V2YWxSZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sT0FBTyxNQUFNLFNBQVMsQ0FBQztBQUU5QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxrQkFBa0IsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RCxPQUFPLE1BQU0sTUFBTSxXQUFXLENBQUM7QUFFL0IsTUFBTSxDQUFDLE9BQU8sT0FBTyxpQkFBa0IsU0FBUSxNQUFNO0lBQXJEOztRQUNFLE9BQUUsR0FBRyxLQUFLLENBQUM7UUFFWCxTQUFJLEdBQUcsRUFBRSxDQUFDO0lBeUJaLENBQUM7SUFyQkMsTUFBTTtRQUNKLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxLQUFLLENBQUMsY0FBYztRQUNsQixJQUFJLElBQUksQ0FBQyxPQUFPLFlBQVksYUFBYSxFQUFFO1lBQ3pDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQzlCLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDNUMsQ0FBQztZQUNGLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1lBQ3BELGtCQUFrQixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3hDLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUM3QztJQUNILENBQUM7Q0FDRiJ9