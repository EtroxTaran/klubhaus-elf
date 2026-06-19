---
title: FMX-141 Gameplay calibration decision queue
status: accepted
tags: [execution, decision-queue, gameplay, calibration, pending, fmx-141, accepted]
created: 2026-06-13
updated: 2026-06-19
type: decision-queue
binding: true
linear: FMX-141
related:
  - [[../60-Research/gameplay-calibration-ownership-and-harness-2026-06-13]]
  - [[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
  - [[../30-Implementation/economy-calibration-and-soak-test-runbook]]
---

# FMX-141 Gameplay calibration decision queue

> **APPROVED on 2026-06-19.** Nico approved all recommended options via
> `APPROVE ALL RECOMMENDED`. This note is now the accepted decision
> record; no open Nico decision remains for FMX-141.


This is the HITL queue for FMX-141. It turns the research synthesis and draft
GD-0043 into explicit Nico decisions before gameplay-wide calibration can become
binding.

## D1 - calibration ownership scope

| Option | Meaning | Assessment |
|---|---|---|
| **A. Gameplay-wide calibration umbrella plus economy-specific runbook** | Economy stays in FMX-52; non-economy gameplay slots point to GD-0043 and the gameplay runbook. | **Recommended.** Fixes the ownership ambiguity without rewriting the economy gate. |
| B. Keep FMX-52 as all calibration owner | Every gameplay magnitude remains tied to the economy runbook. | Reject. It hides owners/metrics for non-economy systems. |
| C. One runbook per GDDR | Every GDDR gets its own calibration runbook. | Too fragmented for this phase. |

**Recommendation:** A.

## D2 - canonical slot taxonomy

| Option | Meaning | Assessment |
|---|---|---|
| **A. Adopt the 14-slot taxonomy in GD-0043** | Match core, live control, live intervention, set pieces, tactical identity, weather/pitch, persona labels, dialogue, media, transfer escalation, world drift, dynasty, legacy/HoF, national team. | **Recommended.** Mirrors current GDDR/ADR boundaries and keeps metrics inspectable. |
| B. Merge to 5 coarse slots | Match, people/narrative, economy, world/dynasty, legacy. | Less bureaucracy, but weak owner/metric clarity. |
| C. Defer taxonomy | Keep old generic calibration debt until implementation. | Reject. It fails FMX-141 acceptance. |

**Recommendation:** A.

## D3 - harness tier model

| Option | Meaning | Assessment |
|---|---|---|
| **A. T0-T4 tier model** | Exact replay, scenario smoke, Monte Carlo envelope, long-horizon soak, playtest telemetry. | **Recommended.** Separates debugging from acceptance and future telemetry. |
| B. Deterministic tests only | Fixed seed tests carry all acceptance. | Reject. Overfits seeds and cannot validate distributions. |
| C. Telemetry/playtest first | Tune mainly by feel once playable. | Useful later but not enough for deterministic simulation governance. |

**Recommendation:** A.

## D4 - baseline/rebaseline authority

| Option | Meaning | Assessment |
|---|---|---|
| **A. Nico owns baseline authority until explicitly delegated** | Slot owners propose; baseline/rebaseline requires evidence and approval. | **Recommended.** Matches current governance and prevents silent balance drift. |
| B. Slot owner may rebaseline after green tests | Faster iteration. | Risky before the first implementation and calibration council exist. |
| C. Any PR can update baselines if docs-check passes | Reject. | Destroys trust in the gate. |

**Recommendation:** A.

## D5 - realism-vs-fun tolerance philosophy

| Option | Meaning | Assessment |
|---|---|---|
| **A. Realism-anchored, fun/perception overrides documented** | Use real data where available; allow deviations for player feel only with explicit rationale and approval. | **Recommended.** Best balance of simulation credibility and game feel. |
| B. Strict realism first | Real-world distributions always win. | Risks a game that is technically realistic but unfun or unreadable. |
| C. Feel-first | Tune primarily by player perception. | Too easy to lose simulation credibility and deterministic explainability. |

**Recommendation:** A.

## Decision record

- 2026-06-13: FMX-141 claimed and moved to `In Progress`.
- 2026-06-13: Perplexity research saved for simulation precedents, stochastic
  harness design, domain slots and source checks.
- 2026-06-13: Draft
  [[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate|GD-0043]]
  and
  [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]] prepared.
- Accepted by Nico 2026-06-19: D1-D5 above.

## Recommended approval packet

Approve **D1=A, D2=A, D3=A, D4=A, D5=A**.
## Approved Packet

Nico approved all recommended options on 2026-06-19: **D1=A, D2=A, D3=A, D4=A, D5=A**.

No open Nico decision remains for FMX-141.
