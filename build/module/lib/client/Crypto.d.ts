/// <reference types="node" />
import nacl from "tweetnacl";
import { Crypto, Session } from "../util/Session";
import Nonce from "../util/Nonce";
export default class ClientCrypto implements Crypto {
    serverPublicKey: Buffer;
    clientPublicKey?: Buffer;
    nonce?: Nonce;
    sharedKey?: Buffer;
    keyPair: nacl.BoxKeyPair;
    session: Session;
    constructor(serverPublicKey: Buffer);
    encrypt(id: number, payload: Buffer): Buffer;
    decrypt(id: number, encryptedPayload: Buffer): Buffer;
}
