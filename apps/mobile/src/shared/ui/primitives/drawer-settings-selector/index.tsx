import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';
import { BottomSheet } from '../bottom-sheet';
import { Body, Meta } from '../../typography';
import type { IconName } from '@mindflow/ui';

interface DrawerSettingsOption<T> {
  value: T;
  label: string;
  preview?: React.ReactNode;
}

interface DrawerSettingsSelectorProps<T> {
  icon: IconName;
  triggerLabel: string;
  currentLabel: string;
  options: DrawerSettingsOption<T>[];
  value: T;
  onSelect: (value: T) => void;
  sheetTitle: string;
}

export function DrawerSettingsSelector<T extends string>({
  icon,
  triggerLabel,
  currentLabel,
  options,
  value,
  onSelect,
  sheetTitle,
}: DrawerSettingsSelectorProps<T>) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => { setIsOpen(true); }}
        style={[styles.trigger, { backgroundColor: theme.colors.surface }]}
      >
        <Icon decorative name={icon} size={20} tone="muted" />
        <Body tone="primary">{triggerLabel}</Body>
        <View style={styles.flex} />
        <Meta tone="secondary">{currentLabel}</Meta>
      </Pressable>

      <BottomSheet
        visible={isOpen}
        title={sheetTitle}
        onClose={() => { setIsOpen(false); }}
      >
        <View style={styles.options}>
          {options.map(option => {
            const active = value === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                onPress={() => { onSelect(option.value); setIsOpen(false); }}
                style={[
                  styles.option,
                  {
                    backgroundColor: active ? theme.colors.surfaceInteractive : theme.colors.surface,
                    borderColor: active ? theme.colors.accentPrimaryPanelBorder : theme.colors.borderSoft,
                    borderWidth: active ? 1 : 0,
                  },
                ]}
              >
                {option.preview}
                <Body tone={active ? 'primary' : 'secondary'}>{option.label}</Body>
                <View style={styles.flex} />
                {active && <Icon decorative name="check" size={16} tone="accent" />}
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 12,
  },
  options: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  flex: { flex: 1 },
});
