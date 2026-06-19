---
title: ADR-0064 Scouting Activity Context
status: accepted
tags: [adr, architecture, ddd, scouting, recruitment, transfer, squad-club, intelligence-context, supporting-subdomain, fmx-27, accepted]
created: 2026-06-02
updated: 2026-06-19
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[ADR-0053-staff-operations-context]]
  - [[ADR-0055-tactics-context]]
  - [[ADR-0056-regulations-compliance-context]]
  - [[ADR-0060-youth-academy-context]]
  - [[ADR-0062-audience-and-atmosphere-context]]
  - [[../bounded-context-map]]
  - [[../transfer-market-architecture]]
  - [[../../50-Game-Design/scouting-and-recruitment]]
  - [[../../50-Game-Design/GD-0006-transfers]]
  - [[../../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../../60-Research/scouting-activity-bounded-context-2026-06-02]]
  - [[../../60-Research/manager-legacy-scouting-youth-feed-followups-2026-06-19]]
  - [[../../60-Research/raw-perplexity/raw-scouting-activity-bounded-context-2026-06-02]]
  - [[../../60-Research/raw-perplexity/raw-fmx-157-opposition-scouting-2026-06-19]]
  - [[../../60-Research/raw-perplexity/raw-fmx-157-handoff-schemas-2026-06-19]]
  - [[../../60-Research/raw-perplexity/raw-fmx-157-source-checks-2026-06-19]]
  - [[../../40-Execution/fmx-157-manager-legacy-scouting-youth-feed-decision-queue-2026-06-19]]
  - [[../../60-Research/transfer-market-simulation]]
  - [[../../30-Implementation/domain-research-workflow]]
---

# ADR-0064: Scouting Activity Context

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

## Date

- Proposed: 2026-06-02

## Context

FMX-27 (child of FMX-24, the bounded-context-gap research wave) resolves the
last unowned recruitment-adjacent subdomain: **scout *activity***. ADR-0052
(People, draft) already places the **Chief Scout / Data Analyst as a Person**
(identity + persona substrate + skill profile). What remains ownerless is the
*activity*:

- **Scout assignments** — routing a scout to a region / league / club / specific
  player + type filters; ongoing vs fixed-length missions; expiry / reassignment.
- **Scout-report lifecycle** — file → knowledge-% accumulation over repeat
  viewings → age → stale → refresh / re-scout.
- **Network coverage** — region / league coverage tiers driving discovery and
  baseline error.
- **Long-list / short-list** — persistent candidate collections with trust
  meter + last-update + role/tactic Impact context.
- **Hidden-flag surfacing** — when injury-proneness / personality / big-match
  temperament / adaptability / ambition become visible.

Today this activity is implicitly scattered: Transfer *consumes* scout output
(valuation-band confidence) but owns none of it (`transfer-market-architecture.md`
ownership table + persistence shape carry no `scout_*` concern); Squad & Player
owns the **Impact-Lens** read model that *reads* scouting facts; People owns only
scout identity. The binding game design (`scouting-and-recruitment.md` draft +
`GD-0006-transfers.md` approved) specifies the seven-step funnel, six scout
attributes, three report-opacity layers, persistent lists, scouting budget and
five hidden flags — but assigns no owner.

**Decisive constraint:** `bounded-context-map.md` §3.1 states the Squad-owned
`ImpactLensProjection` may combine scouting facts **only** through public
queries, published domain events, or denormalised inputs already copied into
Squad storage, and **MUST NOT query another context's internal tables**. This
rules out Option A (scouting buried inside Transfer would force Squad to read
Transfer internals) and presumes scouting is an *external publisher* of facts.

The research synthesis
[[../../60-Research/scouting-activity-bounded-context-2026-06-02]] (genre + DDD +
real-world, three Perplexity queries) finds the intelligence/gathering side
separates cleanly from the transaction/decision side, with **six-of-six DDD
split-criteria firing** (matches the FMX-29 / 32 / 33 wave high).

Map baseline: **19** bounded contexts after the FMX-32 ratification. ADR-0059
(Community Overlay) and ADR-0060 (Youth Academy) are still proposed/draft and
have not grown the map.

