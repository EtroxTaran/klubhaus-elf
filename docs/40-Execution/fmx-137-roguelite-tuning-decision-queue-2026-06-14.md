---
title: FMX-137 Roguelite tuning decision queue
status: current
tags: [execution, decision-queue, roguelite, run-end, carry-slots, accepted, fmx-137]
created: 2026-06-14
updated: 2026-06-14
type: decision-queue
binding: false
linear: FMX-137
related:
  - [[../60-Research/roguelite-run-end-and-carry-economy-tuning-2026-06-14]]
  - [[../60-Research/raw-perplexity/raw-roguelite-run-end-thresholds-2026-06-14]]
  - [[../60-Research/raw-perplexity/raw-roguelite-comparable-games-2026-06-14]]
  - [[../60-Research/raw-perplexity/raw-roguelite-meta-progression-best-practices-2026-06-14]]
  - [[../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]]
  - [[../50-Game-Design/mode-create-a-club-roguelite]]
---

# FMX-137 Roguelite tuning decision queue

This queue records the HITL decisions for FMX-137. It exists even though the
packet is approved, because the issue required the research and decision chain
to be saved.

## D1 - run-end model

| Option | Meaning | Assessment |
|---|---|---|
| **A. Staged ladder and licence-review gate** | Liquidity stress opens warning/recovery/licence review; hard run-end arrives after unresolved licence loss, administration/liquidation route or board control loss. | **Approved. Recommended.** Best fit to real football and existing FMX staged insolvency. |
| B. Immediate run-end at liquidity below zero | Any month-end negative cash ends the run. | Too punitive and less realistic. |
| C. No hard financial run-end | Finance only creates penalties; the save keeps going. | Genre-sim friendly, but too weak for roguelite stakes. |

**Decision:** A.

## D2 - liquidity grace default

| Option | Meaning | Assessment |
|---|---|---|
| **A. Two consecutive unresolved month-end failures** | After buffers and rescue levers are exhausted, two consecutive failed month-end liquidity/licence checks trigger licence loss/run-end. | **Approved. Recommended.** Readable, tense and consistent with the previous unresolved value. |
| B. Difficulty/tier-scaled months | Lower tiers get more or fewer months by profile. | Useful later, but less clear as an MVP product default. |
| C. Playtest-only placeholder | Do not set an explicit default yet. | Fails FMX-137 acceptance; leaves the old unresolved wording. |

**Decision:** A.

## D3 - board control loss

| Option | Meaning | Assessment |
|---|---|---|
| **A. Two failed seasons through GD-0030 `last_chance` failure** | Repeated under-delivery pushes board confidence to last chance; failing that last chance after two season-level misses ends the run. | **Approved. Recommended.** Uses existing board context and avoids a raw counter. |
| B. Raw two-season failure count | Any two consecutive failed seasons end the run. | Simple, but bypasses expectations, recovery meetings and owner patience. |
| C. One-season harsh loss | One failed season can end the run. | Too volatile for first-playable trust. |

**Decision:** A.

## D4 - carry-slot economy

| Option | Meaning | Assessment |
|---|---|---|
| **A. Logarithmic/capped functional slots** | Start with one slot; grow by completed-season milestones to max three functional slots; after cap, unlock option pools, cosmetics and challenge variants. | **Approved. Recommended.** Preserves stakes while rewarding persistence. |
| B. Linear unbounded 1 slot per ~50 seasons | Keep the old sketch. | Too slow early and unsafe over long meta progression. |
| C. Fixed one slot forever | Safest balance, but weak long-run progression payoff. | Too flat for a roguelite loop. |

**Decision:** A.

## D5 - async kit/cosmetic visibility

| Option | Meaning | Assessment |
|---|---|---|
| **A. Light feat-bound cosmetic visibility** | Achievement kit patterns can be visible in async groups as mechanically inert, fiction-safe badges. | **Approved. Recommended.** Social proof without power. |
| B. Local-only cosmetics | Unlocks are visible only to the player. | Safest, but loses a low-risk async identity payoff. |
| C. Full social showcase now | Rich public display and comparison surfaces. | Too much privacy/no-P2W/group-governance surface for this issue. |

**Decision:** A.

## D6 - manager-archetype taxonomy

| Option | Meaning | Assessment |
|---|---|---|
| **A. Defer final names/thresholds; signal-first policy** | Save run facts and style signals; author candidate families later and validate/rename with playtests. | **Approved. Recommended.** Matches GD-0019 and ADR-0082. |
| B. Provisional taxonomy now | Name and threshold archetypes in this issue. | Overfits too early and contradicts hooks-only MVP posture. |
| C. Pure data-mining later | No authored taxonomy; discover clusters only from data. | Too unstable and weak for authored game design. |

**Decision:** A.

## Decision record

- 2026-06-14: FMX-137 claimed and moved to `In Progress`.
- 2026-06-14: Perplexity research saved for real-world football failure
  precedent, comparable game precedent and roguelite meta-progression practice.
- 2026-06-14: Nico approved the recommended D1-D6 packet by instructing
  implementation of the proposed plan.
- 2026-06-14: Accepted
  [[../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning|GD-0044]]
  authored and mode/index notes updated.

## Approved packet

Approve and apply **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A**.
