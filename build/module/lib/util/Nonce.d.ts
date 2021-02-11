/// <reference types="node" />
interface NonceOptions {
    bytes?: Uint8Array;
    publicKey?: Uint8Array;
    serverKey?: Uint8Array;
}
export default class Nonce {
    payload: Buffer;
    constructor(options?: NonceOptions | Buffer | string);
    increment(increment: number): void;
}
export {};
