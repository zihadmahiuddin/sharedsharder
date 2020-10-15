import crypto from "crypto";

export function getSHA256(input: crypto.BinaryLike) {
  return crypto.createHash("sha256").update(input).digest();
}
