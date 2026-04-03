import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { getCopy } from '@mindflow/copy';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';
import { SectionHeader, SurfaceCard } from '@shared/ui/primitives';
import { Title } from '@shared/ui/typography';

const copy = getCopy('ru');

const DEFAULT_PROJECT_COLOR = '#4285F4';
const DEFAULT_PROJECT_EMOJI = '📋';

const styles = StyleSheet.create({
  row: {
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export function ProjectCreateFeature() {
  const { theme } = useTheme();
  const isSaving = useMobileAppStore(s => s.state.isSaving);
  const createProject = useMobileAppStore(s => s.actions.createProject);
  const [draftName, setDraftName] = useState('');

  async function handleSubmit() {
    const trimmed = draftName.trim();
    if (!trimmed) return;
    await createProject({
      name: trimmed,
      color: DEFAULT_PROJECT_COLOR,
      emoji: DEFAULT_PROJECT_EMOJI,
    });
    setDraftName('');
  }

  return (
    <SurfaceCard>
      <SectionHeader
        title={copy.quickCapture.createProjectTitle}
        subtitle={copy.quickCapture.createProjectDescription}
      />
      <View style={styles.row}>
        <TextInput
          editable={!isSaving}
          onChangeText={setDraftName}
          onSubmitEditing={() => {
            void handleSubmit();
          }}
          placeholder={copy.quickCapture.projectPlaceholder}
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
          value={draftName}
        />
        <Pressable
          accessibilityRole="button"
          disabled={isSaving || draftName.trim().length === 0}
          onPress={() => {
            void handleSubmit();
          }}
          style={[
            styles.submitButton,
            {
              backgroundColor:
                isSaving || draftName.trim().length === 0
                  ? theme.colors.overlayGhost
                  : theme.colors.surfaceInteractive,
              borderColor:
                isSaving || draftName.trim().length === 0
                  ? theme.colors.borderSoft
                  : theme.colors.accentPrimaryPanelBorder,
            },
          ]}
        >
          <View style={styles.buttonContent}>
            <Icon decorative name="add" size={16} tone={isSaving ? 'muted' : 'accent'} />
            <Title tone={isSaving ? 'muted' : 'accent'}>
              {isSaving ? copy.common.saving : copy.common.save}
            </Title>
          </View>
        </Pressable>
      </View>
    </SurfaceCard>
  );
}
