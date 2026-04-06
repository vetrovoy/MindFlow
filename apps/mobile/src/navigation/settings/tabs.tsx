import { SearchPage } from '@mobile/pages/search';
import { ArchivePage } from '@mobile/pages/archive';
import { Icon } from '@mobile/shared/ui/icons';
import { useTheme } from '@mobile/shared/theme/use-theme';
import { useCopy } from '@shared/lib/use-copy';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TAB_BAR_HEIGHT } from '@mobile/shared/config/constants';
import type { SettingsTabParamList } from '../types';

const Tab = createBottomTabNavigator<SettingsTabParamList>();

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

export function SettingsTabNavigator() {
  const { theme } = useTheme();
  const copy = useCopy();

  const tabOptions = (title: string, iconName: string) => ({
    title,
    tabBarIcon: tabIcon(iconName),
  });

  return (
    <Tab.Navigator screenOptions={screenOptions(theme)}>
      <Tab.Screen name="Search" component={SearchPage} options={tabOptions(copy.navigation.search, 'search')} />
      <Tab.Screen name="Archive" component={ArchivePage} options={tabOptions(copy.navigation.archive, 'archive')} />
    </Tab.Navigator>
  );
}
