import { describe, expect, it } from "vitest";

import {
  createPasswordSalt,
  hashPassword,
  isValidAuthEmail,
  normalizeAuthEmail,
  verifyPassword
} from "./auth";

describe("auth helpers", () => {
  it("normalizes emails before validation", () => {
    expect(normalizeAuthEmail("  USER@Example.COM ")).toBe("user@example.com");
    expect(isValidAuthEmail("  USER@Example.COM ")).toBe(true);
    expect(isValidAuthEmail("invalid-email")).toBe(false);
  });

  it("hashes passwords with per-user salts and verifies credentials", async () => {
    const password = "mindflow-secret";
    const salt = createPasswordSalt();
    const passwordHash = await hashPassword(password, salt);

    expect(passwordHash).toHaveLength(64);
    await expect(
      verifyPassword(password, {
        passwordSalt: salt,
        passwordHash
      })
    ).resolves.toBe(true);
    await expect(
      verifyPassword("wrong-password", {
        passwordSalt: salt,
        passwordHash
      })
    ).resolves.toBe(false);
  });
});
