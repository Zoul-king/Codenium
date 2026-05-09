import { describe, it, expect } from "vitest";

import { hashPassword, verifyPassword, isHashed } from "@/lib/auth/password";

describe("hashPassword + verifyPassword", () => {
  it("hashea con prefijo bcrypt y verifica la contraseña", async () => {
    const plain = "CodeniumABCD1234";
    const hash = await hashPassword(plain);
    expect(isHashed(hash)).toBe(true);
    expect(await verifyPassword(plain, hash)).toBe(true);
    expect(await verifyPassword("otra-contrasena", hash)).toBe(false);
  });

  it("rechaza hash vacío", async () => {
    expect(await verifyPassword("loquesea", "")).toBe(false);
  });

  it("acepta legacy plaintext una sola vez", async () => {
    expect(await verifyPassword("plano", "plano")).toBe(true);
    expect(await verifyPassword("plano", "otro")).toBe(false);
  });

  it("isHashed detecta los prefijos bcrypt válidos", () => {
    expect(isHashed("$2a$12$abc")).toBe(true);
    expect(isHashed("$2b$12$abc")).toBe(true);
    expect(isHashed("$2y$12$abc")).toBe(true);
    expect(isHashed("plain-text")).toBe(false);
  });
});
