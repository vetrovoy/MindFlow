import { useCallback } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useCopy } from '@shared/lib/use-copy';
import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';

const SEARCH_INPUT_HEIGHT = 48;

interface SearchFieldProps {
  value: string;
  onChange: (text: string) => void;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: SEARCH_INPUT_HEIGHT,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});

export function SearchField({ value, onChange }: SearchFieldProps) {
  const { theme } = useTheme();
  const copy = useCopy();

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderSoft },
      ]}
    >
      <Icon decorative name="search" size={18} tone="muted" />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={copy.search.fieldPlaceholder}
        placeholderTextColor={theme.colors.textTertiary}
        style={[styles.input, { color: theme.colors.textPrimary }]}
      />
      {value.length > 0 && (
        <Pressable onPress={handleClear}>
          <Icon decorative name="close" size={16} tone="muted" />
        </Pressable>
      )}
    </View>
  );
}
