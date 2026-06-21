---
title: FMX-138 determinism portfolio principle decision queue
status: accepted
tags: [execution, decision-queue, determinism, seeded-variance, rng, gameplay, fmx-138, accepted]
created: 2026-06-14
updated: 2026-06-19
type: decision-queue
binding: true
linear: FMX-138
related:
  - [[../60-Research/determinism-portfolio-principle-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0113-portfolio-determinism-seeded-variance-principle]]
  - [[../60-Research/determinism-and-replay]]
  - [[../00-Index/Open-Decisions-Dossier]]
---

# FMX-138 determinism portfolio principle decision queue

> **APPROVED on 2026-06-19.** Nico approved all recommended options via
> `APPROVE ALL RECOMMENDED`. This note is now the accepted decision
> record; no open Nico decision remains for FMX-138.


This is the HITL decision queue for FMX-138. It turns the research synthesis
[[../60-Research/determinism-portfolio-principle-2026-06-14]] into explicit Nico
decisions for accepted
[[../10-Architecture/09-Decisions/ADR-0113-portfolio-determinism-seeded-variance-principle|ADR-0113]]
.

## D1 - portfolio principle

| Option | Meaning | Assessment |
|---|---|---|
| **A. Variety surfaces seeded; projection/measurement/audit surfaces pure** | Bounded seeded variance where player-perceived football uncertainty matters; pure deterministic transforms for rules, ledgers, projections, measurements and audit. | **Recommended.** Best matches real-football uncertainty, game precedent and existing FMX replay discipline. |
| B. Pure deterministic default, seeded only by explicit exception | Every system starts pure unless a local ADR opts into variance. | Repeats the current debate pattern and over-determinizes lifelike football surfaces. |
| C. No portfolio rule | Keep deciding per system. | Reject; FMX-138 exists because this is already causing repeated forks. |

**Recommendation:** A.

## D2 - open-system axis choices

| Option | Meaning | Assessment |
|---|---|---|
| **A. Seed match outcome variety, injury occurrence and AI-manager decisions** | Classify all three as variety surfaces using existing streams/sub-labels with replay provenance. | **Recommended.** Gives the named future systems a usable default while preserving ADR-0096 replay rules. |
| B. Seed match and injury only; AI-manager pure | AI decisions become deterministic policies only. | Reduces replay complexity but risks predictable long-save AI and weak world freshness. |
| C. Keep all three pure until local ADRs reopen them | Defer the axis to future system beats. | Leaves the principle too weak for the systems named by Linear. |

**Recommendation:** A.

## D3 - existing pure declarations

| Option | Meaning | Assessment |
|---|---|---|
| **A. Preserve accepted pure declarations; classify them** | Keep HoF MVP induction, loan-quality, discipline eligibility and locked truth snapshots as pure deterministic unless explicitly reopened. | **Recommended.** Respects prior ratification and avoids hidden reinterpretation. |
| B. Reopen all pure declarations that touch football uncertainty | Revisit HoF, loan quality, discipline and weather now. | Too broad and unnecessary for this beat. |
| C. Reinterpret old decisions silently under the new principle | Treat existing pure wording as seeded where useful. | Reject; violates decision traceability. |

**Recommendation:** A.

## Decision record

- 2026-06-14: Nico selected FMX-138 from the live shortlist.
- 2026-06-14: FMX-138 moved from `Backlog` to `In Progress`.
- 2026-06-14: branch/worktree created:
  `codex/fmx-138-determinism-seeded-variance-principle`.
- 2026-06-14: Perplexity-first research and targeted source checks saved.
- 2026-06-14: synthesis created in
  [[../60-Research/determinism-portfolio-principle-2026-06-14]].
- 2026-06-14: draft ADR-0113 prepared as a non-binding proposal record.
- Accepted by Nico 2026-06-19: D1-D3 above.

## Recommended approval packet

Approve **D1=A, D2=A, D3=A**.


## Approved Packet

Nico approved all recommended options on 2026-06-19: **D1=A, D2=A, D3=A**.

No open Nico decision remains for FMX-138.

## Related

- [[../60-Research/determinism-portfolio-principle-2026-06-14]]
- [[../10-Architecture/09-Decisions/ADR-0113-portfolio-determinism-seeded-variance-principle]]
- [[../60-Research/determinism-and-replay]]
- [[../00-Index/Open-Decisions-Dossier]]
