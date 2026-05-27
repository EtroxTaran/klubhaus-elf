# Handoff · Aurelia Premier (Football Manager)

> Offline-first PWA football-manager game, mobile-first, German tabloid voice.
> 45 screens, three visual directions, full responsive layouts, component
> library, tokens, accessibility audit — packaged for Claude Code / Cursor.

## Overview

Aurelia Premier is a deep, offline-first football-manager game that plays
equally well in 30-second tram-stop sessions and 30-minute couch sessions.
The interface is a single verb-loop: *"Weiter zum nächsten Termin"* —
advance to next event. Everything else (training, transfers, board pressure,
finances) sits one tap deep on a hub screen.

The visual mood is **modern reinterpretation of the German Anstoss
series** — soft paper, dark ink, one scarlet accent, tabloid-paced headlines,
restrained chrome. The recommended visual direction is **A — Sonntagszeitung**
(documented in detail in `RATIONALE.md`).

The package contains:
- **45 mobile screens** in light and dark schemes
- **Responsive layouts** for tablet (1024 px) and desktop (1440 px)
- **Three named visual directions** for comparison
- **Procedural crest grammar** (`shape × tinctures × charge`)
- **Live theming demo** that re-renders the Hub when the user picks a
  different club's primary color
- **Visual component library** organised in 7 categories
- **Animation covers** (Tunnel-Moment before kick-off, Siegerehrung trophy ceremony)
- **A11y audit** with measured contrast ratios and remediation list

## About the design files

The files in this bundle are **design references implemented in HTML**.
They are React (via Babel-standalone) inside a single static `index.html`,
mounted into a `<DesignCanvas>` (a pan-zoom Figma-like wrapper). They are
**not production code**.

Your task is to **recreate these designs in the target codebase's
established environment** — a React + Tailwind + shadcn/ui project per the
brief's hard constraints (see *Target stack* below). If the codebase doesn't
exist yet, scaffold a Next.js 14 app router project with shadcn already
wired in, and implement against `tailwind.config.ts` + `components.json`
provided in this bundle.

## Fidelity

**High-fidelity (hifi).** Every screen is pixel-perfect with final colors,
typography, spacing and interactions. Treat the visual output as the source
of truth — when the prototype shows `27.412 €` in a specific spot with a
specific size, the production UI must match.

Interactions that are stubbed (e.g., the pressekonferenz branching state in
`depth.jsx`) ship working: pick an answer, see the reaction. Use them as
behaviour spec, not just visual spec.

## Target stack (hard constraints from the original brief)

- **React** in a TypeScript Next.js 14 project (app router).
- **Tailwind CSS** (config in `tailwind.config.ts`, CSS-variable layer
  in `app/globals.css` — see comment block at end of the config file).
- **shadcn/ui** (`components.json` in this bundle). Use its primitives:
  Card, Button, Badge, Tabs, Sheet, Dialog, ScrollArea, Toast, Skeleton,
  Slider, Switch, Toggle, DropdownMenu, Tooltip, Avatar, Progress, Separator.
  Do **not** invent components that cannot be expressed as shadcn primitives
  + Tailwind utilities — see brief.
- **lucide-react** for icons. The prototype uses inline SVG matching lucide's
  stroke style; swap for real `lucide-react` components in production.
- **Typography**: `Newsreader` (display + narrative copy), `Inter` (UI),
  `JetBrains Mono` (numbers, fees, scoreboard). All self-hosted via
  `@next/font/google`.
- **Animation**: Tailwind `keyframes`/`animation` are already in the config.
  Wrap *every* animation in `motion-safe:` so users with
  `prefers-reduced-motion: reduce` get the static final frame.
- **PWA**: Workbox + Dexie for offline. The package design assumes all
  data is local — no network calls beyond an opt-in cloud-sync feature.
