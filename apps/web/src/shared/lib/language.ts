import {
  DEFAULT_LANGUAGE,
  getCopy,
  resolvePreferredLanguage,
  type AppLanguage
} from "@mindflow/copy";
import { safeReadStorage, safeWriteStorage } from "@/shared/lib/browser-storage";

export const LEGACY_LANGUAGE_STORAGE_KEY = "mindflow-language";
export const APP_LANGUAGE_STORAGE_KEY = "planner-language";

export function readStoredLanguage() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    safeReadStorage(APP_LANGUAGE_STORAGE_KEY) ??
    safeReadStorage(LEGACY_LANGUAGE_STORAGE_KEY)
  );
}

export function getBrowserLanguage() {
  if (typeof navigator === "undefined") {
    return null;
  }

  return navigator.language;
}

export function getRuntimeLanguage(): AppLanguage {
  const storedLanguage = readStoredLanguage();
  if (storedLanguage != null) {
    return resolvePreferredLanguage(storedLanguage);
  }

  if (typeof document !== "undefined") {
    const documentLanguage = document.documentElement.lang;
    if (documentLanguage) {
      return resolvePreferredLanguage(documentLanguage);
    }
  }

  return resolvePreferredLanguage(getBrowserLanguage());
}

export function persistLanguage(language: AppLanguage) {
  if (typeof window === "undefined") {
    return;
  }

  safeWriteStorage(APP_LANGUAGE_STORAGE_KEY, language);
}

export function applyDocumentLanguage(language: AppLanguage) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = language;
}

export function getRuntimeCopy() {
  return getCopy(getRuntimeLanguage() ?? DEFAULT_LANGUAGE);
}
