import { useMobileAppStore } from '@shared/model/app-store-provider';
import { ScreenShell } from '@shared/ui/primitives';
import { ListsContent } from '@widgets/lists-content/ui/lists-content';
import { useMemo } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

export function ListsPage() {
  const sections = useMobileAppStore(store => store.derived.projectSections);
  const toggleTask = useMobileAppStore(store => store.actions.toggleTask);
  const openTaskEdit = useMobileAppStore(store => store.actions.openTaskEdit);
  const reorderProjectTasks = useMobileAppStore(
    store => store.actions.reorderProjectTasks,
  );
  const openProjectEdit = useMobileAppStore(
    store => store.actions.openProjectEdit,
  );
  const favoriteSections = useMemo(
    () => sections.filter(section => section.project.isFavorite),
    [sections],
  );
  const regularSections = useMemo(
    () => sections.filter(section => !section.project.isFavorite),
    [sections],
  );

  return (
    <ScreenShell>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <ListsContent
          favoriteSections={favoriteSections}
          regularSections={regularSections}
          onOpenProject={openProjectEdit}
          onOpenTask={openTaskEdit}
          onReorderTasks={reorderProjectTasks}
          onToggleDone={toggleTask}
        />
      </ScrollView>
    </ScreenShell>
  );
}
