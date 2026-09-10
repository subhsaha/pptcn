import { createSlide } from "../core/slide.js";
import type { SlideComponent } from "../core/types.js";
import { constrainText, requireText } from "../utils/content.js";
import { footerElement } from "./shared.js";

export interface TitleSlideProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  author?: string;
  date?: string;
  footer?: string;
}

export function TitleSlide(props: TitleSlideProps): SlideComponent {
  return ({ size, theme }) => {
    const title = constrainText(requireText(props.title, "title"), 90, "TitleSlide", "title");
    const subtitle = props.subtitle
      ? constrainText(props.subtitle, 140, "TitleSlide", "subtitle")
      : undefined;
    const eyebrow = props.eyebrow
      ? constrainText(props.eyebrow, 40, "TitleSlide", "eyebrow")
      : undefined;
    const slide = createSlide(theme.colors.background);
    const contentWidth = Math.min(9.3, size.width - 2.4);
    const x = 0.82;
    const titleY = eyebrow ? 2.15 : 2.42;

    slide.add({
      type: "shape",
      shape: "rectangle",
      x: 0,
      y: 0,
      width: 0.16,
      height: size.height,
      fill: theme.colors.accent,
    });

    if (eyebrow) {
      slide.add({
        type: "text",
        text: eyebrow.text.toUpperCase(),
        x,
        y: 1.72,
        width: contentWidth,
        height: 0.25,
        style: {
          fontFace: theme.fonts.body,
          fontSize: theme.typography.caption,
          color: theme.colors.accent,
          bold: true,
          margin: 0,
        },
      });
    }

    slide.add({
      type: "text",
      text: title.text,
      x,
      y: titleY,
      width: contentWidth,
      height: 1.35,
      style: {
        fontFace: theme.fonts.heading,
        fontSize: theme.typography.display,
        color: theme.colors.foreground,
        bold: true,
        margin: 0,
        verticalAlign: "middle",
      },
    });

    if (subtitle) {
      slide.add({
        type: "text",
        text: subtitle.text,
        x,
        y: titleY + 1.62,
        width: Math.min(7.6, contentWidth),
        height: 0.7,
        style: {
          fontFace: theme.fonts.body,
          fontSize: theme.typography.body + 1,
          color: theme.colors.mutedForeground,
          margin: 0,
        },
      });
    }

    const metadata = [props.author?.trim(), props.date?.trim()].filter(Boolean).join("  ·  ");
    if (metadata) {
      slide.add({
        type: "text",
        text: metadata,
        x,
        y: size.height - 0.78,
        width: contentWidth,
        height: 0.24,
        style: {
          fontFace: theme.fonts.body,
          fontSize: theme.typography.caption,
          color: theme.colors.mutedForeground,
          margin: 0,
        },
      });
    }

    const footer = footerElement(props.footer, theme, size.width, size.height);
    if (footer) slide.add(footer);
    if (title.warning) slide.warn(title.warning);
    if (subtitle?.warning) slide.warn(subtitle.warning);
    if (eyebrow?.warning) slide.warn(eyebrow.warning);
    return slide.build();
  };
}
