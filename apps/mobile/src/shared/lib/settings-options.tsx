import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { CopyDictionary, AppLanguage } from '@mindflow/copy';
import type { ThemeName } from '@mindflow/ui';

// ─── Theme preview ────────────────────────────────────────────────────────────

const THEME_COLORS: Record<ThemeName, [string, string, string]> = {
  graphite: ['#0A0A0A', '#1D1D22', '#C4F82A'],
  gilded:   ['#FCF8F1', '#FFFDF9', '#C9A962'],
  minimal:  ['#FFFFFF', '#F9FAFB', '#2563EB'],
};

function ThemePreview({ themeName }: { themeName: ThemeName }) {
  const colors = THEME_COLORS[themeName];
  return (
    <View style={styles.themePreview}>
      {colors.map((c, i) => (
        <View key={i} style={[styles.themePreviewStrip, { backgroundColor: c }]} />
      ))}
    </View>
  );
}

// ─── Options builders ─────────────────────────────────────────────────────────

export function getThemeOptions(copy: CopyDictionary): {
  value: ThemeName;
  label: string;
  preview: React.ReactNode;
}[] {
  return (Object.keys(THEME_COLORS) as ThemeName[]).map(name => ({
    value: name,
    label: copy.theme[name],
    preview: <ThemePreview themeName={name} />,
  }));
}

export function getLanguageOptions(copy: CopyDictionary): {
  value: AppLanguage;
  label: string;
}[] {
  return [
    { value: 'ru', label: copy.language.ru },
    { value: 'en', label: copy.language.en },
  ];
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  themePreview: {
    width: 32,
    height: 20,
    borderRadius: 6,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.15)',
  },
  themePreviewStrip: { flex: 1 },
});
