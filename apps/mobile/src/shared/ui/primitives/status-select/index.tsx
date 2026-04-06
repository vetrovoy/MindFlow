import { Pressable, StyleSheet, View } from 'react-native';
import type { TaskStatus } from '@mindflow/domain';

import { useTheme } from '@shared/theme/use-theme';
import { useCopy } from '@shared/lib/use-copy';
import { Body, Meta } from '../../typography';

interface StatusSelectProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  label?: string;
}

export function StatusSelect({ value, onChange, label }: StatusSelectProps) {
  const { theme } = useTheme();
  const copy = useCopy();

  const options = [
    { value: 'todo' as const, label: copy.status.todo },
    { value: 'done' as const, label: copy.status.done },
    { value: 'empty' as const, label: 'empty' },
  ];

  function getStatusColor(status: TaskStatus): string {
    switch (status) {
      case 'todo':
        return theme.colors.accentInfo;
      case 'done':
        return theme.colors.accentSuccessDeep;
    }
  }

  return (
    <View style={styles.container}>
      {label != null ? <Meta tone="soft">{label}</Meta> : null}
      <View style={styles.row}>
        {options.map(option => {
          if (option.value === 'empty' && option.value === 'empty') {
            return (
              <Pressable
                pointerEvents="none"
                key={option.value}
                accessibilityRole="button"
                style={[styles.chip, { borderColor: 'transparent' }]}
              ></Pressable>
            );
          }
          const active = value === option.value;
          const color = getStatusColor(option.value);
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => {
                onChange(option.value);
              }}
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
    borderWidth: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
