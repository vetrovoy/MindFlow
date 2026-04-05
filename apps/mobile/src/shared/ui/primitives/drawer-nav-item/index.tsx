import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '@shared/ui/icons';
import { Body } from '@shared/ui/typography';
import type { IconName } from '@mindflow/ui';

interface DrawerNavItemProps {
  icon: IconName;
  label: string;
  active: boolean;
  onPress: () => void;
}

export function DrawerNavItem({
  icon,
  label,
  active,
  onPress,
}: DrawerNavItemProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.row]}
    >
      <Icon
        decorative
        name={icon}
        size={20}
        tone={active ? 'accent' : 'muted'}
      />
      <Body tone={active ? 'accent' : 'primary'}>{label}</Body>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
