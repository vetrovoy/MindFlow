import { InboxPage } from '@pages/inbox/ui/inbox-page';
import { TodayPage } from '@pages/today/ui/today-page';
import { ListsPage } from '@pages/lists/ui/lists-page';
import { Icon } from '@mobile/shared/ui/icons';
import { useTheme } from '@mobile/shared/theme/use-theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
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
      <Tab.Screen
        name="Inbox"
        component={InboxPage}
        options={{
          title: 'Входящие',
          tabBarIcon: ({ focused }) => (
            <Icon
              tone={focused ? 'accent' : 'muted'}
              name="nav-inbox"
              size={20}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Today"
        component={TodayPage}
        options={{
          title: 'Сегодня',
          tabBarIcon: ({ focused }) => (
            <Icon
              tone={focused ? 'accent' : 'muted'}
              name="nav-today"
              size={20}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Lists"
        component={ListsPage}
        options={{
          title: 'Списки',
          tabBarIcon: ({ focused }) => (
            <Icon
              tone={focused ? 'accent' : 'muted'}
              name="nav-lists"
              size={20}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
