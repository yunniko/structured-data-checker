# D002 · No FAQPage JSON-LD on this project's own pages
Date: 2026-09-13 · Goal: G-001 M1 · Status: active (superseded by: —)
Context: every other svc-lab service embeds FAQPage JSON-LD on its FAQ section via
`lib/json-ld.tsx`'s `JsonLd` component, for the (now-defunct) FAQ rich-result feature.
Decision: this project's FAQ section (`app/json-ld-validator/page.tsx`) renders as plain
content with no JSON-LD script tag.
Rejected: embedding FAQPage JSON-LD anyway "for consistency with the rest of the
portfolio" — rejected because this tool's core claim is that FAQPage markup no longer
produces a rich result; shipping that exact markup on the page making that claim would
contradict the tool's own message to a reader who views source.
Consequence: `lib/json-ld.tsx` is still copied from the template (used nowhere in this
project) — keep it only if a future eligible type (e.g. BreadcrumbList on a real
navigation trail) gets added to these pages.
Evidence: app/json-ld-validator/page.tsx's page-level comment; docs/domain-reference.md.
