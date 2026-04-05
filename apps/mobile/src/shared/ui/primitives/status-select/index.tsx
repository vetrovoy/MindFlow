import { Pressable, StyleSheet, View } from 'react-native';
import type { TaskStatus } from '@mindflow/domain';

import { useTheme } from '@shared/theme/use-theme';
import { Body, Meta } from '../../typography';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'В работе' },
  { value: 'done', label: 'Готово' },
];

interface StatusSelectProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  label?: string;
}

export function StatusSelect({ value, onChange, label }: StatusSelectProps) {
  const { theme } = useTheme();

  function getStatusColor(status: TaskStatus): string {
    switch (status) {
      case 'todo': return theme.colors.accentInfo;
      case 'done': return theme.colors.accentSuccessDeep;
    }
  }

  return (
    <View style={styles.container}>
      {label != null ? <Meta tone="soft">{label}</Meta> : null}
      <View style={styles.row}>
        {STATUS_OPTIONS.map(option => {
          const active = value === option.value;
          const color = getStatusColor(option.value);
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

export type { StatusSelectProps };

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