- **Locale**: `de-DE` is primary. The brief calls out vocabulary precisely
  (`Anpfiff` not "Start Match"; `Posteingang` not "Notifications";
  `Vorstandsvertrauen` not "Board Confidence"; `Verbandsabgabe` not "Tax").

## IP cleanliness — non-negotiable

The original brief is strict: no real-world clubs, leagues, federations,
sponsors, kits, crests, stadiums, or player names anywhere — not as
placeholders, not as "redacted bars". All clubs, players, sponsors,
stadiums, competitions in this package are invented. See `data.jsx →
CLUB_REGISTRY` and `data.jsx → CLUBS_PROC` for the canonical list. Do not
introduce real-world references in production code, copy, telemetry, or
asset filenames.

## Reading guide — start here

1. **`RATIONALE.md`** — design intent, per-direction breakdown, per-screen
   reasoning, recommended direction, accessibility checks. Read this first.
2. **`COMPONENTS.md`** — engineer-readable index of every reusable composite,
   with file, props signature and extraction recommendations.
3. **`TASKS.md`** — prioritised roadmap of depth-of-play features beyond the
   45 shipped screens (tabloid covers, pressekonferenz branching,
   gegenangebot loop, etc.). Many already ship in the prototype — see
   completed marks.
4. **`ACCESSIBILITY.md`** — measured contrast ratios for all token pairs and
   all eight club colours, touch-target audit, glyph+colour dual-coding,
   six remaining engineering to-dos.

## Screens · what's in the bundle

The 45 screens are organised into thematic sections inside `index.html`'s
`<DesignCanvas>`. Open the file to see them all on a pan-zoom canvas.
Numbering matches the canvas labels.

