import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react";

import {
  getCopy,
  resolvePreferredLanguage,
  type AppLanguage,
  type CopyDictionary
} from "@mindflow/copy";

import {
  applyDocumentLanguage,
  getBrowserLanguage,
  persistLanguage,
  readStoredLanguage
} from "@/shared/lib/language";

interface LanguageContextValue {
  language: AppLanguage;
  copy: CopyDictionary;
  setLanguage: (language: AppLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage() {
  return resolvePreferredLanguage(readStoredLanguage() ?? getBrowserLanguage());
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<AppLanguage>(getInitialLanguage);

  useEffect(() => {
    applyDocumentLanguage(language);
    persistLanguage(language);
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      copy: getCopy(language),
      setLanguage
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (context == null) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return {
    language: context.language,
    setLanguage: context.setLanguage
  };
}

export function useCopy() {
  const context = useContext(LanguageContext);

  if (context == null) {
    throw new Error("useCopy must be used within LanguageProvider");
  }

  return context.copy;
}
