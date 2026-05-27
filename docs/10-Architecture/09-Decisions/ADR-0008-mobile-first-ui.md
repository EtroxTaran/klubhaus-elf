---
title: ADR-0008 Mobile-first UI
status: draft
tags: [adr, ui]
created: 2026-05-15
updated: 2026-05-19
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[../../95-Archive/gap-reports/research-wave-2-gaps]]
  - [[ADR-0021-revised-tech-stack]]
  - [[ADR-0024-match-renderer-abstraction]]
  - [[ADR-0025-mobile-delivery]]
---

> **DRAFT — do not implement from this ADR.** Blocked on Research Wave 2
> ([[../../95-Archive/gap-reports/research-wave-2-gaps]]). Direction below is current
> intent, not an accepted decision.

> **STACK-REVISION IMPACT 2026-05-19 ([[ADR-0021-revised-tech-stack]] + ADR-0023/0024/0025).**
> Informational only — status (`draft`) and decision are **unchanged**; do not
> implement. On promotion the substrate amendment below applies: *refine
> viewport/native-shell sections against [[ADR-0025-mobile-delivery]] (Capacitor)
> + [[ADR-0024-match-renderer-abstraction]] (renderer); responsive-PWA-first
> stance is consistent with ADR-0025, no contradiction.*
> Disposition: **keep parked** (owner directive 2026-05-19).

# ADR-0008: Mobile-first UI Approach

> **REOPENED on 2026-05-27:** This ADR is `draft` again. Any `accepted`, `binding`, or `locked` wording below is historical pre-reopen context until Nico re-ratifies it.

## Status

draft

## Date

2026-05-15

## Context

The club-boss research (`60-Research/club-boss-analysis.md`) points to a
mobile, inbox-driven loop. Concrete navigation and table patterns depend on
Wave 2 UI research.

## Options Considered

- Mobile-first, desktop-responsive (intended).
- Desktop-first with mobile adaptation.
- Separate mobile and desktop UIs.

## Decision

(Intended, pending Wave 2) Design primary gameplay flows for mobile first while
preserving desktop-friendly responsive layouts.

## Rationale

The target loop (inbox, quick decisions) is mobile-native; a single
mobile-first responsive UI avoids maintaining two front-ends.

## Consequences

Positive:

- One responsive UI usable on small touch screens and with keyboard nav.

Negative:

- Navigation, tables, simulation controls, and save flows must all be validated
  on small screens. Concrete patterns unstable until Wave 2 closes.

## Supersedes

None

## Design source

This ADR **implements** game-design decisions — it must not contradict them:

- [[../../50-Game-Design/GD-0016-mobile-ux-loop]] (primary) · [[../../50-Game-Design/GD-0001-core-loop]] (advance verb) · [[../../50-Game-Design/GD-0004-tactics]] (tactics UX) · [[../../50-Game-Design/GD-0012-onboarding]]
## Related

- [[../../95-Archive/gap-reports/research-wave-2-gaps]]
- [[ADR-0021-revised-tech-stack]]
- [[ADR-0024-match-renderer-abstraction]]
- [[ADR-0025-mobile-delivery]]
