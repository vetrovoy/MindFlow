import { Pressable, StyleSheet, View } from 'react-native';
import type { TaskPriority } from '@mindflow/domain';
import { getCopy } from '@mindflow/copy';

import { useTheme } from '@shared/theme/use-theme';
import { Body, Meta } from '../../typography';

const copy = getCopy('ru');
const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: copy.priority.low },
  { value: 'medium', label: copy.priority.medium },
  { value: 'high', label: copy.priority.high },
];

interface PrioritySelectProps {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  label?: string;
}

export function PrioritySelect({ value, onChange, label }: PrioritySelectProps) {
  const { theme } = useTheme();

  function getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case 'low': return theme.colors.accentInfo;
      case 'medium': return theme.colors.accentPrimary;
      case 'high': return theme.colors.accentAlert;
    }
  }

  return (
    <View style={styles.container}>
      {label != null ? <Meta tone="soft">{label}</Meta> : null}
      <View style={styles.row}>
        {PRIORITY_OPTIONS.map(option => {
          const active = value === option.value;
          const color = getPriorityColor(option.value);
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => { onChange(option.value); }}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? `${color}18` : theme.colors.surface,
                  borderColor: active ? color : theme.colors.borderSoft,
                },
              ]}
            >
              <Body
                numberOfLines={1}
                style={{
                  color: active ? color : theme.colors.textSecondary,
                  fontWeight: active ? '600' : '400',
                }}
              >
                {option.label}
              </Body>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export type { PrioritySelectProps };

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    minHeight: 40,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
