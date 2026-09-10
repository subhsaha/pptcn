import { createSlide } from "../core/slide.js";
import type { Bounds, LayoutWarning, SlideComponent, SlideElement, Theme } from "../core/types.js";
import { constrainText, requireText } from "../utils/content.js";
import { footerElement } from "./shared.js";

export type MetricTrend = "up" | "down" | "neutral";

export interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: MetricTrend;
  description?: string;
  footer?: string;
}

export function metricCardElements(
  props: MetricCardProps,
  bounds: Bounds,
  theme: Theme,
  component = "MetricCard",
): { elements: SlideElement[]; warnings: LayoutWarning[] } {
  const label = constrainText(requireText(props.label, "label"), 42, component, "label");
  const value = constrainText(requireText(props.value, "value"), 24, component, "value");
  const description = props.description ? constrainText(props.description, 90, component, "description") : undefined;
  const compact = bounds.height < 2.15;
  const padding = compact ? 0.28 : 0.4;
  const trend = props.trend ?? "neutral";
  const trendColor = trend === "up" ? theme.colors.success : trend === "down" ? theme.colors.danger : theme.colors.mutedForeground;
  const elements: SlideElement[] = [
    { type: "shape", shape: "rounded-rectangle", ...bounds, fill: "FFFFFF", stroke: theme.colors.border, strokeWidth: 0.8 },
    {
      type: "text", text: label.text.toUpperCase(), x: bounds.x + padding, y: bounds.y + padding,
      width: bounds.width - padding * 2, height: 0.25,
      style: { fontFace: theme.fonts.body, fontSize: theme.typography.caption, color: theme.colors.mutedForeground, bold: true, margin: 0 },
    },
    {
      type: "text", text: value.text, x: bounds.x + padding, y: bounds.y + (compact ? 0.68 : 0.82),
      width: bounds.width - padding * 2, height: compact ? 0.52 : 0.66,
      style: { fontFace: theme.fonts.heading, fontSize: compact ? 22 : 29, color: theme.colors.foreground, bold: true, margin: 0 },
    },
  ];

  if (props.change?.trim()) {
    elements.push({
      type: "text", text: props.change.trim(), x: bounds.x + padding,
      y: bounds.y + bounds.height - (description && !compact ? 0.74 : 0.48), width: bounds.width - padding * 2, height: 0.22,
      style: { fontFace: theme.fonts.body, fontSize: theme.typography.caption, color: trendColor, bold: true, margin: 0 },
    });
  }
  if (description && !compact) {
    elements.push({
      type: "text", text: description.text, x: bounds.x + padding, y: bounds.y + bounds.height - 0.43,
      width: bounds.width - padding * 2, height: 0.2,
      style: { fontFace: theme.fonts.body, fontSize: 9, color: theme.colors.mutedForeground, margin: 0 },
    });
  }
  return {
    elements,
    warnings: [label.warning, value.warning, description?.warning].filter((warning): warning is LayoutWarning => warning !== undefined),
  };
}

export function MetricCard(props: MetricCardProps): SlideComponent {
  return ({ size, theme }) => {
    const slide = createSlide(theme.colors.background);
    const card = metricCardElements(props, { x: 1.4, y: 1.35, width: size.width - 2.8, height: size.height - 2.7 }, theme);
    slide.add(...card.elements);
    for (const warning of card.warnings) slide.warn(warning);
    const footer = footerElement(props.footer, theme, size.width, size.height);
    if (footer) slide.add(footer);
    return slide.build();
  };
}