| #  | Screen | File where it lives |
|----|--------|---------------------|
| 01 | Office Hub                           | `screens-part1.jsx → ScreenHub` |
| 02 | Posteingang (Inbox)                  | `screens-part1.jsx → ScreenInbox` |
| 03 | Kader · Erste Mannschaft             | `screens-part1.jsx → ScreenSquad` |
| 04 | Vor dem Anpfiff (Pre-Match)          | `screens-part1.jsx → ScreenPreMatch` |
| 05 | Spiel · Reportage (Text-feed)        | `screens-part2.jsx → ScreenMatchFeed` |
| 06 | Halbzeit (Bottom Sheet)              | `screens-part2.jsx → ScreenHalftime` |
| 07 | Finanzen                             | `screens-part2.jsx → ScreenFinance` |
| 08 | Stadionausbau (5 Tabs)               | `screens-part2.jsx → ScreenStadium` |
| 09 | Onboarding (Country/Club/Manager)    | `screens-part2.jsx → ScreenOnboarding*` |
| 10 | Saves & Karriereverwaltung           | `screens-part2.jsx → ScreenSaves` |
| 11 | Spielervertrag-Verhandlung           | `negotiations.jsx → ScreenPlayerNeg` |
| 12 | Vorstandsvertrauen                   | `negotiations.jsx → ScreenBoardConfidence` |
| 13 | Sponsoren-Verhandlung                | `negotiations.jsx → ScreenSponsorNeg` |
| 14 | Pressekonferenz · Einzel             | `negotiations.jsx → ScreenPressInterview` |
| 15 | Taktik · 4 Tabs                      | `tactics.jsx → ScreenTactics` |
| 16 | Aufstellung mit Tausch-Swap          | `tactics.jsx → ScreenLineup` |
| 17 | Statistiken · 5 Tabs                 | `tactics.jsx → ScreenStats` |
| 18 | Spielerdetail · Brody                | `team.jsx → ScreenPlayerDetail` |
| 19 | Training · Wochenplan                | `team.jsx → ScreenTraining` |
| 20 | Einzeltraining                       | `team.jsx → ScreenIndividualTraining` |
| 21 | Krankenstation                       | `team.jsx → ScreenMedical` |
| 22 | Scouting · Talente-Pool              | `team.jsx → ScreenScouting` |
| 23 | Mannschaften · 1./Reserve/Jugend     | `team.jsx → ScreenTeams` |
| 24 | Mitarbeiter · Trainerstab            | `team.jsx → ScreenStaff` |
| 25 | Spielervergleich                     | `compare.jsx → ScreenPlayerCompare` |
| 26 | Mannschaftsvergleich · Radar         | `compare.jsx → ScreenTeamCompare` |
| 27 | Profi-Modus · 1-20-Attribute         | `compare.jsx → ScreenPlayerDetailPro` |
| 28 | Rollen-Editor                        | `compare.jsx → ScreenRoleEditor` |
| 29 | Transferbüro                         | `more.jsx → ScreenTransfers` |
| 30 | Liga-Tabelle (12 Klubs)              | `more.jsx → ScreenLeagueTable` |
| 31 | Pokalbaum                            | `more.jsx → ScreenCupBracket` |
| 32 | 2D-Ticker                            | `more.jsx → ScreenTicker` |
| 33 | Aufstellung mit Rollen-Chips         | `more.jsx → ScreenLineupRoles` |
| 34 | Einstellungen                        | `settings.jsx → ScreenSettings` |
| 35 | Tabloid-Cover · Sieg/Krise           | `depth.jsx → ScreenTabloidCover` |
| 36 | Pressekonferenz mit Verzweigungen    | `depth.jsx → ScreenPressConference` |
| 37 | Halbzeit-Sprechblasen                | `depth.jsx → ScreenHalftimeBubbles` |
| 38 | Transfer · Gegenangebot-Loop         | `depth.jsx → ScreenTransferNeg` |
| 39 | Spieler-Heatmap                      | `depth-data.jsx → ScreenPlayerHeatmap` |
| 40 | Karrierebogen · CV-Timeline          | `depth-data.jsx → ScreenCareerArc` |
| 41 | Saison-Album · Vintage               | `depth-data.jsx → ScreenSeasonAlbum` |
| 42 | A11y-Audit · in-game                 | `a11y.jsx → ScreenA11yAudit` |
| 43 | Sponsoren-Pyramide                   | `sponsor.jsx → ScreenSponsorPyramid` |
| 44 | Tunnel-Moment (Cinematic Cover)      | `cinematic.jsx → ScreenTunnelMoment` |
| 45 | Siegerehrung (Cinematic Cover)       | `cinematic.jsx → ScreenTrophyCeremony` |

Plus desktop adaptations (`responsive.jsx`): `DesktopHub`, `DesktopMatch`,
`DesktopSquad`, `DesktopTactics`, `DesktopFinance` + `TabletHub`.

## Component library

`COMPONENTS.md` documents every composite with file, props, and
extraction recommendations. The visual library inside the canvas
(`library.jsx`) is organised in 7 categories:

1. **Marken-Atome** — Crest, Portrait, Wordmarks, PWA-Icons
2. **Daten-Atome** — StrBar, Talent, FormStrip, PosPill, Sparkline,
   BreakBar, LiveXgStrip
3. **Chips & Pills** — PillBtn, LevyChip, TraitPill, OutcomeChip,
   OfferChip, Kpi/Stat/Sum
4. **Eingabe** — TSlider, Seg, TacticToggle, Lever
5. **Karten-Composites** — PlayerCard, InboxCard, HubTile, MatchEvent,
   Workload, ArcEvent
6. **Spielfeld & Stadion** — FormationPitch, StadiumPlot, StandSideView,
   StadiumTypePlan, custom Glyphs, MiniPitch, MoodFace
7. **Statistik & Daten** — AttrBar, Attr20, TeamRadar, CapacityBar

**Recommended extraction order** (also in COMPONENTS.md):

