# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-09-10

### Added

- Generate downloadable PowerPoint blobs directly in browser applications with `Presentation.toBlob()`.
- Import package metadata through the documented `pptcn/package.json` export.

### Changed

- Load Node.js filesystem modules only when writing a presentation to disk, allowing browser bundlers to consume the main package without Node polyfills.
- Share the consumer's PptxGenJS installation through a peer dependency and mark the package as side-effect free for tree shaking.

## [0.1.0] - 2026-09-10

### Added

- Generate editable PowerPoint decks from semantic TypeScript components.
- Compose title, metric card, metric grid, and two-sided comparison slides.
- Pair editable bar and line charts with a concise right-side explanation panel.
- Present financial detail in editable tables with solid, muted, and outline badges.
- Customize consistent typography, colors, and spacing with theme tokens.
- Install as a package or copy source-owned components from a shadcn-compatible registry.
- Validate layout bounds, report constrained content, and verify releases with tests and CI.
- Preview a monochrome financial-summary deck in the project documentation.

### Credit

- Inspired by [pdfcn](https://github.com/shadcn-labs/pdfcn) and powered by [PptxGenJS](https://github.com/gitbrent/PptxGenJS).
