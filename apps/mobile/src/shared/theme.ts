import { DEFAULT_THEME, resolveThemeName, type ThemeName } from "@mindflow/ui";

export const MOBILE_THEME_STORAGE_KEY = "planner-theme";

function getLocalStorage() {
  if (typeof globalThis === "undefined" || !("localStorage" in globalThis)) {
    return null;
  }

  return globalThis.localStorage;
}

export function readStoredTheme() {
  const storage = getLocalStorage();

  return storage?.getItem(MOBILE_THEME_STORAGE_KEY) ?? null;
}

export function persistTheme(theme: ThemeName) {
  const storage = getLocalStorage();

  storage?.setItem(MOBILE_THEME_STORAGE_KEY, theme);
}

export function getInitialTheme() {
  return resolveThemeName(readStoredTheme() ?? DEFAULT_THEME);
}
