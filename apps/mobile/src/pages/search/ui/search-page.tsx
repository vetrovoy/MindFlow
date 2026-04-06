import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { useCopy } from '@shared/lib/use-copy';
import { Icon } from '@shared/ui/icons';
import { ScreenShell, StateCard, TaskRow } from '@shared/ui/primitives';
import { Body, Meta, SectionTitleText } from '@shared/ui/typography';
import type { Task } from '@mindflow/domain';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  resultSection: {
    gap: 12,
    marginBottom: 24,
  },
  sectionLabel: {
    marginBottom: 4,
  },
  taskList: {
    gap: 8,
  },
});

export function SearchPage() {
  const { theme } = useTheme();
  const copy = useCopy();
  const tasks = useMobileAppStore(s => s.state.tasks);
  const projects = useMobileAppStore(s => s.state.projects);
  const toggleTask = useMobileAppStore(s => s.actions.toggleTask);
  const openTaskEdit = useMobileAppStore(s => s.actions.openTaskEdit);
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const filteredTasks = normalizedQuery
    ? tasks.filter(t =>
        t.archivedAt == null &&
        t.title.toLowerCase().includes(normalizedQuery),
      )
    : [];

  const filteredProjects = normalizedQuery
    ? projects.filter(p =>
        p.archivedAt == null &&
        (p.name.toLowerCase().includes(normalizedQuery) ||
          p.emoji.includes(normalizedQuery)),
      )
    : [];

  const handleClear = useCallback(() => {
    setQuery('');
  }, []);

  const isEmpty = normalizedQuery.length > 0 && filteredTasks.length === 0 && filteredProjects.length === 0;
  const isIdle = normalizedQuery.length === 0;

  return (
    <ScreenShell>
      <View style={styles.container}>
        <SectionTitleText>{copy.navigation.search}</SectionTitleText>
        <View style={[styles.searchRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderSoft }]}>
          <Icon decorative name="search" size={18} tone="muted" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={copy.search.fieldPlaceholder}
            placeholderTextColor={theme.colors.textTertiary}
            style={[styles.searchInput, { color: theme.colors.textPrimary }]}
          />
          {query.length > 0 && (
            <Pressable onPress={handleClear}>
              <Icon decorative name="close" size={16} tone="muted" />
            </Pressable>
          )}
        </View>

        {isIdle && (
          <StateCard
            variant="empty"
            title={copy.search.idleTitle}
            description={copy.search.idleDescription}
          />
        )}

        {isEmpty && (
          <StateCard
            variant="empty"
            title={copy.search.emptyTitle}
            description={copy.search.emptyDescription}
          />
        )}

        {!isIdle && !isEmpty && (
          <View>
            {filteredProjects.length > 0 && (
              <View style={styles.resultSection}>
                <Meta tone="soft" style={styles.sectionLabel}>
                  {copy.search.projectsTitle}
                </Meta>
                {filteredProjects.map(project => (
                  <View key={project.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: project.color }} />
                    <Body tone="primary">{project.emoji} {project.name}</Body>
                  </View>
                ))}
              </View>
            )}

            {filteredTasks.length > 0 && (
              <View style={styles.resultSection}>
                <Meta tone="soft" style={styles.sectionLabel}>
                  {copy.search.tasksTitle}
                </Meta>
                <View style={styles.taskList}>
                  {filteredTasks.map(task => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggleDone={toggleTask}
                      onOpenTask={openTaskEdit}
                      presentation="inbox"
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </ScreenShell>
  );
}
