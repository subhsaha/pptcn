import PptxGenJS from "pptxgenjs";
import type { ShapeElement, ShapeKind, SlideDefinition, TextElement } from "./types.js";

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

export function renderSlide(presentation: PptxGenJS, definition: SlideDefinition): void {
  const slide = presentation.addSlide();
  slide.background = { color: definition.background };
  for (const element of definition.elements) {
    if (element.type === "text") renderText(slide, element);
    else renderShape(slide, element);
  }
}
