import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import type { ProjectSection } from '@shared/model/types';
import { useCopy } from '@shared/lib/use-copy';
import { ProjectCard, SectionHeader, StateCard } from '@shared/ui/primitives';

import { DraggableTaskList } from '@entities/draggable-task-list';

const styles = StyleSheet.create({
  content: {
    paddingBottom: 16,
    gap: 14,
  },
  sectionBlock: {
    gap: 14,
  },
  sectionContent: {
    gap: 10,
  },
});

interface ListsContentProps {
  favoriteSections: ProjectSection[];
  regularSections: ProjectSection[];
  onOpenProject: (projectId: string) => void;
  onOpenTask: (taskId: string) => void;
  onReorderTasks: (
    projectId: string,
    orderedTaskIds: string[],
  ) => Promise<void>;
  onToggleDone: (taskId: string) => void;
}

export const ListsContent = memo(function ListsContent({
  favoriteSections,
  regularSections,
  onOpenProject,
  onOpenTask,
  onReorderTasks,
  onToggleDone,
}: ListsContentProps) {
  const copy = useCopy();
  const hasSections = favoriteSections.length > 0 || regularSections.length > 0;

  function renderProjectSection(section: ProjectSection) {
    return (
      <View key={section.project.id} style={styles.sectionContent}>
        <ProjectCard
          project={section.project}
          taskCount={section.progress.total}
          doneCount={section.progress.done}
          onPress={() => onOpenProject(section.project.id)}
        />
        {section.tasks.length > 0 ? (
          <DraggableTaskList
            tasks={section.tasks}
            projectId={section.project.id}
            onToggleDone={onToggleDone}
            onOpenTask={onOpenTask}
            onReorder={onReorderTasks}
          />
        ) : (
          <StateCard
            variant="empty"
            title={copy.common.empty}
            description={copy.lists.favoriteEmptyDescription}
          />
        )}
      </View>
    );
  }

  function renderSection(
    testID: string,
    title: string,
    projectSections: ProjectSection[],
    subtitle?: string,
  ) {
    if (projectSections.length === 0) {
      return null;
    }

    return (
      <View style={styles.sectionBlock} testID={testID}>
        {title ? <SectionHeader subtitle={subtitle} title={title} /> : null}
        <View style={styles.sectionContent}>
          {projectSections.map(renderProjectSection)}
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {!hasSections ? (
        <View style={styles.sectionBlock} testID="lists-all-card">
          <StateCard
            variant="empty"
            title={copy.common.empty}
            description={copy.lists.emptyDescription}
          />
        </View>
      ) : (
        <>
          {renderSection(
            'lists-favorites-card',
            copy.lists.favoritesTitle,
            favoriteSections,
            copy.lists.favoritesSubtitle,
          )}
          {renderSection(
            'lists-all-card',
            favoriteSections.length > 0 ? copy.lists.allTitle : '',
            regularSections,
          )}
        </>
      )}
    </ScrollView>
  );
});
