import PptxGenJS from "pptxgenjs";
import { WIDESCREEN } from "./layout.js";
import { renderSlide } from "./renderer.js";
import { assertSlideBounds } from "./slide.js";
import { defaultTheme } from "./theme.js";
import type { LayoutWarning, SlideComponent, SlideDefinition, SlideSize, Theme } from "./types.js";

export interface PresentationOptions {
  theme?: Theme;
  author?: string;
  company?: string;
  title?: string;
  subject?: string;
  size?: SlideSize;
}

export interface Presentation {
  readonly slides: readonly SlideDefinition[];
  readonly warnings: readonly LayoutWarning[];
  add(component: SlideComponent | SlideDefinition): Presentation;
  write(fileName: string): Promise<string>;
  toBlob(): Promise<Blob>;
  toPptxGenJS(): PptxGenJS;
}

export function createPresentation(options: PresentationOptions = {}): Presentation {
  const theme = options.theme ?? defaultTheme;
  const size = options.size ?? WIDESCREEN;
  const slides: SlideDefinition[] = [];

  function toPptxGenJS(): PptxGenJS {
    const pptx = new PptxGenJS();
    const isWide = size.width === WIDESCREEN.width && size.height === WIDESCREEN.height;
    if (isWide) {
      pptx.layout = "LAYOUT_WIDE";
    } else {
      pptx.defineLayout({ name: "PPTCN_CUSTOM", width: size.width, height: size.height });
      pptx.layout = "PPTCN_CUSTOM";
    }
    pptx.author = options.author ?? "pptcn";
    pptx.company = options.company ?? "";
    pptx.title = options.title ?? "pptcn presentation";
    pptx.subject = options.subject ?? "Generated with pptcn";
    pptx.theme = {
      headFontFace: theme.fonts.heading,
      bodyFontFace: theme.fonts.body,
    };
    for (const slide of slides) renderSlide(pptx, slide);
    return pptx;
  }

  const api: Presentation = {
    get slides() {
      return slides;
    },
    get warnings() {
      return slides.flatMap((slide) => slide.warnings);
    },
    add(component) {
      const definition = typeof component === "function" ? component({ size, theme }) : component;
      assertSlideBounds(definition, size.width, size.height);
      slides.push(definition);
      return api;
    },
    async write(fileName) {
      const { dirname, resolve } = await import("node:path");
      const { mkdir } = await import("node:fs/promises");
      const outputPath = resolve(fileName);
      await mkdir(dirname(outputPath), { recursive: true });
      return toPptxGenJS().writeFile({ fileName: outputPath, compression: true });
    },
    toBlob() {
      return toPptxGenJS().write({ outputType: "blob" }) as Promise<Blob>;
    },
    toPptxGenJS,
  };
  return api;
}