### HITL shaping decisions (Nico, 2026-06-02)

Nico answered the four shaping questions before this proposal was drafted; the
proposal incorporates them. They shape the *content*; this ADR's ownership
decision itself stays `proposed` / `binding: false` until Nico formally ratifies
(separate apply-PR flips status + applies the §Map patch), per the FMX-24 gate.

1. **Ownership = Option C** (own Scouting context).
2. **Opposition / match-prep scouting = recruitment-only now + a reserved
   published hook.** Opposition analysis stays coupled to Tactics / Match where
   consumed; Scouting reserves `OppositionScoutingRequested` as a placeholder.
   Mirrors FM's recruitment-scout vs analyst split.
3. **Youth boundary = Scouting discovers → Youth Academy intakes.** Scouting
   owns external discovery + reports for **all ages up to the academy gate**;
   Youth Academy (ADR-0060, if ratified) owns intake / cohort lifecycle once a
   prospect is taken in.
4. **Hidden flags = Scouting gates the reveal, owners keep the truth.**
   Underlying truth stays in People (persona) / Squad & Player (injury);
   Scouting owns only the confidence-gated reveal (`HiddenFlagSurfaced`) keyed
   to knowledge%. Facts arrive via query / event into Scouting's read view — no
   cross-context join.

## Options Considered

### Option A — Sub-aggregate in Transfer (`ScoutingActivity`)

Scout assignments, reports, coverage and lists live as aggregates inside the
Transfer context.

- **Coupling:** binds the noisy, probabilistic, long-running scouting model to
  Transfer's crisp, episodic, deadline-driven negotiation model.
- **Boundary rule:** **violates `bounded-context-map.md` §3.1** — Squad's
  Impact-Lens would have to read scouting facts that live inside Transfer's
  internal tables (forbidden) or Transfer would have to publish a whole second
  facade for Squad. Youth Academy would likewise have to reach into Transfer for
  discovery facts.
- **Language leak:** coverage tiers / report freshness / knowledge% pollute
  Transfer's offer / clause / window language.
- **Test isolation:** weak — scouting tests need Transfer fixtures.
- **DDD verdict:** fights the Q2 split signals (distinct language / lifecycle /
  KPIs / integrations) and the CRM-Lead-vs-Opportunity, ATS-vs-HR analogues.
- **Trade-off:** weakest. Only defensible if scouting were thin (a "known%"
  attribute on players) — but the binding GDDR funnel is far richer than that.

### Option B — Sub-aggregate in Squad & Player (`Assessment`)

Scouting lives next to the Impact-Lens inside Squad & Player, since scouts
produce assessments of *players*.

- **Coupling:** keeps scout→player data local to the Impact-Lens consumer (no
  §3.1 violation for Squad itself).
- **Bloat:** loads Squad & Player — today scoped to "player base data, fitness,
  morale, contracts, injuries" — with assignment routing, coverage maps, a
  report-aging FSM, network state and budget allocation that have nothing to do
  with the player base-data aggregate. Vernon small-aggregate rule fires.
- **Lifecycle mismatch:** the scouting weekly assignment/aging loop runs on a
  different rhythm than Squad's per-player state; co-change is low.
- **Other consumers still strangers:** Transfer and Youth Academy would now read
  scouting facts out of Squad & Player, conflating "what we own about our
  players" with "what we are learning about players we don't own."
- **DDD verdict:** a transitional state — once the scouting model has its own
  language + published surface + treats Squad as one of several consumers, you
  have effectively defined a separate context (Vernon IDDD ch. 7).
- **Trade-off:** better than A (no §3.1 violation) but still mislocates a
  cross-cutting intelligence layer inside a player-record context.

### Option C — Own bounded context (`Scouting`)

Carve Scouting as its own bounded context: People supplies scout *identity* by
query; Scouting owns scout *activity*; Transfer / Squad & Player / Youth Academy
/ Notification consume published read models + events.

- **Coupling:** clean. Own per-save schema (ADR-0027); Customer-Supplier + ACL
  to consumers; Published Language for `ScoutReportFiled` / `LongListUpdated` /
  `HiddenFlagSurfaced` / `CandidateIdentifiedForRecruitment`.
