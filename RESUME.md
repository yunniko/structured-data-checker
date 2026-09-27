# Resume — structured-data-checker

**Session budget ran out right after push. Nothing deployed. Do this next:**

1. Pick a port (30210 was the plan; verify free live, port registry may be
   stale) and run:
   `powershell -File E:/CLAUDE/projects/svc-lab/automation/scripts/deploy-service.ps1 -Name structured-data-checker -Port 30210 -Domain structured-data-checker.svc.julienika.cz`
2. Verify live HTTPS on all 7 routes (home, /json-ld-validator,
   /schema-type-picker, /structured-data-reference, /ads.txt, /sitemap.xml,
   /robots.txt) and that sibling sites are unaffected.
3. SEO review (`/seo-review` skill or curl fallback) against the live URL.
4. Add to `julienika-home/app/page.tsx`'s `TOOLS` array and
   `app/sitemap-index.xml/route.ts`'s `SITEMAPS` array (grep first — not
   added yet), commit, push, redeploy via
   `powershell -File E:/CLAUDE/projects/svc-lab/automation/scripts/redeploy-service.ps1 -Name julienika-home`.
5. Mark backlog idea in `svc-lab/GOALS.md` Shipped, add the shipped-services
   row, note COMPANY-doc reconciliation (port 30210, no DB), rotate progress
   log, commit svc-lab.
6. Write the run log in `svc-lab/run-logs/`.

**Already done and verified this session**: full build (ESLint clean, 51/51
Vitest unit tests, production build clean with 7 routes prerendering, 9/9
Playwright e2e tests), domain-expert review (8 real issues found and fixed —
see `docs/decisions/D003`), manual security review (clean — no server
routes, no eval/fetch, only dangerouslySetInnerHTML is the unused vetted
template helper, .gitignore covers .env*), git init + commit + push to
https://github.com/yunniko/structured-data-checker (public, verified).

Repo name/port already chosen: `structured-data-checker`, port `30210`.
