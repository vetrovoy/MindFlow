import type { AppLanguage } from '@mindflow/copy';
import { storage } from '@shared/theme/mmkv-storage';

const LANGUAGE_KEY = 'language';

export function getStoredLanguage(): AppLanguage | null {
  const stored = storage.getString(LANGUAGE_KEY);
  return (stored === 'ru' || stored === 'en') ? stored : null;
}

export function setStoredLanguage(lang: AppLanguage): void {
  storage.set(LANGUAGE_KEY, lang);
}

export function persistLanguage(lang: AppLanguage): void {
  setStoredLanguage(lang);
}

export function getSystemLanguage(): AppLanguage {
  try {
    const { getLocales } = require('react-native-localize');
    const locales = getLocales();
    const primary = locales[0]?.languageCode;
    return primary === 'ru' ? 'ru' : 'en';
  } catch {
    return 'ru';
  }
}

export function resolveInitialLanguage(): AppLanguage {
  return getStoredLanguage() ?? getSystemLanguage();
}

export function getRuntimeLanguage(): AppLanguage {
  return resolveInitialLanguage();
}
