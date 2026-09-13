import { describe, expect, it } from "vitest";
import { checkStructuredData } from "@/lib/check-structured-data";

describe("checkStructuredData", () => {
  it("reports a fully valid Article with no missing required properties", () => {
    const report = checkStructuredData(
      JSON.stringify({
        "@type": "Article",
        headline: "Hi",
        author: { name: "Jane", url: "https://example.com/authors/jane" },
        datePublished: "2026-01-01",
        dateModified: "2026-01-02",
        image: "https://example.com/a.jpg",
      }),
    );
    expect(report.entities).toHaveLength(1);
    expect(report.entities[0].valid).toBe(true);
    expect(report.entities[0].missingRequired).toEqual([]);
    expect(report.entities[0].missingRecommended).toEqual([]);
  });

  it("flags a Product missing the required name", () => {
    const report = checkStructuredData(JSON.stringify({ "@type": "Product", offers: { price: "1" } }));
    const entity = report.entities[0];
    expect(entity.valid).toBe(false);
    expect(entity.missingRequired).toContain("name");
  });

  it("flags a Product with a name but none of review/aggregateRating/offers", () => {
    const report = checkStructuredData(JSON.stringify({ "@type": "Product", name: "Widget" }));
    const entity = report.entities[0];
    expect(entity.valid).toBe(false);
    expect(entity.oneOfIssues[0]).toMatch(/review, aggregateRating, offers/);
  });

  it("resolves a nested required path (Event location.address)", () => {
    const report = checkStructuredData(
      JSON.stringify({
        "@type": "Event",
        name: "Meetup",
        startDate: "2026-12-01T19:00",
        location: { name: "Venue" },
      }),
    );
    const entity = report.entities[0];
    expect(entity.missingRequired).toContain("location.address");
    expect(entity.missingRequired).not.toContain("location.name");
  });

  it("validates BreadcrumbList structurally, not through generic dot-paths", () => {
    const tooFew = checkStructuredData(
      JSON.stringify({
        "@type": "BreadcrumbList",
        itemListElement: [{ position: 1, name: "Home" }],
      }),
    );
    expect(tooFew.entities[0].valid).toBe(false);
    expect(tooFew.entities[0].missingRequired[0]).toMatch(/at least two/);

    const valid = checkStructuredData(
      JSON.stringify({
        "@type": "BreadcrumbList",
        itemListElement: [
          { position: 1, name: "Home", item: "https://example.com/" },
          { position: 2, name: "Category" },
        ],
      }),
    );
    expect(valid.entities[0].valid).toBe(true);
  });

  it("flags FAQPage as deprecated even when internally well-formed", () => {
    const report = checkStructuredData(
      JSON.stringify({
        "@type": "FAQPage",
        mainEntity: [{ "@type": "Question", name: "Q?", acceptedAnswer: { "@type": "Answer", text: "A." } }],
      }),
    );
    expect(report.entities[0].richResultStatus).toBe("deprecated");
    expect(report.entities[0].statusNote).toMatch(/May 7, 2026/);
  });

  it("reports an entity with no @type as unknown, not as a false pass", () => {
    const report = checkStructuredData(JSON.stringify({ headline: "no type here" }));
    expect(report.entities[0].richResultStatus).toBe("unknown");
    expect(report.entities[0].valid).toBe(false);
  });

  it("reports a type this checker doesn't cover as unknown rather than invalid", () => {
    const report = checkStructuredData(JSON.stringify({ "@type": "SoftwareApplication", name: "App" }));
    expect(report.entities[0].richResultStatus).toBe("unknown");
    expect(report.entities[0].sourceUrl).toMatch(/rich-results/);
  });

  it("evaluates every entity in a multi-entity document independently", () => {
    const report = checkStructuredData(
      JSON.stringify([
        { "@type": "Product", name: "Widget" },
        { "@type": "Article", headline: "Hi" },
      ]),
    );
    expect(report.entities).toHaveLength(2);
    expect(report.entities[0].valid).toBe(false);
    expect(report.entities[1].valid).toBe(true);
  });

  it("flags a Product offer with no price even though the oneOf group is satisfied", () => {
    const report = checkStructuredData(
      JSON.stringify({ "@type": "Product", name: "Widget", offers: { "@type": "Offer", availability: "https://schema.org/InStock" } }),
    );
    const entity = report.entities[0];
    expect(entity.oneOfIssues).toEqual([]);
    expect(entity.valid).toBe(false);
    expect(entity.missingRequired[0]).toMatch(/offers\.price/);
  });

  it("accepts a Product offer priced via priceSpecification.price", () => {
    const report = checkStructuredData(
      JSON.stringify({
        "@type": "Product",
        name: "Widget",
        offers: { "@type": "Offer", priceSpecification: { price: 9.99 } },
      }),
    );
    expect(report.entities[0].valid).toBe(true);
  });

  it("flags a Review of an itemReviewed type Google doesn't support for this feature", () => {
    const report = checkStructuredData(
      JSON.stringify({
        "@type": "Review",
        author: { name: "Jane" },
        itemReviewed: { "@type": "Person", name: "Bob" },
        reviewRating: { ratingValue: 5 },
      }),
    );
    const entity = report.entities[0];
    expect(entity.valid).toBe(false);
    expect(entity.missingRequired.some((m) => m.includes("itemReviewed.@type"))).toBe(true);
  });

  it("accepts a Review of a supported itemReviewed type", () => {
    const report = checkStructuredData(
      JSON.stringify({
        "@type": "Review",
        author: { name: "Jane" },
        itemReviewed: { "@type": "Product", name: "Widget" },
        reviewRating: { ratingValue: 5 },
      }),
    );
    expect(report.entities[0].valid).toBe(true);
  });

  it("explains virtual-only Event locations as ineligible rather than merely incomplete", () => {
    const report = checkStructuredData(
      JSON.stringify({
        "@type": "Event",
        name: "Webinar",
        startDate: "2026-12-01T19:00",
        location: { "@type": "VirtualLocation", url: "https://example.com/join" },
      }),
    );
    const entity = report.entities[0];
    expect(entity.missingRequired).not.toContain("location.name");
    expect(entity.missingRequired).not.toContain("location.address");
    expect(entity.missingRequired.some((m) => m.includes("virtual-only"))).toBe(true);
  });

  it("surfaces parse errors alongside any successfully parsed entities", () => {
    const report = checkStructuredData(
      '<script type="application/ld+json">{"@type":"Article"}</script><script type="application/ld+json">{bad}</script>',
    );
    expect(report.entities).toHaveLength(1);
    expect(report.parseErrors).toHaveLength(1);
  });
});
