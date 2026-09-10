import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const sharedFiles = [
  "src/core/types.ts",
  "src/core/theme.ts",
  "src/core/layout.ts",
  "src/core/elements.ts",
  "src/core/slide.ts",
  "src/core/renderer.ts",
  "src/core/presentation.ts",
  "src/utils/content.ts",
  "src/components/shared.ts",
];

const items = [
  { name: "title-slide", description: "A strong, typographic opening slide.", component: "src/components/title-slide.ts" },
  { name: "metric-card", description: "A focused slide for one headline metric.", component: "src/components/metric-card.ts" },
  { name: "metric-grid", description: "A balanced grid for two to eight business metrics.", component: "src/components/metric-grid.ts", extras: ["src/components/metric-card.ts"] },
  { name: "comparison-slide", description: "A clear two-column decision or tradeoff slide.", component: "src/components/comparison-slide.ts" },
  { name: "chart-slide", description: "An editable native chart with a right-side explanation panel.", component: "src/components/chart-slide.ts" },
  { name: "data-table-slide", description: "An editable monochrome data table with semantic status badges.", component: "src/components/data-table-slide.ts" },
];

await mkdir(resolve("public/r"), { recursive: true });
for (const item of items) {
  const paths = [...sharedFiles, ...(item.extras ?? []), item.component];
  const files = await Promise.all(paths.map(async (path) => ({
    path,
    target: path,
    type: path.includes("/components/") ? "registry:component" : "registry:lib",
    content: await readFile(resolve(path), "utf8"),
  })));
  const title = basename(item.component, ".ts").split("-").map((word) => `${word[0]?.toUpperCase()}${word.slice(1)}`).join(" ");
  await writeFile(resolve(`public/r/${item.name}.json`), `${JSON.stringify({
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: "registry:component",
    title,
    description: item.description,
    dependencies: ["pptxgenjs"],
    files,
  }, null, 2)}\n`);
}

await writeFile(resolve("registry.json"), `${JSON.stringify({
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "pptcn",
  homepage: "https://github.com/subhsaha/pptcn",
  items: items.map((item) => ({ name: item.name, type: "registry:component", title: item.name, description: item.description })),
}, null, 2)}\n`);
console.log(`Built ${items.length} registry items in public/r.`);
