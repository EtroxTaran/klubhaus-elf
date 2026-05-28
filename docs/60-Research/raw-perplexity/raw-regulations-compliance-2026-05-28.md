---
title: Raw - Regulations & Compliance Ownership Research (FMX-30)
status: raw
tags: [research, raw, perplexity, regulations, compliance, ffp, work-permits, bounded-context, fmx-30]
created: 2026-05-28
updated: 2026-05-28
type: raw-research
binding: false
linear: FMX-30
sourceType: perplexity
related:
  - [[../regulations-compliance-bounded-context-2026-05-28]]
  - [[../regulations-and-pyramids-research]]
---

# Raw - Regulations & Compliance Ownership Research (FMX-30)

> Three Perplexity queries run during FMX-30 to support the
> regulations-and-compliance ownership recommendation. Raw input; not
> implementation authority. Synthesis at
> [[../regulations-compliance-bounded-context-2026-05-28]].

## Why these queries

The 14-context bounded-context map has no Regulations context.
`regulations-and-compliance.md` (GDDR, draft 2026-05-16) designs concrete
regulations - FFP/PSR, work permits, home-grown quotas, transfer windows,
license-tier facility requirements, sanction frameworks - and even names a
`LeagueRegulationService.check(club, target_tier)` call surface in
§Promotion-gated compliance. But no context owns the rule catalog. Three
queries target the ownership decision:

1. **Genre precedent** - how do football sims model rules as data,
   eligibility-check chains, FFP computation, mid-save rule changes and
   community editors?
2. **DDD authority** - canonical pattern for cross-cutting regulatory /
   policy concerns; Vernon / Evans / Fowler; tax-catalog real-world
   analogue.
3. **Real-world grounding** - 2024-2026 regulatory landscape (UEFA SCR,
   Premier League PSR, La Liga cost control, GBE post-Brexit, home-grown
   quotas, sanction frameworks).

## Query 1 - Football management sim regulations modelling

### Prompt

How do football management simulations model regulations and compliance
(FFP/PSR, work permits/GBE, transfer windows, home-grown quotas, U-21
minimum, squad caps, license-tier facilities, salary caps)? Compare FM,
EA FC 24/25/26, OOTP, FIFA Manager, Anstoss. Sub-questions: (1) where
rules live as data? (2) eligibility-check chain on transfer completion?
(3) FFP / squad-cost-ratio computation? (4) mid-save rule changes? (5)
community editors and rule integrity?

### Output summary

- **Football Manager has the richest model** and is the closest genre
  precedent:
  - Rules live as **distributed data on Nation Rules + Competition
    Rules**, compiled by the **Advanced Rules editor** into the save's
    rule set. Not one global file; per-nation + per-competition.
  - Work permits / GBE-like rules live on Nations; squad caps, HG,
    U-21, registration windows, FFP/PSR on Competitions.
  - The Editor includes a **Test Rules** validator that rejects
    internally inconsistent rule sets (impossible promotion chains,
    inconsistent registration periods, contradictory FFP thresholds).
  - Multi-stage eligibility chain at registration: work permit
    (nation), transfer window (competition), squad cap (competition),
    HG / U-21 quotas at registration submission. No public evidence of
    a single monolithic `validateTransfer()`; discrete data-driven
    checks at multiple gates.
  - FFP is **competition-level rule data** consuming finance/ledger
    figures; FFP screens show "Profit & Loss over 3 years", "Projected
    FFP status", "FFP rules" - data thresholds + ledger inputs +
    sanctions catalog.
  - Mid-save rule changes work only via pre-authored **"future
    changes"** in the rules DB (e.g., new foreign limits starting
    season N). Patch-time rule changes require a new save; structural
    rule changes in patches are not retroactive.
  - Community editors (official FM Editor + community DBs) edit
    structured rule fields; cannot rewrite engine logic; Test Rules
    validator rejects invalid configurations.
