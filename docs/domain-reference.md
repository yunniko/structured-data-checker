# Domain reference — schema.org structured data & Google rich-result eligibility

Sourced 2026-09-13 directly from developers.google.com via WebFetch (not recalled from
training data — this is a policy area that changes; see AGENTS.md).

## Two headline facts driving this tool's premise

- **FAQPage rich results were removed from Google Search entirely starting
  2026-05-07**, having already been restricted to "well-known, authoritative
  government and health websites" before that.
  https://developers.google.com/search/docs/appearance/structured-data/faqpage
- **HowTo rich results were removed from Google Search in 2023-09**, on both
  desktop and mobile.
  https://developers.google.com/search/docs/appearance/structured-data/how-to

Both types remain valid schema.org markup — they just no longer produce a rich result.
Generic JSON-LD validators that only check schema.org conformance don't surface this.

## Per-type required/recommended properties (as implemented in `lib/schema-rules.ts`)

| Type | Required | Recommended | Source |
|---|---|---|---|
| Article (+ NewsArticle, BlogPosting) | none | headline, author, author.name, datePublished, dateModified, image | [Article](https://developers.google.com/search/docs/appearance/structured-data/article) |
| Product | name; one of review/aggregateRating/offers | aggregateRating, offers, offers.price, offers.priceCurrency, review | [Product snippet](https://developers.google.com/search/docs/appearance/structured-data/product-snippet) |
| LocalBusiness | name, address | telephone, openingHoursSpecification, priceRange, geo, url, aggregateRating, review | [LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business) |
| Event | name, startDate, location, location.name, location.address | endDate, description, image, eventStatus, offers, organizer, performer | [Event](https://developers.google.com/search/docs/appearance/structured-data/event) |
| Review | author, itemReviewed, itemReviewed.name, reviewRating, reviewRating.ratingValue | datePublished, reviewRating.bestRating, reviewRating.worstRating | [Review snippet](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) |
| AggregateRating | itemReviewed, itemReviewed.name, ratingValue; one of ratingCount/reviewCount | bestRating, worstRating | [Review snippet](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) |
| BreadcrumbList | itemListElement (≥2, each with position+name; `item` optional only on the last) | — | [Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) |

## Eligibility restrictions represented in the rule set (not just required fields)

- Event: virtual-only events, invitation/membership-only events, and school youth
  spectator events are ineligible regardless of markup completeness.
- Review / AggregateRating: "self-serving" reviews (an entity reviewing itself) are
  ineligible for the star-rating feature.

## Domain-expert review

See `docs/decisions/D003` for the outcome of the pre-ship domain-expert review of this
rule set (schema.org vocabulary + Google Search Central policy accuracy).
