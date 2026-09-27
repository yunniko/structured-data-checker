# Handover — structured-data-checker
Last verified: 2026-09-27 at 442404d

svc-lab service: a JSON-LD checker against Google's current rich-result rules, a schema-type picker
and a sourced reference chart, all client-side. Goal: `GOALS.md` G-001. Shared conventions:
`E:\CLAUDE\projects\svc-lab\`. Charter: `E:\CLAUDE\COMPANY\`.

## Current state

- Code is complete and pushed (`442404d`); `npx vitest run` 51/51 on 2026-09-27. E2E not re-run
  (9/9 per the `GOALS.md` entry of 2026-09-13).
- Deployment: it was deployed at `structured-data-checker.svc.julienika.cz` (the repo is on the
  server and a container existed), then stopped in the 2026-09-20 portfolio cut (svc-lab A017).
  On 2026-09-27 `docker ps -a` showed it `Exited`, and the hostname answered 502 (vhost still
  present). The `GOALS.md` note that it was never deployed, and `RESUME.md`, predate that deploy.
- `next@16.3.5`: no production advisories (`npm audit`) as of 2026-09-27.

## How things fit together

Rule data with per-type Google sources lives in `lib/schema-rules.ts`; checking logic is unit-tested in
`tests/unit/check-structured-data.spec.ts`; the domain sources are summarized in
`docs/domain-reference.md`.

## Rules in force

- `lib/schema-rules.ts` is sourced from live Google/schema.org documentation per type, never edited
  from memory (D003; AGENTS.md).

## Next steps and open questions

- None while the project is suspended. Reviving it would mean re-verifying every rule against
  current Google documentation first, because rich-result policy changes often.

## Deploy log

| Date | Commit | What changed | Verified how |
|---|---|---|---|
| 2026-09-20 | 442404d | Container stopped (svc-lab A017 portfolio cut) | `docker ps -a` shows it exited |

## Decisions

`docs/decisions/README.md` (D001–D003).
