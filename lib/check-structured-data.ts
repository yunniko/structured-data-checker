import { extractJsonLd } from "./extract-jsonld";
import {
  RICH_RESULTS_TEST_URL,
  SUPPORTED_ITEM_REVIEWED_TYPES,
  normalizeTypeName,
  resolveRule,
  type RichResultStatus,
} from "./schema-rules";

export interface EntityReport {
  entityIndex: number;
  types: string[];
  matchedType: string | null;
  richResultStatus: RichResultStatus | "unknown";
  statusNote: string;
  missingRequired: string[];
  oneOfIssues: string[];
  missingRecommended: string[];
  sourceUrl: string | null;
  sourceLabel: string | null;
  valid: boolean;
}

export interface CheckReport {
  entities: EntityReport[];
  parseErrors: string[];
}

function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && !Array.isArray(current)) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function isPresent(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function rawTypesOf(entity: Record<string, unknown>): string[] {
  const raw = entity["@type"];
  if (typeof raw === "string") return [raw];
  if (Array.isArray(raw)) return raw.filter((t): t is string => typeof t === "string");
  return [];
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

// BreadcrumbList's requirement isn't "is this property present" but "does
// itemListElement have the right shape" — checked structurally rather than
// through the generic dot-path required/recommended lists.
function checkBreadcrumbList(entity: Record<string, unknown>): string[] {
  const items = entity.itemListElement;
  if (!Array.isArray(items) || items.length < 2) {
    return ["itemListElement must be an array with at least two entries."];
  }
  const issues: string[] = [];
  items.forEach((item, index) => {
    if (!item || typeof item !== "object") {
      issues.push(`Item ${index + 1}: not an object.`);
      return;
    }
    const record = item as Record<string, unknown>;
    if (!isPresent(record.position)) issues.push(`Item ${index + 1}: missing "position".`);
    if (!isPresent(record.name)) issues.push(`Item ${index + 1}: missing "name".`);
    const isLast = index === items.length - 1;
    if (!isLast && !isPresent(record.item)) {
      issues.push(`Item ${index + 1}: missing "item" (URL) — only optional on the last entry.`);
    }
  });
  return issues;
}

// Google requires a physical location for Event rich results. A VirtualLocation
// makes the generic "location.name/location.address missing" messages
// misleading (the real problem isn't incompleteness, it's ineligibility) —
// swap them for one clear explanation instead.
function applyEventVirtualLocationOverride(entity: Record<string, unknown>, missingRequired: string[]): string[] {
  const location = asRecord(entity.location);
  const locationTypes = location ? rawTypesOf(location).map(normalizeTypeName) : [];
  if (!locationTypes.includes("VirtualLocation")) return missingRequired;
  return missingRequired
    .filter((path) => path !== "location.name" && path !== "location.address")
    .concat([
      "This event's location is marked virtual-only (VirtualLocation) — Google requires a " +
        "physical location for Event rich results, so it isn't eligible no matter what other " +
        "properties are added.",
    ]);
}

// Checks that can't be expressed as a flat required-path list: a Product's
// offers, if present at all, needs a price inside it (not just recommended);
// a Review/AggregateRating's itemReviewed, if it declares a @type, must be
// one Google actually supports for this feature.
function extraStructuralIssues(ruleType: string, entity: Record<string, unknown>): string[] {
  const issues: string[] = [];

  if (ruleType === "Product") {
    const offer = asRecord(entity.offers);
    if (offer) {
      const hasPrice = isPresent(offer.price) || isPresent(getPath(offer, "priceSpecification.price"));
      if (!hasPrice) {
        issues.push("offers.price (or offers.priceSpecification.price) is required when offers is present.");
      }
    }
  }

  if (ruleType === "Review" || ruleType === "AggregateRating") {
    const itemReviewed = asRecord(entity.itemReviewed);
    if (itemReviewed) {
      const types = rawTypesOf(itemReviewed).map(normalizeTypeName);
      if (types.length > 0 && !types.some((t) => SUPPORTED_ITEM_REVIEWED_TYPES.includes(t))) {
        issues.push(
          `itemReviewed.@type ("${types.join(", ")}") is not one of the types Google supports for this ` +
            `feature: ${SUPPORTED_ITEM_REVIEWED_TYPES.join(", ")}.`,
        );
      }
    }
  }

  return issues;
}

function evaluateEntity(entity: Record<string, unknown>, entityIndex: number): EntityReport {
  const types = rawTypesOf(entity);

  if (types.length === 0) {
    return {
      entityIndex,
      types,
      matchedType: null,
      richResultStatus: "unknown",
      statusNote: "This entity has no @type, so Google can't identify what kind of content it describes.",
      missingRequired: [],
      oneOfIssues: [],
      missingRecommended: [],
      sourceUrl: null,
      sourceLabel: null,
      valid: false,
    };
  }

  const rule = types.map(resolveRule).find((r) => r !== null) ?? null;

  if (!rule) {
    return {
      entityIndex,
      types,
      matchedType: null,
      richResultStatus: "unknown",
      statusNote:
        `${types.join(", ")} is not one of the types this checker currently covers. ` +
        "That doesn't mean it's invalid — check it against Google's own Rich Results Test.",
      missingRequired: [],
      oneOfIssues: [],
      missingRecommended: [],
      sourceUrl: RICH_RESULTS_TEST_URL,
      sourceLabel: "Google Rich Results Test",
      valid: false,
    };
  }

  let missingRequired =
    rule.type === "BreadcrumbList"
      ? checkBreadcrumbList(entity)
      : rule.required.filter((path) => !isPresent(getPath(entity, path)));

  if (rule.type === "Event") {
    missingRequired = applyEventVirtualLocationOverride(entity, missingRequired);
  }

  missingRequired = missingRequired.concat(extraStructuralIssues(rule.type, entity));

  const oneOfIssues = (rule.oneOfRequired ?? [])
    .filter((group) => !group.some((path) => isPresent(getPath(entity, path))))
    .map((group) => `At least one of: ${group.join(", ")}.`);

  const missingRecommended = rule.recommended.filter((path) => !isPresent(getPath(entity, path)));

  return {
    entityIndex,
    types,
    matchedType: rule.type,
    richResultStatus: rule.richResultStatus,
    statusNote: rule.statusNote,
    missingRequired,
    oneOfIssues,
    missingRecommended,
    sourceUrl: rule.sourceUrl,
    sourceLabel: rule.sourceLabel,
    valid: missingRequired.length === 0 && oneOfIssues.length === 0,
  };
}

export function checkStructuredData(raw: string): CheckReport {
  const { entities, errors } = extractJsonLd(raw);
  return {
    entities: entities.map((entity, index) => evaluateEntity(entity, index)),
    parseErrors: errors,
  };
}
