import { StyleSheet, View } from 'react-native';

import { getFeedbackCardRole, type FeedbackCardVariant } from '@mindflow/ui';

import { useTheme } from '@shared/theme/use-theme';
import { Icon } from '../../icons';
import { Body, Title } from '../../typography';

interface StateCardProps {
  variant: FeedbackCardVariant;
  title: string;
  description?: string;
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  accent: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 2,
  },
});

function getStatePresentation(variant: FeedbackCardVariant) {
  switch (variant) {
    case 'error':
      return { iconName: 'close' as const, tone: 'alert' as const };
    case 'loading':
      return { iconName: 'search' as const, tone: 'accent' as const };
    case 'empty':
    default:
      return { iconName: 'checkbox-empty' as const, tone: 'muted' as const };
  }
}

export function StateCard({ variant, title, description }: StateCardProps) {
  const { theme } = useTheme();
  const feedbackRole = getFeedbackCardRole({ variant, title, description });
  const accessibilityRole = feedbackRole === 'alert' ? 'alert' : undefined;
  const { iconName, tone } = getStatePresentation(variant);
  const accentColor =
    tone === 'alert'
      ? theme.colors.accentAlert
      : tone === 'accent'
        ? theme.colors.accentPrimary
        : theme.colors.textSecondary;

  return (
    <View
      accessibilityRole={accessibilityRole}
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.surface,
          borderColor:
            variant === 'error'
              ? `${theme.colors.accentAlert}22`
              : theme.colors.borderSoft,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: `${accentColor}18` }]}>
        <Icon decorative name={iconName} size={16} tone={tone} />
      </View>
      <View style={styles.content}>
        <Title tone={variant === 'error' ? 'danger' : 'primary'}>{title}</Title>
        {description ? <Body tone="secondary">{description}</Body> : null}
      </View>
    </View>
  );
}

export type { StateCardProps };
