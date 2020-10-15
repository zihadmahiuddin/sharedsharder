import nacl from "tweetnacl";

import Blake2B from "./Blake2B";
import Logger from "./Logger";

interface NonceOptions {
  bytes?: Uint8Array;
  publicKey?: Uint8Array;
  serverKey?: Uint8Array;
}

export default class Nonce {
  public payload: Buffer;

  constructor(options?: NonceOptions | Buffer | string) {
    if (typeof options === "string") {
      this.payload = Buffer.from(options, "hex");
    } else if (options instanceof Buffer) {
      this.payload = options;
    } else if (options?.publicKey && options?.serverKey) {
      const b2 = new Blake2B(nacl.box.nonceLength);

      if (options?.bytes) {
        b2.update(options.bytes);
      }

      b2.update(options.publicKey);
      b2.update(options.serverKey);

      this.payload = Buffer.from(b2.digest());
    } else {
      this.payload = Buffer.from(nacl.randomBytes(nacl.box.nonceLength));
    }
  }

  increment(increment: number) {
    let val;
    try {
      val = this.payload.readInt16LE(0);
      val %= 32767;
      if (val + increment >= 65536) {
        this.payload.writeInt16LE(increment, 0);
      } else {
        this.payload.writeInt16LE(val + increment, 0);
      }
    } catch (err) {
      Logger.error(val, increment.toString(), err);
    }
  }
}
