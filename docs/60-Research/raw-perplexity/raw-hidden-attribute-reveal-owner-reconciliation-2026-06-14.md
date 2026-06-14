---
title: Raw Perplexity - Hidden-attribute reveal owner reconciliation
status: raw
tags: [research, raw, perplexity, hidden-attributes, scouting, people, ddd, fmx-154]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-154
sourceType: external
related:
  - [[../hidden-attribute-reveal-owner-reconciliation-2026-06-14]]
  - [[../hidden-attribute-substrate-mapping-2026-06-05]]
  - [[../../50-Game-Design/GD-0027-hidden-attribute-substrate-mapping]]
  - [[../../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  - [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
---

# Raw Perplexity - Hidden-attribute reveal owner reconciliation

## Prompt

Research the best-practice split for an event-sourced / DDD sports-management
game when hidden player facts are derived in one context but shown only after
confidence-gated scouting. Compare:

- enterprise analogues such as CRM lead scoring vs customer/opportunity truth,
  ATS candidate assessment vs HR master profile, and data-product read models;
- sports-game precedents such as Football Manager personality/scouting, OOTP
  scouting accuracy / ratings, and NBA 2K where relevant;
- event-sourcing and CQRS guidance on source-of-truth ownership vs projections.

Question to answer: should People derive and own hidden persona labels while
Scouting owns only the reveal/confidence gate and Squad/UI presents banded
read-models, or should Scouting/Squad own the labels?

## Perplexity answer capture

Perplexity supported the split already chosen in GD-0027 D2:

- **People / Persona & Skills owns truth and derivation.** Hidden persona labels
  are deterministic facts derived from persisted OCEAN plus hidden-meta values.
- **Scouting owns knowledge and reveal state only.** Its ledger records what a
  manager knows, when confidence crosses a reveal threshold, and how certain the
  shown label/band may be.
- **Squad & Player / UI presents projections.** The manager-facing view is a
  read model that narrows from hidden to estimated band to effectively known as
  scouting knowledge rises.
- **Do not give Scouting or Squad a second label authority.** That would create
  double ownership, inconsistent replay, and conflicting updates between truth
  and visibility.
- Enterprise analogues line up with this split: a CRM may score and expose a
  lead/opportunity confidence view without owning customer truth; recruiting
  assessment may expose fit/confidence while HR owns the master worker/person
  record; analytics/data products may publish projections without writing the
  command model.
- Game precedent is directional, not contractual for FMX: management games
  commonly keep underlying player traits separate from scouting accuracy and
  report presentation. OOTP's public manual describes scout-estimated ratings
  and accuracy; the earlier FMX hidden-attribute research already records
  Football Manager/OOTP-style scouting-gated reveal bands.

Perplexity's practical rule:

```text
People owns what is true.
Scouting owns how well the club knows it.
Squad/UI owns how the manager sees it.
```

## Source trail retained

- Microsoft Azure Architecture Center, "Event Sourcing pattern":
  https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing
- Event-Driven.io event-sourcing articles index:
  https://event-driven.io/en
- OOTP 24 manual, "Scouting players":
  https://manuals.ootpdevelopments.com/index.php?man=ootp24&page=scouting_players
- Prior FMX raw hidden-attribute capture:
  [[raw-hidden-attribute-substrate-mapping-2026-06-05]]

## Source-quality note

Perplexity returned useful synthesis, but some public game-specific citations
were weak. The synthesis therefore uses the strongest source trail for the
binding claim:

- DDD/event-sourcing best practice: separate authoritative write/source model
  from derived read/projection models.
- FMX's own accepted ADR/GDDR chain: ADR-0052 for People truth, ADR-0064 for
  Scouting reveal state, GD-0027 for deterministic derivation and reveal split.
- Public OOTP manual evidence only as a genre precedent that visibility/accuracy
  can differ from underlying ratings.

