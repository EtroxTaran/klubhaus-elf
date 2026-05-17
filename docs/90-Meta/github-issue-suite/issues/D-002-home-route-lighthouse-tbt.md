<!--
id: D-002
title: [area:ui] Home route exceeds Lighthouse Total Blocking Time budget
labels: type:bug, area:ui, prio:high, size:m, parallel:safe
milestone: M3
depends_on: A-010
output: apps/web/**
-->

# [area:ui] Home route exceeds Lighthouse Total Blocking Time budget

**ID:** D-002
**Labels:** `type:bug`, `area:ui`, `prio:high`, `size:m`, `parallel:safe`
**Milestone:** M3
**Depends on:** `A-010`
**Primary output:** `apps/web/**`

## Problem

The `lighthouse` CI job fails the `total-blocking-time` assertion on `/`:

- Budget (`.github/lighthouse/budget.json`): `total-blocking-time <= 200` ms.
- Measured: **344–417 ms** (run-to-run noise; consistently ≫ budget).

This is **pre-existing and main-wide**: the post-#13 merge commit `da0f98d`
on `main` fails the same assertion (417 ms). It is the consequence of Phase 1
(PR #13) replacing the static, hydration-free placeholder home with the
interactive **OfficeHub** (TanStack Start client hydration + synchronous
i18next init loading both `de`+`en` resource trees + ThemeProvider effects on
the critical path).

`docs/90-Meta/conventions.md` anticipated this: *"Future interactive routes
should reintroduce client scripts only where needed and keep Lighthouse
budgets green."* PR #13 did not, so the budget is now red on `main`.

## Constraints

- **Do not** weaken `.github/lighthouse/budget.json` to pass CI
  (`.cursor/rules/99-safety.mdc`: never weaken tests/coverage to pass CI).
- Keep the OfficeHub UX and the Direction A design intact.

## Likely levers (investigate, measure each)

- Defer / lazy-load the secondary locale (`en`) so `/` only parses+inits `de`
  (`apps/web/src/i18n/init.ts`, `locales/en.ts`).
- Make i18next init non-blocking for first paint; render under a ready gate
  rather than synchronously at module import.
- Trim/defer `ThemeProvider` mount-time work; ensure the pre-hydration scheme
  script does the minimum.
- Code-split the OfficeHub's non-critical composites; reduce initial script
  bytes (the `resourceSizes` script budget is 350 KB, total 800 KB — verify).
- Consider partial/streaming hydration or islands for the hub if TanStack
  Start supports it cleanly.

## Acceptance criteria

- [ ] Plan in `.cursor/plans/` before implementation; measure TBT before/after.
- [ ] `lighthouse` job green on `/` (TBT ≤ 200 ms) **without** budget changes.
- [ ] No OfficeHub UX/visual regression; Vitest + Playwright still green.
- [ ] Follow TDD; per-file coverage gates unchanged.
- [ ] Land as its own dedicated PR (not bundled with docs/feature work).

## Notes

Also observed: `cursor-smoke` is failing on `main` independently of this
issue (separate pre-existing problem — out of scope here).
