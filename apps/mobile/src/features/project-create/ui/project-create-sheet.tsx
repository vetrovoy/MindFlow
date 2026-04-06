import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { projectMarkers } from '@mindflow/ui';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { useCopy } from '@shared/lib/use-copy';
import { Icon } from '@shared/ui/icons';
import { AccentButton, BottomSheet, ColorPicker, DatePicker, SurfaceCard } from '@shared/ui/primitives';
import { Body, Meta } from '@shared/ui/typography';


const MARKER_COLORS = projectMarkers.map(m => m.color);

interface CreateDraft {
  name: string;
  color: string;
  deadline: string;
  isFavorite: boolean;
}

const DEFAULT_DRAFT: CreateDraft = {
  name: '',
  color: projectMarkers[0].color,
  deadline: '',
  isFavorite: false,
};

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

export function ProjectCreateSheet() {
  const copy = useCopy();
  const isOpen = useMobileAppStore(s => s.state.isProjectCreateOpen);
  const isSaving = useMobileAppStore(s => s.state.isSaving);
  const closeProjectCreate = useMobileAppStore(s => s.actions.closeProjectCreate);
  const createProjectFromSheet = useMobileAppStore(s => s.actions.createProjectFromSheet);
  const { theme } = useTheme();

  const [draft, setDraft] = useState<CreateDraft>({ ...DEFAULT_DRAFT });
  const [nameError, setNameError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  async function handleSave() {
    const normalizedName = draft.name.trim();
    if (!normalizedName) {
      setNameError(copy.project.titleRequired);
      return;
    }
    setNameError(null);
    await createProjectFromSheet({
      name: normalizedName,
      color: draft.color,
      deadline: draft.deadline.trim() ? draft.deadline.trim() : null,
      isFavorite: draft.isFavorite,
    });
    setDraft({ ...DEFAULT_DRAFT });
  }

  function handleClose() {
    setDraft({ ...DEFAULT_DRAFT });
    setNameError(null);
    closeProjectCreate();
  }

  return (
    <BottomSheet
      visible
      title={copy.project.createTitle}
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
      <SurfaceCard elevated style={styles.card}>
          <View style={styles.label}>
            <Meta tone="soft">{copy.project.createTitle}</Meta>
            <TextInput
              value={draft.name}
              onChangeText={next => {
                setDraft(d => ({ ...d, name: next }));
                if (nameError != null) setNameError(null);
              }}
              placeholder={copy.project.titlePlaceholder}
              placeholderTextColor={theme.colors.textTertiary}
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: nameError ? theme.colors.accentAlert : theme.colors.borderSoft,
                  color: theme.colors.textPrimary,
                },
              ]}
            />
            {nameError ? <Body tone="danger">{nameError}</Body> : null}
          </View>
        </SurfaceCard>

        <SurfaceCard elevated style={styles.card}>
          <ColorPicker
            value={draft.color}
            onChange={color => { setDraft(d => ({ ...d, color })); }}
            colors={MARKER_COLORS}
            label={copy.project.changeMarkerTrigger}
          />
        </SurfaceCard>

        <SurfaceCard elevated style={styles.card}>
          <DatePicker
            value={draft.deadline}
            onChange={deadline => { setDraft(d => ({ ...d, deadline })); }}
            label={copy.project.changeDeadlineTrigger}
          />

          <Pressable
            accessibilityRole="button"
            onPress={() => { setDraft(d => ({ ...d, isFavorite: !d.isFavorite })); }}
            style={[
              styles.favoriteRow,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.borderSoft,
              },
            ]}
          >
            <Meta tone="soft">{copy.project.addFavoriteAriaLabel}</Meta>
            <Icon
              decorative
              name="favorite"
              size={20}
              tone={draft.isFavorite ? 'accent' : 'muted'}
            />
          </Pressable>
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
    </BottomSheet>
  );
}
