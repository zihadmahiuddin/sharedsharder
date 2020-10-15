import { config as loadenv } from "dotenv";
import nacl from "tweetnacl";

import { Session, Crypto } from "../util/Session";
import Nonce from "../util/Nonce";

loadenv();

export default class ServerCrypto implements Crypto {
  clientPublicKey?: Buffer;
  keyPair: nacl.BoxKeyPair;
  nonce?: Nonce;
  rnonce?: Nonce;
  sharedKey?: Buffer;
  snonce?: Nonce;
  tmpSharedKey?: Buffer;
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
      payload = Buffer.concat([this.rnonce.payload, this.sharedKey, payload]);
      return Buffer.from(
        nacl.box.after(payload, this.nonce.payload, this.tmpSharedKey)
      );
    } else {
      this.rnonce.increment(2);
      return Buffer.from(
        nacl.box.after(payload, this.rnonce.payload, this.sharedKey)
      );
    }
  }

  decrypt(id: number, encryptedPayload: Buffer) {
    if (id === 10100) {
      return encryptedPayload;
    } else if (id === 10101) {
      this.clientPublicKey = encryptedPayload.slice(0, 32);
      const nonce = new Nonce({
        publicKey: this.clientPublicKey,
        serverKey: this.keyPair.publicKey,
      });
      this.tmpSharedKey = Buffer.from(
        nacl.box.before(this.clientPublicKey, this.keyPair.secretKey)
      );
      const payload = Buffer.from(
        nacl.box.open.after(
          encryptedPayload.slice(32),
          nonce.payload,
          this.tmpSharedKey
        )
      );
      this.snonce = new Nonce(payload.slice(24, 48));
      this.rnonce = new Nonce();
      const keyPair = nacl.box.keyPair();
      this.sharedKey = Buffer.from(
        nacl.box.before(keyPair.publicKey, keyPair.secretKey)
      );
      this.nonce = new Nonce({
        bytes: this.snonce.payload,
        publicKey: this.clientPublicKey,
        serverKey: this.keyPair.publicKey,
      });
      return payload.slice(48);
    } else {
      this.snonce.increment(2);
      return Buffer.from(
        nacl.box.open.after(
          encryptedPayload,
          this.snonce.payload,
          this.sharedKey
        )
      );
    }
  }
}
