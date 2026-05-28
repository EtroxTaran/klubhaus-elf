---
title: Player, Staff Development and Decision Influence - Research Synthesis 2026-05-28
status: draft
tags: [research, player-development, staff, skills, transfers, decision-model, fmx-38]
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
linear: FMX-38
sourceType: external
related:
  - [[eos-player-staff-skills-and-personas-2026-05-28]]
  - [[systemic-events-player-development-venue-ops]]
  - [[player-strength-presentation]]
  - [[transfer-market-simulation]]
  - [[data-generators]]
  - [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  - [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
  - [[../50-Game-Design/squad-and-club-structure]]
  - [[../50-Game-Design/youth-academy-and-development]]
  - [[../50-Game-Design/training-load-and-medicine]]
  - [[../50-Game-Design/scouting-and-recruitment]]
  - [[../50-Game-Design/transfer-market-and-contracts]]
  - [[../20-Features/feature-eos-player-skills-and-people-context]]
  - [[../20-Features/feature-player-lifecycle]]
  - [[../20-Features/feature-training-medicine]]
  - [[../20-Features/feature-transfer-market-ai-and-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
---

# Player, Staff Development and Decision Influence - Research Synthesis 2026-05-28

## Question

What documentation is still missing so that player attributes, staff quality,
skills/perks, persona, relationships, development, scouting and transfer
decisions form one coherent gameplay model without expanding the 16+4+8
attribute schema or silently activating staff-skill scope?

## Summary

The vault already has strong pieces: 16+4+8 attributes, Impact Lens, weekly
development, mentoring, multifactor injury risk, Transfer valuation, draft
People/persona/skills and accepted Staff Operations. The missing layer is a
decision-influence model: which factors are read by which system, through which
owner, for which decision, and at which phase.

The recommended documentation answer is:

- keep attributes, tendencies, skills/perks, hidden meta, OCEAN persona,
  relationships and staff pipelines as distinct layers;
- add factor matrices instead of final formulas;
- create a draft GDDR that becomes the canonical gameplay decision layer;
- document staff-skill MVP activation as a Nico-gated decision, not as an
  accidental expansion of FMX-23;
- keep generated prose outside all authoritative decisions.

## Current vault base

| Area | Current vault truth | Gap |
|---|---|---|
| Player attributes | [[data-generators]] and [[../50-Game-Design/tactics-system]] define 16 visible outfield + 4 GK-only + 8 hidden meta on a 1-20 scale. | [[../50-Game-Design/GD-0003-squad-players]] still contains older 1-10 strength wording in its pre-reopen body. |
| Player presentation | [[player-strength-presentation]] locks Impact Lens and no global OVR. | New skills/persona docs need to state that they never create an OVR fallback. |
| Development | [[systemic-events-player-development-venue-ops]] and [[../50-Game-Design/youth-academy-and-development]] define weekly growth factors. | No single matrix shows which factors affect development versus transfer versus match. |
| Staff operations | [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]] is accepted and owns contracts, roles, pipeline coverage, wages and specialisations. | Staff-skill effect activation is explicitly future/open, but MVP re-evaluation now needs options. |
| People/persona/skills | [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]] is draft and owns proposed personas, relationship graph and skill profiles. | People-to-Transfer, People-to-Training and People-to-Staff Operations read-model shape is not yet explicit. |
| Transfers | [[transfer-market-simulation]] defines PlayerMarketProfile, sellPressure/protectionScore, player/agent agency and valuation bands. | How skills/persona/relationships/staff pipeline change transfer decisions is scattered. |
| Narrative | FMX-3 drafts define context cards and presentation-only prose. | Decision docs must repeat that LLM phrasing cannot create transfer, relationship, development or match facts. |

## External source check

| Source | Pattern | FMX implication |
|---|---|---|
| Sports Interactive Football Manager 2024 Players manual | Position comfort, attributes, injury-risk overview and mentoring are distinct systems; mentoring affects mental attributes and player traits. | Keep development, position learning, workload, mentoring and traits separate; avoid one hidden "personality does everything" stat. |
| Sports Interactive Football Manager 2024 Staff manual | Staff attributes influence coaching bias, morale, advice, medical assessment and scouting accuracy. | Staff quality should affect pipelines through the owning domain rather than direct global buffs. |
| EA SPORTS FC 26 Career and Clubs deep dives | Archetypes, PlayStyles, Specializations and perks add identity layers over attributes. EA also rebalanced base attributes so players remain competent without the extra style layer. | Player skills/perks can create readable identity, but base attributes must stay meaningful and skills must be sparse/contextual. |
| CIES Football Observatory transfer-value model | Transfer valuation uses multiple determinants and is useful for negotiation, contract, insurance and club asset decisions. | FMX's PlayerMarketProfile should include ability, potential, contract, age, risk and market context, but expose confidence/ranges. |
| FIFA Clearing House / RSTP explanatory notes | Training rewards use player passport and transfer triggers. | Development history matters economically through training rewards and player-registration history, not only CA growth. |
| UEFA 2025 squad-cost ratio | Squad cost includes relevant-person benefits, amortisation/impairment and agent/intermediary costs against revenue and transfer profit/loss. | Staff and player costs need ledger/budget interactions, but staff effects still belong to Staff Operations and consuming sport domains. |
| 2024 ACWR systematic review | Professional-football workload/injury research is mixed; precise universal thresholds remain hard to establish. | Training/medical docs should keep risk bands and explanations, not one magic injury threshold. |
| 2024 head-coach turnover/backroom study | Coach changes create player-development and backroom-staff spillovers. | Staff continuity, role fit and turnover should be planned as future factors in development/pipeline quality. |
| UEFA Sporting Director Programme and FA director-of-football criteria | Sporting directors cover squad planning, recruitment, football operations and non-playing staff recruitment/disposal. | Staff Operations as a separate context is aligned with real club structure; sport-director decisions can affect staff, transfers and long-term squad balance. |

## Gaps found

### G1 - Missing decision-influence layer

Existing docs describe individual systems well, but they do not yet provide one
matrix that says "this player/staff/people factor affects these decisions and is
owned here." This forces future implementers to infer cross-system effects.

### G2 - Attribute-schema drift risk

The current planning truth is 16+4+8 on 1-20. Older reopened GDDRs still contain
pre-reconciliation language such as 1-10 strength. The new model must explicitly
make 16+4+8 the baseline and classify skills/persona as separate layers.

### G3 - Staff skills are structurally planned but not scoped

GD-0020 currently says active mechanical skills are player-first and staff skills
are a target model. Nico now wants staff-skill MVP activation re-evaluated. This
needs a decision gate with options, not a hidden scope change.

### G4 - People-to-Transfer bridge is incomplete

Transfer docs already include ambition, loyalty, professionalism, morale,
relationship with manager/director and agent behaviour. People drafts own
persona and relationship truth. The bridge between them needs a named read model
or decision context so Transfer does not duplicate People state.

### G5 - People-to-Training and mentoring bridge is incomplete

Development docs include mentoring, personality and morale. People drafts own
relationship graph and persona substrate. The exact data flow needs a
development decision context so Training and Squad do not invent social truth.

### G6 - Staff pipeline effects need ownership language

Staff Operations owns staff contracts, role assignment, coverage and
specialisation metadata. Consuming domains apply effects. The docs need a matrix
that shows Training, Transfer/Scouting, Squad & Player and Match consuming
pipeline coverage without taking ownership of staff lifecycle.

### G7 - Narrative context must stay non-authoritative

The FMX-3 narrative target needs People/context cards, but generated prose cannot
change relationships, transfer decisions, development deltas, injuries, promises
or facts. This rule should appear in the new decision model, not only in
narration docs.

## Target vocabulary

| Layer | Owner | Used for | Not used for |
|---|---|---|---|
| Visible attributes | Squad & Player | Match contests, role fit, category profile, development outputs | Global OVR, persona, direct dialogue truth |
| Hidden meta | Squad & Player, with reveal rules | Development, uncertainty, pressure/consistency/adaptation labels | Expanding the visible attribute grid |
| CA/PA and curve seed | Squad & Player / generation | Development ceiling, scouting ranges, market potential | Public universal rating |
| Tendencies | Squad & Player / Training evidence | Action-choice probabilities, role habits | Bounded outcome-quality modifiers |
| Player skills/perks | Proposed People, consumed by Match/Training/Squad | Sparse visible specialisations and locked match snapshots | New attributes or mandatory meta build |
| OCEAN substrate | Proposed People | Internal persona consistency and dialogue context | Direct match/economy modifiers |
| Football labels | Proposed People, derived | UI, scouting/persona readability, dialogue | Hidden numeric disclosure |
| Relationship edges | Proposed People | Mentoring, trust, conflict, player terms, narrative context | Prose-driven state changes |
| Staff attributes | Staff actor data / Staff Operations planning | Role suitability, scouting, coaching, medical, people management | Player attribute expansion |
| Staff skills/perks | Proposed People target, applied by consuming domains if ratified | Future staff specialisations, pipeline modifiers | MVP full staff-card gameplay unless ratified |
| Pipeline coverage | Staff Operations | Bottleneck visibility and quality multipliers for sport pipelines | Staff persona or relationship truth |

## Factor matrices

### Player development

| Factor | Source owner | Applied by | Decision affected | Phase |
|---|---|---|---|---|
| Age phase and PA curve | Squad & Player / generation | Squad & Player + Training | Growth pace, plateau, decline | MVP foundation |
| Training focus and intensity | Training | Training | Attribute and role-learning direction | MVP foundation |
| Coach quality and pipeline coverage | Staff Operations -> Training | Training | Training efficiency, specialist support | MVP hook; staff-skill activation gate |
| Match minutes and competition level | Match / League | Squad & Player + Training | Readiness, development evidence, loan evaluation | MVP foundation |
| Role fit and tactical familiarity | Tactics / Training | Training + Squad & Player | Role learning, development explanation | MVP foundation |
| Morale, status and role happiness | Squad & Player | Training + Transfer | Development efficiency, player terms, sell pressure | MVP foundation |
| Health, fatigue and injury history | Squad & Player + Training + Match | Squad & Player | Growth suppression, availability, market risk | MVP foundation |
| Hidden meta labels | Squad & Player, revealed by scouting/coaching | Training + Squad & Player | Professionalism, determination, adaptability effects | MVP foundation |
| Mentoring relationship | People draft + Squad/Training facts | Squad & Player + Training | Slow hidden-meta/tendency influence | MVP hook |
| Skill acquisition evidence | Training + Match + Mentoring | People draft, if ratified | Player skill candidate creation | MVP player-skill slice |
| Loan environment | Transfer / League / Training | Squad & Player | Development, integration, risk | Post-MVP depth |

### Match and tactics

| Factor | Source owner | Consumed by | Decision affected | Phase |
|---|---|---|---|---|
| Visible attributes | Squad & Player | Match | Base event outcomes | MVP foundation |
| Position/role/duty | Tactics / Match setup | Match | Eligibility, action selection, shape | MVP foundation |
| Tendencies | Squad & Player | Match | Action probabilities | MVP foundation |
| PlayerSkillProfileSnapshot | People draft | Match | Bounded skill trigger effects | MVP player-skill slice if GD-0020/GD-0021 approved |
| Tactical familiarity | Training / Tactics | Match | Shape correctness and execution | MVP foundation |
| Fatigue/readiness | Training + Squad & Player | Match | Availability and late-game performance | MVP foundation |
| Leadership/captaincy labels | Squad & Player / People draft | Squad & Player + Match projection | Morale/status effects and narrative context | MVP hook |
| Generated prose | Narrative draft | Nobody for mechanics | Presentation only | Never authoritative |

### Scouting, recruitment and transfer decisions

| Factor | Source owner | Consumed by | Decision affected | Phase |
|---|---|---|---|---|
| Impact Lens projection | Squad & Player | Scouting / Transfer UI | Role/tactic fit, shortlist ranking | MVP foundation |
| Scout confidence | Scouting / Transfer | Transfer UI | Ranges, trust, hidden-label reveal | MVP foundation |
| PlayerMarketProfile | Transfer from public inputs | Transfer | Valuation, asking band, availability labels | MVP foundation |
| Contract and wage state | Squad & Player / Club Management | Transfer | Contract risk, wage burden, affordability | MVP foundation |
| Player agency labels | Squad & Player + People draft | Transfer | Player terms, wantaway risk, role promise fit | MVP foundation |
| Relationship with manager/director | People draft | Transfer | Player terms, leak risk, negotiation temperature | MVP hook |
| Agent profile | Transfer / People actor identity | Transfer | Fee preference, patience, leak tendency | MVP simple agent identity |
| Fan/board attachment | Fan Ecology / Club Management | Transfer | Protection score, backlash, shock-sale risk | MVP economy/narrative hook |
| Injury/adaptation risk | Squad & Player + People draft | Transfer | Risk discount and medical/adaptation warnings | MVP foundation |
| Staff recruitment pipeline | Staff Operations | Transfer / Scouting | Report accuracy, target discovery, shortlist quality | MVP hook; staff-skill activation gate |

### Staff pipeline effects

| Staff factor | Owned by | Consumed by | Decision affected | Phase |
|---|---|---|---|---|
| Role assignment | Staff Operations | Training / Transfer / Squad / Match | Which pipeline has coverage | MVP foundation |
| Pipeline coverage | Staff Operations | UI + consuming domains | Bottleneck explanations, quality multipliers | MVP foundation |
| Wage schedule | Staff Operations -> Club Management | Club Management | Budget pressure and cost projections | MVP foundation |
| Specialisation metadata | Staff Operations | Consuming domains | Coach/scout/medical/set-piece emphasis | MVP hook |
| StaffSkillProfileSnapshot | People draft | Staff Operations + consuming domains | Optional skill-aware pipeline effects | Decision gate |
| Staff persona/relationship | People draft | Narrative / Transfer / Training as context | Advice tone, trust, conflict, future staff dynamics | MVP narration; mechanics gated |
| Coach turnover/continuity | Staff Operations + People draft | Training / Squad | Future continuity and disruption effects | Post-MVP |

### Relationships and mentoring

| Factor | Source owner | Consumed by | Decision affected | Phase |
|---|---|---|---|---|
| Trust/respect edge | People draft | Squad & Player / Training / Narrative | Mentoring, talks, morale context | MVP hook |
| Influence edge | People draft | Squad & Player / Training | Mentor weight and leadership group effects | MVP hook |
| Role competition/rivalry edge | People draft + Squad facts | Squad & Player / Transfer | Morale, role happiness, sell pressure | MVP hook |
| Media/fan pressure edge | People draft + Fan/Media facts | Transfer / Narrative | Transfer saga, public pressure, player terms | MVP narration hook |
| Provenance | Owning factual domains + People projection | All consumers | Explainability and anti-invention guard | MVP foundation |

## Staff-skill MVP decision gate

Nico asked to re-evaluate staff skills for MVP. The planning options are:

| Option | Scope | Pros | Risks |
|---|---|---|---|
| A - Keep staff skills target-only | Staff has roles, contracts, coverage and specialisations; no skill-profile effects in MVP. | Safest scope; matches GD-0020 original player-first line. | Staff may feel like a budget/slot system instead of meaningful people. |
| B - Narrow pipeline modifiers | Staff skills may affect only pipeline quality through Training, Scouting, Medical and Match-Day read models; no full staff-card perk UI. | Gives staff real gameplay weight while preserving MVP scope and factor-matrix tuning. | Needs clear caps and provenance so it does not become hidden global buffs. |
| C - Full staff skill-card gameplay | Staff skill profiles are visible and actively modify multiple systems in MVP. | Richest staff fantasy. | Scope expansion; high balance and UX cost; needs more final catalog work. |

Recommendation for Nico review: **Option B - Narrow pipeline modifiers**. It is
the smallest option that answers the "staff matters" gameplay goal without
promoting a full staff-skill catalog, final formulas or a new UI-heavy feature.
It still requires explicit GDDR approval before implementation.

## Documentation outputs needed

- New draft GDDR:
  [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  as the canonical decision-influence layer.
- Update GD-0020 so skills/personas point to GD-0021 for cross-system effects.
- Update player lifecycle, training medicine and transfer features so their
  decision factors point to GD-0021 instead of duplicating the model.
- Update maps and Current-State so future agents find the new layer first.
- Add a session handoff recording open Nico decisions.

## Inputs for decisions

- Decide whether GD-0021 should be approved as the canonical factor-matrix layer.
- Decide staff-skill MVP option A/B/C. Recommendation: B.
- Decide whether ADR-0052 should be accepted as People context before any
  mechanics consume relationship or skill-profile read models.
- Decide final first player skill catalog separately. This note does not lock
  names, values, thresholds or UI copy.

## Source links

- Sports Interactive, Football Manager 2024 Players manual:
  <https://community.sports-interactive.com/sigames-manual/football-manager-2024/players-r4958/>
- Sports Interactive, Football Manager 2024 Touch and Console Staff manual:
  <https://community.sports-interactive.com/sigames-manual/football-manager-2024-touch-and-console/staff-r4982/>
- EA SPORTS FC 26 Career Mode Deep Dive:
  <https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-career-mode-deep-dive>
- EA SPORTS FC 26 Clubs Deep Dive:
  <https://www.ea.com/en/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-clubs-deep-dive>
- EA SPORTS FC 26 Gameplay Deep Dive:
  <https://www.ea.com/nl/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-gameplay-deep-dive>
- CIES Football Observatory, Scientific assessment of football players'
  transfer value:
  <https://football-observatory.com/IMG/pdf/note01en.pdf>
- FIFA Clearing House regulations and explanatory notes:
  <https://inside.fifa.com/en/transfer-system/clearing-house/regulations-and-explanatory-notes>
- UEFA Club Licensing and Financial Sustainability Regulations 2025, Article
  93:
  <https://documents.uefa.com/r/UEFA-Club-Licensing-and-Financial-Sustainability-Regulations-2025/Article-93-Calculation-of-squad-cost-ratio-Online?contentId=VPXKGXvePkAdvYTaMMDQfQ>
- Michailidis, 2024, ACWR systematic review in professional soccer:
  <https://www.mdpi.com/2076-3417/14/11/4449>
- Galdino and Wicker, 2024, head coach turnover/backroom staff effects:
  <https://journals.sagepub.com/doi/10.1177/17479541231207704>
- UEFA Academy / ECA Sporting Director Programme brochure:
  <https://uefaacademy.com/wp-content/uploads/sites/2/2024/11/UEFA_SDP_Brochure_2025_BD.pdf>
- The FA, Director of Football GBE criteria 2025/26:
  <https://www.thefa.com/-/media/files/thefaportal/governance-docs/registrations/gbe-2025-26/fa-mens-director-of-football-gbe-criteria-202526.ashx>

## Future-scope notes (classified future-scope)

- Final numeric weights, thresholds, caps and decay rules.
- Full staff skill-card UI and catalog.
- Staff continuity / head-coach turnover cascade mechanics.
- Deep agent relationship game beyond MVP transaction modifiers.
- Player-to-staff career conversion.
