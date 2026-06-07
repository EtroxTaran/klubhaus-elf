---
title: Youth Academy bounded context — decision grounding 2026-06-07
status: draft
tags: [research, youth, academy, ddd, bounded-context, regulations, fmx-29]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
sourceType: external
related:
  - [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
  - [[youth-academy-bounded-context-2026-05-28]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
---

# Youth Academy — decision grounding (2026-06-07)

Closes the open Nico choice on **ADR-0060** (drafted/recommended Option C, never ratified) and
sharpens the home-grown boundary.

## Open calls

- **D1 — own bounded context (Option C) vs sub-aggregate of Squad/Training/Staff (A/B/D).**
- **D2 — home-grown / registration eligibility ownership** between Youth Academy and Regulations.

## What best practice says (Perplexity Sonar, 2026-06-07)

- **D1 → own bounded context, kept coarse-grained.** The classic split heuristics fire: **cadence
  mismatch** (annual/seasonal academy clock vs weekly Squad/Training), **lifecycle independence**
  ("you could simulate an academy for years standalone"), **distinct ubiquitous language** (intake,
  cohort, EPPP/NLZ category, productivity, Head of Youth) that does not belong in the first-team
  tactical model. Caveat against **over-splitting**: keep it *one* Youth Academy context with internal
  aggregates (AcademySeason, YouthCohort, Facilities), **not** micro-contexts for budget/facilities/KPIs.
- **Real-world structure confirms separation:** England **EPPP** Category 1–4 (coaching hours,
  facilities, education, a "Productivity" KPI of graduates reaching pro appearances) and German **NLZ**
  DFB/DFL licensing + audit cycles are **separate audited organisational units** with own budgets/KPIs/
  director. Crucially, EPPP/NLZ *criteria* and home-grown *definitions* are **regulation**; the club's
  *current category, facility level, enrolment history* are **academy operational state**.
- **Genre precedent:** FM (youth intake day + newgens + junior-coaching/recruitment/facilities levels +
  U18/U21 squads), OOTP (amateur draft + international complex), EHM (junior rights + farm teams) all
  model youth as a **separate subsystem feeding the senior roster**, while the Player remains a unified
  entity once promoted (exactly ADR-0060's Snapshot-to-Squad pattern).
- **D2 → Regulations owns the eligibility *interpretation*; Academy owns the *facts/history*.** Best
  practice (the "rules-centric" design) keeps the home-grown **rule** (`IsHomeGrownForCompetition(player,
  comp, date)`) in Regulations, while Youth Academy exposes raw **training-history facts** (age bands,
  enrolment seasons). The squad-registration flow asks Regulations to evaluate, passing Academy facts.
  Storing a hard "home-grown" boolean inside Academy is the weaker design because its meaning changes if
  rules change or the player's career continues elsewhere.

## Recommendation

- **D1 = Option C (own bounded context).** Strongest-in-wave split signals + real-world + genre
  precedent; ratify ADR-0060 as drafted.
- **D2 = align to rules-centric:** keep Academy as the owner of **enrolment/training-history facts**;
  treat `HomeGrownShareCounter` as a **derived projection** computed from Academy facts × Regulations
  parameters, with Regulations owning the authoritative `SquadRegistrationCheck` eligibility verdict
  (Academy never stores a standalone "is home-grown" truth). This is a one-line clarification to
  ADR-0060's existing `HomeGrownShareRecalculated` → Regulations-ACL contract, not a redesign.

## Sources

Perplexity Sonar 2026-06-07 (DDD bounded-context cadence/lifecycle heuristics — Fowler bliki, MS Azure
domain-analysis, ddd.academy bounded-context canvas; EPPP/NLZ/UEFA-HGP structure; FM/OOTP/EHM youth
modelling; Academy-vs-Scouting-vs-Regulations boundary). Prior synthesis
[[youth-academy-bounded-context-2026-05-28]].
