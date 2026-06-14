---
title: Game Design Map
status: current
tags: [game-design, meta]
created: 2026-05-16
updated: 2026-06-14
type: map
binding: false
related: [[Project-Goals]], [[MVP-Scope]], [[Feature-Map]], [[Documentation-V1]], [[../50-Game-Design/GD-0024-ai-world-drift-algorithm]], [[../50-Game-Design/GD-0012-onboarding]], [[../50-Game-Design/GD-0006-transfers]], [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]], [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]], [[../50-Game-Design/GD-0031-analytics-hub-and-statistics]], [[../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]], [[../60-Research/onboarding-guided-first-season-2026-06-03]], [[../60-Research/player-contract-lifecycle-fsm-2026-06-03]], [[../60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]], [[../60-Research/newsworthiness-event-publication-semantics-2026-06-04]], [[../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]], [[../60-Research/statistics-analytics-read-model-owner-2026-06-05]], [[../60-Research/standings-authority-league-vs-statistics-2026-06-12]], [[../60-Research/roguelite-run-end-and-carry-economy-tuning-2026-06-14]]
---

# Game Design Map

Use this map for gameplay, economy, progression, and player experience work.

[[Documentation-V1]] classifies draft game-design notes as
future-scope or historical planning unless they are listed as binding
(`accepted`/`approved`/`current`) below. Frontmatter is the status SSOT
(ADR-0092); since the 2026-06-08 ratification all GD-0001–GD-0040 GDDRs are
`accepted`, while the non-numbered system/mode notes are `draft` pending
individual re-approval (FMX-143 H2). GD-0041 is the FMX-191 monetization/no-P2W
proposal, GD-0042 is the FMX-133 match-engine core model/calibration proposal
and GD-0043 is the FMX-141 gameplay calibration ownership proposal; all three
remain `draft` pending Nico. GD-0044 is the accepted FMX-137 Create-a-Club
Roguelite run-tuning record. This means old `Future-scope notes`
sections are not active work by default.

## Hub

- [[../50-Game-Design/README]] - GDD index.

## Core loop & structure

- [[../50-Game-Design/core-loop]]
- [[../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]]
- [[../50-Game-Design/club-dna-and-governance]]
- [[../50-Game-Design/system-interplay]]

## Economy + infrastructure

