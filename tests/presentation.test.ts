import { mkdtemp, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { TitleSlide, createPresentation } from "../src/index.js";

describe("presentation", () => {
  it("collects slide definitions and produces a valid PPTX archive", async () => {
    const directory = await mkdtemp(join(tmpdir(), "pptcn-test-"));
    const output = join(directory, "deck.pptx");
    const deck = createPresentation({ title: "Test deck" });
    deck.add(TitleSlide({ title: "Hello" }));
    await deck.write(output);

    expect(deck.slides).toHaveLength(1);
    expect((await stat(output)).size).toBeGreaterThan(10_000);
    expect((await readFile(output)).subarray(0, 2).toString()).toBe("PK");
  });

  it("rejects elements outside custom slide bounds", () => {
    const deck = createPresentation({ size: { width: 2, height: 2 } });
    expect(() => deck.add(TitleSlide({ title: "Too small" }))).toThrow("exceeds slide bounds");
  });

  it("accepts raw definitions, aggregates warnings, and supports custom layouts", () => {
    const deck = createPresentation({ size: { width: 10, height: 5.625 } });
    deck.add({
      background: "FFFFFF",
      elements: [],
      warnings: [{ type: "text-overflow", component: "Test", field: "title", message: "Too long" }],
    });
    expect(deck.warnings).toHaveLength(1);
    expect(deck.toPptxGenJS().layout).toBe("PPTCN_CUSTOM");
  });

  it("creates a browser-compatible Blob without exposing the renderer API", async () => {
    const deck = createPresentation({ title: "Browser deck" });
    deck.add(TitleSlide({ title: "Download me" }));

    const blob = await deck.toBlob();

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(10_000);
    expect(new Uint8Array(await blob.slice(0, 2).arrayBuffer())).toEqual(new Uint8Array([0x50, 0x4b]));
  });
});
