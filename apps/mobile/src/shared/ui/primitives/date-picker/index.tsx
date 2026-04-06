import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import RNDatePicker from 'react-native-date-picker';

import { useTheme } from '@shared/theme/use-theme';
import { Body, Meta } from '../../typography';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  mode?: 'date' | 'time' | 'datetime';
  visible?: boolean;
  onDismiss?: () => void;
  label?: string;
}

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

export function DatePicker({
  value,
  onChange,
  mode: _mode = 'date',
  visible = false,
  onDismiss,
  label,
}: DatePickerProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(visible);

  function handlePress() {
    setIsOpen(true);
  }

  function handleConfirm(date: Date) {
    onChange(toIsoDate(date));
    setIsOpen(false);
  }

  function handleCancel() {
    setIsOpen(false);
    onDismiss?.();
  }

  return (
    <View style={styles.container}>
      {label != null ? <Meta tone="soft">{label}</Meta> : null}
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        style={[
          styles.trigger,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderSoft,
          },
        ]}
      >
        <Body tone={value ? 'primary' : 'secondary'}>{value || '—'}</Body>
      </Pressable>
      <RNDatePicker
        modal
        open={isOpen}
        date={toDate(value)}
        mode={'date'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
}

export type { DatePickerProps };

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  trigger: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
  },
});
