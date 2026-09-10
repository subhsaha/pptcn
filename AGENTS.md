# AGENTS.md

## Project

`pptcn` is an open-source, shadcn-style component library for generating beautiful PowerPoint presentations with code and AI agents.

The goal is not to build a new PowerPoint rendering engine.

The goal is to create a high-quality component and layout layer on top of an existing PPTX renderer, initially `PptxGenJS`.

Think:

> shadcn/ui, but for PowerPoint slides.

Users should be able to install a component, own its source code, modify it, and use it from normal TypeScript or from an AI coding agent.

---

## Core Product Principle

A user should not need to manually reason about PowerPoint coordinates for common slide patterns.

Avoid this:

```ts
slide.addText("Revenue", {
  x: 0.7,
  y: 1.1,
  w: 2.4,
  h: 0.5,
});
```

Prefer this:

```ts
MetricCard({
  label: "Revenue",
  value: "$42M",
  change: "+18%",
});
```

The component should own layout decisions.

The generated output must remain a normal editable `.pptx` file.

---

## Product Philosophy

`pptcn` should be:

- source-owned
- composable
- deterministic
- editable
- agent-friendly
- visually excellent
- small in abstraction
- easy to understand
- easy to copy and modify

Do not create abstractions simply because they are possible.

Every abstraction must remove meaningful presentation-generation complexity.

---

## Non-Goals

Do not build the following unless explicitly requested:

- a PowerPoint replacement
- a browser-based presentation editor
- a Figma-like canvas
- a Canva competitor
- an AI presentation SaaS
- a proprietary rendering engine
- a custom PPTX file parser
- a full React renderer
- collaborative editing
- real-time multiplayer
- backend infrastructure
- authentication
- analytics
- billing
- a marketplace
- Word support
- Excel support

Those may become separate projects or future features.

The initial project is deliberately narrow.

---

# Technology

Use:

- TypeScript
- Node.js
- PptxGenJS
- shadcn registry conventions where appropriate

Prefer a minimal dependency graph.

Do not introduce a dependency when a small local utility is sufficient.

Avoid framework lock-in.

The core library should not depend on React.

---

# Architecture

Prefer this conceptual architecture:

```text
Component API
      ↓
Layout / Component Logic
      ↓
Presentation Model
      ↓
PptxGenJS Renderer
      ↓
.pptx
```

Do not expose raw PptxGenJS positioning throughout the public component API.

It is acceptable for lower-level internals to use PptxGenJS directly.

---

# Repository Structure

Prefer:

```text
pptcn/
├── AGENTS.md
├── README.md
├── LICENSE
├── package.json
├── tsconfig.json
│
├── src/
│   ├── core/
│   │   ├── presentation.ts
│   │   ├── slide.ts
│   │   ├── theme.ts
│   │   ├── layout.ts
│   │   └── types.ts
│   │
│   ├── components/
│   │   ├── title-slide/
│   │   ├── metric-card/
│   │   ├── metric-grid/
│   │   └── comparison-slide/
│   │
│   ├── registry/
│   │
│   └── utils/
│
├── examples/
│   └── basic-deck.ts
│
├── registry/
│
└── output/
```

Do not create directories before they are needed.

---

# Initial Scope

The first usable version should contain only a small number of excellent components.

Start with:

1. `TitleSlide`
2. `MetricCard`
3. `MetricGrid`
4. `ComparisonSlide`

Optional next components:

- `SectionSlide`
- `QuoteSlide`
- `ImageTextSlide`
- `Timeline`
- `TableSlide`

Quality is more important than component count.

Three excellent components are better than thirty mediocre ones.

---

# Component Design

Components should accept semantic data.

Good:

```ts
MetricCard({
  label: "Revenue",
  value: "$42M",
  change: "+18%",
  trend: "up",
});
```

Avoid APIs dominated by presentation coordinates:

```ts
MetricCard({
  x: 1.2,
  y: 2.4,
  width: 3.1,
  height: 1.8,
});
```

