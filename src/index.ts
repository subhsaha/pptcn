export { createPresentation, type Presentation, type PresentationOptions } from "./core/presentation.js";
export { defaultTheme, defineTheme, mergeTheme } from "./core/theme.js";
export { WIDESCREEN, equalColumns, equalRows, inset } from "./core/layout.js";
export { shape, text, type ShapeOptions } from "./core/elements.js";
export { TitleSlide, type TitleSlideProps } from "./components/title-slide.js";
export { MetricCard, type MetricCardProps, type MetricTrend } from "./components/metric-card.js";
export { MetricGrid, type MetricGridProps } from "./components/metric-grid.js";
export { ComparisonSlide, type ComparisonSide, type ComparisonSlideProps } from "./components/comparison-slide.js";
export type {
  Bounds,
  ComponentContext,
  LayoutWarning,
  ShapeElement,
  SlideComponent,
  SlideDefinition,
  SlideElement,
  SlideSize,
  TextElement,
  TextStyle,
  Theme,
} from "./core/types.js";
