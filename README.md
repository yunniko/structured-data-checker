# Structured Data Checker

Check JSON-LD structured data against Google's *current* rich-result rules —
not just whether it's valid schema.org, but whether it actually does
anything in search results today. Includes a "which schema type do I need"
picker and a sourced reference chart. Everything runs entirely in the
browser — nothing is uploaded.

## Running it

```
npm install --legacy-peer-deps
npm run dev
```

Production build: `npm run build && npm start`.

## Tests

- `npx eslint .`
- `npx vitest run` — unit tests for the parsing/rule-checking logic.
- `npx playwright test` — end-to-end browser tests for all three tools.

## Current state

See `HANDOVER.md` for the full decision record and `GOALS.md` for the
goal/milestone tracking. Part of the `svc-lab` micro-service portfolio —
see `E:\CLAUDE\projects\svc-lab\`.
