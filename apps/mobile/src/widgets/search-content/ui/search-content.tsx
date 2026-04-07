import { StyleSheet, View } from 'react-native';

import type { Project, Task } from '@mindflow/domain';

import type { ProjectSection } from '@shared/model/types';
import { useCopy } from '@shared/lib/use-copy';
import { StateCard } from '@shared/ui/primitives';

import { SearchProjectGroup } from './search-project-group';
import { SearchTaskGroup } from './search-task-group';

interface SearchContentProps {
  isIdle: boolean;
  isEmpty: boolean;
  tasks: Task[];
  projects: Project[];
  sectionsById: Map<string, ProjectSection>;
  onToggleDone: (taskId: string) => void;
  onOpenTask: (taskId: string) => void;
  onOpenProject: (projectId: string) => void;
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
});

export function SearchContent({
  isIdle,
  isEmpty,
  tasks,
  projects,
  sectionsById,
  onToggleDone,
  onOpenTask,
  onOpenProject,
}: SearchContentProps) {
  const copy = useCopy();

  if (isIdle) {
    return (
      <StateCard
        variant="empty"
        title={copy.search.idleTitle}
        description={copy.search.idleDescription}
      />
    );
  }

  if (isEmpty) {
    return (
      <StateCard
        variant="empty"
        title={copy.search.emptyTitle}
        description={copy.search.emptyDescription}
      />
    );
  }

  return (
    <View style={styles.content}>
      {tasks.length > 0 ? (
        <SearchTaskGroup
          tasks={tasks}
          onOpenTask={onOpenTask}
          onToggleDone={onToggleDone}
        />
      ) : null}
      {projects.length > 0 ? (
        <SearchProjectGroup
          onOpenProject={onOpenProject}
          projects={projects}
          sectionsById={sectionsById}
        />
      ) : null}
    </View>
  );
}