Coordinates may be supported internally or as advanced overrides, but they should not be the normal API.

---

# Layout Rules

PowerPoint layout is one of the core problems this project should solve.

Centralize layout calculations.

Do not scatter magic numbers throughout components.

Prefer tokens such as:

```ts
const layout = {
  marginX: 0.65,
  marginY: 0.55,
  gap: 0.24,
};
```

Build reusable helpers for:

- available width
- available height
- equal columns
- equal rows
- gaps
- margins
- alignment
- content regions
- safe slide boundaries

---

# Slide Dimensions

Use standard widescreen presentation dimensions by default:

```text
16:9
```

Avoid assuming arbitrary page sizes inside individual components.

Slide dimensions should come from presentation context.

---

# Themes

Components must use design tokens instead of hardcoded visual styles wherever practical.

A theme may define:

```ts
interface Theme {
  fonts: {
    heading: string;
    body: string;
    mono?: string;
  };

  colors: {
    background: string;
    foreground: string;
    muted: string;
    accent: string;
    border: string;
  };

  typography: {
    title: number;
    heading: number;
    body: number;
    caption: number;
  };

  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}
```

Keep themes simple.

Do not create a CSS clone.

---

# Visual Quality

Generated slides must look intentionally designed.

Avoid:

- excessive borders
- excessive rounded rectangles
- unnecessary shadows
- random accent colors
- tiny text
- dense layouts
- dashboard-like clutter
- generic "AI presentation" aesthetics
- filling every available space
- decorative elements without purpose

Prefer:

- strong typography
- generous whitespace
- clear hierarchy
- restrained color
- consistent alignment
- simple geometry
- deliberate composition

---

# Typography

Typography matters more than decoration.

Default slides should have:

- one dominant visual hierarchy
- clearly distinguishable title/body/caption levels
- sensible line lengths
- enough whitespace around headings
- readable text at presentation distance

Do not shrink text aggressively just to make content fit.

When content exceeds reasonable limits, prefer:

- truncation with an explicit mechanism
- alternative component layouts
- splitting content across slides
- returning a layout warning

over making text unreadably small.

---

# Overflow

Text overflow must be treated as a first-class problem.

Do not silently allow content to leave slide bounds.

Where practical, components should detect obviously excessive content.

Future APIs may return warnings such as:

```ts
{
  warnings: [
    {
      type: "text-overflow",
      component: "ComparisonSlide",
      field: "left.points",
    },
  ],
}
```

Do not build a sophisticated layout solver prematurely.

Start with deterministic constraints.

---

# Intermediate Representation

Avoid tightly coupling every component directly to PptxGenJS.

Prefer a small internal presentation model where useful.

Example:

```ts
type SlideElement =
  | TextElement
  | ShapeElement
  | ImageElement
  | TableElement
  | ChartElement;
```

Example:

```ts
interface TextElement {
  type: "text";
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: TextStyle;
}
```

Do not over-engineer this model initially.

Introduce only the element types required by existing components.

---

# Renderer Boundary

PptxGenJS should be treated as a renderer.

Prefer keeping calls such as:

```ts
slide.addText(...)
slide.addShape(...)
slide.addImage(...)
```

inside renderer or low-level implementation code.

Higher-level components should operate semantically.

This separation should eventually make alternative outputs or previews possible without redesigning every component.

Do not build alternative renderers yet.

---

# Agent-Friendly APIs

One primary user of `pptcn` will be AI coding agents.

Design APIs so an agent can infer correct usage from types and examples.

Prefer:

```ts
ComparisonSlide({
  title: "Build vs Buy",
  left: {
    title: "Build",
    points: ["Full control", "Higher maintenance"],
  },
  right: {
    title: "Buy",
    points: ["Faster launch", "Vendor dependency"],
  },
});
```

Avoid APIs requiring agents to invent visual coordinates.

Types should be descriptive and explicit.

