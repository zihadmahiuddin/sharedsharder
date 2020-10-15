import nacl from "tweetnacl";
import { ClientSession, ServerSession } from "../../util/Session";
import LoginPacket from "../client/Login";

import Packet from "../Packet";

export default class HandshakeOkPacket extends Packet {
  id = 20100;

  encode() {
    if (!this.session.sessionKey && this.session instanceof ServerSession) {
      this.session.sessionKey = Buffer.from(nacl.randomBytes(24));
    }
    this.payload.append(this.session.sessionKey);
  }

  processReceive() {
    if (this.session instanceof ClientSession) {
      const loginPacket = new LoginPacket();
      loginPacket.botToken = this.session.client.token;
      if (this.session.client.shardIds?.length) {
        loginPacket.shardIds = this.session.client.shardIds;
      }
      this.session.sendPacket(loginPacket);
    }
  }
}
