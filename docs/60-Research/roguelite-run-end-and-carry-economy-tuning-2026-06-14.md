---
title: "Roguelite run-end and carry-economy tuning (FMX-137)"
status: current
tags: [research, synthesis, roguelite, run-end, insolvency, board, carry-slots, meta-progression, fmx-137]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-137
related:
  - [[raw-perplexity/raw-roguelite-run-end-thresholds-2026-06-14]]
  - [[raw-perplexity/raw-roguelite-comparable-games-2026-06-14]]
  - [[raw-perplexity/raw-roguelite-meta-progression-best-practices-2026-06-14]]
  - [[../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]]
  - [[../50-Game-Design/mode-create-a-club-roguelite]]
  - [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../50-Game-Design/GD-0030-dynasty-board-and-ownership]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/economy-system]]
  - [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
  - [[../40-Execution/fmx-137-roguelite-tuning-decision-queue-2026-06-14]]
---

# Roguelite run-end and carry-economy tuning (FMX-137)

## Scope

FMX-137 resolves the old open knobs in
[[../50-Game-Design/mode-create-a-club-roguelite]] §11:

- how long a club can sit in unresolved liquidity/licence failure before a
  roguelite run ends;
- how board-control loss maps to failed seasons and the GD-0030 confidence
  ladder;
- how carry slots grow across runs;
- whether achievement kit patterns can be visible in async groups;
- whether manager-archetype taxonomy/thresholds are locked now.

The synthesis is implemented in accepted
[[../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]] and recorded in
the decision queue
[[../40-Execution/fmx-137-roguelite-tuning-decision-queue-2026-06-14]].

## Existing FMX constraints

| Existing record | Constraint for FMX-137 |
|---|---|
| [[../50-Game-Design/GD-0008-finance-economy]] / [[../50-Game-Design/economy-system]] | Insolvency is staged; negative cash should create warning, overdraft, restrictions, arrears, licence review and finally run end/control loss. |
| [[../50-Game-Design/GD-0030-dynasty-board-and-ownership]] | Board confidence already has `confident -> concerned -> under_review -> vote_of_confidence -> last_chance -> sacked`; `sacked` ends the run and feeds Manager & Legacy. |
| [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]] | MVP ships hooks, not final archetype taxonomy or full meta perks; progression should not become a grind checklist. |
| [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]] | No MVP soft perk affects starting finance; future start-finance perks need prestige, caps, challenge counterweights and a fresh Nico decision. |
| [[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]] | Draft only, but useful as the future calibration handoff for non-economy thresholds; economy monetary bands still have their own economy calibration path. |

## Evidence synthesis

| Research strand | What it supports | Confidence |
|---|---|---|
| Real football financial distress and regulation | Use a staged distress/licence ladder; liquidity below zero is a warning/gate, not instant club death. | Medium-high for design direction; exact rules vary by country/tier. |
| Football-manager and sports-sim precedent | Board and finance pressure should be visible and slow-feedback; traditional sims usually continue saves after sacking, so FMX must explicitly adapt this to roguelite run loss. | Medium; many sources are community/secondary. |
| Roguelite meta-progression practice | Prefer option variety, cosmetics, post-run learning and capped/diminishing functional carries over raw permanent power. | Medium-high for genre design direction. |
| Existing FMX GDDRs/ADRs | Hooks-only archetypes, no start-finance perk in MVP, staged insolvency and GD-0030 board ladder already constrain the answer. | Project-binding. |

## Recommended and approved packet

Nico approved the recommended D1-D6 packet by instructing implementation of the
proposed plan on 2026-06-14. The accepted decision record is
[[../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]].

| Axis | Decision | Why |
|---|---|---|
| D1 run-end model | Staged ladder and licence-review gate. | Realistic, readable and consistent with GD-0008/GD-0030. |
| D2 liquidity grace default | Two consecutive unresolved month-end liquidity/licence failures after buffers/rescue levers are exhausted. | Clear MVP default; avoids instant failure while keeping pressure. |
| D3 board control loss | Two failed seasons only through GD-0030's board-confidence `last_chance` failure. | Stops raw season counts from bypassing board context. |
| D4 carry-slot economy | One starting functional carry slot; capped logarithmic growth to max three functional slots by completed-season milestones; after cap, unlock options/cosmetics/challenges. | Preserves stakes and avoids power creep. |
| D5 async kit/cosmetic visibility | Yes, lightly badged and cosmetic-only for achievement kit patterns. | Social proof without mechanical advantage. |
| D6 archetype taxonomy | Defer names/thresholds; keep signal-first, authored-then-playtest-validated policy. | Consistent with GD-0019 and ADR-0082. |

## Product rules carried into GD-0044

- A run should fail from **loss of control**, not from the first bad forecast:
  insolvency/licence loss and board sacking are the two normal hard gates.
- The default liquidity rule is a readable product threshold:
  **two consecutive unresolved month-end failures** after overdraft, financing,
  restructuring, board support and emergency-sale levers are unavailable or
  rejected. Exact monetary values remain calibration/profile data.
- Board loss means GD-0030 reaches `last_chance` and fails after repeated
  season-level under-delivery. A raw "N seasons" counter alone is not a run-end
  authority.
- Carry slots are scarce. They should create founding trade-offs and expressive
  identity, not replace club-building inside the run.
- Achievement kit patterns can be shown in async groups only as mechanically
  inert, fiction-safe identity signals. They cannot imply paid or competitive
  advantage.
- The post-run system records facts and style signals. It does not expose a
  checklist of archetype thresholds or final class names.

## Follow-up and calibration

- Country/tier-specific licence bands, board confidence weights and monetary
  distress amounts remain calibration/regulations-profile work.
- The carry-slot milestone thresholds should be validated in playtests, but the
  cap and diminishing-return shape are the accepted product rule.
- Full async social showcase, rankings and privacy controls need their own
  future design/legal/no-P2W gates before expansion.

## Sources

- Raw captures:
  [[raw-perplexity/raw-roguelite-run-end-thresholds-2026-06-14]],
  [[raw-perplexity/raw-roguelite-comparable-games-2026-06-14]],
  [[raw-perplexity/raw-roguelite-meta-progression-best-practices-2026-06-14]].
