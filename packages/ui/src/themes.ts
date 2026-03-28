export const SUPPORTED_THEMES = ["graphite", "gilded", "minimal"] as const;
export const DEFAULT_THEME = "graphite" as const;

export type ThemeName = (typeof SUPPORTED_THEMES)[number];
export type ThemeColorScheme = "dark" | "light";

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceDeep: string;
  surfaceCard: string;
  surfaceGlass: string;
  surfaceInteractive: string;
  surfaceInteractiveHover: string;
  surfaceInteractiveActive: string;
  borderSoft: string;
  borderMedium: string;
  borderStrong: string;
  borderMuted: string;
  textPrimary: string;
  textLight: string;
  textSoft: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  overlayScrim: string;
  overlayHandle: string;
  overlayGhost: string;
  overlayGhostHover: string;
  shadowCard: string;
  shadowOverlay: string;
  shadowSoft: string;
  shadowStrong: string;
  spotlightFeatured: string;
  accentPrimary: string;
  accentPrimaryGlow: string;
  accentPrimaryRingSoft: string;
  accentPrimaryRingMedium: string;
  accentPrimaryRingStrong: string;
  accentPrimaryPanelBorder: string;
  accentPrimaryPanelGlow: string;
  accentAlert: string;
  accentSuccessDeep: string;
  accentSuccessBright: string;
  accentInfo: string;
  accentInfoSoft: string;
  accentFeaturedPurple: string;
  accentFeaturedBlue: string;
}

export interface ThemeGradients {
  featuredProject: readonly [string, string];
  success: readonly [string, string];
  premiumSection: readonly [string, string];
  premiumCard: readonly [string, string];
  overlayDepth: readonly [string, string];
  bottomFade: readonly [string, string];
  appBackground: readonly [string, string];
}

export interface ThemeDefinition {
  name: ThemeName;
  colorScheme: ThemeColorScheme;
  preview: readonly [string, string, string];
  surfaceStyle: "glass" | "paper" | "lacquer";
  colors: ThemeColors;
  gradients: ThemeGradients;
}

const LEGACY_THEME_ALIASES = {
  ocean: "minimal",
  studio: "minimal",
  ember: "gilded"
} as const;

