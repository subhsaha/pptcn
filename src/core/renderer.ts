import PptxGenJS from "pptxgenjs";
import type { ChartElement, ShapeElement, ShapeKind, SlideDefinition, TextElement } from "./types.js";

const shapeMap: Record<ShapeKind, PptxGenJS.ShapeType> = {
  rectangle: "rect" as PptxGenJS.ShapeType,
  "rounded-rectangle": "roundRect" as PptxGenJS.ShapeType,
  line: "line" as PptxGenJS.ShapeType,
  ellipse: "ellipse" as PptxGenJS.ShapeType,
};

function renderText(slide: PptxGenJS.Slide, element: TextElement): void {
  slide.addText(element.text, {
    x: element.x,
    y: element.y,
    w: element.width,
    h: element.height,
    ...(element.style?.fontFace !== undefined && { fontFace: element.style.fontFace }),
    ...(element.style?.fontSize !== undefined && { fontSize: element.style.fontSize }),
    ...(element.style?.color !== undefined && { color: element.style.color }),
    ...(element.style?.bold !== undefined && { bold: element.style.bold }),
    ...(element.style?.italic !== undefined && { italic: element.style.italic }),
    ...(element.style?.align !== undefined && { align: element.style.align }),
    ...(element.style?.verticalAlign !== undefined && { valign: element.style.verticalAlign }),
    margin: element.style?.margin ?? 0,
    ...(element.style?.breakLine !== undefined && { breakLine: element.style.breakLine }),
    ...(element.style?.bullet !== undefined && { bullet: element.style.bullet }),
    fit: "shrink",
  });
}

function renderShape(slide: PptxGenJS.Slide, element: ShapeElement): void {
  slide.addShape(shapeMap[element.shape], {
    x: element.x,
    y: element.y,
    w: element.width,
    h: element.height,
    fill: element.fill ? { color: element.fill } : { color: "FFFFFF", transparency: 100 },
    line: element.stroke
      ? { color: element.stroke, width: element.strokeWidth ?? 1 }
      : { color: element.fill ?? "FFFFFF", transparency: 100 },
  });
}

function renderChart(slide: PptxGenJS.Slide, element: ChartElement): void {
  slide.addChart(
    element.chart,
    element.series.map((series) => ({ name: series.name, labels: element.categories, values: series.values })),
    {
      x: element.x,
      y: element.y,
      w: element.width,
      h: element.height,
      chartColors: element.colors,
      showLegend: element.series.length > 1,
      legendPos: "b",
      showValue: element.showValues ?? false,
      ...(element.valueFormat !== undefined && { dataLabelFormatCode: element.valueFormat }),
      valGridLine: { color: "E5E5E5" },
      showTitle: false,
      ...(element.valueFormat !== undefined && { valAxisLabelFormatCode: element.valueFormat }),
      lineDataSymbol: "circle",
      lineSize: 2.5,
      catAxisLabelFontFace: "Aptos",
      valAxisLabelFontFace: "Aptos",
      altText: element.altText,
    },
  );
}

export function renderSlide(presentation: PptxGenJS, definition: SlideDefinition): void {
  const slide = presentation.addSlide();
  slide.background = { color: definition.background };
  for (const element of definition.elements) {
    if (element.type === "text") renderText(slide, element);
    else if (element.type === "shape") renderShape(slide, element);
    else renderChart(slide, element);
  }
  if (definition.speakerNotes) slide.addNotes(definition.speakerNotes);
}