- **Boundary rule:** satisfies §3.1 — Impact-Lens reads scouting facts via
  published events / denormalised inputs, never internal tables.
- **Test isolation:** strongest — own schema + deterministic fixtures; no
  Transfer/Squad fixtures needed.
- **Service extractability:** matches ADR-0019 §5 — extraction is a deployment
  change.
- **Data sovereignty:** explicit — Scouting owns reports + knowledge% + coverage
  + lists + hidden-flag reveal ledger; consumers get views, accept eventual
  consistency.
- **DDD pattern:** Vernon supporting-subdomain / intelligence context; Evans
  Blue Book ch. 14 (different language → different BC); Fowler bliki (team/
  culture seams); the CRM-Lead-vs-Opportunity / observability-Telemetry-vs-
  Incident / **ATS-vs-HR** analogues all split gathering from transaction.
- **Genre + real-world anchor:** FM/EA/Anstoss/OOTP model scouting as a separate
  constrained-information system; modern clubs separate the recruitment/scouting
  intelligence function (head of recruitment + territory + data + loan scouts)
  from the negotiation/contract function.
- **Trade-off:** adds one bounded context (the 20th). Marginal cost (one extra
  module in the monolith; extraction = deployment change per ADR-0019 §5) is
  small against the coupling debt of A/B and the 6/6 DDD firing.

## Recommendation

**Option C — own Scouting bounded context.** Three converging arguments:

1. **Boundary correctness.** Only Option C respects `bounded-context-map.md`
   §3.1: scouting facts reach the Squad Impact-Lens (and Transfer valuation, and
   Youth Academy discovery) through published events / queries, never via a
   cross-context table join. Option A directly violates the rule; Option B keeps
   the rule for Squad only by mislocating a cross-cutting layer inside a
   player-record context.

2. **DDD criteria fire six-of-six.** Own language, own FSM (`ScoutAssignment` +
   `ScoutingReport`), own storage, multiple consumers (Transfer + Squad + Youth
   Academy + Notification + future Manager & Legacy), cross-cutting role, low
   co-change. Matches the FMX-29 / 32 / 33 wave high. The intelligence-vs-
   transaction split is canonical (CRM Lead vs Opportunity, ATS vs HR Core).

3. **Genre + real-world precedent.** Every studied title models scouting as a
   distinct information system with its own assignment/coverage/report-aging
   loop; modern clubs run a distinct scouting/recruitment-intelligence function
   feeding — not controlling — the transfer decision.

### Named risks

- **Map growth.** Adds the 20th bounded context (order-tolerant with the still-
  proposed ADR-0059 + ADR-0060; if those land first Scouting is the 21st/22nd).
  Modular monolith stays one process per ADR-0019; extraction = deployment
  change. Mitigation: ADR-0019 §5.
- **Coordination with consumers.** Transfer + Squad + Youth Academy +
  Notification consume scouting facts. Mitigation: Snapshot pattern on the
  candidate handoff (canonical Reference+Snapshot from FMX-28 Tactics); ACL on
  every consumer side.
- **People dependency (ADR-0052 still draft).** Scout identity is a Person.
  Mitigation: same pattern as Staff Operations (ADR-0053) — Scouting stubs scout
  identity from its own assignment roster until ADR-0052 ratifies, then queries
  People.
- **Hidden-flag truth ownership.** Scouting must not become a second source of
  truth for injury/personality. Mitigation: per HITL decision 4, Scouting owns
  only the confidence-gated *reveal*; truth stays in People / Squad & Player and
  arrives by query/event into Scouting's read view.
- **Youth-discovery overlap with ADR-0060.** Mitigation: per HITL decision 3,
  Scouting discovers up to the academy gate and hands off
  (`ExternalYouthProspectIdentified`); Youth Academy owns intake/cohort
  lifecycle. Clean producer→owner seam, order-tolerant with ADR-0060
  ratification.
- **Opposition-scouting scope creep.** Mitigation: per HITL decision 2,
  recruitment-only at MVP; `OppositionScoutingRequested` is a reserved
  placeholder, full opposition model deferred to a later Tactics-adjacent ticket.
