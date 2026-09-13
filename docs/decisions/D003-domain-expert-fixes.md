# D003 · Domain-expert review findings, schema.org/Google policy accuracy
Date: 2026-09-13 · Goal: G-001 M1b · Status: active (superseded by: —)
Context: pre-ship review of `lib/schema-rules.ts` et al. against Google Search Central + schema.org.
Decision: fixed 8 real issues before shipping: LocalBusiness wrongly recommended
aggregateRating/review (Google scopes those to review-aggregator sites, not the business's own
page — removed, added self-serving caveat); Review/AggregateRating's self-serving-review
restriction was stated too broadly (Google scopes it to LocalBusiness/Organization, not Product —
narrowed wording); Product's Merchant Center feed claim was fabricated (removed, corrected to the
real extra requirements); `offers.price` was merely "recommended" when it's actually required
once `offers` is present (added a structural check); HowTo's removal date compressed two distinct
events (Aug 2023 desktop-only restriction, Sept 13 2023 full removal — fixed wording); added a
structural check flagging `itemReviewed.@type` values Google doesn't support for Review/
AggregateRating; added a virtual-Event special case so `VirtualLocation` events get an
ineligibility explanation instead of a generic "missing properties" message; fixed a UI bug
showing "all properties present" inside a deprecated-type's red warning card; added `author.url`
to Article's recommended list; confirmed FAQPage/HowTo's Google source URLs now serve a generic
changelog, not type-specific docs — relabeled sourceLabel to say so honestly.
Rejected: leaving the FAQPage May-7-2026 and HowTo Sept-2023 dates unverified — independently
corroborated via Search Engine Journal, both hold up as the tool's core differentiation claim.
Consequence: schema-rules.ts must stay sourced from live docs per-type, not edited from memory —
see AGENTS.md.
Evidence: docs/domain-reference.md; tests/unit/check-structured-data.spec.ts (new cases: offer
price, itemReviewed type, virtual-location Event); domain-expert subagent review, 2026-09-13.
