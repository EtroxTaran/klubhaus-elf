---
title: ADR-0010 Aurelia Premier Design System
status: draft
tags: [adr, design, ui]
created: 2026-05-16
updated: 2026-05-16
type: adr
binding: false
related:
  - [[../../00-Index/Decision-Log]]
  - [[../09-Design-System]]
---

# ADR-0010: Aurelia Premier Design System

> **REOPENED on 2026-05-27:** This ADR is `draft` again. Any `accepted`, `binding`, or `locked` wording below is historical pre-reopen context until Nico re-ratifies it.

## Context

The UI is delivered as a Claude Design handoff ("Aurelia Premier", Direction A
"Sonntagszeitung" — warm cream paper, dark ink, single scarlet accent,
Newsreader/Inter/JetBrains Mono). The export is an external, regenerated
artifact (see [[../../30-Implementation/design-sync-workflow]]). Phase 1
(foundation + 10 of 45 screens) shipped in PR #13. The full reference lives in
[[../09-Design-System]].

## Decision

Recreate the design in the production stack rather than copying the prototype:

- **Direction A only** for MVP; B/C and the remaining 35 screens are deferred.
- **Token-as-CSS-variable indirection** on Tailwind v4 CSS-first `@theme`:
  semantic `--color-*` resolve to runtime-swappable `--c-*` in
  `apps/web/src/styles/app.css`.
- **`data-scheme` attribute** drives light/dark (SSR-deterministic), not the
  OS `prefers-color-scheme`.
- **Club-adaptive accent** via `apps/web/src/theme/club-registry.ts` +
  `ThemeProvider` (re-tints the whole subtree, no per-component logic).
- **Hand-authored atoms/composites** under `components/atoms` and
  `components/composites`; `components/ui/**` is reserved for shadcn primitives
  (CLI-managed) and currently unused — shadcn is deferred.
- **i18n boundary**: UI chrome lives in `locales/{de,en}.ts`; realistic sample
  game data lives in `screens/fixtures.ts` (engine-replaceable, not chrome).
- **Coverage scoped to product logic**; framework wiring and test utilities are
  excluded — per-file 85/75 thresholds are otherwise unchanged.
- **Windows pnpm path mitigation** via `.npmrc` `virtual-store-dir-max-length`
  (no effect on Linux/CI).

## Consequences

- Engineering deviations introduced by Phase 1 and recorded in
  [[../09-Design-System]]: vitest jsdom-scoped `web` project + node project for
  packages; coverage scoping; `.npmrc` virtual-store length; shadcn deferral
  (Halbzeit uses an accessible native `role="dialog"` sheet); the
  fixtures-vs-i18n data boundary.
- 35 screens remain and are phased — see
  [[../../90-Meta/github-issue-suite/issues/D-001-remaining-screens-by-phase]].
- The design source is external and links expire; updates are pulled and
  diffed via `pnpm sync:design` (never auto-applied) per
  [[../../30-Implementation/design-sync-workflow]].
- Mobile-first/WCAG intent from [[ADR-0008-mobile-first-ui]] and the i18n
  contract from [[ADR-0006-i18n]] are realised by this system.
## Related

- [[../../00-Index/Decision-Log]]
- [[../09-Design-System]]
