export const tokens = {
  color: {
    background: "#0A0A0A",
    surface: "#18181B",
    accent: "#C4F82A",
    textPrimary: "#FFFFFF"
  },
  radius: {
    md: 12,
    lg: 16,
    pill: 100
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24
  }
} as const;

export type ButtonVariant = "primary" | "secondary";
