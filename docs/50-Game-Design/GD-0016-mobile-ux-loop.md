---
title: GD-0016 Mobile UX Gameplay Loop
status: accepted
tags: [game-design, gddr, ux, mobile]
created: 2026-05-17
updated: 2026-06-11
type: game-design
binding: true
related: [[README]], [[GD-0001-core-loop]], [[GD-0013-narrative-inbox]], [[GD-0017-mvp-scope-and-mode-sequencing]], [[../00-Index/MVP-Scope]], [[../60-Research/anstoss-series-deep-dive]], [[../60-Research/club-boss-analysis]], [[../95-Archive/gap-reports/research-wave-2-gaps]], [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]], [[../10-Architecture/09-Decisions/ADR-0010-design-system]], [[../10-Architecture/09-Design-System]]
---

# GD-0016: Mobile UX Gameplay Loop

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `approved`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **Accepted** (re-ratified 2026-06-08, PR #153) — the **Decided / strong** section is ratified design
> direction; an ADR or implementation must not contradict it. The
> **Open (Wave 2)** items are NOT approved and not implementable until
> Wave 2 research closes.
>
> Note: the visual design language is independently `accepted` via ADR-0010
> (Klubhaus DS). The interaction-model ADR (ADR-0008) is now `accepted`
> (ratified 2026-06-03, FMX-98) — it realises this GDDR and resolves R2-07 + R2-17
> (route map + IA + client-state). R2-16 (match controls + rendering) is **resolved
> 2026-06-03** by draft [[GD-0025-in-match-controls]] (gameplay) + proposed
> [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]] (architecture), FMX-100.
>
> MVP sequencing: [[GD-0017-mvp-scope-and-mode-sequencing]] scopes the first
> playable to Create-a-Club Roguelite, with Career shown as "comes later".

## Date

2026-05-17

## Player experience goal

One-handed, one-primary-action-per-screen play that works in 30 seconds at a
tram stop and 30 minutes on a couch — the same UI.

## Decided / strong

- **One mobile-first responsive UI** (no desktop-first / separate desktop UI);
  one-handed portrait, <1 s tap budget (ADR-0008 *draft*; Non-Goals;
  anstoss-series-deep-dive §5).
- **Single "this week" home screen**: next-match card + 3–4 contextual action
  cards (training, transfers, board, finances) (anstoss-series-deep-dive §5
  takeaway 1, §7 rec. 5).
- **Tap-only chairman loop**: one primary action per screen; sim advances on a
  "next match / next day" tap (club-boss-analysis takeaway 1).
- **Hub + drill-down** nav (Squad/Transfers/Youth/Staff/Stadium/Finances);
  **tabular data → cards** (anstoss-series-deep-dive §5 takeaway 4).
- **Halftime = 30-second modal**; **press/board = feed cards**
  (anstoss-series-deep-dive §5 takeaways 5–6).
- **Guardrails at the edges, freedom at the centre** — warn loudly on illegal
  XI, never silently allow <11 starters (club-boss-analysis takeaway 10).
- **Sort/filter every list from day one** (club-boss-analysis takeaway 8).
- Delivered design language = **ADR-0010 "Klubhaus DS" / Direction A
  "Sonntagszeitung"** (accepted): Tailwind v4 tokens, `data-scheme` light/dark
  (SSR-deterministic), club-adaptive accent; chrome in `locales/{de,en}.ts`,
  sample data in `screens/fixtures.ts` (ADR-0010; [[../10-Architecture/09-Design-System]]).

## Open (Wave 2)

- **R2-07 (high)** — ✅ **RESOLVED 2026-06-03** by
  [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]] (FMX-98): route map +
  **bottom-nav hybrid** (4–5 tabs: Home/Squad/Transfers/Inbox + Club/More bottom-sheet
  for Youth/Staff/Stadium/Finances/Settings; Home feed-cards as a task hub), WCAG 2.2 AA,
  44 px targets, `prefers-reduced-motion`.
- **R2-16 (high)** — ✅ **RESOLVED 2026-06-03** (FMX-100): match-controls UX +
  rendering control-seam. Gameplay = draft [[GD-0025-in-match-controls]] (one MVP
  live-control kit: queued subs, mentality presets, formation-swap, 3 cooldown
  shouts, 3 speeds + free pause; halftime modal; text&stats a11y path).
  Architecture = proposed
  [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]] (intervention
  DTO with light=next-tick / heavy=next-boundary + immutable `TacticSnapshot`;
  operational pause; main-thread Canvas-2D for MVP; perf-validation protocol).
  Rendering *technology* was already settled (ADR-0024/0041 Canvas-2D-first,
  unchanged).
- **R2-17 (high)** — ✅ **RESOLVED 2026-06-03** by
  [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]] (FMX-98): layered client
  state (TanStack Query = server · Dexie = drafts · TanStack Router = route · React =
  ephemeral) + a **narrow Zustand v5 client-only slice**; optimistic UI = snapshot →
  patch → rollback with a Dexie draft lifecycle + `expected-version`; hybrid worker bridge
  (Comlink control-plane + `postMessage` event stream). **Constraint reworded:** *no Redux,
  and no Zustand **god-store mirroring server state** — a narrow client-only slice is
  allowed* (reconciles this GDDR with ADR-0021's ratified Zustand v5; see ADR-0008 §D2).
  **R2-10 (medium)** — i18n (still open).

## Rationale

The same-UI-any-session-length constraint is the core mobile bet
(club-boss-analysis takeaway 1; anstoss-series-deep-dive §5).

## Consequences

Positive:

- Accessible, fast, one-handed; consistent across session lengths.

Negative / constraints:

- IA + client-state **resolved** (R2-07/17 → ADR-0008 `accepted` 2026-06-03, FMX-98);
  match-controls + rendering control-seam (R2-16) **resolved** 2026-06-03 → GD-0025
  + ADR-0072 (FMX-100). Remaining open: R2-10 (i18n).

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]] (interaction model)
- [[../10-Architecture/09-Decisions/ADR-0010-design-system]] (accepted — realises it)

## Related

- Research: [[../60-Research/anstoss-series-deep-dive]] · [[../60-Research/club-boss-analysis]] · [[../95-Archive/gap-reports/research-wave-2-gaps]]
- Architecture: [[../10-Architecture/09-Design-System]]
- [[README]] — hub · siblings: [[GD-0001-core-loop]] · [[GD-0013-narrative-inbox]] · [[GD-0012-onboarding]]
