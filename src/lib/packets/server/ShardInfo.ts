import { ClientSession } from "../../util/Session";
import Packet from "../Packet";

export default class ShardInfoPacket extends Packet {
  id = 20105;
  shardCount: number;
  shardIds: number[];

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
    console.log(
      `Shard Info Received: ${this.shardCount} - [${this.shardIds.join(", ")}]`
    );
    if (this.session instanceof ClientSession) {
      this.session.client.shardCount = this.shardCount;
      this.session.client.shardIds = this.shardIds;
      this.session.client.emit("shardInfo", [this.shardCount, this.shardIds]);
    }
  }
}
