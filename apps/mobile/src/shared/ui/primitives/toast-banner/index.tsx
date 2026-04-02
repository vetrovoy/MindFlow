import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@shared/theme/use-theme';
import { Body, Title } from '../../typography';

interface ToastBannerProps {
  title: string;
  description?: string;
  variant?: 'success' | 'error' | 'info';
  onDismiss?: () => void;
}

const styles = StyleSheet.create({
  toastWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
  },
  toastPressable: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});

export function ToastBanner({ title, description, variant = 'info', onDismiss }: ToastBannerProps) {
  const { theme } = useTheme();
  const accent =
    variant === 'error'
      ? theme.colors.accentAlert
      : variant === 'success'
        ? theme.colors.accentSuccessDeep
        : theme.colors.accentInfo;

  return (
    <View pointerEvents="box-none" style={styles.toastWrap}>
      <Pressable
        accessibilityRole="button"
        onPress={onDismiss}
        style={[
          styles.toastPressable,
          {
            backgroundColor: theme.colors.surfaceGlass,
            borderColor: `${accent}40`,
          },
        ]}
      >
        <Title style={{ color: accent }}>{title}</Title>
        {description ? <Body tone="secondary">{description}</Body> : null}
      </Pressable>
    </View>
  );
}

export type { ToastBannerProps };
