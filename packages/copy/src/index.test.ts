import { describe, expect, it } from "vitest";

import {
  DEFAULT_LANGUAGE,
  getCopy,
  getDateFnsLocale,
  getIntlLocale,
  resolvePreferredLanguage
} from "./index";

describe("resolvePreferredLanguage", () => {
  it("maps full locale tags to supported app languages", () => {
    expect(resolvePreferredLanguage("ru-RU")).toBe("ru");
    expect(resolvePreferredLanguage("en-US")).toBe("en");
  });

  it("falls back to the default language for unsupported values", () => {
    expect(resolvePreferredLanguage("de-DE")).toBe(DEFAULT_LANGUAGE);
    expect(resolvePreferredLanguage(undefined)).toBe(DEFAULT_LANGUAGE);
  });
});

describe("dictionaries", () => {
  it("exposes the same top-level shape for russian and english dictionaries", () => {
    expect(Object.keys(getCopy("ru"))).toEqual(Object.keys(getCopy("en")));
  });

  it("returns locale adapters for both supported languages", () => {
    expect(getDateFnsLocale("ru").code).toBe("ru");
    expect(getDateFnsLocale("en").code).toBe("en-US");
    expect(getIntlLocale("ru")).toBe("ru-RU");
    expect(getIntlLocale("en")).toBe("en-US");
  });
});
