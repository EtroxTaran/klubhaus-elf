---
title: Loan Cap and Obligation Catalog
status: current
tags: [research, synthesis, transfer, loan, regulations, obligation-to-buy, deterministic, fmx-155]
context: [transfer, regulations-compliance]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-155
related:
  - [[raw-perplexity/raw-loan-cap-obligation-catalog-2026-06-16]]
  - [[raw-perplexity/raw-loan-cap-obligation-source-checks-2026-06-16]]
  - [[../40-Execution/fmx-155-loan-cap-obligation-catalog-decision-queue-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../50-Game-Design/GD-0006-transfers]]
  - [[../50-Game-Design/regulations-and-compliance]]
  - [[../10-Architecture/state-machines/loan-orchestration]]
---

# Loan Cap and Obligation Catalog

## Scope

FMX-155 closes ADR-0075's deferred Regulations data follow-up. It defines the
accepted shape of:

- a Regulations-owned, layered `LoanRegulationProfile` sufficient for
  `LoanCapVerdict`; and
- a focused, deterministic `ObligationConditionCatalog` sufficient for
  `EvaluateObligationToBuy`.

It does not tune loan-quality weights, playing-time thresholds, recall penalty
magnitudes or AI valuation. Those remain FMX-52 / GD-0043 calibration inputs.

## Source-backed synthesis

FIFA's current public RSTP text and explainer support the global baseline:
international loan rules are built around written agreements, window-bounded
duration, no sub-loans, anti-hoarding caps, a same-counterparty cap and a young
club-trained exemption. FIFA also explicitly allows domestic loan systems to
have different limits if they follow the same youth-development, integrity and
anti-hoarding principles.

Domestic public sources confirm that a single hard-coded table would be brittle:

- England-like rules need a strict domestic layer: two incoming domestic loans
  at once, four in a season, one from the same club, same-window acquisition
  restriction and goalkeeper-specific limit.
- Germany-like rules need a youth-development layer: a national six-player
  loan quota plus local-player and U21/U23 development exemptions.
- France-like rules need asymmetric domestic totals: five incoming, seven
  outgoing, two to the same club, plus the international six/six cap.
- Italy-like and Spain-like values are source-weaker in this pass. FMX should
  still ship IP-clean profile presets for them, but mark them as fictional
  design profiles that require later legal/source review before public legal
  claims.

Sports Interactive's Football Manager manual is the strongest comparable-game
source. It supports loan offers with duration, wage contributions, playing and
non-playing fees, future fee, role intent, parent-match/cup/early-termination
considerations and playing-time expectation. That validates FMX's choice to
model loans as a full deal package while keeping the rule/cap verdict in
Regulations.

## Accepted FMX-155 decisions

Nico accepted the recommended packet on 2026-06-16:

| ID | Decision | FMX consequence |
|---|---|---|
| D1 | Layered profiles | `LoanRegulationProfile` is a global FIFA-style baseline plus domestic profile overlays. |
| D2 | Focused obligation catalog | V1 supports appearances/minutes, team promotion/survival/qualification and fixed option window; no rich KPI/nested custom engine. |
| D3 | Regulations profile owner | Regulations & Compliance owns profile data and condition catalog; Transfer queries and evaluates against logged facts. |
| D4 | Static snapshot | Save creation copies the active profile/catalog into the per-save rule snapshot; no mid-save live legal update feed. |
| D5 | Exact inspectable visibility | Contracts expose exact triggers and verdict reasons in Standard/Expert; Quick gets terse pass/fail badges and warnings. |

## Data model recommendation

`LoanRegulationProfile` is a Regulations-owned rule profile, not Transfer
business logic.

```text
LoanRegulationProfile =
  profileId
  profileVersion
  scope: globalBaseline | domesticOverlay
  countryProfile
  competitionProfile?
  seasonRange
  ruleSourceKind: stock | communityOverride
  ruleTextClass: fmxFictionalProfile | sourceCheckedReference
  capTotals
  pairCaps
  matchdayCaps?
  durationPolicy
  exemptionPolicies
  antiCircumventionPolicy
  obligationConditionCatalogVersion
```

The `LoanCapVerdict` contract should return a deterministic, inspectable
breakdown:

```text
LoanCapVerdict =
  passes
  profileId
  profileVersion
  countedLayerResults[]
  exemptLayerResults[]
  violations[]
  warnings[]
```

