import { describe, expect, it } from "vitest";
import { ComparisonSlide, MetricCard, MetricGrid, TitleSlide, WIDESCREEN, defaultTheme } from "../src/index.js";
import { isInsideSlide } from "../src/core/slide.js";

const context = { size: WIDESCREEN, theme: defaultTheme };
const slideBounds = { x: 0, y: 0, width: WIDESCREEN.width, height: WIDESCREEN.height };

function expectInBounds(component: ReturnType<typeof TitleSlide>) {
  const slide = component(context);
  expect(slide.elements.every((element) => isInsideSlide(element, slideBounds))).toBe(true);
  return slide;
}

describe("slide components", () => {
  it("builds a title slide from semantic content", () => {
    const slide = expectInBounds(TitleSlide({ title: "Quarterly review", subtitle: "What changed", author: "Finance" }));
    expect(slide.elements.some((element) => element.type === "text" && element.text === "Quarterly review")).toBe(true);
  });

  it("renders title metadata, a footer, and constrained eyebrow text", () => {
    const slide = TitleSlide({
      title: "Launch plan",
      eyebrow: "This eyebrow is deliberately far longer than forty characters for truncation",
      author: "Product",
      date: "September 2026",
      footer: "Confidential",
    })(context);
    expect(slide.warnings).toEqual(expect.arrayContaining([expect.objectContaining({ field: "eyebrow" })]));
    expect(slide.elements.some((element) => element.type === "text" && element.text.includes("Product  ·  September 2026"))).toBe(true);
    expect(slide.elements.some((element) => element.type === "text" && element.text === "Confidential")).toBe(true);
  });

  it("builds a standalone metric card with trend tokens", () => {
    const slide = MetricCard({ label: "Revenue", value: "$42M", change: "+18%", trend: "up" })(context);
    expect(slide.elements).toHaveLength(4);
    expect(slide.elements.some((element) => element.type === "text" && element.style?.color === defaultTheme.colors.success)).toBe(true);
  });

  it("renders metric descriptions, down and neutral trends, and footers", () => {
    const down = MetricCard({ label: "Churn", value: "4%", change: "+1 pt", trend: "down", description: "Needs attention", footer: "Internal" })(context);
    expect(down.elements.some((element) => element.type === "text" && element.style?.color === defaultTheme.colors.danger)).toBe(true);
    expect(down.elements.some((element) => element.type === "text" && element.text === "Needs attention")).toBe(true);
    expect(down.elements.some((element) => element.type === "text" && element.text === "Internal")).toBe(true);
    const neutral = MetricCard({ label: "Pipeline", value: "$8M", change: "Flat" })(context);
    expect(neutral.elements.some((element) => element.type === "text" && element.text === "Flat" && element.style?.color === defaultTheme.colors.mutedForeground)).toBe(true);
  });

  it("lays out a metric grid and reports truncation", () => {
    const slide = MetricGrid({
      title: "Key metrics",
      metrics: [
        { label: "A label that is deliberately much longer than the supported card label", value: "1" },
        { label: "Retention", value: "94%" },
      ],
    })(context);
    expect(slide.warnings).toEqual(expect.arrayContaining([expect.objectContaining({ component: "MetricGrid", field: "label" })]));
    expect(slide.elements.every((element) => isInsideSlide(element, slideBounds))).toBe(true);
  });

  it("requires a useful number of metrics", () => {
    expect(() => MetricGrid({ title: "Metrics", metrics: [{ label: "Only", value: "1" }] })(context)).toThrow("between 2 and 8");
    expect(() => MetricGrid({ title: "Metrics", metrics: Array.from({ length: 9 }, (_, index) => ({ label: `${index}`, value: `${index}` })) })(context)).toThrow("between 2 and 8");
  });

  it("lays out partial rows with explicit and automatic columns", () => {
    const five = Array.from({ length: 5 }, (_, index) => ({ label: `Metric ${index}`, value: `${index}` }));
    expect(MetricGrid({ title: "Five", metrics: five })(context).elements.length).toBeGreaterThan(10);
    expect(MetricGrid({ title: "Five", metrics: five, columns: 4 })(context).elements.length).toBeGreaterThan(10);
    const eight = Array.from({ length: 8 }, (_, index) => ({ label: `Metric ${index}`, value: `${index}` }));
    expect(MetricGrid({ title: "Eight", metrics: eight })(context).elements.length).toBeGreaterThan(16);
  });

  it("creates two editable comparison panels", () => {
    const slide = ComparisonSlide({
      title: "Build vs buy",
      left: { title: "Build", points: ["Control", "Investment"] },
      right: { title: "Buy", points: ["Speed", "Dependency"] },
    })(context);
    const panelBackgrounds = slide.elements.filter((element) => element.type === "shape" && element.shape === "rectangle" && element.fill === "FFFFFF");
    expect(panelBackgrounds).toHaveLength(2);
    expect(slide.elements.every((element) => isInsideSlide(element, slideBounds))).toBe(true);
  });

  it("renders comparison subtitles, accent variants, and a footer", () => {
    const slide = ComparisonSlide({
      eyebrow: "Tradeoff",
      title: "Options",
      left: { title: "Build", subtitle: "Differentiated", accent: "success", points: ["Control"] },
      right: { title: "Partner", subtitle: "Commodity", accent: "muted", points: ["Speed"] },
      footer: "Decision pending",
    })(context);
    expect(slide.elements.some((element) => element.type === "shape" && element.fill === defaultTheme.colors.success)).toBe(true);
    expect(slide.elements.some((element) => element.type === "text" && element.text === "Decision pending")).toBe(true);
  });

  it("rejects unusable comparison point counts", () => {
    expect(() => ComparisonSlide({ title: "Bad", left: { title: "A", points: [] }, right: { title: "B", points: ["ok"] } })(context)).toThrow("left.points");
    expect(() => ComparisonSlide({ title: "Bad", left: { title: "A", points: ["ok"] }, right: { title: "B", points: Array(7).fill("too many") } })(context)).toThrow("right.points");
  });
});
