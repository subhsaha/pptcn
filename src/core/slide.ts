import type { Bounds, LayoutWarning, SlideDefinition, SlideElement } from "./types.js";

export function createSlide(background: string): SlideBuilder {
  return new SlideBuilder(background);
}

export class SlideBuilder {
  readonly elements: SlideElement[] = [];
  readonly warnings: LayoutWarning[] = [];

  constructor(readonly background: string) {}

  add(...elements: SlideElement[]): this {
    this.elements.push(...elements);
    return this;
  }

  warn(warning: LayoutWarning): this {
    this.warnings.push(warning);
    return this;
  }

  build(speakerNotes?: string): SlideDefinition {
    return speakerNotes === undefined
      ? { background: this.background, elements: this.elements, warnings: this.warnings }
      : { background: this.background, elements: this.elements, warnings: this.warnings, speakerNotes };
  }
}

export function isInsideSlide(element: Bounds, slide: Bounds): boolean {
  const epsilon = 0.0001;
  return (
    element.x >= slide.x - epsilon &&
    element.y >= slide.y - epsilon &&
    element.x + element.width <= slide.x + slide.width + epsilon &&
    element.y + element.height <= slide.y + slide.height + epsilon
  );
}

export function assertSlideBounds(definition: SlideDefinition, width: number, height: number): void {
  const slide = { x: 0, y: 0, width, height };
  const invalid = definition.elements.find((element) => !isInsideSlide(element, slide));
  if (invalid) {
    throw new RangeError(
      `Slide element exceeds slide bounds: ${invalid.type} at (${invalid.x}, ${invalid.y}, ${invalid.width}, ${invalid.height}).`,
    );
  }
}
