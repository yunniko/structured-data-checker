// Curated rule set for the schema.org / JSON-LD types this checker
// evaluates. This is deliberately a small, well-sourced subset, not a full
// schema.org vocabulary implementation — every `sourceUrl` below was fetched
// and read directly from developers.google.com on 2026-09-13 (not recalled
// from training data, which would be stale for a policy area that changes
// as often as this one; see docs/domain-reference.md and docs/decisions/D003,
// which records a domain-expert review that corrected several entries below —
// notably the LocalBusiness self-review pattern, the Merchant Center claim,
// and the scope of the "self-serving review" restriction). A type not in
// this list is reported as "not covered", never as invalid — this checker
// is not a substitute for Google's own Rich Results Test.
//
// `required`/`recommended` are dot-paths resolved against the parsed JSON-LD
// node (see check-structured-data.ts). `oneOfRequired` is a list of groups;
// at least one path in each group must be present.

export type RichResultStatus = "eligible" | "restricted" | "deprecated";

export interface SchemaTypeRule {
  type: string;
  aliases?: string[];
  required: string[];
  oneOfRequired?: string[][];
  recommended: string[];
  richResultStatus: RichResultStatus;
  statusNote: string;
  sourceUrl: string;
  sourceLabel: string;
}

// Google's Review/AggregateRating docs only support `itemReviewed` being one
// of these types (plus a handful of media types this checker doesn't cover).
// Used to catch a real false-positive class: a Review of e.g. a bare Person
// would otherwise report "eligible" when Google doesn't support it at all.
export const SUPPORTED_ITEM_REVIEWED_TYPES = [
  "Book",
  "Course",
  "Event",
  "LocalBusiness",
  "Movie",
  "Product",
  "Recipe",
  "SoftwareApplication",
  "Organization",
];

