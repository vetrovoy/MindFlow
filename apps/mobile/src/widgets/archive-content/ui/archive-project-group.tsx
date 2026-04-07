import { StyleSheet, View } from 'react-native';

import type { Project } from '@mindflow/domain';

import { useCopy } from '@shared/lib/use-copy';
import { Body, Meta } from '@shared/ui/typography';

import { ArchivedProjectRow } from './archived-project-row';

interface ArchiveProjectGroupProps {
  projects: Project[];
  taskCountByProjectId: Map<string, number>;
  onRestore: (projectId: string) => void;
}

const styles = StyleSheet.create({
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rows: {
    gap: 4,
    marginTop: 8,
  },
});

export function ArchiveProjectGroup({
  projects,
  taskCountByProjectId,
  onRestore,
}: ArchiveProjectGroupProps) {
  const copy = useCopy();

  return (
    <View>
      <View style={styles.groupHeader}>
        <Meta tone="primary">{copy.archive.projectsTitle}</Meta>
        <Body tone="secondary">{projects.length}</Body>
      </View>
      <View style={styles.rows}>
        {projects.map(project => (
          <ArchivedProjectRow
            key={project.id}
            project={project}
            taskCount={taskCountByProjectId.get(project.id) ?? 0}
            onRestore={onRestore}
          />
        ))}
      </View>
    </View>
  );
}
