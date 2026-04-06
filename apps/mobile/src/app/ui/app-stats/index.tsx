import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { useCopy } from '@shared/lib/use-copy';
import { Body, Display } from '@shared/ui/typography';


const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 2,
  },
});

export function AppStats() {
  const { theme } = useTheme();
  const copy = useCopy();
  const inboxTasks = useMobileAppStore(s => s.derived.inboxTasks);
  const projectSections = useMobileAppStore(s => s.derived.projectSections);

  const inboxCount = useMemo(
    () => inboxTasks.filter(t => t.status !== 'done').length,
    [inboxTasks],
  );

  const activeCount = useMemo(
    () =>
      inboxCount +
      projectSections.reduce(
        (total, section) => total + section.tasks.filter(t => t.status !== 'done').length,
        0,
      ),
    [inboxCount, projectSections],
  );

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderSoft,
          },
        ]}
      >
        <Body tone="secondary">{copy.app.inboxStat}</Body>
        <Display tone="accent">{String(inboxCount)}</Display>
      </View>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderSoft,
          },
        ]}
      >
        <Body tone="secondary">{copy.app.activeStat}</Body>
        <Display>{String(activeCount)}</Display>
      </View>
    </View>
  );
}
