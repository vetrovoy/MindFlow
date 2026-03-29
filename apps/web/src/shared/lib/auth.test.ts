import { afterEach, describe, expect, it, vi } from "vitest";

import {
  AUTH_CRYPTO_UNAVAILABLE_ERROR,
  AUTH_STORAGE_VERSION,
  createPasswordSalt,
  hashPassword,
  isValidAuthEmail,
  normalizeAuthEmail,
  readStoredAuthSnapshot,
  verifyPassword
} from "./auth";

const originalWindow = globalThis.window;
const originalCrypto = globalThis.crypto;

function installWindowStorageMock(localStorage: {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}) {
  Object.defineProperty(globalThis, "window", {
    value: { localStorage },
    configurable: true
  });
}

afterEach(() => {
  if (originalWindow === undefined) {
    Reflect.deleteProperty(globalThis, "window");
  } else {
    Object.defineProperty(globalThis, "window", {
      value: originalWindow,
      configurable: true
    });
  }

  if (originalCrypto === undefined) {
    Reflect.deleteProperty(globalThis, "crypto");
  } else {
    Object.defineProperty(globalThis, "crypto", {
      value: originalCrypto,
      configurable: true
    });
  }
});

describe("auth helpers", () => {
  it("normalizes emails before validation", () => {
    expect(normalizeAuthEmail("  USER@Example.COM ")).toBe("user@example.com");
    expect(isValidAuthEmail("  USER@Example.COM ")).toBe(true);
    expect(isValidAuthEmail("invalid-email")).toBe(false);
  });

  it("hashes passwords with per-user salts and verifies credentials", async () => {
    const password = "planner-secret";
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

  it("recovers from legacy auth snapshots without version metadata", () => {
    installWindowStorageMock({
      getItem(key) {
        if (key !== "planner-auth") {
          return JSON.stringify({
            users: [
              {
                id: "user-1",
                name: "Andrey",
                email: "USER@example.com",
                passwordSalt: "salt",
                passwordHash: "hash",
                createdAt: "2026-03-29T00:00:00.000Z"
              }
            ],
            session: {
              userId: "user-1",
              name: "Andrey",
              email: "USER@example.com"
            },
            legacyMigrated: true
          });
        }

        return null;
      },
      setItem: vi.fn()
    });

    expect(readStoredAuthSnapshot()).toEqual({
      version: AUTH_STORAGE_VERSION,
      users: [
        {
          id: "user-1",
          name: "Andrey",
          email: "user@example.com",
          passwordSalt: "salt",
          passwordHash: "hash",
          createdAt: "2026-03-29T00:00:00.000Z"
        }
      ],
      session: {
        userId: "user-1",
        name: "Andrey",
        email: "user@example.com"
      },
      legacyMigrated: true
    });
  });

  it("falls back to an empty auth snapshot when storage access fails", () => {
    installWindowStorageMock({
      getItem() {
        throw new Error("storage blocked");
      },
      setItem: vi.fn()
    });

    expect(readStoredAuthSnapshot()).toEqual({
      version: AUTH_STORAGE_VERSION,
      users: [],
      session: null,
      legacyMigrated: false
    });
  });

  it("throws a clear error when secure password hashing is unavailable", async () => {
    Object.defineProperty(globalThis, "crypto", {
      value: {
        getRandomValues: (input: Uint8Array) => input
      },
      configurable: true
    });

    await expect(hashPassword("secret", "salt")).rejects.toThrow(
      AUTH_CRYPTO_UNAVAILABLE_ERROR
    );
  });
});
