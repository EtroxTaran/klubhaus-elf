---
title: Game Design Hub
status: current
tags: [game-design, index]
created: 2026-05-15
updated: 2026-06-05
type: index
binding: false
related: [[../00-Index/Game-Design-Map]], [[../00-Index/Current-State]], [[../00-Index/Documentation-V1]], [[GD-0012-onboarding]], [[GD-0006-transfers]], [[transfer-market-and-contracts]], [[GD-0027-hidden-attribute-substrate-mapping]], [[GD-0028-dialogue-intent-taxonomy-effect-matrix]], [[GD-0029-weather-and-pitch-design-model]], [[GD-0030-dynasty-board-and-ownership]], [[GD-0031-analytics-hub-and-statistics]], [[GD-0032-awards-honours-records-and-hall-of-fame]], [[GD-0033-national-team-dual-role]], [[../60-Research/awards-honours-records-hof-owner-2026-06-06]], [[../60-Research/national-team-dual-role-2026-06-06]], [[../60-Research/player-contract-lifecycle-fsm-2026-06-03]], [[../60-Research/hidden-attribute-substrate-mapping-2026-06-05]], [[../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]], [[../60-Research/weather-and-pitch-conditions-2026-06-05]], [[../60-Research/dynasty-board-ownership-bankruptcy-2026-06-05]], [[../60-Research/statistics-analytics-read-model-owner-2026-06-05]]
---

# Game Design Hub

> **2026-05-27 — All game-design decisions reopened.** Every GDDR and system
> note previously `approved` was reset to `status: draft` for re-evaluation.
> **Nothing here is currently binding;** records will be re-approved
> individually after review. The Status column and "approved" wording below
> reflect the pre-reopen state and are being revisited.

Working game-design notes for soccer-manager. Treat this folder as the GDD:
one note per system + mode + emergent system. Notes are `draft` unless the
status field says otherwise; `approved` notes are binding for implementation.
[[../00-Index/Documentation-V1]] classifies non-approved notes
as future-scope or historical planning unless they are promoted in
[[../00-Index/Current-State]].

Research input for every note lives in [[../60-Research/00-summary]]; raw
research transcripts in [[../60-Research/raw-perplexity/README]].

## Authority and decision records

Implement gameplay only from `approved` game-design records. This folder has two
complementary record shapes:

- **GDDRs** (`GD-0001`...`GD-0028`) — the decision-record chain from research into
  ADRs (the *what was decided and why*);
- **system and mode notes** such as [[core-loop]], [[match-engine]], and
  [[transfer-market-and-contracts]] — the detailed system specs (the *how it
  works in depth*).

### Which document is binding (precedence)

A junior should never have to guess. Apply this order:

1. **Status wins first.** An `approved` record is binding; a `draft`/`superseded`
   record is never implementation authority — even on the same topic. So if a
   GDDR is `draft` but its system note is `approved` (or vice-versa), the
   **`approved` one is binding** regardless of shape.
2. **If both are `approved`**, the **GDDR is the decision of record** and the
   **system note is the detailed spec**; read both, and they must agree. A
   conflict between two `approved` records is a **stop condition** — escalate and
   supersede one explicitly before implementing; do not average them.
3. The authoritative list of what is currently approved/binding lives in
   [[../00-Index/Game-Design-Map]].

**Known overlapping topics (read this so you are not surprised):**

| Topic | Binding document | Do NOT implement from |
|---|---|---|
| Match engine & simulation | [[match-engine]] (`approved`) | [[GD-0002-match-engine]] (`draft`, Wave-2 gated) |
| Core career loop | [[GD-0001-core-loop]] (`approved`) | [[core-loop]] (`draft` context note) |
| AI managers & world | — (none binding yet) | [[GD-0010-ai-world]] (`draft`, Wave-2 gated) |

For every other topic both records are `approved` and complementary (GDDR =
decision, system note = spec). `draft` records are planning context only; as of
2026-05-22 the MVP gameplay surface is fully covered by the approved/current
notes in [[../00-Index/Game-Design-Map]], so remaining `draft` labels are not
active work.

