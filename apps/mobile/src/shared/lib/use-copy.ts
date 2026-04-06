import { useMemo } from 'react';
import { getCopy } from '@mindflow/copy';
import type { CopyDictionary, AppLanguage } from '@mindflow/copy';

import { useMobileAppStore } from '@shared/model/app-store-provider';

export function useCopy(): CopyDictionary {
  const language = useMobileAppStore(s => s.state.language);
  return useMemo(() => getCopy(language), [language]);
}

export function useLanguage(): {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
} {
  const language = useMobileAppStore(s => s.state.language);
  const setLanguage = useMobileAppStore(s => s.actions.setLanguage);
  return { language, setLanguage };
}
