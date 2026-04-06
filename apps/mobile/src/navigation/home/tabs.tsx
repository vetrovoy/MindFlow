import { InboxPage } from '@pages/inbox/ui/inbox-page';
import { TodayPage } from '@pages/today/ui/today-page';
import { ListsPage } from '@pages/lists/ui/lists-page';
import { Icon } from '@mobile/shared/ui/icons';
import { useTheme } from '@mobile/shared/theme/use-theme';
import { useCopy } from '@shared/lib/use-copy';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TAB_BAR_HEIGHT } from '@mobile/shared/config/contants';
import type { HomeTabParamList } from '../types';

const Tab = createBottomTabNavigator<HomeTabParamList>();

const screenOptions = (theme: ReturnType<typeof useTheme>['theme']) => ({
  headerShown: false,
  tabBarStyle: {
    height: TAB_BAR_HEIGHT,
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.borderSoft,
    borderTopWidth: 1,
  },
  tabBarActiveTintColor: theme.colors.accentPrimary,
  tabBarInactiveTintColor: theme.colors.textTertiary,
  tabBarLabelStyle: { fontSize: 12 },
});

const tabIcon = (name: string) => ({ focused }: { focused: boolean }) => (
  <Icon tone={focused ? 'accent' : 'muted'} name={name as Parameters<typeof Icon>[0]['name']} size={20} />
);

export function HomeTabNavigator() {
  const { theme } = useTheme();
  const copy = useCopy();

  const tabOptions = (title: string, iconName: string) => ({
    title,
    tabBarIcon: tabIcon(iconName),
  });

  return (
    <Tab.Navigator screenOptions={screenOptions(theme)}>
      <Tab.Screen name="Inbox" component={InboxPage} options={tabOptions(copy.navigation.inbox, 'nav-inbox')} />
      <Tab.Screen name="Today" component={TodayPage} options={tabOptions(copy.navigation.today, 'nav-today')} />
      <Tab.Screen name="Lists" component={ListsPage} options={tabOptions(copy.navigation.lists, 'nav-lists')} />
    </Tab.Navigator>
  );
}
