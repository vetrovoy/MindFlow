import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { getCopy } from '@mindflow/copy';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeContext } from '@shared/theme/theme-context';
import type { ThemeName } from '@mindflow/ui';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import { Icon } from '@shared/ui/icons';
import {
  BottomSheet,
  DrawerNavItem,
  DrawerSettingsSelector,
} from '@shared/ui/primitives';
import { Body, Meta } from '@shared/ui/typography';
import type { RootDrawerParamList } from '../types';

const copy = getCopy('ru');

const THEME_OPTIONS: {
  value: ThemeName;
  label: string;
  preview: React.ReactNode;
}[] = [
  {
    value: 'graphite',
    label: copy.theme.graphite,
    preview: <ThemePreview colors={['#0A0A0A', '#1D1D22', '#C4F82A']} />,
  },
  {
    value: 'gilded',
    label: copy.theme.gilded,
    preview: <ThemePreview colors={['#FCF8F1', '#FFFDF9', '#C9A962']} />,
  },
  {
    value: 'minimal',
    label: copy.theme.minimal,
    preview: <ThemePreview colors={['#FFFFFF', '#F9FAFB', '#2563EB']} />,
  },
];

const LANGUAGE_OPTIONS = [
  { value: 'ru' as const, label: copy.language.ru },
  { value: 'en' as const, label: copy.language.en },
];

function ThemePreview({ colors }: { colors: string[] }) {
  return (
    <View style={styles.themePreview}>
      {colors.map((c, i) => (
        <View
          key={i}
          style={[styles.themePreviewStrip, { backgroundColor: c }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 24,
  },
  section: {
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
  },
  themePreview: {
    width: 32,
    height: 20,
    borderRadius: 6,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.15)',
  },
  themePreviewStrip: {
    flex: 1,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
});

export function DrawerContent({ navigation }: DrawerContentComponentProps) {
  const { theme, themeName, setTheme } = useThemeContext();
  const { colors } = theme;
  const language = useMobileAppStore(s => s.state.language);
  const setLanguage = useMobileAppStore(s => s.actions.setLanguage);

  const activeRoute = useNavigationState(state => {
    const current = state?.routes?.[state?.index ?? 0];
    return (
      current?.state?.routes?.[current.state?.index ?? 0]?.name ??
      current?.name ??
      'Inbox'
    );
  });

  const nav = useCallback(
    (drawerScreen: keyof RootDrawerParamList, tabScreen: string) => {
      navigation.navigate(drawerScreen, { screen: tabScreen });
      navigation.closeDrawer();
    },
    [navigation],
  );

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.safeArea, { backgroundColor: colors.surface }]}
    >
      <View style={styles.container}>
        <Meta tone="secondary">Меню</Meta>

        <View style={styles.divider} />

        <View style={styles.section}>
          <DrawerNavItem
            icon="nav-inbox"
            label={copy.navigation.inbox}
            active={activeRoute === 'Inbox'}
            onPress={() => {
              nav('Home', 'Inbox');
            }}
          />
          <DrawerNavItem
            icon="nav-today"
            label={copy.navigation.today}
            active={activeRoute === 'Today'}
            onPress={() => {
              nav('Home', 'Today');
            }}
          />
          <DrawerNavItem
            icon="nav-lists"
            label={copy.navigation.lists}
            active={activeRoute === 'Lists'}
            onPress={() => {
              nav('Home', 'Lists');
            }}
          />
          <DrawerNavItem
            icon="search"
            label={copy.navigation.search}
            active={activeRoute === 'Search'}
            onPress={() => {
              nav('Settings', 'Search');
            }}
          />
          <DrawerNavItem
            icon="archive"
            label={copy.navigation.archive}
            active={activeRoute === 'Archive'}
            onPress={() => {
              nav('Settings', 'Archive');
            }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <DrawerSettingsSelector
            icon="palette"
            triggerLabel={copy.theme.label}
            currentLabel={
              THEME_OPTIONS.find(t => t.value === themeName)?.label ?? ''
            }
            options={THEME_OPTIONS}
            value={themeName}
            onSelect={setTheme}
            sheetTitle={copy.theme.label}
          />
          <DrawerSettingsSelector
            icon="language"
            triggerLabel={copy.language.label}
            currentLabel={
              LANGUAGE_OPTIONS.find(l => l.value === language)?.label ?? ''
            }
            options={LANGUAGE_OPTIONS}
            value={language}
            onSelect={setLanguage}
            sheetTitle={copy.language.label}
          />
        </View>

        <View style={styles.divider} />

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            navigation.closeDrawer();
          }}
          style={[
            styles.logoutRow,
            {
              backgroundColor: `${colors.borderMuted}08`,
              borderColor: `${colors.borderMuted}20`,
            },
          ]}
        >
          <Icon decorative name="sign-out" size={20} tone="muted" />
          <Body tone="muted">{copy.common.logout}</Body>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
