import Packet from "../Packet";
export default class EvalResponsePacket extends Packet {
    constructor() {
        super(...arguments);
        this.id = 10107;
        this.result = "";
    }
    decode() {
        this.evalId = this.payload.readInt32();
        this.result = this.payload.readIString();
    }
    encode() {
        this.payload.writeInt32(this.evalId);
        this.payload.writeIString(this.result);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZhbFJlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9wYWNrZXRzL2NsaWVudC9FdmFsUmVzcG9uc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFDO0FBRS9CLE1BQU0sQ0FBQyxPQUFPLE9BQU8sa0JBQW1CLFNBQVEsTUFBTTtJQUF0RDs7UUFDRSxPQUFFLEdBQUcsS0FBSyxDQUFDO1FBRVgsV0FBTSxHQUFHLEVBQUUsQ0FBQztJQWFkLENBQUM7SUFUQyxNQUFNO1FBQ0osSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekMsQ0FBQztDQUNGIn0=