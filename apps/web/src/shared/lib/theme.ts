import { getTheme, resolveThemeName, type ThemeName } from "@mindflow/ui";

export const APP_THEME_STORAGE_KEY = "planner-theme";

export function readStoredTheme() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(APP_THEME_STORAGE_KEY);
}

export function persistTheme(theme: ThemeName) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(APP_THEME_STORAGE_KEY, theme);
}

export function applyDocumentTheme(theme: ThemeName) {
  if (typeof document === "undefined") {
    return;
  }

  const definition = getTheme(theme);
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = definition.colorScheme;
}

export function getInitialTheme() {
  return resolveThemeName(readStoredTheme());
}
