import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@shared/theme/use-theme';
import { Body } from '../../typography';

interface AccentButtonProps extends PressableProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
});

export function AccentButton({ children, style, ...props }: AccentButtonProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      {...props}
      style={[
        styles.button,
        {
          borderColor: theme.colors.accentPrimaryPanelBorder,
          backgroundColor: theme.colors.surfaceInteractive,
        },
        style,
      ]}
    >
      <Body weight="semibold" tone="accent">
        {children}
      </Body>
    </Pressable>
  );
}

export type { AccentButtonProps };
