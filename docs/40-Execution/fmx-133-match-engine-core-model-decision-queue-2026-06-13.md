---
title: FMX-133 Match-engine core model decision queue
status: current
tags: [execution, decision-queue, match-engine, calibration, pending, fmx-133]
created: 2026-06-13
updated: 2026-06-13
type: decision-queue
binding: false
linear: FMX-133
related:
  - [[../60-Research/match-engine-core-model-2026-06-13]]
  - [[../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]
  - [[../50-Game-Design/GD-0002-match-engine]]
  - [[../50-Game-Design/match-engine]]
  - [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
---

# FMX-133 Match-engine core model decision queue

This is the HITL decision queue for FMX-133. It turns
[[../60-Research/match-engine-core-model-2026-06-13]] into explicit Nico decisions
before [[../50-Game-Design/GD-0042-match-engine-core-model-and-calibration|GD-0042]]
can become binding or supersede GD-0002's open gates.

## D1 - action utility architecture

| Option | Meaning | Assessment |
|---|---|---|
| **A. Hybrid event-chain + EPV/xT utility + attribute outcome contests** | Event-chain proposes plausible actions; xT/EPV-style state value ranks them; logistic/weighted attribute contests resolve outcomes. | **Recommended.** Best balance of realism, explainability, determinism and tuneability. |
| B. Weighted contests only | Every event is mostly attribute-vs-attribute with tactical multipliers. | Simpler, but weak tactical causality and poor non-shot action value. |
| C. Black-box/data-fitted model | Learn action choice/outcomes from data-heavy models. | Too opaque and data-dependent for the docs-only pre-implementation phase. |

**Recommendation:** A.

## D2 - xG / EPV scope

| Option | Meaning | Assessment |
|---|---|---|
| **A. Transparent shot xG + coarse possession-value grid** | xG for shots; xT/EPV-like grid for action value; pressure/pitch-control proxies adjust both. | **Recommended.** Realistic enough for MVP and explainable to players. |
| B. xG-only MVP | Use xG for shots but simpler heuristics for non-shot choices. | Acceptable fallback, but leaves tactics/progression choices too heuristic. |
| C. Full tracking-style EPV/pitch control | Build a rich spatiotemporal value model immediately. | Too heavy before implementation/data exists. Keep as future refinement. |

**Recommendation:** A.

## D3 - statistical target envelopes

| Option | Meaning | Assessment |
|---|---|---|
| **A. Adopt broad v1 top-tier envelopes now** | Goals, shots, xG, cards, possession, PPDA and injuries get target bands for calibration. | **Recommended.** Gives implementation a measurable realism gate without overfitting one league. |
| B. Exact league templates now | Separate German/English/French/Italian/Spanish envelopes before engine work. | Useful later, but premature and source-maintenance heavy. |
| C. Defer envelopes to playtest only | Tune after the first engine exists. | Reject. Leaves FMX-133's Linear gate unresolved. |

**Recommendation:** A.

## D4 - quality-profile spatial density

| Option | Meaning | Assessment |
|---|---|---|
| **A. Event anchors + profile-specific sample rates** | `competitive-full`: event anchors + 1 Hz state samples + phase-boundary samples. `interactive-standard`: event anchors + 0.33 Hz state samples + phase-boundary samples. Background profiles are not renderable by default. | **Recommended.** Meets ADR-0026 renderability while keeping background cost bounded. |
| B. Full 1 Hz sampling for all profiles | Every profile keeps renderable spatial samples. | Too expensive and contradicts background-fast purpose. |
| C. Event anchors only for interactive profiles | No periodic state samples. | Cheaper, but weak for heatmaps/running-distance/shape analytics. |

**Recommendation:** A.

## D5 - calibration harness

| Option | Meaning | Assessment |
|---|---|---|
| **A. Tiered harness: golden replay + seed sweeps + envelopes + compatibility soak** | Exact replay for byte-identical profiles, statistical sweeps for calibration and background-fast compatibility. | **Recommended.** Matches deterministic probabilistic simulator practice. |
| B. Manual balance only | Tune by eye/playtest. | Reject. Cannot prove compatibility or regression safety. |
| C. Full data-science pipeline before engine implementation | Build production-grade calibration first. | Too much upfront; reserve advanced model fitting for later. |

**Recommendation:** A.

## D6 - numeric representation gate handling

| Option | Meaning | Assessment |
|---|---|---|
| **A. Treat numeric representation as already closed by ADR-0096** | FMX-133 references mandatory integer/fixed-point replay-bearing math and does not reopen runtime choice. | **Recommended.** Preserves the accepted architecture decision. |
| B. Reopen fixed-point vs quantized-float here | Make FMX-133 choose numeric representation again. | Reject. Would conflict with ADR-0096 and re-create the closed FMX-135 fork. |
| C. Leave numeric representation unmentioned | Avoids conflict but leaves GD-0002's open gate stale. | Not enough; the open gate needs an explicit closure pointer. |

**Recommendation:** A.

## Decision record

- 2026-06-13: FMX-133 claimed and moved to `In Progress`.
- 2026-06-13: Perplexity research saved for real-world envelopes, action utility,
  game precedents and calibration harness.
- 2026-06-13: Source-check note added because Perplexity citations were useful
  but uneven.
- 2026-06-13: Draft [[../50-Game-Design/GD-0042-match-engine-core-model-and-calibration|GD-0042]]
  prepared as the non-binding proposed closure packet.
- Pending Nico: D1-D6 above.

## Recommended approval packet

Approve **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A**.

