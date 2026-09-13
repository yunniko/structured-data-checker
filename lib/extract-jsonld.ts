// Pulls JSON-LD structured-data nodes out of whatever the user pastes: a
// bare JSON-LD object/array, or a full HTML page source containing one or
// more <script type="application/ld+json"> blocks. Pure string-in,
// data-out — no DOM parser needed, so this runs identically server- or
// client-side and is unit-testable without jsdom.

export interface ExtractResult {
  entities: Record<string, unknown>[];
  errors: string[];
}

// A JSON-LD document may be a single node, an array of nodes, or an object
// using @graph to bundle several nodes under one shared @context. Flatten
// all of those shapes into a plain list of nodes to evaluate individually.
function flattenNode(parsed: unknown): Record<string, unknown>[] {
  if (Array.isArray(parsed)) {
    return parsed.flatMap(flattenNode);
  }
  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj["@graph"])) {
      return (obj["@graph"] as unknown[]).flatMap(flattenNode);
    }
    return [obj];
  }
  return [];
}

const SCRIPT_TAG_RE = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi;

export function extractJsonLd(raw: string): ExtractResult {
  const input = raw.trim();
  const entities: Record<string, unknown>[] = [];
  const errors: string[] = [];

  if (!input) {
    return { entities, errors: ["No input provided."] };
  }

  // Case 1: the whole input is itself JSON-LD (a paste of just the object,
  // not the surrounding <script> tag or page).
  if (input[0] === "{" || input[0] === "[") {
    try {
      const parsed = JSON.parse(input);
      return { entities: flattenNode(parsed), errors: [] };
    } catch (err) {
      return { entities: [], errors: [`Could not parse as JSON: ${(err as Error).message}`] };
    }
  }

  // Case 2: full HTML — pull out every ld+json script block.
  const matches = [...input.matchAll(SCRIPT_TAG_RE)];
  if (matches.length === 0) {
    return {
      entities: [],
      errors: [
        "No JSON-LD found. Paste either a raw JSON-LD object, or full HTML containing a " +
          '<script type="application/ld+json"> block.',
      ],
    };
  }

  matches.forEach((match, index) => {
    const blockText = match[1].trim();
    try {
      const parsed = JSON.parse(blockText);
      entities.push(...flattenNode(parsed));
    } catch (err) {
      errors.push(`Script block ${index + 1}: could not parse as JSON (${(err as Error).message}).`);
    }
  });

  return { entities, errors };
}
