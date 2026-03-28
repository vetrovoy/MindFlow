import { describe, expect, it } from "vitest";

import {
  buttonPresets,
  DEFAULT_THEME,
  getTheme,
  getProgressValue,
  getTaskRowStateLabel,
  projectMarkers,
  resolveThemeName,
  SUPPORTED_THEMES,
  themes,
  tokens
} from "./index";

describe("tokens", () => {
  it("exposes the documented core token families", () => {
    expect(tokens.colors.background).toBe("#0A0A0A");
    expect(tokens.colors.accentPrimary).toBe("#C4F82A");
    expect(tokens.typography.fontFamily.display).toBe("Space Grotesk");
    expect(tokens.radii.pill).toBe(100);
    expect(tokens.controlSizes.iconButton).toBe(52);
    expect(tokens.layoutSizes.modalWidthWide).toBe(860);
    expect(tokens.shape.shellRadius).toBe(28);
  });

  it("exposes the default graphite theme through the public registry", () => {
    expect(getTheme(DEFAULT_THEME)).toBe(themes.graphite);
  });

  it("keeps the same theme shape across all supported themes", () => {
    const firstTheme = getTheme(SUPPORTED_THEMES[0]);

    for (const themeName of SUPPORTED_THEMES) {
      const theme = getTheme(themeName);

      expect(Object.keys(theme.colors)).toEqual(Object.keys(firstTheme.colors));
      expect(Object.keys(theme.gradients)).toEqual(Object.keys(firstTheme.gradients));
      expect(theme.preview).toHaveLength(3);
      expect(["dark", "light"]).toContain(theme.colorScheme);
    }
  });

  it("keeps legacy stored theme names working", () => {
    expect(resolveThemeName("ocean")).toBe("minimal");
    expect(resolveThemeName("studio")).toBe("minimal");
    expect(resolveThemeName("ember")).toBe("gilded");
  });
});

describe("project markers", () => {
  it("exposes the fixed marker registry", () => {
    expect(projectMarkers).toHaveLength(4);
    expect(projectMarkers[0]).toMatchObject({
      id: "violet",
      emoji: "🚀",
      color: "#7C3AED",
      contrastTone: "light"
    });
  });
});

describe("presets and helpers", () => {
  it("exposes the primary button preset", () => {
    expect(buttonPresets.primary.background).toBe("#C4F82A");
  });

  it("normalizes progress values", () => {
    expect(getProgressValue({ value: 1, max: 4 })).toBe(0.25);
    expect(getProgressValue({ value: 4, max: 0 })).toBe(0);
  });

  it("prefers selected state for task rows", () => {
    expect(
      getTaskRowStateLabel({
        id: "task-1",
        title: "Task",
        priority: "medium",
        checkbox: "unchecked",
        selected: true
      })
    ).toBe("selected");
  });
});