1. `PlayerCard` — used 14× in Kader, also in compare and library
2. `HubTile` + `InboxCard` — same shape, two screens
3. `MatchEvent` — duplicated across 3 screens
4. `Crest` + `Portrait` — global identity primitives
5. `StrBar` + `Talent` + `FormStrip` — three "atom cards" of the data
   language
6. `Sparkline` + `BreakBar` — the two data visualisations
7. `StandSideView` + `StadiumTypePlan` — when Stadium-Ausbau ships

## Theming & tokens

Three direction palettes live in `ui.jsx → THEMES`. Direction A (recommended)
maps to:

- **Light**: paper `#f4ede0` · ink `#1a1410` · scarlet `#b7301b` ·
  ok `#3f6a2f` · warn `#a3680f` · danger `#9b1f0a`
- **Dark**: paper `#16110d` · ink `#f3e8d4` · scarlet `#e8553b`

All eight clubs in `data.jsx → CLUB_REGISTRY` have a primary + secondary
color. `more.jsx → registerClubTheme(clubId)` extends `THEMES['A_<clubId>']`
with the club's primary as `accent` and an 18 %-alpha derivative as
`accentSoft`. The four club-themed hubs in the "Vereins-Theming" canvas
section prove this works.

`tailwind.config.ts` + `components.json` in this bundle are the production
versions — drop them straight into the new project. `app/globals.css`
content is in a comment block at the end of `tailwind.config.ts`.

**Implementation note (gap):** the prototype reads colors *inline from JS*
(`t.accent`, `t.bg`) rather than from CSS variables. The visual is correct;
the mechanism isn't shadcn-idiomatic. For production: scope theme variables
via `data-theme="A_kaltenbach"` on the screen root, replace JS color reads
with `var(--accent)` etc. See `COMPONENTS.md → Konventionen`.

## Responsive

Three breakpoints in production:

| Range            | Layout                                  |
|------------------|-----------------------------------------|
| `≤ 768 px`       | Phone — single column, sticky bottom CTAs |
| `769 – 1199 px`  | Tablet — 2-col, no right rail            |
| `≥ 1200 px`      | Desktop — full 3-col office cockpit      |

Desktop adaptations live in `responsive.jsx`. Implementation strategy:
**container queries** on the cards (e.g., KPI tile grid: `2×2` on phone,
`4×1` on desktop), and a top-level `DesktopShell` wrapper component that
arranges the left nav rail + main column + right context rail.

Phone artboards are 390 × 844 (iPhone 14). Desktop 1440 × 900, tablet
1024 × 768. Designs work at 200 % zoom without horizontal scroll on the
key screens — covered in the A11y audit.

## Accessibility

`ACCESSIBILITY.md` contains the full audit. Summary:

- All eight color pairs on Direction A pass AA. `inkSoft #7a6f63` is the
  knappest at 4.5:1 — only use for body text ≥ 14 pt or bold ≥ 11 pt.
- All eight club colors pass AA as accent text on cream paper. Auerbach
  green is the knappest at 5.4:1; white text on Auerbach-green button is
  4.7:1 — still AA.
- 24 of 25 touch targets are ≥ 44 × 44. Inbox-Mehr-Kebab is currently
  36 px → extend on production refactor.
- Form indicators (S/U/N), prediction chips (▲▼=), contract-expiring
  dots, roof glyphs and inbox type indicators are *dual-coded*
  (color + glyph + text).
- Six remaining engineering tasks listed at the end of ACCESSIBILITY.md.

## State management

The prototype uses ad-hoc `React.useState` per screen. For production:

- **Career save** — Dexie-IndexedDB store keyed by save slot id.
  Periodic snapshot before each match day. Export/import as `.save` JSON.
- **Live match** — Zustand store for `matchState` (minute, score, events,
  xG, fatigue). Updated by the simulation tick. Halftime-Sheet reads from
  the same store.
- **Global UI** — Zustand store for: active save slot, theme key
  (`A_hafenstadt` etc.), scheme (light/dark/auto), datendichte
  (kompakt/profi), motion preference.
