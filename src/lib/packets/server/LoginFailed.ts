import Logger from "../../util/Logger";
import Packet from "../Packet";

export default class LoginFailedPacket extends Packet {
  id = 20103;
  public reason: string;

  decode() {
    this.reason = this.payload.readIString();
  }

  encode() {
    this.payload.writeIString(this.reason);
  }

  processReceive() {
    Logger.error(`Login Failed: ${this.reason}`);
  }
}
