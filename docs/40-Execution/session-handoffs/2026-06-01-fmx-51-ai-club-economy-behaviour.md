---
title: Handoff FMX-51 AI Club Economy Behaviour
status: wrapped
tags: [meta, execution, handoff, economy, ai, ai-clubs, world-simulation, fmx-51]
created: 2026-06-01
updated: 2026-06-01
type: handoff
related:
  - [[../../60-Research/ai-club-economy-behaviour-2026-06-01]]
  - [[../../60-Research/raw-perplexity/raw-ai-club-economy-behaviour-2026-06-01]]
  - [[../../50-Game-Design/GD-0023-ai-club-economy-behaviour]]
  - [[../../50-Game-Design/GD-0010-ai-world]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../60-Research/ai-manager-behaviour]]
  - [[../../60-Research/transfer-market-simulation]]
  - [[../../60-Research/top5-country-economy-profiles-2026-05-29]]
---

# Handoff: FMX-51 AI Club Economy Behaviour (2026-06-01)

## Linear

- Issue: FMX-51 — Research AI club economy behaviour
  (`type:research`, `type:game-design`, `needs:nico-decision`, `area:squad-club`, Medium).
- Branch: `claude/fmx-51-research-ai-club-economy-behaviour` (off `main` after
  FMX-50 #109 merged).
- Selection note: FMX-49 (financing tools) was already In Progress/picked by another
  agent, so this beat took the next Todo. FMX-51 is the next *buildable* economy beat;
  FMX-52 (calibration/soak-test) is the capstone that consumes FMX-49 + FMX-51.

## Done this session

- Ran 4 grounded Perplexity passes (genre AI-club economy mechanics; real-club
  financial archetypes + ratio bands + event reactions; AI architecture / anti-runaway
  / anti-zombie / inflation control / soak-test patterns; per-country regulatory
  rails). Sources preserved in the raw transcript.
- New research synthesis
  [[../../60-Research/ai-club-economy-behaviour-2026-06-01]] + raw transcript.
- **New draft GDDR GD-0023** AI Club Economy Behaviour (`status: draft`,
  `binding: false`).
- Wired hooks: GD-0022 (FMX-51 hooks now consumed), GD-0010 (economy slice of
  R2-04/R2-06 resolved by GD-0023).
- Indexes: Current-State banner, Research-Map (section + raw entry), Game Design Log
  (GD-0023 row), 60-Research/00-summary, raw-perplexity/README.

## Key proposed direction (composition, not new machinery)

- **Compose** the locked AI architecture ([[../../60-Research/ai-manager-behaviour]]:
  utility-AI + FSM + heuristics, no AI stat cheats) and transfer tiering
  ([[../../60-Research/transfer-market-simulation]]) with a thin **financial-policy
  layer** (five archetypes: selling / sugar-daddy / prudent / over-leveraged / yo-yo)
  modulated by board ambition + patience and the `CountryEconomyProfile`.
- **Three financial regimes** (`Healthy / Stressed / Distressed`) gate utility-ranked
  actions; hierarchical cadence (cheap weekly regime check; per-season / event
  re-budget) within the locked out-of-match per-club budget.
- **Soft, diegetic homeostasis only — no AI stat cheats**: progressive costs,
  revenue-indexed wage caps, reference pricing, solidarity/parachute pools, ROI decay,
  hard survival floor, PI-controller mean-reversion, applied identically to player & AI.
- **Staged distress with rare, bounded insolvency** down the existing insolvency FSM,
  with per-country distress personalities (England auto points-deduction +
  football-creditor; Germany preventive licensing + 50+1; Spain revenue-linked cap;
  France DNCG; Italy phoenix restart).
- **Tiered fidelity** (Tier 0 full + active commercial choices via FMX-44/47 hooks;
  Tier 1 simplified; Tier 2-3 banded) + **structured rationale tags** (narration
  deferred to ADR-0054).
- AI clubs are **consumers** of the commercial system; Club Management stays sole
  ledger writer (ADR-0050); AI owner support is **in-fiction** (equity/soft loan),
  never the singleplayer Investor.

## Open / next step (Nico-gated; defaults applied in the research note)

- Archetype-to-club assignment (generated vs authored vs hybrid).
- Insolvency-frequency band, homeostasis aggressiveness (both → FMX-52 calibration).
- Rationale-tag vocabulary; Tier 0 commercial-choice breadth.
- Whether GD-0023 absorbs vs links GD-0010 R2-04/R2-06 (default: owns economy slice).
- AI owner-support availability / gating (e.g. under 50+1).
- Next economy Todos: FMX-52 (calibration & soak-test capstone — consumes FMX-49 debt
  + FMX-51 AI behaviour).

## Blockers

- None for the research/planning beat. No decision ratified — GD-0023 stays `draft`;
  no ADR changed (fits accepted ADR-0050/0051/0058 + locked ai-manager-behaviour /
  transfer-market research). All ratio bands and damper gains are calibration inputs
  for FMX-52.

## Changed vault paths

- `docs/60-Research/ai-club-economy-behaviour-2026-06-01.md` (new)
- `docs/60-Research/raw-perplexity/raw-ai-club-economy-behaviour-2026-06-01.md` (new)
- `docs/50-Game-Design/GD-0023-ai-club-economy-behaviour.md` (new)
- `docs/40-Execution/session-handoffs/2026-06-01-fmx-51-ai-club-economy-behaviour.md` (new)
- `docs/50-Game-Design/GD-0022-economy-commercial-impact-and-contracts.md` (hook note)
- `docs/50-Game-Design/GD-0010-ai-world.md` (R2-04/R2-06 economy-slice note)
- `docs/50-Game-Design/README.md` (GD-0023 row)
- `docs/00-Index/Current-State.md` (FMX-51 banner)
- `docs/00-Index/Research-Map.md` (section + raw entry)
- `docs/60-Research/00-summary.md` (FMX-51 section)
- `docs/60-Research/raw-perplexity/README.md` (FMX-51 row)
