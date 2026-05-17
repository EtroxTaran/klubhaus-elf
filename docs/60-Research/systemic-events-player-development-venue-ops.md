---
title: Systemic Events, Player Development, Injuries and Venue Operations
status: current
binding: true
tags: [research, player-development, injuries, events, narrative, venue, training]
created: 2026-05-17
updated: 2026-05-17
type: research
related: [[data-generators]], [[determinism-and-replay]], [[narrative-content-pipeline]], [[ai-manager-behaviour]], [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]], [[../50-Game-Design/youth-academy-and-development]], [[../50-Game-Design/training-load-and-medicine]], [[../50-Game-Design/stadium-and-campus]], [[../50-Game-Design/matchday-event-engine]]
---

# Systemic Events, Player Development, Injuries and Venue Operations

> Locks the synthesis from Nico's May 2026 research prompt on player
> development, mentoring, training injuries, random events, narrative text
> and multi-use arenas. The accepted direction is **domain-owned systems
> coordinated by deterministic event orchestration**, not one generic
> random-event system.

## 1. Inputs

This note reconciles:

- the attached research note from `Downloads/Wie bilden wir ab wie Spieler entwickeln_ Die vers.md`;
- current binding architecture in [[../10-Architecture/bounded-context-map]],
  [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]],
  [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]];
- current simulation locks in [[determinism-and-replay]],
  [[data-generators]], [[match-engine-simulation-model]];
- current narrative locks in [[narrative-content-pipeline]];
- draft gameplay notes for youth, training, squad, stadium and match-day
  events;
- external research checks on workload/injury risk, FM-style mentoring and
  365-day venue operations.

## 2. Core decision

Use a **World Event Director pattern** only as orchestration. It does not own
all randomness or all event rules. Each domain owns its own causality:

| Area | Owning system | Event/director role |
|---|---|---|
| Player development | Training + Squad & Player | Schedules weekly progression and emits explainable deltas |
| Mentoring | Squad & Player + Training | Applies slow trait/tendency influence and social side effects |
| Injuries | Squad & Player, with Training and Match inputs | Converts load/contact/risk windows into injury facts |
| Match-day events | Club Management + Match + League | Evaluates trigger/probability/effect/prevention rules |
| Venue operations | Club Management | Books non-matchday events and exposes conflicts |
| Narrative | Notification/read projections | Renders structured facts into deterministic copy |

The director answers "what should be evaluated this tick?" It must not
become a second hidden simulation that bypasses bounded contexts.

## 3. Player development

### 3.1 Locked model

Player development is a weekly/event-based progression system, not XP.
Context dominates noise.

```text
development_delta =
  base_progression
  * age_phase_factor
  * training_quality_factor
  * coaching_factor
  * minutes_factor
  * role_fit_factor
  * morale_factor
  * health_factor
  * personality_factor
  + bounded_noise
```

Rules:

- `bounded_noise` is small and seeded. It adds texture but never replaces
  visible causes.
- Youth players are training-heavy before 18, minutes-heavy around 18-21,
  peak-building around 22-27, and maintenance/decline after that.
- Loan environment is not "minutes only"; league quality, role fit, coach
  quality, promised role and medical standards all matter.
- Development must produce explanation tags for UI and narrative:
  `training_focus`, `match_minutes`, `role_mismatch`, `injury_rehab`,
  `morale_low`, `mentor_influence`, `loan_context`.

### 3.2 Attribute and hidden-value reconciliation

[[data-generators]] and [[../50-Game-Design/tactics-system]] lock the
player schema:

- 16 visible outfield attributes;
- 4 GK-only extras;
- 8 hidden meta attributes:
  `potential`, `consistency`, `pressure`, `professionalism`,
  `determination`, `adaptability`, `injury_proneness`, `big_matches`.

Draft gameplay notes previously listed additional hidden values such as
ambition, resilience, learning ability, positional understanding and game
intelligence. These are now reconciled as:

