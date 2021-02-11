import Packet from "../Packet";
export default class HeartbeatAckPacket extends Packet {
    constructor() {
        super(...arguments);
        this.id = 20108;
    }
    processReceive() {
        this.session.lastHeartbeat = Date.now();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhcnRiZWF0QWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9wYWNrZXRzL3NlcnZlci9IZWFydGJlYXRBY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFDO0FBRS9CLE1BQU0sQ0FBQyxPQUFPLE9BQU8sa0JBQW1CLFNBQVEsTUFBTTtJQUF0RDs7UUFDRSxPQUFFLEdBQUcsS0FBSyxDQUFDO0lBS2IsQ0FBQztJQUhDLGNBQWM7UUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDMUMsQ0FBQztDQUNGIn0=