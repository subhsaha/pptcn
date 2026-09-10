import { createSlide } from "../core/slide.js";
import type { LayoutWarning, SlideComponent } from "../core/types.js";
import { constrainText, requireText } from "../utils/content.js";
import { footerElement, slideHeading } from "./shared.js";

export type BadgeVariant = "solid" | "outline" | "muted";
export type DataTableValue = string | { label: string; badge: BadgeVariant };

export interface DataTableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: number;
}

export interface DataTableSlideProps {
  title: string;
  eyebrow?: string;
  columns: DataTableColumn[];
  rows: Array<Record<string, DataTableValue>>;
  footer?: string;
}

export function DataTableSlide(props: DataTableSlideProps): SlideComponent {
  return ({ size, theme }) => {
    if (props.columns.length < 2 || props.columns.length > 6) throw new RangeError("DataTableSlide requires between 2 and 6 columns.");
    if (props.rows.length < 1 || props.rows.length > 8) throw new RangeError("DataTableSlide requires between 1 and 8 rows.");
    const keys = new Set(props.columns.map((column) => requireText(column.key, "column.key")));
    if (keys.size !== props.columns.length) throw new TypeError("DataTableSlide column keys must be unique.");
    const configuredWidth = props.columns.reduce((sum, column) => sum + (column.width ?? 1), 0);
    if (configuredWidth <= 0 || props.columns.some((column) => (column.width ?? 1) <= 0)) throw new RangeError("DataTableSlide column widths must be positive.");

    const slide = createSlide(theme.colors.background);
    const heading = slideHeading({ title: props.title, eyebrow: props.eyebrow, bounds: { x: 0.72, y: 0.58, width: size.width - 1.44, height: 1 }, theme, component: "DataTableSlide" });
    slide.add(...heading.elements);
    for (const warning of heading.warnings) slide.warn(warning);

    const table = { x: 0.72, y: heading.contentTop + 0.12, width: size.width - 1.44, height: size.height - heading.contentTop - 0.94 };
    const headerHeight = 0.54;
    const rowHeight = (table.height - headerHeight) / props.rows.length;
    const warnings: LayoutWarning[] = [];
    let x = table.x;

    props.columns.forEach((column) => {
      const width = table.width * ((column.width ?? 1) / configuredWidth);
      const label = constrainText(requireText(column.label, "column.label"), 28, "DataTableSlide", `columns.${column.key}.label`);
      if (label.warning) warnings.push(label.warning);
      slide.add(
        { type: "shape", shape: "rectangle", x, y: table.y, width, height: headerHeight, fill: theme.colors.foreground },
        { type: "text", text: label.text.toUpperCase(), x: x + 0.18, y: table.y, width: width - 0.36, height: headerHeight, style: { fontFace: theme.fonts.body, fontSize: 9, color: theme.colors.accentForeground, bold: true, align: column.align ?? "left", verticalAlign: "middle", margin: 0 } },
      );
      props.rows.forEach((row, rowIndex) => {
        const value = row[column.key] ?? "";
        const labelText = typeof value === "string" ? value : value.label;
        const constrained = constrainText(labelText, 44, "DataTableSlide", `rows[${rowIndex}].${column.key}`);
        if (constrained.warning) warnings.push(constrained.warning);
        const y = table.y + headerHeight + rowIndex * rowHeight;
        slide.add({ type: "shape", shape: "rectangle", x, y, width, height: rowHeight, fill: rowIndex % 2 === 0 ? "FFFFFF" : "F4F4F2", stroke: theme.colors.border, strokeWidth: 0.5 });
        if (typeof value === "string") {
          slide.add({ type: "text", text: constrained.text, x: x + 0.18, y, width: width - 0.36, height: rowHeight, style: { fontFace: theme.fonts.body, fontSize: 10, color: theme.colors.foreground, align: column.align ?? "left", verticalAlign: "middle", margin: 0 } });
        } else {
          const badgeWidth = Math.min(width - 0.36, Math.max(0.76, constrained.text.length * 0.075 + 0.36));
          const badgeX = column.align === "right" ? x + width - badgeWidth - 0.18 : column.align === "center" ? x + (width - badgeWidth) / 2 : x + 0.18;
          const solid = value.badge === "solid";
          slide.add(
            { type: "shape", shape: "rounded-rectangle", x: badgeX, y: y + (rowHeight - 0.3) / 2, width: badgeWidth, height: 0.3, fill: solid ? theme.colors.foreground : value.badge === "muted" ? theme.colors.muted : "FFFFFF", stroke: solid ? theme.colors.foreground : theme.colors.border, strokeWidth: 0.7 },
            { type: "text", text: constrained.text, x: badgeX + 0.1, y: y + (rowHeight - 0.3) / 2, width: badgeWidth - 0.2, height: 0.3, style: { fontFace: theme.fonts.body, fontSize: 8, color: solid ? theme.colors.accentForeground : theme.colors.foreground, bold: true, align: "center", verticalAlign: "middle", margin: 0 } },
          );
        }
      });
      x += width;
    });
    for (const warning of warnings) slide.warn(warning);
    const footer = footerElement(props.footer, theme, size.width, size.height);
    if (footer) slide.add(footer);
    return slide.build();
  };
}
