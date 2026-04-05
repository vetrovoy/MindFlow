import { InboxPage } from '@pages/inbox/ui/inbox-page';
import { TodayPage } from '@pages/today/ui/today-page';
import { ListsPage } from '@pages/lists/ui/lists-page';
import { getCopy } from '@mindflow/copy';
import { Icon } from '@mobile/shared/ui/icons';
import { useTheme } from '@mobile/shared/theme/use-theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TAB_BAR_HEIGHT } from '@mobile/shared/config/contants';

const copy = getCopy('ru');
const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
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
      }}
    >
      <Tab.Screen
        name="Inbox"
        component={InboxPage}
        options={{
          title: copy.navigation.inbox,
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
          title: copy.navigation.today,
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
          title: copy.navigation.lists,
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
