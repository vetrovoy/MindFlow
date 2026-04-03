import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { getCopy } from '@mindflow/copy';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';
import { AccentButton, BottomSheet, SurfaceCard } from '@shared/ui/primitives';
import { Body, Meta } from '@shared/ui/typography';

const copy = getCopy('ru');

const COLOR_OPTIONS = [
  { label: 'Синий', value: '#4285F4' },
  { label: 'Зелёный', value: '#34A853' },
  { label: 'Красный', value: '#EA4335' },
  { label: 'Жёлтый', value: '#FBBC04' },
  { label: 'Фиолетовый', value: '#9C27B0' },
  { label: 'Серый', value: '#757575' },
];

interface CreateDraft {
  name: string;
  emoji: string;
  color: string;
}

const DEFAULT_DRAFT: CreateDraft = {
  name: '',
  emoji: '📋',
  color: '#4285F4',
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
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
      emoji: draft.emoji.trim() || '📋',
      color: draft.color,
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
            <Meta tone="secondary">{copy.common.close}</Meta>
          </View>
        </Pressable>
      )}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SurfaceCard elevated style={styles.card}>
          <View style={styles.label}>
            <Meta tone="soft">{copy.project.createTitle}</Meta>
            <TextInput
              autoFocus
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

          <View style={styles.label}>
            <Meta tone="soft">Emoji</Meta>
            <TextInput
              value={draft.emoji}
              onChangeText={next => { setDraft(d => ({ ...d, emoji: next })); }}
              placeholder="📋"
              placeholderTextColor={theme.colors.textTertiary}
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.borderSoft,
                  color: theme.colors.textPrimary,
                  fontSize: 24,
                },
              ]}
            />
          </View>
        </SurfaceCard>

        <SurfaceCard elevated style={styles.card}>
          <View style={styles.label}>
            <Meta tone="soft">{copy.project.changeMarkerTrigger}</Meta>
            <View style={styles.chipRow}>
              {COLOR_OPTIONS.map(option => {
                const active = draft.color === option.value;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    onPress={() => { setDraft(d => ({ ...d, color: option.value })); }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active ? theme.colors.surfaceInteractive : theme.colors.surface,
                        borderColor: active ? theme.colors.accentPrimaryPanelBorder : theme.colors.borderSoft,
                      },
                    ]}
                  >
                    <View style={styles.chipContent}>
                      <View style={[styles.colorDot, { backgroundColor: option.value }]} />
                      <Meta tone={active ? 'accent' : 'secondary'}>{option.label}</Meta>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
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
