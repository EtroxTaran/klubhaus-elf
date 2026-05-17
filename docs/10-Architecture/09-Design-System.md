---
title: Design System — Aurelia Premier
status: draft
tags: [architecture, design, ui, accessibility]
updated: 2026-05-17
---

# Design System — Aurelia Premier

Code-authoritative reference for the UI. The decision record is
[[09-Decisions/ADR-0010-design-system]]; the external source is synced via
[[../30-Implementation/design-sync-workflow]]; the archived prototype export
lives under `design/handoff/<date>/` (the `project/*` sources are the
historical artifact — **the code and this doc win** on any conflict).

## 1. Direction & rationale

Direction **A — "Sonntagszeitung"**: a tabloid-warm football manager — soft
cream paper, dark ink, one scarlet accent, restrained chrome, the joke in the
copy. Chosen over B ("Schalterhalle", FM-cold risk) and C ("Hallenfunk", loses
the tabloid voice). Primary verb-loop: *„weiter zum nächsten Termin"*. Full
rationale: `design/handoff/2026-05-16/project/RATIONALE.md`.

## 2. Colour tokens

Defined in `apps/web/src/styles/app.css`. Semantic `--color-*` resolve to
runtime-swappable `--c-*`, so components use Tailwind utilities (`bg-bg`,
`text-ink`, `border-rule`, `bg-accent`, `text-ink-mute`, …) and never hardcode
hex.

| Token (`--c-*`) | Light | Dark | Role |
|---|---|---|---|
| `bg` | `#f4ede0` | `#16110d` | page paper |
| `bg-ink` | `#ece2cf` | `#1f1812` | soft paper / dividers |
| `card` | `#fbf6ea` | `#221a13` | raised surface |
| `ink` | `#1a1410` | `#f3e8d4` | body text |
| `ink-mute` | `#5a4f44` | `#b4a896` | secondary text |
| `ink-soft` | `#7a6f63` | `#8a8072` | tertiary text |
| `rule` | `#d9cdb4` | `#3b3024` | hairline |
| `accent` | `#b7301b` | `#e8553b` | scarlet — the single accent |
| `accent-2` | `#c8a45a` | `#d9a04c` | club secondary |
| `accent-soft` | `color-mix(accent 12% / card)` | `color-mix(accent 22% / card)` | accent wash |
| `ok` | `#3f6a2f` | `#7da868` | success (always glyph + colour) |
| `warn` | `#a3680f` | `#d9a04c` | warning |
| `danger` | `#9b1f0a` | `#e8553b` | error |

Light/dark switches via the `data-scheme` attribute on `<html>` (set by
`ThemeProvider`; SSR-deterministic, not OS preference). `@custom-variant dark`
is wired for incidental `dark:` utilities.

## 3. Typography

Self-hosted (offline PWA — no runtime CDN), latin + latin-ext for de-DE
(`ä ö ü ß`):

| Family token | Stack | Source | Use |
|---|---|---|---|
| `--font-display` | "Newsreader Variable", Source Serif 4, Georgia, serif | `@fontsource-variable/newsreader` | headlines, narrative copy, card names |
| `--font-sans` | Inter, system-ui | `@fontsource/inter` | UI chrome, body, controls |
| `--font-mono` | JetBrains Mono, ui-monospace | `@fontsource/jetbrains-mono` | numbers, fees, scoreboard, ticker |

## 4. Radius, spacing, motion

- Radius (softer than shadcn default): `--radius-sm 8` · `md 10` · `lg 14` ·
  `xl 18` · `2xl 24` px.
- Spacing: `--spacing-thumb 12rem` (one-handed reserve), `--spacing-hub 7rem`
  (hub-tile min height), `--spacing-tap 2.75rem` (≥44px WCAG target).
- Keyframes `event-in` / `cheer` / `ticker-slide` / `pulse-dot` with matching
  `--animate-*` tokens; a `prefers-reduced-motion` guard neutralises animation
  and transition durations.

## 5. Layered architecture (`apps/web/src`)

