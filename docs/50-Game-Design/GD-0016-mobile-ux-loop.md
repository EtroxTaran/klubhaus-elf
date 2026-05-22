---
title: GD-0016 Mobile UX Gameplay Loop
status: approved
tags: [game-design, gddr, ux, mobile]
created: 2026-05-17
updated: 2026-05-18
type: game-design
binding: true
related: [[README]], [[GD-0001-core-loop]], [[GD-0013-narrative-inbox]], [[GD-0017-mvp-scope-and-mode-sequencing]], [[../00-Index/MVP-Scope]], [[../60-Research/anstoss-series-deep-dive]], [[../60-Research/club-boss-analysis]], [[../95-Archive/gap-reports/research-wave-2-gaps]], [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]], [[../10-Architecture/09-Decisions/ADR-0010-design-system]], [[../10-Architecture/09-Design-System]]
---

# GD-0016: Mobile UX Gameplay Loop

## Status

approved

> **Approved** — the **Decided / strong** section is ratified design
> direction; an ADR or implementation must not contradict it. The
> **Open (Wave 2)** items are NOT approved and not implementable until
> Wave 2 research closes.
>
> Note: the visual design language is independently `accepted` via ADR-0010
> (Aurelia Premier). The interaction-model ADR (ADR-0008) is still `draft` —
> ratifying this GDDR gives that ADR its approved design source to implement.
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
- Delivered design language = **ADR-0010 "Aurelia Premier" / Direction A
  "Sonntagszeitung"** (accepted): Tailwind v4 tokens, `data-scheme` light/dark
  (SSR-deterministic), club-adaptive accent; chrome in `locales/{de,en}.ts`,
  sample data in `screens/fixtures.ts` (ADR-0010; [[../10-Architecture/09-Design-System]]).

## Open (Wave 2)

- **R2-07 (high)** — route map, bottom-nav vs drawer vs hub-tile, WCAG 2.2 AA,
  44 px targets, `prefers-reduced-motion`.
- **R2-16 (high)** — match-controls UX + rendering tech.
- **R2-17 (high)** — client-state pattern (modal drafts, optimistic transfer
  UI, Worker bridge; no Redux/Zustand). **R2-10 (medium)** — i18n.

## Rationale

The same-UI-any-session-length constraint is the core mobile bet
(club-boss-analysis takeaway 1; anstoss-series-deep-dive §5).

## Consequences

Positive:

- Accessible, fast, one-handed; consistent across session lengths.

Negative / constraints:

- IA/state/rendering open (R2-07/16/17) → blocks ADR-0008.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]] (interaction model)
- [[../10-Architecture/09-Decisions/ADR-0010-design-system]] (accepted — realises it)

## Related

- Research: [[../60-Research/anstoss-series-deep-dive]] · [[../60-Research/club-boss-analysis]] · [[../95-Archive/gap-reports/research-wave-2-gaps]]
- Architecture: [[../10-Architecture/09-Design-System]]
- [[README]] — hub · siblings: [[GD-0001-core-loop]] · [[GD-0013-narrative-inbox]] · [[GD-0012-onboarding]]
