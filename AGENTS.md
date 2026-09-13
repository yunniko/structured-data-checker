# structured-data-checker — project conventions

Read `HANDOVER.md` first: current state, decision record, next steps. Goal
in `GOALS.md` (G-001). Parent initiative in `E:\CLAUDE\projects\svc-lab\`;
company-wide standards in `E:\CLAUDE\COMPANY\`.

- Stack: Next.js App Router, TypeScript, Tailwind. No database, no auth, no
  accounts. Everything — JSON-LD extraction, rule checking, example
  generation — runs client-side; there is no server-side endpoint that
  touches user input.
- The entire rule set lives in `lib/schema-rules.ts`. Every entry's
  `sourceUrl` was fetched directly from developers.google.com on
  2026-09-13, not recalled from training data — this is a policy area
  that changes (Google removed FAQPage rich results from Search entirely
  on 2026-05-07, and HowTo in 2023-09; see `docs/domain-reference.md`).
  **Re-fetch and re-verify a type's Google Search Central page before
  changing its rule** — don't hand-edit required/recommended lists from
  memory.
- `lib/example-snippet.ts`'s starter snippets are guarded by
  `tests/unit/example-snippet.spec.ts`, which runs every example back
  through this project's own `checkStructuredData` and asserts it comes
  back `valid: true`. If you add a new type to `schema-rules.ts`, add a
  matching example or the picker will show no starter snippet for it
  (intentional fallback for deprecated types — see `content-types.ts`).
- Deliberately **no FAQPage JSON-LD on this project's own pages**, even
  though every other svc-lab service uses it for its FAQ sections — this
  tool's whole premise is that FAQPage markup stopped producing a rich
  result in May 2026, so shipping that exact markup here would undercut
  the tool's own message. See `docs/decisions/D002`.
- `npm install`/`npm ci` need `--legacy-peer-deps` (a live npm/arborist
  bug, not specific to this project — see `svc-lab/HANDOVER.md`).
- Two test layers: `npx vitest run` (unit — extraction, rule evaluation,
  example self-consistency) and `npx playwright test` (e2e — real browser
  flows for all three tools). Both must pass before calling a change done;
  also run `npm run build` — it catches server/client boundary bugs the
  others don't.
- See `E:\CLAUDE\COMPANY\INFRASTRUCTURE_DEPLOY.md` for the redeploy command
  once live.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
