import React, { createContext, useContext, useState } from 'react';
import {
  getTheme,
  resolveThemeName,
  type ThemeDefinition,
  type ThemeName,
} from '@mindflow/ui';
import { storage } from './mmkv-storage';

const THEME_KEY = 'theme';

export interface ThemeContextValue {
  theme: ThemeDefinition;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>(() => {
    const stored = storage.getString(THEME_KEY);
    return resolveThemeName(stored);
  });

  const setTheme = (name: ThemeName) => {
    storage.set(THEME_KEY, name);
    setThemeNameState(name);
  };

  return (
    <ThemeContext.Provider
      value={{ theme: getTheme(themeName), themeName, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return ctx;
}
