---
title: Regulations & Compliance Bounded Context - Ownership Synthesis 2026-05-28
status: draft
tags: [research, regulations, compliance, ffp, work-permits, bounded-context, fmx-30]
context: regulations-compliance
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
linear: FMX-30
sourceType: external
related:
  - [[raw-perplexity/raw-regulations-compliance-2026-05-28]]
  - [[regulations-and-pyramids-research]]
  - [[../50-Game-Design/regulations-and-compliance]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/GD-0009-league-structure]]
  - [[../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../50-Game-Design/squad-and-club-structure]]
  - [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
  - [[../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  - [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../10-Architecture/bounded-context-map]]
---

# Regulations & Compliance Bounded Context - Ownership Synthesis 2026-05-28

## Question

The bounded-context map has 14 ratified contexts after FMX-37 acceptance.
No context owns regulations and compliance. `regulations-and-compliance.md`
(GDDR draft) designs concrete regulations (FFP/PSR, work permits, home-
grown quotas, transfer windows, license-tier facilities, sanction
catalog) and even names a `LeagueRegulationService.check()` call surface
in §Promotion-gated compliance - but no context claims ownership of the
rule catalog, the eligibility-check chain, or the transfer-window FSM.

**Who owns regulations and compliance?**

## Status

This is a sourced ownership dossier for FMX-30. It does not change the
bounded-context map. The recommendation feeds a new draft ADR-0056
(`status: proposed`, `binding: false`) that Nico ratifies separately.

`raw research -> this synthesis -> ADR-0056 §Options + §Recommendation -> Nico decision`

## Summary

**Recommendation: Option B (Regulations & Compliance as own bounded
context, 15th).** Five-of-six DDD split criteria fire (own ubiquitous
language, own light FSM for window + sanction lifecycles, own storage
boundary for rule catalog + versions, multiple consumers including
Transfer / Squad / Club / League / Staff / Community Editor, cross-
cutting role). Vernon's canonical Tax-catalog pattern (Stripe Tax,
Avalara) is the direct DDD analogue. Real-world 2024-2026 regulatory
landscape (UEFA SCR 70% + Premier League PSR £105m + La Liga cost
control + Bundesliga licensing + GBE points) confirms multi-regulator
catalog structure. Genre precedent: FM Advanced Rules editor with Test
Rules validator is the closest direct precedent for the FMX design.
The carve also contains the IP-safety surface (`risk:legal`) in one
context, satisfying GD-0015 + ADR-0007.

## Findings

### Finding F1: The regulatory rule catalog is concretely designed but unattributed

- **Source:** [[../50-Game-Design/regulations-and-compliance]] §1-7;
  [[regulations-and-pyramids-research]] (country-by-country detail).
- **Confidence:** High (direct quotation).
- **Finding:** GDDR `regulations-and-compliance.md` (draft 2026-05-16)
  designs four rule categories:
  - **Squad rules**: home-grown minimum (e.g., 8 of 25), foreign player
    cap, work-permit abstract scoring, U-21 minimum for continental
    cups.
  - **Operations rules**: safety officer, security concept, anti-
    discrimination, alcohol policy per country.
  - **Infrastructure compliance**: capacity, floodlight, sanitary,
    press/media, hospitality, medical, pitch, connectivity.
  - **Finance compliance**: squad cost, debt, cash runway, arrears,
    reporting readiness.

  Country coverage matrix names Germany (Bundesliga → Verbandsliga deep),
  England (Premier → Step 7 via FA Ground Grading), France (LFP
  licensing), Italy (FIGC + UEFA), Spain (abstract profile), Other
  (generic fallback).

  Critically, §Promotion-gated compliance includes a documented call
  surface: **`LeagueRegulationService.check(club, target_tier)`** with
  consequence chain (compliant → confirmed; non-compliant → crash-build /
  special permit / ground-share / refuse).

- **Impact on FMX-30:** The catalog exists in design with concrete
  shape. The naming `LeagueRegulationService` hints at League ownership
  (Option A), but the service-name convention doesn't dictate the
  bounded-context owner. Per DDD (Finding F4), a regulatory catalog
  with own lifecycle + multiple downstream consumers is a Supporting
  Subdomain, hence its own bounded context (Option B).

### Finding F2: ADR-0050 Club Economy boundary requires regulatory facts but does not own them

- **Source:**
  [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]];
  [[../50-Game-Design/GD-0008-finance-economy]].
