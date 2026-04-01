import { Text as RNText, type TextProps } from 'react-native';
import { useTheme } from '@shared/theme/use-theme';

type Variant = 'display' | 'title' | 'body' | 'caption' | 'meta';

interface ThemedTextProps extends TextProps {
  variant?: Variant;
}

const FONT_MAP: Record<Variant, { fontFamily: string; fontSize: number; lineHeight: number }> = {
  display:  { fontFamily: 'SpaceGrotesk-Bold',    fontSize: 24, lineHeight: 32 },
  title:    { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 18, lineHeight: 26 },
  body:     { fontFamily: 'Manrope-Regular',       fontSize: 15, lineHeight: 22 },
  caption:  { fontFamily: 'Manrope-Medium',        fontSize: 13, lineHeight: 18 },
  meta:     { fontFamily: 'SpaceMono-Regular',     fontSize: 11, lineHeight: 16 },
};

export function Body({ variant = 'body', style, ...props }: ThemedTextProps) {
  const { theme } = useTheme();
  const fontStyle = FONT_MAP[variant];
  return (
    <RNText
      style={[{ color: theme.colors.textPrimary, ...fontStyle }, style]}
      {...props}
    />
  );
}
