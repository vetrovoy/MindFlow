import {
  buttonPresets,
  getProgressValue,
  projectCardPreset,
  statusBadgePresets,
  tokens
} from "@mindflow/ui";

export function TaskListEntity() {
  const progress = getProgressValue({ value: 1, max: 4 });

  return (
    <section
      style={{
        marginTop: tokens.spacing.lg,
        color: tokens.colors.textPrimary,
        background: `linear-gradient(135deg, ${projectCardPreset.backgroundGradient[0]}, ${projectCardPreset.backgroundGradient[1]})`,
        border: `1px solid ${projectCardPreset.borderColor}`,
        borderRadius: projectCardPreset.radius,
        padding: projectCardPreset.padding
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: tokens.spacing.sm,
          padding: `${tokens.spacing.xs}px ${tokens.spacing.xl}px`,
          borderRadius: tokens.radii.pill,
          background: statusBadgePresets.today.background,
          color: statusBadgePresets.today.foreground,
          border: `1px solid ${statusBadgePresets.today.borderColor}`
        }}
      >
        Today
      </div>
      <h2
        style={{
          marginTop: tokens.spacing.xl,
          fontFamily: tokens.typography.fontFamily.display,
          fontSize: tokens.typography.fontSize.section
        }}
      >
        Shared UI shell is ready
      </h2>
      <p
        style={{
          color: tokens.colors.textLight,
          fontFamily: tokens.typography.fontFamily.body,
          fontSize: tokens.typography.fontSize.body
        }}
      >
        Tokens, icon mapping, presets, and contracts are now available from
        `@mindflow/ui`.
      </p>
      <div
        style={{
          marginTop: tokens.spacing.xl,
          height: tokens.spacing.md,
          background: tokens.colors.surface,
          borderRadius: tokens.radii.pill,
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: buttonPresets.primary.background
          }}
        />
      </div>
    </section>
  );
}
