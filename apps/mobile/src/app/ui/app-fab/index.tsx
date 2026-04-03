import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigationState } from '@react-navigation/native';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';
import { Meta } from '@shared/ui/typography';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
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

export function AppFab() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const openTaskCreate = useMobileAppStore(s => s.actions.openTaskCreate);
  const openProjectCreate = useMobileAppStore(s => s.actions.openProjectCreate);

  const activeTab = useNavigationState(state => {
    const tabState = state?.routes?.[0]?.state;
    if (tabState == null || tabState.index == null) return 'Inbox';
    return (tabState.routes[tabState.index]?.name as string) ?? 'Inbox';
  });

  const isToday = activeTab === 'Today';

  function handleTaskPress() {
    setOpen(false);
    const preferredDate = isToday ? new Date().toISOString().slice(0, 10) : null;
    openTaskCreate(preferredDate);
  }

  function handleProjectPress() {
    setOpen(false);
    openProjectCreate();
  }

  return (
    <View style={styles.container} pointerEvents="box-none">
      {open && (
        <>
          <View style={styles.miniRow}>
            <Pressable
              accessibilityRole="button"
              onPress={handleProjectPress}
              style={[
                styles.miniLabel,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.borderSoft,
                },
              ]}
            >
              <Meta tone="secondary">Список</Meta>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={handleProjectPress}
              testID="fab-create-project"
              style={[
                styles.miniFab,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.borderSoft,
                },
              ]}
            >
              <Icon decorative name="nav-lists" size={18} tone="muted" />
            </Pressable>
          </View>

          <View style={styles.miniRow}>
            <Pressable
              accessibilityRole="button"
              onPress={handleTaskPress}
              style={[
                styles.miniLabel,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.borderSoft,
                },
              ]}
            >
              <Meta tone="secondary">Задача</Meta>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={handleTaskPress}
              testID="fab-create-task"
              style={[
                styles.miniFab,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.borderSoft,
                },
              ]}
            >
              <Icon decorative name="nav-inbox" size={18} tone="muted" />
            </Pressable>
          </View>
        </>
      )}

      <Pressable
        accessibilityRole="button"
        onPress={() => { setOpen(prev => !prev); }}
        testID="fab-main"
        style={[
          styles.fab,
          {
            backgroundColor: open ? theme.colors.surfaceInteractive : theme.colors.accentPrimary,
            shadowColor: theme.colors.accentPrimary,
          },
        ]}
      >
        <Icon decorative name={open ? 'close' : 'add'} size={22} tone="contrast" />
      </Pressable>
    </View>
  );
}
