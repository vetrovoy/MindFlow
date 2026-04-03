import { NavigationContainer, type Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '@shared/theme/use-theme';
import { InboxPage } from '@pages/inbox/ui/inbox-page';
import { TodayPage } from '@pages/today/ui/today-page';
import { ListsPage } from '@pages/lists/ui/lists-page';
import { MobileAppShell } from './app-shell';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.borderSoft,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: theme.colors.accentPrimary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen name="Inbox" component={InboxPage} options={{ title: 'Входящие' }} />
      <Tab.Screen name="Today" component={TodayPage} options={{ title: 'Сегодня' }} />
      <Tab.Screen name="Lists" component={ListsPage} options={{ title: 'Списки' }} />
    </Tab.Navigator>
  );
}

function ShellWithTabs() {
  return (
    <MobileAppShell>
      <TabNavigator />
    </MobileAppShell>
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={ShellWithTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
