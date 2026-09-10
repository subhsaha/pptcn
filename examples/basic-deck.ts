import { ComparisonSlide, MetricGrid, TitleSlide, createPresentation } from "../src/index.js";

const deck = createPresentation({
  author: "pptcn",
  title: "Q3 Business Review",
  subject: "Editable presentation generated with pptcn",
});

deck.add(TitleSlide({
  eyebrow: "Quarterly review",
  title: "Building durable growth",
  subtitle: "Q3 performance, customer signals, and the decisions that shape our next quarter.",
  author: "Strategy & Operations",
  date: "September 2026",
}));

deck.add(MetricGrid({
  eyebrow: "Performance",
  title: "Momentum across the business",
  metrics: [
    { label: "Annual recurring revenue", value: "$42.8M", change: "+18.4% YoY", trend: "up", description: "Ahead of the operating plan" },
    { label: "Net revenue retention", value: "118%", change: "+6 pts", trend: "up", description: "Expansion led by enterprise" },
    { label: "Gross margin", value: "76%", change: "+2.1 pts", trend: "up", description: "Infrastructure efficiency" },
    { label: "Sales cycle", value: "47 days", change: "−8 days", trend: "up", description: "Faster proof-to-production" },
  ],
  footer: "Source: Finance and Revenue Operations · Q3 close",
}));

deck.add(ComparisonSlide({
  eyebrow: "Decision",
  title: "Build the platform, buy the commodity",
  left: {
    title: "Build in-house",
    subtitle: "Where differentiation compounds",
    accent: "primary",
    points: ["Own the customer workflow", "Tune deeply to proprietary data", "Create durable product leverage", "Accept higher near-term investment"],
  },
  right: {
    title: "Partner",
    subtitle: "Where speed matters more than ownership",
    accent: "muted",
    points: ["Launch with proven infrastructure", "Reduce maintenance burden", "Preserve focus for core product", "Manage vendor concentration risk"],
  },
  footer: "Recommendation: invest engineering time only where it changes the customer outcome",
}));

await deck.write("output/demo.pptx");
console.log(`Created output/demo.pptx with ${deck.slides.length} editable slides.`);
