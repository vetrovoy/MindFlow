import { StyleSheet, View } from 'react-native';

import { getFeedbackCardRole, type FeedbackCardVariant } from '@mindflow/ui';

import { useTheme } from '@shared/theme/use-theme';
import { Body, Title } from '../../typography';
import { SurfaceCard } from '../surface-card';

interface FeedbackCardProps {
  variant: FeedbackCardVariant;
  title: string;
  description?: string;
}

const styles = StyleSheet.create({
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  feedbackAccent: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function FeedbackCard({ variant, title, description }: FeedbackCardProps) {
  const { theme } = useTheme();
  const feedbackRole = getFeedbackCardRole({ variant, title, description });
  const accessibilityRole = feedbackRole === 'alert' ? 'alert' : undefined;
  const accentColor =
    variant === 'error'
      ? theme.colors.accentAlert
      : variant === 'loading'
        ? theme.colors.accentInfo
        : theme.colors.accentPrimary;

  return (
    <SurfaceCard elevated>
      <View accessibilityRole={accessibilityRole} style={styles.feedbackRow}>
        <View style={[styles.feedbackAccent, { backgroundColor: `${accentColor}22` }]}>
          <Title style={{ color: accentColor }}>
            {variant === 'error' ? '!' : variant === 'loading' ? '...' : '0'}
          </Title>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Title tone={variant === 'error' ? 'danger' : 'primary'}>{title}</Title>
          {description ? <Body tone="secondary">{description}</Body> : null}
        </View>
      </View>
    </SurfaceCard>
  );
}

export type { FeedbackCardProps };
