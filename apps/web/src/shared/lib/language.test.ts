import { afterEach, describe, expect, it } from "vitest";

import { readStoredLanguage } from "./language";

const originalWindow = globalThis.window;

function installWindowStorageMock(localStorage: {
  getItem: (key: string) => string | null;
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
});

describe("language storage helpers", () => {
  it("returns null when localStorage access fails", () => {
    installWindowStorageMock({
      getItem() {
        throw new Error("storage blocked");
      }
    });

    expect(readStoredLanguage()).toBeNull();
  });
});