| GDDR | System | Status | Feeds ADR |
|---|---|---|---|
| [[GD-0001-core-loop]] | Core career loop & weekly rhythm | draft | ADR-0003, ADR-0008 |
| [[GD-0002-match-engine]] | Match engine & simulation model | draft (Wave 2 gated) | ADR-0003, ADR-0005 |
| [[GD-0003-squad-players]] | Squad, players & attributes | draft | ADR-0027, ADR-0003 |
| [[GD-0004-tactics]] | Tactics & formations | draft | ADR-0003, ADR-0008 |
| [[GD-0005-training]] | Training & development | draft | ADR-0003 |
| [[GD-0006-transfers]] | Transfers & scouting; FMX-81 adds proposed contract renewal / expiry / Bosman / free-agent lifecycle appendix | draft | ADR-0027, ADR-0073 |
| [[GD-0007-youth]] | Youth academy | draft | ADR-0027, ADR-0007 |
| [[GD-0008-finance-economy]] | Finance, economy & stadium; FMX-13 weekly ledger / full-accounting draft plus FMX-49 in-world financing tools | draft | ADR-0027, ADR-0050 |
| [[GD-0009-league-structure]] | League & competition structure | draft | ADR-0007, ADR-0027 |
| [[GD-0010-ai-world]] | AI managers & world simulation | draft (Wave 2 gated) | ADR-0003, ADR-0009 |
| [[GD-0011-career-progression]] | Career progression, board & objectives | draft | ADR-0003 |
| [[GD-0012-onboarding]] | Onboarding & new game; FMX-99 closes R2-05 with current FTUE path, Season-1 objective roadmap and wage-runway first economy lesson | approved | ADR-0008, ADR-0006 |
| [[GD-0013-narrative-inbox]] | Narrative, inbox & events | draft | ADR-0006, ADR-0003 |
| [[GD-0014-save-career-model]] | Save & career model | draft | ADR-0020, ADR-0005 |
| [[GD-0015-ip-clean-data]] | IP-clean data generation | draft | ADR-0007 |
| [[GD-0016-mobile-ux-loop]] | Mobile UX gameplay loop | draft | ADR-0008, ADR-0010 |
| [[GD-0017-mvp-scope-and-mode-sequencing]] | MVP scope & mode sequencing | draft | ADR-0020 |
| [[GD-0018-ai-narrative-personas-and-dialogue]] | AI narrative personas, Full Dialogue, All Active actor context, Narrative context, FMX-88 fallback coverage/no-export freeze and Playtest First evaluation | draft | ADR-0030, ADR-0054 |
| [[GD-0019-manager-archetype-roguelite-progression]] | Manager archetype roguelite progression; FMX-16 hooks, playtest-tunable taxonomy and prestige counterweight | draft | ADR-0051 |
| [[GD-0020-eos-player-skills-personas-and-people]] | EOS player skills/perks, staff target skills, personas and People-context planning | draft | ADR-0052 |
| [[GD-0021-player-staff-development-and-decision-influence]] | Player/staff development and decision-influence factor matrices; staff-skill MVP gate | draft | ADR-0052, ADR-0053 |
| [[GD-0022-economy-commercial-impact-and-contracts]] | Economy commercial impact map; ticketing, season-ticket lifecycle/accrual, fan-demand elasticity, commercial contract lifecycle/breach, catering, merchandise, cup/competition revenue profiles, matchday operating costs, fan events and Investor clean SP cash | draft | ADR-0050, ADR-0058 |
| [[GD-0023-ai-club-economy-behaviour]] | AI club economy behaviour; five financial-policy archetypes over manager archetypes, three financial regimes (Healthy/Stressed/Distressed), soft diegetic homeostasis (no AI stat cheats), staged distress with rare bounded insolvency, tiered fidelity, country distress personalities, structured rationale tags | draft | ADR-0050, ADR-0051, ADR-0058 |
| [[GD-0024-ai-world-drift-algorithm]] | AI world-drift algorithm; Rising Rival, Giant Collapse and Continental Era Shift / rising nations as deterministic, legible, capped structural drift events with FMX-52 calibration handoff | draft | ADR-0071 |
| [[GD-0025-in-match-controls]] | In-match controls & live-control kit (FMX-100, resolves GD-0016 R2-16 gameplay half); one MVP interaction tier — queued subs, mentality presets, formation-swap, 3 cooldown shouts, 3 speeds + free pause; halftime modal; deterministic shout-effect contract with provisional playtest-tunable magnitudes; text&stats accessible path | draft | ADR-0072 |
| [[GD-0026-set-piece-coach-readiness]] | Set-piece-coach effect-readiness multiplier curve (FMX-69, closes gap G12); per-variant readiness via bounded exponential, coach specialisation (ADR-0053) scales the learning rate, two-layer category+variant granularity, decay + hysteresis selectability gate frozen into the TacticSnapshot (ADR-0067); `SetPieceCoachReadinessUpdated` emitted by Training; constants = FMX-52 calibration | draft | ADR-0053, ADR-0067 (additive amend) |
| [[GD-0027-hidden-attribute-substrate-mapping]] | Hidden-attribute substrate mapping (FMX-86, closes gap G22, unblocks ADR-0052 boundary); deterministic meta/OCEAN → football-label derivation via mutually-exclusive label axes + orthogonal flags; OCEAN persisted as state (derive-at-gen, mutate in place); reveal reuses Scouting's `HiddenFlagRevealLedger` gate (bands not point estimates, no join); mentoring split = People policy + Training compute (numeric model → GD-0021); thresholds = calibration. **D1–D4 = A/A/A/A** | draft | ADR-0052, ADR-0064 |
| [[GD-0028-dialogue-intent-taxonomy-effect-matrix]] | Dialogue-intent taxonomy and effect matrix (FMX-87, closes gap G13); Broad MVP surfaces, closed finite intents, banded deterministic effects, persona gate + bounded scaling, and command/event flow proving Narrative/LLM prose never applies state | draft | ADR-0030, ADR-0054 |
| [[GD-0029-weather-and-pitch-design-model]] | Weather & pitch design model (FMX-66, companion to ADR-0077, closes gap G23 design layer); weather parameter vector + regime taxonomy (Fine/Unsettled/Stormy/Heatwave/Freeze) + pitch-condition ladder; **subtle weather, pitch the amplifier** (FM/OOTP lesson); WBGT≥32 cooling break; fallible forecast as a planning mechanic; effect *directions* only — magnitudes + postponement reserved to FMX-52 / later. **D1–D4 = C/A/A/A** | draft | ADR-0077 |
| [[GD-0030-dynasty-board-and-ownership]] | Dynasty board & ownership model (FMX-89, E5; closes late-game gaps G2/G20); 8-tier board-ambition ladder + confidence + 2-phase sacking (deterministic), 6 owner archetypes as presets on a continuous 6-axis trait space, ownership-transition (instability_score → archetype draw → align/resist/leave → caps/cooldowns) consuming ADR-0071 drift, bankruptcy/administration (points + embargo + fire-sale + heroic-save/abandon; liquidation→phoenix reserved). The design answer to the "Club Boss late-game flatline". Effect *directions* only — magnitudes = FMX-52. **D1–D4 = A/A/A/A** | draft | ADR-0079 |
| [[GD-0031-analytics-hub-and-statistics]] | Analytics Hub and Statistics (FMX-94, E6; closes G19 design layer); full MVP Analytics Hub with Key Findings, Last Match, Team/Player Analysis, standings/leaders, form windows, maps/heatmaps/zone control and early season-history handoff; official counts stay distinct from derived estimates; no global OVR. **D1-D4 = dedicated projection owner / per-save + immutable handoff snapshots / full MVP hub / core-plus-model metrics** | draft | ADR-0081 |
| [[GD-0032-awards-honours-records-and-hall-of-fame]] | Awards, Honours, Records & Hall of Fame (FMX-95, E6 / E6-3; closes G20 design layer). Three layers: **season awards** → per-save **records book** → **legacy/HoF** synthesis (in-world HoF + cross-save legend ranking + manager prestige). IP-safe award/honour/record taxonomy; HoF induction by formula-preselect, **era-normalized** + **scarcity/quota-capped**, inspectable reasons; peak-and-longevity. Manager & Legacy owns the legacy/HoF layer (extends ADR-0051); per-save records stay Statistics-owned. **D1-D4 = extend ADR-0051 / per-save records + cross-save legends / raw facts + versioned formula / full HoF in MVP**; all magnitudes = FMX-52. | draft | ADR-0083 |
| [[GD-0033-national-team-dual-role]] | National-Team (Bundestrainer) dual-role (FMX-84, E5; closes late-game gap G2/R2-06). The headline late-game aspiration ("club legend → national-team coach", GD-0011 spine) shipped as a **telegraphed reserved-stub**: ratify design + thresholds now, MVP ships only the reserved international-window contract + foreshadowing, full playable role post-MVP. Unlock = **reputation ≥ 75 AND 5 seasons** (no trophy path); 3 engagement levels (Full/Match-Only/Light-Touch); deterministic forced-choice same-day club↔nation clash. League Orchestration owns the international-window calendar. **D1–D4 = reserved-stub / League-owned windows / rep+seasons gate / 3 levels + forced-choice**; magnitudes = FMX-52. | draft | ADR-0084 |

