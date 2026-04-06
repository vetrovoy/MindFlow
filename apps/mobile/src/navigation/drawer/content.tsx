import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeContext } from '@shared/theme/theme-context';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useAuthStore } from '@shared/model/auth-store';
import { resetMobileAppStore } from '@shared/model/app-store';
import { useCopy } from '@shared/lib/use-copy';
import {
  getThemeOptions,
  getLanguageOptions,
} from '@shared/lib/settings-options';
import { Icon } from '@shared/ui/icons';
import { NavItem, BottomSheetSelector } from '@shared/ui/primitives';
import { Body, Meta } from '@shared/ui/typography';
import type { RootDrawerParamList } from '../types';

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 24,
  },
  section: { gap: 8 },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
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
  const signOut = useAuthStore(s => s.actions.signOut);
  const copy = useCopy();

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

  const themeOptions = useMemo(() => getThemeOptions(copy), [copy]);
  const languageOptions = useMemo(() => getLanguageOptions(copy), [copy]);

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.safeArea, { backgroundColor: colors.surface }]}
    >
      <View style={styles.container}>
        <Meta tone="secondary">{copy.drawer.title}</Meta>

        <View style={styles.divider} />

        <View style={styles.section}>
          <NavItem
            icon="nav-inbox"
            label={copy.navigation.inbox}
            active={activeRoute === 'Inbox'}
            onPress={() => {
              nav('Home', 'Inbox');
            }}
          />
          <NavItem
            icon="nav-today"
            label={copy.navigation.today}
            active={activeRoute === 'Today'}
            onPress={() => {
              nav('Home', 'Today');
            }}
          />
          <NavItem
            icon="nav-lists"
            label={copy.navigation.lists}
            active={activeRoute === 'Lists'}
            onPress={() => {
              nav('Home', 'Lists');
            }}
          />
          <NavItem
            icon="search"
            label={copy.navigation.search}
            active={activeRoute === 'Search'}
            onPress={() => {
              nav('Settings', 'Search');
            }}
          />
          <NavItem
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
          <BottomSheetSelector
            icon="palette"
            triggerLabel={copy.theme.label}
            currentLabel={
              themeOptions.find(t => t.value === themeName)?.label ?? ''
            }
            options={themeOptions}
            value={themeName}
            onSelect={setTheme}
            sheetTitle={copy.theme.label}
          />
          <BottomSheetSelector
            icon="language"
            triggerLabel={copy.language.label}
            currentLabel={
              languageOptions.find(l => l.value === language)?.label ?? ''
            }
            options={languageOptions}
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
            resetMobileAppStore();
            signOut();
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
