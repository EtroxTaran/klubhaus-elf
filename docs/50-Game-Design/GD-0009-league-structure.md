---
title: GD-0009 League & Competition Structure
status: draft
tags: [game-design, gddr, league]
created: 2026-05-17
updated: 2026-05-17
type: game-design
binding: false
related: [[README]], [[GD-0015-ip-clean-data]], [[GD-0010-ai-world]], [[../60-Research/ip-and-licensing]], [[../60-Research/club-boss-analysis]], [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]], [[../10-Architecture/09-Decisions/ADR-0004-data-model]]
---

# GD-0009: League & Competition Structure

## Status

draft

## Date

2026-05-17

## Player experience goal

Familiar football pyramid (promotion, relegation, cups, continental nights)
with entirely fictional branding.

## Decided / strong

- **Real-world league *structures* are mirrored; real names are not** — pyramid
  topology, round-robin schedules, knock-out brackets, continental slots,
  Aug–May calendar are uncopyrightable formats (ip-and-licensing §3; ADR-0007
  accepted).
- Competition names are fictional patterns; **default sandbox = `Aurelia
  Premier`** in a fictional country (ip-and-licensing §5.3/5.4; ADR-0010).
- Hybrid: **real country names + ISO codes** for nationality; **fictional
  country names for league branding** (ip-and-licensing §8/§9).
- Promotion/relegation pyramid + **multiple parallel cups**
  (club-boss-analysis "League structure"; competitor-matrix).
- Offline-friendly cups incl. midweek rotation pressure are **post-MVP**
  (anstoss-series-deep-dive §7 post-MVP 15).
- Avoid the protected combination: a real league's exact roster + exact
  promotion history (ip-and-licensing §3).

## Open (Wave 2)

- **R2-06 (high)** — continental/federation cup design without UEFA IP.
- **R2-13 (medium)** — women's calendar offset; model must not preclude it.
- **R2-14 (critical)** — `league`/`competition`/`fixture` schema patterns.

## Rationale

Formats are facts (safe + familiar); names are the IP risk, so they are
generated (ip-and-licensing §3; GD-0015).

## Consequences

Positive:

- Familiar competitive structure with zero licensing exposure.

Negative / constraints:

- Schema patterns (R2-14) and continental design (R2-06) still open.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] (fictional competition names)
- [[../10-Architecture/09-Decisions/ADR-0004-data-model]] (league/competition/fixture schema)

## Related

- Research: [[../60-Research/ip-and-licensing]] · [[../60-Research/club-boss-analysis]]
- [[README]] — hub · siblings: [[GD-0015-ip-clean-data]] · [[GD-0010-ai-world]] · [[GD-0011-career-progression]]
