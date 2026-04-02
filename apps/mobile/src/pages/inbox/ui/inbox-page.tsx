import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { getCopy } from '@mindflow/copy';
import type { Task } from '@mindflow/domain';

import { TaskEditSheet } from '@features/task-edit/ui/task-edit-sheet';
import { useMobileAppStore } from '@shared/model/app-store-provider';
import { getTodayKey } from '@shared/model/selectors';
import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';
import {
  CollapsibleSection,
  SectionHeader,
  StateCard,
  SurfaceCard,
  TaskRow,
} from '@shared/ui/primitives';
import { Display, Title } from '@shared/ui/typography';

const copy = getCopy('ru');

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 36,
  },
  headerBlock: {
    gap: 16,
    paddingBottom: 8,
  },
  titleBlock: {
    gap: 12,
  },
  quickCaptureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  submitButton: {
    minHeight: 52,
    minWidth: 96,
    borderRadius: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  mainCard: {
    gap: 14,
  },
  taskList: {
    gap: 10,
  },
});

export function InboxPage() {
  const tasks = useMobileAppStore(store => store.derived.inboxTasks);
  const state = useMobileAppStore(store => store.state);
  const projects = state.projects;
  const isSaving = state.isSaving;
  const toggleTask = useMobileAppStore(store => store.actions.toggleTask);
  const addInboxTask = useMobileAppStore(store => store.actions.addInboxTask);
  const openTaskEdit = useMobileAppStore(store => store.actions.openTaskEdit);
  const { theme } = useTheme();
  const [draftTitle, setDraftTitle] = useState('');
  const todayKey = getTodayKey();
  const inboxCardData = useMemo(() => ['inbox-main-card'], []);
  const projectMap = useMemo(
    () => new Map(projects.map(project => [project.id, project])),
    [projects],
  );

  const { activeInboxTasks, completedInboxTasks, badgeByTaskId } = useMemo(() => {
    const active: Task[] = [];
    const completed: Task[] = [];
    const nextBadgeByTaskId: Partial<Record<string, 'today' | 'overdue'>> = {};

    for (const task of tasks) {
      if (task.status !== 'done' && task.dueDate != null && task.dueDate <= todayKey) {
        nextBadgeByTaskId[task.id] = task.dueDate < todayKey ? 'overdue' : 'today';
      }

      if (task.status === 'done') {
        completed.push(task);
      } else {
        active.push(task);
      }
    }

    return {
      activeInboxTasks: active,
      completedInboxTasks: completed,
      badgeByTaskId: nextBadgeByTaskId,
    };
  }, [tasks, todayKey]);

  async function handleQuickAdd() {
    const trimmed = draftTitle.trim();
    if (!trimmed) {
      return;
    }

    try {
      const saved = await addInboxTask({ title: trimmed });
      if (saved) {
        setDraftTitle('');
      }
    } catch {
      // Store-level error/toast handling remains the source of truth.
    }
  }

  const keyExtractor = useCallback((item: string) => item, []);

  const getItemType = useCallback(() => 'content-card', []);

  const renderTaskRow = useCallback(
    (task: Task) => (
      <TaskRow
        key={task.id}
        task={task}
        project={task.projectId == null ? null : (projectMap.get(task.projectId) ?? null)}
        badgeVariant={badgeByTaskId[task.id]}
        onOpenTask={openTaskEdit}
        onToggleDone={toggleTask}
      />
    ),
    [badgeByTaskId, openTaskEdit, projectMap, toggleTask],
  );

  const renderItem = useCallback(() => {
    const hasInboxContent = tasks.length > 0;

    return (
      <SurfaceCard elevated>
        <View style={styles.mainCard}>
          {hasInboxContent ? (
            <>
              {activeInboxTasks.length > 0 ? (
                <View style={styles.taskList}>
                  {activeInboxTasks.map(renderTaskRow)}
                </View>
              ) : null}
              {completedInboxTasks.length > 0 ? (
                <CollapsibleSection
                  count={completedInboxTasks.length}
                  defaultOpen={activeInboxTasks.length === 0}
                  title={copy.inbox.completedTitle}
                >
                  <View style={styles.taskList}>
                    {completedInboxTasks.map(renderTaskRow)}
                  </View>
                </CollapsibleSection>
              ) : null}
            </>
          ) : (
            <StateCard
              variant="empty"
              title={copy.inbox.emptyTitle}
              description={copy.inbox.emptyDescription}
            />
          )}
        </View>
      </SurfaceCard>
    );
  }, [
    activeInboxTasks,
    completedInboxTasks,
    renderTaskRow,
    tasks.length,
  ]);

  return (
    <>
      <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
        <FlashList<string>
          data={inboxCardData}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          overrideItemLayout={(layout, item) => {
            layout.span = 1;
          }}
          contentContainerStyle={styles.contentContainer}
          ListHeaderComponent={
            <View style={styles.headerBlock}>
              <View style={styles.titleBlock}>
                <Display>{copy.inbox.title}</Display>
              </View>

              <SurfaceCard style={styles.titleBlock}>
                <SectionHeader
                  title={copy.quickCapture.title}
                  subtitle={copy.quickCapture.inboxDescription}
                />
                <View style={styles.quickCaptureRow}>
                  <TextInput
                    editable={!isSaving}
                    onChangeText={setDraftTitle}
                    onSubmitEditing={() => {
                      void handleQuickAdd();
                    }}
                    placeholder={copy.quickCapture.taskPlaceholder}
                    placeholderTextColor={theme.colors.textTertiary}
                    returnKeyType="done"
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.borderSoft,
                        color: theme.colors.textPrimary,
                      },
                    ]}
                    value={draftTitle}
                  />
                  <Pressable
                    accessibilityRole="button"
                    disabled={isSaving || draftTitle.trim().length === 0}
                    onPress={() => {
                      void handleQuickAdd();
                    }}
                    style={[
                      styles.submitButton,
                      {
                        backgroundColor:
                          isSaving || draftTitle.trim().length === 0
                            ? theme.colors.overlayGhost
                            : theme.colors.surfaceInteractive,
                        borderColor:
                          isSaving || draftTitle.trim().length === 0
                            ? theme.colors.borderSoft
                            : theme.colors.accentPrimaryPanelBorder,
                      },
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Icon
                        decorative
                        name="add"
                        size={16}
                        tone={isSaving ? 'muted' : 'accent'}
                      />
                      <Title tone={isSaving ? 'muted' : 'accent'}>
                        {isSaving ? copy.common.saving : copy.common.save}
                      </Title>
                    </View>
                  </Pressable>
                </View>
              </SurfaceCard>
            </View>
          }
          renderItem={renderItem}
        />
      </View>

      <TaskEditSheet />
    </>
  );
}
