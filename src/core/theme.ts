import type { Theme } from "./types.js";

export const defaultTheme: Theme = {
  name: "default",
  fonts: {
    heading: "Aptos Display",
    body: "Aptos",
    mono: "Aptos Mono",
  },
  colors: {
    background: "F7F7F5",
    foreground: "161616",
    muted: "EAEAE6",
    mutedForeground: "666660",
    accent: "315CFF",
    accentForeground: "FFFFFF",
    border: "D8D8D2",
    success: "14804A",
    danger: "C9362B",
  },
  typography: {
    display: 38,
    title: 26,
    heading: 18,
    body: 14,
    caption: 10,
  },
  spacing: {
    xs: 0.08,
    sm: 0.16,
    md: 0.28,
    lg: 0.48,
    xl: 0.72,
  },
};

export function defineTheme(theme: Theme): Theme {
  return theme;
}

export function mergeTheme(base: Theme, overrides: Partial<Theme>): Theme {
  return {
    ...base,
    ...overrides,
    fonts: { ...base.fonts, ...overrides.fonts },
    colors: { ...base.colors, ...overrides.colors },
    typography: { ...base.typography, ...overrides.typography },
    spacing: { ...base.spacing, ...overrides.spacing },
  };
}
