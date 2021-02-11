import { ServerSession } from "../../util/Session";
import Packet from "../Packet";
import BroadcastEvalResultPacket from "../server/BroadcastEvalResult";
import EvalRequestPacket from "../server/EvalRequest";
import EvalResponsePacket from "./EvalResponse";
export default class BroadcastEvalPacket extends Packet {
    constructor() {
        super(...arguments);
        this.id = 10106;
        /**
         * The amount of time to wait for response from all the shards, in milliseconds
         */
        this.timeout = 10000;
        /**
         * Code to execute on the other shards
         */
        this.code = "";
        this.responseSent = false;
        this.responses = [];
    }
    encode() {
        this.payload.writeInt32(this.timeout);
        this.payload.writeIString(this.code);
    }
    decode() {
        this.timeout = this.payload.readInt32();
        this.code = this.payload.readIString();
    }
    async processReceive() {
        if (this.session instanceof ServerSession) {
            this.evalId = this.session.totalEvals++;
            const receivedAt = Date.now();
            let sessionCount = 0;
            const evalRequestPacket = new EvalRequestPacket();
            evalRequestPacket.code = this.code;
            evalRequestPacket.evalId = this.evalId;
            const onResponse = (packet) => {
                if (packet instanceof EvalResponsePacket) {
                    if (packet.evalId === this.evalId) {
                        this.responses.push(packet.result);
                        packet.session.off("packetReceived", onResponse);
                    }
                }
            };
            for (const session of this.session.server.sessions) {
                session.sendPacket(evalRequestPacket);
                session.on("packetReceived", onResponse);
                const interval = setInterval(() => {
                    if (this.responseSent ||
                        this.responses.length === sessionCount ||
                        Date.now() >= receivedAt + this.timeout) {
                        clearInterval(interval);
                        session.off("packetReceived", onResponse);
                    }
                }, this.timeout);
                sessionCount++;
            }
            const responseInterval = setInterval(() => {
                if (!this.responseSent) {
                    if (this.responses.length === sessionCount ||
                        Date.now() >= receivedAt + this.timeout) {
                        const broadcastEvalResultPacket = new BroadcastEvalResultPacket();
                        broadcastEvalResultPacket.evalId = this.evalId;
                        broadcastEvalResultPacket.responses = this.responses;
                        broadcastEvalResultPacket.totalEvals = this.session.totalEvals;
                        this.session.sendPacket(broadcastEvalResultPacket);
                        this.responseSent = true;
                        clearInterval(responseInterval);
                    }
                }
            }, 100);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnJvYWRjYXN0RXZhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvcGFja2V0cy9jbGllbnQvQnJvYWRjYXN0RXZhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxNQUFNLE1BQU0sV0FBVyxDQUFDO0FBQy9CLE9BQU8seUJBQXlCLE1BQU0sK0JBQStCLENBQUM7QUFDdEUsT0FBTyxpQkFBaUIsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RCxPQUFPLGtCQUFrQixNQUFNLGdCQUFnQixDQUFDO0FBRWhELE1BQU0sQ0FBQyxPQUFPLE9BQU8sbUJBQW9CLFNBQVEsTUFBTTtJQUF2RDs7UUFDRSxPQUFFLEdBQUcsS0FBSyxDQUFDO1FBRVg7O1dBRUc7UUFDSCxZQUFPLEdBQUcsS0FBSyxDQUFDO1FBRWhCOztXQUVHO1FBQ0gsU0FBSSxHQUFHLEVBQUUsQ0FBQztRQUVWLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLGNBQVMsR0FBYSxFQUFFLENBQUM7SUErRDNCLENBQUM7SUEzREMsTUFBTTtRQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFRCxLQUFLLENBQUMsY0FBYztRQUNsQixJQUFJLElBQUksQ0FBQyxPQUFPLFlBQVksYUFBYSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxN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