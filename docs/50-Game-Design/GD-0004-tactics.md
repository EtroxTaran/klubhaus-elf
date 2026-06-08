---
title: GD-0004 Tactics & Formations
status: accepted
tags: [game-design, gddr, tactics]
created: 2026-05-17
updated: 2026-06-08
type: game-design
binding: true
related: [[README]], [[GD-0002-match-engine]], [[GD-0016-mobile-ux-loop]], [[../60-Research/anstoss-series-deep-dive]], [[../95-Archive/gap-reports/research-wave-2-gaps]], [[../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
---

# GD-0004: Tactics & Formations

## Status

approved

> **Approved** — the **Decided / strong** section is ratified design
> direction; an ADR or implementation must not contradict it. The
> **Open (Wave 2)** items are NOT approved and not implementable until
> Wave 2 research closes.

## Date

2026-05-17

## Player experience goal

Tactical depth that is opt-in: three controls in two taps for casual play,
more under an expander for engaged play — beating Club Boss's "coarse" tactics.

## Decided / strong

- MVP halftime/tactics controls are deliberately shallow: **formation,
  mentality, one-tap sub**; deeper tactics behind a "More" expander
  (anstoss-series-deep-dive §5 takeaway 5, §7 rec. 4).
- Live in-match control: substitutions, tactical tweaks, halftime team talks
  (anstoss-series-deep-dive §3 "Match presentation").
- A **team-chemistry multiplier** ("Eingespielt") carries over from Anstoss
  (research-wave-2-gaps R2-03; anstoss-series-deep-dive §3).
- Formations (4-4-2, 3-5-2, 4-2-3-1, …) as schemata are **IP-safe**; named
  coach "playbooks" are not (ip-and-licensing §3).
- Must beat Club Boss's flagged "shallow tactics / coarse formations" weakness
  (club-boss-analysis; competitor-matrix).

## Open (Wave 2)

- **R2-03 (high)** — formation taxonomy, mentality bands, player roles, set
  pieces/marking/pressing UX. *Recommended (not decided)* MVP slice: 5–8
  formations, 3 mentalities, 4 instructions + chemistry multiplier; plus a
  tactics contract feeding the match engine (R2-01) and the training plan.

## Rationale

Opt-in depth keeps the 30-second loop intact while differentiating from
shallow-tactics competitors (anstoss-series-deep-dive §5; club-boss-analysis).

## Consequences

Positive:

- Casual-friendly without capping engaged players.

Negative / constraints:

- The tactics→engine contract is unspecified until R2-03/R2-01 → blocks
  ADR-0003 and ADR-0008 input blocks.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] (tactics input contract)
- [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]] (mobile tactics UX)

## Related

- Research: [[../60-Research/anstoss-series-deep-dive]] · [[../95-Archive/gap-reports/research-wave-2-gaps]] · [[../60-Research/ip-and-licensing]]
- [[README]] — hub · siblings: [[GD-0002-match-engine]] · [[GD-0005-training]] · [[GD-0016-mobile-ux-loop]]