## Core loop

- [[core-loop]] - season arc, weekly heartbeat, day ticks.
- [[club-dna-and-governance]] - 7 DNA parameters + board+fans split confidence.
- [[system-interplay]] - the 5 master feedback loops.

## Economy and infrastructure

- [[economy-system]] - cash-flow, budget pots, KPIs.
- [[GD-0022-economy-commercial-impact-and-contracts]] - draft commercial
  impact layer for ticketing, season-ticket lifecycle/accrual, commercial
  contract lifecycle/breach, catering, merchandise, cup/competition revenue
  profiles, matchday operating costs, fan-demand elasticity, fan events and
  Investor clean SP cash.
- [[../60-Research/club-financing-tools-2026-06-01]] - FMX-49 in-world
  financing tools: credit line, loan, sponsor advance, receivable factoring,
  restructuring, owner support and emergency-sale mandates separate from
  Investor.
- [[sponsorship-portfolio]] - 4-tier sponsor inventory at asset level.
- [[stadium-and-campus]] - stadium tiers + Anstoss-style attractions + club campus.
- [[../20-Features/feature-club-economy-mvp-pillar]] - draft MVP economy pillar for weekly ledger, full accounting and staged insolvency.

## Fans and brand

- [[audience-and-atmosphere]] - supporter segments, demand, ticketing trust
  and atmosphere engine.
