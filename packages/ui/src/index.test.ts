import { describe, expect, it } from "vitest";

import {
  buttonPresets,
  getProgressValue,
  getTaskRowStateLabel,
  tokens
} from "./index";

describe("tokens", () => {
  it("exposes the documented core token families", () => {
    expect(tokens.colors.background).toBe("#0A0A0A");
    expect(tokens.colors.accentLime).toBe("#C4F82A");
    expect(tokens.typography.fontFamily.display).toBe("Space Grotesk");
    expect(tokens.radii.pill).toBe(100);
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
