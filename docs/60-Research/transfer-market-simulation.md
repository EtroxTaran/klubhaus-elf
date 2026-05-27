---
title: Transfer Market Simulation - Valuation, AI Selling, Clauses and Negotiation
status: current
tags: [research, transfers, contracts, valuation, ai, economy, narrative, determinism]
created: 2026-05-17
updated: 2026-05-17
type: research
binding: false
related:
  - [[ai-manager-behaviour]]
  - [[determinism-and-replay]]
  - [[performance-budgets]]
  - [[data-generators]]
  - [[narrative-content-pipeline]]
  - [[../50-Game-Design/transfer-market-and-contracts]]
  - [[../10-Architecture/transfer-market-architecture]]
  - [[../20-Features/feature-transfer-market-ai-and-contracts]]
---

# Transfer Market Simulation - Valuation, AI Selling, Clauses and Negotiation

This note turns the attached Perplexity transfer-market research into project
guidance and reconciles it with the current vault. It locks the direction for a
credible AI-driven transfer market: **market value is a reference range; final
price is a negotiated, clause-aware outcome produced by club strategy, player
agency, market regime and financial pressure**.

## 1. Challenge Summary

The attached research is directionally correct, but it needed four corrections
before promotion:

- **Adopt:** no single "market value = price" formula. Real fee models use age,
  contract duration, playing level, minutes, position, reputation and seller /
  buyer context; research models can explain much of the variance, but not every
  deal.
- **Strengthen:** the current D4 AI note had a thin sale formula
  (`surplus + contractRisk + wageBurden`). It needs a two-axis model:
  `sellPressure` versus `protectionScore`, plus hard valuation floors.
- **Constrain:** "complete transfer market" must be tiered. Full negotiation
  depth for every low-tier club in every country conflicts with D9 mobile PWA
  budgets. Tier 0/1 gets full detail; lower tiers use aggregated opportunity
  generation and top-transfer materialisation.
- **De-risk:** clauses are realistic, but not every legal/regulatory detail
  should be simulated in MVP. Use a generic clause package and cash-equivalent
  pricing. Nico has decided that all major clause families are in the MVP
  foundation, but UI exposure can still be tiered.

## 2. Core Decision

Build the transfer market as five coupled models:

| Model | Purpose |
|---|---|
| `PlayerMarketProfile` | Player-side valuation inputs: ability, role value, age curve, contract, wage, form, injuries, personality, ambition, loyalty, agent, morale and public pressure. |
| `ClubTransferStrategy` | Club plan for the window: buy targets, sell candidates, loan list, not-for-sale core, wage correction, succession needs, board pressure, cash urgency and style fit. |
| `TransferOpportunity` | Reason a deal exists: expiring contract, unhappy role, financial stress, injury crisis, agent push, tactical mismatch, youth pathway, owner directive or market heat. |
| `NegotiationCase` | Stateful negotiation with buyer/seller/player/agent reservation points, deadlines, competing bids, offer history, relationship temperature and media leak risk. |
| `ContractClausePackage` | Generic clause set: base fee, instalments, bonuses, sell-on, profit share, buy-back, matching right, loan fee, wage share, option, obligation and loan-back. |

## 3. Valuation Model

Use three distinct concepts:

| Concept | Meaning | UI exposure |
|---|---|---|
| `referenceValue` | Internal model estimate based on player and market fundamentals. | Own players / fully-known players can show a clear midpoint; external players show a range until knowledge is high. |
| `expectedAskingPrice` | Seller-facing opening range after protection, urgency and market heat. | Surfaced as numeric estimate with confidence in Expert; simpler labels in lower tiers. |
| `cashEquivalent` | Internal comparison value for a concrete offer package. | Expert shows clear package value, net proceeds and breakdown; lower tiers show guidance. |

Reference value inputs:

```text
referenceValue =
  abilityValue
  x ageCurve
  x contractCurve
  x formAndMinutes
  x reputationAndLeague
  x positionScarcity
  x potentialUpside
  x riskDiscount
  x marketInflationIndex
```

The model must store ranges, not one exact public number:

```ts
type ValuationBand = {
  low: Money
  midpoint: Money
  high: Money
  confidenceBp: number
  modelVersion: string
}
```

### Information model

Best practice from football-management games and scouting references is not
"hide all numbers" versus "show everything". It is **knowledge-gated precision**:

- own-club data and signed offer terms are exact;
- external player attributes, valuation and hidden traits start masked or ranged;
- repeated scouting, regional knowledge, analyst quality, data availability and
  direct match exposure narrow ranges;
- Expert UI shows the clearest available numeric values plus confidence, source
  and breakdown;
- hidden true values stay hidden until the game has a legitimate knowledge
  source.

For transfers this means Expert can show:

- valuation band low / midpoint / high;
- confidence percentage;
- likely seller ask;
- estimated player wage demand;
- cash-equivalent package value;
- gross fee, deductions and net seller proceeds;
- reason flags that explain why the estimate is wide or narrow.

This keeps Expert clear without making unknown foreign players magically exact.