| Layer | Path | Notes |
|---|---|---|
| Tokens | `styles/app.css` | Tailwind v4 `@theme` + `--c-*` indirection + fonts |
| Theme | `theme/{club-registry,theme-context,theme-provider,use-theme}` | scheme + club state → `<html>` attrs + `--c-accent` |
| Atoms (11) | `components/atoms/{crest,jersey,portrait,str-bar,talent,form-strip,pos-pill,sparkline,break-bar,pill-btn,levy-chip}` | `crest/` and `jersey/` split a pure `*-paths`/geometry module for branch-testability |
| Composites (9) | `components/composites/{player-card,hub-tile,inbox-card,match-event,stat-strip,formation-pitch,mini-pitch,live-xg-strip,stadium/*}` | `formation-pitch`+`formation-map.ts`; `stadium/` = geometry + glyphs + plot + side-view + type-plan + capacity-bar |
| Layout | `components/layout/screen-shell.tsx` | paper surface, centred mobile column |
| Screens (11) | `screens/{office-hub,posteingang,kader,anpfiff,spiel,halbzeit,finanzen,stadion,onboarding,karriere,identity}` + `screens/fixtures.ts` | declarative; branching pushed into atoms |
| Routes | `routes/*.tsx` (+ `__root.tsx`) | thin TanStack file routes; `__root` mounts `I18nextProvider` + `ThemeProvider` |
| i18n | `i18n/init.ts`, `locales/{de,en}.ts` | de primary, en parity-tested |
| shadcn | `components/ui/**` | reserved, CLI-managed, currently unused (deferred) |

## 6. Theming & club-adaptive accent

`ThemeProvider` holds `{scheme, clubId}` (persisted to `localStorage`,
SSR-safe). It sets `data-scheme` + `data-theme="A_<clubId>"` on `<html>` and
inline `--c-accent` / `--c-accent-2` from `club-registry.ts` (8 IP-clean
clubs). Because every accent utility resolves `--color-accent → var(--c-accent)`,
selecting a club re-tints the entire subtree with **zero per-component logic**.
A pre-hydration `<head>` script applies the persisted scheme to avoid FOUC.

## 7. i18n boundary

UI chrome (titles, labels, buttons, captions) lives in `locales/{de,en}.ts`,
namespace-per-screen, accessed as `t('namespace:key')`; `de`/`en` key parity is
test-enforced. Realistic sample game data (squad, fixtures, finance figures,
inbox messages) lives in `screens/fixtures.ts` — it is mock domain data, not
chrome, and is engine-replaceable. German numbers via `Intl.NumberFormat
('de-DE')`, never concatenated fragments (see [[09-Decisions/ADR-0006-i18n]]).

## 8. Accessibility audit

Targets [[08-Crosscutting]] WCAG 2.2 AA and [[09-Decisions/ADR-0008-mobile-first-ui]].

| Check | Value | Status |
|---|---|---|
| Ink / paper contrast | ≈ 14:1 | AA (AAA possible) |
| Scarlet / paper | ≈ 5.3:1 | AA for ≥14pt bold |
| White / scarlet (buttons) | ≈ 5.8:1 | AA |
| Primary touch targets | ≥ 44×44 px (advance 56 px) | pass |
| Motion | ≤ 220 ms, `prefers-reduced-motion` neutralised | pass |
| Status encoding | never colour-only — FormStrip S/U/N + letter, inbox `§ ¶ € ◎ ♪` glyphs | pass |
| 200% zoom | vertical scroll only, no horizontal overflow | pass |
| Halftime | native `role="dialog" aria-modal` sheet (shadcn deferred) | pass |

## 9. de-DE language calibration

Anpfiff (not "Start Match"), Posteingang (not "Notifications"),
Vorstandsvertrauen, Verbandsabgabe, Anbau. Headlines 4–8 words, active voice,
no colon-headers. Numbers: `12.500 €`, `2,4 Mio. €`, form as comma-decimal
(`7,4`).

## 10. Screen catalogue (45)

