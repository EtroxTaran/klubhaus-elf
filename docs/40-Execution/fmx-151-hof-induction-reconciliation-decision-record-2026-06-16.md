---
title: FMX-151 HoF Induction Reconciliation Decision Record
status: current
tags: [execution, decision-record, hall-of-fame, determinism, seeded-variance, fmx-151]
created: 2026-06-16
updated: 2026-06-16
type: execution
binding: false
linear: FMX-151
related:
  - [[../60-Research/hof-induction-voting-reconciliation-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
  - [[../50-Game-Design/GD-0032-awards-honours-records-and-hall-of-fame]]
  - [[decision-queue-2026-06-08-ratified]]
  - [[../00-Index/Open-Decisions-Dossier]]
---

# FMX-151 HoF Induction Reconciliation Decision Record

## Context

Linear FMX-151 still described the Hall-of-Fame induction RNG question as live,
but the vault already contains the later decision trail:

- [[decision-queue-2026-06-08-ratified]] decided ADR-0083 scope call A:
  pure deterministic HoF induction in MVP, with a future existing-stream
  sub-label seam if seeded voting is reopened later.
- [[../00-Index/Open-Decisions-Dossier]] mini point M2 records the same current
  truth.
- FMX-138/ADR-0113 remains a draft portfolio principle and must not silently
  reopen accepted pure declarations.

## Nico Decision

2026-06-16: Nico selected **Reconcile FMX-151** from the live triage options.
That confirms the issue should close stale Linear/vault wording against the
already-ratified June 8 HoF choice instead of reopening a fresh stochastic-vs-pure
decision packet.

## Result

| Decision | Outcome |
|---|---|
| MVP in-world HoF induction | Pure deterministic formula. |
| MVP voting surface | Deterministic presentation flavor over the formula output. |
| Active RNG stream | None. No `LegacyRng`, no `HoFRng`, no active seeded voting layer. |
| Future stochastic voting | Requires a fresh Nico decision and must use a sub-label under an existing owner stream. |
| Calibration | All weights, thresholds, caps, era coefficients and eligibility windows remain GD-0043 `legacy.hof` calibration debt. |

## Follow-ups

- No architecture follow-up is needed for FMX-151.
- Future code-phase work must keep the HoF deterministic replay tests aligned
  with ADR-0083 HF3-HF10 and GD-0043 `legacy.hof`.

## Related

- [[../60-Research/hof-induction-voting-reconciliation-2026-06-16]]
- [[../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
- [[../50-Game-Design/GD-0032-awards-honours-records-and-hall-of-fame]]