- **FMX-157 pending handoff detail.** The follow-up packet
  [[../../60-Research/manager-legacy-scouting-youth-feed-followups-2026-06-19]]
  recommends that Scouting owns `ExternalYouthProspectIdentified` production
  and opposition-report execution/freshness, while Youth Academy and Tactics
  store consumer ACL snapshots. It also recommends a split opposition hook:
  Scouting produces the report, Tactics interprets it into match-plan /
  template inputs, and Match still consumes only frozen Tactics snapshots. This
  is binding after Nico approved FMX-157 D1-D6 on 2026-06-19.
- **Creative IP-safe naming.** No real scout, agency or data-provider names
  embedded as samples; sample names follow Nico's vault-wide evocative-but-
  clearly-not-real rule (GD-0015 + ADR-0007).

Status stays `proposed` / `binding: false` until Nico ratifies.

## Decision

Propose a dedicated **Scouting** bounded context.

If ratified, Scouting owns:

- **`ScoutAssignment` aggregate** (per-save, per-scout): scope (region / nation
  / competition / club / specific player) + type filters (position, role, age,
  contract status, min potential), purpose (recruitment / youth-discovery /
  *opposition — reserved hook*), mode (ongoing vs fixed-length), progress, cost,
  and an FSM (`active → completed | expired | cancelled | recalled`). Scout
  identity referenced as a People `ActorRef` (ADR-0052) — never owned here.
- **`ScoutingReport` aggregate** (per-save, per-club-per-player): per-club
  scouted *view* of a player distinct from the player's true profile;
  `knowledge%` confidence; banded vs numeric attribute estimates by opacity
  layer (`scouting-and-recruitment.md` §3 Layers 1–3); recommendation;
  role/tactic-fit + valuation-band confidence inputs; report FSM
  (`filed → refreshed → aged → stale → archived`) with a "last scouted on"
  clock.
- **`CoveragePlan` aggregate** (per-save, per-club): region / league coverage
  tiers (fully / partially / uncovered) derived from scouting-package level ×
  scout regional-knowledge; drives discovery probability + baseline report
  error.
- **`CandidateList` aggregate** (per-save, per-club): the persistent **long
  list** (broad, light-update) and **short list** (priority, deep-update) with
  per-entry trust meter, last-update, role/tactic Impact context, and
  persistence policy (keep N months / indefinitely / until window).
- **`HiddenFlagRevealLedger`** (per-save, per-club-per-player): which hidden
  flags (injury-proneness, big-match temperament, professionalism, adaptability,
  ambition) have crossed their **knowledge% reveal threshold** for this club.
  Stores *reveal state only* — the flag truth is read from People / Squad &
  Player, never owned here.
- **Process Manager / Saga** for the scouting loop: assignment progress tick →
  report knowledge accumulation → report aging / staleness evaluation → coverage
  recompute → list refresh → hidden-flag reveal evaluation → discovery of new
  candidates from covered regions.

Scouting does **not** own:

- **Scout / analyst identity, persona, skill profile** (owned by People per
  ADR-0052; Scouting references `ActorRef` + queries skill values).
- **Scout hire / fire / contract / wage** (owned by Staff Operations per
  ADR-0053; Scouting consumes the active-scout roster; Staff Operations emits
  wage events to the ledger).
- **Offer / negotiation / market-valuation bands / clauses / window**
  (owned by Transfer; Scouting *feeds* valuation-band confidence and hands off
  identified candidates, but does not negotiate).
- **Player base data / fitness / morale / contracts / injuries / Impact-Lens**
  (owned by Squad & Player; Scouting publishes scouting inputs the Impact-Lens
  consumes per §3.1; injury *truth* stays in Squad).
- **Youth intake / cohort lifecycle / academy investment** (owned by Youth
  Academy per ADR-0060; Scouting discovers external youth prospects up to the
  academy gate and hands off).
- **Opposition / match-prep analysis model** (recruitment-only at MVP;
  `OppositionScoutingRequested` reserved hook; full model deferred to a Tactics-
  adjacent ticket).
