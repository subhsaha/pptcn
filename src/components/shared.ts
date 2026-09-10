import type { Bounds, LayoutWarning, SlideElement, Theme } from "../core/types.js";
import { constrainText, requireText } from "../utils/content.js";

export interface SlideHeadingOptions {
  title: string;
  eyebrow?: string | undefined;
  bounds: Bounds;
  theme: Theme;
  component: string;
}

export function slideHeading(options: SlideHeadingOptions): {
  elements: SlideElement[];
  warnings: LayoutWarning[];
  contentTop: number;
} {
  const { bounds, theme, component } = options;
  const title = constrainText(requireText(options.title, "title"), 72, component, "title");
  const elements: SlideElement[] = [];
  const warnings: LayoutWarning[] = [];
  let titleY = bounds.y;

  if (options.eyebrow) {
    const eyebrow = constrainText(options.eyebrow, 40, component, "eyebrow");
    elements.push({
      type: "text",
      text: eyebrow.text.toUpperCase(),
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: 0.25,
      style: {
        fontFace: theme.fonts.body,
        fontSize: theme.typography.caption,
        color: theme.colors.accent,
        bold: true,
        margin: 0,
      },
    });
    if (eyebrow.warning) warnings.push(eyebrow.warning);
    titleY += 0.38;
  }

  elements.push({
    type: "text",
    text: title.text,
    x: bounds.x,
    y: titleY,
    width: bounds.width,
    height: 0.58,
    style: {
      fontFace: theme.fonts.heading,
      fontSize: theme.typography.title,
      color: theme.colors.foreground,
      bold: true,
      margin: 0,
    },
  });
  if (title.warning) warnings.push(title.warning);

  return { elements, warnings, contentTop: titleY + 0.88 };
}

export function footerElement(footer: string | undefined, theme: Theme, width: number, height: number): SlideElement | undefined {
  if (!footer?.trim()) return undefined;
  return {
    type: "text",
    text: footer.trim(),
    x: 0.72,
    y: height - 0.42,
    width: width - 1.44,
    height: 0.18,
    style: {
      fontFace: theme.fonts.body,
      fontSize: 8,
      color: theme.colors.mutedForeground,
      margin: 0,
      align: "right",
    },
  };
}
