import type { Bounds, ShapeElement, ShapeKind, TextElement, TextStyle } from "./types.js";

export function text(text: string, bounds: Bounds, style?: TextStyle): TextElement {
  return style
    ? { type: "text", text, ...bounds, style }
    : { type: "text", text, ...bounds };
}

export interface ShapeOptions {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export function shape(kind: ShapeKind, bounds: Bounds, options: ShapeOptions = {}): ShapeElement {
  return { type: "shape", shape: kind, ...bounds, ...options };
}
