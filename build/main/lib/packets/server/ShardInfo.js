"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Session_1 = require("../../util/Session");
const Packet_1 = __importDefault(require("../Packet"));
class ShardInfoPacket extends Packet_1.default {
    constructor() {
        super(...arguments);
        this.id = 20105;
    }
    decode() {
        this.shardCount = this.payload.readInt16();
        this.shardIds = [];
        const shardIdCount = this.payload.readInt16();
        for (let i = 0; i < shardIdCount; i++) {
            this.shardIds.push(this.payload.readInt16());
        }
    }
    encode() {
        this.payload.writeInt16(this.shardCount);
        this.payload.writeInt16(this.shardIds.length);
        for (const shardId of this.shardIds) {
            this.payload.writeInt16(shardId);
        }
    }
    processReceive() {
        if (this.session instanceof Session_1.ClientSession) {
            this.session.client.shardCount = this.shardCount;
            this.session.client.shardIds = this.shardIds;
            this.session.client.emit("shardInfo", [this.shardCount, this.shardIds]);
        }
    }
}
exports.default = ShardInfoPacket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhcmRJbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9wYWNrZXRzL3NlcnZlci9TaGFyZEluZm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBbUQ7QUFDbkQsdURBQStCO0FBRS9CLE1BQXFCLGVBQWdCLFNBQVEsZ0JBQU07SUFBbkQ7O1FBQ0UsT0FBRSxHQUFHLEtBQUssQ0FBQztJQTRCYixDQUFDO0lBeEJDLE1BQU07UUFDSixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztTQUM5QztJQUNILENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQztJQUVELGNBQWM7UUFDWixJQUFJLElBQUksQ0FBQyxPQUFPLFlBQVksdUJBQWEsRUFBRTtZQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNqRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUN6RTtJQUNILENBQUM7Q0FDRjtBQTdCRCxrQ0E2QkMifQ==