export const themes: Record<ThemeName, ThemeDefinition> = {
  graphite: {
    name: "graphite",
    colorScheme: "dark",
    preview: ["#0A0A0A", "#1D1D22", "#C4F82A"],
    surfaceStyle: "glass",
    colors: {
      background: "#0A0A0A",
      surface: "#18181B",
      surfaceElevated: "#27272A",
      surfaceDeep: "#0F1014",
      surfaceCard: "#1D1D22",
      surfaceGlass: "rgba(28, 28, 33, 0.82)",
      surfaceInteractive: "rgba(196, 248, 42, 0.08)",
      surfaceInteractiveHover: "rgba(196, 248, 42, 0.12)",
      surfaceInteractiveActive: "rgba(196, 248, 42, 0.16)",
      borderSoft: "#2B2B33",
      borderMedium: "#3A3A44",
      borderStrong: "#4B4B56",
      borderMuted: "#3F3F46",
      textPrimary: "#FFFFFF",
      textLight: "#D4D4D8",
      textSoft: "#B3B3BC",
      textSecondary: "#A1A1AA",
      textTertiary: "#71717A",
      textMuted: "#52525B",
      overlayScrim: "rgba(10, 10, 10, 0.7)",
      overlayHandle: "rgba(255, 255, 255, 0.14)",
      overlayGhost: "rgba(255, 255, 255, 0.03)",
      overlayGhostHover: "rgba(255, 255, 255, 0.07)",
      shadowCard: "rgba(10, 10, 10, 0.18)",
      shadowOverlay: "rgba(0, 0, 0, 0.58)",
      shadowSoft: "rgba(10, 10, 10, 0.18)",
      shadowStrong: "rgba(0, 0, 0, 0.58)",
      spotlightFeatured: "rgba(124, 58, 237, 0.22)",
      accentPrimary: "#C4F82A",
      accentPrimaryGlow: "rgba(196, 248, 42, 0.16)",
      accentPrimaryRingSoft: "rgba(196, 248, 42, 0.06)",
      accentPrimaryRingMedium: "rgba(196, 248, 42, 0.08)",
      accentPrimaryRingStrong: "rgba(196, 248, 42, 0.1)",
      accentPrimaryPanelBorder: "rgba(196, 248, 42, 0.16)",
      accentPrimaryPanelGlow: "rgba(196, 248, 42, 0.12)",
      accentAlert: "#FA541C",
      accentSuccessDeep: "#C4F82A",
      accentSuccessBright: "#C4F82A",
      accentInfo: "#60A5FA",
      accentInfoSoft: "#BFDBFE",
      accentFeaturedPurple: "#7C3AED",
      accentFeaturedBlue: "#2563EB"
    },
    gradients: {
      featuredProject: ["#7C3AED", "#2563EB"],
      success: ["#c5f82ace", "#C4F82A"],
      premiumSection: ["#1A1A1D", "#141417"],
      premiumCard: ["#1C1C21", "#141419"],
      overlayDepth: ["#111214", "#0A0A0A"],
      bottomFade: ["#0A0A0A00", "#0A0A0A"],
      appBackground: ["#111214", "#0A0A0A"]
    }
  },
  gilded: {
    name: "gilded",
    colorScheme: "light",
    preview: ["#FCF8F1", "#FFFDF9", "#C9A962"],
    surfaceStyle: "paper",
    colors: {
      background: "#FCF8F1",
      surface: "#FFFDF9",
      surfaceElevated: "#F6EEE1",
      surfaceDeep: "#E9DCC8",
      surfaceCard: "#FFFDF9",
      surfaceGlass: "rgba(255, 253, 249, 0.86)",
      surfaceInteractive: "rgba(201, 169, 98, 0.08)",
      surfaceInteractiveHover: "rgba(201, 169, 98, 0.12)",
      surfaceInteractiveActive: "rgba(201, 169, 98, 0.18)",
      borderSoft: "#E6D8C2",
      borderMedium: "#D5C1A0",
      borderStrong: "#C9A962",
      borderMuted: "#C9B69A",
      textPrimary: "#2A2016",
      textLight: "#3A2D20",
      textSoft: "#6B5943",
      textSecondary: "#8A755B",
      textTertiary: "#AD987D",
      textMuted: "#CEBCA5",
      overlayScrim: "rgba(42, 32, 22, 0.22)",
      overlayHandle: "rgba(201, 169, 98, 0.18)",
      overlayGhost: "rgba(42, 32, 22, 0.04)",
      overlayGhostHover: "rgba(42, 32, 22, 0.08)",
      shadowCard: "rgba(42, 32, 22, 0.08)",
      shadowOverlay: "rgba(42, 32, 22, 0.16)",
      shadowSoft: "rgba(42, 32, 22, 0.08)",
      shadowStrong: "rgba(42, 32, 22, 0.16)",
      spotlightFeatured: "rgba(201, 169, 98, 0.14)",
      accentPrimary: "#C9A962",
      accentPrimaryGlow: "rgba(201, 169, 98, 0.18)",
      accentPrimaryRingSoft: "rgba(201, 169, 98, 0.07)",
      accentPrimaryRingMedium: "rgba(201, 169, 98, 0.1)",
      accentPrimaryRingStrong: "rgba(201, 169, 98, 0.14)",
      accentPrimaryPanelBorder: "rgba(201, 169, 98, 0.18)",
      accentPrimaryPanelGlow: "rgba(201, 169, 98, 0.12)",
      accentAlert: "#D46A4A",
      accentSuccessDeep: "#5F8F5A",
      accentSuccessBright: "#A9D2A1",
      accentInfo: "#7B93B6",
      accentInfoSoft: "#C6D3E8",
      accentFeaturedPurple: "#C9A962",
      accentFeaturedBlue: "#A88644"
    },
    gradients: {
      featuredProject: ["#C9A962", "#7A5C2B"],
      success: ["#A9D2A1", "#5F8F5A"],
      premiumSection: ["#FFFDF9", "#F6EEE1"],
      premiumCard: ["#FFFDF9", "#F2E6D5"],
      overlayDepth: ["#FFFDF9", "#F6EEE1"],
      bottomFade: ["#FCF8F100", "#FCF8F1"],
      appBackground: ["#FFFDF9", "#FCF8F1"]
    }
  },
  minimal: {
    name: "minimal",
    colorScheme: "light",
    preview: ["#FFFFFF", "#F9FAFB", "#2563EB"],
    surfaceStyle: "paper",
    colors: {
      background: "#FFFFFF",
      surface: "#F9FAFB",
      surfaceElevated: "#F3F4F6",
      surfaceDeep: "#E5E7EB",
      surfaceCard: "#FFFFFF",
      surfaceGlass: "rgba(255, 255, 255, 0.86)",
      surfaceInteractive: "rgba(37, 99, 235, 0.06)",
      surfaceInteractiveHover: "rgba(37, 99, 235, 0.1)",
      surfaceInteractiveActive: "rgba(37, 99, 235, 0.14)",
      borderSoft: "#E5E7EB",
      borderMedium: "#D1D5DB",
      borderStrong: "#9CA3AF",
      borderMuted: "#D1D5DB",
      textPrimary: "#111827",
      textLight: "#1F2937",
      textSoft: "#374151",
      textSecondary: "#6B7280",
      textTertiary: "#9CA3AF",
      textMuted: "#D1D5DB",
      overlayScrim: "rgba(17, 24, 39, 0.18)",
      overlayHandle: "rgba(17, 24, 39, 0.12)",
      overlayGhost: "rgba(17, 24, 39, 0.03)",
      overlayGhostHover: "rgba(17, 24, 39, 0.07)",
      shadowCard: "rgba(17, 24, 39, 0.08)",
      shadowOverlay: "rgba(17, 24, 39, 0.16)",
      shadowSoft: "rgba(17, 24, 39, 0.08)",
      shadowStrong: "rgba(17, 24, 39, 0.16)",
      spotlightFeatured: "rgba(37, 99, 235, 0.12)",
      accentPrimary: "#2563EB",
      accentPrimaryGlow: "rgba(37, 99, 235, 0.16)",
      accentPrimaryRingSoft: "rgba(37, 99, 235, 0.06)",
      accentPrimaryRingMedium: "rgba(37, 99, 235, 0.1)",
      accentPrimaryRingStrong: "rgba(37, 99, 235, 0.14)",
      accentPrimaryPanelBorder: "rgba(37, 99, 235, 0.18)",
      accentPrimaryPanelGlow: "rgba(37, 99, 235, 0.12)",
      accentAlert: "#DC2626",
      accentSuccessDeep: "#15803D",
      accentSuccessBright: "#86EFAC",
      accentInfo: "#2563EB",
      accentInfoSoft: "#BFDBFE",
      accentFeaturedPurple: "#2563EB",
      accentFeaturedBlue: "#60A5FA"
    },
    gradients: {
      featuredProject: ["#2563EB", "#60A5FA"],
      success: ["#86EFAC", "#15803D"],
      premiumSection: ["#FFFFFF", "#F3F4F6"],
      premiumCard: ["#FFFFFF", "#F9FAFB"],
      overlayDepth: ["#FFFFFF", "#F3F4F6"],
      bottomFade: ["#FFFFFF00", "#FFFFFF"],
      appBackground: ["#FFFFFF", "#F9FAFB"]
    }
  }
};

export function resolveThemeName(input?: string | null): ThemeName {
  const normalized = input
    ? (LEGACY_THEME_ALIASES[input as keyof typeof LEGACY_THEME_ALIASES] ?? input)
    : null;

  return SUPPORTED_THEMES.find((theme) => theme === normalized) ?? DEFAULT_THEME;
}

export function getTheme(name: ThemeName): ThemeDefinition {
  return themes[name];
}