Avoid ambiguous argument names.

Prefer:

```ts
subtitle
footer
caption
items
metrics
left
right
```

over:

```ts
data1
data2
content
config
options2
```

---

# Determinism

The same component props and theme should produce the same layout.

Do not introduce randomness into presentation generation.

This matters for:

- testing
- reproducibility
- AI agents
- visual regression
- debugging

---

# shadcn Philosophy

Components should ultimately be installable as source code.

The intended experience is similar to:

```bash
npx shadcn@latest add @pptcn/metric-grid
```

The installed component should live in the user's repository.

Users should be free to modify it.

Do not design the project around hiding implementation inside a mandatory closed package.

Some shared runtime utilities may eventually exist, but components should remain understandable and editable.

---

# Registry

The registry should eventually expose components such as:

```text
@pptcn/title-slide
@pptcn/metric-card
@pptcn/metric-grid
@pptcn/comparison-slide
```

Do not build a custom registry protocol if the shadcn registry format can support the requirement.

Initially, a static registry is sufficient.

Do not build:

- authentication
- telemetry
- dashboards
- registry databases
- account systems

until there is real usage requiring them.

---

# Blocks

A component is a reusable slide primitive.

A block is a larger composition.

Examples:

```text
components/
  metric-card
  timeline
  comparison-slide

blocks/
  quarterly-business-review
  architecture-overview
  pitch-deck
```

Do not prioritize blocks until the primitives are stable.

---

# Testing

Every component should have at least one deterministic example.

Where practical, test:

- calculated positions
- dimensions
- number of generated elements
- slide bounds
- expected text
- expected theme tokens

Do not rely exclusively on snapshotting binary `.pptx` files.

Prefer unit testing the presentation model or layout calculations.

---

# Visual Testing

Presentation components need visual inspection.

Maintain example decks under:

```text
examples/
```

A basic validation command should eventually generate:

```text
output/demo.pptx
```

The first milestone is complete when:

```bash
npm install
npm run example
```

successfully produces a good-looking editable PowerPoint.

---

# Code Quality

Use:

- strict TypeScript
- descriptive types
- small functions
- explicit exports
- predictable naming

Avoid:

- `any`
- giant configuration objects
- deep class hierarchies
- unnecessary inheritance
- unnecessary decorators
- unnecessary metaprogramming
- premature plugin systems

Prefer plain functions and plain objects.

---

# Public API

Keep the public API small.

A desirable direction:

```ts
import {
  createPresentation,
  TitleSlide,
  MetricGrid,
  ComparisonSlide,
} from "pptcn";
```

Example:

```ts
const deck = createPresentation({
  theme: "default",
});

deck.add(
  TitleSlide({
    title: "Q3 Business Review",
    subtitle: "Performance and priorities",
  }),
);

deck.add(
  MetricGrid({
    title: "Key Metrics",
    metrics: [
      {
        label: "Revenue",
        value: "$42M",
        change: "+18%",
      },
      {
        label: "Retention",
        value: "94%",
        change: "+3%",
      },
    ],
  }),
);

await deck.write("output/review.pptx");
```

The actual API may evolve, but preserve the semantic nature of this example.

---

# Naming

Use clear presentation terminology.

Prefer:

```text
TitleSlide
MetricCard
MetricGrid
ComparisonSlide
SectionSlide
Timeline
```

Avoid clever internal names.

Files and registry component names should generally use kebab-case.

Example:

```text
comparison-slide.ts
metric-grid.ts
```

TypeScript exported components should use PascalCase.

---

# Accessibility and Compatibility

Generated presentations should remain editable in standard PowerPoint-compatible software.

Avoid implementation tricks that unnecessarily rasterize text.

Prefer native PowerPoint:

- text
- shapes
- tables
- charts

when practical.

Use images only when the content is inherently image-based.

---

# Performance

Performance is not the first optimization target.

Correctness and visual quality matter more.

However:

