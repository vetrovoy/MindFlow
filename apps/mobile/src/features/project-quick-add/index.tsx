import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { useCopy } from '@shared/lib/use-copy';
import { Icon } from '@shared/ui/icons';
import { SurfaceCard } from '@shared/ui/primitives';

const DEFAULT_PROJECT_COLOR = '#4285F4';
const DEFAULT_PROJECT_EMOJI = '📋';

const styles = StyleSheet.create({
  card: { padding: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

export function ProjectQuickAddFeature() {
  const { theme } = useTheme();
  const copy = useCopy();
  const isSaving = useMobileAppStore(s => s.state.isSaving);
  const createProject = useMobileAppStore(s => s.actions.createProject);
  const [draftName, setDraftName] = useState('');

  const isDisabled = isSaving || draftName.trim().length === 0;

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
    <SurfaceCard style={styles.card}>
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
          disabled={isDisabled}
          onPress={() => {
            void handleSubmit();
          }}
          testID="project-create-submit"
          style={[
            styles.button,
            {
              backgroundColor: isDisabled
                ? theme.colors.overlayGhost
                : theme.colors.accentPrimary,
              borderColor: isDisabled
                ? theme.colors.accentPrimaryGlow
                : theme.colors.surfaceInteractive,
            },
          ]}
        >
          <Icon
            decorative
            name="add"
            size={18}
            tone={isDisabled ? 'accent' : 'contrast'}
          />
        </Pressable>
      </View>
    </SurfaceCard>
  );
}
