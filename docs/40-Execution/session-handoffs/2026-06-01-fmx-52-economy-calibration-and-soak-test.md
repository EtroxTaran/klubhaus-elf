---
title: Handoff FMX-52 Economy Calibration and Soak-Test Scenarios
status: wrapped
tags: [meta, execution, handoff, economy, calibration, soak-test, stress-test, fmx-52]
created: 2026-06-01
updated: 2026-06-01
type: handoff
related:
  - [[../../60-Research/economy-calibration-and-soak-test-scenarios-2026-06-01]]
  - [[../../60-Research/raw-perplexity/raw-economy-calibration-and-soak-test-scenarios-2026-06-01]]
  - [[../../30-Implementation/economy-calibration-and-soak-test-runbook]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../60-Research/ai-club-economy-behaviour-2026-06-01]]
  - [[../../60-Research/top5-country-economy-profiles-2026-05-29]]
  - [[../../60-Research/club-financing-tools-2026-06-01]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../60-Research/pre-mortem/PM-2026-05-20-16-test-strategy-depth]]
---

# Handoff: FMX-52 Economy Calibration and Soak-Test Scenarios (2026-06-01)

## Linear

- Issue: FMX-52 — Define economy calibration and soak-test scenarios
  (`type:research`, `type:game-design`, `needs:nico-decision`, `area:squad-club`, High;
  project "Phase 1 — Research & Architecture"). Related to FMX-13 + FMX-41.
- Branch: `fmx-52-define-economy-calibration-and-soak-test-scenarios` (off `main` after
  FMX-51 #112 merged).
- The calibration/soak capstone that consumes FMX-13 (ledger/insolvency), FMX-41
  (commercial impact), FMX-49 (financing), FMX-51 (AI archetypes/dampers) and FMX-53
  (country profiles). It documents the calibration **workflow**, not final constants.

## Done this session

- Ran 3 grounded Perplexity passes (simulation balancing & long-run economy testing;
  financial stress-testing & scenario/reverse-stress analysis; deterministic-sim testing
  techniques + attendance/fan-demand elasticity). Sources preserved in the raw transcript.
- New research synthesis
  [[../../60-Research/economy-calibration-and-soak-test-scenarios-2026-06-01]] + raw
  transcript.
- New draft runbook
  [[../../30-Implementation/economy-calibration-and-soak-test-runbook]] (fixtures, seeds,
  harness contract, invariants/metamorphic relations, golden baseline + drift detection,
  parameter/scenario sheets, acceptance flow).
- Cross-linked [[../../50-Game-Design/economy-system]] §12 (calibration rules) + frontmatter.
- Indexes: Current-State FMX-52 block + frontmatter, Research-Map (section + raw entry),
  Implementation-Map (runbook entry), 60-Research/00-summary, raw-perplexity/README.

## Key proposed direction (method, not constants)

- **Evidence-acceptance gate**: a constant is accepted only when it sits in its
  evidence-justified band, soak KPIs stay healthy at the value **and** at the band edges,
  no scenario verdict flips under a ± sensitivity sweep, and a parameter sheet is filled —
  then Nico sign-off promotes the affected design note draft → approved.
- **KPI bands** (research-anchored; shifted per tier/country profile): wage/revenue
  <60/60–75/>75–80; squad-cost <70/70–85/>85 (UEFA 70 line); debt/revenue
  <0.6×/0.6–1.0×/>1.0–1.5×; runway >26/8–26/<8 wk; DSCR >1.25/1.0–1.25/<1.0.
- **Insolvency**: tier-scaled per decade (top ~2–5% / mid ~8–15% / lowest ~15–25% reach
  administration) + **no-cascade** invariant (anti-zombie floor + austerity; bounded
  recovery).
- **Anti-runaway**: title HHI + CR4 (rolling 10y/30y), max single-club title share
  <~25–30%/30y, revenue Gini 0.35–0.50 sanity bound.
- **Soak**: 32-seed PR smoke + 50-season nightly gate + 100-season deep soak; golden
  baseline + control charts / Mahalanobis / KS drift detection (extends PM-2026-05-20-16).
- **Scenarios**: deterministic forward matrix mapped to the scope list **plus** reverse
  stress testing per archetype; shock-magnitude priors banded.
- **Forecast validation**: Quick band/sign, Standard ~±10–15%, Expert ~±5% vs realized
  ledger; "false-comfort" failure signature.

## Open / next step (Nico-gated; defaults applied in the notes)

- Final constants (by design — accepted later via the gate + sign-off).
- Exact per-tier insolvency percentages; homeostasis aggressiveness (PI gains / soft-cap
  slopes / wage-growth caps, carried from FMX-51); forecast tolerance exact %; exact
  concentration window/threshold.
- Whether FMX-53 country profiles get promoted to a draft ADR (carried from FMX-53; out of
  FMX-52 scope, flagged).

## Blockers

- None for the research/planning beat. No decision ratified — both new notes stay `draft`;
  no ADR/GDDR changed (fits accepted ADR-0050/0058; constants stay in data per
  economy-system §12). All bands are calibration inputs.

## Changed vault paths

- `docs/60-Research/economy-calibration-and-soak-test-scenarios-2026-06-01.md` (new)
- `docs/60-Research/raw-perplexity/raw-economy-calibration-and-soak-test-scenarios-2026-06-01.md` (new)
- `docs/30-Implementation/economy-calibration-and-soak-test-runbook.md` (new)
- `docs/40-Execution/session-handoffs/2026-06-01-fmx-52-economy-calibration-and-soak-test.md` (new)
- `docs/50-Game-Design/economy-system.md` (§12 cross-link + frontmatter)
- `docs/00-Index/Current-State.md` (FMX-52 block + frontmatter)
- `docs/00-Index/Research-Map.md` (section + raw entry)
- `docs/00-Index/Implementation-Map.md` (runbook entry)
- `docs/60-Research/00-summary.md` (FMX-52 section)
- `docs/60-Research/raw-perplexity/README.md` (FMX-52 row)
