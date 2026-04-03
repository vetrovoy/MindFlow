import { StyleSheet, View } from 'react-native';

import { useTheme } from '@shared/theme/use-theme';
import { Meta } from '../../typography';

interface StatusPillProps {
  label: string;
  variant: 'today' | 'overdue' | 'neutral';
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },
});

export function StatusPill({ label, variant }: StatusPillProps) {
  const { theme } = useTheme();
  const tone =
    variant === 'overdue'
      ? theme.colors.accentAlert
      : variant === 'today'
        ? theme.colors.accentPrimary
        : theme.colors.textSecondary;

  return (
    <View style={[styles.pill, { backgroundColor: `${tone}14`, borderColor: `${tone}28` }]}>
      <Meta style={{ color: tone }}>{label.toUpperCase()}</Meta>
    </View>
  );
}

export type { StatusPillProps };
