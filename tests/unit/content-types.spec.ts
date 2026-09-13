import { describe, expect, it } from "vitest";
import { CONTENT_TYPES } from "@/lib/content-types";
import { resolveRule } from "@/lib/schema-rules";

describe("CONTENT_TYPES", () => {
  it.each(CONTENT_TYPES)("$label maps to a schemaType this checker's rule set covers", (option) => {
    expect(resolveRule(option.schemaType)).not.toBeNull();
  });

  it("has unique ids", () => {
    const ids = CONTENT_TYPES.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
