import { config as loadenv } from "dotenv";
import { ServerSession } from "../../util/Session";

import Packet from "../Packet";
import LoginFailedPacket from "../server/LoginFailed";
import LoginOkPacket from "../server/LoginOk";

loadenv();

export default class LoginPacket extends Packet {
  botToken: string;
  shardIds: number[] = [];
  id = 10101;

  encode() {
    this.payload.writeIString(this.botToken);
    this.payload.writeInt16(this.shardIds.length);
    for (const shardId of this.shardIds) {
      this.payload.writeInt16(shardId);
    }
  }

  decode() {
    this.botToken = this.payload.readIString();
    const shardIdCount = this.payload.readInt16();
    this.shardIds = [];
    for (let i = 0; i < shardIdCount; i++) {
      this.shardIds.push(this.payload.readInt16());
    }
  }

  processReceive() {
    if (this.session instanceof ServerSession) {
      if (this.botToken === this.session.botToken) {
        if (
          this.session.server.connectedShardIds.length >=
          this.session.server.options.shardCount
        ) {
          const loginFailed = new LoginFailedPacket();
          loginFailed.code = 2;
          loginFailed.message = "No more shards needed";
          this.session.sendPacket(loginFailed);
        } else {
          const loginOk = new LoginOkPacket();
          this.session.loggedIn = true;
          if (this.shardIds.length) {
            this.session.shardIds = this.shardIds;
          }
          this.session.sendPacket(loginOk);
        }
      } else {
        const loginFailed = new LoginFailedPacket();
        loginFailed.code = 1;
        loginFailed.message = "Invalid token";
        this.session.sendPacket(loginFailed);
      }
    }
  }
}
