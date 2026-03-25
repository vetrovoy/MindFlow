import { tokens } from "@mindflow/ui";

function createRootVariables() {
  const entries = {
    // Colors
    "--mf-color-background": tokens.colors.background,
    "--mf-color-surface": tokens.colors.surface,
    "--mf-color-surface-elevated": tokens.colors.surfaceElevated,
    "--mf-color-border-soft": tokens.colors.borderSoft,
    "--mf-color-border-medium": tokens.colors.borderMedium,
    "--mf-color-border-strong": tokens.colors.borderStrong,
    "--mf-color-border-muted": tokens.colors.borderMuted,
    "--mf-color-text-primary": tokens.colors.textPrimary,
    "--mf-color-text-light": tokens.colors.textLight,
    "--mf-color-text-soft": tokens.colors.textSoft,
    "--mf-color-text-secondary": tokens.colors.textSecondary,
    "--mf-color-text-tertiary": tokens.colors.textTertiary,
    "--mf-color-text-muted": tokens.colors.textMuted,
    "--mf-color-surface-deep": "#0F1014",
    "--mf-color-overlay-scrim": "rgba(10, 10, 10, 0.7)",
    "--mf-color-overlay-handle": "rgba(255, 255, 255, 0.14)",
    "--mf-color-overlay-ghost": "rgba(255, 255, 255, 0.03)",
    "--mf-color-overlay-ghost-hover": "rgba(255, 255, 255, 0.07)",
    "--mf-color-shadow-card": "rgba(10, 10, 10, 0.18)",
    "--mf-color-shadow-overlay": "rgba(0, 0, 0, 0.58)",
    "--mf-color-spotlight-featured": "rgba(124, 58, 237, 0.22)",
    "--mf-color-accent-lime": tokens.colors.accentLime,
    "--mf-color-accent-lime-glow": tokens.colors.accentLimeGlow,
    "--mf-color-accent-lime-ring-soft": "rgba(196, 248, 42, 0.08)",
    "--mf-color-accent-lime-ring-medium": "rgba(196, 248, 42, 0.1)",
    "--mf-color-accent-lime-ring-strong": "rgba(196, 248, 42, 0.12)",
    "--mf-color-accent-lime-panel-border": "rgba(196, 248, 42, 0.18)",
    "--mf-color-accent-lime-panel-glow": "rgba(196, 248, 42, 0.14)",
    "--mf-color-accent-alert": tokens.colors.accentAlert,
    "--mf-color-accent-success-deep": tokens.colors.accentSuccessDeep,
    "--mf-color-accent-success-bright": tokens.colors.accentSuccessBright,
    "--mf-color-accent-featured-purple": tokens.colors.accentFeaturedPurple,
    "--mf-color-accent-featured-blue": tokens.colors.accentFeaturedBlue,

    // Gradients
    "--mf-gradient-featured-project-start": tokens.gradients.featuredProject[0],
    "--mf-gradient-featured-project-end": tokens.gradients.featuredProject[1],
    "--mf-gradient-success-start": tokens.gradients.success[0],
    "--mf-gradient-success-end": tokens.gradients.success[1],
    "--mf-gradient-premium-section-start": tokens.gradients.premiumSection[0],
    "--mf-gradient-premium-section-end": tokens.gradients.premiumSection[1],
    "--mf-gradient-premium-card-start": tokens.gradients.premiumCard[0],
    "--mf-gradient-premium-card-end": tokens.gradients.premiumCard[1],
    "--mf-gradient-overlay-depth-start": tokens.gradients.overlayDepth[0],
    "--mf-gradient-overlay-depth-end": tokens.gradients.overlayDepth[1],
    "--mf-gradient-bottom-fade-start": tokens.gradients.bottomFade[0],
    "--mf-gradient-bottom-fade-end": tokens.gradients.bottomFade[1],
    "--mf-gradient-app-background-start": tokens.gradients.overlayDepth[0],
    "--mf-gradient-app-background-end": tokens.colors.background,

    // Typography
    "--mf-font-display": tokens.typography.fontFallback.display.join(", "),
    "--mf-font-body": tokens.typography.fontFallback.body.join(", "),
    "--mf-font-meta": tokens.typography.fontFallback.meta.join(", "),
    "--mf-font-size-display": `${tokens.typography.fontSize.display}px`,
    "--mf-font-size-section": `${tokens.typography.fontSize.section}px`,
    "--mf-font-size-emphasis": `${tokens.typography.fontSize.emphasis}px`,
    "--mf-font-size-title": `${tokens.typography.fontSize.title}px`,
    "--mf-font-size-task": `${tokens.typography.fontSize.task}px`,
    "--mf-font-size-body": `${tokens.typography.fontSize.body}px`,
    "--mf-font-size-supportive": `${tokens.typography.fontSize.supportive}px`,
    "--mf-font-size-meta": `${tokens.typography.fontSize.meta}px`,
    "--mf-font-size-badge": `${tokens.typography.fontSize.badge}px`,

    // Radii
    "--mf-radius-xs": `${tokens.radii.xs}px`,
    "--mf-radius-sm": `${tokens.radii.sm}px`,
    "--mf-radius-md": `${tokens.radii.md}px`,
    "--mf-radius-lg": `${tokens.radii.lg}px`,
    "--mf-radius-xl": `${tokens.radii.xl}px`,
    "--mf-radius-xxl": `${tokens.radii.xxl}px`,
    "--mf-radius-card": `${tokens.radii.card}px`,
    "--mf-radius-pill": `${tokens.radii.pill}px`,

    // Spacing
    "--mf-space-xxs": `${tokens.spacing.xxs}px`,
    "--mf-space-xs": `${tokens.spacing.xs}px`,
    "--mf-space-sm": `${tokens.spacing.sm}px`,
    "--mf-space-md": `${tokens.spacing.md}px`,
    "--mf-space-lg": `${tokens.spacing.lg}px`,
    "--mf-space-xl": `${tokens.spacing.xl}px`,
    "--mf-space-2xl": `${tokens.spacing["2xl"]}px`,
    "--mf-space-3xl": `${tokens.spacing["3xl"]}px`,
    "--mf-space-4xl": `${tokens.spacing["4xl"]}px`,
    "--mf-space-5xl": `${tokens.spacing["5xl"]}px`,

    // Effects
    "--mf-effect-lime-glow": tokens.effects.limeGlow,
    "--mf-effect-background-blur": tokens.effects.backgroundBlur
  } as const;

  const body = Object.entries(entries)
    .map(([key, value]) => `${key}:${value};`)
    .join("");

  return `:root{${body}}`;
}

export function ThemeVariables() {
  return <style>{createRootVariables()}</style>;
}
