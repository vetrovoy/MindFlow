import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { ProjectSection } from '@shared/model/types';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useCopy } from '@shared/lib/use-copy';
import { ErrorBoundary } from '@shared/ui/error-boundary';
import {
  ProjectCard,
  RefreshControl,
  ScreenShell,
  SectionHeader,
  StateCard,
  SurfaceCard,
} from '@shared/ui/primitives';

import { DraggableTaskList } from '@entities/draggable-task-list';
import { FlashList } from '@shopify/flash-list';

const styles = StyleSheet.create({
  sectionCard: {
    gap: 14,
  },
  projectBlock: {
    gap: 10,
  },
});

type ListItem =
  | { type: 'empty' }
  | { type: 'section-header'; title: string; subtitle?: string }
  | { type: 'project'; section: ProjectSection };

export function ListsPage() {
  const copy = useCopy();
  const sections = useMobileAppStore(store => store.derived.projectSections);
  const reload = useMobileAppStore(store => store.actions.reload);
  const toggleTask = useMobileAppStore(store => store.actions.toggleTask);
  const openTaskEdit = useMobileAppStore(store => store.actions.openTaskEdit);
  const reorderProjectTasks = useMobileAppStore(
    store => store.actions.reorderProjectTasks,
  );
  const openProjectEdit = useMobileAppStore(
    store => store.actions.openProjectEdit,
  );
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }, [reload]);

  const listData = useMemo((): ListItem[] => {
    if (sections.length === 0) {
      return [{ type: 'empty' }];
    }

    const items: ListItem[] = [];
    const favoriteSections = sections.filter(s => s.project.isFavorite);
    const regularSections = sections.filter(s => !s.project.isFavorite);

    if (favoriteSections.length > 0) {
      items.push({
        type: 'section-header',
        title: copy.lists.favoritesTitle,
        subtitle: copy.lists.favoritesSubtitle,
      });
      for (const section of favoriteSections) {
        items.push({ type: 'project', section });
      }
    }

    if (regularSections.length > 0) {
      items.push({
        type: 'section-header',
        title: copy.lists.allTitle,
      });
      for (const section of regularSections) {
        items.push({ type: 'project', section });
      }
    }

    return items;
  }, [
    sections,
    copy.lists.favoritesTitle,
    copy.lists.favoritesSubtitle,
    copy.lists.allTitle,
  ]);

  const keyExtractor = useCallback((item: ListItem, index: number): string => {
    if (item.type === 'project') return `project-${item.section.project.id}`;
    if (item.type === 'section-header') return `header-${item.title}`;
    return `empty-${index}`;
  }, []);

  const getItemType = useCallback((item: ListItem): string => item.type, []);

  const renderHeader = useCallback(() => {
    if (sections.length === 0) {
      return (
        <SurfaceCard testID="lists-all-card">
          <View style={styles.sectionCard}>
            <StateCard
              variant="empty"
              title={copy.common.empty}
              description={copy.lists.emptyDescription}
            />
          </View>
        </SurfaceCard>
      );
    }
    return null;
  }, [sections.length, copy]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'empty') return null;

      if (item.type === 'section-header') {
        return (
          <SurfaceCard
            testID={
              item.title === copy.lists.favoritesTitle
                ? 'lists-favorites-card'
                : 'lists-all-card'
            }
          >
            <View style={styles.sectionCard}>
              <SectionHeader title={item.title} subtitle={item.subtitle} />
            </View>
          </SurfaceCard>
        );
      }

      const { section } = item;
      return (
        <View style={styles.projectBlock} key={section.project.id}>
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
    },
    [copy, openProjectEdit, toggleTask, openTaskEdit, reorderProjectTasks],
  );

  return (
    <ErrorBoundary>
      <ScreenShell>
        <FlashList
          data={listData}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          ListHeaderComponent={renderHeader}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </ScreenShell>
    </ErrorBoundary>
  );
}
