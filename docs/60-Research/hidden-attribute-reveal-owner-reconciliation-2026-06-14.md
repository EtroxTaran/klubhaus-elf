---
title: Hidden-attribute reveal owner reconciliation
status: current
tags: [research, hidden-attributes, scouting, people, ddd, game-design, fmx-154]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-154
sourceType: synthesis
related:
  - [[raw-perplexity/raw-hidden-attribute-reveal-owner-reconciliation-2026-06-14]]
  - [[hidden-attribute-substrate-mapping-2026-06-05]]
  - [[../50-Game-Design/GD-0027-hidden-attribute-substrate-mapping]]
  - [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
  - [[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
---

# Hidden-attribute reveal owner reconciliation

## Question

FMX-154 asks whether the accepted hidden-attribute contract still has one clear
owner for derived persona labels after the 2026-06-08 ratification sweep and
FMX-141 calibration follow-up.

## Summary

No new gameplay fork is needed. The best-practice split remains the one already
chosen in GD-0027 D2:

- **People / Persona & Skills owns truth:** persisted OCEAN, hidden-meta
  interpretation and deterministic persona-label derivation.
- **Scouting owns reveal state:** `HiddenFlagRevealLedger` stores only
  knowledge/confidence/reveal progress and emits reveal events.
- **Squad & Player / UI owns presentation:** banded manager-facing read models
  that narrow with knowledge and never expose raw OCEAN or hidden-meta point
  values.

Nico confirmed two FMX-154 decisions before this cleanup:

- GD-0027 status truth remains `accepted`, using the 2026-06-08 ratification
  sweep/current frontmatter as the source of truth.
- Hidden-persona-label ownership remains People derives / Scouting gates /
  Squad/UI presents.

## Evidence

Event-sourcing and CQRS practice separates the authoritative source model from
derived query models. Microsoft's Event Sourcing pattern documents an append-only
event store as the system of record and treats materialized views/projections as
derived query surfaces. That maps cleanly to FMX: People owns the state and pure
derivation, while Scouting/Squad publish confidence-gated projections.

OOTP's scouting model is a useful genre precedent: player evaluation can be
shown through scout-estimated ratings and accuracy rather than exposing the
underlying truth directly. The earlier FMX 2026-06-05 hidden-attribute research
already captured Football Manager/OOTP-style scouting-gated personality/hidden
attribute presentation. FMX-154 adds only the owner reconciliation, not new
thresholds or labels.

Enterprise analogues point the same way:

- CRM and sales scoring can rank or qualify a lead/opportunity without owning
  the canonical customer/person record.
- Recruiting assessment can express fit/confidence without becoming the HR
  master profile.
- Data products and dashboards can denormalize for decision-making without
  gaining write authority over the command model.

## Decision support

Recommended and accepted line:

```text
People owns what is true.
Scouting owns how well the club knows it.
Squad/UI owns how the manager sees it.
```

This keeps replay and UI consistent:

- no duplicate persona-label writer;
- no Scouting mutation of People truth;
- no Squad/UI point-value leakage;
- no new `*Rng` stream, because derivation remains pure;
- calibration stays in GD-0043 `people.personaLabels` behind
  `personaLabelModelVersion`.

## Vault implications applied

- GD-0027 stale draft/awaiting-ratify wording is replaced with accepted-status
  history.
- GD-0021's hidden-meta factor row is aligned to the People truth / Scouting
  reveal / Squad presentation split.
- ADR-0064's Decision Log summary now says hidden persona-label truth is read
  from the owning context, specifically People for labels, while Scouting keeps
  the reveal ledger.
- Current-State and the game-design index no longer describe GD-0027/GD-0021 as
  awaiting ratification.

## Non-goals

- Does not change label vocabulary, thresholds, caps or reveal percentages.
- Does not approve staff-skill MVP activation in GD-0021.
- Does not create a new ADR or bounded context.
- Does not add implementation contracts beyond the accepted GDDR/ADR wording.

