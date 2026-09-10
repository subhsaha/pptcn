import { describe, expect, it } from "vitest";
import { equalColumns, equalRows, inset, isInside } from "../src/core/layout.js";
import { shape, text } from "../src/core/elements.js";

describe("layout utilities", () => {
  it("creates equal columns with deterministic gaps", () => {
    expect(equalColumns({ x: 1, y: 2, width: 10, height: 4 }, 3, 0.5)).toEqual([
      { x: 1, y: 2, width: 3, height: 4 },
      { x: 4.5, y: 2, width: 3, height: 4 },
      { x: 8, y: 2, width: 3, height: 4 },
    ]);
  });

  it("creates rows and insets without crossing bounds", () => {
    expect(equalRows({ x: 0, y: 0, width: 8, height: 5 }, 2, 1)).toEqual([
      { x: 0, y: 0, width: 8, height: 2 },
      { x: 0, y: 3, width: 8, height: 2 },
    ]);
    expect(inset({ x: 0, y: 0, width: 2, height: 2 }, 0.25)).toEqual({ x: 0.25, y: 0.25, width: 1.5, height: 1.5 });
  });

  it("rejects impossible layouts", () => {
    expect(() => equalColumns({ x: 0, y: 0, width: 1, height: 1 }, 0, 0)).toThrow("positive integer");
    expect(() => equalColumns({ x: 0, y: 0, width: 1, height: 1 }, 2, 2)).toThrow("do not fit");
    expect(() => equalRows({ x: 0, y: 0, width: 1, height: 1 }, 1.5, 0)).toThrow("positive integer");
    expect(() => equalRows({ x: 0, y: 0, width: 1, height: 1 }, 2, 2)).toThrow("do not fit");
  });

  it("creates low-level text and shape elements", () => {
    const bounds = { x: 1, y: 1, width: 2, height: 1 };
    expect(text("Hello", bounds)).toEqual({ type: "text", text: "Hello", ...bounds });
    expect(text("Hello", bounds, { bold: true })).toEqual({ type: "text", text: "Hello", ...bounds, style: { bold: true } });
    expect(shape("rectangle", bounds, { fill: "FFFFFF" })).toEqual({ type: "shape", shape: "rectangle", ...bounds, fill: "FFFFFF" });
    expect(inset(bounds, 2).width).toBe(0);
    expect(isInside(bounds, { x: 0, y: 0, width: 4, height: 4 })).toBe(true);
    expect(isInside({ ...bounds, x: -1 }, { x: 0, y: 0, width: 4, height: 4 })).toBe(false);
  });
});