- **Confidence:** High.
- **Finding:** ADR-0050 (draft) names `LeagueLicenceFinancialCheckFailed`
  as one of the events Club Management consumes. GD-0008 §Country
  economy profiles states "Germany, England, France, Italy and Spain
  get profile-specific payment cadence, **licence/compliance and economy
  rules**, with an abstract fallback." ADR-0050's rule "Other contexts
  never write finance tables directly. They emit or request domain
  facts through public commands/events" applies symmetrically: a
  regulations source must emit the licence-check-result event for Club
  Management to consume.
- **Impact on FMX-30:** Club Management is **NOT** the regulations
  owner. It consumes regulatory verdicts (financial-check-failed events)
  but does not author or own the rule catalog. This rules out a hidden
  "Regulations inside Club Management" answer. Symmetrically, finance
  compliance ratio **inputs** (revenue, wage spend, transfer
  amortisation) come from Club Management's ledger; the threshold
  values + ratio formula + sanction trigger live in Regulations.

### Finding F3: Eligibility checks span multiple contexts - no single owner today

- **Source:** [[../10-Architecture/state-machines/transfer]] §1-2;
  [[../10-Architecture/state-machines/league-week]] §1-3;
  [[../50-Game-Design/squad-and-club-structure]] §4 (HG 8-of-25
  reference); [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  (staff lifecycle without permit mention).
- **Confidence:** High.
- **Finding:** A complete transfer-completion eligibility chain requires:
  - **Transfer window status** (currently League or Regulations?).
  - **Squad-size cap + foreign-player cap** (Squad & Player or
    Regulations?).
  - **Work permit / GBE eligibility** (was Transfer or Regulations?
    Staff Operations for non-playing staff?).
  - **Home-grown quota satisfaction** (Squad consumes; rule lives in
    Regulations).
  - **Registration window open** (League calendar consumes; rule lives
    in Regulations).
  - **License-tier compliance for the target competition** (Club
    Management for facility / financial; Regulations for the rule).

  Today, no context owns the **rule definitions** themselves. Each
  consumer would need its own copy of the rules - the exact duplication
  Vernon's bounded-context discipline warns against.

- **Impact on FMX-30:** The DDD-correct answer (synthesis F4) is a
  Process Manager / Saga inside Transfer that orchestrates checks
  against multiple BCs, **each of which queries Regulations for the
  applicable rule definitions**. Centralising the rule catalog and
  versioning is the carve; distributing the *enforcement* across
  consumers respects context isolation.

### Finding F4: DDD canonical pattern is decisive - Regulations as Supporting Subdomain bounded context

- **Source:** [[raw-perplexity/raw-regulations-compliance-2026-05-28]]
  Query 2; Martin Fowler bounded-context page; Vaughn Vernon
  *Implementing Domain-Driven Design*; Microsoft Learn MSDN Magazine
  2009 DDD primer.
- **Confidence:** High.
- **Finding:** Vernon-style strategic-design answer:
  - **Regulatory rule catalog is its own bounded context** -
    Supporting Subdomain.
  - **NOT a Shared Kernel** - the catalog is not shared model fragments
    but a *provider* consumed by many downstream contexts. Shared
    Kernel would create unwanted coupling across all consumers.
  - **Context-mapping pattern:**
    - Regulations BC = upstream with **Open Host Service + Published
      Language** (formal rule types, scopes, parameters, version IDs,
      effective dates).
    - Consumer BCs = downstream, using **Conformist** (compliance
      reporting) or **Anticorruption Layer** (Transfer, Squad, Club
      Management, Staff Operations with their own rich models).
  - **Multi-context eligibility chain canonical pattern: Process
    Manager / Saga.**
    - Each BC owns its own eligibility logic and state.
    - The BC owning the overall business process (Transfer) runs a
      Process Manager that orchestrates checks.
    - Process Manager owns *orchestration state*, not rule semantics.
    - Single "central Compliance god service" is anti-pattern.
  - **Real-world direct analogues** Perplexity cited:
    - Stripe Tax / Avalara as the canonical Tax Regulations BC pattern
      (ingest jurisdiction rules + Published Language + downstream
      Billing / Checkout / Invoicing via ACL).
    - Trading-eligibility / compliance in fintech.
    - Insurance underwriting rules.
    - GDPR / HIPAA policy registries.
- **Impact on FMX-30:** Strong direct DDD support for Option B
  (Regulations as own bounded context). The pattern matches the FMX
  problem shape exactly: versioned rule catalog with own lifecycle +
  multiple downstream consumers with their own rich models.

### Finding F5: Real-world 2024-2026 regulatory landscape is multi-regulator with distinct catalogs

- **Source:** [[raw-perplexity/raw-regulations-compliance-2026-05-28]]
  Query 3; Paul Hastings legal analysis; DLA Piper football regulation
  notes; ACAMS regulatory analysis; JD Supra financial regulation
  update; Deloitte Football Money League.
- **Confidence:** High.
- **Finding:** Multiple distinct regulators coexist in 2025/26:
  - **UEFA Football Earnings Rule + 70% Squad Cost Ratio** (max €60m
    rolling 3-year loss).
  - **Premier League PSR**: £105m allowable loss over 3 years (£90m
    owner + £15m club). Has NOT switched to SCR.
  - **La Liga cost control**: per-club individualised squad-cost
    limit based on revenue / debt / spending commitments.
  - **Bundesliga / DFL**: licensing system (economic + sporting +
    legal + administrative + infrastructure), NOT pure SCR.
  - **UK FA GBE points** for work permits: points across international
    appearances, club minutes, league quality, continental
    performance, transfer fee + wage proxy. Threshold + Exceptions
    Panel.
  - **UEFA home-grown definition**: 3 years at a club in the same
    national association between ages 15 and 21.
  - **Premier League squad cap**: 25 + at least 8 home-grown.
  - **UEFA squad registration**: 25 on List A + List B for younger
    players.
  - **Sanction frameworks per regulator** differ:
    - Premier League PSR breach → points deductions.
    - UEFA FSR breach → financial sanctions + compliance settlements
      + exclusion in severe cases.
    - La Liga cost control breach → blocked player registration.
    - Bundesliga licensing breach → licence refusal / conditional.
- **Impact on FMX-30:** The catalog needs **regulator scope** + **
  competition profile** + **effective date version** as first-class
  dimensions. A Regulations BC modelling each rule with `regulator`,
  `scope` (e.g., UEFA-CL-2025-26, EPL-2025-26, LaLiga-2025-26) and
  `effectiveFrom` / `effectiveTo` matches the domain shape exactly. A
  single rule catalog with versioning is the right architectural
  response to the multi-regulator reality.

### Finding F6: Genre precedent - FM Advanced Rules editor confirms catalog-as-data with schema validator

- **Source:** [[raw-perplexity/raw-regulations-compliance-2026-05-28]]
  Query 1 (FM Editor manual + advanced rules description).
- **Confidence:** Medium-high.
- **Finding:** FM models rules as **distributed data on Nation Rules +
  Competition Rules**, compiled by the **Advanced Rules editor** into
  the save's rule set. Key precedent points:
  - Work permits / GBE-like rules live on Nations.
  - Squad caps + HG + U-21 + registration windows + FFP/PSR live on
    Competitions.
  - The Editor includes a **Test Rules** validator that rejects
    internally inconsistent rule sets.
  - Multi-stage eligibility chain at registration: work permit
    (nation), transfer window (competition), squad cap (competition),
    HG / U-21 quotas at registration submission. **Multiple discrete
    data-driven checks at multiple gates** - no monolithic
    `validateTransfer()`.
  - FFP is competition-level rule data consuming finance/ledger
    figures; FFP screens read from the finance system against rule
    thresholds.
  - Mid-save rule changes via pre-authored **future changes** in the
    rules DB - rule-set versioning by effective date.
  - Community DBs and official DBs both edit structured fields;
    cannot break engine logic; **Test Rules validator** is the
    safety boundary.

  EA FC simpler / harder-coded (DB tables, no advanced rules editor);
  OOTP rich and editable mid-save via in-game League Settings;
  FIFA Manager / Anstoß minimal.
- **Impact on FMX-30:** FM is the strongest direct genre precedent.
  Its architecture - catalog-as-data + editor with schema validator +
  mid-save changes via pre-authored future changes - maps cleanly to
  a Regulations BC owning the catalog schema + validation + version-
  by-effective-date. The Test Rules validator is the canonical
  schema-validation responsibility Perplexity Query 2 assigned to the
  Regulations BC.

## Inputs For Decisions

If Option B is accepted, the following items encode in ADR-0056:

- **Context owner:** Regulations & Compliance as the next bounded
  context (15th if accepted before ADR-0052 / ADR-0054; 16th / 17th
  depending on acceptance order of those parallel drafts).
- **Owned aggregates:**
  - `RegulatoryProfile` aggregate (per regulator: UEFA, national
    league, national association; per competition; per tier;
    versioned by effective date).
  - `Rule` aggregate (each rule has type, scope, parameters, sanction
    catalog, version, effective range).
  - `TransferWindow` aggregate (FSM: scheduled → open → countdown →
    closing → closed; per competition; per season).
  - `WorkPermitCatalog` aggregate (per national association: GBE-
    points-equivalent scoring formula + threshold + exception
    procedures).
  - `SanctionCatalog` aggregate (per rule: warning → fine → points
    deduction → registration block → licence refusal escalation
    chain).
  - `LicenceTierRequirement` aggregate (per country × tier:
    infrastructure + finance + operations thresholds).
- **Public contract:**
  - Commands: `RegisterRegulatoryProfile`, `PublishRule`,
    `RetireRule`, `ScheduleTransferWindow`, `OpenTransferWindow`,
    `CloseTransferWindow`, `IssueSanction`, `ImportRuleOverride`.
  - Events: `RuleSetPublished`, `RuleSetSuperseded`,
    `TransferWindowOpened`, `TransferWindowClosed`,
    `SanctionIssued`, `RuleOverrideValidated`,
    `RuleOverrideRejected`.
  - Queries (read models):
    - `EligibilityForTransfer(player, fromClub, toClub, window, date)`
    - `WorkPermitScore(player, targetClub)` → score + threshold pass /
      fail
    - `HomeGrownStatus(player, club, date)` → home-grown / association-
      trained / neither
    - `SquadRegistrationCheck(club, registrationList, competition)` →
      pass / fail with violation breakdown
    - `LicenceTierCompliance(club, targetTier)` → pass / fail with
      remediation options
    - `FfpRatioCheck(club, regulator, periodEnd)` → ratio + threshold
      + projected breach if any
    - `CurrentTransferWindow(competition, date)` → open / countdown /
      closed
    - `SanctionsForBreach(rule, breach)` → escalation chain
- **Consumed facts:**
  - `EconomyWeekAdvanced`, `FinanceLedgerEntryPosted`,
    `LeagueLicenceFinancialCheckFailed` from Club Management
    (ADR-0050 ratified-or-draft) - inputs to FFP / SCR ratio
    computation.
  - `RogueliteRunStarted`, `RogueliteRunEnded`, `SeasonAdvanced` from
    League Orchestration - season boundaries trigger rule-set
    activation + window state machine.
  - `PlayerHomeGrownTimeAccumulated`, `PlayerRegistered` from Squad &
    Player - inputs to home-grown / association-trained eligibility.
  - `StaffContractSigned` (foreign staff hires - optional work-permit
    check) from Staff Operations.
  - `TransferOfferAccepted` from Transfer - triggers the eligibility-
    check Process Manager.
  - `CommunityRulePackImported` from Community Overlay Pipeline
    (FMX-33 territory; ADR-0016 surface) - triggers Override
    validation.
- **Storage scope:** mixed.
  - **Platform-scope cross-save catalog** for stock rule sets per
    country / competition / tier × effective date (these are part of
    `packages/game-data` per ADR-0021 / ADR-0027 conventions; per
    ADR-0051 determinism rule, copied into save at creation).
  - **Per-save** for active rule set chosen at save creation +
    community overrides applied to that save + sanction history.
- **Determinism:** rule sets are copied into the save snapshot at
  creation (analog to Manager & Legacy legacy seeds per ADR-0051). A
  running save reads only its own rule-set snapshot + applied future-
  changes pre-authored at creation. **No live reading of mutable
  global catalog during a save** - matches FM precedent and ADR-0051
  determinism discipline.
- **Eligibility-check pattern:** Process Manager / Saga inside Transfer
  context orchestrates checks against multiple BCs (Squad for HG +
  registration, Club Management for licence-tier + FFP, Regulations
  for window status + work permit + rule definitions). Each BC owns
  its enforcement; Regulations owns the rule.
- **Map patch proposal:** insert "Regulations & Compliance" as the
  next bounded context row in §1; add `Regulations` node + edges in
  §2 Mermaid (consumes Club Management ledger + Squad registration
  facts + League calendar; publishes rule definitions + sanctions to
  all consumers); add `regulations/` folder in §4 source mapping.
  Insert position depends on acceptance order of parallel ADR-0052 /
  ADR-0054 drafts; the patch is order-tolerant.

## Future-scope notes (classified future-scope)

Not ratification blockers; resolve in follow-up GDDR / ADR work:

1. **Era-specific rule sets for Manager & Legacy historical mode.**
   Pre-Bosman vs post-Bosman foreign-player limits, pre-FFP vs FFP
   eras. ADR-0051 Manager & Legacy legacy seeds could carry an
   `EraProfile` that selects which catalog version applies at save
   creation. Not blocking ratification.
2. **Real-time rule changes mid-save (UEFA changes SCR threshold).**
   FM precedent: future-changes pre-authored. FMX MVP follows the
   same pattern (immutable per save). Live rule churn via ADR-0030
   LLM-out-of-state and ADR-0017 observability is post-MVP.
3. **Community-pack rule overrides (ADR-0016 + FMX-33).** Schema
   validation belongs to Regulations BC per Vernon (synthesis F4).
   The Community Overlay Pipeline (FMX-33) handles import workflow;
   delegates validation + merge to Regulations. Cross-ticket
   coordination via the eventually-published FMX-33 dossier.
4. **AI-manager regulatory awareness.** Do AI clubs respect FFP /
   PSR / SCR? Per `bounded-context-map.md` §7 AI-manager note, AI
   behaviour is owned by League / Club / Transfer. AI consumers
   query Regulations the same way the human player does. Curve
   tuning post-MVP.
5. **Sport-specific rule extensions** (women's football calendar
   offset per GD-0009 R2-13; continental cup design per R2-06).
   Regulations BC schema supports the dimension; specific catalogs
   land as data updates.
6. **Sanction state machines** (multi-stage escalation: warning →
   investigation → settlement → penalty) are sketched but the exact
   FSM per regulator is playtest-tuned. Catalog has the shape;
   tuning is GDDR territory.
7. **IP-clean rule terminology audit.** GD-0015 + ADR-0007 IP-clean
   hardline applies. Regulations BC abstracts real-world rules
   (UEFA SCR 70% → "Continental Federation Cost Ratio 70%"). No 1:1
   copy of UEFA / FIFA / FA wording. Periodic audit by Nico or
   external IP review.

## Why not Option A (Sub-aggregate inside League Orchestration)?

League absorbs the regulations catalog as a sub-aggregate. Argument
for: `LeagueRegulationService.check()` naming in
`regulations-and-compliance.md` suggests this was the original mental
model; transfer windows + registration windows are seasonal events
aligned with League's calendar.

Arguments against:

- **Ubiquitous-language conflict.** League's existing scope is
  "season, week, match-day, mode, pause, quorum" (bounded-context-map
  §1) - orchestration language. Adding `rule`, `eligibility`,
  `sanction`, `licence tier`, `FFP ratio`, `SCR threshold`, `GBE
  score`, `home-grown share`, `work permit` introduces policy language
  with a different model. The same meaning-drift Evans warns about.
- **Multi-regulator catalog doesn't fit a single League's scope.** UEFA
  rules apply across multiple Leagues simultaneously; national
  association GBE rules apply across multiple competitions; FFP /
  SCR is competition-scoped but its computation reads Club Management
  ledger across all competitions. Putting this inside League
  privileges one regulator (the orchestrating League) over others.
- **Facility-licence rules belong with Club Management facts** (
  infrastructure thresholds against Club's infrastructure state).
  League doesn't own facilities. Putting facility-licence rules in
  League creates a cross-context join.
- **Staff work-permit rules** (if modelled per FMX scope) belong
  organisationally with FA / national association regulators, not
  with League.

The naming `LeagueRegulationService` reads naturally as **the service
that League uses to query Regulations** (façade or
Customer-Supplier endpoint), not necessarily as a sub-module inside
League.

## Why not Option C (Distributed across consumers)?

Each consumer owns its own compliance rules: Squad owns home-grown +
registration; Club owns FFP + facility; League owns windows + rules-
of-competition; Transfer owns transfer rules; Staff owns work permits.

Arguments against:

- **Rule definitions duplicated.** Multiple contexts would maintain
  their own copy of (e.g.) "8 of 25 home-grown for Premier League
  2025-26 = X". Catalog drift inevitable.
- **Cross-context coordination explodes.** FFP / SCR calculation needs
  Club's ledger + Transfer's amortisation + Squad's wages all
  reconciled - which context owns the formula? Without a single owner,
  the calculation has no canonical place.
- **IP-risk surface scattered.** GD-0015 + ADR-0007 IP-clean hardline
  must be applied everywhere. Containing it in one Regulations BC is
  much easier to audit.
- **Community-pack validation has no home.** ADR-0016 community-
  dataset-overrides expects a validator for regulatory rule pack
  imports; with distributed enforcement, where does the schema
  validator live? Vernon's answer (Query 2): in the Regulations BC.

## Why not Option D (Hybrid: thin Regulations Published-Language provider + per-consumer enforcement)?

Regulations BC owns the rule catalog and exposes a Published Language;
each consumer applies queries to their own state for enforcement.

Argument for: less coupling than Option B (no domain events from
Regulations).

Against: this is functionally **Option B as described in the
Recommendation** - Vernon's canonical OHS + Published Language pattern
already implies consumers apply rules to their own aggregates. The
distinction is artificial; if Regulations BC owns the catalog +
schema validation + window FSM + sanction catalog (which any
non-trivial implementation requires), it's a bounded context. Option D
collapses into Option B as soon as you add window state + sanction
lifecycle + community-override validation.

## What the ratification PR includes

Per the FMX-30 plan and
[[../30-Implementation/domain-research-workflow]] Phase 5:

- This synthesis note.
- The raw research at
  [[raw-perplexity/raw-regulations-compliance-2026-05-28]].
- A new draft ADR-0056 with four options, §Recommendation = Option B,
  Public-contract sketch, determinism + storage rules, §Map patch
  proposal as fenced diff.
- Decision-Log row for ADR-0056 (`proposed`).
- Current-State FMX-30 anchor block.
- Session handoff naming the ratify-ask:
  *"Accept Option B (recommended), choose A / C / D, or Defer?"*

The bounded-context map is **not** modified by this PR. The §Map patch
applies only on Nico's acceptance via a follow-up apply PR (analog
FMX-35 / FMX-36 / FMX-37).

## Related vault

- [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] -
  modular monolith ground rules.
- [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]] -
  per-save schema convention + platform-scope cross-save catalogs.