- [[../50-Game-Design/economy-system]]
- [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
- [[../50-Game-Design/sponsorship-portfolio]]
- [[../50-Game-Design/stadium-and-campus]]
- [[../20-Features/feature-club-economy-mvp-pillar]]
- [[../60-Research/club-economy-blueprint-2026-05-27]]
- [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
- [[../60-Research/fan-demand-price-elasticity-2026-05-28]]
- [[../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]]
- [[../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]]
- [[../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
- [[../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
- [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]] -
  draft FMX-191 monetization/no-P2W canon; decision pending Nico.
- [[../60-Research/monetization-model-and-no-p2w-canon-2026-06-13]] -
  FMX-191 research synthesis for the recommended free-core, cosmetics,
  Supporter Club and no-P2W entitlement model.
- [[../60-Research/no-pay-to-win-and-mp-fairness-invariant-2026-06-13]] -
  FMX-190 research synthesis for the proposed project-wide no-P2W / shared-state
  zero-effect invariant that enforces the FMX-191 promise.

## Fans + brand

- [[../50-Game-Design/audience-and-atmosphere]]
- [[../60-Research/fan-demand-price-elasticity-2026-05-28]]
- [[../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]]
- [[../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]]
- [[../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]

## Sporting core

- [[../50-Game-Design/squad-and-club-structure]]
- [[../50-Game-Design/scouting-and-recruitment]]
- [[../50-Game-Design/transfer-market-and-contracts]]
- [[../60-Research/player-contract-lifecycle-fsm-2026-06-03]] - FMX-81
  contract renewal, expiry, Bosman/pre-contract and free-agent signing synthesis.
- [[../50-Game-Design/youth-academy-and-development]]
- [[../50-Game-Design/training-load-and-medicine]]
- [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]] -
  accepted EOS player skills/perks, staff-skill target and People/persona model.
- [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]] -
  accepted factor-matrix layer for player development, transfer decisions,
  staff-pipeline influence and the staff-skill MVP gate.

## Tactics + match

- [[../50-Game-Design/tactics-system]]
- [[../50-Game-Design/set-pieces]]
- [[../50-Game-Design/match-engine]]
- [[../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]] -
  draft FMX-133 core model/calibration proposal; pending Nico D1-D6.
- [[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]] -
  draft FMX-141 gameplay calibration ownership proposal; pending Nico D1-D5.
- [[../60-Research/swappable-spatial-event-match-engine-2026-05-27]]
- [[../60-Research/match-engine-core-model-2026-06-13]] - FMX-133 synthesis for
  statistical envelopes, xG/EPV/action utility, profile density and calibration
  harness.
- [[../60-Research/gameplay-calibration-ownership-and-harness-2026-06-13]] -
  FMX-141 synthesis for gameplay-wide calibration slots and harness tiers.

## Modes

- [[../50-Game-Design/mode-create-a-club-roguelite]] - MVP first playable.
- [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]] - accepted
  Manager-Archetype Roguelite progression hooks.
- [[../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]] - accepted
  FMX-137 run-end, carry-slot, async cosmetic and archetype-taxonomy tuning for
  Create-a-Club Roguelite.
- [[../50-Game-Design/mode-manage-a-club-career]] - visible as "comes later"; post-MVP playable.
- [[../50-Game-Design/singleplayer-baseline]]
- [[../50-Game-Design/async-multiplayer-private-group]]
- [[../50-Game-Design/watch-party-and-conference]]
- [[../50-Game-Design/transfer-negotiations-p2p]]

## Environment & emergent

- [[../50-Game-Design/regulations-and-compliance]]
- [[../50-Game-Design/rivalry-system]]
- [[../50-Game-Design/matchday-event-engine]]
- [[../50-Game-Design/community-editor-and-datasets]]

## Narrative & AI

- [[../50-Game-Design/GD-0013-narrative-inbox]]
- [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]] - accepted
  Full Dialogue and All Active actor-context target for MVP narration; FMX-88
  freezes Broad Full Dialogue runtime-LLM scope, CI fallback manifest and the
  no-export MVP rule; FMX-83 proposes source-owned newsworthy event snapshots
  for injuries, contract expiry, board pressure and transfer rumours; FMX-87
  adds finite `DialogueIntent` taxonomy and banded effect matrix coverage.
- [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]] - accepted
  FMX-87 dialogue-intent taxonomy and effect matrix for player, staff, board,
  press/media, fan-rep and agent surfaces.
- [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
- [[../50-Game-Design/GD-0024-ai-world-drift-algorithm]] - accepted deterministic
  world-drift design for Rising Rival, Giant Collapse and Continental Era Shift.
- [[../60-Research/ai-narrative-runtime-integration]]
- [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]

## UX

- [[../50-Game-Design/GD-0012-onboarding]] - accepted FMX-99 onboarding decision:
  current FTUE path, Season-1 objective roadmap, wage-runway first economy
  lesson, deterministic feed-card scoring and keyboard-first / WCAG 2.2 AA
  route requirements.
- [[../50-Game-Design/onboarding-and-tutorial]] - detailed onboarding system
  spec (`draft`, pending individual re-approval — FMX-143 H4).
- [[../60-Research/onboarding-guided-first-season-2026-06-03]] - FMX-99 research
  synthesis for R2-05.
- [[../50-Game-Design/progressive-disclosure-ui]]
- [[../60-Research/player-strength-presentation]] - binding Impact Lens model for player strength presentation; no global OVR.
- [[../50-Game-Design/squad-and-club-structure]]
- [[../50-Game-Design/youth-academy-and-development]]
- [[../50-Game-Design/training-load-and-medicine]]
- [[../50-Game-Design/stadium-and-campus]]
- [[../50-Game-Design/matchday-event-engine]]

## Analytics + history

- [[../50-Game-Design/GD-0031-analytics-hub-and-statistics]] - accepted FMX-94
  MVP Analytics Hub and statistics design: Key Findings, Last Match, Team/Player
  Analysis, standings/leaders, form windows, maps/heatmaps/zone control,
  official-vs-derived metric labels and Manager & Legacy handoff snapshots;
  FMX-131 keeps official standings ordering and rollover authority in League
  Orchestration.
- [[../60-Research/statistics-analytics-read-model-owner-2026-06-05]] -
  research synthesis for G19 and ADR-0081.
- [[../60-Research/standings-authority-league-vs-statistics-2026-06-12]] -
  research synthesis for the official standings vs projection authority split.
- [[../20-Features/feature-statistics-analytics-hub-mvp]] - draft MVP feature
  slice.

## Design inputs

- [[Project-Goals]]
- [[../60-Research/00-summary]]
- [[../60-Research/systems-design-synthesis]]
- [[../60-Research/club-economy-blueprint-2026-05-27]]
- [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
- [[../60-Research/fan-demand-price-elasticity-2026-05-28]]
- [[../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]]
- [[../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]]
- [[../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
- [[../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
- [[../60-Research/manager-archetype-roguelite-2026-05-27]]
- [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]]
- [[../60-Research/player-staff-development-decision-model-2026-05-28]]
- [[../60-Research/ai-world-drift-algorithm-2026-06-03]]
- [[../60-Research/mode-design-research]]
- [[../60-Research/async-multiplayer-research]]
- [[../60-Research/fan-culture-segmentation-research]]
- [[../60-Research/progressive-disclosure-research]]
- [[../60-Research/player-strength-presentation]]
- [[../60-Research/onboarding-guided-first-season-2026-06-03]]
- [[../60-Research/player-contract-lifecycle-fsm-2026-06-03]]
- [[../60-Research/presentation-renderer-strategy]]
- [[../60-Research/swappable-spatial-event-match-engine-2026-05-27]]
- [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]
- [[../60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]]
- [[../60-Research/newsworthiness-event-publication-semantics-2026-06-04]]
- [[../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]]
- [[../60-Research/statistics-analytics-read-model-owner-2026-06-05]]
- [[../60-Research/regulations-and-pyramids-research]]
- [[../60-Research/anstoss-series-deep-dive]]
- [[../60-Research/club-boss-analysis]]
- [[../60-Research/feature-library-synthesis]]
- [[../95-Archive/gap-reports/feature-gap-analysis]] - historical Wave 1 gap traceability only.

## Binding Rule

Only `accepted`/`approved` game design or feature notes are binding for
implementation; draft gameplay ideas can be used for planning but not as
implementation specs. Since the 2026-06-08 ratification (#153, FMX-143
reconciliation 2026-06-11):

- **Binding: all GDDRs [[../50-Game-Design/GD-0001-core-loop|GD-0001]]–GD-0040
  and [[../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning|GD-0044]]**
  (`accepted`; the GDDR is the decision of record — see
  [[../50-Game-Design/README]] precedence rules). Wave-2-gated items inside
  accepted GDDRs remain scope-gated, not implementable.
- **Not binding:** [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  is `draft` pending the FMX-191 Nico decision queue;
  [[../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]] is `draft`
  pending the FMX-133 Nico decision queue;
  [[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  is `draft` pending the FMX-141 Nico decision queue; related draft
  [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  is the FMX-190 enforcement proposal pending its own Nico decision queue.
- **Binding research synthesis:** [[../60-Research/player-strength-presentation]]
  (Impact Lens, no global OVR).
- **Not binding (planning context):** the non-numbered system/mode notes
  (mode-create-a-club-roguelite, mode-manage-a-club-career,
  singleplayer-baseline, onboarding-and-tutorial, tactics-system, match-engine,
  transfer-market-and-contracts, …) are `draft` pending individual re-approval
  (FMX-143 H2/H4); fan-ecology is `superseded`. They must not contradict the
  GDDR of record.
