import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@shared/theme/use-theme';

interface SurfaceCardProps {
  children: ReactNode;
  elevated?: boolean;
  padded?: boolean;
  style?: ViewStyle;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardPadded: {
    padding: 16,
  },
});

export function SurfaceCard({ children, elevated = false, padded = true, style }: SurfaceCardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        padded && styles.cardPadded,
        {
          backgroundColor: elevated ? theme.colors.surfaceElevated : theme.colors.surfaceCard,
          borderColor: elevated ? theme.colors.borderMedium : theme.colors.borderSoft,
          shadowColor: theme.colors.shadowCard,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export type { SurfaceCardProps };
