import {
  Text as RNText,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from 'react-native';
import { typography } from '@mindflow/ui';
import { useTheme } from '@shared/theme/use-theme';

type Variant =
  | 'display'
  | 'section'
  | 'title'
  | 'emphasis'
  | 'task'
  | 'body'
  | 'supportive'
  | 'caption'
  | 'badge'
  | 'meta';

interface ThemedTextProps extends TextProps {
  variant?: Variant;
  tone?: 'primary' | 'secondary' | 'soft' | 'muted' | 'accent' | 'danger';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
}

const FONT_FAMILY = {
  display: {
    regular: 'SpaceGrotesk-Regular',
    medium: 'SpaceGrotesk-Medium',
    semibold: 'SpaceGrotesk-SemiBold',
    bold: 'SpaceGrotesk-Bold',
    extrabold: 'SpaceGrotesk-Bold',
  },
  body: {
    regular: 'Manrope-Regular',
    medium: 'Manrope-Medium',
    semibold: 'Manrope-SemiBold',
    bold: 'Manrope-Bold',
    extrabold: 'Manrope-ExtraBold',
  },
  meta: {
    regular: 'SpaceMono-Regular',
    medium: 'SpaceMono-Regular',
    semibold: 'SpaceMono-Bold',
    bold: 'SpaceMono-Bold',
    extrabold: 'SpaceMono-Bold',
  },
} as const;

const FONT_MAP: Record<
  Variant,
  {
    family: keyof typeof FONT_FAMILY;
    fontSize: number;
    lineHeight: number;
    defaultWeight: ThemedTextProps['weight'];
  }
> = {
  display: {
    family: 'display',
    fontSize: typography.fontSize.display,
    lineHeight: 38,
    defaultWeight: 'bold',
  },
  section: {
    family: 'display',
    fontSize: typography.fontSize.section,
    lineHeight: 28,
    defaultWeight: 'semibold',
  },
  title: {
    family: 'display',
    fontSize: typography.fontSize.title,
    lineHeight: 22,
    defaultWeight: 'semibold',
  },
  emphasis: {
    family: 'display',
    fontSize: typography.fontSize.emphasis,
    lineHeight: 24,
    defaultWeight: 'medium',
  },
  task: {
    family: 'body',
    fontSize: typography.fontSize.task,
    lineHeight: 22,
    defaultWeight: 'semibold',
  },
  body: {
    family: 'body',
    fontSize: typography.fontSize.body,
    lineHeight: 20,
    defaultWeight: 'regular',
  },
  supportive: {
    family: 'body',
    fontSize: typography.fontSize.supportive,
    lineHeight: 18,
    defaultWeight: 'medium',
  },
  caption: {
    family: 'body',
    fontSize: typography.fontSize.supportive,
    lineHeight: 18,
    defaultWeight: 'regular',
  },
  badge: {
    family: 'meta',
    fontSize: typography.fontSize.badge,
    lineHeight: 14,
    defaultWeight: 'bold',
  },
  meta: {
    family: 'meta',
    fontSize: typography.fontSize.meta,
    lineHeight: 16,
    defaultWeight: 'regular',
  },
};

function resolveToneColor(
  theme: ReturnType<typeof useTheme>['theme'],
  tone: NonNullable<ThemedTextProps['tone']>,
) {
  switch (tone) {
    case 'secondary':
      return theme.colors.textSecondary;
    case 'soft':
      return theme.colors.textSoft;
    case 'muted':
      return theme.colors.textTertiary;
    case 'accent':
      return theme.colors.accentPrimary;
    case 'danger':
      return theme.colors.accentAlert;
    case 'primary':
    default:
      return theme.colors.textPrimary;
  }
}

function resolveTextStyle(
  variant: Variant,
  theme: ReturnType<typeof useTheme>['theme'],
  tone: NonNullable<ThemedTextProps['tone']>,
  weight?: ThemedTextProps['weight'],
): StyleProp<TextStyle> {
  const fontStyle = FONT_MAP[variant];
  const resolvedWeight = weight ?? fontStyle.defaultWeight ?? 'regular';
  return {
    color: resolveToneColor(theme, tone),
    fontFamily: FONT_FAMILY[fontStyle.family][resolvedWeight],
    fontSize: fontStyle.fontSize,
    lineHeight: fontStyle.lineHeight,
  };
}

export function Body({
  variant = 'body',
  tone = 'primary',
  weight,
  style,
  ...props
}: ThemedTextProps) {
  const { theme } = useTheme();
  return (
    <RNText
      style={[resolveTextStyle(variant, theme, tone, weight), style]}
      {...props}
    />
  );
}

export function Display(props: Omit<ThemedTextProps, 'variant'>) {
  return <Body variant="display" {...props} />;
}

export function SectionTitleText(props: Omit<ThemedTextProps, 'variant'>) {
  return <Body variant="section" {...props} />;
}

export function Title(props: Omit<ThemedTextProps, 'variant'>) {
  return <Body variant="title" {...props} />;
}

export function Meta(props: Omit<ThemedTextProps, 'variant'>) {
  return <Body variant="meta" {...props} />;
}
