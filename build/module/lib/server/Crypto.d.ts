/// <reference types="node" />
import nacl from "tweetnacl";
import { Session, Crypto } from "../util/Session";
import Nonce from "../util/Nonce";
export default class ServerCrypto implements Crypto {
    clientPublicKey?: Buffer;
    keyPair: nacl.BoxKeyPair;
    nonce?: Nonce;
    sharedKey?: Buffer;
    session: Session;
    constructor(secretKey: string);
    encrypt(id: number, payload: Buffer): Buffer;
    decrypt(id: number, encryptedPayload: Buffer): Buffer;
}
