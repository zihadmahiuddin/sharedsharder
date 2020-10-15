import nacl from "tweetnacl";

import { Crypto, Session } from "../util/Session";
import Nonce from "../util/Nonce";

export default class ClientCrypto implements Crypto {
  clientPublicKey?: Buffer;
  nonce?: Nonce;
  rnonce?: Nonce;
  sharedKey?: Buffer;
  snonce?: Nonce;
  keyPair: nacl.BoxKeyPair;
  session: Session;

  constructor(public serverPublicKey: Buffer) {}

  encrypt(id: number, payload: Buffer) {
    if (id === 10100) {
      return payload;
    } else if (id === 10101) {
      this.snonce = new Nonce();
      this.keyPair = nacl.box.keyPair();
      this.nonce = new Nonce({
        publicKey: this.keyPair.publicKey,
        serverKey: this.serverPublicKey,
      });
      this.sharedKey = Buffer.from(
        nacl.box.before(this.serverPublicKey, this.keyPair.secretKey)
      );

      payload = Buffer.concat([
        this.session.sessionKey,
        this.snonce.payload,
        payload,
      ]);
      return Buffer.concat([
        this.keyPair.publicKey,
        Buffer.from(
          nacl.box.after(payload, this.nonce.payload, this.sharedKey)
        ),
      ]);
    } else {
      this.snonce.increment(2);
      return Buffer.from(
        nacl.box.after(payload, this.snonce.payload, this.sharedKey)
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
      const nonce = new Nonce({
        bytes: this.snonce.payload,
        publicKey: this.keyPair.publicKey,
        serverKey: this.serverPublicKey,
      });

      const payload = Buffer.from(
        nacl.box.open.after(encryptedPayload, nonce.payload, this.sharedKey)
      );

      this.rnonce = new Nonce(payload.slice(0, 24));
      this.sharedKey = payload.slice(24, 56);

      return payload.slice(56);
    } else {
      this.rnonce.increment(2);
      return Buffer.from(
        nacl.box.open.after(
          encryptedPayload,
          this.rnonce.payload,
          this.sharedKey
        )
      );
    }
  }
}
