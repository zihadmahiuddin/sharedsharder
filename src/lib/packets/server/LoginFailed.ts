import Logger from "../../util/Logger";
import Packet from "../Packet";

export default class LoginFailedPacket extends Packet {
  id = 20103;

  code: number;
  message: string;

  decode() {
    this.code = this.payload.readByte();
    this.message = this.payload.readIString();
  }

  encode() {
    this.payload.writeByte(this.code);
    this.payload.writeIString(this.message);
  }

  processReceive() {
    Logger.error(
      `Login Failed: ${this.code}${this.message ? `, ${this.message}` : ""}`
    );
    if (this.code === 2) {
      process.exit(0);
    }
  }
}
