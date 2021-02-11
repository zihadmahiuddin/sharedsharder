import Packet from "../Packet";
import HandshakeOkPacket from "../server/HandshakeOk";
export default class HandshakePacket extends Packet {
    constructor() {
        super(...arguments);
        this.id = 10100;
    }
    encode() {
        this.payload.writeInt16(this.maxShardCount);
    }
    decode() {
        this.maxShardCount = this.payload.readInt16();
    }
    processReceive() {
        this.session.maxShardCount = this.maxShardCount;
        const handshakeOk = new HandshakeOkPacket();
        this.session.sendPacket(handshakeOk);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZHNoYWtlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9wYWNrZXRzL2NsaWVudC9IYW5kc2hha2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFDO0FBQy9CLE9BQU8saUJBQWlCLE1BQU0sdUJBQXVCLENBQUM7QUFFdEQsTUFBTSxDQUFDLE9BQU8sT0FBTyxlQUFnQixTQUFRLE1BQU07SUFBbkQ7O1FBQ0UsT0FBRSxHQUFHLEtBQUssQ0FBQztJQWdCYixDQUFDO0lBYkMsTUFBTTtRQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBRUQsY0FBYztRQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDaEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Q0FDRiJ9