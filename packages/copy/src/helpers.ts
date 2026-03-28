import { enUS, ru } from "date-fns/locale";

import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type AppLanguage,
  type DateFnsLocale
} from "./types";
import { dictionaries } from "./dictionaries";

export function isSupportedLanguage(value: string): value is AppLanguage {
  return SUPPORTED_LANGUAGES.includes(value as AppLanguage);
}

export function resolvePreferredLanguage(input?: string | null): AppLanguage {
  if (input == null) {
    return DEFAULT_LANGUAGE;
  }

  const normalized = input.trim().toLowerCase();
  const baseLanguage = normalized.split(/[-_]/)[0] ?? normalized;

  return isSupportedLanguage(baseLanguage) ? baseLanguage : DEFAULT_LANGUAGE;
}

export function getDateFnsLocale(language: AppLanguage): DateFnsLocale {
  return language === "en" ? enUS : ru;
}

export function getIntlLocale(language: AppLanguage) {
  return language === "en" ? "en-US" : "ru-RU";
}

export function getCopy(language: AppLanguage) {
  return dictionaries[language];
}

export function formatDisplayDate(value: string, language: AppLanguage) {
  if (!value) {
    return "";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString(getIntlLocale(language), {
    day: "numeric",
    month: "long"
  });
}