| Concept | Final representation |
|---|---|
| Ambition | Derived personality label from `determination`, `adaptability`, career context and contract pressure |
| Temperament / controversy | Tendency/personality tag; may become future hidden expansion, not MVP core schema |
| Leadership | Visible/derived squad-role quality from mental attributes, age, status and history |
| Learning ability | Derived progression modifier from `potential`, age phase, professionalism and coach fit |
| Resilience | Derived recovery behaviour from `injury_proneness`, `pressure`, medical quality and morale |
| Positional understanding / game intelligence | Visible mental/role-fit attributes plus tactical familiarity |

This prevents two competing hidden-trait systems.

### 3.3 PA as true cap plus uncertainty

The implementation stores a deterministic underlying potential value or
curve seed. The player-facing experience exposes a **range estimate**.

- World generation samples true `potential` deterministically.
- Scouts, coaches and youth staff expose uncertainty bands.
- The public PA range narrows with reports, minutes and staff quality.
- "Wonderkid" is emergent: the visible range overlaps an exceptional band.

## 4. Mentoring and personality

Mentoring is a slow social influence system, not a direct attribute boost.

Accepted rules:

- Small groups are preferred: 1 mentor plus 1-2 mentees, or a compact
  3-4-player group with one dominant positive influence.
- Mentors need an `influence_score` from squad status, age, leadership,
  personality label, shared language/culture, training attendance and
  relationship context.
- Mentees benefit most before 23, but senior players can still learn
  tendencies or adapt socially.
- Mentoring affects hidden/meta tendencies slowly:
  professionalism, determination, pressure handling, adaptability,
  leadership labels, role habits and off-field behaviour.
- Conflicting personalities can produce risks. A demanding mentor may
  improve professionalism while worsening morale or temperament.
- Mentoring can transfer player tendencies only when position/role context
  makes sense.

FM-style research supports senior, influential, positive personalities as
the most useful mentors, but the game should avoid a fully solvable
"perfect mentoring tree" by using caps, diminishing returns and social
compatibility.

## 5. Injury and availability model

### 5.1 Research challenge

The attached research is right that injuries should be risk-based rather
than pure random events. External sports-science checks add an important
constraint: acute/chronic workload and workload spikes are useful signals,
but evidence is mixed and there is no single universal threshold. Therefore
the game must not present one magic ACWR number.

Sources checked:

- 2024 systematic review on ACWR in professional soccer:
  <https://www.mdpi.com/2076-3417/14/11/4449>
- Workload and injury risk review:
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC9602492/>
- 2024 practical player-monitoring proposals:
  <https://iris.unipa.it/retrieve/d49c1429-8ed0-423f-9801-7b54d2e4d9c9/pillitteri-et-al-2024-translating-player-monitoring-into-training-prescriptions-real-world-soccer-scenario-and.pdf>

### 5.2 Final model

Track per-player risk profiles with multiple channels:

| Channel | Inputs |
|---|---|
| Training exposure | weekly load, intensity, block type, surface, weather |
| Match exposure | minutes, sprint load, contact events, role demands, fixture congestion |
| Overuse | acute load versus chronic baseline, monotony, poor recovery |
| Recurrence | body-part history, recent return, rehab quality |
| Contact | match collisions, duels, fouls, bravery/role exposure |
| Illness/minor availability | travel, fatigue, squad outbreak, seasonal weather |

The injury pipeline is:

1. compute readiness/fatigue/load signals;
2. open risk windows only for eligible activities;
3. draw from `InjuryRng` or `MatchCoreRng` depending on source;
4. determine body area and severity separately;
5. persist injury state in Squad & Player;
6. emit structured events for Notification/Narrative.

Severity bands:

- `niggle`: 0-3 days, may be hidden or player-managed;
- `minor`: 1-14 days;
- `medium`: 2-8 weeks;
- `major`: 2-6 months;
- `season_threatening`: 6+ months;
- `chronic_flag`: recurrence risk and possible permanent
  `injury_proneness` increase.

## 6. Systemic world events

Events must be causal and scarce. The accepted rule is:

```text
eligible_events = events.where(trigger_context_matches)
weighted_events = eligible_events.apply(context_weights)
selected_events = apply_caps_cooldowns_and_priority(weighted_events)
emit_structured_domain_events(selected_events)
render_notifications_from_events()
```