Hard floors prevent absurd deals:

- `contractCompensationFloor`: contract length, wage, role, club level.
- `sportingProtectionFloor`: best-XI / leader / no-replacement protection.
- `marketDemandFloor`: active competing interest and position scarcity.
- `panicSaleFloor`: minimum under financial duress; can be below normal ask, but
  never collapses to token fees for high-quality contracted players.

## 4. How AI Clubs Decide to Sell

AI clubs do not randomly list players. They compare pressure to sell with
reasons to protect the player.

```text
sellPressure =
  playerUnrest
  + contractRisk
  + wageBurden
  + squadSurplus
  + financeUrgency
  + tacticalMismatch
  + ownerDirective
  + marketOpportunity
  + agentPush

protectionScore =
  squadImportance
  + replacementScarcity
  + leadershipValue
  + fanBoardBacklash
  + tacticalFit
  + rivalryRisk
  + statusSignal
```

Sell decisions:

| Outcome | Condition |
|---|---|
| Not for sale | `protectionScore` clearly exceeds `sellPressure`; only extreme overpay enters negotiation. |
| Listen to offers | Scores are close, or contract / role risk is rising. |
| Actively list | `sellPressure` exceeds `protectionScore` and the sale improves squad / finance strategy. |
| Forced sale | Administration, owner directive, FFP hard pressure, or player crisis exceeds threshold. |

Top-club star sales must require stacked triggers: wantaway player, contract
risk, serious bid above the protected reference range, prepared successor OR
financial / owner pressure. This produces rare but believable "shock sales"
without cheap elite-player fire sales.

## 5. Offer Packages and Clause Pricing

Every offer is priced internally as a cash equivalent:

```text
cashEquivalent =
  baseFee
  + discountedInstallments
  + probabilityWeightedBonuses
  + sellOnExpectedValue
  + buyBackOrMatchingRightValue
  + loanOptionValue
  - collectionDelayPenalty
  - clauseRiskPenalty
  - wageSubsidyCost
```

Nico decision (2026-05-17): **full clause-family integration in the MVP
foundation**. The engine and data model support every clause below from the
start, while Quick / Standard UI can guide or hide advanced fields.

Clause families:

- base fee;
- instalments;
- appearance / goal / promotion / continental qualification bonuses;
- sell-on percentage;
- profit-share percentage;
- buy-back option;
- matching right;
- loan-back;
- loan fee;
- wage-share percentage;
- optional buy clause;
- mandatory buy clause with conditions;
- playing-time promise;
- release clause;
- agent fee;
- signing / loyalty bonus;
- youth compensation / solidarity-style training reward deductions.

Clause preferences are asymmetric:

- Smaller and development clubs value sell-on and profit-share upside.
- Cash-stressed clubs prefer immediate cash and reject long instalment chains.
- Elite clubs selling prospects may accept a lower fee for buy-back or matching
  rights.
- Loan-with-option fits risk-sharing and development uncertainty.
- Loan-with-obligation fits accounting / liquidity smoothing but must be guarded
  by eligibility conditions and competition rules.

## 6. Player and Agent Agency

Club agreement is not enough. The player / agent side evaluates:

- wage and bonuses versus desired package;
- promised squad role and playing-time probability;
- league / club reputation trajectory;
- style fit and tactical role;
- geography, language and adaptation flags;
- ambition, loyalty, professionalism and family stability;
- agent relationship, fee expectations and willingness to leak.

Player-side acceptance uses `TransferRng`, not `WorldAiMgmtRng`, so AI club
refactors do not perturb player-agency outcomes.

MVP agent decision: agents are **transaction modifiers with future-ready
identity**, not full relationship-game actors yet. Store stable `agentId`,
fee preference, leak tendency, risk appetite and relationship temperature in
snapshots so Phase 2 can add deeper multi-season relationships without a schema
rewrite.

## 7. Market Regimes

Transfer windows have global and local regimes:

| Regime | Effect |
|---|---|
| Quiet market | Lower competition, more bargain opportunities, fewer rumours. |
| Hot position market | Position scarcity increases asking prices and agent leverage. |
| Deadline pressure | Urgency and overpay tolerance rise, but walk-away caps still apply. |
| Financial stress wave | Distressed clubs list assets; buyers detect lower floors. |
| New-money wave | Investor clubs bid aggressively and inflate wages. |
| Youth premium | High-potential players command sell-on / buy-back packages. |

Market regimes are deterministic per window from `WorldAiMgmtRng` sub-labels
and published as read models for scouting, AI and narrative.

## 8. Transfer Scope Settings and Simulation Tiers

Full detail is reserved for clubs and players near the user's world. Research
and competitor practice support explicit active / background league settings
because every active league increases player materialisation and processing
cost. Our save setup therefore needs a clear **Transfer Scope** setting.

Recommended presets:

