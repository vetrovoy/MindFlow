import { DEFAULT_THEME, getTheme } from "../themes";

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

export const controlSizes = {
  iconButton: 52,
  dockButton: 46,
  field: 56,
  compactField: 46,
  inlineButton: 40,
  calendarNav: 32,
  checkbox: 32
} as const;

export const layoutSizes = {
  popoverWidth: 220,
  popoverWidthMobile: 260,
  modalWidthTask: 720,
  modalWidthWide: 860,
  statusViewportWidth: 560
} as const;

export const shape = {
  shellRadius: 28,
  popoverRadius: 24,
  capsuleRadius: 22,
  controlRadius: 16,
  compactRadius: 12
} as const;

export const effects = {
  backgroundBlur: "blur(16px)",
  shellBlur: "blur(18px)",
  heroGlowBlur: "blur(52px)"
} as const;

const defaultTheme = getTheme(DEFAULT_THEME);

export const tokens = {
  colors: defaultTheme.colors,
  gradients: defaultTheme.gradients,
  typography,
  radii,
  spacing,
  controlSizes,
  layoutSizes,
  shape,
  effects
} as const;
