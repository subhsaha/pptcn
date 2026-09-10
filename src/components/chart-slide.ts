import { createSlide } from "../core/slide.js";
import type { ChartKind, ChartSeries, LayoutWarning, SlideComponent } from "../core/types.js";
import { constrainText, requireText } from "../utils/content.js";
import { footerElement, slideHeading } from "./shared.js";

export interface ChartSlideProps {
  title: string;
  eyebrow?: string;
  chart: {
    type: ChartKind;
    categories: string[];
    series: ChartSeries[];
    showValues?: boolean;
    valueFormat?: string;
    altText: string;
  };
  insight: {
    title: string;
    summary: string;
    points?: string[];
  };
  footer?: string;
  speakerNotes?: string;
}

export function ChartSlide(props: ChartSlideProps): SlideComponent {
  return ({ size, theme }) => {
    if (props.chart.categories.length < 2 || props.chart.categories.length > 12) {
      throw new RangeError("ChartSlide requires between 2 and 12 categories.");
    }
    if (props.chart.series.length < 1 || props.chart.series.length > 3) {
      throw new RangeError("ChartSlide requires between 1 and 3 series.");
    }
    for (const series of props.chart.series) {
      if (series.values.length !== props.chart.categories.length || series.values.some((value) => !Number.isFinite(value))) {
        throw new RangeError("Every chart series must contain one finite value per category.");
      }
    }
    const points = props.insight.points ?? [];
    if (points.length > 4) throw new RangeError("ChartSlide insight supports up to 4 points.");

    const slide = createSlide(theme.colors.background);
    const heading = slideHeading({ title: props.title, eyebrow: props.eyebrow, bounds: { x: 0.72, y: 0.58, width: size.width - 1.44, height: 1 }, theme, component: "ChartSlide" });
    slide.add(...heading.elements);
    for (const warning of heading.warnings) slide.warn(warning);

    const chartBounds = { x: 0.72, y: heading.contentTop + 0.1, width: 7.75, height: size.height - heading.contentTop - 1 };
    slide.add({
      type: "chart",
      chart: props.chart.type,
      categories: props.chart.categories,
      series: props.chart.series,
      colors: props.chart.type === "bar" ? [theme.colors.foreground] : [theme.colors.foreground, "777777", "C4C4C4"],
      ...(props.chart.showValues !== undefined && { showValues: props.chart.showValues }),
      ...(props.chart.valueFormat !== undefined && { valueFormat: props.chart.valueFormat }),
      altText: props.chart.altText,
      ...chartBounds,
    });

    const panel = { x: 8.82, y: heading.contentTop + 0.1, width: size.width - 9.54, height: chartBounds.height };
    const insightTitle = constrainText(requireText(props.insight.title, "insight.title"), 42, "ChartSlide", "insight.title");
    const summary = constrainText(requireText(props.insight.summary, "insight.summary"), 220, "ChartSlide", "insight.summary");
    const warnings: LayoutWarning[] = [insightTitle.warning, summary.warning].filter((warning): warning is LayoutWarning => warning !== undefined);
    slide.add(
      { type: "shape", shape: "rectangle", ...panel, fill: "F0F0EE" },
      { type: "text", text: "WHAT IT MEANS", x: panel.x + 0.42, y: panel.y + 0.42, width: panel.width - 0.84, height: 0.2, style: { fontFace: theme.fonts.body, fontSize: 9, color: theme.colors.mutedForeground, bold: true, margin: 0 } },
      { type: "text", text: insightTitle.text, x: panel.x + 0.42, y: panel.y + 0.78, width: panel.width - 0.84, height: 0.62, style: { fontFace: theme.fonts.heading, fontSize: 19, color: theme.colors.foreground, bold: true, margin: 0 } },
      { type: "text", text: summary.text, x: panel.x + 0.42, y: panel.y + 1.57, width: panel.width - 0.84, height: 0.88, style: { fontFace: theme.fonts.body, fontSize: 11, color: theme.colors.mutedForeground, margin: 0 } },
    );
    points.forEach((point, index) => {
      const constrained = constrainText(requireText(point, `insight.points[${index}]`), 78, "ChartSlide", `insight.points[${index}]`);
      if (constrained.warning) warnings.push(constrained.warning);
      const y = panel.y + 2.75 + index * 0.55;
      slide.add(
        { type: "shape", shape: "line", x: panel.x + 0.42, y: y + 0.11, width: 0.22, height: 0, stroke: theme.colors.foreground, strokeWidth: 1.5 },
        { type: "text", text: constrained.text, x: panel.x + 0.78, y, width: panel.width - 1.2, height: 0.38, style: { fontFace: theme.fonts.body, fontSize: 10, color: theme.colors.foreground, margin: 0 } },
      );
    });
    for (const warning of warnings) slide.warn(warning);
    const footer = footerElement(props.footer, theme, size.width, size.height);
    if (footer) slide.add(footer);
    return slide.build(props.speakerNotes);
  };
}