Principles:

- **Eligibility first**: no event without prerequisites.
- **Weighting second**: context changes probability, not truth.
- **Cooldowns and scarcity**: no spam, no repeated crisis clones.
- **Causality over flavour**: many events are narrative renderings of
  existing states, not random surprises.
- **State before text**: a structured event exists before any inbox,
  newspaper or press copy.

Event classes:

| Class | Examples | Depth |
|---|---|---|
| Player/staff | training injury, mentoring breakthrough, unrest, breakthrough | full for active club; aggregated for background clubs |
| Club operations | venue booking, pitch wear, sponsor activation, fan protest | full for active club; key facts for rivals |
| World/league | takeover, rule change, market trend, weather series | league tick, sparse and capped |
| Narrative flavour | anniversary, ex-player visit, charity event | rendered only when caps allow |

## 7. Venue and 365-day arena operations

External checks support the trend toward stadiums as 365-day venues:

- Real Madrid's renovated Bernabeu generated major non-matchday revenue in
  2024, especially tours and experience products.
- Udinese and newer venue designs position stadiums as year-round event
  platforms with conferences, concerts and corporate spaces.
- The McKinsey and Barcelona Innovation Hub sources in the attached note
  support the same direction.

Final game model:

- Venue operations are part of Club Management, not a tycoon side-game.
- Non-matchday events are a calendar stream with setup/teardown windows.
- Events produce revenue but can create pitch wear, security cost,
  sponsor/fan effects, local pressure and match-prep conflicts.
- Weekly/event-based evaluation is enough. Do not simulate every catering
  shift or individual visitor.
- Good facilities reduce conflicts; bad logistics make revenue risky.

Venue event fields:

```ts
type VenueEventRule = {
  id: string
  type: 'concert' | 'conference' | 'fan_festival' | 'museum_special' | 'community_day'
  eligibilityTags: string[]
  setupDays: number
  teardownDays: number
  pitchImpactBp: number
  revenueRangeCents: [number, number]
  operatingCostCents: number
  sponsorAffinityTags: string[]
  fanSegmentEffects: Record<string, number>
  conflictRules: string[]
}
```

## 8. Narrative and AI text

[[narrative-content-pipeline]] remains authoritative:

- structured domain events first;
- compiled Markdown/frontmatter catalogues;
- ICU placeholders and typed message IDs;
- deterministic variant selection;
- build-time LLM assistance only.

Runtime AI-generated story text is **not approved** by this note. It is a
separate research track because it risks:

- breaking deterministic replay and save compatibility;
- requiring online access in an offline-first game;
- creating moderation and legal/IP issues;
- producing inconsistent localization or voice;
- diverging between multiplayer clients.

If researched later, runtime AI must be cosmetic-only, never produce facts,
never affect simulation state, be disabled in offline/strict deterministic
modes and be server-cached for multiplayer.

## 9. Simulation tier guidance

Use depth by relevance:

| Scope | Development/injury | Events/venue |
|---|---|---|
| Active human club | full weekly progression, full risk profile, full venue calendar | full director evaluation |
| Watched rivals | simplified progression, key injuries, major events | aggregated venue and board facts |
| Background clubs | monthly/seasonal aggregate deltas | rare major events only |
| Historical/archive | persisted facts only | no live evaluation |

This is a depth policy, not a new UI tier and not a replacement for Quick /
Standard / Expert progressive disclosure.

## 10. Implementation consequences

- Add ADR-0018 to lock the architecture.
- Reconcile gameplay docs so draft systems no longer contradict the locked
  attribute schema or narrative determinism.
- Extend feature planning with Player Lifecycle, Training & Medicine,
  Systemic Events and Venue Operations beats.
- Keep all examples IP-clean and fictional.

## 11. Open research tracks

- Runtime AI narrative text: separate research before any product approval.
- Fine-tuning injury frequency: needs statistical season simulation once the
  match engine and training loop exist.
- Personality schema expansion: only after the 8 hidden meta attributes are
  proven insufficient in playtests.
- Venue depth: decide after first stadium builder prototype whether Expert
  tier needs manual booking or only policy presets.