- **Finance ledger entries** (owned by Club Management per ADR-0050; scouting-
  budget expense posts via Customer-Supplier + ACL, same pattern as Staff
  Operations wages).
- **Inbox delivery** (owned by Notification per ADR-0043; Scouting emits events
  Notification renders).
- **Regulatory work-permit / eligibility rules** (owned by Regulations &
  Compliance per ADR-0056; Scouting may surface a work-permit-risk hint on a
  report by consuming `EligibilityForTransfer`, but owns no rule).

## Public contract direction

Draft commands:

- `AssignScoutToRegion` — route a scout to a region / league / club / player +
  type filters + purpose + mode.
- `RecallScout` / `CancelScoutAssignment` — end an assignment early.
- `RequestPlayerScouting` — "fully scout" a specific player to a knowledge
  threshold.
- `RefreshScoutReport` — re-scout a stale report (uses existing knowledge as
  baseline).
- `AddPlayerToLongList` / `PromotePlayerToShortList` / `RemoveFromList` /
  `SetListPersistencePolicy`.
- `AllocateScoutingBudget` — period budget across regions / player-types / depth
  / strategic targets (Chief-Scout default proposal overridable).
- `OppositionScoutingRequested` — **reserved placeholder** (recruitment-only at
  MVP; not implemented).

Draft events:

- `ScoutAssigned` / `ScoutAssignmentCompleted` / `ScoutAssignmentExpired`
- `ScoutReportFiled` *(consumed by Transfer for valuation-band confidence; by
  Squad & Player as an Impact-Lens scouting input per §3.1; by Notification for
  inbox copy)*
- `ScoutReportRefreshed` / `ScoutReportBecameStale`
- `LongListUpdated` / `ShortListUpdated`
- `HiddenFlagSurfaced` *(reveal-state only; consumed by Squad & Player + Transfer
  + Notification for risk-hint display)*
- `CandidateIdentifiedForRecruitment` *(consumed by Transfer — opens a
  `TransferTarget` / opportunity when a short-list entry crosses a rating
  threshold)*
- `ExternalYouthProspectIdentified` *(consumed by Youth Academy per ADR-0060 —
  hands a discovered youth prospect to the academy intake gate)*
- `CoverageTierChanged` *(internal projection event)*
- `ScoutingBudgetAllocated` *(consumed by Club Management ledger via ACL per
  ADR-0050)*

Draft read models:

- `ScoutReport` — per-club scouted view (knowledge% + opacity-layered estimates
  + recommendation + confidence + last-scouted). Consumed by Transfer + Squad &
  Player + Notification.
- `LongListBoard` / `ShortListBoard` — persistent candidate collections with
  trust meter + Impact context.
- `ScoutCoverageMap` — region/league coverage tiers (Expert-tier heat map per
  `scouting-and-recruitment.md` §9).
- `ScoutAssignmentBoard` — active assignments + progress + ETA.
- `RecruitmentNeedsBoard` — needs-analysis output (role gaps) feeding list
  curation (Recruitment Hub, `scouting-and-recruitment.md` §10).
- `HiddenFlagRevealState` — which flags are revealed per club-player.

Draft consumed facts:

- `PersonSkillProfile` / scout `ActorRef` from People per ADR-0052
  *(scout judging-ability / regional-knowledge / personality-reading drive
  report accuracy + knowledge-gain speed)*.
- `ActiveScoutRoster` from Staff Operations per ADR-0053 *(who is employed as a
  scout + specialisation)*.
