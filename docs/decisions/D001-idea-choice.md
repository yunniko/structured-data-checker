# D001 · Idea choice: structured data checker over other researched candidates
Date: 2026-09-13 · Goal: G-001 M1 · Status: active (superseded by: —)
Context: backlog had 0 clean unshipped ideas (all remaining rows flagged legal-risk or
crowded), triggering svc-lab's research-pass rule requiring ≥2 non-calculator ideas.
Decision: built a `checker/validator` — a JSON-LD checker that reports Google's *current*
rich-result eligibility per type, not just schema.org validity, after confirming via
Google Search Central that FAQPage rich results were removed entirely on 2026-05-07 and
HowTo in 2023-09 — a real, dated, current gap generic validators haven't caught up to.
Rejected: SRT/subtitle QC checker (10+ near-identical competitors, no differentiation
found); PDF metadata viewer/remover (differentiation angle already standard in that
niche, and redundant with the just-shipped photo-metadata-cleaner); essential-oil
dilution calculator (real signal but still `calculator/converter`, the category this run
needed to diversify away from); browser-based audio noise removal (`ML/media`, genuinely
different but judged too large to safely finish within one run's budget, unlike the
image-object-splitter precedent which got a full day).
Consequence: the rule set must stay sourced from live docs, not memory — see AGENTS.md.
Evidence: svc-lab/GOALS.md 2026-09-13 progress entry; docs/domain-reference.md.
