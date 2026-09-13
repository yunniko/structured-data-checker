import { describe, expect, it } from "vitest";
import { exampleTypes, getExampleSnippet } from "@/lib/example-snippet";
import { checkStructuredData } from "@/lib/check-structured-data";

describe("example snippets", () => {
  it("returns null for a type with no example", () => {
    expect(getExampleSnippet("NotARealType")).toBeNull();
  });

  it("returns a deep-cloned object each call (mutating one doesn't affect another)", () => {
    const first = getExampleSnippet("Article")!;
    (first as Record<string, unknown>).headline = "mutated";
    const second = getExampleSnippet("Article")!;
    expect(second.headline).not.toBe("mutated");
  });

  it.each(exampleTypes())("the %s example passes this project's own checker as valid", (type) => {
    const snippet = getExampleSnippet(type)!;
    const report = checkStructuredData(JSON.stringify(snippet));
    expect(report.entities).toHaveLength(1);
    expect(report.entities[0].missingRequired).toEqual([]);
    expect(report.entities[0].oneOfIssues).toEqual([]);
    expect(report.entities[0].valid).toBe(true);
  });
});
