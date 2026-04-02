import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { getCopy } from '@mindflow/copy';
import type { Project, TaskPriority, TaskStatus } from '@mindflow/domain';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';
import { AccentButton, BottomSheet, SurfaceCard } from '@shared/ui/primitives';
import { Body, Meta } from '@shared/ui/typography';

const copy = getCopy('ru');
const PRIORITY_OPTIONS: TaskPriority[] = ['low', 'medium', 'high'];
const STATUS_OPTIONS: TaskStatus[] = ['todo', 'done'];

interface EditorDraft {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  projectId: string | null;
}

const styles = StyleSheet.create({
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  scrollContent: {
    gap: 14,
    paddingBottom: 16,
  },
  card: {
    gap: 12,
  },
  label: {
    gap: 6,
  },
  input: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
  },
  footerButton: {
    flex: 1,
  },
});

function getPriorityLabel(priority: TaskPriority) {
  return copy.priority[priority];
}

function getStatusLabel(status: TaskStatus) {
  return copy.status[status];
}

export function TaskEditSheet() {
  const editingTask = useMobileAppStore(store => store.derived.editingTask);
  const favoriteProjects = useMobileAppStore(store => store.derived.favoriteProjects);
  const regularProjects = useMobileAppStore(store => store.derived.regularProjects);
  const isSaving = useMobileAppStore(store => store.state.isSaving);
  const saveTaskEdit = useMobileAppStore(store => store.actions.saveTaskEdit);
  const closeTaskEdit = useMobileAppStore(store => store.actions.closeTaskEdit);
  const { theme } = useTheme();
  const [draft, setDraft] = useState<EditorDraft | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);

  const activeProjects = useMemo(
    () => [...favoriteProjects, ...regularProjects],
    [favoriteProjects, regularProjects],
  );

  useEffect(() => {
    if (editingTask == null) {
      setDraft(null);
      setTitleError(null);
      return;
    }

    setDraft({
      title: editingTask.title,
      description: editingTask.description ?? '',
      dueDate: editingTask.dueDate ?? '',
      priority: editingTask.priority,
      status: editingTask.status,
      projectId: editingTask.projectId ?? null,
    });
    setTitleError(null);
  }, [editingTask]);

  if (editingTask == null || draft == null) {
    return null;
  }

  const task = editingTask;
  const currentDraft = draft;
  const selectedProject =
    activeProjects.find(project => project.id === currentDraft.projectId) ?? null;

  async function handleSave() {
    const normalizedTitle = currentDraft.title.trim();
    if (!normalizedTitle) {
      setTitleError(copy.task.titleRequired);
      return;
    }

    setTitleError(null);
    await saveTaskEdit({
      taskId: task.id,
      title: normalizedTitle,
      description: currentDraft.description.trim() ? currentDraft.description.trim() : null,
      dueDate: currentDraft.dueDate.trim() ? currentDraft.dueDate.trim() : null,
      priority: currentDraft.priority,
      status: currentDraft.status,
      projectId: currentDraft.projectId,
    });
  }

  function renderChipOption<T extends string | null>({
    keyPrefix,
    value,
    label,
    active,
    onPress,
  }: {
    keyPrefix: string;
    value: T;
    label: string;
    active: boolean;
    onPress: (nextValue: T) => void;
  }) {
    return (
      <Pressable
        key={`${keyPrefix}-${value ?? 'inbox'}`}
        accessibilityRole="button"
        onPress={() => {
          onPress(value);
        }}
        style={[
          styles.chip,
          {
            backgroundColor: active ? theme.colors.surfaceInteractive : theme.colors.surface,
            borderColor: active ? theme.colors.accentPrimaryPanelBorder : theme.colors.borderSoft,
          },
        ]}
      >
        <Meta tone={active ? 'accent' : 'secondary'}>{label}</Meta>
      </Pressable>
    );
  }

  return (
    <BottomSheet
      visible
      title={copy.task.editTitle}
      subtitle={selectedProject ? `${selectedProject.emoji} ${selectedProject.name}` : copy.task.inbox}
      onClose={closeTaskEdit}
      headerAccessory={(
        <Pressable
          accessibilityRole="button"
          onPress={closeTaskEdit}
          style={[
            styles.closeButton,
            {
              backgroundColor: theme.colors.overlayGhost,
              borderColor: theme.colors.borderSoft,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon decorative name="close" size={16} tone="muted" />
            <Meta tone="secondary">{copy.common.close}</Meta>
          </View>
        </Pressable>
      )}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SurfaceCard elevated style={styles.card}>
          <View style={styles.label}>
            <Meta tone="soft">{copy.task.editTitle}</Meta>
            <TextInput
              value={currentDraft.title}
              onChangeText={nextTitle => {
                setDraft(current => (current == null ? current : { ...current, title: nextTitle }));
                if (titleError != null) {
                  setTitleError(null);
                }
              }}
              placeholder={copy.task.titlePlaceholder}
              placeholderTextColor={theme.colors.textTertiary}
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: titleError ? theme.colors.accentAlert : theme.colors.borderSoft,
                  color: theme.colors.textPrimary,
                },
              ]}
            />
            {titleError ? <Body tone="danger">{titleError}</Body> : null}
          </View>

          <View style={styles.label}>
            <Meta tone="soft">{copy.task.descriptionPlaceholder}</Meta>
            <TextInput
              multiline
              value={currentDraft.description}
              onChangeText={nextDescription => {
                setDraft(current =>
                  current == null ? current : { ...current, description: nextDescription },
                );
              }}
              placeholder={copy.task.descriptionPlaceholder}
              placeholderTextColor={theme.colors.textTertiary}
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.borderSoft,
                  color: theme.colors.textPrimary,
                },
              ]}
            />
          </View>
        </SurfaceCard>

        <SurfaceCard elevated style={styles.card}>
          <View style={styles.label}>
            <Meta tone="soft">{copy.task.changeDueDateTrigger}</Meta>
            <TextInput
              value={currentDraft.dueDate}
              onChangeText={nextDueDate => {
                setDraft(current => (current == null ? current : { ...current, dueDate: nextDueDate }));
              }}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.colors.textTertiary}
              autoCapitalize="none"
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.borderSoft,
                  color: theme.colors.textPrimary,
                },
              ]}
            />
            <Body tone="soft">
              {currentDraft.dueDate ? `Due: ${currentDraft.dueDate}` : copy.task.noDueDate}
            </Body>
          </View>

          <View style={styles.label}>
            <Meta tone="soft">{copy.task.priorityAriaLabel}</Meta>
            <View style={styles.chipRow}>
              {PRIORITY_OPTIONS.map(priority =>
                renderChipOption({
                  keyPrefix: 'priority',
                  value: priority,
                  label: getPriorityLabel(priority),
                  active: currentDraft.priority === priority,
                  onPress: nextPriority => {
                    setDraft(current =>
                      current == null ? current : { ...current, priority: nextPriority },
                    );
                  },
                }),
              )}
            </View>
          </View>

          <View style={styles.label}>
            <Meta tone="soft">{copy.task.statusAriaLabel}</Meta>
            <View style={styles.chipRow}>
              {STATUS_OPTIONS.map(status =>
                renderChipOption({
                  keyPrefix: 'status',
                  value: status,
                  label: getStatusLabel(status),
                  active: currentDraft.status === status,
                  onPress: nextStatus => {
                    setDraft(current =>
                      current == null ? current : { ...current, status: nextStatus },
                    );
                  },
                }),
              )}
            </View>
          </View>
        </SurfaceCard>

        <SurfaceCard elevated style={styles.card}>
          <View style={styles.label}>
            <Meta tone="soft">{copy.task.changeProjectTrigger}</Meta>
            <View style={styles.chipRow}>
              {renderChipOption<string | null>({
                keyPrefix: 'project',
                value: null,
                label: copy.task.inbox,
                active: currentDraft.projectId == null,
                onPress: nextProjectId => {
                  setDraft(current =>
                    current == null ? current : { ...current, projectId: nextProjectId },
                  );
                },
              })}
              {activeProjects.map((project: Project) =>
                renderChipOption({
                  keyPrefix: 'project',
                  value: project.id,
                  label: `${project.emoji} ${project.name}`,
                  active: currentDraft.projectId === project.id,
                  onPress: nextProjectId => {
                    setDraft(current =>
                      current == null ? current : { ...current, projectId: nextProjectId },
                    );
                  },
                }),
              )}
            </View>
          </View>
        </SurfaceCard>

        <View style={styles.footer}>
          <AccentButton onPress={closeTaskEdit} style={styles.footerButton}>
            {copy.common.close}
          </AccentButton>
          <AccentButton
            disabled={isSaving}
            onPress={() => {
              void handleSave();
            }}
            style={styles.footerButton}
          >
            {isSaving ? copy.common.saving : copy.common.save}
          </AccentButton>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
