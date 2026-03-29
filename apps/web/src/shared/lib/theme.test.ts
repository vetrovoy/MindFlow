import { afterEach, describe, expect, it } from "vitest";

import { getInitialTheme, readStoredTheme } from "./theme";

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

describe("theme storage helpers", () => {
  it("returns null when localStorage access fails", () => {
    installWindowStorageMock({
      getItem() {
        throw new Error("storage blocked");
      }
    });

    expect(readStoredTheme()).toBeNull();
  });

  it("falls back to the default theme when stored theme cannot be read", () => {
    installWindowStorageMock({
      getItem() {
        throw new Error("storage blocked");
      }
    });

    expect(getInitialTheme()).toBe("graphite");
  });
});