- avoid repeated filesystem operations
- avoid unnecessary image conversions
- avoid huge embedded assets
- avoid generating duplicate resources

Do not introduce caching infrastructure until measurements justify it.

---

# Dependency Policy

Before adding a dependency, ask:

1. Does PptxGenJS already solve this?
2. Can this be implemented clearly in fewer than roughly 100 lines?
3. Will this dependency become part of the user's installed component?
4. Is the dependency actively maintained?
5. Does the value justify the additional surface area?

Keep the project lightweight.

---

# Documentation

Every component should eventually document:

1. what it is for
2. installation
3. basic usage
4. props
5. example output
6. customization
7. limitations

Examples should be copy-pasteable.

Prefer real business presentation content over lorem ipsum.

---

# README Positioning

Use this positioning consistently:

> Beautiful, composable PowerPoint components for code and AI agents.

A longer description:

> `pptcn` is a shadcn-style component library for programmatic PowerPoint generation. Install the components you need, own the source code, customize the design, and generate editable presentations from TypeScript or AI coding agents.

Do not describe the project as an AI presentation generator.

AI agents are a user of the system, not the core architecture.

---

# Development Priorities

When deciding what to work on, use this order:

```text
1. Does the generated slide look excellent?
2. Is the API semantically simple?
3. Can an AI agent use it correctly?
4. Is the generated PPTX editable?
5. Is the implementation understandable?
6. Is it reusable?
7. Is it easy to install?
```

Do not optimize for number of features.

---

# First Milestone

Do not expand scope until all of the following work:

```text
createPresentation()
TitleSlide()
MetricCard()
MetricGrid()
ComparisonSlide()
```

And:

```bash
npm run example
```

produces:

```text
output/demo.pptx
```

The example deck should contain at least:

```text
Slide 1: TitleSlide
Slide 2: MetricGrid
Slide 3: ComparisonSlide
```

All slides must be editable PowerPoint objects.

---

# Second Milestone

After the first milestone is solid:

- introduce theme tokens
- improve layout utilities
- add SectionSlide
- add ImageTextSlide
- add Timeline
- add basic registry entries
- create component documentation
- create preview images for documentation

---

# Future Direction

Potential future projects include:

```text
pptcn    → PowerPoint
doccn    → Word
sheetcn  → Excel
```

Potential umbrella:

```text
officecn
```

Do not introduce cross-format abstractions into `pptcn` until at least one other format genuinely exists.

Do not compromise the PowerPoint API in anticipation of hypothetical Word or Excel support.

---

# Important Rule for Agents

When implementing a requested feature:

1. Inspect existing components first.
2. Reuse existing layout and theme primitives.
3. Keep changes scoped.
4. Do not refactor unrelated code.
5. Do not introduce new architecture without necessity.
6. Generate or update an example demonstrating the change.
7. Verify that the resulting `.pptx` remains editable.
8. Run existing tests and type checks.
9. Prefer the smallest coherent implementation.
10. Document meaningful public API changes.

---

# When Requirements Are Ambiguous

Prefer the choice that results in:

- less API surface
- fewer dependencies
- simpler source code
- stronger visual quality
- more deterministic output
- better agent usability

Do not solve hypothetical future problems.

---

# Definition of Done

A component is not complete merely because it generates a PPTX.

It is complete when:

- its API is understandable
- its output looks intentionally designed
- it stays inside slide bounds
- it respects the theme
- it creates editable PowerPoint elements
- it has an example
- it has reasonable tests
- an AI coding agent can infer how to use it
- its implementation can be modified by a normal TypeScript developer

---

# Guiding Principle

Whenever choosing between flexibility and simplicity, default toward simplicity.

Whenever choosing between more features and better slides, choose better slides.

Whenever choosing between clever abstractions and readable source code, choose readable source code.

The project's advantage should come from:

> excellent components, excellent defaults, and an API that lets humans and agents think in presentation concepts instead of PowerPoint coordinates.