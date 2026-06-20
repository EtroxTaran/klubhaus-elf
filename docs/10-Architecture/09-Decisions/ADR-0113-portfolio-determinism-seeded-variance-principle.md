---
title: ADR-0113 Portfolio Determinism and Seeded-Variance Principle
status: accepted
tags: [adr, architecture, determinism, rng, seeded-variance, replay, gameplay, match-engine, fmx-138, accepted]
context: ai-world-simulation
created: 2026-06-14
updated: 2026-06-19
type: adr
binding: true
amends:
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/determinism-portfolio-principle-2026-06-14]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../60-Research/raw-perplexity/raw-determinism-portfolio-simulation-architecture-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-determinism-portfolio-game-precedents-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-determinism-portfolio-realworld-football-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-determinism-portfolio-source-checks-2026-06-14]]
  - [[../../40-Execution/fmx-138-determinism-portfolio-principle-decision-queue-2026-06-14]]
  - [[ADR-0086-background-fast-matchday-cost-settlement]]
  - [[ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]
  - [[ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
  - [[ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
---

# ADR-0113: Portfolio Determinism and Seeded-Variance Principle

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


## Status

accepted

> **Decision gate.** This ADR is the non-binding FMX-138 proposal. It becomes
> binding only if Nico approves D1-D3 in
> [[../../40-Execution/fmx-138-determinism-portfolio-principle-decision-queue-2026-06-14]].
> Until then it is planning context and must not be implemented from.

## Date

- Drafted: 2026-06-14 (FMX-138)

## Context

FMX already has accepted deterministic replay foundations:

- [[../../60-Research/determinism-and-replay]] locks PRNG streams, replay
  inputs, event-log policy and save-determinism rules.
- [[ADR-0018-systemic-events-and-player-lifecycle]] §3 defines stream
  discipline: use the correct existing stream, allow future sub-labels, and do
  not draw from another subsystem's stream.
- [[ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]] binds
  replay-bearing computation to one deterministic Rust/WASM runtime and
  integer/fixed-point replay surfaces.

The missing rule is the portfolio default for the design axis itself:

- FMX-92 / [[ADR-0086-background-fast-matchday-cost-settlement]] chose bounded
  seeded cost variance.
- FMX-102 / [[ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]
  and [[../../50-Game-Design/GD-0036-transfer-escalation-and-inactivity-pressure]]
  chose bounded seeded transfer-escalation variance.
- M2 / [[ADR-0083-awards-honours-records-and-hall-of-fame-contract]] chose pure
  deterministic HoF induction for MVP.
- Other systems, such as loan quality, weather truth snapshots and discipline
  eligibility, use different local language around pure functions versus
  seeded variance.

Without a portfolio rule, every future gameplay beat must re-argue the same
axis. FMX-138 defines the default while preserving accepted local decisions.

## Decision options

### D1 - portfolio principle

| Option | Meaning | Assessment |
|---|---|---|
| **A. Variety surfaces seeded; projection/measurement/audit surfaces pure** | Use bounded seeded variance for player-perceived uncertainty and pure deterministic functions for measurements, rules, ledgers, projections and audit. | **Recommended.** Best matches football uncertainty, replay architecture and current FMX precedent. |
| B. Pure deterministic by default, seeded only by explicit exception | Every system starts pure unless a local ADR opts into variance. | Safer for audit but repeats current friction and over-determinizes lifelike football surfaces. |
| C. No portfolio rule | Keep deciding per system. | Reject; this is the current problem and creates avoidable decision churn. |

### D2 - open-system axis choices

| Option | Meaning | Assessment |
|---|---|---|
| **A. Seed match outcome variety, injury occurrence and AI-manager decisions** | Treat all three as player-perceived variety surfaces using existing streams/sub-labels. | **Recommended.** Preserves realism and replay; exact streams remain owner-specific. |
| B. Seed match and injury only; keep AI pure | AI decisions become fully deterministic policy. | Predictable AI risks long-save sameness and makes world behavior feel scripted. |
| C. Keep all three pure until local ADRs reopen them | Defers the axis. | Safe but leaves the portfolio principle toothless for the named future systems. |

### D3 - existing pure declarations

| Option | Meaning | Assessment |
|---|---|---|
| **A. Preserve accepted pure declarations; classify them** | Loan-quality, HoF MVP induction and discipline eligibility remain pure; weather generation remains seeded but locked truth is deterministic. | **Recommended.** Preserves vault governance without silently reopening ratified decisions. |
| B. Reopen all pure declarations that touch football uncertainty | Revisit HoF, loan quality, discipline and weather now. | Too broad for FMX-138 and risks churn without a concrete system need. |
| C. Reinterpret old decisions silently under the new principle | Treat prior pure wording as if it already meant seeded where convenient. | Reject; violates vault governance and decision traceability. |

## Decision

Accepted by Nico 2026-06-19.

Recommended approval packet: **D1=A, D2=A, D3=A**.

## Proposed rule

If accepted, FMX uses this default:

> **Use bounded seeded variance for player-perceived variety surfaces; use pure
> deterministic transforms for projection, measurement, rules, ledger and audit
> surfaces.**

Definitions:

- **Variety surface:** a domain moment where uncertainty is part of the
  football experience and different plausible outcomes improve long-save
  believability. Examples: match event resolution, injury occurrence,
  AI-manager decisions, transfer/agent borderline behavior, future weather
  generation and background cost realization.
- **Projection/measurement/audit surface:** a transform whose job is to explain,
  enforce, measure or account for known facts. Examples: standings projection,
  ledger posting, eligibility verdict, suspension availability, loan quality,
  HoF formula scoring, analytics forecasts and committed event read models.

## Invariants

| # | Invariant |
|---|---|
| **DV1** | No new top-level `*Rng` stream is introduced by this ADR. New seeded variance uses an existing locked stream with an owner-approved, versioned sub-label unless Nico explicitly approves a new stream. |
| **DV2** | Every seeded variety surface records or derives enough provenance to replay identically: stream/sub-label, version, seed derivation inputs and draw cursor/indices where needed. |
| **DV3** | Seeded variance is bounded and inside structural rails; it must not bypass hard invariants, state-machine guards, ledger balance, eligibility rules or no-P2W/fairness constraints. |
| **DV4** | Projection/measurement/audit surfaces are pure deterministic for a fixed input snapshot, model version and ruleset version. They may output probabilities, but they do not re-roll hidden randomness. |
| **DV5** | Existing accepted pure declarations are preserved unless a later Nico-approved ADR/GDDR explicitly reopens them. |
| **DV6** | Quick/background/full representations should share the same authoritative model or a documented quality-profile equivalence contract; they must not become separate sports. |
| **DV7** | Once code exists, every seeded variety surface needs fixed-seed golden replay coverage plus multi-seed distribution checks in its calibration slot. |

## Application matrix

| Surface | Classification | Handling |
|---|---|---|
| Match-engine event-resolution variety | Variety | Bounded seeded variance via `MatchCoreRng(matchId)` / `MatchAiRng(matchId)` under ADR-0096. |
| Injury occurrence and severity | Variety | Use `InjuryRng` for long-term risk and `MatchCoreRng(matchId)` for match-contact injury facts, per ADR-0018. |
| AI-manager decisions | Variety | Use `WorldAiMgmtRng` or an owning existing sub-label; decisions stay inside policy rails. |
| Future weather generation | Variety | Existing `WeatherRng`; locked `MatchWeatherSnapshot` remains deterministic. |
| Background-fast cost realization | Variety | Existing ADR-0086 seeded `WorldRng:venue:<clubId>:<week>:opcost:v1` precedent. |
| Transfer escalation borderline behavior | Variety | Existing ADR-0088 / GD-0036 bounded `TransferRng` precedent. |
| HoF induction formula | Projection/measurement | Keep pure deterministic for MVP per ADR-0083 and Open-Decisions-Dossier M2. |
| Loan quality | Projection/measurement | Keep pure deterministic over logged facts and fixed weights per ADR-0075. |
| Discipline eligibility/suspension availability | Rules/audit | Keep pure deterministic after Match/Regulations facts per ADR-0078. |
| Ledger postings | Audit | Pure deterministic and balanced; no hidden random draw in ledger writer. |
| Analytics forecasts | Projection | Pure deterministic for fixed input/model/version; probabilities describe uncertainty. |

## Consequences

Positive:

- Gives future gameplay issues one default rule and one vocabulary.
- Aligns Nico's existing seeded-variance choices with prior pure formula choices
  without flattening them.
- Keeps replay, save determinism and testing discipline intact.
- Makes "fun/variety" explicit without letting randomness leak into audit
  surfaces.

Negative / constraints:

- Each seeded surface needs more provenance and calibration.
- Some game-design recommendations remain source-informed inference rather than
  direct external facts; the ADR must name them as FMX design choices.
- Local owners still need concrete stream labels and parameter versions when
  implementing a system-specific contract.

## HITL gate

Accepted by Nico 2026-06-19 decisions:

- D1: adopt the portfolio rule?
- D2: classify match outcome variety, injury occurrence and AI-manager decisions
  as seeded-bounded variety surfaces?
- D3: preserve accepted pure declarations rather than reopening them now?

This ADR stays `draft` / `binding: false` until those are approved.

## Related Docs

- [[../../60-Research/determinism-portfolio-principle-2026-06-14]]
- [[../../60-Research/determinism-and-replay]]
- [[ADR-0018-systemic-events-and-player-lifecycle]]
- [[ADR-0086-background-fast-matchday-cost-settlement]]
- [[ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]
- [[ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
- [[ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
- [[../../40-Execution/fmx-138-determinism-portfolio-principle-decision-queue-2026-06-14]]
