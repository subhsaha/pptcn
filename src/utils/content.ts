import type { LayoutWarning } from "../core/types.js";

export interface ConstrainedText {
  text: string;
  warning?: LayoutWarning;
}

export function constrainText(
  text: string,
  maxCharacters: number,
  component: string,
  field: string,
): ConstrainedText {
  const normalized = text.trim();
  if (normalized.length <= maxCharacters) return { text: normalized };
  return {
    text: `${normalized.slice(0, Math.max(0, maxCharacters - 1)).trimEnd()}…`,
    warning: {
      type: "content-truncated",
      component,
      field,
      message: `${field} exceeded ${maxCharacters} characters and was truncated.`,
    },
  };
}

export function requireText(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new TypeError(`${field} cannot be empty.`);
  return normalized;
}
