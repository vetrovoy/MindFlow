import {
  controlSizes,
  effects,
  layoutSizes,
  radii,
  shape,
  spacing,
  typography,
  type ThemeDefinition
} from "@mindflow/ui";

import { useTheme } from "@/app/providers/theme-provider";

function createRootVariables(theme: ThemeDefinition) {
  const entries = {
    // Colors
    "--mf-color-background": theme.colors.background,
    "--mf-color-surface": theme.colors.surface,
    "--mf-color-surface-elevated": theme.colors.surfaceElevated,
    "--mf-color-surface-card": theme.colors.surfaceCard,
    "--mf-color-surface-glass": theme.colors.surfaceGlass,
    "--mf-color-border-soft": theme.colors.borderSoft,
    "--mf-color-border-medium": theme.colors.borderMedium,
    "--mf-color-border-strong": theme.colors.borderStrong,
    "--mf-color-border-muted": theme.colors.borderMuted,
    "--mf-color-text-primary": theme.colors.textPrimary,
    "--mf-color-text-light": theme.colors.textLight,
    "--mf-color-text-soft": theme.colors.textSoft,
    "--mf-color-text-secondary": theme.colors.textSecondary,
    "--mf-color-text-tertiary": theme.colors.textTertiary,
    "--mf-color-text-muted": theme.colors.textMuted,
    "--mf-color-surface-deep": theme.colors.surfaceDeep,
    "--mf-color-surface-interactive": theme.colors.surfaceInteractive,
    "--mf-color-surface-interactive-hover":
      theme.colors.surfaceInteractiveHover,
    "--mf-color-surface-interactive-active":
      theme.colors.surfaceInteractiveActive,
    "--mf-color-overlay-scrim": theme.colors.overlayScrim,
    "--mf-color-overlay-handle": theme.colors.overlayHandle,
    "--mf-color-overlay-ghost": theme.colors.overlayGhost,
    "--mf-color-overlay-ghost-hover": theme.colors.overlayGhostHover,
    "--mf-color-shadow-card": theme.colors.shadowCard,
    "--mf-color-shadow-overlay": theme.colors.shadowOverlay,
    "--mf-color-shadow-soft": theme.colors.shadowSoft,
    "--mf-color-shadow-strong": theme.colors.shadowStrong,
    "--mf-color-spotlight-featured": theme.colors.spotlightFeatured,
    "--mf-color-accent-primary": theme.colors.accentPrimary,
    "--mf-color-accent-primary-glow": theme.colors.accentPrimaryGlow,
    "--mf-color-accent-primary-ring-soft": theme.colors.accentPrimaryRingSoft,
    "--mf-color-accent-primary-ring-medium":
      theme.colors.accentPrimaryRingMedium,
    "--mf-color-accent-primary-ring-strong":
      theme.colors.accentPrimaryRingStrong,
    "--mf-color-accent-primary-panel-border":
      theme.colors.accentPrimaryPanelBorder,
    "--mf-color-accent-primary-panel-glow": theme.colors.accentPrimaryPanelGlow,
    "--mf-color-accent-alert": theme.colors.accentAlert,
    "--mf-color-accent-success-deep": theme.colors.accentSuccessDeep,
    "--mf-color-accent-success-bright": theme.colors.accentSuccessBright,
    "--mf-color-accent-info": theme.colors.accentInfo,
    "--mf-color-accent-info-soft": theme.colors.accentInfoSoft,
    "--mf-color-accent-featured-purple": theme.colors.accentFeaturedPurple,
    "--mf-color-accent-featured-blue": theme.colors.accentFeaturedBlue,

    // Surface recipes
    "--mf-surface-shell":
      "linear-gradient(180deg, color-mix(in srgb, var(--mf-color-surface-glass) 88%, transparent), color-mix(in srgb, var(--mf-color-surface-card) 96%, transparent))",
    "--mf-surface-shell-strong":
      "linear-gradient(180deg, color-mix(in srgb, var(--mf-color-surface-glass) 94%, transparent), color-mix(in srgb, var(--mf-color-surface-card) 96%, transparent))",
    "--mf-surface-hero":
      "radial-gradient(circle at top left, color-mix(in srgb, var(--mf-color-accent-primary) 9%, transparent), transparent 40%), linear-gradient(180deg, color-mix(in srgb, var(--mf-color-surface-elevated) 94%, var(--mf-color-surface-deep)), color-mix(in srgb, var(--mf-color-surface-deep) 95%, var(--mf-color-background)))",
    "--mf-surface-popover":
      "radial-gradient(circle at top left, color-mix(in srgb, var(--mf-color-accent-primary) 8%, transparent), transparent 42%), color-mix(in srgb, var(--mf-color-surface-glass) 94%, var(--mf-color-surface-card))",
    "--mf-surface-panel-muted":
      "color-mix(in srgb, var(--mf-color-surface-deep) 94%, transparent)",
    "--mf-border-shell":
      "color-mix(in srgb, var(--mf-color-border-strong) 84%, transparent)",
    "--mf-highlight-hover":
      "0 0 0 1px var(--mf-color-accent-primary-ring-medium), 0 0 0 5px var(--mf-color-accent-primary-ring-strong)",
    "--mf-highlight-active":
      "0 0 0 1px var(--mf-color-accent-primary-ring-medium), inset 0 0 0 1px var(--mf-color-accent-primary-ring-soft)",
    "--mf-shadow-shell":
      "inset 0 1px 0 color-mix(in srgb, var(--mf-color-text-primary) 8%, transparent), 0 10px 24px var(--mf-color-shadow-soft)",
    "--mf-shadow-floating":
      "inset 0 1px 0 color-mix(in srgb, var(--mf-color-text-primary) 6%, transparent), 0 20px 44px var(--mf-color-shadow-strong)",
    "--mf-inset-highlight-soft":
      "inset 0 1px 0 color-mix(in srgb, var(--mf-color-text-primary) 6%, transparent)",
    "--mf-inset-highlight-strong":
      "inset 0 1px 0 color-mix(in srgb, var(--mf-color-text-primary) 12%, transparent)",

    // Gradients
    "--mf-gradient-featured-project-start": theme.gradients.featuredProject[0],
    "--mf-gradient-featured-project-end": theme.gradients.featuredProject[1],
    "--mf-gradient-success-start": theme.gradients.success[0],
    "--mf-gradient-success-end": theme.gradients.success[1],
    "--mf-gradient-premium-section-start": theme.gradients.premiumSection[0],
    "--mf-gradient-premium-section-end": theme.gradients.premiumSection[1],
    "--mf-gradient-premium-card-start": theme.gradients.premiumCard[0],
    "--mf-gradient-premium-card-end": theme.gradients.premiumCard[1],
    "--mf-gradient-overlay-depth-start": theme.gradients.overlayDepth[0],
    "--mf-gradient-overlay-depth-end": theme.gradients.overlayDepth[1],
    "--mf-gradient-bottom-fade-start": theme.gradients.bottomFade[0],
    "--mf-gradient-bottom-fade-end": theme.gradients.bottomFade[1],
    "--mf-gradient-app-background-start": theme.gradients.appBackground[0],
    "--mf-gradient-app-background-end": theme.gradients.appBackground[1],

    // Typography
    "--mf-font-display": typography.fontFallback.display.join(", "),
    "--mf-font-body": typography.fontFallback.body.join(", "),
    "--mf-font-meta": typography.fontFallback.meta.join(", "),
    "--mf-font-size-display": `${typography.fontSize.display}px`,
    "--mf-font-size-section": `${typography.fontSize.section}px`,
    "--mf-font-size-emphasis": `${typography.fontSize.emphasis}px`,
    "--mf-font-size-title": `${typography.fontSize.title}px`,
    "--mf-font-size-task": `${typography.fontSize.task}px`,
    "--mf-font-size-body": `${typography.fontSize.body}px`,
    "--mf-font-size-supportive": `${typography.fontSize.supportive}px`,
    "--mf-font-size-meta": `${typography.fontSize.meta}px`,
    "--mf-font-size-badge": `${typography.fontSize.badge}px`,

    // Radii
    "--mf-radius-xs": `${radii.xs}px`,
    "--mf-radius-sm": `${radii.sm}px`,
    "--mf-radius-md": `${radii.md}px`,
    "--mf-radius-lg": `${radii.lg}px`,
    "--mf-radius-xl": `${radii.xl}px`,
    "--mf-radius-xxl": `${radii.xxl}px`,
    "--mf-radius-card": `${radii.card}px`,
    "--mf-radius-pill": `${radii.pill}px`,

    // Shape
    "--mf-shape-shell-radius": `${shape.shellRadius}px`,
    "--mf-shape-popover-radius": `${shape.popoverRadius}px`,
    "--mf-shape-capsule-radius": `${shape.capsuleRadius}px`,
    "--mf-shape-control-radius": `${shape.controlRadius}px`,
    "--mf-shape-compact-radius": `${shape.compactRadius}px`,

    // Spacing
    "--mf-space-xxs": `${spacing.xxs}px`,
    "--mf-space-xs": `${spacing.xs}px`,
    "--mf-space-sm": `${spacing.sm}px`,
    "--mf-space-md": `${spacing.md}px`,
    "--mf-space-lg": `${spacing.lg}px`,
    "--mf-space-xl": `${spacing.xl}px`,
    "--mf-space-2xl": `${spacing["2xl"]}px`,
    "--mf-space-3xl": `${spacing["3xl"]}px`,
    "--mf-space-4xl": `${spacing["4xl"]}px`,
    "--mf-space-5xl": `${spacing["5xl"]}px`,

    // Control sizes
    "--mf-size-icon-button": `${controlSizes.iconButton}px`,
    "--mf-size-dock-button": `${controlSizes.dockButton}px`,
    "--mf-size-field": `${controlSizes.field}px`,
    "--mf-size-compact-field": `${controlSizes.compactField}px`,
    "--mf-size-inline-button": `${controlSizes.inlineButton}px`,
    "--mf-size-calendar-nav": `${controlSizes.calendarNav}px`,
    "--mf-size-checkbox": `${controlSizes.checkbox}px`,

    // Layout sizes
    "--mf-layout-popover-width": `${layoutSizes.popoverWidth}px`,
    "--mf-layout-popover-width-mobile": `${layoutSizes.popoverWidthMobile}px`,
    "--mf-layout-modal-width-task": `${layoutSizes.modalWidthTask}px`,
    "--mf-layout-modal-width-wide": `${layoutSizes.modalWidthWide}px`,
    "--mf-layout-status-viewport-width": `${layoutSizes.statusViewportWidth}px`,

    // Effects
    "--mf-effect-primary-glow": theme.colors.accentPrimaryGlow,
    "--mf-effect-background-blur": effects.backgroundBlur,
    "--mf-effect-shell-blur": effects.shellBlur,
    "--mf-effect-hero-glow-blur": effects.heroGlowBlur
  } as const;

  const body = Object.entries(entries)
    .map(([key, value]) => `${key}:${value};`)
    .join("");

  return `:root{${body}}`;
}

export function ThemeVariables() {
  const { definition } = useTheme();

  return <style>{createRootVariables(definition)}</style>;
}
