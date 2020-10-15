/*
 * Blake2B in pure Javascript
 * Based on DC - https://github.com/dcposch
 * Ported to TypeScript by zihadmahiuddin
 */

const BLAKE2B_IV32 = new Uint32Array([
  0xf3bcc908,
  0x6a09e667,
  0x84caa73b,
  0xbb67ae85,
  0xfe94f82b,
  0x3c6ef372,
  0x5f1d36f1,
  0xa54ff53a,
  0xade682d1,
  0x510e527f,
  0x2b3e6c1f,
  0x9b05688c,
  0xfb41bd6b,
  0x1f83d9ab,
  0x137e2179,
  0x5be0cd19,
]);

const SIGMA8 = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  14,
  10,
  4,
  8,
  9,
  15,
  13,
  6,
  1,
  12,
  0,
  2,
  11,
  7,
  5,
  3,
  11,
  8,
  12,
  0,
  5,
  2,
  15,
  13,
  10,
  14,
  3,
  6,
  7,
  1,
  9,
  4,
  7,
  9,
  3,
  1,
  13,
  12,
  11,
  14,
  2,
  6,
  5,
  10,
  4,
  0,
  15,
  8,
  9,
  0,
  5,
  7,
  2,
  4,
  10,
  15,
  14,
  1,
  11,
  12,
  6,
  8,
  3,
  13,
  2,
  12,
  6,
  10,
  0,
  11,
  8,
  3,
  4,
  13,
  7,
  5,
  15,
  14,
  1,
  9,
  12,
  5,
  1,
  15,
  14,
  13,
  4,
  10,
  0,
  7,
  6,
  3,
  9,
  2,
  8,
  11,
  13,
  11,
  7,
  14,
  12,
  1,
  3,
  9,
  5,
  0,
  15,
  4,
  8,
  6,
  2,
  10,
  6,
  15,
  14,
  9,
  11,
  3,
  0,
  8,
  12,
  2,
  13,
  7,
  1,
  4,
  10,
  5,
  10,
  2,
  8,
  4,
  7,
  6,
  1,
  5,
  15,
  11,
  9,
  14,
  3,
  12,
  13,
  0,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  14,
  10,
  4,
  8,
  9,
  15,
  13,
  6,
  1,
  12,
  0,
  2,
  11,
  7,
  5,
  3,
];

