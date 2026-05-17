---
title: ADR-0008 Mobile-first UI
status: draft
tags: [adr, ui]
created: 2026-05-15
updated: 2026-05-17
type: adr
binding: false
supersedes:
superseded_by:
related: [[../../60-Research/research-wave-2-gaps]]
---

> **DRAFT — do not implement from this ADR.** Blocked on Research Wave 2
> ([[../../60-Research/research-wave-2-gaps]]). Direction below is current
> intent, not an accepted decision.

# ADR-0008: Mobile-first UI Approach

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

## Related Docs

- [[../../60-Research/club-boss-analysis]]
- [[../../60-Research/research-wave-2-gaps]]
- [[ADR-0006-i18n]]
