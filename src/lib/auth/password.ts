import "server-only";

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string) {
  if (!hash) {
    return false;
  }

  // Detect legacy plain-text passwords stored before bcrypt was introduced and
  // accept them once so the user can log in; the caller is responsible for
  // rehashing on success.
  if (!hash.startsWith("$2a$") && !hash.startsWith("$2b$") && !hash.startsWith("$2y$")) {
    return plain === hash;
  }

  return bcrypt.compare(plain, hash);
}

export function isHashed(hash: string) {
  return hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$");
}
