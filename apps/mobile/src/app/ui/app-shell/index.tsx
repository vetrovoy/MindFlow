import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ProjectCreateSheet } from '@mobile/features/project-create/ui/project-create-sheet';
import { ProjectEditSheet } from '@mobile/features/project-edit/ui/project-edit-sheet';
import { TaskCreateSheet } from '@mobile/features/task-create/ui/task-create-sheet';
import { TaskEditSheet } from '@features/task-edit/ui/task-edit-sheet';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { StateCard } from '@shared/ui/primitives';
import { useCopy } from '@shared/lib/use-copy';
import { AppStats } from '../app-stats';
import { AppFab } from '../app-fab';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppQuickAdd } from '../app-quick-add';
import { AppDrawerOpener } from '../app-drawer-opener';
import { FAB_SPACING } from '@shared/config/fab';

interface MobileAppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: MobileAppShellProps) {
  const { theme } = useTheme();
  const copy = useCopy();
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
            <AppDrawerOpener bottom={FAB_SPACING.menu} />
            <AppFab bottom={FAB_SPACING.main} />
          </>
        )}

        {/* Global flows mounted once at shell level */}
        <TaskEditSheet />
        <TaskCreateSheet />
        <ProjectCreateSheet />
        <ProjectEditSheet />
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
