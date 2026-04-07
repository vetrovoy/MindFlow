import { Pressable, StyleSheet, View } from 'react-native';

import type { Project } from '@mindflow/domain';

import { useCopy } from '@shared/lib/use-copy';
import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';
import { Meta, Title } from '@shared/ui/typography';

interface ArchivedProjectRowProps {
  project: Project;
  taskCount: number;
  onRestore: (projectId: string) => void;
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
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  divider: {
    width: 1,
    height: 10,
    opacity: 0.3,
  },
  restoreButton: {
    padding: 8,
  },
});

export function ArchivedProjectRow({
  project,
  taskCount,
  onRestore,
}: ArchivedProjectRowProps) {
  const { theme } = useTheme();
  const copy = useCopy();

  return (
    <View style={styles.row}>
      <View style={styles.content}>
        <View style={styles.identityRow}>
          <View
            style={[styles.projectDot, { backgroundColor: project.color }]}
          />
          <Title>{project.name}</Title>
        </View>
        <View style={styles.metaRow}>
          <Meta tone="soft">{copy.project.taskCount(taskCount)}</Meta>
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.colors.textTertiary },
            ]}
          />
          <Meta tone="soft">
            {project.deadline == null
              ? copy.project.noDeadline
              : copy.project.deadlineLabel(project.deadline)}
          </Meta>
        </View>
      </View>
      <Pressable
        accessibilityLabel={copy.common.restore}
        onPress={() => onRestore(project.id)}
        style={styles.restoreButton}
      >
        <Icon decorative name="restore" size={18} tone="accent" />
      </Pressable>
    </View>
  );
}
