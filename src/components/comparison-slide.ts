import { equalColumns } from "../core/layout.js";
import { createSlide } from "../core/slide.js";
import type { Bounds, LayoutWarning, SlideComponent, SlideElement, Theme } from "../core/types.js";
import { constrainText, requireText } from "../utils/content.js";
import { footerElement, slideHeading } from "./shared.js";

export interface ComparisonSide {
  title: string;
  subtitle?: string;
  points: string[];
  accent?: "primary" | "muted" | "success";
}

export interface ComparisonSlideProps {
  title: string;
  eyebrow?: string;
  left: ComparisonSide;
  right: ComparisonSide;
  footer?: string;
}

function comparisonPanel(side: ComparisonSide, bounds: Bounds, theme: Theme, field: "left" | "right") {
  if (side.points.length < 1 || side.points.length > 6) throw new RangeError(`${field}.points requires between 1 and 6 items.`);
  const title = constrainText(requireText(side.title, `${field}.title`), 40, "ComparisonSlide", `${field}.title`);
  const subtitle = side.subtitle ? constrainText(side.subtitle, 76, "ComparisonSlide", `${field}.subtitle`) : undefined;
  const warnings: LayoutWarning[] = [title.warning, subtitle?.warning].filter((warning): warning is LayoutWarning => warning !== undefined);
  const accentColor = side.accent === "success" ? theme.colors.success : side.accent === "muted" ? theme.colors.mutedForeground : theme.colors.accent;
  const elements: SlideElement[] = [
    { type: "shape", shape: "rectangle", ...bounds, fill: "FFFFFF", stroke: theme.colors.border, strokeWidth: 0.8 },
    { type: "shape", shape: "rectangle", x: bounds.x, y: bounds.y, width: 0.08, height: bounds.height, fill: accentColor },
    {
      type: "text", text: title.text, x: bounds.x + 0.42, y: bounds.y + 0.38, width: bounds.width - 0.84, height: 0.38,
      style: { fontFace: theme.fonts.heading, fontSize: theme.typography.heading, color: theme.colors.foreground, bold: true, margin: 0 },
    },
  ];
  let pointsY = bounds.y + 1.15;
  if (subtitle) {
    elements.push({
      type: "text", text: subtitle.text, x: bounds.x + 0.42, y: bounds.y + 0.8, width: bounds.width - 0.84, height: 0.4,
      style: { fontFace: theme.fonts.body, fontSize: 10, color: theme.colors.mutedForeground, margin: 0 },
    });
    pointsY += 0.36;
  }
  const available = bounds.y + bounds.height - pointsY - 0.28;
  const itemHeight = Math.min(0.58, available / side.points.length);
  side.points.forEach((point, index) => {
    const constrained = constrainText(requireText(point, `${field}.points[${index}]`), 92, "ComparisonSlide", `${field}.points[${index}]`);
    if (constrained.warning) warnings.push(constrained.warning);
    elements.push({
      type: "shape", shape: "ellipse", x: bounds.x + 0.44, y: pointsY + index * itemHeight + 0.12, width: 0.09, height: 0.09, fill: accentColor,
    });
    elements.push({
      type: "text", text: constrained.text, x: bounds.x + 0.68, y: pointsY + index * itemHeight, width: bounds.width - 1.1, height: itemHeight,
      style: { fontFace: theme.fonts.body, fontSize: 12, color: theme.colors.foreground, margin: 0, verticalAlign: "middle" },
    });
  });
  return { elements, warnings };
}

export function ComparisonSlide(props: ComparisonSlideProps): SlideComponent {
  return ({ size, theme }) => {
    const slide = createSlide(theme.colors.background);
    const heading = slideHeading({ title: props.title, eyebrow: props.eyebrow, bounds: { x: 0.72, y: 0.58, width: size.width - 1.44, height: 1 }, theme, component: "ComparisonSlide" });
    slide.add(...heading.elements);
    for (const warning of heading.warnings) slide.warn(warning);
    const panels = equalColumns({ x: 0.72, y: heading.contentTop, width: size.width - 1.44, height: size.height - heading.contentTop - 0.72 }, 2, theme.spacing.lg);
    const sides = [props.left, props.right] as const;
    panels.forEach((bounds, index) => {
      const panel = comparisonPanel(sides[index]!, bounds, theme, index === 0 ? "left" : "right");
      slide.add(...panel.elements);
      for (const warning of panel.warnings) slide.warn(warning);
    });
    const footer = footerElement(props.footer, theme, size.width, size.height);
    if (footer) slide.add(footer);
    return slide.build();
  };
}
