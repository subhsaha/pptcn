import { describe, expect, it } from "vitest";
import { defaultTheme, defineTheme, mergeTheme } from "../src/core/theme.js";
import { constrainText, requireText } from "../src/utils/content.js";

describe("themes and content constraints", () => {
  it("defines and merges themes without mutating the base", () => {
    expect(defineTheme(defaultTheme)).toBe(defaultTheme);
    const merged = mergeTheme(defaultTheme, { name: "violet", colors: { ...defaultTheme.colors, accent: "7C3AED" } });
    expect(merged.name).toBe("violet");
    expect(merged.colors.accent).toBe("7C3AED");
    expect(defaultTheme.colors.accent).not.toBe("7C3AED");
  });

  it("normalizes valid text and reports deterministic truncation", () => {
    expect(requireText("  hello  ", "title")).toBe("hello");
    expect(constrainText(" short ", 10, "Test", "field")).toEqual({ text: "short" });
    expect(constrainText("a long sentence", 8, "Test", "field")).toEqual({
      text: "a long…",
      warning: expect.objectContaining({ type: "content-truncated", component: "Test", field: "field" }),
    });
    expect(() => requireText("   ", "title")).toThrow("title cannot be empty");
  });
});
