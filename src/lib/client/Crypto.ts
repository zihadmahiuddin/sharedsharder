import nacl from "tweetnacl";

import { Crypto, Session } from "../util/Session";
import Nonce from "../util/Nonce";

export default class ClientCrypto implements Crypto {
  clientPublicKey?: Buffer;
  nonce?: Nonce;
  sharedKey?: Buffer;
  keyPair: nacl.BoxKeyPair;
  session: Session;

  constructor(public serverPublicKey: Buffer) {}

  encrypt(id: number, payload: Buffer) {
    if (id === 10100) {
      return payload;
    } else if (id === 10101) {
      this.keyPair = nacl.box.keyPair();
      this.nonce = new Nonce({
        bytes: this.session.sessionKey,
        publicKey: this.keyPair.publicKey,
        serverKey: this.serverPublicKey,
      });
      this.sharedKey = Buffer.from(
        nacl.box.before(this.serverPublicKey, this.keyPair.secretKey)
      );
      return Buffer.concat([
        this.keyPair.publicKey,
        Buffer.from(
          nacl.box.after(payload, this.nonce.payload, this.sharedKey)
        ),
      ]);
    } else {
      this.nonce.increment(2);
      return Buffer.from(
        nacl.box.after(payload, this.nonce.payload, this.sharedKey)
      );
    }
  }

  decrypt(id: number, encryptedPayload: Buffer) {
    if (id === 20100) {
      this.session.sessionKey = Buffer.concat([encryptedPayload]);
      return encryptedPayload;
    } else if (id === 20103 && !this.session.sessionKey) {
      return encryptedPayload;
    } else if (id === 20103 || id === 20104) {
      const payload = Buffer.from(
        nacl.box.open.after(
          encryptedPayload,
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
