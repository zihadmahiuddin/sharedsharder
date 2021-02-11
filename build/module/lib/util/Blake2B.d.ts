interface IBlake2BContext {
    b: Uint8Array;
    h: Uint32Array;
    t: number;
    c: number;
    outlen: number;
}
export default class Blake2B {
    v: Uint32Array;
    m: Uint32Array;
    ctx: IBlake2BContext;
    constructor(outlen: number);
    update(input: Uint8Array): void;
    compress(last: boolean): void;
    digest(): Uint8Array;
    B2B_G(a: number, b: number, c: number, d: number, ix: number, iy: number): void;
}
export {};
