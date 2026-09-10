import { equalColumns, equalRows } from "../core/layout.js";
import { createSlide } from "../core/slide.js";
import type { SlideComponent } from "../core/types.js";
import { metricCardElements, type MetricCardProps } from "./metric-card.js";
import { footerElement, slideHeading } from "./shared.js";

export interface MetricGridProps {
  title: string;
  eyebrow?: string;
  metrics: MetricCardProps[];
  columns?: 2 | 3 | 4;
  footer?: string;
}

export function MetricGrid(props: MetricGridProps): SlideComponent {
  return ({ size, theme }) => {
    if (props.metrics.length < 2 || props.metrics.length > 8) throw new RangeError("MetricGrid requires between 2 and 8 metrics.");
    const columns = props.columns ?? (props.metrics.length <= 4 ? 2 : props.metrics.length <= 6 ? 3 : 4);
    const rows = Math.ceil(props.metrics.length / columns);
    const slide = createSlide(theme.colors.background);
    const heading = slideHeading({ title: props.title, eyebrow: props.eyebrow, bounds: { x: 0.72, y: 0.58, width: size.width - 1.44, height: 1 }, theme, component: "MetricGrid" });
    slide.add(...heading.elements);
    for (const warning of heading.warnings) slide.warn(warning);
    const content = { x: 0.72, y: heading.contentTop, width: size.width - 1.44, height: size.height - heading.contentTop - 0.7 };
    const rowBounds = equalRows(content, rows, theme.spacing.md);
    let index = 0;
    for (const row of rowBounds) {
      const count = Math.min(columns, props.metrics.length - index);
      for (const bounds of equalColumns(row, count, theme.spacing.md)) {
        const metric = props.metrics[index];
        if (!metric) break;
        const card = metricCardElements(metric, bounds, theme, "MetricGrid");
        slide.add(...card.elements);
        for (const warning of card.warnings) slide.warn(warning);
        index += 1;
      }
    }
    const footer = footerElement(props.footer, theme, size.width, size.height);
    if (footer) slide.add(footer);
    return slide.build();
  };
}
