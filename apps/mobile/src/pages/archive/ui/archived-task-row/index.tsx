import { Pressable, StyleSheet, View } from 'react-native';

import type { Project, Task } from '@mindflow/domain';

import { useCopy } from '@shared/lib/use-copy';
import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';
import { Body, Meta } from '@shared/ui/typography';

interface ArchivedTaskRowProps {
  project: Project | null;
  task: Task;
  onRestore: (taskId: string) => void;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  projectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  restoreButton: {
    padding: 8,
  },
});

export function ArchivedTaskRow({
  project,
  task,
  onRestore,
}: ArchivedTaskRowProps) {
  const { theme } = useTheme();
  const copy = useCopy();

  return (
    <View style={styles.row}>
      <View style={styles.content}>
        <Body tone="secondary" style={{ textDecorationLine: 'line-through' }}>
          {task.title}
        </Body>
        <View style={styles.metaRow}>
          {project == null ? (
            <Meta tone="soft">{copy.task.inbox}</Meta>
          ) : (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <View
                style={[styles.projectDot, { backgroundColor: project.color }]}
              />
              <Meta tone="soft">{project.name}</Meta>
            </View>
          )}
          {task.status === 'done' && (
            <View
              style={[
                styles.pill,
                { backgroundColor: theme.colors.accentSuccessDeep + '30' },
              ]}
            >
              <Meta tone="accent">{copy.status.done}</Meta>
            </View>
          )}
        </View>
      </View>
      <Pressable
        accessibilityLabel={copy.task.restoreAriaLabel}
        onPress={() => onRestore(task.id)}
        style={styles.restoreButton}
      >
        <Icon decorative name="restore" size={18} tone="accent" />
      </Pressable>
    </View>
  );
}