const SIGMA82 = new Uint8Array(SIGMA8.map((x) => x * 2));

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

  constructor(outlen: number) {
    if (outlen === 0 || outlen > 64) {
      throw new Error("Illegal output length, expected 0 < length <= 64");
    }

    this.v = new Uint32Array(32);
    this.m = new Uint32Array(32);

    this.ctx = {
      b: new Uint8Array(128),
      h: new Uint32Array(16),
      t: 0, // input count
      c: 0, // pointer within buffer
      outlen: outlen,
    };

    // initialize hash state
    for (let i = 0; i < this.ctx.h.length; i++) {
      this.ctx.h[i] = BLAKE2B_IV32[i];
    }

    this.ctx.h[0] ^= 0x01010000 ^ (0 << 8) ^ outlen;
  }

  update(input: Uint8Array) {
    for (let i = 0; i < input.length; i++) {
      if (this.ctx.c === 128) {
        // buffer full ?
        this.ctx.t += this.ctx.c; // add counters
        this.compress(false);
        this.ctx.c = 0;
      }
      this.ctx.b[this.ctx.c++] = input[i];
    }
  }

  compress(last: boolean) {
    let i = 0;

    for (i = 0; i < 16; i++) {
      this.v[i] = this.ctx.h[i];
      this.v[i + 16] = BLAKE2B_IV32[i];
    }

    this.v[24] = this.v[24] ^ this.ctx.t;
    this.v[25] = this.v[25] ^ (this.ctx.t / 0x100000000);

    if (last) {
      this.v[28] = ~this.v[28];
      this.v[29] = ~this.v[29];
    }

    for (i = 0; i < 32; i++) {
      this.m[i] = B2B_GET32(this.ctx.b, 4 * i);
    }

    // twelve rounds of mixing
    for (i = 0; i < 12; i++) {
      this.B2B_G(0, 8, 16, 24, SIGMA82[i * 16 + 0], SIGMA82[i * 16 + 1]);
      this.B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3]);
      this.B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5]);
      this.B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7]);
      this.B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9]);
      this.B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11]);
      this.B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13]);
      this.B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15]);
    }

    for (i = 0; i < 16; i++) {
      this.ctx.h[i] = this.ctx.h[i] ^ this.v[i] ^ this.v[i + 16];
    }
  }

  digest() {
    this.ctx.t += this.ctx.c;

    while (this.ctx.c < 128) {
      this.ctx.b[this.ctx.c++] = 0;
    }

    this.compress(true);

    // little endian convert and store
    const out = new Uint8Array(this.ctx.outlen);
    for (let i = 0; i < this.ctx.outlen; i++) {
      out[i] = this.ctx.h[i >> 2] >> (8 * (i & 3));
    }
    return out;
  }

  B2B_G(a: number, b: number, c: number, d: number, ix: number, iy: number) {
    const x0 = this.m[ix];
    const x1 = this.m[ix + 1];
    const y0 = this.m[iy];
    const y1 = this.m[iy + 1];

    ADD64AA(this.v, a, b); // this.v[a,a+1] += this.v[b,b+1] ... in JS we this.must store a uint64 as two uint32s
    ADD64AC(this.v, a, x0, x1); // this.v[a, a+1] += x ... x0 is the low 32 bits of x, x1 is the high 32 bits

    // this.v[d,d+1] = (this.v[d,d+1] xor this.v[a,a+1]) rotated to the right by 32 bits
    let xor0 = this.v[d] ^ this.v[a];
    let xor1 = this.v[d + 1] ^ this.v[a + 1];
    this.v[d] = xor1;
    this.v[d + 1] = xor0;

    ADD64AA(this.v, c, d);

    // this.v[b,b+1] = (this.v[b,b+1] xor this.v[c,c+1]) rotated right by 24 bits
    xor0 = this.v[b] ^ this.v[c];
    xor1 = this.v[b + 1] ^ this.v[c + 1];
    this.v[b] = (xor0 >>> 24) ^ (xor1 << 8);
    this.v[b + 1] = (xor1 >>> 24) ^ (xor0 << 8);

    ADD64AA(this.v, a, b);
    ADD64AC(this.v, a, y0, y1);

    // this.v[d,d+1] = (this.v[d,d+1] xor this.v[a,a+1]) rotated right by 16 bits
    xor0 = this.v[d] ^ this.v[a];
    xor1 = this.v[d + 1] ^ this.v[a + 1];
    this.v[d] = (xor0 >>> 16) ^ (xor1 << 16);
    this.v[d + 1] = (xor1 >>> 16) ^ (xor0 << 16);

    ADD64AA(this.v, c, d);

    // this.v[b,b+1] = (this.v[b,b+1] xor this.v[c,c+1]) rotated right by 63 bits
    xor0 = this.v[b] ^ this.v[c];
    xor1 = this.v[b + 1] ^ this.v[c + 1];
    this.v[b] = (xor1 >>> 31) ^ (xor0 << 1);
    this.v[b + 1] = (xor0 >>> 31) ^ (xor1 << 1);
  }
}

// 64-bit unsigned addition
// Sets v[a,a+1] += v[b,b+1]
// v should be a Uint32Array
function ADD64AA(v: Uint32Array, a: number, b: number) {
  const o0 = v[a] + v[b];
  let o1 = v[a + 1] + v[b + 1];
  if (o0 >= 0x100000000) {
    o1++;
  }
  v[a] = o0;
  v[a + 1] = o1;
}

// 64-bit unsigned addition
// Sets v[a,a+1] += b
// b0 is the low 32 bits of b, b1 represents the high 32 bits
function ADD64AC(v: Uint32Array, a: number, b0: number, b1: number) {
  let o0 = v[a] + b0;
  if (b0 < 0) {
    o0 += 0x100000000;
  }
  let o1 = v[a + 1] + b1;
  if (o0 >= 0x100000000) {
    o1++;
  }
  v[a] = o0;
  v[a + 1] = o1;
}

// Little-endian byte access
function B2B_GET32(arr: Uint8Array, i: number) {
  return arr[i] ^ (arr[i + 1] << 8) ^ (arr[i + 2] << 16) ^ (arr[i + 3] << 24);
}
