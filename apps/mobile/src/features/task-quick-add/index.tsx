import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import RNDatePicker from 'react-native-date-picker';

import { useMobileAppStore } from '@shared/model/app-store-provider';
import { useTheme } from '@shared/theme/use-theme';
import { useCopy } from '@shared/lib/use-copy';
import { Icon } from '@shared/ui/icons';
import { SurfaceCard } from '@shared/ui/primitives';
import { Meta } from '@shared/ui/typography';


interface TaskQuickAddFeatureProps {
  preferredDate?: string | null;
}

const styles = StyleSheet.create({
  card: { padding: 10, gap: 8 },
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
});

function toDate(iso: string): Date {
  const parsed = iso ? new Date(iso) : null;
  return parsed != null && !Number.isNaN(parsed.getTime())
    ? parsed
    : new Date();
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function TaskQuickAddFeature({
  preferredDate,
}: TaskQuickAddFeatureProps) {
  const { theme } = useTheme();
  const copy = useCopy();
  const isSaving = useMobileAppStore(s => s.state.isSaving);
  const addInboxTask = useMobileAppStore(s => s.actions.addInboxTask);
  const [draftTitle, setDraftTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(
    preferredDate ?? null,
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    setSelectedDate(preferredDate ?? null);
  }, [preferredDate]);

  const isDisabled = isSaving || draftTitle.trim().length === 0;

  async function handleSubmit() {
    const trimmed = draftTitle.trim();
    if (!trimmed) return;
    const saved = await addInboxTask({
      title: trimmed,
      dueDate: selectedDate ?? null,
    });
    if (saved) {
      setDraftTitle('');
      setSelectedDate(preferredDate ?? null);
    }
  }

  function handleDateConfirm(date: Date) {
    setSelectedDate(toIsoDate(date));
    setIsDatePickerOpen(false);
  }

  function handleDateCancel() {
    setSelectedDate(preferredDate ?? null);
    setIsDatePickerOpen(false);
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
        {selectedDate != null && (
          <Meta tone="primary">
            {selectedDate}
          </Meta>
        )}
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setIsDatePickerOpen(true);
          }}
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.overlayGhost,
              borderColor: theme.colors.accentPrimaryGlow,
            },
          ]}
        >
          <Icon
            decorative
            name="nav-today"
            size={14}
            tone={selectedDate ? 'accent' : 'muted'}
          />
        </Pressable>
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
              backgroundColor: theme.colors.overlayGhost,
              borderColor: theme.colors.accentPrimaryGlow,
            },
          ]}
        >
          <Icon
            decorative
            name="add"
            size={18}
            tone={!isDisabled ? 'accent' : 'muted'}
          />
        </Pressable>
      </View>

      <RNDatePicker
        modal
        open={isDatePickerOpen}
        date={selectedDate ? toDate(selectedDate) : new Date()}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
      />
    </SurfaceCard>
  );
}
