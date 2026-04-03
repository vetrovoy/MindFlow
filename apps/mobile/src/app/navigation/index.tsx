import { NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '@shared/theme/use-theme';
import { TabsShell } from './tabs-shell';

const Stack = createNativeStackNavigator();

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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabsShell} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