- [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - event delivery mechanism.
- [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] - IP-clean
  naming (regulations must abstract real-world wording).
- [[../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides]]
  - community pack override surface.
- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - Club Management ledger boundary; consumes regulatory verdicts +
  emits financial facts to Regulations.
- [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - cross-save legacy seeds at save creation determinism rule; era-
  specific rule profiles could carry through legacy seeds.
- [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  - foreign staff work-permit (future-scope) consumer.
- [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]] - U-21
  minutes eligibility (continental cups) consumer.
- [[../50-Game-Design/regulations-and-compliance]] - GDDR; designed
  catalog of rules (squad / operations / infrastructure / finance).
- [[../50-Game-Design/GD-0008-finance-economy]] - country profiles +
  licence/compliance rules.
- [[../50-Game-Design/GD-0009-league-structure]] - league structures +
  pyramid (Wave 2 opens R2-06 continental cups + R2-13 women's
  calendar).
- [[../50-Game-Design/GD-0015-ip-clean-data]] - IP-clean hardline.
- [[../50-Game-Design/squad-and-club-structure]] §4 - HG 8-of-25
  reference; consumer of Regulations queries.
- [[regulations-and-pyramids-research]] - prior country-by-country
  detail.
- [[../30-Implementation/domain-research-workflow]] - the workflow
  this dossier follows.