- `PlayerTruthSnapshot` from Squad & Player *(true attributes + injury risk;
  masked/banded by knowledge% inside Scouting's report view — no table join)*.
- `MarketValuationBand` from Transfer *(scout report narrows the band; Scouting
  does not set market value)*.
- `EligibilityForTransfer` / work-permit status from Regulations & Compliance
  per ADR-0056 *(optional work-permit-risk hint on a report)*.
- `SeasonAdvanced` from League Orchestration *(weekly scouting tick scheduling +
  report aging)*.
- `SaveSnapshotInitialised` from Save creation per ADR-0027 + ADR-0051
  *(cross-save legacy + community-overlay scouting-network seeds at save
  creation only)*.

## Determinism and storage rules

- Scouting owns per-save tables only (`save_<uuidv7hex>` schema per ADR-0027).
  No platform-scope cross-save state.
- The scouted *view* (`ScoutingReport`) is strictly separate from the player's
  true profile (Squad & Player). True attributes are masked / banded by
  knowledge% **inside** Scouting's read view, populated via published events /
  queries — Scouting never joins across context tables (§3.1 + ADR-0019).
- Hidden-flag *truth* is never copied into Scouting; only the **reveal state**
  (threshold crossed yes/no per club-player) is stored. Display of a revealed
  flag reads truth from People / Squad & Player at query time.
- The weekly scouting loop uses a dedicated RNG sub-label
  `ScoutingRng(saveId, clubId, week)` of `WorldRng` per ADR-0018 §3 (discovery
  draws, knowledge-gain variance, report-error sampling). No cross-RNG draws. No
  `Math.random` / `Date.now` in simulation paths; report aging uses the
  deterministic clock per ADR-0027.
- `ScoutAssignment` and `ScoutingReport` FSMs are deterministic; the concrete
  FSM library (XState v5 — FMX-198 observes npm current stable 5.32.1, while
  Context7/Stately docs confirm the v5 actor/state-machine docs posture — vs a
  lightweight in-house deterministic FSM) is an **implementation-phase**
  selection, consistent with sibling context ADRs, and must re-verify currency
  at that time.
- Domain events emitted through the ADR-0028 transactional outbox; Transfer,
  Squad & Player, Youth Academy, Notification, Club Management consume via ACL.
- Cross-save legacy seeds (a starting scouting-network posture) and community-
  overlay scouting-network packs are copied into the save snapshot at creation
  only (ADR-0051 + ADR-0059 proposed); Scouting BC owns semantic validation per
  the Vernon canonical pattern (same as Regulations + Rivalry + Youth Academy).
- **IP-clean posture:** no real scout / agency / data-provider names embedded as
  samples (GD-0015 + ADR-0007).

## Rationale

Scouting is a first-class **supporting / intelligence subdomain**: an evolving,
confidence-rated, long-running information system that *feeds but does not
control* the transaction (Transfer) and assessment (Squad & Player) contexts.
The DDD authorities (Evans ch. 14; Vernon IDDD ch. 3 + 7 supporting-subdomain +
Customer-Supplier with ACL; Fowler bliki team/culture seams) and the enterprise
analogues (CRM Lead-vs-Opportunity, observability Telemetry-vs-Incident, **ATS
Talent-Acquisition-vs-HR-Core**) and the genre (FM/EA/Anstoss/OOTP constrained-
information scouting systems) and modern real-world club practice (distinct
recruitment-intelligence function) all converge: when a knowledge-gathering
subdomain has its own ubiquitous language, lifecycle/FSM, storage, multiple
consumers, cross-cutting role and low co-change, it deserves its own bounded
context.

Burying it in Transfer (Option A) violates the §3.1 Impact-Lens boundary
outright and leaks coverage/freshness/knowledge% into offer/clause/window
language. Nesting it in Squad & Player (Option B) keeps §3.1 for Squad only by
mislocating a cross-cutting intelligence layer inside a player-record context
and forcing Transfer + Youth Academy to read scouting facts out of Squad. The
marginal cost of Option C (one extra module; extraction = deployment change per
ADR-0019 §5) is small against that coupling debt, and the binding GDDR funnel is
far too rich for the thin-attribute shape that would justify A.

## Consequences

Positive:

- Clear owner for the assignment / report-lifecycle / coverage / list / hidden-
  flag-reveal model without polluting Transfer's negotiation language or Squad's
  player-record language.
- Satisfies the §3.1 Impact-Lens boundary by construction: scouting facts reach
  Squad / Transfer / Youth Academy through published events, never table joins.
- Contracts-first: commands, events, read models, consumed facts named at draft
  precision; Snapshot pattern on `CandidateIdentifiedForRecruitment` keeps
  Transfer loosely coupled.
- Clean producer→owner seams: People (identity) → Scouting (activity) → Transfer
  (negotiation) / Youth Academy (intake) — mirrors the real-world recruitment
  pipeline playtesters recognise.
- Hidden-flag reveal is a confidence gate, not a duplicate source of truth — no
  divergence from People / Squad & Player.
- Six-of-six DDD firing means the rich GDDR funnel lands in the architecturally
  correct owner from day one.

Negative:

- Adds one bounded context to the map (20th; 21st/22nd depending on landing
  order with ADR-0059 + ADR-0060).
- Event consumption across Transfer + Squad & Player + Youth Academy +
  Notification + Club Management; coordination grows.
- People (ADR-0052) + Youth Academy (ADR-0060) dependencies mean Scouting
  cannot fully express until those upstream ADRs ratify; until then scout
  identity is stubbed from the assignment roster and the youth-handoff event is
  emitted but unconsumed.
- Opposition-scouting is only a reserved hook; a later ticket must design the
  full opposition model and its Tactics/Match coupling.

## Map patch proposal

Order-tolerant proposal applied only when this ADR is accepted (separate
apply-PR). If ADR-0059 / ADR-0060 ratify first, Scouting renumbers accordingly;
`bounded-context-map.md` is **not** edited by this ADR's PR.

### §1 table — new row (insert after the Transfer row)

````diff
 | **Transfer** | Market valuation, opportunities, offers, clause packages, negotiation cases, deadlines, escalation | Transfer state, valuation bands, pressure signals, completed deals |
+| **Scouting** | `ScoutAssignment` Aggregate (region/league/club/player routing + type filters + purpose + ongoing/fixed FSM: active → completed/expired/cancelled/recalled), `ScoutingReport` Aggregate (per-club scouted view distinct from player truth; knowledge% + opacity-layered estimates; FSM: filed → refreshed → aged → stale → archived), `CoveragePlan` Aggregate (region/league coverage tiers), `CandidateList` Aggregate (persistent long-list + short-list), `HiddenFlagRevealLedger` (reveal-state only; truth read from People/Squad), Process Manager for the weekly scouting loop | `ScoutReport` / `LongListBoard` / `ShortListBoard` / `ScoutCoverageMap` / `ScoutAssignmentBoard` / `RecruitmentNeedsBoard` / `HiddenFlagRevealState` queries; `ScoutAssigned` / `ScoutReportFiled` / `ScoutReportRefreshed` / `ScoutReportBecameStale` / `LongListUpdated` / `ShortListUpdated` / `HiddenFlagSurfaced` / `CandidateIdentifiedForRecruitment` / `ExternalYouthProspectIdentified` / `ScoutingBudgetAllocated` events; Customer-Supplier + ACL to Club Management ledger per ADR-0050 |
````

### §1 prose — new paragraph

````diff
+Scouting was proposed 2026-06-02 via ADR-0064 (FMX-27). It owns scout
+*activity* — assignments, the scout-report lifecycle (file → age → refresh
+→ stale), network coverage tiers, the persistent long-list / short-list, and
+the confidence-gated hidden-flag reveal — distinct from scout *identity*
+(People, ADR-0052) and from negotiation (Transfer). It satisfies the §3.1
+Impact-Lens rule: Squad & Player consumes `ScoutReportFiled` as a published
+scouting input rather than joining Scouting's tables. Transfer consumes
+`CandidateIdentifiedForRecruitment` (Snapshot) to open opportunities and
+`ScoutReportFiled` for valuation-band confidence. Youth Academy (ADR-0060,
+proposed) consumes `ExternalYouthProspectIdentified` at the academy intake
+gate (Scouting discovers up to the gate; Youth Academy owns intake/cohort).
+Notification renders report-filed / new-target inbox items. Club Management
+posts scouting-budget expense via Customer-Supplier + ACL per ADR-0050.
+Staff Operations supplies the active-scout roster; People supplies scout
+skill profiles. Opposition / match-prep scouting is recruitment-only at MVP
+with a reserved `OppositionScoutingRequested` hook. Hidden-flag *truth* stays
+in People / Squad & Player; Scouting stores reveal-state only. Cross-save
+scouting-network seeds flow through ADR-0051 (legacy) + ADR-0059 (community
+overlay, proposed) at save creation only; Scouting BC owns semantic validation
+per Vernon. `risk:legal`-adjacent IP-clean hardline per GD-0015 + ADR-0007
+(no real scout / agency / data-provider names as samples).
````

### §2 high-level Mermaid — new node + edges

````diff
     Transfer["Transfer"]
+    Scout["Scouting"]
````

````diff
+    Squad --> Scout
+    Staff --> Scout
+    Scout --> Transfer
+    Scout --> Squad
+    Scout --> Notif
+    League --> Scout
````

(Edges to People and Youth Academy become valid when ADR-0052 / ADR-0060 land
their own nodes; ADR-0064 only introduces the `Scout` node + edges to / from
contexts already in the §2 Mermaid.)

### §3.1 Impact-Lens — clarifying note (no rule change)

````diff
 Per player-strength-presentation, `ImpactLensProjection` is a Squad & Player read model ... combine facts from tactics, training, match and scouting only through public queries, published domain events, or denormalised projection inputs ...
+(With ADR-0064, "scouting" here resolves to the Scouting bounded context's
+published `ScoutReportFiled` / `HiddenFlagSurfaced` events — never a join into
+Scouting's internal tables.)
````

### §4 source mapping — new folder

````diff
   transfer/
+  scouting/
   match/
````

### §5 prose — extraction order (no change required)

Scouting joins the "likely co-located unless a real scaling signal forces a
split" group per ADR-0019 §5.

## Supersedes

None — ADR-0064 introduces a new bounded context. It refines (does not
supersede) the accepted GDDR `scouting-and-recruitment.md` (Activity-Owner section
added in the same PR) and is downstream of ADR-0052 (People identity).

## Related Docs

- [[../../60-Research/scouting-activity-bounded-context-2026-06-02]] — decision
  basis (genre + DDD + real-world synthesis).
- [[../../60-Research/raw-perplexity/raw-scouting-activity-bounded-context-2026-06-02]] —
  raw research (Q1 genre, Q2 DDD, Q3 real-world) + FMX-18 tooling lookup.
- [[../../50-Game-Design/scouting-and-recruitment]] — GDDR refined with the
  Activity-Owner section.
- [[../../50-Game-Design/GD-0006-transfers]] — approved transfers GDDR
  (consumer of scouting output).
- [[../transfer-market-architecture]] — Transfer ownership table (Scouting is
  the missing producer of valuation-band confidence).
- [[../../60-Research/transfer-market-simulation]] — scout reports as valuation
  inputs.
- [[ADR-0052-people-persona-and-skills-context]] — scout *identity* (upstream).
- [[ADR-0053-staff-operations-context]] — scout hire/fire/wage; active-scout
  roster source; Customer-Supplier + ACL precedent.
- [[ADR-0060-youth-academy-context]] — youth intake gate (consumes
  `ExternalYouthProspectIdentified`).
- [[ADR-0055-tactics-context]] — opposition-template consumer (reserved hook).
- [[ADR-0056-regulations-compliance-context]] — work-permit / eligibility hint.
- [[ADR-0050-club-economy-accounting-ledger]] — scouting-budget expense via ACL.
- [[ADR-0043-notification-and-messaging-platform]] — report/inbox rendering.
- [[ADR-0018-systemic-events-and-player-lifecycle]] — RNG sub-label discipline
  (`ScoutingRng`).
- [[ADR-0019-modular-monolith-ddd]] — modular-monolith ground rules.
- [[ADR-0027-postgres-data-model]] — per-save schema convention.
- [[ADR-0028-postgres-transactional-outbox]] — event delivery.
- [[ADR-0062-audience-and-atmosphere-context]] — sibling context-spin-off ADR
  (format + FSM-library-deferral precedent).
- [[../bounded-context-map]] — target of the §Map patch proposal.
- [[../../30-Implementation/domain-research-workflow]] — six-phase workflow that
  produced this ADR.
- [[../../50-Game-Design/GD-0015-ip-clean-data]] — IP-clean hardline.
- Linear FMX-27 (this ticket) + parent FMX-24 + upstream FMX-23 / ADR-0052.
