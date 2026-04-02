import { StyleSheet, View } from 'react-native';
import { getCopy } from '@mindflow/copy';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import {
  ProjectCard,
  ScreenShell,
  SectionHeader,
  StateCard,
  SurfaceCard,
} from '@shared/ui/primitives';

const copy = getCopy('ru');

const styles = StyleSheet.create({
  sectionCard: {
    gap: 14,
  },
});

export function ListsPage() {
  const sections = useMobileAppStore(store => store.derived.projectSections);
  const favoriteSections = sections.filter(section => section.project.isFavorite);
  const regularSections = sections.filter(section => !section.project.isFavorite);

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
                {favoriteSections.map(section => (
                  <ProjectCard
                    key={section.project.id}
                    project={section.project}
                    taskCount={section.progress.total}
                    doneCount={section.progress.done}
                  />
                ))}
              </View>
            </SurfaceCard>
          ) : null}
          {regularSections.length > 0 ? (
            <SurfaceCard testID="lists-all-card">
              <View style={styles.sectionCard}>
                <SectionHeader title={copy.lists.allTitle} />
                {regularSections.map(section => (
                  <ProjectCard
                    key={section.project.id}
                    project={section.project}
                    taskCount={section.progress.total}
                    doneCount={section.progress.done}
                  />
                ))}
              </View>
            </SurfaceCard>
          ) : null}
        </>
      )}
    </ScreenShell>
  );
}
