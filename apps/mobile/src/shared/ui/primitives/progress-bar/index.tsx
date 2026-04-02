import { StyleSheet, View, type DimensionValue } from 'react-native';

import { getProgressValue } from '@mindflow/ui';

import { useTheme } from '@shared/theme/use-theme';

interface ProgressBarProps {
  value: number;
  max: number;
}

const styles = StyleSheet.create({
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
});

export function ProgressBar({ value, max }: ProgressBarProps) {
  const { theme } = useTheme();
  const width = `${Math.round(getProgressValue({ value, max }) * 100)}%` as DimensionValue;

  return (
    <View style={[styles.progressTrack, { backgroundColor: theme.colors.overlayGhost }]}>
      <View style={[styles.progressFill, { width, backgroundColor: theme.colors.accentPrimary }]} />
    </View>
  );
}

export type { ProgressBarProps };