Each violation names the layer (`globalBaseline`, `domesticOverlay`,
`matchdayRegistration`, `antiCircumvention`) and a stable FMX reason code.

## MVP domestic profile presets

These are FMX fictional data profiles, not copied legal text. Country-like names
are internal authoring shorthand; player-facing copy uses fictional league /
association names.

| Profile | Domestic in cap | Domestic out cap | Pair cap | Exemptions / notes |
|---|---:|---:|---:|---|
| England-like strict | 2 active / 4 season registrations | No exact outgoing cap in v1; count for same-pair and anti-hoarding checks | 1 incoming from same club | Overseas loans use global baseline; same-window acquisition block and one domestic goalkeeper loan flag. |
| Germany-like development | 6 active counted national loans | 6 active counted national loans | 3 | U21 local-player exempt; up to two U23 affiliate/development loans can count for local-player list and avoid quota if profile flag is enabled. |
| France-like asymmetric | 5 active | 7 active | 2 outgoing to same club | International loans remain six/six; non-EU loanee registration interaction stays in squad/work-permit policy. |
| Italy-like transitional | 8 active counted | 8 active counted | 3 | Fictional high-movement profile; U23/development exemption flag; source-review before legal/public claims. |
| Spain-like balanced | 6 active counted | 6 active counted | 3 | Fictional balanced profile with optional matchday same-source cap; source-review before legal/public claims. |
| Abstract fallback | 6 active counted | 6 active counted | 3 | Mirrors global anti-hoarding shape with young home-developed exemption. |

All profile values are data, not code constants. Community packs may override
them only through Regulations validation and save-creation snapshot merge.

## Obligation condition catalog

V1 uses a focused catalog that covers the realistic majority while staying
deterministic:

| Condition type | Parameters | Fact owner | Notes |
|---|---|---|---|
| `minimumAppearances` | competition scope, minimum count, cameo rule | Match / Statistics projection from Match facts | Counts only logged eligible appearances. |
| `minimumMinutes` | competition scope, minimum minutes or percent | Match | Uses logged minutes; unavailable periods can be excluded only if the loan clause says so. |
| `teamPromoted` | competition scope | League Orchestration | True only after official season finalization. |
| `teamAvoidedRelegation` | competition scope | League Orchestration | Covers survival / not relegated. |
| `teamQualifiedForCompetitionClass` | class id, season | League Orchestration | Uses FMX fictional competition classes, not real UEFA labels. |
| `fixedOptionWindow` | start date, deadline, actor | Transfer calendar / loan agreement | Supports option exercise and deadline warnings; not a hidden auto-buy trigger unless paired with an obligation. |

Composition is intentionally shallow:

- `single` condition; or
- one-level `allOf` / `anyOf` across catalog conditions.

No nested expressions, xG, training grade, morale, market value, manager
opinion, finance-ratio or hand-authored script trigger is allowed in v1.

## Deterministic evaluation

`EvaluateObligationToBuy` is a pure Transfer command handler over:

- loan agreement snapshot;
- Regulations condition catalog snapshot;
- Match minutes/appearance facts;
- League final-outcome facts;
- the save calendar date/window facts.

If a required fact is missing or ambiguous, the evaluator returns
`notTriggered` with a `needsReview` audit reason. It never silently fires an
auto-buy from incomplete data.

## Product UX

- Quick: simple "Loan allowed / blocked" and "Buy obligation risk" badges.
- Standard: exact cap reason and exact obligation trigger text.
- Expert: full profile version, counted/exempt loan list, threshold facts,
  source fact ids and condition-evaluation breakdown.

Clause text uses FMX-owned wording. Source laws and league names are not copied
into player-facing copy.

## Follow-up

No further FMX-155 decision is open. Remaining downstream work is:

- FMX-52 / GD-0043 calibration for loan-quality weights, playing-time
  thresholds and penalty magnitudes.
- Legal/IP review before any public marketing copy claims current real-world
  domestic rule equivalence.
- Code-phase contract tests once Regulations and Transfer packages exist.

## Related

- Raw Perplexity:
  [[raw-perplexity/raw-loan-cap-obligation-catalog-2026-06-16]]
- Source checks:
  [[raw-perplexity/raw-loan-cap-obligation-source-checks-2026-06-16]]
- Decision queue:
  [[../40-Execution/fmx-155-loan-cap-obligation-catalog-decision-queue-2026-06-16]]
- ADR:
  [[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
- Regulations:
  [[../50-Game-Design/regulations-and-compliance]]

