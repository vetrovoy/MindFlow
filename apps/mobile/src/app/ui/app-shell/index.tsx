import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { getCopy } from '@mindflow/copy';

import { ProjectCreateSheet } from '@features/project-create/ProjectCreateSheet';
import { TaskCreateSheet } from '@features/task-create/TaskCreateSheet';
import { TaskEditSheet } from '@features/task-edit/ui/task-edit-sheet';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { StateCard } from '@shared/ui/primitives';
import { AppStats } from '../app-stats';
import { AppFab } from '../app-fab';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppQuickAdd } from '../app-quick-add';

const copy = getCopy('ru');

interface MobileAppShellProps {
  children: ReactNode;
}

export function MobileAppShell({ children }: MobileAppShellProps) {
  const { theme } = useTheme();
  const isHydrated = useMobileAppStore(s => s.state.isHydrated);

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
              <AppQuickAdd />
            </View>
            <View style={styles.content}>{children}</View>
            <AppFab />
          </>
        )}

        {/* Global flows mounted once at shell level */}
        <TaskEditSheet />
        <TaskCreateSheet />
        <ProjectCreateSheet />
        {/* <ProjectEditSheet /> */}
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
