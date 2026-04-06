import { StyleSheet, View } from 'react-native';

import type { Project } from '@mindflow/domain';

import type { ProjectSection } from '@shared/model/types';
import { useCopy } from '@shared/lib/use-copy';
import { ProjectCard } from '@shared/ui/primitives';
import { Body, Meta } from '@shared/ui/typography';

interface SearchProjectGroupProps {
  projects: Project[];
  sectionsById: Map<string, ProjectSection>;
  onOpenProject: (projectId: string) => void;
}

const styles = StyleSheet.create({
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectGrid: {
    gap: 12,
    marginTop: 8,
  },
});

export function SearchProjectGroup({ projects, sectionsById, onOpenProject }: SearchProjectGroupProps) {
  const copy = useCopy();

  return (
    <View>
      <View style={styles.groupHeader}>
        <Meta tone="primary">{copy.search.projectsTitle}</Meta>
        <Body tone="secondary">{projects.length}</Body>
      </View>
      <View style={styles.projectGrid}>
        {projects.map(project => {
          const section = sectionsById.get(project.id);

          return (
            <ProjectCard
              key={project.id}
              doneCount={section?.progress.done ?? 0}
              onPress={() => onOpenProject(project.id)}
              project={project}
              taskCount={section?.progress.total ?? 0}
            />
          );
        })}
      </View>
    </View>
  );
}
