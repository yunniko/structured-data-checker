import { describe, expect, it } from "vitest";
import { extractJsonLd } from "@/lib/extract-jsonld";

describe("extractJsonLd", () => {
  it("reports an error for empty input", () => {
    const result = extractJsonLd("   ");
    expect(result.entities).toEqual([]);
    expect(result.errors).toHaveLength(1);
  });

  it("parses a bare JSON-LD object", () => {
    const result = extractJsonLd('{"@type": "Article", "headline": "Hi"}');
    expect(result.entities).toHaveLength(1);
    expect(result.entities[0].headline).toBe("Hi");
    expect(result.errors).toEqual([]);
  });

  it("parses a bare array of JSON-LD nodes", () => {
    const result = extractJsonLd('[{"@type": "Article"}, {"@type": "Product"}]');
    expect(result.entities).toHaveLength(2);
  });

  it("flattens an @graph document into separate entities", () => {
    const result = extractJsonLd(
      JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [{ "@type": "Article", headline: "A" }, { "@type": "BreadcrumbList" }],
      }),
    );
    expect(result.entities).toHaveLength(2);
    expect(result.entities[0].headline).toBe("A");
  });

  it("reports a parse error for malformed bare JSON", () => {
    const result = extractJsonLd("{not valid json");
    expect(result.entities).toEqual([]);
    expect(result.errors[0]).toMatch(/Could not parse/);
  });

  it("extracts JSON-LD from a full HTML page with one script block", () => {
    const html = `
      <html><head>
      <script type="application/ld+json">
      {"@type": "Article", "headline": "From HTML"}
      </script>
      </head></html>
    `;
    const result = extractJsonLd(html);
    expect(result.entities).toHaveLength(1);
    expect(result.entities[0].headline).toBe("From HTML");
  });

  it("extracts JSON-LD from multiple script blocks, collecting per-block errors", () => {
    const html = `
      <script type="application/ld+json">{"@type": "Article"}</script>
      <script type="application/ld+json">{not valid}</script>
      <script type="application/ld+json">{"@type": "Product", "name": "X"}</script>
    `;
    const result = extractJsonLd(html);
    expect(result.entities).toHaveLength(2);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatch(/Script block 2/);
  });

  it("reports an error when HTML has no ld+json script block", () => {
    const result = extractJsonLd("<html><body>no structured data here</body></html>");
    expect(result.entities).toEqual([]);
    expect(result.errors[0]).toMatch(/No JSON-LD found/);
  });

  it("matches a script tag regardless of attribute order or quote style", () => {
    const html = `<script id="x" type='application/ld+json'>{"@type": "Article"}</script>`;
    const result = extractJsonLd(html);
    expect(result.entities).toHaveLength(1);
  });
});
