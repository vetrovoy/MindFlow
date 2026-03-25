export const colors = {
  background: "#0A0A0A",
  surface: "#18181B",
  surfaceElevated: "#27272A",
  borderSoft: "#31313A",
  borderMedium: "#32323A",
  borderStrong: "#34343B",
  borderMuted: "#3F3F46",
  textPrimary: "#FFFFFF",
  textLight: "#D4D4D8",
  textSoft: "#B3B3BC",
  textSecondary: "#A1A1AA",
  textTertiary: "#71717A",
  textMuted: "#52525B",
  accentLime: "#C4F82A",
  accentLimeGlow: "#C4F82A25",
  accentAlert: "#FA541C",
  accentSuccessDeep: "#C4F82A",
  accentSuccessBright: "#C4F82A",
  accentFeaturedPurple: "#7C3AED",
  accentFeaturedBlue: "#2563EB"
} as const;

export const gradients = {
  featuredProject: ["#7C3AED", "#2563EB"],
  success: ["#c5f82ace", "#C4F82A"],
  premiumSection: ["#1A1A1D", "#141417"],
  premiumCard: ["#1C1C21", "#141419"],
  overlayDepth: ["#111214", "#0A0A0A"],
  bottomFade: ["#0A0A0A00", "#0A0A0A"]
} as const;

export const typography = {
  fontFamily: {
    display: "Space Grotesk",
    body: "Manrope",
    meta: "Space Mono"
  },
  fontFallback: {
    display: ["Space Grotesk", "system-ui", "sans-serif"],
    body: ["Manrope", "system-ui", "sans-serif"],
    meta: ["Space Mono", "monospace"]
  },
  fontSize: {
    display: 32,
    section: 20,
    emphasis: 18,
    title: 16,
    task: 15,
    body: 14,
    supportive: 13,
    meta: 12,
    badge: 11
  }
} as const;

export const radii = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  card: 26,
  pill: 100
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  "2xl": 14,
  "3xl": 16,
  "4xl": 20,
  "5xl": 24
} as const;

export const effects = {
  limeGlow: colors.accentLimeGlow,
  backgroundBlur: "blur(16px)"
} as const;

export const tokens = {
  colors,
  gradients,
  typography,
  radii,
  spacing,
  effects
} as const;
