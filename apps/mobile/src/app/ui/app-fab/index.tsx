import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigationState } from '@react-navigation/native';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    alignItems: 'flex-end',
    gap: 10,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  miniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniLabel: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  miniFab: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

export function AppFab({ bottom }: { bottom: number }) {
  const { theme } = useTheme();
  const openTaskCreate = useMobileAppStore(s => s.actions.openTaskCreate);
  const openProjectCreate = useMobileAppStore(s => s.actions.openProjectCreate);

  const activeTab = useNavigationState(state => {
    const tabState = state?.routes?.[0]?.state;
    if (tabState == null || tabState.index == null) return 'Inbox';
    return (tabState.routes[tabState.index]?.name as string) ?? 'Inbox';
  });

  const isInbox = activeTab === 'Inbox';
  const isLists = activeTab === 'Lists';
  const isToday = activeTab === 'Today';

  function handleTaskPress() {
    const preferredDate = isToday
      ? new Date().toISOString().slice(0, 10)
      : null;
    openTaskCreate(preferredDate);
  }

  function handleProjectPress() {
    openProjectCreate();
  }

  const handlePress = () => {
    if (isInbox || isToday) {
      handleTaskPress();
    } else if (isLists) {
      handleProjectPress();
    }
  };

  return (
    <View style={[styles.container, { bottom }]} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        testID="fab-main"
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.accentPrimary,
            shadowColor: theme.colors.accentPrimary,
          },
        ]}
      >
        <Icon decorative name={'add'} size={22} tone="contrast" />
      </Pressable>
    </View>
  );
}
