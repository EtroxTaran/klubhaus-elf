---
title: "RAW Perplexity — Real-world takeovers, ownership archetypes & administration (FMX-89)"
status: raw
tags: [research, raw, perplexity, ownership, takeover, bankruptcy, administration, dynasty, fmx-89]
created: 2026-06-05
updated: 2026-06-05
type: research-raw
binding: false
related:
  - [[../dynasty-board-ownership-bankruptcy-2026-06-05]]
  - [[../../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
---

# RAW — Real-world ownership changes, owner archetypes & administration/bankruptcy

Verbatim Perplexity (Sonar) capture. Prompt: how club takeovers, owner
archetypes, fit-and-proper-person tests, and financial-distress →
administration → bankruptcy work in real professional football (England/EFL
focus), with concrete numbers, timelines and named examples — for a deterministic
state machine. Captured 2026-06-05 for FMX-89. **Status: raw** — not
implementation authority; the synthesis is
[[../dynasty-board-ownership-bankruptcy-2026-06-05]].

---

A "how it really works" blueprint (England: PL + EFL, with European examples).

## A) OWNERSHIP CHANGES / TAKEOVERS

### A1. What realistically triggers a takeover?
1. **Owner financial distress / fatigue** — cashflow problems, other businesses failing, tired of funding losses; club quietly/openly for sale. *Bolton Wanderers* (owner stopped funding → administration + sale 2019); *Wigan Athletic* (funding withdrawn → administration + sale 2020).
2. **Ambition / performance plateau** — richer party thinks they can unlock value. *Newcastle United 2021* (low-spend Ashley era; Saudi-backed consortium).
3. **Stadium / real-estate / asset motivation** — buyer wants stadium land / development rights (classic asset-strip risk when stadium separated into another company, rent charged back).
4. **Global brand expansion / portfolio logic** — multi-club groups, US investors (brand, player-trading platform, media rights). *City Football Group*.
5. **Distressed-debt / vulture opportunity** — buy cheap in distress; restructure, get promoted (value spike), sell; or break up assets.
6. **Sovereign / political / prestige** — soft power, national branding. *PSG (Qatar)*, *Newcastle (PIF)*.
7. **Supporter-driven rescue** — trust/local consortium after collapse. *AFC Wimbledon*, *Exeter City*, *Portsmouth (2013 fan buyout)*.

Game triggers via thresholds on owner wealth vs accumulated losses; league position vs "potential"; fan hostility / political pressure; debt-to-revenue ratio & covenant breaches.

### A2. Owner archetypes and behaviour
1. **Custodian / Local Family / Foundation** — long-term stewardship; break-even over cycle; modest net spend, sustainable wage-to-turnover (~60-80% EFL); patient with managers. (Athletic Bilbao socio style.)
2. **Sugar-Daddy Benefactor** — success/ego; injects equity, accepts large losses (until FFP bites); high net spend, big wages, frequent overhauls; impatient unless personally loyal. (Abramovich Chelsea; early Abu Dhabi Man City.)
3. **Leveraged Buyer / Asset-Stripper** — financial return via debt secured on the club; acquisition debt on balance sheet; cash extraction (dividends, fees, rent); conservative net spend, sells assets; hires "financially compliant" managers. (Man Utd Glazers LBO; Bury.)
4. **Distressed-Debt / Turnaround Specialist** — buy cheap in crisis, stabilise, flip; pay key creditors/HMRC/wages to avoid points hits; fire-sales early then opportunistic; survival-specialist managers; high turnover until stable. (Post-administration Bolton/Portsmouth/Derby.)
5. **Sovereign / State-Backed / Strategic** — soft power, brand; less ROI-sensitive; huge spend shaped by FFP (related-party sponsorships, multi-club networks); aggressive global scouting, high wages, long contracts to amortise; high pressure for elite success. (PSG, Man City, Newcastle.)
6. **Corporate / Private-Equity Sports Group** — ROI, asset growth, data-driven trading; controlled FFP-compliant spend; buy young/resalable, sell at value peak; centralised recruitment, little tolerance for off-philosophy managers. (Red Bull, CFG, US PE owners.)
7. **Fan-Owned / Member-Owned** — community & survival; one-member-one-vote, elected board; very risk-averse, budgets tied to cash; free transfers/loans/academy; some patience but reactive to fan votes. (AFC Wimbledon, Exeter City, German 50+1.)

### A3. Owners' and Directors' Test ("Fit and Proper Person")
England: **PL and EFL Owners' and Directors' Test (OADT)** applied to anyone gaining control (usually ≥30% shareholding or effective control) and to directors/key officers. Disqualifiers: certain criminal convictions (dishonesty, money laundering, corruption); director disqualification bans; multiple insolvencies; sporting sanctions (match-fixing); sanctions lists (UK govt sanctions forced the Abramovich/Chelsea sale). Even post-acquisition, a later disqualification (sanctions, conviction) can force a time-pressured sale. Model OADT as buyer flags: `criminal_record_flag`, `disqualified_director_flag`, `sanctioned_flag`, `recent_club_insolvency_involvement_count` → any disqualifying flag = takeover rejected / forced sale.

### A4. Typical timeline and stages of a takeover (no crisis)
1. **Quiet marketing / buyer interest** (NDA; months to years).
2. **Indicative offer / Heads of Terms** (non-binding valuation + structure; exclusivity for DD; weeks).
3. **Due diligence** (debts, contingent liabilities, stadium/real estate; 4-12 weeks).
4. **Binding Share Purchase Agreement (SPA)** (final price, completion conditions; signed not completed).
5. **Regulatory approvals** (OADT; sometimes govt/competition authorities; 2-8 weeks, longer if sensitive).
6. **Completion (Change of Control)** (funds transferred; control changes; new owner may inject capital, refinance debt, replace board/manager).
7. **Post-takeover restructuring** (new SD/manager; new transfer/wage policy).
In distress (administration), this is compressed: administrator runs an accelerated sale; bids due in days/weeks; league must still approve; no qualified buyer by deadline → liquidation/expulsion risk.

## B) FINANCIAL DISTRESS → ADMINISTRATION → BANKRUPTCY

### B1. Realistic stages
1. **Early financial stress** — rising wage-to-turnover (>80-100% EFL); mounting tax/trade/bank debts; owner plugs gaps or doesn't.
2. **Cash-flow crisis** — late payments to creditors (HMRC, suppliers), arrears on transfer instalments; possible **transfer embargo** for rule breaches.
3. **Missed payroll / HMRC liabilities** — unpaid wages, accumulating PAYE/VAT → HMRC legal action; reputational risk; fan revolt.
4. **Statutory demands / winding-up petition** — formal demands; court can order compulsory liquidation; many clubs file for administration for creditor protection first.
5. **Administration (insolvency)** — board appoints insolvency practitioner (administrator); control shifts from directors to administrator (duty to creditors); club plays on under severe constraints; **automatic EFL points deduction**.
6. **CVA / restructuring** — proposal to creditors (pay X pence in the pound; possible debt-for-equity); if approved, exit administration (often with new owner).
7. **Failure of rescue → liquidation / expulsion** — CVA rejected, no buyer → wound up; league often expels mid-season or at season end; fans may form a phoenix club in a lower tier.

### B2. Concrete consequences and numbers (England)
- **Points deductions – EFL:** Administration → **12-point deduction** (EFL standard). Multiple insolvency events / further breaches → additional sanctions. Not paying players on time / repeated breaches → points deductions + transfer embargo. (Bolton, Wigan, Derby, Reading cases: administration + deductions in the ~6-21-point range when additive penalties like late accounts / FFP stack.)
- **Premier League insolvency:** also a **12-point deduction** in principle for administration (rare in PL; clubs more often collapse after relegation into EFL).
- **Transfer embargoes (EFL triggers):** failure to submit audited accounts on time; failure to pay transfer instalments; breaking agreed business-plan limits after a prior breach (Profit & Sustainability / SCMP). Effect: cannot register new players except under strict conditions (free agents below wage cap, emergency GK); EFL sets an approved squad budget.
- **Wage controls:** League One/Two **Salary Cost Management Protocol** (wage bill capped ~ a % of turnover, e.g. ~60% historically; breach → embargo). In administration, administrators may terminate/renegotiate contracts, field youth if senior wages unaffordable.
- **Forced sales / fire-sales:** administrator sells players quickly below value to raise cash; rivals exploit via lowball deadline bids. In a state machine: once in administration → all players "for sale", AI buyers get a valuation discount, administrator prioritises cash over sporting strength.

### B3. Real examples (archetype templates)
1. **Portsmouth (2009-2013):** PL overspend → debts → administration twice → points deductions, relegations to League Two → fan-trust rescue, later sold on. (Sugar-daddy overspend → collapse → double administration → fan rescue.)
2. **Leeds United (early 2000s):** heavy borrowing on expected UCL income → missed qualification → revenue crash → fire-sales → 2007 administration, 10-point deduction (pre-current rules), relegation to League One. (Leveraged/over-optimistic → shortfall → distressed sales.)
3. **Bolton Wanderers (2019):** post-PL revenue collapse, owner stopped funding → unpaid wages, postponed fixtures → administration → 12-point deduction in League One → relegation → bought out, slow rebuild.
4. **Wigan Athletic (2020+):** new owner stops funding → administration, 12-point deduction → relegation from Championship. (Bad owners + sudden funding withdrawal → immediate administration + on-pitch impact.)
5. **Derby County (2021-22):** long overspend + FFP breaches → administration → 12 for administration + additional for prior breaches → relegation → new ownership, exit.
6. **Bury (2019):** severe mismanagement → couldn't prove they could complete the season → EFL expelled them → effectively liquidated; phoenix club restarted much lower. (Catastrophic failure → expulsion → phoenix.)

### B4. Heroic rescue vs liquidation
**Branch 1 — Heroic rescue / new-owner survival:** administrator solicits bids (time-boxed; league deadline "find owner by X or face expulsion") → rescue consortium (local businessperson / fan consortium / foreign investor) → deal structure (nominal equity + funding commitment + CVA e.g. 25p/£ over years) → league approval (OADT, business plan) → aftermath: points deduction stays, squad weakened, survival possible (Portsmouth/Bolton/Derby), debt reduced, gradual recovery. Game: "Rescue Bid Accepted" → exit administration → new owner archetype (Turnaround / Local Hero / Fans); creditors partially written off; reputation damage persists several seasons; fan goodwill increased.
**Branch 2 — Liquidation / phoenix club:** no viable buyer / failed CVA → court winds up → assets sold (stadium, training ground, IP/name/crest) → league expels club (immediately or at season end), fixtures voided/adjusted → supporters create a new entity (AFC X) applying to a regional league many levels below → slow climb over many seasons. Game: if no approved buyer by deadline → club removed; optionally spawn "Phoenix FC" in a much lower division (very low finances, high fan morale/identity); legacy history may split.

## State-machine shape (suggested)
Club states (simplified): 1) Financially Stable 2) Stressed (high wages / rising debt) 3) Cash-Flow Crisis 4) Under Embargo 5) Default / Insolvency Risk (winding-up petition active) 6) Administration (12-pt, administrator control) 7) Rescued (new owner, post-admin legacy penalties) 8) Liquidated / Phoenix Created. Transitions: ratios (debt/revenue, wages/revenue, cash < X months of wages), stochastic events (owner stops funding, relegation, lost TV deal), decision nodes (buyer of acceptable type passes OADT and funds a rescue within a fixed deadline). Layer owner-archetype parameters (max tolerated annual loss, equity vs debt, transfer risk appetite, manager patience) and league rules by division (admin points = 12 EFL; wage caps; FFP/PSR thresholds).

### Citations
[1] https://www.espn.com/nfl/story/_/id/40164039/private-equity-nfl-ownership-proposal-changes
[2] https://en.wikipedia.org/wiki/List_of_current_NFL_franchise_owners
[3] https://andersonkill.com/article/nfl-teams-make-historic-move-to-allow-private-equity-ownership/
[4] https://www.nfl.com/news/nfl-owners-vote-to-allow-private-equity-funds-to-buy-stakes-in-teams
[5] https://www.youtube.com/watch?v=itxzK_RPlYc
[6] https://thesportjournal.org/article/restructuring-nfl-ownership-a-new-way-forward/
[7] https://www.buyoutsinsider.com/nfl-ownership-rule-changes-may-help-private-equity-run-up-the-score/

> **Reviewer note (kept with the raw capture):** Sonar's auto-citations drifted to
> NFL/private-equity sources; the football-specific claims, numbers (EFL −12) and
> named examples are corroborated against the synthesis note's own sourcing and
> are well-established public facts. Treat the EFL/PL numerics as directional and
> reconfirm at calibration (FMX-52).