- **Forms** — react-hook-form + zod for vertragsverhandlung and
  einstellungen.

Match simulation engine and AI are out of scope here — the design assumes
they exist and reads from their stores.

## Animation

Wrap every motion in `motion-safe:`. Concrete pieces in the prototype:

- **Tunnel-Moment** (`cinematic.jsx`) — three-stage parallax (Tunnel-Dunkel
  → Tunnel-Licht → Auflauf) over ~1.8 s per stage. Auto-cycles in the
  prototype via `setInterval`; in production play once, ≤ 3 s, skippable
  via the always-visible Skip pill. On `reduce-motion` → render final
  frame statically.
- **Siegerehrung** (`cinematic.jsx`) — confetti rain + spotlight pulse,
  ≤ 2.5 s. Same reduced-motion fallback.
- **xG live strip** (`live-demo.jsx`) — accent line grows during match
  ticks. No fade-in animation needed; the new path segment draws.
- **Halbzeit-Bubbles** (`depth.jsx`) — sheet slide-up 200 ms; reactions
  fade-in.

All animation primitives the brief calls for are pre-declared in
`tailwind.config.ts → keyframes` and `animation`.

## Assets

The prototype generates everything procedurally or with inline SVG. No
external images, no fonts beyond the three Google-self-hostable ones.

- **Crests** — SVG `<Crest>` component, deterministic per club.
- **Portraits** — `<Portrait>` component, initials only. The brief
  explicitly forbids image uploads in v1.
- **Trophy / album collage / tabloid photo** — bespoke inline SVG
  (`depth.jsx`, `depth-data.jsx`, `cinematic.jsx`). Treat as starting
  point; refine in production with the same B/W halftone vibe.
- **Stadium plan** — SVG (`ui.jsx → StadiumPlot`, `stadium.jsx →
  StandSideView`).
- **Icons** — currently inline lucide-style SVGs in `ui.jsx → I`.
  Replace with `lucide-react` imports in production.
- **Stadium glyphs** — bespoke (`stadium.jsx → GlyphRoof`, `GlyphSeat`,
  `GlyphStand`, etc.). Keep these as custom components; do not stretch
  lucide.

## Anti-patterns — explicitly avoid

