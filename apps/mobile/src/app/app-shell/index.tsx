import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { getCopy } from '@mindflow/copy';

import { TaskEditSheet } from '@features/task-edit/ui/task-edit-sheet';
import { ProjectCreateFeature } from '@features/project-create';
import { QuickAddFeature } from '@features/quick-add';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { StateCard } from '@shared/ui/primitives';
import { AppStats } from '../ui/app-stats';
import { SafeAreaView } from 'react-native-safe-area-context';

const copy = getCopy('ru');

interface MobileAppShellProps {
  children: ReactNode;
}

export function MobileAppShell({ children }: MobileAppShellProps) {
  const { theme } = useTheme();
  const isHydrated = useMobileAppStore(s => s.state.isHydrated);

  const activeTab = useNavigationState(state => {
    const tabState = state?.routes?.[0]?.state;
    if (tabState == null || tabState.index == null) return 'Inbox';
    return (tabState.routes[tabState.index]?.name as string) ?? 'Inbox';
  });

  const isInbox = activeTab === 'Inbox';
  const isToday = activeTab === 'Today';
  const isLists = activeTab === 'Lists';

  const todayDateKey = new Date().toISOString().slice(0, 10);

  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        {!isHydrated ? (
          <View style={styles.loadingContainer}>
            <StateCard
              variant="loading"
              title={copy.app.hydrationTitle}
              description={copy.app.hydrationDescription}
            />
          </View>
        ) : (
          <>
            <View style={styles.shellHeader}>
              <AppStats />
              {isInbox || isToday ? (
                <QuickAddFeature
                  preferredDate={isToday ? todayDateKey : null}
                />
              ) : null}
              {isLists ? <ProjectCreateFeature /> : null}
            </View>
            <View style={styles.content}>{children}</View>
          </>
        )}

        {/* Global flows mounted once at shell level */}
        <TaskEditSheet />
        {/* <ProjectEditSheet /> */}
        {/* <TaskCreateSheet /> */}
        {/* <ProjectCreateSheet /> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loadingContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  shellHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  content: { flex: 1 },
});
