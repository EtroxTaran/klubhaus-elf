---
title: "Raw - real-world football insolvency and ledger effects (FMX-146)"
status: raw
tags: [research, raw, perplexity, insolvency, club-economy, accounting-ledger, fmx-146]
created: 2026-06-12
updated: 2026-06-12
type: research
binding: false
linear: FMX-146
related:
  - [[../insolvency-ledger-posting-contract-2026-06-12]]
  - [[../../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
---

# Raw - real-world football insolvency and ledger effects (FMX-146)

## Research prompt

Perplexity was asked for real-world football insolvency stages and financial effects, with emphasis on England/EFL/PL plus Germany, France, Spain and Italy. The prompt requested practical ledger implications for administration, points deductions, embargoes, wage controls, creditor write-offs, CVA/rescue, fire sales, owner support and liquidation.

## Key findings

- A useful football insolvency lifecycle is:
  - sustainable/normal operation;
  - financial stress;
  - cash-flow crisis or technical insolvency;
  - formal administration or comparable protection/supervision;
  - exit through rescue/CVA/restructuring, sale, liquidation, or phoenix/restart.
- England/EFL evidence is the clearest game-facing precedent:
  - administration has a sporting points deduction;
  - CVA/creditor settlement rules can trigger additional points sanctions if unsecured creditors receive too little;
  - football creditors are treated differently from other unsecured creditors in league rules;
  - transfer embargoes, budget oversight and registration constraints are common operating controls.
- Points deductions and embargoes are regulatory/sporting consequences, not accounting postings. They should update competition/regulatory state and player-facing consequences, but should not create ledger journal lines by themselves.
- Wage caps or wage limits operate as future budget/run-rate constraints. They do not retroactively reduce wages already accrued. In a game ledger, they should constrain future wage blocks rather than rewrite posted wage expense.
- Creditor write-offs create a real ledger event:
  - reduce the liability to the creditor;
  - recognize either a debt restructuring gain or an owner/equity contribution depending on creditor class and legal/economic substance;
  - keep provenance to the insolvency case and rescue/CVA decision.
- Fire sales create ledger postings only when a disposal or write-off actually happens:
  - sale proceeds increase cash/receivables;
  - the player registration asset is derecognized;
  - gain/loss is the difference between proceeds and carrying amount;
  - opening a fire-sale window is a policy/event state, not a posting.
- Owner rescue can be debt, equity, grant, guarantee, or liability forgiveness. It must not be collapsed into one generic "rescue" posting because the economic substance changes the ledger category.
- Germany, France and Spain emphasize front-loaded licensing/budget supervision. They are useful design references for preventive stress states and hard registration/budget controls, while England is useful for administration drama and point-deduction consequences.

## Ledger implications extracted

| Real-world action | Game state effect | Ledger effect |
|---|---|---|
| Administration entered | insolvency case stage, possible points deduction, embargo scope, administrator control | none unless fees/costs are explicitly modeled later |
| Wage cap imposed | future wage policy limit | none immediately; affects future wage block postings |
| Transfer embargo | squad/registration constraint | none immediately |
| Fire-sale window opened | administrator may force disposals | none until disposal/write-off event |
| Player sold in fire sale | registration disposal | reuse transfer/registration disposal posting |
| Player registration abandoned/written off | registration impairment/write-off | reuse registration write-off posting |
| Creditor haircut/CVA accepted | rescue/restructuring | reduce liability; contra leg is restructuring gain or owner equity contribution |
| Owner injects cash | rescue liquidity | cash/receivable increase; debt/equity/support category depends on instrument |
| Liquidation | terminal or reserved outcome | close-out/liquidation ledger is post-MVP unless liquidation is implemented |

## Source trail

- Perplexity refresh (2026-06-12) was insufficient for validation: it returned mostly generic
  Football Manager support/community URLs and did not include authoritative insolvency or accounting
  sources. The verified-source pass below is the evidence used for FMX-146.
- Lex Sportiva, "Administration and the Football League" — administration transfers control to an
  administrator, creates a creditor moratorium, commonly leads to player-asset sales, can exit via
  new owner/CVA/liquidation and carries EFL points-deduction treatment:
  <https://lexsportiva.blog/2020/08/05/administration-the-football-league-and-the-effect-of-covid-19/>
- LawInSport, football creditor rule and EFL insolvency policy — football creditors, unsecured
  creditor minimum recoveries and post-insolvency sanctions:
  <https://www.lawinsport.com/topics/features/item/football-creditors-rule-is-the-football-league-s-new-insolvency-policy-a-step-in-the-right-direction>
- DFL licensing glossary — German licensing is preventive and stability-focused; no Bundesliga club
  has gone into in-season administration:
  <https://www.dfl.de/en/glossary/dfl-licensing-system/>
- Bundesliga/DFL 2020 licensing adjustment — insolvency points sanctions and liquidity shortfalls
  treated through transfer-activity restrictions in the pandemic exception:
  <https://www.bundesliga.com/en/bundesliga/news/dfl-ordinary-assembly-resolves-extensive-adjustments-to-the-licensing-process-to-ease-the-strain-on-clubs-10705>
- UK Parliament/DCMS evidence PDF on Bury FC and EFL rules — football creditors, unsecured
  creditor minimums, proof-of-funds and withdrawal-of-membership context:
  <https://committees.parliament.uk/writtenevidence/105472/pdf/>

## Notes for synthesis

The research supports one canonical game insolvency stage model plus event-specific ledger mappings. It does not support a second finance-ledger insolvency FSM. It also supports keeping administration/embargo/wage-cap/fire-sale opening as policy/state events and reserving journal postings for actual economic events.
