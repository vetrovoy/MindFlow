import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { projectMarkers } from '@mindflow/ui';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { useCopy } from '@shared/lib/use-copy';
import { Icon } from '@shared/ui/icons';
import {
  AccentButton,
  BottomSheet,
  ColorPicker,
  DatePicker,
  SurfaceCard,
} from '@shared/ui/primitives';
import { Body, Meta } from '@shared/ui/typography';


const MARKER_COLORS = projectMarkers.map(m => m.color);

interface EditDraft {
  name: string;
  color: string;
  deadline: string;
  isFavorite: boolean;
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
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
  },
  footerButton: {
    flex: 1,
  },
});

export function ProjectEditSheet() {
  const copy = useCopy();
  const editingProject = useMobileAppStore(s => s.derived.editingProject);
  const isSaving = useMobileAppStore(s => s.state.isSaving);
  const closeProjectEdit = useMobileAppStore(s => s.actions.closeProjectEdit);
  const saveProjectEdit = useMobileAppStore(s => s.actions.saveProjectEdit);
  const { theme } = useTheme();

  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProject == null) {
      setDraft(null);
      setNameError(null);
      return;
    }
    setDraft({
      name: editingProject.name,
      color: editingProject.color,
      deadline: editingProject.deadline ?? '',
      isFavorite: editingProject.isFavorite,
    });
    setNameError(null);
  }, [editingProject]);

  if (editingProject == null || draft == null) {
    return null;
  }

  const project = editingProject;
  const currentDraft = draft;

  async function handleSave() {
    const normalizedName = currentDraft.name.trim();
    if (!normalizedName) {
      setNameError(copy.project.titleRequired);
      return;
    }
    setNameError(null);
    await saveProjectEdit({
      projectId: project.id,
      name: normalizedName,
      color: currentDraft.color,
      deadline: currentDraft.deadline.trim()
        ? currentDraft.deadline.trim()
        : null,
      isFavorite: currentDraft.isFavorite,
    });
  }

  return (
    <BottomSheet
      visible
      title={copy.project.editTitle}
      onClose={closeProjectEdit}
      headerAccessory={
        <Pressable
          accessibilityRole="button"
          onPress={closeProjectEdit}
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
      }
    >
      <SurfaceCard elevated style={styles.card}>
          <View style={styles.label}>
            <Meta tone="soft">{copy.project.editTitle}</Meta>
            <TextInput
              value={currentDraft.name}
              onChangeText={next => {
                setDraft(d => (d == null ? d : { ...d, name: next }));
                if (nameError != null) setNameError(null);
              }}
              placeholder={copy.project.titlePlaceholder}
              placeholderTextColor={theme.colors.textTertiary}
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: nameError
                    ? theme.colors.accentAlert
                    : theme.colors.borderSoft,
                  color: theme.colors.textPrimary,
                },
              ]}
            />
            {nameError ? <Body tone="danger">{nameError}</Body> : null}
          </View>
        </SurfaceCard>

        <SurfaceCard elevated style={styles.card}>
          <ColorPicker
            value={currentDraft.color}
            onChange={color => {
              setDraft(d => (d == null ? d : { ...d, color }));
            }}
            colors={MARKER_COLORS}
            label={copy.project.changeMarkerTrigger}
          />
        </SurfaceCard>

        <SurfaceCard elevated style={styles.card}>
          <DatePicker
            value={currentDraft.deadline}
            onChange={deadline => {
              setDraft(d => (d == null ? d : { ...d, deadline }));
            }}
            label={copy.project.changeDeadlineTrigger}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setDraft(d =>
                  d == null ? d : { ...d, isFavorite: !d.isFavorite },
                );
              }}
              style={[
                styles.favoriteRow,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.borderSoft,
                },
              ]}
            >
              <Icon
                decorative
                name="favorite"
                size={20}
                tone={currentDraft.isFavorite ? 'accent' : 'muted'}
              />
            </Pressable>
          </View>
        </SurfaceCard>

        <View style={styles.footer}>
          <AccentButton onPress={closeProjectEdit} style={styles.footerButton}>
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
