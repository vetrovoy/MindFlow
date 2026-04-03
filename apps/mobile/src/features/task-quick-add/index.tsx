import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { getCopy } from '@mindflow/copy';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';
import { SurfaceCard } from '@shared/ui/primitives';

const copy = getCopy('ru');

interface TaskQuickAddFeatureProps {
  preferredDate?: string | null;
}

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

export function TaskQuickAddFeature({ preferredDate }: TaskQuickAddFeatureProps) {
  const { theme } = useTheme();
  const isSaving = useMobileAppStore(s => s.state.isSaving);
  const addInboxTask = useMobileAppStore(s => s.actions.addInboxTask);
  const [draftTitle, setDraftTitle] = useState('');

  const isDisabled = isSaving || draftTitle.trim().length === 0;

  async function handleSubmit() {
    const trimmed = draftTitle.trim();
    if (!trimmed) return;
    const saved = await addInboxTask({ title: trimmed, dueDate: preferredDate ?? null });
    if (saved) setDraftTitle('');
  }

  return (
    <SurfaceCard style={styles.card}>
      <View style={styles.row}>
        <TextInput
          editable={!isSaving}
          onChangeText={setDraftTitle}
          onSubmitEditing={() => {
            void handleSubmit();
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
          disabled={isDisabled}
          onPress={() => {
            void handleSubmit();
          }}
          testID="quick-add-submit"
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
