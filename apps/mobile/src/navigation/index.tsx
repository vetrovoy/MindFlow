import { useCallback } from 'react';
import { NavigationContainer, type Theme } from '@react-navigation/native';
import {
  createDrawerNavigator,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';

import { useTheme } from '@shared/theme/use-theme';
import { HomeTabsShell } from './shells/home';
import { SettingsTabsShell } from './shells/settings';
import { DrawerContent } from './drawer/content';
import type { RootDrawerParamList } from './types';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={useCallback(
        (props: DrawerContentComponentProps) => (
          <DrawerContent {...props} />
        ),
        [],
      )}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
      }}
    >
      <Drawer.Screen name="Home" component={HomeTabsShell} />
      <Drawer.Screen name="Settings" component={SettingsTabsShell} />
    </Drawer.Navigator>
  );
}

export function RootNavigator() {
  const { theme } = useTheme();

  const navTheme: Theme = {
    dark: theme.colorScheme === 'dark',
    colors: {
      primary: theme.colors.accentPrimary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.borderSoft,
      notification: theme.colors.accentPrimary,
    },
    fonts: {
      regular: { fontFamily: 'Manrope-Regular', fontWeight: '400' },
      medium: { fontFamily: 'Manrope-Medium', fontWeight: '500' },
      bold: { fontFamily: 'Manrope-Bold', fontWeight: '700' },
      heavy: { fontFamily: 'Manrope-ExtraBold', fontWeight: '800' },
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <MainDrawer />
    </NavigationContainer>
  );
}
