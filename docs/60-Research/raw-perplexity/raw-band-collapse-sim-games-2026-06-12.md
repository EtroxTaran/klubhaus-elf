---
title: "Raw — Banded estimates vs exact booked finances in management sims (FMX-149)"
status: raw
tags: [research, raw, perplexity, game-design, football-manager, hattrick, anstoss, finance, determinism, fmx-149]
created: 2026-06-12
updated: 2026-06-12
type: research
binding: false
linear: FMX-149
related:
  - [[../moneyband-amountminor-collapse-rule-2026-06-12]]
---

# Raw capture — Sim-game banded estimates vs exact bookings (Perplexity, 2026-06-12)

Verbatim-faithful capture of the Perplexity strand on how sports/economy management games handle
banded estimates vs exact booked finances, for FMX-149 (ADR-0101 D2). Synthesis in
[[../moneyband-amountminor-collapse-rule-2026-06-12]].

## Prompt (summary)

Asked how Football Manager, Anstoss, Hattrick, FIFA/EA-FC career mode and economy sims handle
uncertain financial estimates shown as ranges vs the exact amounts booked: (1) banded display over
exact internals?; (2) seeded randomness for replayable finances?; (3) design rationale for
range-display/exact-booking; (4) community/modding evidence of finance determinism.

## Key findings (faithful condensation)

### (1) Banded display, exact internals — universal pattern

- All examined titles compute **exact internal values** for every finance line and book exact
  numbers; the UI range is an **imperfect-information overlay** (internal value ± margin), with
  margin width driven by scouting/staff/data quality. Ranges are never the stored truth.
- Exact values come from **deterministic base formulas** (reputation, ticket price, competition
  importance, capacity, …) with a **bounded pseudo-random factor** layered on top (e.g.
  `actual = base × (1 + ε)`, ε small and bounded).

### (2) Seeded randomness / replayability

- Internally all titles rely on **deterministic PRNGs with seeds**; identical state + identical
  action sequence reproduces identical finances. FM saves include PRNG state; diverging actions
  diverge the stream.
- Hattrick: the peer-reviewed decoding study ("Decoding the mechanisms of the Hattrick football
  manager game", 2024, ScienceDirect/arXiv 2504.09499) shows outcomes are explained with high
  accuracy from ratings/tactics — a **highly deterministic core with small bounded randomness**
  (less uncertain than real football). Community "Hattrick economists" fit ticket-income/attendance
  formulas from exact income lines — impossible if only bands were stored.

### (3) Design rationale for band-display + exact booking

- **Information asymmetry / realism:** real clubs forecast, they don't know; bands prevent
  risk-free spreadsheet-perfect optimization.
- **Staff quality as a gameplay lever:** better scouts/analysts → tighter bands; rewards
  investment in backroom infrastructure with **better information**, not stat boosts.
- **UX smoothing / difficulty tuning:** bands absorb small fluctuations; designers tune band width
  without touching the economic model. Bounded variance keeps the player's *perceived* uncertainty
  satisfying even though the engine is rigid.

### (4) Community/modding evidence

- FM: editor + third-party tools expose sponsorship/TV/prize values as concrete numeric fields;
  finance screens show exact line items; guides treat the economy as deterministic levers.
- FIFA/EA FC: prize/TV/wage tables extracted by modders are fixed numbers; randomness confined to
  negotiation/attendance variance.
- Anstoss: fan-decoded deterministic formulas with seasonal/random noise from logged
  attendance/income series.

## Sources cited by Perplexity

- https://www.sciencedirect.com/science/article/pii/S1875952126000534 (Hattrick decoding study)
- https://arxiv.org/pdf/2504.09499
- https://m.hattrick.org (manual/community baseline)
- Community/modding evidence characterized in-answer (FM finance guides, editor field structure)
