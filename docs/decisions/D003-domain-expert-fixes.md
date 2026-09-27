# D003 · Domain-expert review findings, schema.org/Google policy accuracy
Date: 2026-09-13 · Goal: G-001 M1b · Status: active (superseded by: —)
Context: pre-ship review of `lib/schema-rules.ts` et al. against Google Search Central + schema.org.
Decision: fixed 8 real issues before shipping: LocalBusiness no longer recommends
aggregateRating/review (Google scopes those to review aggregators; self-serving caveat added); the
self-serving-review restriction narrowed to LocalBusiness/Organization; a fabricated Product
Merchant Center claim removed; `offers.price` checked as required once `offers` exists; HowTo's
two removal events (Aug 2023 desktop-only, Sept 13 2023 full) separated; unsupported
`itemReviewed.@type` values flagged; `VirtualLocation` events explained as ineligible; a
deprecated-type card no longer says "all properties present"; `author.url` added to Article;
FAQPage/HowTo source links relabeled as a generic changelog.
Rejected: leaving the FAQPage May-7-2026 and HowTo Sept-2023 dates unverified — corroborated via
Search Engine Journal; they are the tool's core differentiation claim.
Consequence: schema-rules.ts stays sourced from live docs per type, not edited from memory (AGENTS.md).
Evidence: docs/domain-reference.md; tests/unit/check-structured-data.spec.ts (offer price,
itemReviewed type, virtual-location Event); domain-expert review, 2026-09-13.
