---
title: GD-0012 Onboarding & New Game
status: draft
tags: [game-design, gddr, onboarding]
created: 2026-05-17
updated: 2026-05-18
type: game-design
binding: true
related: [[README]], [[GD-0008-finance-economy]], [[GD-0016-mobile-ux-loop]], [[GD-0017-mvp-scope-and-mode-sequencing]], [[../00-Index/MVP-Scope]], [[../60-Research/club-boss-analysis]], [[../60-Research/anstoss-series-deep-dive]], [[../95-Archive/gap-reports/research-wave-2-gaps]], [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]], [[../10-Architecture/09-Decisions/ADR-0006-i18n]]
---

# GD-0012: Onboarding & New Game

## Status

approved

> **Approved** — the **Decided / strong** section is ratified design
> direction; an ADR or implementation must not contradict it. The
> **Open (Wave 2)** items are NOT approved and not implementable until
> Wave 2 research closes.
>
> **MVP amendment (2026-05-18):** [[GD-0017-mvp-scope-and-mode-sequencing]]
> supersedes this note where it implies all modes are playable in MVP. The MVP
> shows Roguelite as active and Career as "comes later".

## Date

2026-05-17

## Player experience goal

Be managing a club in ~60 seconds, and understand *why money matters* by the
end of season one — the single biggest churn risk solved.

## Decided / strong

- **Frictionless ~60-second start**: pick Roguelite → pick country → pick fictional club →
  optional manager avatar; full editor/custom data is **post-MVP**
  (anstoss-series-deep-dive §5 takeaway 7, §7 rec. 10).
- **Strategic onboarding, not just controls**: a guided first season that
  *teaches financial sustainability* (ticket pricing, sponsorship, wage
  budget) — the #1 missing piece in Club Boss reviews
  (club-boss-analysis takeaway 7).
- MVP UX must **beat Anstoss on first-session clarity** (competitor-matrix
  "Tutorialisation" risk).
- No real-world data import in MVP; editor edits fictional entities only
  (anstoss-series-deep-dive §7 rec. 10).

## Open (Wave 2)

- **R2-05 (high)** — "the single biggest churn risk in MVP": exact 60-second
  flow, guided first season, empty-state/re-engagement copy, feed-card primary
  actions, accessibility paths.

## Rationale

Systems are taught everywhere; strategy is taught nowhere — fixing that is the
retention lever (club-boss-analysis takeaway 7).

## Consequences

Positive:

- Fast start + a player who understands the economy = retention.

Negative / constraints:

- Exact design deferred to R2-05; copy/tone tied to ADR-0006.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]] (R2-05 input block)
- [[../10-Architecture/09-Decisions/ADR-0006-i18n]] (onboarding copy/tone)

## Related

- Research: [[../60-Research/club-boss-analysis]] · [[../60-Research/anstoss-series-deep-dive]] · [[../95-Archive/gap-reports/research-wave-2-gaps]]
- [[README]] — hub · siblings: [[GD-0008-finance-economy]] · [[GD-0016-mobile-ux-loop]] · [[GD-0013-narrative-inbox]]
