import type { Bounds } from "./types.js";

export const WIDESCREEN = { width: 13.333, height: 7.5 } as const;

export function inset(bounds: Bounds, amount: number): Bounds {
  return {
    x: bounds.x + amount,
    y: bounds.y + amount,
    width: Math.max(0, bounds.width - amount * 2),
    height: Math.max(0, bounds.height - amount * 2),
  };
}

export function equalColumns(bounds: Bounds, count: number, gap: number): Bounds[] {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError("Column count must be a positive integer.");
  }
  const width = (bounds.width - gap * (count - 1)) / count;
  if (width <= 0) {
    throw new RangeError("Columns and gaps do not fit inside the available width.");
  }
  return Array.from({ length: count }, (_, index) => ({
    x: bounds.x + index * (width + gap),
    y: bounds.y,
    width,
    height: bounds.height,
  }));
}

export function equalRows(bounds: Bounds, count: number, gap: number): Bounds[] {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError("Row count must be a positive integer.");
  }
  const height = (bounds.height - gap * (count - 1)) / count;
  if (height <= 0) {
    throw new RangeError("Rows and gaps do not fit inside the available height.");
  }
  return Array.from({ length: count }, (_, index) => ({
    x: bounds.x,
    y: bounds.y + index * (height + gap),
    width: bounds.width,
    height,
  }));
}

export function isInside(inner: Bounds, outer: Bounds): boolean {
  const epsilon = 0.0001;
  return (
    inner.x + epsilon >= outer.x &&
    inner.y + epsilon >= outer.y &&
    inner.x + inner.width <= outer.x + outer.width + epsilon &&
    inner.y + inner.height <= outer.y + outer.height + epsilon
  );
}
