import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { getCopy } from '@mindflow/copy';
import type { TaskPriority, TaskStatus } from '@mindflow/domain';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';
import { AccentButton, BottomSheet, DatePicker, PrioritySelect, ProjectSelector, StatusSelect, SurfaceCard } from '@shared/ui/primitives';
import { Body, Meta } from '@shared/ui/typography';

const copy = getCopy('ru');

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
  footer: {
    flexDirection: 'row',
    gap: 10,
  },
  footerButton: {
    flex: 1,
  },
});

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

  return (
    <BottomSheet
      visible
      title={copy.task.editTitle}
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
          </View>
        </Pressable>
      )}
    >
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
          <DatePicker
            value={currentDraft.dueDate}
            onChange={nextDueDate => {
              setDraft(current => (current == null ? current : { ...current, dueDate: nextDueDate }));
            }}
            label={copy.task.changeDueDateTrigger}
          />

          <PrioritySelect
            value={currentDraft.priority}
            onChange={next => {
              setDraft(current =>
                current == null ? current : { ...current, priority: next },
              );
            }}
            label={copy.task.priorityAriaLabel}
          />

          <StatusSelect
            value={currentDraft.status}
            onChange={next => {
              setDraft(current =>
                current == null ? current : { ...current, status: next },
              );
            }}
            label={copy.task.statusAriaLabel}
          />
        </SurfaceCard>

        <SurfaceCard elevated style={styles.card}>
          <ProjectSelector
            value={currentDraft.projectId}
            onChange={nextProjectId => {
              setDraft(current =>
                current == null ? current : { ...current, projectId: nextProjectId },
              );
            }}
            projects={activeProjects}
            favoriteProjects={favoriteProjects}
            label={copy.task.changeProjectTrigger}
          />
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
    </BottomSheet>
  );
}
