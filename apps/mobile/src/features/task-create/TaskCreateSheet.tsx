import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { getCopy } from '@mindflow/copy';
import type { TaskPriority } from '@mindflow/domain';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';
import { AccentButton, BottomSheet, DatePicker, PrioritySelect, ProjectSelector, SurfaceCard } from '@shared/ui/primitives';
import { Body, Meta } from '@shared/ui/typography';

const copy = getCopy('ru');

interface CreateDraft {
  title: string;
  dueDate: string;
  priority: TaskPriority;
  projectId: string | null;
}

const DEFAULT_DRAFT: CreateDraft = {
  title: '',
  dueDate: '',
  priority: 'medium',
  projectId: null,
};

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

export function TaskCreateSheet() {
  const isOpen = useMobileAppStore(s => s.state.isTaskCreateOpen);
  const preferredDate = useMobileAppStore(s => s.state.taskCreatePreferredDate);
  const favoriteProjects = useMobileAppStore(s => s.derived.favoriteProjects);
  const regularProjects = useMobileAppStore(s => s.derived.regularProjects);
  const isSaving = useMobileAppStore(s => s.state.isSaving);
  const closeTaskCreate = useMobileAppStore(s => s.actions.closeTaskCreate);
  const createTask = useMobileAppStore(s => s.actions.createTask);
  const { theme } = useTheme();

  const [draft, setDraft] = useState<CreateDraft>({ ...DEFAULT_DRAFT });
  const [titleError, setTitleError] = useState<string | null>(null);

  const activeProjects = useMemo(
    () => [...favoriteProjects, ...regularProjects],
    [favoriteProjects, regularProjects],
  );

  if (!isOpen) {
    return null;
  }

  const effectiveDueDate = draft.dueDate || preferredDate || '';

  async function handleSave() {
    const normalizedTitle = draft.title.trim();
    if (!normalizedTitle) {
      setTitleError(copy.task.titleRequired);
      return;
    }
    setTitleError(null);
    await createTask({
      title: normalizedTitle,
      dueDate: effectiveDueDate.trim() ? effectiveDueDate.trim() : null,
      priority: draft.priority,
      projectId: draft.projectId,
    });
    setDraft({ ...DEFAULT_DRAFT });
  }

  function handleClose() {
    setDraft({ ...DEFAULT_DRAFT });
    setTitleError(null);
    closeTaskCreate();
  }

  return (
    <BottomSheet
      visible
      title={copy.task.createTitle}
      onClose={handleClose}
      headerAccessory={(
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon decorative name="close" size={16} tone="muted" />
          </View>
        </Pressable>
      )}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SurfaceCard elevated style={styles.card}>
          <View style={styles.label}>
            <Meta tone="soft">{copy.task.createTitle}</Meta>
            <TextInput
              autoFocus
              value={draft.title}
              onChangeText={nextTitle => {
                setDraft(d => ({ ...d, title: nextTitle }));
                if (titleError != null) setTitleError(null);
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
        </SurfaceCard>

        <SurfaceCard elevated style={styles.card}>
          <DatePicker
            value={effectiveDueDate}
            onChange={nextDate => {
              setDraft(d => ({ ...d, dueDate: nextDate }));
            }}
            label={copy.task.changeDueDateTrigger}
          />

          <PrioritySelect
            value={draft.priority}
            onChange={next => { setDraft(d => ({ ...d, priority: next })); }}
            label={copy.task.priorityAriaLabel}
          />
        </SurfaceCard>

        <SurfaceCard elevated style={styles.card}>
          <ProjectSelector
            value={draft.projectId}
            onChange={nextProjectId => { setDraft(d => ({ ...d, projectId: nextProjectId })); }}
            projects={activeProjects}
            favoriteProjects={favoriteProjects}
            label={copy.task.changeProjectTrigger}
          />
        </SurfaceCard>

        <View style={styles.footer}>
          <AccentButton onPress={handleClose} style={styles.footerButton}>
            {copy.common.close}
          </AccentButton>
          <AccentButton
            disabled={isSaving}
            onPress={() => { void handleSave(); }}
            style={styles.footerButton}
          >
            {isSaving ? copy.common.saving : copy.common.save}
          </AccentButton>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