export const RULES: SchemaTypeRule[] = [
  {
    type: "Article",
    aliases: ["NewsArticle", "BlogPosting"],
    required: [],
    recommended: ["headline", "author", "author.name", "author.url", "datePublished", "dateModified", "image"],
    richResultStatus: "eligible",
    statusNote:
      "No properties are strictly required, but Google recommends these to show author, " +
      "date, and image details in search results and to support features like Top Stories.",
    sourceUrl: "https://developers.google.com/search/docs/appearance/structured-data/article",
    sourceLabel: "Google Search Central — Article structured data",
  },
  {
    type: "Product",
    required: ["name"],
    oneOfRequired: [["review", "aggregateRating", "offers"]],
    recommended: ["aggregateRating", "offers", "offers.priceCurrency", "review"],
    richResultStatus: "eligible",
    statusNote:
      "Google requires at least one of review, aggregateRating, or offers alongside name — and " +
      "if you include offers, a price is required inside it. Merchant listing (shopping) " +
      "eligibility mainly needs a few extra Offer details (a real price, priceCurrency, and " +
      "using Offer rather than AggregateOffer) — it does not require a separate Merchant Center feed.",
    sourceUrl: "https://developers.google.com/search/docs/appearance/structured-data/product-snippet",
    sourceLabel: "Google Search Central — Product snippet structured data",
  },
  {
    type: "LocalBusiness",
    required: ["name", "address"],
    recommended: ["telephone", "openingHoursSpecification", "priceRange", "geo", "url"],
    richResultStatus: "eligible",
    statusNote:
      "Only name and address are required, but Google states that more properties " +
      "(hours, phone, price range) produce a materially higher-quality result. Use the most " +
      "specific subtype you can (Restaurant, Store, …) rather than bare LocalBusiness. Google " +
      "documents aggregateRating/review here only for sites that aggregate reviews of OTHER " +
      "businesses (e.g. a directory) — a business publishing these about itself is ineligible " +
      "for the star-rating feature, so they're intentionally not recommended above.",
    sourceUrl: "https://developers.google.com/search/docs/appearance/structured-data/local-business",
    sourceLabel: "Google Search Central — LocalBusiness structured data",
  },
  {
    type: "Event",
    required: ["name", "startDate", "location", "location.name", "location.address"],
    recommended: ["endDate", "description", "image", "eventStatus", "offers", "organizer", "performer"],
    richResultStatus: "restricted",
    statusNote:
      "Google's current guidance requires a physical location — virtual-only events, " +
      "invitation/membership-only events, and school youth spectator events are not eligible " +
      "for Event rich results regardless of how complete the markup is.",
    sourceUrl: "https://developers.google.com/search/docs/appearance/structured-data/event",
    sourceLabel: "Google Search Central — Event structured data",
  },
  {
    type: "Review",
    required: ["author", "itemReviewed", "itemReviewed.name", "reviewRating", "reviewRating.ratingValue"],
    recommended: ["datePublished", "reviewRating.bestRating", "reviewRating.worstRating"],
    richResultStatus: "restricted",
    statusNote:
      "itemReviewed can be omitted only when this Review is nested inside the markup of the " +
      "item it reviews — a standalone Review (the common case this tool checks) needs it. " +
      "Google restricts the star-rating feature specifically for LocalBusiness or Organization " +
      "pages that control reviews about themselves (\"self-serving\" reviews); first-party " +
      "product reviews on a merchant's own page are a normal, supported pattern.",
    sourceUrl: "https://developers.google.com/search/docs/appearance/structured-data/review-snippet",
    sourceLabel: "Google Search Central — Review snippet structured data",
  },
  {
    type: "AggregateRating",
    required: ["itemReviewed", "itemReviewed.name", "ratingValue"],
    oneOfRequired: [["ratingCount", "reviewCount"]],
    recommended: ["bestRating", "worstRating"],
    richResultStatus: "restricted",
    statusNote:
      "Same itemReviewed-nesting exception as Review, and the same LocalBusiness/Organization-" +
      "scoped self-serving-review restriction — it does not apply to Product ratings on a " +
      "merchant's own page. Google's own examples nest AggregateRating inside the item it rates " +
      "rather than publishing it standalone.",
    sourceUrl: "https://developers.google.com/search/docs/appearance/structured-data/review-snippet",
    sourceLabel: "Google Search Central — Review snippet structured data",
  },
  {
    type: "BreadcrumbList",
    required: ["itemListElement"],
    recommended: [],
    richResultStatus: "eligible",
    statusNote:
      "Needs at least two ListItems, each with a position and a name. The last item's " +
      "`item` URL is optional — Google falls back to the page's own URL.",
    sourceUrl: "https://developers.google.com/search/docs/appearance/structured-data/breadcrumb",
    sourceLabel: "Google Search Central — Breadcrumb structured data",
  },
  {
    type: "FAQPage",
    required: [],
    recommended: [],
    richResultStatus: "deprecated",
    statusNote:
      "Google removed FAQ rich results from Search entirely starting May 7, 2026 (having " +
      "already restricted them to a small set of authoritative government/health sites before " +
      "that). This markup is valid schema.org but will not produce a rich result in Google Search.",
    sourceUrl: "https://developers.google.com/search/docs/appearance/structured-data/faqpage",
    sourceLabel: "Google Search Central changelog (FAQPage docs removed June 2026 — feature retired May 7, 2026)",
  },
  {
    type: "HowTo",
    required: [],
    recommended: [],
    richResultStatus: "deprecated",
    statusNote:
      "Google limited HowTo rich results to desktop in August 2023, then removed them entirely " +
      "— including desktop — on September 13, 2023. This markup is valid schema.org but will not " +
      "produce a rich result in Google Search.",
    sourceUrl: "https://developers.google.com/search/docs/appearance/structured-data/how-to",
    sourceLabel: "Google Search Central changelog (HowTo docs removed September 2023)",
  },
];

// A raw @type value may be a bare type name ("Article") or a full schema.org
// URL ("https://schema.org/Article" or "http://schema.org/Article").
export function normalizeTypeName(rawType: string): string {
  return rawType.replace(/^https?:\/\/schema\.org\//i, "").trim();
}

export function resolveRule(rawType: string): SchemaTypeRule | null {
  const name = normalizeTypeName(rawType);
  return RULES.find((rule) => rule.type === name || rule.aliases?.includes(name)) ?? null;
}

export const RICH_RESULTS_TEST_URL = "https://search.google.com/test/rich-results";