Phase 1 (shipped, PR #13) = the 10 key screens; Klub-Identität added in the
2026-05-17 design sync (closes prototype TASKS T3.4). Remaining 34 are phased —
see [[../90-Meta/github-issue-suite/issues/D-001-remaining-screens-by-phase]].

| # | Screens | Route(s) | Status |
|---|---|---|---|
| 01–10 | Office Hub · Posteingang · Kader · Vor dem Anpfiff · Spielreportage · Halbzeit · Finanzen · Stadionausbau · Onboarding (3) · Karriereverwaltung | `/`, `/posteingang`, `/kader`, `/anpfiff`, `/spiel`, `/spiel?halbzeit=1`, `/finanzen`, `/stadion`, `/onboarding?step=`, `/karriere` | **Phase 1 ✓** |
| 11 | Klub-Identität · Wappen- & Trikot-Generator | `/identity` | **shipped ✓** (2026-05-17 sync) |
| 11–14 | Spielervertrag · Vorstandsvertrauen · Sponsoren · Presse-Interview | — | deferred |
| 15–17 | Taktik · Aufstellung · Statistiken | — | deferred |
| 18–24 | Spielerdetail · Training · Einzeltraining · Krankenstation · Scouting · Mannschaften · Mitarbeiter | — | deferred |
| 25–28 | Spielervergleich · Mannschaftsvergleich · Profi-Modus · Rollen-Editor | — | deferred |
| 29–34 | Transferbüro · Liga-Tabelle · Pokalbaum · 2D-Ticker · Aufstellung mit Rollen · Einstellungen | — | deferred |
| 35–38 | Tabloid-Cover · Pressekonferenz · Halbzeit-Sprechblasen · Transfer-Gegenangebot | — | deferred |
| 39–41 | Heatmap · Karrierebogen · Saison-Album | — | deferred |
| 42–45 | A11y-Audit · Sponsoren-Pyramide · Tunnel-Moment · Siegerehrung | — | deferred |

## 11. Phase-1 engineering deviations

Recorded so a future maintainer understands non-obvious choices:

- **Test infra**: root `vitest.config.ts` runs a jsdom-scoped `web` project +
  a node project for `packages/**`; coverage thresholds unchanged (85/85/85/75
  per-file).
- **Coverage scoping**: framework wiring (`routes/**`, `routeTree.gen.ts`,
  server/router entry) and test utilities are excluded — *not* a threshold
  relaxation; all product logic stays gated.
- **`.npmrc virtual-store-dir-max-length=24`**: mitigates a Windows MAX_PATH
  overflow that broke Node's `#imports` resolution under the deep worktree +
  pnpm store path. No effect on Linux/CI.
- **shadcn deferred**: prototype visuals are bespoke; Halbzeit uses an
  accessible native dialog. `components/ui/**` reserved for when primitives are
  actually needed.
- **fixtures-vs-i18n boundary** (see §7). The Klub-Identität tincture palette
  (`IDENT_TINCTURES`) is engine-replaceable sample data → `screens/fixtures.ts`;
  every shape/charge/pattern/section label is chrome → `locales` `identity`.
- **`Club` carries a `KitSpec`** (`{ pattern, sleeveAccent }`) beside `crest`;
  `kitFor(name)` mirrors `crestFor(name)`. The procedural `jersey/` atom is
  tincture-driven (raw hex props, like `crest/`), not token-themed.
- **2026-05-17 sync — deliberately deferred**: that export also introduced a
  shared `ScreenHeader` composite (retrofit across the 10 shipped screens) and
  a Halbzeit `PlayerToken`. These are a cross-cutting refactor with no
  functional tie to club identity; deferred to a follow-up so the identity PR
  stays reviewable. The export's edits to deferred prototype screens
  (`more/team/tactics/directions/negotiations/sponsor/settings`) have no
  Phase-1 production target and were intentionally not mapped. Direction B/C
  token blocks removed from the prototype were already absent in production
  (only Direction A is implemented) — no-op.

## 12. Keeping in sync

A new claude.ai/design export → run `pnpm sync:design <url>` → review the
generated `design/handoff/<date>/CHANGES.md` → map deltas to the layers above
→ land a small dedicated PR. The script never edits app code. Procedure and
expired-link handling: [[../30-Implementation/design-sync-workflow]].

## 13. UI showcase (Storybook)

Storybook is the canonical **visual** reference of this design system (the
code in §5 stays authoritative on conflict). It is deployed alongside the
docs vault — one Dokploy compose stack (`docker-compose.docs.yml`), separate
subdomain (`SHOWCASE_DOMAIN`), behind the **same** fail-closed basic-auth as
the vault (`DOCS_BASIC_AUTH`). Ops detail: `tools/docs-preview/README.md`.

- **Completeness is a rule, not a goal.** Every atom, composite, layout and
  screen ships a colocated `*.stories.tsx`; a CI `build-storybook` job fails
  the build if a story is broken. Adding/changing a primitive without its
  story is an incomplete PR (mirrored in `AGENTS.md`).
- **Coverage today**: 11 atoms, 12 composites, 1 layout, 11 screens, plus a
  `Foundations/Design Tokens` page (colours, type, radius/spacing, motion).
- **Theming**: a toolbar (`Scheme` light/dark × `Club` ×8) drives the real
  `ThemeProvider`, so every story is exercised across the full token matrix.
- **Future vision**: the deferred screens in §10 enter the showcase the same
  way — a colocated story when each lands; `autodocs` renders each
  component's prop API automatically, so the showcase grows by construction.
- **Local**: `pnpm --filter @soccer-manager/web storybook`. Decorators
  (i18n + theme + a memory router so screen `Link`s are inert) live in
  `apps/web/.storybook/`.