- **EA FC Career** has a simpler / harder-coded model:
  - DB tables for league / competition / calendar / finance scalars.
  - No equivalent of FM Advanced Rules editor.
  - GBE / work permits **not deeply simulated**; older binary gates
    largely unused in modern versions.
  - No full UEFA FFP / Premier League PSR simulation; board
    objectives + budgets are the main "compliance" surface.
  - Mid-save structural rule changes require a new career.
- **OOTP Baseball** treats rules as **per-league settings on the league
  object** in the save file:
  - Roster size, foreign / age limits, service-time rules, salary
    cap, luxury tax thresholds, revenue sharing all configurable.
  - Eligibility checks at each roster operation block illegal moves.
  - Salary cap + luxury tax computed inside the **finance / contract
    module** against league-level rule data.
  - Mid-save rule changes supported via the in-game League Settings
    UI; engine reads rules per season/day, so changes apply forward
    immediately. (Unlike FM's compiled rules.)
- **FIFA Manager (classic)** simpler still: DB tables, hard-coded
  enforcement, no FFP authentic, basic window + squad-size checks.
- **Anstoß series**: binary DB + config files, fixed at game start,
  external editor only pre-career.

### Universal pattern observations

- All five titles treat rules as **structured data per
  league/competition**, not as monolithic global files.
- Eligibility checks are universally **multi-stage at multiple gates**
  (transfer, registration, line-up, season tick) - not a single
  monolithic call.
- FFP/SCR universally computed **inside the finance system** against
  per-competition rule thresholds.
- Mid-save structural rule changes universally require either
  pre-authored "future changes" (FM) or new careers (most others); only
  OOTP supports free mid-save editing.
- Community editors universally **edit data fields, not logic** -
  schema validation is the safety boundary.

### Citations Perplexity returned

- [1] kickinforhouston.com - work permits explained
- [2] mlaw.co.uk - FA work permit reforms
- [3] YouTube - FM rules tutorial
- [4] gis.sport - Premier League PSR / FFP explained
- [5] skysports.com - PSR rules explained
- [6] YouTube - FFP explained

### Confidence

**Medium-high.** Pattern is consistent across 5 independent titles. FM's
Advanced Rules editor is the strongest direct precedent for the FMX
design (data-driven rule catalog + editor with schema validation).
Source weakness on internal architecture flagged; behavioural evidence
(editor manual, modding tools) is solid.

## Query 2 - DDD canonical pattern for regulatory / policy / rule-catalog concerns

### Prompt

DDD canonical pattern for cross-cutting regulatory / compliance / policy
concerns across multiple bounded contexts? Sub-questions: (1) own
bounded context, Shared Kernel, ACL, or Published Language? (2)
versioned rule catalog with consumer-side application - what context
mapping? (3) real-world examples (Stripe Tax, Avalara, trading
compliance, insurance underwriting, GDPR/HIPAA registries). (4)
multi-context eligibility check (work permit + squad cap + HG + window):
Process Manager / Saga vs single query vs distributed events. (5)
community-defined rule overrides validation - Regulations BC or separate
Configuration / Import BC?

### Output summary

- **Regulations / policy / rule catalog is its own bounded context (a
  Supporting Subdomain).** Confirmed by Vernon and Fowler bounded-
  context discipline. **NOT** a Shared Kernel - the rule catalog is
  not shared model fragments but a *provider* consumed by many
  downstream contexts; Shared Kernel would create unwanted tight
  coupling.
- **Canonical context-mapping pattern:**
  - **Regulations BC = upstream** with **Open Host Service +
    Published Language** (formal rule types, scopes, parameters,
    version IDs, effective dates).
  - **Consumer BCs = downstream**, using:
    - **Conformist** when the consumer is happy to adopt the
      regulator's model directly (e.g., compliance reporting).
    - **Anticorruption Layer** when the consumer has its own rich
      model and wants to shield it from regulatory churn (e.g.,
      trading, underwriting, transfers).
- **Real-world DDD-aligned examples Perplexity surveyed:**
  - **Stripe Tax / Avalara** - Tax Regulations BC ingests jurisdiction
    tax rules + exposes Published Language; merchants' Billing /
    Checkout / Invoicing BCs consume via ACL.
  - **Trading-eligibility / compliance in fintech** - Compliance BC
    separate from Trading + Customer/Account; Trading calls
    Compliance via OHS or consumes `ComplianceEvaluated` events.
  - **Insurance underwriting rules** - Underwriting Policy BC owns
    criteria + scoring + versions; Policy Issuance / Quoting /
    Pricing BCs consume + apply to their own aggregates.
  - **GDPR / HIPAA registries** - Compliance / Privacy BC owns
    purposes + retention + consent types; Customer / Marketing /
    Data Warehouse BCs enforce per-aggregate via ACL.
- **Multi-context eligibility chain canonical pattern: Process
  Manager / Saga.**
  - Each BC owns its own eligibility logic and state (work permit
    rules in one BC, squad rules in another, HG in another, window in
    another).
  - The BC that owns the overall business process (e.g., Transfer)
    runs a **Process Manager** that orchestrates checks - synchronous
    calls or async event-driven Saga.
  - Process Manager owns *orchestration state*, not rule semantics.
  - Distinct from ACL which is for model translation, not
    orchestration.
  - Single "central Compliance god service" with all logic is **anti-
    pattern** - dilutes bounded contexts, creates anaemic Compliance
    aggregate.
- **Community-defined rule overrides validation:**
  - **Structural / schema validation** belongs to the Regulations BC
    (only it knows what a valid rule definition looks like).
  - **Semantic validation + merge** (override allowed? override
    conflicts?) also belongs to Regulations BC (it owns rule
    meaning).
  - A separate **Configuration / Import BC** is justified only if
    importing/authoring is itself a substantial subdomain (UI
    workflows, approvals, audit). Even then, the Import BC calls
    Regulations BC for final validation / merge.
- **Internal substructure inside Regulations BC**:
  - CoreRegulations submodule (official rule sources, versions).
  - Customizations / Overrides submodule (lifecycle, validation,
    approval).
  - Both share the same rule language + invariants.

### Citations Perplexity returned

- [1] cs.sjsu.edu - DDD lecture notes
- [3] martinfowler.com/bliki/BoundedContext.html (Fowler/Evans
  canonical)
- [4] deviq.com - DDD bounded context
- [5] Wikipedia - Domain-driven design
- [6] learn.microsoft.com - DDD intro (MSDN Magazine 2009)

### Confidence

**High.** Multiple DDD authorities cited (Fowler canonical bounded-
context page, Vernon strategic design, Microsoft Learn). Tax catalog
(Stripe Tax, Avalara) is the direct real-world analogue. Process
Manager / Saga for multi-context eligibility is textbook Vernon
*Implementing DDD*. Pattern is unambiguous.

## Query 3 - Real-world 2024-2026 regulatory landscape

### Prompt

2024-2026 regulatory landscape for professional football clubs: (1)
FFP / PSR / SCR thresholds (UEFA, Premier League, La Liga, Bundesliga
DFL). (2) Work permits / GBE post-Brexit. (3) Home-grown quotas. (4)
Transfer windows. (5) Squad registration caps. (6) License-tier
facility requirements. (7) Sanction frameworks. Cite recent sources.

### Output summary

- **UEFA Football Earnings Rule + Squad Cost Ratio (2025/26):**
  - Maximum €60m loss over rolling 3 years; squad cost ratio
    **70% of relevant revenue** for 2025/26.
  - UEFA control bodies compute; ongoing monitoring + annual reporting
    cycle.
- **Premier League PSR (2025/26):**
  - £105m maximum loss over 3 years (£90m owner + £15m club).
  - Exclusions: youth, women's football, infrastructure.
  - **PSR remains the domestic rule in 2025/26** - has NOT switched to
    squad cost ratio. Rolling 3-year accounting window.
- **La Liga cost control:**
  - **No single universal cap**; each club gets individualized squad-
    cost limit based on revenue / debt / spending commitments /
    projected financial capacity.
  - La Liga computes centrally; updated when club accounts / budgets
    reviewed; effectively before each registration period.
- **Bundesliga / DFL:** Licensing system, NOT pure SCR.
  - Economic, sporting, legal, administrative, infrastructure
    criteria.
  - Failure can block admission or trigger conditions.
- **Serie A / Ligue 1 / MLS:** Domestic licensing + financial control
  systems; European clubs still must comply with UEFA if qualified.
- **Work permits / GBE post-Brexit (UK):**
  - FA Governing Body Endorsement points model.
  - Points across: international appearances (senior team), club
    minutes (recent seasons), domestic league quality/strength, club
    continental performance, transfer fee + wage as proxy for player
    calibre.
  - Threshold check + Exceptions Panel for short-fall cases.
  - **No major 2025/26 GBE formula overhaul** documented.
  - **Football Governance Bill** (proposed) would create Independent
    Football Regulator with licensing + enforcement + fines (up to
    10% of turnover) - **separate from GBE**.
- **Home-grown quotas:**
  - **UEFA definition: trained at a club in the same national
    association for 3 years between ages 15 and 21.**
  - UEFA: 25 on List A + List B for younger players; home-grown
    requirement inside List A.
  - **Premier League: 25 + at least 8 home-grown.** Same training
    definition.
  - La Liga: registration tied to squad-cost control; HG less
    formalised as 8-of-25.
  - Bundesliga: no simple HG quota; licensing-based.
- **Transfer windows 2025/26:**
  - Summer: June to late August / early September (varies by league).
  - Winter: through January.
  - **UEFA squad registration deadlines** are decisive for European
    competition - a domestic signing may still be UEFA-ineligible.
  - Deadline-day: international transfer clearance + league
    registration + medical / docs before cut-off.
- **Squad registration caps:**
  - **UEFA: 25 on List A + List B** for eligible younger players.
  - **Premier League: 25-man squad** with at least 8 HG.
  - La Liga: tied to squad-cost control + federation registration.
  - Bundesliga: no simple 25-cap; licensing-based.
- **Facility / infrastructure requirements** (typical promotion-blocking
  / licence-blocking criteria):
  - Stadium safety certification.
  - Minimum capacity.
  - Floodlighting / lux levels.
  - Broadcast and media facilities.
  - Medical, dressing-room, spectator segregation.
  - Pitch quality + winterisation.
  - Access control, turnstiles, emergency planning.
  - DFL + UEFA Club Licensing both apply infrastructure criteria;
    failure blocks licence / admission.
- **Sanction frameworks:**
  - **UEFA financial:** fines, settlement agreements, squad
    restrictions, withholding prize money, exclusion from UEFA
    competitions (severe / repeated cases).
  - **Premier League PSR breach:** primarily **points deductions**,
    sometimes conditions on spending / budgets.
  - **La Liga cost control breach:** blocked player registration,
    forced salary reductions, inability to add players until limit
    restored.
  - **Bundesliga / licensing breach:** licence refusal, conditional
    licence, financial guarantees, admin penalties.
  - **Regulatory governance regimes (UK):** proposed regulator
    framework contemplates fines up to **10% of turnover** for
    non-compliance.
  - Useful distinction: **Premier League PSR has produced sporting
    sanctions; UEFA FSR more often uses financial sanctions + compliance
    settlements.**

### Citations Perplexity returned

- [1] paulhastings.com - new regulatory era for English football
- [2] paytechlaw.com - football compliance requirements
- [4] jdsupra.com - football financial regulation 2024-2026
- [5] acams.org - European football clubs under AFC regulation
- [6] dlapiper.com - multi-ownership football clubs regulatory
- [7] deloitte.com - Deloitte Football Money League

### Confidence

**High.** Multiple legal-firm sources (Paul Hastings, DLA Piper, JD
Supra) + Deloitte + ACAMS converge on current numbers. UEFA SCR 70%
for 2025/26 is well-documented. Premier League PSR £105m / 3 years
unchanged. La Liga per-club model, Bundesliga licensing model
consistent across sources.

## Combined implications for FMX-30 recommendation

1. **DDD answer is decisive (Query 2, high confidence) and matches FMX-26
   / FMX-28 pattern.** Regulations / policy / rule catalog as own
   bounded context is canonical Vernon. Tax-catalog real-world analogue
   (Stripe Tax, Avalara) is direct. Process Manager / Saga for
   multi-context eligibility is the textbook answer to the transfer-
   completion problem the FMX design exposes.

2. **Real-world regulatory landscape (Query 3, high confidence) confirms
   multi-regulator structure.** UEFA + national league + national
   association each maintain their own rule catalog (UEFA SCR + GBE
   points + Premier League PSR + La Liga cost control + Bundesliga
   licensing). A single Regulations BC owning a versioned catalog with
   per-regulator profiles fits the domain shape exactly. The 70% UEFA
   SCR + £105m Premier League PSR coexistence in 2025/26 demonstrates
   the catalog needs **regulator scope + competition profile** as
   first-class dimensions.

3. **Genre precedent (Query 1, medium-high confidence) confirms catalog-
   as-data with editor + schema validator.** FM Advanced Rules editor
   with Test Rules validator is the strongest direct precedent. Rules
   live distributed across nation + competition definitions, compiled
   into a save's rule set. The pattern matches a Regulations BC that
   owns the catalog schema + validation + versioning. Mid-save rule
   changes work via pre-authored "future changes" - this is **rule-set
   versioning by effective date** which a Regulations BC handles
   natively.

4. **Five-of-six DDD split criteria fire** (analog to FMX-26 / FMX-28):
   - Own ubiquitous language: regulation, rule, eligibility, sanction,
     licence tier, FFP indicator, SCR threshold, GBE score, HG share,
     transfer window, work permit, registration cap. ✓
   - Own lifecycle / state machine: rule sets versioned per season +
     regulator; transfer-window FSM (open → countdown → closing →
     closed); sanction lifecycle (warning → investigation → settlement
     → penalty). ✓
   - Own storage boundary: rule sets per country × tier × competition;
     window calendar; sanction catalog; license-tier facility
     requirements. ✓
   - Multiple consumers: Transfer (window + eligibility), Squad &
     Player (registration + HG), Club Management (FFP / SCR ratios +
     facility licence), League Orchestration (competition rules-of-
     match-day), Staff Operations (foreign-staff permits if modelled),
     Community Editor (rule overrides via ADR-0016). ✓
   - Cross-cutting role: every consumer queries Regulations. ✓
   - Co-change counterargument: rule sets change at season boundaries
     independent of any consumer's transactions. ✗ (split is
     justified)

5. **IP-safety surface contained.** All regulatory rule data lives in
   one context boundary. IP-clean review (GD-0015 + ADR-0007) applies
   to one Regulations module, not to scattered enforcement code.
   `risk:legal` label is contained.

6. **`LeagueRegulationService.check()` design hint resolves cleanly.**
   The naming in `regulations-and-compliance.md` §Promotion-gated
   compliance is consistent with the call surface a Regulations BC
   exposes via Open Host Service. The service name doesn't dictate the
   owner (it could be a thin facade); the catalog + check logic
   belongs in Regulations.

The combined evidence reinforces **Option B (Regulations & Compliance
as own bounded context, 15th)** as the recommendation. No finding
contradicts; the strongest cite (DDD, Query 2) actively supports it
with direct real-world analogues; FM's Advanced Rules editor is the
genre precedent and matches the catalog-as-data approach exactly.
