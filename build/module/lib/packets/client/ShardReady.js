import { ServerSession } from "../../util/Session";
import Packet from "../Packet";
export default class ShardReadyPacket extends Packet {
    constructor() {
        super(...arguments);
        this.id = 10102;
        this.shardIds = [];
    }
    encode() {
        this.payload.writeInt16(this.shardIds.length);
        for (const shardId of this.shardIds) {
            this.payload.writeInt16(shardId);
        }
    }
    decode() {
        const shardIdCount = this.payload.readInt16();
        for (let i = 0; i < shardIdCount; i++) {
            this.shardIds.push(this.payload.readInt16());
        }
    }
    processReceive() {
        if (this.session instanceof ServerSession) {
            this.session.ready = true;
        }
        // const handshakeOk = new HandshakeOkPacket();
        // this.session.sendPacket(handshakeOk);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhcmRSZWFkeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvcGFja2V0cy9jbGllbnQvU2hhcmRSZWFkeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFDO0FBRS9CLE1BQU0sQ0FBQyxPQUFPLE9BQU8sZ0JBQWlCLFNBQVEsTUFBTTtJQUFwRDs7UUFDRSxPQUFFLEdBQUcsS0FBSyxDQUFDO1FBQ1gsYUFBUSxHQUFhLEVBQUUsQ0FBQztJQXVCMUIsQ0FBQztJQXJCQyxNQUFNO1FBQ0osSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QyxLQUFLLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbEM7SUFDSCxDQUFDO0lBRUQsTUFBTTtRQUNKLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDOUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7U0FDOUM7SUFDSCxDQUFDO0lBRUQsY0FBYztRQUNaLElBQUksSUFBSSxDQUFDLE9BQU8sWUFBWSxhQUFhLEVBQUU7WUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1NBQzNCO1FBQ0QsK0NBQStDO1FBQy9DLHdDQUF3QztJQUMxQyxDQUFDO0NBQ0YifQ==