| Preset | Intended device / world | Tier 0 / 1 depth |
|---|---|---|
| Focused | Floor / Small world | User nation, current league pyramid slice, direct rivals, shortlist targets, continental opponents when relevant. |
| Standard | Standard / Medium world default | User nation selected leagues, main continental top leagues, direct promotion / relegation neighbours, active continental competitors and major talent-export markets. |
| Deep | Premium / Large opt-in | Selected 8 nations / 20 leagues from D9 plus top global clubs, major prospect leagues and all clubs with strong user-career links. |
| Custom Expert | User-defined | Expert player chooses active nations, connected leagues and background markets with projected storage / processing warnings. |

Connection rules promote a league or club to deeper transfer simulation when:

- the user manages in that nation or competition;
- a league has promotion / relegation, cup, continental or loan pathways linked
  to the user club;
- a club is a direct rival, frequent bidder, feeder, affiliate or former club;
- the user has shortlisted, scouted or negotiated with players there;
- a league is a major talent exporter for the user's scouting network;
- the league contains continental opponents this season.

| Tier | Transfer simulation |
|---|---|
| Tier 0 | User club, direct rivals, active league: full strategies, opportunities, negotiation cases and clause pricing. |
| Tier 1 | Top leagues / high-reputation clubs: full valuation, simplified negotiations, major rumours. |
| Tier 2 | Background leagues: aggregate needs and materialise only meaningful bids / sales. |
| Tier 3 | Deep world: seasonal talent flow, top prospects, headline transfers and ageing / contract churn. |

This is mandatory for D9 performance budgets and for offline-first saves.

## 9. Training Rewards and Solidarity-Style Payments

Best implementation idea: model these as **training rewards** rather than a
full legal clone. FIFA-style rules distinguish training compensation and
solidarity mechanisms, both linked to a player's registration history and
training clubs. For gameplay we need the financial shape, not every national
legal edge case.

Implementation model:

- store a simplified `PlayerPassport` with club registrations from ages 12-23;
- rules are data-driven per fictional association / competition;
- permanent transfers can trigger solidarity-style deductions from gross fee;
- first professional contracts and early cross-association moves can trigger
  training-compensation-style fees;
- loan deals can include training-reward implications when the rule profile says
  so;
- generated clubs can receive small background income from past academy players.

UI exposure:

| Tier | Display |
|---|---|
| Quick | Net cost / net proceeds only, with "training rewards included" tooltip. |
| Standard | Gross fee, expected deductions and net proceeds summary. |
| Expert | Full fee waterfall: base fee, instalments, bonuses, sell-on, agent fee, training rewards, net accounting impact. |

This gives realism and supports development-club gameplay without forcing
casual players to parse legal mechanisms.

## 10. Narrative and UI

Transfer logic must explain itself. The user should see enough why without
seeing exact hidden scores:

- feed labels: "Transfer listed", "available for the right offer",
  "loan candidate", "not for sale";
- context hints: "contract entering final year", "unhappy with minutes",
  "club needs liquidity", "new owner wants wage cuts";
- negotiation hints: "seller wants more cash up front", "sell-on may work",
  "loan with obligation is more realistic";
- arc beats: rumour -> agent signal -> bid -> negotiation turn -> decision ->
  aftermath.

This plugs directly into D15's `Transfer Saga`, `Player Crisis`, press
conference and newspaper systems.

## 11. Source Checks

The research was checked against:

- CIES / MDPI econometric transfer-fee work: actual fees are negotiable market
  outcomes; determinants include contract length, age, playing level, minutes,
  position, international status, club / league context and market inflation.
- FIFA Clearing House / RSTP material: training compensation and solidarity
  payments are distinct transfer-system mechanisms; FIFA's Clearing House uses
  electronic player passports and automated training-reward identification.
- FIFA loan provisions: professional loans require written agreements, defined
  duration / financial conditions, and have international loan limits.
- LawInSport guide: training compensation and solidarity are separate regimes;
  solidarity is tied to fee-paying international transfers before contract
  expiry and is structurally a percentage of compensation.

## 12. Nico Decisions and Remaining Research

Resolved on 2026-05-17:

- Full clause-family integration in the MVP foundation.
- Expert UI should show clear values when the game has enough knowledge, with
  confidence and source breakdown rather than false certainty.
- Transfer scope should be an explicit save setting with Focused / Standard /
  Deep / Custom presets. Default: Standard.
- Training rewards / solidarity-style deductions should be modelled as a
  simplified, visible finance layer: tooltip in Quick, summary in Standard,
  full waterfall in Expert.
- Agents are simple transaction modifiers at MVP, but stored with stable IDs and
  enough traits to support deeper relationships later.

Still to validate during implementation benchmarking:

- exact club / league counts for each Transfer Scope preset on Standard and
  Floor devices;
- final numeric thresholds for when a league is promoted from Tier 2 to Tier 1;
- final training reward percentages for fictional association rule profiles.
## Related

- [[ai-manager-behaviour]]
- [[determinism-and-replay]]
- [[performance-budgets]]
- [[data-generators]]
- [[narrative-content-pipeline]]
- [[../50-Game-Design/transfer-market-and-contracts]]
- [[../10-Architecture/transfer-market-architecture]]
- [[../20-Features/feature-transfer-market-ai-and-contracts]]
