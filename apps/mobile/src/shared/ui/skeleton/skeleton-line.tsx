import { useEffect } from 'react';
import { StyleSheet, type DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@shared/theme/use-theme';

interface SkeletonLineProps {
  width?: DimensionValue;
  height?: number;
}

const styles = StyleSheet.create({
  line: {
    borderRadius: 8,
  },
});

export function SkeletonLine({
  width = '100%',
  height = 16,
}: SkeletonLineProps) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 }),
      ),
      -1,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.line,
        {
          width,
          height,
          backgroundColor: theme.colors.textTertiary,
        },
        animatedStyle,
      ]}
    />
  );
}
