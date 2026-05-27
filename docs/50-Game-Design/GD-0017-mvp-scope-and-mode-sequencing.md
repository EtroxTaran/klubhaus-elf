---
title: GD-0017 MVP Scope and Mode Sequencing
status: draft
tags: [game-design, gddr, mvp, scope, roguelite]
created: 2026-05-18
updated: 2026-05-18
type: game-design
binding: true
related: [[README]], [[mode-create-a-club-roguelite]], [[mode-manage-a-club-career]], [[singleplayer-baseline]], [[onboarding-and-tutorial]], [[../00-Index/MVP-Scope]], [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
---

# GD-0017: MVP Scope and Mode Sequencing

## Status

approved

> **Approved** — this record supersedes the MVP parts of older notes that said
> both content modes ship playable on day 0 or that full offline-first
> singleplayer is required for MVP.

## Player experience goal

The first playable should get the player into a fictional club-building
roguelite run quickly, show the weekly football-manager heartbeat, and make the
long-term promise visible without overloading the MVP.

## Decided / strong

- **MVP playable mode is Create-a-Club Roguelite**. It is the active first
  playable and the default FTUE path.
- **Manage-a-Club Career is visible as "comes later"** in onboarding / mode
  selection, but is not playable in the MVP.
- **Singleplayer remains the long-term reference experience**, but the MVP is a
  smaller first playable slice rather than the full reference baseline.
- **Async multiplayer, watch parties and human-to-human transfer negotiation are
  post-MVP**. They remain server-authoritative when shipped.
- **MVP is hybrid-online, not full offline-first**. Offline-first singleplayer
  becomes a future selective capability; see
  [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]].
- **Export/import is post-MVP**, but save-envelope and migration design are
  reserved from the start.
- The shared simulation core, IP-clean data model, deterministic engine and
  progressive-disclosure UI remain non-negotiable future-proofing constraints.

## MVP mode flow

```text
[Experience question]
  ↓
[Mode step]
  • Create-a-Club Roguelite — playable now
  • Manage-a-Club Career — comes later
  ↓
[Create club]
  ↓
[Home dashboard + first feed-card]
  ↓
[First tactic choice]
  ↓
[First match]
```

The Career tile should explain the promise in plain language:

> "Manage an existing club, build your reputation, and move between jobs. Coming
> after the roguelite MVP."

## MVP roguelite slice

The first playable includes:

- fictional club creation;
- basic club identity / colours / crest choice;
- starting country/region and low-tier starting context;
- weekly heartbeat with one advance verb;
- basic squad/tactics/match loop;
- cash/run-risk feedback;
- first match and match report;
- feed-card tutorial guidance; and
- visible "requires connection" states for final authoritative actions.

Detailed tuning of legacy carries, late-game ownership shocks, deep stadium
systems and multi-run meta progression may ship after the first playable if the
core run loop is not blocked.

## What older notes this amends

- [[singleplayer-baseline]] remains the long-term full reference experience, not
  the MVP launch scope.
- [[onboarding-and-tutorial]] and [[GD-0012-onboarding]] should show Career as
  "comes later" in MVP instead of offering both modes playable from day 0.
- [[GD-0014-save-career-model]] keeps long-save and export/import direction, but
  full offline-first and user-facing export/import are not MVP requirements.

## Rationale

Create-a-Club Roguelite gives the sharpest MVP proof:

- natural failure and restart stakes;
- staged teaching of complex systems;
- strong differentiation from classical manager campaigns;
- smaller first playable surface; and
- a clean path to later Career mode because the same simulation core is reused.

## Consequences

Positive:

- MVP scope is smaller and easier to validate.
- The long-term platform promise stays visible.
- Career and multiplayer can be built later on stronger foundations.
- Offline-first work is staged instead of rushed.

Negative:

- Players looking for a classical "take over existing club" career must wait.
- Docs and UI must consistently explain "comes later" without implying
  abandonment.

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]

## Related

- [[../00-Index/MVP-Scope]] — canonical MVP definition
- [[mode-create-a-club-roguelite]] — first playable mode
- [[mode-manage-a-club-career]] — first-class post-MVP mode
- [[onboarding-and-tutorial]] — FTUE changes
