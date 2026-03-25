import type {
  ButtonVariant,
  FeedbackCardVariant,
  InlineStatusVariant,
  StatusBadgeVariant
} from "./contracts";
import { colors, gradients, radii, spacing, typography } from "./tokens";

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
    background: colors.accentLime,
    foreground: colors.background,
    borderColor: colors.accentLime,
    radius: radii.xl,
    paddingX: spacing["4xl"],
    paddingY: spacing.lg
  },
  secondary: {
    background: colors.surfaceElevated,
    foreground: colors.textPrimary,
    borderColor: colors.borderStrong,
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
    background: colors.surfaceElevated,
    foreground: colors.accentLime,
    borderColor: colors.borderStrong
  },
  overdue: {
    background: colors.surfaceElevated,
    foreground: colors.accentAlert,
    borderColor: colors.borderStrong
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
    titleColor: colors.accentAlert,
    descriptionColor: colors.textSecondary,
    borderColor: colors.accentAlert,
    background: colors.surface
  },
  loading: {
    titleColor: colors.textPrimary,
    descriptionColor: colors.textSecondary,
    borderColor: colors.borderMedium,
    background: colors.surface
  },
  empty: {
    titleColor: colors.textPrimary,
    descriptionColor: colors.textSecondary,
    borderColor: colors.borderMuted,
    background: colors.surface
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
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.meta,
    fontSize: typography.fontSize.meta
  },
  error: {
    color: colors.accentAlert,
    fontFamily: typography.fontFamily.meta,
    fontSize: typography.fontSize.meta
  }
};

export const projectCardPreset = {
  backgroundGradient: gradients.featuredProject,
  foreground: colors.textPrimary,
  borderColor: colors.borderStrong,
  radius: radii.card,
  padding: spacing["4xl"]
} as const;
