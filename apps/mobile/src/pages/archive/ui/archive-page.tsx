import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { useCopy } from '@shared/lib/use-copy';
import { ScreenShell, StateCard, SurfaceCard, TaskRow } from '@shared/ui/primitives';
import { Body, Meta, SectionTitleText } from '@shared/ui/typography';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
  },
  sectionCard: {
    gap: 12,
  },
  sectionHeader: {
    gap: 4,
    marginBottom: 8,
  },
  taskList: {
    gap: 8,
  },
  emptyHint: {
    marginTop: 24,
  },
});

export function ArchivePage() {
  const { theme } = useTheme();
  const copy = useCopy();
  const tasks = useMobileAppStore(s => s.state.tasks);
  const projects = useMobileAppStore(s => s.state.projects);
  const toggleTask = useMobileAppStore(s => s.actions.toggleTask);
  const openTaskEdit = useMobileAppStore(s => s.actions.openTaskEdit);

  const archivedTasks = useMemo(
    () => tasks.filter(t => t.archivedAt != null),
    [tasks],
  );

  const archivedProjects = useMemo(
    () => projects.filter(p => p.archivedAt != null),
    [projects],
  );

  const isEmpty = archivedTasks.length === 0 && archivedProjects.length === 0;

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionTitleText>{copy.navigation.archive}</SectionTitleText>

        {isEmpty ? (
          <View style={styles.emptyHint}>
            <StateCard
              variant="empty"
              title={copy.archive.emptyTitle}
              description={copy.archive.emptyDescription}
            />
          </View>
        ) : (
          <>
            {archivedProjects.length > 0 && (
              <SurfaceCard style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Meta tone="soft">{copy.archive.projectsTitle}</Meta>
                </View>
                {archivedProjects.map(project => (
                  <View key={project.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: project.color, opacity: 0.5 }} />
                    <Body tone="secondary">{project.emoji} {project.name}</Body>
                  </View>
                ))}
              </SurfaceCard>
            )}

            {archivedTasks.length > 0 && (
              <SurfaceCard style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <Meta tone="soft">{copy.archive.tasksTitle}</Meta>
                </View>
                <View style={styles.taskList}>
                  {archivedTasks.map(task => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggleDone={toggleTask}
                      onOpenTask={openTaskEdit}
                      presentation="inbox"
                    />
                  ))}
                </View>
              </SurfaceCard>
            )}
          </>
        )}
      </ScrollView>
    </ScreenShell>
  );
}
