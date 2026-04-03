import type {
  ButtonVariant,
  FeedbackCardVariant,
  InlineStatusVariant,
  StatusBadgeVariant
} from "../contracts";
import { DEFAULT_THEME, getTheme } from "../themes";
import { radii, spacing, typography } from "../tokens";

const defaultTheme = getTheme(DEFAULT_THEME);

export const buttonPresets: Record<
  ButtonVariant,
  {
    background: string;
    foreground: string;
    borderColor: string;
    radius: number;
    paddingX: number;
    paddingY: number;
  }
> = {
  primary: {
    background: defaultTheme.colors.accentPrimary,
    foreground: defaultTheme.colors.background,
    borderColor: defaultTheme.colors.accentPrimary,
    radius: radii.xl,
    paddingX: spacing["4xl"],
    paddingY: spacing.lg
  },
  secondary: {
    background: defaultTheme.colors.surfaceElevated,
    foreground: defaultTheme.colors.textPrimary,
    borderColor: defaultTheme.colors.borderStrong,
    radius: radii.xl,
    paddingX: spacing["4xl"],
    paddingY: spacing.lg
  }
};

export const statusBadgePresets: Record<
  StatusBadgeVariant,
  {
    background: string;
    foreground: string;
    borderColor: string;
  }
> = {
  today: {
    background: defaultTheme.colors.surfaceElevated,
    foreground: defaultTheme.colors.accentPrimary,
    borderColor: defaultTheme.colors.borderStrong
  },
  overdue: {
    background: defaultTheme.colors.surfaceElevated,
    foreground: defaultTheme.colors.accentAlert,
    borderColor: defaultTheme.colors.borderStrong
  }
};

export const feedbackCardPresets: Record<
  FeedbackCardVariant,
  {
    titleColor: string;
    descriptionColor: string;
    borderColor: string;
    background: string;
  }
> = {
  error: {
    titleColor: defaultTheme.colors.accentAlert,
    descriptionColor: defaultTheme.colors.textSecondary,
    borderColor: defaultTheme.colors.accentAlert,
    background: defaultTheme.colors.surface
  },
  loading: {
    titleColor: defaultTheme.colors.textPrimary,
    descriptionColor: defaultTheme.colors.textSecondary,
    borderColor: defaultTheme.colors.borderMedium,
    background: defaultTheme.colors.surface
  },
  empty: {
    titleColor: defaultTheme.colors.textPrimary,
    descriptionColor: defaultTheme.colors.textSecondary,
    borderColor: defaultTheme.colors.borderMuted,
    background: defaultTheme.colors.surface
  }
};

export const inlineStatusPresets: Record<
  InlineStatusVariant,
  {
    color: string;
    fontFamily: string;
    fontSize: number;
  }
> = {
  loading: {
    color: defaultTheme.colors.textSecondary,
    fontFamily: typography.fontFamily.meta,
    fontSize: typography.fontSize.meta
  },
  error: {
    color: defaultTheme.colors.accentAlert,
    fontFamily: typography.fontFamily.meta,
    fontSize: typography.fontSize.meta
  }
};

export const projectCardPreset = {
  backgroundGradient: defaultTheme.gradients.featuredProject,
  foreground: defaultTheme.colors.textPrimary,
  borderColor: defaultTheme.colors.borderStrong,
  radius: radii.card,
  padding: spacing["4xl"]
} as const;
