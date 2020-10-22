import { config as loadenv } from "dotenv";
import nacl from "tweetnacl";

import { Session, Crypto } from "../util/Session";
import Nonce from "../util/Nonce";

loadenv();

export default class ServerCrypto implements Crypto {
  clientPublicKey?: Buffer;
  keyPair: nacl.BoxKeyPair;
  nonce?: Nonce;
  sharedKey?: Buffer;
  session: Session;

  constructor(secretKey: string) {
    const secretKeyBuffer = Buffer.from(secretKey, "hex");
    this.keyPair = nacl.box.keyPair.fromSecretKey(secretKeyBuffer);
  }

  encrypt(id: number, payload: Buffer) {
    if (id === 20100) {
      return payload;
    } else if (id === 20103 && !this.session.sessionKey) {
      return payload;
    } else if (id === 20103 || id === 20104) {
      return Buffer.from(
        nacl.box.after(payload, this.nonce.payload, this.sharedKey)
      );
    } else {
      this.nonce.increment(2);
      return Buffer.from(
        nacl.box.after(payload, this.nonce.payload, this.sharedKey)
      );
    }
  }

  decrypt(id: number, encryptedPayload: Buffer) {
    if (id === 10100) {
      return encryptedPayload;
    } else if (id === 10101) {
      this.clientPublicKey = encryptedPayload.slice(0, 32);
      this.nonce = new Nonce({
        bytes: this.session.sessionKey,
        publicKey: this.clientPublicKey,
        serverKey: this.keyPair.publicKey,
      });
      this.sharedKey = Buffer.from(
        nacl.box.before(this.clientPublicKey, this.keyPair.secretKey)
      );
      const payload = Buffer.from(
        nacl.box.open.after(
          encryptedPayload.slice(32),
          this.nonce.payload,
          this.sharedKey
        )
      );
      return payload;
    } else {
      this.nonce.increment(2);
      return Buffer.from(
        nacl.box.open.after(
          encryptedPayload,
          this.nonce.payload,
          this.sharedKey
        )
      );
    }
  }
}
