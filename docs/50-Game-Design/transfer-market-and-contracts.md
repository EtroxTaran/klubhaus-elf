---
title: Transfer Market and Contracts
status: draft
tags: [game-design, transfers, contracts, ai, economy, scouting, narrative]
created: 2026-05-17
updated: 2026-05-17
type: game-design
binding: true
related: [[README]], [[scouting-and-recruitment]], [[squad-and-club-structure]], [[economy-system]], [[transfer-negotiations-p2p]], [[../60-Research/transfer-market-simulation]], [[../10-Architecture/transfer-market-architecture]], [[../20-Features/feature-transfer-market-ai-and-contracts]]
---

# Transfer Market and Contracts

> Approved 2026-05-17 after Nico resolved clause depth, Expert UI, transfer
> scope, training rewards and MVP agent depth. Research authority:
> [[../60-Research/transfer-market-simulation]].

The transfer market is a living economy, not a shop list. Clubs plan squads,
players and agents push their own interests, market conditions change by window,
and every deal is a negotiated package.

## 1. Player Fantasy

The player should feel three things:

- **Deals have reasons.** A player is available because of role, contract,
  finance, squad plan, agent pressure or owner policy.
- **Negotiation is strategic.** Cash, instalments, sell-on, bonuses, buy-back,
  loans and obligations can all solve different problems.
- **Information is imperfect.** Market value is a scouting / director estimate,
  not a universal truth.

## 2. Core Loop

```mermaid
flowchart LR
    Need["Squad need"] --> Scout["Scout market"]
    Scout --> Shortlist["Shortlist"]
    Shortlist --> Approach["Approach club / agent"]
    Approach --> Negotiate["Negotiate package"]
    Negotiate --> Terms["Player terms"]
    Terms --> Register["Register transfer"]
    Register --> Integrate["Integrate player"]
    Integrate --> Need
```

The same loop drives AI clubs during their weekly / window ticks.

## 3. Market Surfaces

| Surface | Quick | Standard | Expert |
|---|---|---|---|
| Transfer feed | Top recommendations and urgent offers | Market lists, shortlists, scout trust | Full filters, heat maps, valuation bands |
| Player availability | Simple labels | Reasons and negotiation hints | Numeric pressure / protection estimates with confidence |
| Negotiation | Accept / reject / improve | Guided counter-offer wizard | Full clause editor, cash-equivalent value and net proceeds |
| Club strategy | Hidden | "Club may sell / wants cash" hints | Estimated seller preferences, walk-away risk and data source |

## 4. Availability Labels

Use explicit labels instead of exposing raw scores:

| Label | Meaning |
|---|---|
| Not for sale | Club protects the player; only exceptional overpay or crisis opens talks. |
| Would listen | Deal is possible if package fits club / player goals. |
| Available for right offer | Club has medium sale pressure, but price is protected. |
| Transfer listed | Club actively wants a permanent sale. |
| Loan candidate | Club wants minutes / wage sharing / development exposure. |
| Forced sale | Administration, owner directive, FFP or severe player crisis. |

## 5. Transfer Archetypes

| Archetype | Trigger | Typical package |
|---|---|---|
| Development-club prospect sale | Cash need, top prospect, buyer competition | Fee + sell-on + add-ons |
| Elite star shock sale | Wantaway, contract risk, successor ready, huge bid | High cash, limited clauses |
| Role-frustrated starter | Low minutes or tactical mismatch | Market fee, role promise matters |
| Deadline emergency | Injury / late outgoing | Overpay, short negotiation, fewer clauses |
| Loan to develop | Young player needs minutes | Loan fee, wage share, playing-time promise |
| Loan with option | Buyer wants risk cap | Loan fee + optional buy |
| Loan with obligation | Seller wants exit, buyer needs cash smoothing | Lower upfront fee + conditional obligation |
| Buy-back talent sale | Elite club protects future upside | Lower fee + buy-back / matching right |
| Distressed fire sale | Administration / owner cuts | Discounted but floor-protected sale |

## 6. Negotiation Components

An offer can contain:

- base fee;
- instalments;
- performance bonuses;
- sell-on percentage or profit share;
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

Nico decision: the MVP foundation supports the full clause family. Quick and
Standard can guide the player with presets, but Expert exposes the full editor.

## 7. Player Terms

After club agreement, the player / agent evaluates:

- wage and bonuses;
- squad role promise;
- contract length;
- signing fee / agent fee;
- league and club reputation;
- tactical role fit;
- geography / language / family adaptation flags;
- ambition, loyalty, professionalism and morale;
- relationship with manager / director;
- agent fee expectation and leak tendency.

Some players refuse even strong offers. That is a feature, not a failure.

Agents are simple at MVP: they modify transaction demands, leak risk and
negotiation temperature. They still have stable identities and traits so a
deeper relationship system can be layered on later.

## 8. AI Club Behaviour

AI club transfer strategy is built each window:

```text
ClubTransferStrategy =
  buyTargets
  + sellCandidates
  + loanList
  + notForSaleCore
  + wageCorrectionTargets
  + successionNeeds
  + boardPressure
  + cashUrgency
  + styleFit
```

Selling compares `sellPressure` with `protectionScore`. Buying starts from role
need, squad age profile, tactical fit, budget and manager / owner personality.

## 9. Economy Integration

Transfer budget and cash are separate:

- A high transfer budget can still fail if liquidity cannot support upfront
  payment, wages and instalments.
- Instalments create future liabilities and affect financial health.
- Sell-on and bonus obligations reduce expected net proceeds.
- Training rewards and solidarity-style deductions reduce seller net proceeds
  and can create small academy income for former clubs.
- Forced sales repair liquidity but damage squad strength, fan sentiment and
  dressing-room trust.

## 10. Transfer Scope

New-save setup includes a Transfer Scope setting:

| Preset | Use |
|---|---|
| Focused | Low-end devices / Small world. Full depth for user league, direct rivals and active shortlist. |
| Standard | Default. User nation, main continental leagues, connected promotion / continental / scouting markets. |
| Deep | Premium / Large world. Selected major nations plus strong talent-export and continental markets. |
| Custom Expert | Manual active leagues with projected performance / storage warning. |

Leagues become more active when they are connected to the user by competition,
promotion, loan pathways, rivalry, shortlist activity, former clubs, feeder /
affiliate links or continental fixtures.

## 11. Training Rewards

The game models training compensation and solidarity as simplified **training
rewards**:

- Quick shows only net cost / proceeds with a tooltip.
- Standard shows gross fee, deductions and net proceeds.
- Expert shows the full fee waterfall, including sell-on, bonuses, agent fees
  and training rewards.

This makes development clubs feel economically alive without making the lower UI
tiers legal-accounting screens.

## 12. Narrative Integration

Transfers feed D15 narrative systems:

- `Transfer Saga`: rumour -> bid -> negotiation -> decision -> aftermath.
- `Player Crisis`: role frustration / wantaway escalation.
- `Bankruptcy Saga`: forced sale and fan reaction.
- Press conferences during windows.
- Newspaper follow-ups for major moves, failed talks and shock sales.

## 13. Rules of Thumb

- Market value is never the final price.
- Price is a range plus a negotiation context.
- Clubs never sell protected core players for token fees.
- Clauses are priced internally as cash equivalents.
- Full simulation depth is tiered by world proximity.
- UI explains causes without exposing all hidden formulas.
