import { StyleSheet, View } from 'react-native';
import { getCopy } from '@mindflow/copy';

import { TaskEditSheet } from '@features/task-edit/ui/task-edit-sheet';
import type { ProjectSection } from '@shared/model/types';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import {
  ProjectCard,
  ScreenShell,
  SectionHeader,
  StateCard,
  SurfaceCard,
  TaskRow,
} from '@shared/ui/primitives';

const copy = getCopy('ru');

const styles = StyleSheet.create({
  sectionCard: {
    gap: 14,
  },
  projectBlock: {
    gap: 10,
  },
  taskList: {
    gap: 8,
  },
});

export function ListsPage() {
  const sections = useMobileAppStore(store => store.derived.projectSections);
  const toggleTask = useMobileAppStore(store => store.actions.toggleTask);
  const openTaskEdit = useMobileAppStore(store => store.actions.openTaskEdit);
  const favoriteSections = sections.filter(section => section.project.isFavorite);
  const regularSections = sections.filter(section => !section.project.isFavorite);

  function renderProjectSection(section: ProjectSection) {
    return (
      <View key={section.project.id} style={styles.projectBlock}>
        <ProjectCard
          project={section.project}
          taskCount={section.progress.total}
          doneCount={section.progress.done}
        />
        {section.tasks.length > 0 ? (
          <View style={styles.taskList}>
            {section.tasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                onToggleDone={toggleTask}
                onOpenTask={openTaskEdit}
                presentation="inbox"
              />
            ))}
          </View>
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

  return (
    <ScreenShell title={copy.navigation.lists}>
      {sections.length === 0 ? (
        <SurfaceCard testID="lists-all-card">
          <View style={styles.sectionCard}>
            <SectionHeader title={copy.lists.allTitle} />
            <StateCard
              variant="empty"
              title={copy.common.empty}
              description={copy.lists.emptyDescription}
            />
          </View>
        </SurfaceCard>
      ) : (
        <>
          {favoriteSections.length > 0 ? (
            <SurfaceCard testID="lists-favorites-card">
              <View style={styles.sectionCard}>
                <SectionHeader
                  title={copy.lists.favoritesTitle}
                  subtitle={copy.lists.favoritesSubtitle}
                />
                {favoriteSections.map(renderProjectSection)}
              </View>
            </SurfaceCard>
          ) : null}
          {regularSections.length > 0 ? (
            <SurfaceCard testID="lists-all-card">
              <View style={styles.sectionCard}>
                <SectionHeader title={copy.lists.allTitle} />
                {regularSections.map(renderProjectSection)}
              </View>
            </SurfaceCard>
          ) : null}
        </>
      )}
      <TaskEditSheet />
    </ScreenShell>
  );
}