(From the original brief, repeated here so the implementer doesn't drift.)

- FM-style 1-20 attribute grids on a phone (Profi-Modus only).
- Dropdown-heavy forms; prefer sheets, segmented controls, sliders.
- Tooltip-only affordances on mobile.
- Cartoon stadia or chibi player portraits.
- Gambling-style sponsor reveal animations, doping minigames, "black
  account" jokes — explicit IP/PR red lines.
- Real-world badges, kits, trophies, kit-manufacturer marks, official
  ball designs.
- Generic SaaS dashboard look (this is a *game*).

## Files in this bundle

- `index.html` — design canvas entry point. Open in a browser to see all
  45 screens + library + responsive variants.
- `design-canvas.jsx` — pan-zoom Figma-like wrapper (not for production).
- `data.jsx` — invented clubs, players, fixtures, finances, save slots.
  Contains **`CLUB_REGISTRY`** and the `crestFor()` / `themeKeyFor()`
  helpers.
- `ui.jsx` — token tables (`THEMES`), icon set (`I`), Phone-frame,
  `Crest`, `Portrait`, `StrBar`, `Talent`, `FormStrip`, `PosPill`,
  `LevyChip`, `MiniPitch`, `FormationPitch`, `StadiumPlot`.
- `stadium.jsx` — `StandSideView`, `StadiumTypePlan`, `CapacityBar`,
  bespoke glyphs.
- `negotiations.jsx` — screens 11-14.
- `tactics.jsx` — screens 15-17, `TSlider`, `Seg`, `TacticToggle`,
  `Sparkline`, `BreakBar`.
- `team.jsx` — screens 18-24, `PlayerCard` extensions, `AttrBar`,
  `TraitPill`, `Workload`.
- `compare.jsx` — screens 25-28, `TeamRadar`, `Attr20`, `CmpRow`.
- `more.jsx` — screens 29-33, `registerClubTheme`, `ClubHub`.
- `settings.jsx` — screen 34.
- `responsive.jsx` — `DesktopShell`, `DesktopHub`, `DesktopMatch`,
  `DesktopSquad`, `DesktopTactics`, `DesktopFinance`, `TabletHub`.
- `depth.jsx` — screens 35-38.
- `depth-data.jsx` — screens 39-41.
- `live-demo.jsx` — `LiveXgStrip`, `LiveThemeDemo`.
- `library.jsx` — the 7-category visual library.
- `a11y.jsx` — A11y-Audit screen.
- `sponsor.jsx` — Sponsoren-Pyramide screen.
- `cinematic.jsx` — Tunnel-Moment, Siegerehrung.
- `directions.jsx` — three direction comparison + crest grammar showcase
  + Tailwind tokens panel.
- `screens-part1.jsx`, `screens-part2.jsx` — screens 01-10.
- `app.jsx` — assembles everything into `<DesignCanvas>` sections.
- `tailwind.config.ts` — production Tailwind config (Direction A tokens,
  fontFamily, borderRadius, spacing, keyframes/animation, boxShadow).
- `components.json` — shadcn patch.
- `RATIONALE.md` — design intent and per-screen reasoning.
- `TASKS.md` — depth-of-play roadmap (most items already shipped).
- `COMPONENTS.md` — engineer-readable component index.
- `ACCESSIBILITY.md` — measured audit + 6 remaining to-dos.

## First-week plan for the implementing developer

A suggested sequence to bring this online in a fresh Next.js project:

1. **Scaffold**: `npx create-next-app@latest`, add Tailwind, install shadcn
   CLI, copy `tailwind.config.ts` and `components.json`, paste the CSS
   variables block from the config's comment into `app/globals.css`.
2. **Token primitives**: Implement the 16 design tokens as CSS variables.
   Wire light/dark switching via `class="dark"` on `<html>`.
3. **Atoms first** (1-2 days): `Crest`, `Portrait`, `StrBar`, `Talent`,
   `FormStrip`, `PosPill`, `PillBtn`, `LevyChip`. Every other screen
   depends on these.
4. **Hub + Inbox + Squad** (2 days): screens 01, 02, 03. These prove the
   Karte-not-Tabelle principle.
5. **Pre-match + Match-feed + Halftime** (2 days): screens 04, 05, 06.
   The match-day loop.
6. **Tactics + Lineup + Player detail** (2-3 days): screens 15, 16, 18.
   Depth without yet shipping all tabs.
7. **Onboarding + Saves + Settings** (1 day): screens 09, 10, 34.
8. **Finanzen + Stadion + Transfer** (2 days): 07, 08, 29.
9. **Theming demo + Klubfarben-Switch** (1 day): copy `LiveThemeDemo`
   pattern; wire global theme store.
10. **Cinematic covers** (1 day): Tunnel + Siegerehrung as separate routes
    with `prefers-reduced-motion` fallback.

The rest (compare, stats, pokal, ticker, depth-data, cinematic etc.) can
ship behind feature flags after the core loop.

## Questions a developer should ask before starting

- Do we need real-time multiplayer in v1? **No, brief excludes it.**
- Are foto-uploads needed? **No, brief excludes it. Initialen-Chip only.**
- Cloud sync across devices? **Out of v1; offline-first is identity.**
- 3D match presentation? **Post-MVP, brief excludes.**
- Marketing landing page? **Out of scope. PWA install is the entry.**

If a section of this README contradicts the original brief, the brief
wins. The original brief sits next to this README as `BRIEF.md` (you can
ask the user to paste it if it's not in the bundle).
