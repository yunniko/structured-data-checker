import { describe, expect, it } from "vitest";
import { normalizeTypeName, resolveRule } from "@/lib/schema-rules";

describe("normalizeTypeName", () => {
  it("passes through a bare type name", () => {
    expect(normalizeTypeName("Article")).toBe("Article");
  });

  it("strips an https://schema.org/ prefix", () => {
    expect(normalizeTypeName("https://schema.org/Article")).toBe("Article");
  });

  it("strips an http://schema.org/ prefix", () => {
    expect(normalizeTypeName("http://schema.org/Product")).toBe("Product");
  });
});

describe("resolveRule", () => {
  it("resolves a canonical type", () => {
    expect(resolveRule("Product")?.type).toBe("Product");
  });

  it("resolves an Article alias", () => {
    expect(resolveRule("NewsArticle")?.type).toBe("Article");
    expect(resolveRule("BlogPosting")?.type).toBe("Article");
  });

  it("resolves a full schema.org URL", () => {
    expect(resolveRule("https://schema.org/LocalBusiness")?.type).toBe("LocalBusiness");
  });

  it("returns null for an unknown type", () => {
    expect(resolveRule("SoftwareApplication")).toBeNull();
  });

  it("flags FAQPage and HowTo as deprecated", () => {
    expect(resolveRule("FAQPage")?.richResultStatus).toBe("deprecated");
    expect(resolveRule("HowTo")?.richResultStatus).toBe("deprecated");
  });
});
