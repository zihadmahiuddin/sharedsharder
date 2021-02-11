import Packet from "../Packet";
import HeartbeatAckPacket from "../server/HeartbeatAck";
export default class HeartbeatPacket extends Packet {
    constructor() {
        super(...arguments);
        this.id = 10108;
    }
    processReceive() {
        this.session.lastHeartbeat = Date.now();
        const heartbeatAck = new HeartbeatAckPacket();
        this.session.sendPacket(heartbeatAck);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhcnRiZWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9wYWNrZXRzL2NsaWVudC9IZWFydGJlYXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFDO0FBQy9CLE9BQU8sa0JBQWtCLE1BQU0sd0JBQXdCLENBQUM7QUFFeEQsTUFBTSxDQUFDLE9BQU8sT0FBTyxlQUFnQixTQUFRLE1BQU07SUFBbkQ7O1FBQ0UsT0FBRSxHQUFHLEtBQUssQ0FBQztJQU9iLENBQUM7SUFMQyxjQUFjO1FBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3hDLE1BQU0sWUFBWSxHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN4QyxDQUFDO0NBQ0YifQ==