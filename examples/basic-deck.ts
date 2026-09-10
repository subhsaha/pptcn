import { ChartSlide, DataTableSlide, MetricGrid, TitleSlide, createPresentation } from "../src/index.js";

const deck = createPresentation({
  author: "pptcn",
  title: "FY2026 Financial Summary",
  subject: "Editable presentation generated with pptcn",
});

deck.add(TitleSlide({
  eyebrow: "Quarterly review",
  title: "Profitable growth, by design",
  subtitle: "FY2026 financial summary, operating leverage, and the decisions behind the numbers.",
  author: "Finance & Strategy",
  date: "FY2026",
}));

deck.add(MetricGrid({
  eyebrow: "Performance",
  title: "Financial performance at a glance",
  metrics: [
    { label: "Revenue", value: "$42.8M", change: "+18.4% YoY", trend: "up", description: "$1.8M ahead of plan" },
    { label: "Gross profit", value: "$32.5M", change: "+22.1% YoY", trend: "up", description: "76% gross margin" },
    { label: "Operating income", value: "$6.4M", change: "+$4.2M", trend: "up", description: "15% operating margin" },
    { label: "Free cash flow", value: "$7.1M", change: "+68% YoY", trend: "up", description: "111% cash conversion" },
  ],
  footer: "Source: Finance · FY2026 management accounts · USD",
}));

deck.add(ChartSlide({
  eyebrow: "Growth",
  title: "Revenue accelerated through the year",
  chart: {
    type: "bar",
    categories: ["Q1", "Q2", "Q3", "Q4"],
    series: [{ name: "Revenue ($M)", values: [8.9, 10.1, 11.2, 12.6] }],
    showValues: true,
    valueFormat: "$0.0",
    altText: "Quarterly revenue rose from 8.9 million dollars in Q1 to 12.6 million dollars in Q4.",
  },
  insight: {
    title: "The exit rate matters",
    summary: "Q4 revenue was 42% above Q1, giving the business a stronger base for the next fiscal year.",
    points: ["Enterprise expansion drove 61% of growth", "No quarter relied on one-time revenue", "Q4 finished 6% above plan"],
  },
  footer: "Quarterly revenue · USD millions",
  speakerNotes: "Emphasize the sequential acceleration and the quality of recurring growth.",
}));

deck.add(DataTableSlide({
  eyebrow: "Detail",
  title: "Quarterly operating summary",
  columns: [
    { key: "quarter", label: "Quarter", width: 1 },
    { key: "revenue", label: "Revenue", align: "right" },
    { key: "grossMargin", label: "Gross margin", align: "right" },
    { key: "operatingMargin", label: "Operating margin", align: "right" },
    { key: "status", label: "Vs plan", align: "center" },
  ],
  rows: [
    { quarter: "Q1", revenue: "$8.9M", grossMargin: "72%", operatingMargin: "8%", status: { label: "On plan", badge: "outline" } },
    { quarter: "Q2", revenue: "$10.1M", grossMargin: "74%", operatingMargin: "11%", status: { label: "Ahead", badge: "muted" } },
    { quarter: "Q3", revenue: "$11.2M", grossMargin: "75%", operatingMargin: "14%", status: { label: "Ahead", badge: "muted" } },
    { quarter: "Q4", revenue: "$12.6M", grossMargin: "78%", operatingMargin: "19%", status: { label: "Beat", badge: "solid" } },
  ],
  footer: "Management accounts · USD millions",
}));

deck.add(ChartSlide({
  eyebrow: "Efficiency",
  title: "Margins expanded while investment continued",
  chart: {
    type: "line",
    categories: ["Q1", "Q2", "Q3", "Q4"],
    series: [
      { name: "Gross margin", values: [72, 74, 75, 78] },
      { name: "Operating margin", values: [8, 11, 14, 19] },
    ],
    valueFormat: "0%",
    altText: "Gross margin increased from 72 to 78 percent and operating margin increased from 8 to 19 percent.",
  },
  insight: {
    title: "Scale is converting",
    summary: "Product and infrastructure leverage funded continued go-to-market investment without sacrificing profitability.",
    points: ["Gross margin gained 6 points", "Operating margin more than doubled", "Hiring remained within plan"],
  },
  footer: "Margins shown as percent of revenue",
}));

const output = process.env.PPTCN_OUTPUT ?? "output/demo.pptx";
await deck.write(output);
console.log(`Created ${output} with ${deck.slides.length} editable slides.`);
