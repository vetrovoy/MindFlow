import { Alert } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import type { TaskPriority, TaskStatus } from '@mindflow/domain';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { useCopy } from '@shared/lib/use-copy';
import { useAutoSaveDraft } from '@shared/lib/use-auto-save-draft';
import { Icon } from '@shared/ui/icons';
import {
  BottomSheet,
  DatePicker,
  PrioritySelect,
  ProjectSelector,
  StatusSelect,
  SurfaceCard,
} from '@shared/ui/primitives';
import { Body, Meta } from '@shared/ui/typography';

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
});

export function TaskEditSheet() {
  const copy = useCopy();
  const editingTask = useMobileAppStore(store => store.derived.editingTask);
  const favoriteProjects = useMobileAppStore(
    store => store.derived.favoriteProjects,
  );
  const regularProjects = useMobileAppStore(
    store => store.derived.regularProjects,
  );
  const saveTaskEdit = useMobileAppStore(store => store.actions.saveTaskEdit);
  const closeTaskEdit = useMobileAppStore(store => store.actions.closeTaskEdit);
  const archiveTask = useMobileAppStore(store => store.actions.archiveTask);
  const deleteTask = useMobileAppStore(store => store.actions.deleteTask);
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

  const handleSave = useCallback(
    async (d: EditorDraft) => {
      if (editingTask == null) return false;
      const normalizedTitle = d.title.trim();
      if (!normalizedTitle) {
        setTitleError(copy.task.titleRequired);
        return false;
      }
      setTitleError(null);
      return saveTaskEdit(
        {
          taskId: editingTask.id,
          title: normalizedTitle,
          description: d.description.trim() ? d.description.trim() : null,
          dueDate: d.dueDate.trim() ? d.dueDate.trim() : null,
          priority: d.priority,
          status: d.status,
          projectId: d.projectId,
        },
        { closeOnSuccess: false, toastOnSuccess: false },
      );
    },
    [editingTask, saveTaskEdit, copy.task.titleRequired],
  );

  const isDraftValid = useCallback(
    (d: EditorDraft) => d.title.trim().length > 0,
    [],
  );
  const buildSavePayload = useCallback((d: EditorDraft) => d, []);

  const { handleClose } = useAutoSaveDraft<EditorDraft, EditorDraft>({
    draft,
    isValid: isDraftValid,
    buildPayload: buildSavePayload,
    onSave: handleSave,
    onClose: closeTaskEdit,
  });

  function handleArchive() {
    if (editingTask == null) return;
    Alert.alert(
      copy.task.archiveConfirmTitle,
      copy.task.archiveConfirmDescription,
      [
        { text: copy.confirmation.cancel, style: 'cancel' },
        {
          text: copy.confirmation.confirm,
          onPress: () => {
            void archiveTask(editingTask.id);
            handleClose();
          },
        },
      ],
    );
  }

  function handleDelete() {
    if (editingTask == null) return;
    Alert.alert(
      copy.task.deleteConfirmTitle,
      copy.task.deleteConfirmDescription,
      [
        { text: copy.confirmation.cancel, style: 'cancel' },
        {
          text: copy.confirmation.delete_,
          onPress: () => {
            void deleteTask(editingTask.id);
            handleClose();
          },
          style: 'destructive',
        },
      ],
    );
  }

  if (editingTask == null || draft == null) {
    return null;
  }

  const currentDraft = draft;

  return (
    <BottomSheet
      visible
      title={copy.task.editTitle}
      onClose={handleClose}
      headerAccessory={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.task.archiveAriaLabel}
            onPress={handleArchive}
            style={[
              styles.closeButton,
              {
                backgroundColor: theme.colors.overlayGhost,
                borderColor: theme.colors.borderSoft,
              },
            ]}
          >
            <Icon decorative name="archive" size={16} tone="muted" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.task.deleteAriaLabel}
            onPress={handleDelete}
            style={[
              styles.closeButton,
              {
                backgroundColor: theme.colors.overlayGhost,
                borderColor: theme.colors.borderSoft,
              },
            ]}
          >
            <Icon decorative name="trash" size={16} tone="muted" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={handleClose}
            style={[
              styles.closeButton,
              {
                backgroundColor: theme.colors.overlayGhost,
                borderColor: theme.colors.borderSoft,
              },
            ]}
          >
            <Icon decorative name="close" size={16} tone="muted" />
          </Pressable>
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingTop: 12, paddingBottom: 28 }}
      >
        <SurfaceCard elevated style={styles.card}>
          <View style={styles.label}>
            <Meta tone="soft">{copy.task.editTitle}</Meta>
            <TextInput
              value={currentDraft.title}
              onChangeText={nextTitle => {
                setDraft(current =>
                  current == null ? current : { ...current, title: nextTitle },
                );
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
                  borderColor: titleError
                    ? theme.colors.accentAlert
                    : theme.colors.borderSoft,
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
                  current == null
                    ? current
                    : { ...current, description: nextDescription },
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
              setDraft(current =>
                current == null
                  ? current
                  : { ...current, dueDate: nextDueDate },
              );
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
                current == null
                  ? current
                  : { ...current, projectId: nextProjectId },
              );
            }}
            projects={activeProjects}
            favoriteProjects={favoriteProjects}
            label={copy.task.changeProjectTrigger}
          />
        </SurfaceCard>
      </ScrollView>
    </BottomSheet>
  );
}
