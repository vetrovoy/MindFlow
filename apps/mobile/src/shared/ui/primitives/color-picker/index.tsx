import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import RNColorPicker, { Panel5 } from 'reanimated-color-picker';
import type { ColorFormatsObject } from 'reanimated-color-picker';

import { useTheme } from '@shared/theme/use-theme';
import { BottomSheet } from '../bottom-sheet';
import { Body, Meta } from '../../typography';

const DEFAULT_TITLE = 'Выберите цвет';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  colors?: string[];
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  function handleCompleteJS(result: ColorFormatsObject) {
    onChange(result.hex);
    setIsOpen(false);
  }

  return (
    <>
      {label != null ? <Meta tone="soft">{label}</Meta> : null}
      <Pressable
        accessibilityRole="button"
        onPress={() => { setIsOpen(true); }}
        style={[
          styles.trigger,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.borderSoft,
          },
        ]}
      >
        <View style={[styles.swatch, { backgroundColor: value || theme.colors.borderMuted }]} />
        <Body tone={value ? 'primary' : 'secondary'}>
          {value || '—'}
        </Body>
      </Pressable>

      <BottomSheet
        visible={isOpen}
        title={DEFAULT_TITLE}
        onClose={() => { setIsOpen(false); }}
      >
        <RNColorPicker
          value={value || '#4285F4'}
          onCompleteJS={handleCompleteJS}
          style={styles.picker}
        >
          <Panel5 style={styles.panel} />
        </RNColorPicker>
      </BottomSheet>
    </>
  );
}

export type { ColorPickerProps };

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  swatch: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  picker: {
    width: '100%',
  },
  panel: {
    borderRadius: 12,
  },
});
