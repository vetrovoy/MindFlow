import { StyleSheet, View } from 'react-native';

import type { ProjectSection } from '@shared/model/types';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useCopy } from '@shared/lib/use-copy';
import {
  ProjectCard,
  ScreenShell,
  SectionHeader,
  StateCard,
  SurfaceCard,
} from '@shared/ui/primitives';

import { DraggableTaskList } from '../../../entities/draggable-task-list';


const styles = StyleSheet.create({
  sectionCard: {
    gap: 14,
  },
  projectBlock: {
    gap: 10,
  },
});

export function ListsPage() {
  const copy = useCopy();
  const sections = useMobileAppStore(store => store.derived.projectSections);
  const toggleTask = useMobileAppStore(store => store.actions.toggleTask);
  const openTaskEdit = useMobileAppStore(store => store.actions.openTaskEdit);
  const reorderProjectTasks = useMobileAppStore(
    store => store.actions.reorderProjectTasks,
  );
  const openProjectEdit = useMobileAppStore(
    store => store.actions.openProjectEdit,
  );
  const favoriteSections = sections.filter(
    section => section.project.isFavorite,
  );
  const regularSections = sections.filter(
    section => !section.project.isFavorite,
  );

  function renderProjectSection(section: ProjectSection) {
    return (
      <View key={section.project.id} style={styles.projectBlock}>
        <ProjectCard
          project={section.project}
          taskCount={section.progress.total}
          doneCount={section.progress.done}
          onPress={() => openProjectEdit(section.project.id)}
        />
        {section.tasks.length > 0 ? (
          <DraggableTaskList
            tasks={section.tasks}
            projectId={section.project.id}
            onToggleDone={toggleTask}
            onOpenTask={openTaskEdit}
            onReorder={reorderProjectTasks}
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

  return (
    <ScreenShell>
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
    </ScreenShell>
  );
}
