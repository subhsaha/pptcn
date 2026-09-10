export type HexColor = string;

export interface SlideSize {
  width: number;
  height: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type HorizontalAlignment = "left" | "center" | "right";
export type VerticalAlignment = "top" | "middle" | "bottom";

export interface TextStyle {
  fontFace?: string;
  fontSize?: number;
  color?: HexColor;
  bold?: boolean;
  italic?: boolean;
  align?: HorizontalAlignment;
  verticalAlign?: VerticalAlignment;
  margin?: number;
  breakLine?: boolean;
  bullet?: boolean;
}

export interface TextElement extends Bounds {
  type: "text";
  text: string;
  style?: TextStyle;
}

export type ShapeKind = "rectangle" | "rounded-rectangle" | "line" | "ellipse";

export interface ShapeElement extends Bounds {
  type: "shape";
  shape: ShapeKind;
  fill?: HexColor;
  stroke?: HexColor;
  strokeWidth?: number;
}

export type ChartKind = "bar" | "line";

export interface ChartSeries {
  name: string;
  values: number[];
}

export interface ChartElement extends Bounds {
  type: "chart";
  chart: ChartKind;
  categories: string[];
  series: ChartSeries[];
  colors: HexColor[];
  showValues?: boolean;
  valueFormat?: string;
  altText: string;
}

export type SlideElement = TextElement | ShapeElement | ChartElement;

export type WarningType = "text-overflow" | "content-truncated" | "layout-overflow";

export interface LayoutWarning {
  type: WarningType;
  component: string;
  field: string;
  message: string;
}

export interface SlideDefinition {
  elements: SlideElement[];
  background: HexColor;
  warnings: LayoutWarning[];
  speakerNotes?: string;
}

export interface ComponentContext {
  size: SlideSize;
  theme: Theme;
}

export type SlideComponent = (context: ComponentContext) => SlideDefinition;

export interface Theme {
  name: string;
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  colors: {
    background: HexColor;
    foreground: HexColor;
    muted: HexColor;
    mutedForeground: HexColor;
    accent: HexColor;
    accentForeground: HexColor;
    border: HexColor;
    success: HexColor;
    danger: HexColor;
  };
  typography: {
    display: number;
    title: number;
    heading: number;
    body: number;
    caption: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}