- [[../60-Research/fan-demand-price-elasticity-2026-05-28]] - FMX-42
  segment-specific latent demand, price sensitivity and ticketing-trust research.
- [[../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]] -
  FMX-43 season-ticket campaign lifecycle, utilisation and accrual-accounting
  research.
- [[../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]] -
  FMX-44 shared commercial contract lifecycle, exclusivity, breach and fan-fit
  research.
- [[../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]] -
  FMX-46 matchday operating-cost and risk-cost settlement research.
- [[../60-Research/fan-service-campaign-catalog-and-effects-2026-06-01]] -
  FMX-48 fan-service campaign catalog, sponsor activation and segment effect
  research.
- [[../60-Research/fan-persona-privacy-and-naming-2026-06-01]] -
  FMX-54 fan-persona privacy, fictional aggregate boundary, IP-safe
  social-world naming and Community Overlay future-gate research.

## Sporting core

- [[squad-and-club-structure]] - sporting org roles + squad design dimensions.
- [[scouting-and-recruitment]] - recruitment funnel + scout attributes + market dynamics.
- [[transfer-market-and-contracts]] - AI club selling, valuation bands, clause packages, player terms and tiered market simulation.
- [[../60-Research/player-contract-lifecycle-fsm-2026-06-03]] - FMX-81 synthesis
  for renewal, expiry, Bosman/pre-contract and free-agent signing ownership.
- [[youth-academy-and-development]] - CA/PA range, age curves, loan rules.
- [[training-load-and-medicine]] - training blocks, load model, medical pipeline.
- [[GD-0020-eos-player-skills-personas-and-people]] - draft EOS player
  skills/perks, staff target skills and persona/relationship model.
- [[GD-0021-player-staff-development-and-decision-influence]] - draft factor
  matrices for development, match, transfer and staff-pipeline decisions.
- [[GD-0027-hidden-attribute-substrate-mapping]] - draft 8-meta/OCEAN → football-label
  derivation (axes + flags), OCEAN persistence, Scouting-gated reveal bands and the
  People/Training mentoring split (FMX-86, G22; unblocks ADR-0052).

## Tactics and match

- [[tactics-system]] - Position+Role+Duty+Instructions+Traits model, tactical familiarity.
- [[set-pieces]] - corners, FKs, penalties, throw-ins as a sub-system.
- [[GD-0026-set-piece-coach-readiness]] - draft set-piece-coach effect-readiness
  multiplier curve (FMX-69, G12); readiness gates ADR-0067 variant selectability.
- [[match-engine]] - 2D event-based engine spec.

## Modes

