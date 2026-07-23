---
title: ADR-0056 Regulations and Compliance Context
status: accepted
tags: [adr, architecture, ddd, regulations, compliance, ffp, work-permits, fmx-30, fmx-39, risk-legal, accepted]
context: regulations-compliance
created: 2026-05-28
updated: 2026-07-23
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0141-emergent-season-boundary-rule-evolution]]
  - [[ADR-0007-naming-schema]]
  - [[ADR-0016-community-dataset-overrides]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0053-staff-operations-context]]
  - [[ADR-0055-tactics-context]]
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../../50-Game-Design/regulations-and-compliance]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../50-Game-Design/GD-0009-league-structure]]
  - [[../../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../../50-Game-Design/squad-and-club-structure]]
  - [[../../60-Research/regulations-compliance-bounded-context-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-regulations-compliance-2026-05-28]]
  - [[../../60-Research/regulations-and-pyramids-research]]
---

# ADR-0056: Regulations and Compliance Context

## Status

accepted

## Date

2026-05-28 (proposed) · 2026-05-28 (FMX-39 accepted by Nico, Option B)

## Ratification

Nico accepted Option B on 2026-05-28 after reviewing the FMX-30 dossier
(PR [#93](https://github.com/EtroxTaran/klubhaus-elf/pull/93)).
The §Recommendation below names Option B; the synthesis at
[[../../60-Research/regulations-compliance-bounded-context-2026-05-28]]
documents the three converging arguments (DDD canonical Tax-catalog
pattern from Vernon + Stripe Tax / Avalara analogues, real-world
multi-regulator landscape 2024-2026, FM Advanced Rules editor genre
precedent).

Application:

- Status flipped `proposed` → `accepted`; `binding: false` → `true`.
- The §Map patch proposal that lived in this ADR was applied to
  [[../bounded-context-map]] in the same PR (FMX-39). Regulations &
  Compliance is now the **fifteenth bounded context** in the live map.
- The §Map patch proposal section is removed from this ADR as a result -
  its content lives in the map. Future amendments to the map go through
  normal ADR supersession ([[../../90-Meta/vault-governance]]).
- `risk:legal` label set on this ADR and the apply PR. IP-clean rule
  terminology (GD-0015 + ADR-0007 hardline) applies to the entire
  Regulations BC; periodic audit by Nico or external IP review.

## Context

The bounded-context map has fourteen ratified contexts after FMX-37
(ADR-0055 Tactics) acceptance. None owns regulations and compliance.

The GDDR `regulations-and-compliance.md` (draft 2026-05-16) designs
concrete regulations across four categories - squad rules (home-grown,
foreign cap, work permits, U-21), operations rules (safety, security,
discipline), infrastructure compliance (capacity, floodlight, media,
medical, pitch, connectivity), finance compliance (squad cost, debt,
cash runway, reporting). It even names a documented call surface:
**`LeagueRegulationService.check(club, target_tier)`** in §Promotion-
gated compliance, with a consequence chain (crash-build / special
permit / ground-share / refuse).

`bounded-context-map.md` §1 attributes none of this. Closest candidates
in the current map:

- **League Orchestration** owns "season, week, match-day, mode, pause,
  quorum" - calendar alignment but pure orchestration language.
- **Club Management** owns "finance ledger, accounting projections,
  budgets, infrastructure, sponsors, board, fans, insolvency state" -
  finance inputs but not the rule catalog. ADR-0050 names
  `LeagueLicenceFinancialCheckFailed` as a fact Club consumes;
  symmetrically the verdict must come from somewhere.
- **Transfer**, **Squad & Player**, **Staff Operations**, **Tactics**
  each consume regulations (transfer window, registration, work
  permits, HG, U-21 cup minutes) but none owns the rule catalog.

The real-world 2024-2026 regulatory landscape (synthesis F5) is
multi-regulator:

- **UEFA Football Earnings Rule + 70% Squad Cost Ratio** (max €60m
  rolling 3-year loss).
- **Premier League PSR** £105m / 3 years (£90m owner + £15m club) -
  still PSR in 2025/26, NOT switched to SCR.
- **La Liga cost control** - per-club individualised squad-cost limit.
- **Bundesliga / DFL** licensing system (economic + sporting + legal
  + administrative + infrastructure).
- **UK FA GBE points** for post-Brexit work permits.
- **UEFA home-grown** = 3 years at a club in the same national
  association between ages 15 and 21.
- **Premier League 25 + 8 HG**, **UEFA 25 on List A + List B**.
- **Sanction frameworks per regulator** differ (points deductions,
  financial sanctions, blocked registration, licence refusal).

The genre precedent (synthesis F6) is FM's Advanced Rules editor
storing rules as data per Nation + per Competition, compiled into the
save's rule set, with **Test Rules** schema validation. FM is the
closest direct precedent for the FMX design.

The
[[../../60-Research/regulations-compliance-bounded-context-2026-05-28]]
synthesis evaluates four options against DDD authorities (Vernon
strategic design + Open Host Service + Published Language + Process
Manager pattern), genre precedent and real-world structure.

## Options considered

### Option A - Sub-aggregate inside League Orchestration

League absorbs the regulations catalog. Naming hint from
`regulations-and-compliance.md` (`LeagueRegulationService`) suggests
this was the original mental model; transfer windows + registration
windows align with League's calendar.

- **Coupling:** weak - mixes orchestration language (season, week,
  fixture, quorum) with policy language (rule, eligibility, sanction,
  licence tier, FFP ratio, GBE score). Different model.
- **Test isolation:** weak - League's runtime FSM (week → match-day
  → resolved) and the rule catalog's editorial FSM share one context.
- **Service extractability:** weak - extraction would require carving
  the sub-aggregate later (Option B done after the fact).
- **Data sovereignty:** weak - multi-regulator catalog (UEFA + national
  league + national association) doesn't fit a single League's scope;
  facility-licence rules belong with Club Management's infrastructure
  state but the rules themselves would live in League.
- **Trade-off:** the `LeagueRegulationService` naming reads naturally
  as **the service that League uses to query Regulations** (a
  façade or Customer-Supplier endpoint), not as a League sub-module.

### Option B - New "Regulations & Compliance" bounded context

Carve a dedicated context owning the rule catalog (per regulator + per
competition + per tier + versioned by effective date), the transfer-
window FSM, the work-permit catalog, the sanction catalog and the
licence-tier facility requirements. Exposes Open Host Service +
Published Language. Each consumer (Transfer, Squad & Player, Club
Management, League Orchestration, Staff Operations, Tactics, Community
Overlay Pipeline) consumes via Conformist or Anticorruption Layer.
Multi-context eligibility chains (transfer completion, squad
registration, promotion compliance) run as Process Manager / Saga
inside the BC owning the overall business process - Transfer for
signings, Squad & Player for registration, League Orchestration for
promotion validation.

- **Coupling:** clean. Each consumer queries via published contract;
  rule definitions live in one place.
- **Test isolation:** strong. Regulations owns its own storage
  (platform-scope catalog per ADR-0027 + per-save snapshot per ADR-0051
  determinism rule).
- **Service extractability:** matches ADR-0019 §5 - extraction is a
  deployment change because all contracts are JSON-serialisable.
- **Data sovereignty:** explicit. Stock catalogs in `packages/game-
  data` per ADR-0021/0027 conventions; community-pack overrides via
  ADR-0016 surface; per-save active rule set copied at save creation
  per ADR-0051 determinism rule.
- **IP-safety surface contained.** GD-0015 + ADR-0007 IP-clean
  hardline applies to one context boundary - review surface for
  `risk:legal` is one module not scattered code.
- **Trade-off:** adds another bounded context. The map is at 14
  ratified + ADR-0052 (People) + ADR-0054 (Narrative) drafts. Adding
  Regulations brings the potential total to 17 if all four drafts
  ratify. Modular-monolith stays one process per ADR-0019 §5.

### Option C - Distributed across consumers

Each consumer owns its own compliance rules: Squad owns HG +
registration; Club owns FFP + facility; League owns windows + rules-
of-competition; Transfer owns transfer rules; Staff owns work permits.

- **Coupling:** locality is good in theory (Squad owns HG queries +
  HG rules) but rule definitions are duplicated across consumers.
- **Test isolation:** OK per context, but cross-context FFP / SCR
  calculation spans Club ledger + Transfer amortisation + Squad wages -
  no single home for the formula.
- **Service extractability:** every consumer's regulation code
  becomes a private dependency.
- **Data sovereignty:** weak - rule catalog drifts across consumers;
  IP-clean review is scattered.
- **Community-pack validation has no home.** ADR-0016 expects a
  schema validator; with distributed enforcement, where does it
  live?
- **Trade-off:** locality argument doesn't compensate for catalog
  drift and validation homelessness.

### Option D - Hybrid (thin Regulations Published-Language provider + per-consumer enforcement)

Regulations BC owns the rule catalog + exposes a Published Language;
each consumer applies queries to their own state for enforcement
without Regulations emitting domain events.

- **Trade-off:** this collapses into Option B as soon as we add
  window FSM + sanction lifecycle + community-override validation -
  any non-trivial implementation requires the same scope as Option B.
  The Published Language + per-consumer enforcement IS Option B as
  Vernon describes it (Customer-Supplier + Open Host Service + ACL).

## Recommendation

**Option B (Regulations & Compliance as own bounded context).** Three
converging arguments:

1. **DDD canonical pattern (synthesis F4) is decisive.** Vernon-style
   strategic design treats regulatory / policy / rule catalog as a
   **Supporting Subdomain bounded context** with **Open Host Service +
   Published Language** consumed by downstream BCs via **Conformist**
   or **Anticorruption Layer**. **NOT a Shared Kernel** - shared
   fragments would create unwanted coupling across all consumers.
   **Multi-context eligibility chain** runs as **Process Manager /
   Saga** in the consuming BC (Transfer for signings) - not as a
   central Compliance god service. The real-world direct analogue is
   **Stripe Tax / Avalara** (Tax Regulations BC with jurisdiction
   catalog + Published Language consumed by Billing / Checkout /
   Invoicing). Other named precedents: trading-eligibility / fintech
   compliance, insurance underwriting rules, GDPR / HIPAA policy
   registries. Five-of-six DDD split criteria fire affirmative.

2. **Real-world structural precedent (synthesis F5) confirms multi-
   regulator catalog.** UEFA + national league + national association
   each maintain their own rule catalog; FMX models five major
   leagues plus an abstract fallback (GDDR §Country coverage). The
   catalog needs **regulator scope** + **competition profile** +
   **effective date version** as first-class dimensions. A single
   Regulations BC owning a versioned multi-regulator catalog fits
   the domain shape exactly. Option A privileges one regulator (the
   orchestrating League); Option C distributes catalog ownership and
   loses single source of truth.

3. **Genre precedent (synthesis F6) mirrors the carve.** FM Advanced
   Rules editor stores rules as data per Nation + per Competition,
   compiled into the save's rule set, with **Test Rules** schema
   validation. Mid-save rule changes via pre-authored future changes
   in the rules DB. Community DBs and official DBs both edit
   structured fields with the same validator boundary. FM is the
   strongest direct precedent and its architecture maps cleanly to
   a Regulations BC owning catalog schema + validation + version-by-
   effective-date.

### Named risks

- **Map growth.** The map was 11 contexts on 2026-05-16. With FMX-
  25/26/28 ratified it is 14. Adding Regulations brings 15; if
  ADR-0052 People and ADR-0054 Narrative also ratify, the total is
  17. Modular-monolith stays one process per ADR-0019 §5; service
  extraction is a deployment change per ADR-0019 §5.
- **IP-clean rule terminology.** GD-0015 + ADR-0007 IP-clean
  hardline must apply to all rule wording. The Regulations BC
  contains the IP review surface to one context - that's a benefit -
  but periodic Nico / external IP audit is still required.
  `risk:legal` label is set on this ADR + the apply-PR.
- **Process Manager / Saga complexity in Transfer.** The eligibility-
  chain orchestration (work permit + squad cap + HG + window status
  + financial-fit pre-check) is non-trivial. ADR-0053 (Staff
  Operations) shows the Customer-Supplier + ACL pattern works; we
  apply the same here. Curve tuning is GDDR territory.
- **Catalog versioning + future-changes pre-authoring.** FM precedent
  is clear (synthesis F6); we follow the same pattern. Mid-save live
  rule churn is post-MVP per `regulations-and-compliance.md` Open
  items.

Status stays `proposed` / `binding: false` until Nico ratifies.

## Decision

Propose a dedicated **Regulations & Compliance** bounded context.

If ratified, Regulations & Compliance owns:

- `RegulatoryProfile` aggregate (per regulator: UEFA-analogue,
  national league analogue, national association analogue; per
  competition; per tier; versioned by effective date).
- `Rule` aggregate (each rule has type, scope, parameters, sanction
  catalog, version, effective range).
- `TransferWindow` aggregate (FSM: scheduled → open → countdown →
  closing → closed; per competition; per season).
- `WorkPermitCatalog` aggregate (per national association: GBE-
  points-equivalent scoring formula + threshold + exception
  procedures).
- `SanctionCatalog` aggregate (per rule: warning → fine → points
  deduction → registration block → licence refusal escalation chain).
- `LicenceTierRequirement` aggregate (per country × tier:
  infrastructure + finance + operations thresholds).
- `CommunityRuleOverrideValidation` policy (schema + semantic
  validation per Vernon's Regulations-BC responsibility synthesis F4).

Regulations & Compliance does **not** own:

- The transfer-completion orchestration itself (Transfer context owns
  the Process Manager; Regulations is queried).
- The squad-registration orchestration (Squad & Player owns the
  registration submission; Regulations is queried for caps + HG +
  foreign limits).
- The promotion compliance orchestration (League Orchestration owns
  the promotion decision; Regulations is queried for licence-tier +
  facility + finance thresholds).
- The finance ledger inputs (Club Management owns the ledger per
  ADR-0050; Regulations consumes facts + computes ratios against
  thresholds).
- Squad-state-related facts: who has accumulated HG eligibility time,
  who is registered to which competition list (Squad & Player owns;
  Regulations defines the rule).
- Match-day eligibility verdicts at line-up lock (Match consumes via
  query; Regulations returns the eligibility predicate).
- Community pack import workflow (FMX-33 Community Overlay Pipeline
  owns import; delegates validation + merge to Regulations per Vernon
  guidance).
- AI-manager regulatory awareness curves (League / Club / Transfer
  AI consumers per `bounded-context-map.md` §7; Regulations exposes
  the rule via query).

## Public contract direction

Draft commands:

- `RegisterRegulatoryProfile`
- `PublishRule`
- `SupersedeRule`
- `RetireRule`
- `ScheduleTransferWindow`
- `OpenTransferWindow`
- `CloseTransferWindow`
- `IssueSanction`
- `RegisterLicenceTier`
- `ImportRuleOverride` (consumed from FMX-33 Community Overlay
  Pipeline)

Draft events:

- `RuleSetPublished`
- `RuleSetSuperseded`
- `TransferWindowOpened`
- `TransferWindowCountdownStarted`
- `TransferWindowClosed`
- `SanctionIssued`
- `LicenceTierRequirementsUpdated`
- `RuleOverrideValidated`
- `RuleOverrideRejected`

Draft read models:

- `EligibilityForTransfer(player, fromClub, toClub, window, date)` -
  composite verdict: passes / fails with violation breakdown.
- `WorkPermitScore(player, targetClub)` - score + threshold + pass /
  fail.
- `HomeGrownStatus(player, club, date)` - home-grown / association-
  trained / neither + supporting evidence.
- `SquadRegistrationCheck(club, registrationList, competition)` -
  pass / fail with per-rule violation breakdown.
- `LicenceTierCompliance(club, targetTier)` - pass / fail with
  remediation options (matches GDDR §Promotion-gated compliance
  consequence chain: crash-build / special permit / ground-share /
  refuse).
- `FfpRatioCheck(club, regulator, periodEnd)` - ratio + threshold +
  projected breach + remaining headroom.
- `CurrentTransferWindow(competition, date)` - open / countdown /
  closed.
- `SanctionsForBreach(rule, breach)` - escalation chain.
- `EffectiveRuleSet(save, regulator, competition, date)` - the rule
  set the consumer should apply at this point in the save.

Draft consumed facts:

- `EconomyWeekAdvanced`, `FinanceLedgerEntryPosted`,
  `LeagueLicenceFinancialCheckFailed` from Club Management (ADR-0050
  draft) - inputs to FFP / SCR ratio computation.
- `RogueliteRunStarted`, `RogueliteRunEnded`, `SeasonAdvanced` from
  League Orchestration - season boundaries trigger rule-set
  activation + window state machine.
- `PlayerHomeGrownTimeAccumulated`, `PlayerRegistered` from Squad &
  Player - inputs to home-grown / association-trained eligibility.
- `StaffContractSigned` (when foreign-staff work-permit modelled) from
  Staff Operations (ADR-0053).
- `TransferOfferAccepted` from Transfer - triggers the eligibility-
  check Process Manager that Transfer runs.
- `MatchLineupLocking` from Match - last-gate eligibility verification
  for line-up validity.
- `CommunityRulePackImported` from Community Overlay Pipeline (FMX-33
  territory; ADR-0016 surface) - triggers Override validation.

## Determinism and storage rules

- Stock rule catalogs live in `packages/game-data` per ADR-0021 /
  ADR-0027 conventions: per country × competition × tier × effective
  date.
- At save creation, the active rule set is **copied into the save
  snapshot** per ADR-0051 determinism rule. A running save reads only
  its own rule-set snapshot + applied future-changes pre-authored at
  creation. **No live reading of mutable global catalog during a
  save.**
- Per-save storage: active rule set + community overrides applied to
  that save + sanction history + window state history. All in
  `save_<uuidv7hex>` schema per ADR-0027.
- Community-pack overrides flow through ADR-0016 surface (FMX-33
  Community Overlay Pipeline). Regulations BC validates schema +
  semantics + merges into the save's rule set at save creation. After
  save creation, the rule set is immutable except for pre-authored
  future-changes that activate at predetermined dates. **Amended by
  ADR-0141 (FMX-243):** future-changes may be **either** pre-authored at
  creation **or** emergently authored in-world (governing-body
  ratification); both arm only at a season boundary, so mid-season
  immutability and catalog isolation are unchanged.
- Eligibility-check pattern: Process Manager / Saga in the BC owning
  the overall business process. For transfer completion: Transfer
  runs the Saga, querying Regulations for window status + work permit
  + rule definitions, querying Squad & Player for HG accumulation +
  current registration, querying Club Management for licence-tier +
  FFP / SCR ratio - then applying the composite verdict. Each BC
  owns its enforcement against its own aggregate; Regulations owns
  the rule.

## Rationale

Regulations modelling has three structural properties that DDD
canonically resolves as "own bounded context":

1. **Own ubiquitous language** - rule, eligibility, sanction, licence
   tier, FFP ratio, SCR threshold, GBE score, HG share, transfer
   window, work permit, registration cap. These terms have specific
   meaning only in the policy domain; consuming contexts speak a
   different language (player, contract, fixture, ledger entry).
2. **Own lifecycle independent of any consumer** - rule sets are
   versioned per season + regulator with effective-date ranges;
   transfer windows have their own FSM; sanctions have their own
   escalation lifecycle. None of these change in lockstep with any
   single consumer's transaction.
3. **Multiple consumers each with their own rich model** - Transfer
   owns its negotiation FSM, Squad & Player owns player attributes
   and registration state, Club Management owns the ledger, Staff
   Operations owns staff contracts, Tactics owns set-piece routines
   subject to eligibility for continental competition U-21 minutes,
   Community Overlay Pipeline owns import workflow. Each consumes
   regulations differently and applies the rules to its own
   aggregates.

Vernon's canonical Tax-catalog pattern (Stripe Tax, Avalara) is the
direct DDD analogue. Real-world multi-regulator structure (UEFA SCR +
Premier League PSR + La Liga cost control + Bundesliga licensing + GBE
points) confirms the domain shape. FM's Advanced Rules editor with
Test Rules validator is the genre precedent.

The marginal cost (one more context in the modular monolith) is small
compared with the alternatives (rule duplication across consumers in
Option C, ubiquitous-language conflict in Option A, or the same scope
as Option B without the structural clarity in Option D).

## Consequences

Positive:

- Clear owner for the rule catalog (multi-regulator + versioned),
  transfer-window FSM, work-permit catalog, sanction catalog and
  licence-tier requirements.
- Contracts-first path: commands, events, read models, consumed facts
  all named at draft precision.
- ADR-0050 `LeagueLicenceFinancialCheckFailed` event acquires a
  defined producer (the Regulations BC consuming Club Management
  ledger facts + checking against thresholds).
- `LeagueRegulationService.check()` design hint from GDDR resolves
  cleanly: it's a façade / Customer-Supplier endpoint that League
  uses to query Regulations.
- IP-safety surface (`risk:legal`) contained in one bounded context;
  GD-0015 + ADR-0007 audit is one module not scattered code.
- Community-pack rule override validation has a defined home
  (Regulations BC handles schema + semantic validation + merge per
  Vernon).
- Real-world multi-regulator structure (UEFA + national league +
  national association) is natively modelled.
- Mid-save rule changes via pre-authored future-changes follow FM
  precedent and ADR-0051 determinism discipline.
- Mirrors real-world Sporting Director / compliance officer role
  separation - playtesters recognise the model.

Negative:

- Adds one bounded context to the map (15th if accepted before
  ADR-0052 / ADR-0054; 16th / 17th depending on acceptance order).
- IP-clean rule terminology requires careful authoring (GD-0015 +
  ADR-0007 hardline) and periodic audit. `risk:legal` label is set.
- Process Manager / Saga complexity in Transfer for the eligibility-
  check orchestration. Pattern is well-established (ADR-0053 Staff
  Operations shows the Customer-Supplier + ACL approach works); curve
  tuning is GDDR territory.
- Stock catalog content must be authored as fictional rule profiles
  (no 1:1 copy of UEFA / FIFA / FA wording). Quality requires
  domain-expert authoring (Nico + research input) per `risk:legal`.
- Catalog versioning + future-changes pre-authoring is non-trivial
  data engineering; FM precedent shows the pattern works.

## Supersedes

None

## Related Docs

- [[../../60-Research/regulations-compliance-bounded-context-2026-05-28]]
  - FMX-30 ratification synthesis (this ADR's decision basis).
- [[../../60-Research/raw-perplexity/raw-regulations-compliance-2026-05-28]]
  - FMX-30 raw research (genre / DDD / real-world surveys).
- [[../../60-Research/regulations-and-pyramids-research]] - prior
  country-by-country regulatory detail.
- [[../../50-Game-Design/regulations-and-compliance]] - GDDR; designed
  catalog of rules + `LeagueRegulationService.check()` call surface +
  promotion-gated compliance consequence chain.
- [[../../50-Game-Design/GD-0008-finance-economy]] - country profiles
  + licence/compliance rules; FFP/PSR hooks.
- [[../../50-Game-Design/GD-0009-league-structure]] - league
  structures; Wave 2 opens R2-06 continental cups + R2-13 women's
  calendar.
- [[../../50-Game-Design/GD-0015-ip-clean-data]] - IP-clean hardline.
- [[../../50-Game-Design/squad-and-club-structure]] §4 - HG 8-of-25
  reference; consumer of Regulations queries.
- [[ADR-0007-naming-schema]] - IP-clean naming.
- [[ADR-0016-community-dataset-overrides]] - community pack override
  surface (FMX-33 Community Overlay Pipeline territory).
- [[ADR-0019-modular-monolith-ddd]] - bounded-context discipline.
- [[ADR-0027-postgres-data-model]] - per-save schema convention;
  platform-scope cross-save catalogs.
- [[ADR-0028-postgres-transactional-outbox]] - event delivery
  mechanism.
- [[ADR-0050-club-economy-accounting-ledger]] - Club Management
  ledger boundary; consumes regulatory verdicts + emits financial
  facts to Regulations.
- [[ADR-0051-manager-and-legacy-context]] - cross-save legacy seeds
  determinism rule; era-specific rule profiles via legacy seeds
  future-scope.
- [[ADR-0053-staff-operations-context]] - foreign staff work-permit
  consumer (when modelled).
- [[ADR-0055-tactics-context]] - U-21 minutes eligibility (continental
  cups) consumer.
- [[ADR-0052-people-persona-and-skills-context]] - parallel draft; no
  direct boundary requirement.
- [[ADR-0054-narrative-context-and-ai-narration-framework]] - parallel
  draft; no direct boundary requirement.