- [[mode-create-a-club-roguelite]] - MVP first playable; permadeath + soft carries.
- [[GD-0019-manager-archetype-roguelite-progression]] - draft Manager & Legacy
  progression hooks for Create-a-Club Roguelite.
- [[mode-manage-a-club-career]] - Anstoss-2 "real manager career" + split confidence; visible as "comes later" in MVP.
- [[singleplayer-baseline]] - the full reference experience.
- [[async-multiplayer-private-group]] - 2 cadence rule sets + transfer escalation.
- [[watch-party-and-conference]] - synchronous emotional spikes.
- [[transfer-negotiations-p2p]] - human-to-human transfers with deadlines + escalation.

## Environment and emergent systems

- [[GD-0029-weather-and-pitch-design-model]] - draft weather & pitch design model
  (FMX-66, G23): parameter vector, regime taxonomy, pitch-condition ladder,
  WBGT≥32 cooling break, fallible forecast; subtle weather + pitch the amplifier.
  Feeds [[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]].
- [[GD-0030-dynasty-board-and-ownership]] - draft dynasty board & ownership model
  (FMX-89, G2/G20): 8-tier board-ambition ladder + confidence + 2-phase sacking,
  6 owner archetypes on a continuous trait space, ownership-transition + bankruptcy/
  administration arcs (heroic-save/abandon); the design answer to the "Club Boss
  late-game flatline". Feeds [[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]].
- [[GD-0033-national-team-dual-role]] - draft national-team (Bundestrainer)
  dual-role (FMX-84, G2/R2-06): the GD-0011 "club legend → national-team coach"
  spine as a telegraphed reserved-stub — ratify design now, ship the reserved
  international-window contract + foreshadowing in MVP, playable role post-MVP;
  rep ≥ 75 + 5 seasons gate, 3 engagement levels, deterministic same-day-clash
  choice. Feeds [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]].
- [[regulations-and-compliance]] - promotion-gated stadium / ops requirements.
- [[rivalry-system]] - emergent rivalry score with 5 sub-scores.
- [[matchday-event-engine]] - rule-based events with trigger / probability / effect / prevention.
- [[community-editor-and-datasets]] - override pack model with manifests.

## Narrative and AI

- [[GD-0013-narrative-inbox]] - inbox-as-feed, narrative events and press/newspaper baseline.
- [[GD-0018-ai-narrative-personas-and-dialogue]] - draft persona, Full
  Dialogue, Narrative context, FMX-88 fallback coverage/no-export freeze and
  Playtest First evaluation layer; FMX-87 adds draft
  [[GD-0028-dialogue-intent-taxonomy-effect-matrix]] for finite intents and
  banded effects.
- [[GD-0020-eos-player-skills-personas-and-people]] - draft People/persona
  context cards and relationship constellations that feed dialogue.
- [[GD-0024-ai-world-drift-algorithm]] - draft AI World Simulation drift
  mechanics for long-save rival emergence, giant collapse and regional/league
  power shifts.

## UX

- [[progressive-disclosure-ui]] - 3-tier UX (Quick / Standard / Expert).
- [[../60-Research/player-strength-presentation]] - Impact Lens player-strength model; no global OVR.
- [[GD-0017-mvp-scope-and-mode-sequencing]] - binding MVP mode sequencing.
- [[GD-0025-in-match-controls]] - draft in-match controls & live-control kit
  (halftime modal, subs/mentality/formation/shouts, speed/pause); resolves
  GD-0016 R2-16 gameplay half.
- [[GD-0031-analytics-hub-and-statistics]] - draft MVP Analytics Hub and
  statistics design: Key Findings, Last Match, Team/Player Analysis,
  standings/leaders, form windows, maps/heatmaps, official-vs-derived labels
  and Manager & Legacy handoff snapshots.
- [[GD-0032-awards-honours-records-and-hall-of-fame]] - draft awards/honours/
  records/Hall-of-Fame design: three layers (season awards → per-save records
  book → legacy/HoF synthesis), IP-safe taxonomy, era-normalized +
  scarcity-capped induction, in-world + cross-save HoF; magnitudes = FMX-52.

## Status legend

- `approved` - binding. Implementation must follow.
- `draft` - future-scope or historical planning; not implementation authority
  and not active work unless re-opened by [[../00-Index/Documentation-V1]].
- `superseded` - historical only; never implement from.

When status changes, also update [[../00-Index/Current-State]] and
[[../00-Index/Game-Design-Map]].
