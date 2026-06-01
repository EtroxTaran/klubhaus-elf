---
title: Catering and Merchandise Operations Depth - Research Synthesis 2026-06-01
status: draft
tags: [research, economy, catering, merchandise, retail, operations, inventory, cogs, ifrs15, legal, fmx-47]
created: 2026-06-01
updated: 2026-06-01
type: research
binding: false
linear: FMX-47
sourceType: external
related:
  - [[raw-perplexity/raw-catering-and-merchandise-operations-2026-06-01]]
  - [[commercial-contract-lifecycle-and-breach-model-2026-05-28]]
  - [[club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[fan-demand-price-elasticity-2026-05-28]]
  - [[cup-and-competition-revenue-profiles-2026-05-28]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../50-Game-Design/economy-system]]
  - [[../50-Game-Design/stadium-and-campus]]
  - [[../50-Game-Design/audience-and-atmosphere]]
  - [[../50-Game-Design/sponsorship-portfolio]]
  - [[../20-Features/feature-club-economy-mvp-pillar]]
  - [[../30-Implementation/club-economy-commercial-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]]
  - [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
---

# Catering and Merchandise Operations Depth - Research Synthesis 2026-06-01

## Question

FMX-44 ([[commercial-contract-lifecycle-and-breach-model-2026-05-28]]) anchored
catering and merchandise as two families inside the unified `CommercialContract`
shell, but only as a list of model options (in-house / concession / management
fee / revenue-share / minimum-guarantee-plus-share / royalty / licensed partner)
with thin schedules. There is no operational depth: no cost of goods sold (COGS),
no staffing, no waste/spoilage, no stockout, no inventory lifecycle, no
fulfilment-partner SLA, no dwell-time → per-capita-spend coupling, no campaign /
seasonal merch spike, no supplier carve-outs, and no family-specific
cash-vs-recognition schedule. `costShareBps` and "inventory risk" exist as field
names with no mechanics behind them.

How should FMX model catering and merchandise **operations** — beyond flat
revenue percentages — so the player makes meaningful own-operation-vs-partner,
inventory, pricing and service-quality trade-offs, and so the ledger distinguishes
revenue, COGS, royalty, guarantees and stock loss?

Nico's defaults for FMX-47:

- deepen catering & merchandise **without** redefining boundaries — the model
  stays inside CommercialPortfolio (ADR-0061), with Club Management as sole ledger
  writer (ADR-0050), Stadium Operations supplying throughput and Audience &
  Atmosphere supplying demand/mood;
- document sourced operational models, refined `CommercialContract` fields and
  distinct ledger events; keep all numbers as **calibration ranges**, not final
  constants (IP-clean, no real brand/operator names in-game);
- cover the five required acceptance scenarios (stockout, wasted inventory,
  cup-final merch spike, poor service-quality penalty, partner guarantee) and the
  Quick / Standard / Expert operational disclosure mapping.

## Summary

The research answer is to treat catering and merchandise as **operations with an
explicit cost and inventory side**, settled per fixture/period by
CommercialPortfolio, with the *commercial model* choosing who bears which risk:

1. **One operating-model dial per family** decides risk allocation, not the
   revenue split alone. For catering: in-house (club keeps 100% gross, bears COGS
   ~25-35% + labour ~25-35% + opex ~10-20%, ~10-20% operating margin), concession
   lease (operator bears all, club gets fixed rent ± ~8-20% of gross), management
   fee (club keeps gross **and bears volume/inventory risk**, pays ~1-5% fee +
   incentive), revenue-share (operator bears cost/waste, club gets ~15-40% of
   gross), and MAG + share (club gets `max(MAG, share)`). The same five-way dial,
   re-skinned, covers merchandise (own store + e-commerce, licensed partner /
   wholesale, kit-supplier guarantee, pure licensing/royalty).

2. **Revenue is potential capped by operations.** Catering revenue =
   `attendance × per-capita-spend`, where per-capita is driven by dwell time,
   product mix/quality, queue/throughput, fan-segment mix and alcohol policy —
   then **capped by service capacity** (transactions/min × selling window ×
   basket) and **stockouts** (an item's sales cap at zero once sold out). Unmet
   demand is lost revenue plus a satisfaction penalty, not silently absorbed.

3. **Cost and inventory are first-class, not a single `costShareBps`.** The
   ledger separates revenue, COGS, labour/opex, royalty/MAG true-up, guarantee
   shortfall, waste/spoilage (catering: ~3-5% of food COGS normal, up to ~10-15%
   on shock events) and stock write-down/markdown (merch: season-end markdown
   30-70%, lifecycle margin ~5-10pts below full price; e-commerce returns 15-25%).

4. **Demand is spiky and seasonal for merchandise.** Kit-launch month ≈ 3-5×
   average; a global-icon signing ≈ ×1.3-1.5 year-1 kit volume; cup-final month
   ≈ ×1.1-1.3 (+10-20% if won); promotion +20-40% next season. These are forecast
   multipliers on a planned stock buy, which creates the stockout-vs-overstock
   tension.

5. **Service quality and supplier exclusivity are gameplay levers.** Queue time,
   stockouts and quality feed Audience & Atmosphere satisfaction / repeat-spend /
   NPS and sponsor fit; SLA breaches grade curable / material / critical with a
   credit → cure → step-in → terminate ladder (consistent with FMX-44). Pouring
   rights / category exclusivity (one beer, one soft-drink, one energy partner)
   bind the operator's sourcing and conflict structurally with kit/league sponsors
   in the same category × territory × asset scope (FMX-44 exclusivity graph
   already models this; FMX-47 supplies catering carve-out defaults).

6. **Cash ≠ recognised revenue, per IFRS 15.** Own-operation POS recognises at
   point of sale (cash ≈ revenue); concession fixed rent straight-line over term;
   revenue-share as concessionaire sales occur (variable consideration, contract
   asset for earned-not-billed); royalty under the **sales-based royalty
   exception** as licensee sales occur; MAG straight-line with overage true-up
   recognised only when sales exceed the floor. This slots directly into the
   existing FMX-43/44 cash-schedule vs recognition-schedule split.

None of this moves a boundary or needs a new ADR: it refines the catering and
merchandise **family schedules** inside `CommercialContract`, names their ledger
events in ADR-0050, and adds the operational read-models for Expert UI.

## Source base

| Area | Primary sources | FMX use |
|---|---|---|
| Stadium F&B commercial models, margins, per-cap, failure modes | SportsBusinessJournal venue F&B breakdown; Wicketsoft; FESmag; FCSI; Ground Control; Foodbuy; Oracle "Stadium of the Future" | Five-way operating-model dial; COGS/labour/opex bands; per-cap drivers; capacity & stockout caps |
| Football merchandise/retail models, margins, royalties, spikes, inventory | FootyHeadlines £80-shirt breakdown; TheFootballWeek kit/merch business model; Retail-Focus; Togwe; Man Utd 20-F / BVB / Real Madrid / Barça reporting structure | Retail-margin & royalty bands; kit MG tiers; launch/signing/cup/promotion multipliers; markdown/returns model |
| IFRS 15 / IAS 2 recognition | ACCA AB Magazine "IFRS and football finance"; PwC football-industry accounting; KPMG IFRS 15 ISG handbook; ICAEW IFRS 15 tracker; Compass Group IFRS 15 deck | Cash-vs-recognition rules per model (POS / lease / revenue-share / royalty / MAG); inventory write-down/COGS |
| Service quality → fan outcomes; alcohol regimes; SLA & breach | Kim/Trail/Magnusen baseball F&B study (Emerald IJSMS); Oracle survey; NFL/Ralph Wilson studies; The Sport Journal; Sporting Events (Control of Alcohol etc.) Act 1985 + DE/ES/IT comparison | Satisfaction/queue/stockout penalty bands; alcohol-policy revenue/safety dial; SLA KPIs + curable/material/critical grading |
| Supplier exclusivity / pouring rights / carve-outs | HigherGov Peoria RFP; Brockton Rox-Coca-Cola; Univ. Arkansas proposal; Dublin EHS tender; IJHPM pouring-rights review; Enliven airport pouring-rights; Miami Univ. Pepsi contract | Pouring-rights structure; category × territory × asset carve-outs; supplier-mandate operator constraints; deal-value scaling |

Confidence: **medium-high** on model structures, margin/royalty bands, IFRS 15
mechanics and SLA/exclusivity practice (multiple converging public sources);
**medium** on precise per-capita and demand-multiplier numbers (operator terms
private → industry inference, flagged). All numbers are calibration inputs, IP-
clean: real operators/brands are sourcing references only, never in-game names
(GD-0015 + [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]).

## Findings

### 1. The operating-model dial (who bears which risk)

Each catering and merchandise contract carries an `operatingModel` that decides
risk allocation, not just a revenue percentage. The dial is shared in shape
across both families:

**Catering operating models**

| Model | Staff | Stock / waste | Club cash basis | Club risk |
|---|---|---|---|---|
| In-house | Club | Club | 100% gross − COGS − labour − opex | High (full P&L) |
| Concession lease | Operator | Operator | Fixed rent ± % of gross (~8-20%) | Low |
| Management fee | Operator | **Club** | Gross − actual opex − fee (~1-5% + incentive) | Medium-high |
| Revenue-share | Operator | Operator | % of gross (~15-40%) | Low-medium |
| MAG + share | Operator | Operator | `max(MAG, % of gross)` | Low (floor) |

**Merchandise operating models**

| Model | Inventory / fulfilment risk | Club cash basis |
|---|---|---|
| Own store + e-commerce | Club (stockout, overstock, markdown, returns) | Gross retail − COGS (35-45%) − store/e-com opex |
| Licensed partner / wholesale | Partner | Royalty on net sales + guaranteed minimum |
| Kit-supplier guarantee | Manufacturer (replica) | Fixed annual base/MG + royalty above threshold + value-in-kind |
| Pure licensing / royalty | Licensee | Royalty (~8-15% net sales) + per-category MG |

Design consequence: the model choice is the core strategic trade-off —
**control + upside + risk** (in-house / own store) vs **certainty + low effort +
capped take** (concession / licensed partner / MAG). It is the catering/merch
analogue of the season-ticket "upfront cash vs upside" dial from FMX-43.

### 2. Catering revenue as operations-capped potential

`catering_potential = attendance × per_capita_spend`, where per-capita is a
profile band modulated by drivers, then **capped** by operational reality:

- **Per-capita drivers** (multipliers on a country/league base of ~€5-18 GA):
  dwell time (Stadium Operations input), product mix/quality (upgrade), queue/
  throughput friction (mobile order/kiosks raise it), fan-segment mix (Audience &
  Atmosphere `FanDemandForecast` — corporate/family spend more), alcohol policy.
- **Capacity cap:** each service point has `max sales = transactions_per_min ×
  selling_window_min × avg_basket`. The selling window concentrates pre-match and
  at half-time; demand above capacity becomes **lost demand** (realised per-cap
  below potential) — this is why throughput/dwell upgrades raise revenue without
  raising price.
- **Stockout cap:** when an item's stock hits zero before the window ends, its
  remaining demand is lost (`lost_revenue = unmet_demand × price`) plus a
  satisfaction penalty. Halftime peaks have no restock window.
- **Alcohol-policy dial** (country-profile driven, links to FMX-53): in-bowl
  (Germany-like) → higher per-cap + atmosphere but higher disorder/policing;
  concourse-only (England/Wales 1985 Act) → ~10-30% lower per-cap, intense
  half-time concourse queues; near-ban (Spain-like, >1% ABV prohibited) → low
  alcohol revenue, lower incident risk. Policy is a lever with a revenue↔safety
  trade-off, not a constant.

### 3. Cost and inventory as first-class ledger concepts

Replace the single opaque `costShareBps` with an explicit cost/inventory side:

- **Catering costs:** COGS (food ~25-35%, beverage lower; blended ~23-32% of
  revenue), labour (~20-35%, lower with kiosks/mobile), other opex (~10-15%),
  and **waste/spoilage** (~3-5% of food COGS normal, up to ~10-15% on
  over-ordering or low-attendance shock).
- **Merchandise inventory lifecycle:** plan → stock buy (lead-time, demand
  forecast) → sell-through (full price) → markdown/clearance (season-end 30-70%
  off; 20-40% of units discounted; lifecycle margin ~5-10pts below full) → return
  handling (e-commerce apparel 15-25%; net return cost 20-50% of price if
  resellable, ~100% if clearance-only) and **write-down** to net realisable value
  for obsolete stock (last-season kits).
- **Stockout vs overstock tension:** under-forecast → lost sales but higher
  realised margin; over-forecast → markdown + write-down. This is the merch
  strategic loop, surfaced as a stock-buy decision against a demand forecast.

### 4. Merchandise demand is spiky and seasonal

Forecast multipliers on the planned stock buy (calibration bands):

- Kit-launch month ≈ **3-5×** average monthly kit sales; launch window (4-8 wks)
  captures ~30-50% of annual volume; decay 10-15% MoM + Christmas bump +
  season-end clearance.
- Global-icon signing → year-1 kit volume **×1.3-1.5**, named shirt 20-40% of
  name-set sales in launch month; regional star ×1.1-1.2.
- Cup-final month **×1.1-1.3** (+10-20% if won) — links to FMX-45
  `CompetitionRevenueProfile.matchdayCommercialModifiers` (merch demand band) and
  the existing `CupMerchandiseSpikePosted` event in ADR-0050.
- Promotion +20-40% retail next season; league/continental trophy year +10-30%.

Signals come from existing contexts: star/cup/rivalry from Audience & Atmosphere
+ Rivalry + League Orchestration; FMX-47 only converts them into stock-planning
forecast inputs and a spike settlement.

### 5. Service quality, SLAs and breach grading

Catering/merch service quality is an **input to Audience & Atmosphere**, not a new
owner of fan mood:

- Queue time, stockouts and quality feed satisfaction → revisit/repeat-spend →
  NPS/word-of-mouth (sourced causal chain). Indicative stepwise penalty
  (calibration): queue 5-10 min −5-10% spend; 10-20 min −15-30%; 20+ min −40-50%
  + "fans leave angry" events; each ~10% of fans hitting a stockout ≈ −2-3%
  cohort satisfaction, −1-2% NPS, −5-8% cohort F&B/merch.
- **SLA KPIs** (Expert contract surface): service speed (max queue / % served
  under X min at peak), availability (≥95-98% items, no top-5 stockout before
  ~75th min, POS uptime ~99%), hygiene/quality (audit score, temperature),
  experience (mystery-shopper ≥85/100, fan-survey ≥4/5), commercial (per-cap /
  share / MAG), compliance/staffing (alcohol/H&S/fire).
- **Breach grading** (reuses FMX-44 curable/material/critical):
  - *Curable*: single KPI miss (one-match queue/cleanliness slip) → warning +
    small service credit (~0.5-2% of event fee).
  - *Material*: repeated KPI failure (queue SLA missed ~50% of matches, repeated
    flagship stockouts, sub-minimum survey scores, under-reported share) → formal
    notice + 30-90d cure + larger credits; grounds for termination/step-in.
  - *Critical / event-of-default*: food-poisoning from gross negligence, hygiene
    closure, alcohol-law violation, fraud, not opening stands → immediate step-in
    + fast termination + damages.

### 6. Supplier exclusivity and category carve-outs (catering)

Catering supplier exclusivity reuses the FMX-44 exclusivity graph (category ×
territory × asset × carve-outs):

- **Pouring rights:** one supplier per beverage category (beer, soft-drink,
  energy) gets exclusive sell/serve/market rights in defined assets for a term
  (3-10y typical); club gets rights fee + revenue share + marketing + free
  dispensing equipment; supplier gets in-stadium monopoly + category-exclusive
  mark use + advertising exclusivity.
- **Carve-outs / conflicts:** narrow category definition + asset/territory split
  resolves clashes — a kit/league "official beer" can hold jersey + media rights
  while a different stadium pouring partner holds **in-stadium sales**; volume
  minor-exception (<~10%) and statutory carve-outs exist. CommercialPortfolio's
  conflict engine blocks or carves a new deal that overlaps a higher-priority
  contract in the same category × territory × asset × time.
- **Supplier mandates** constrain an outsourced operator: must-buy in-category,
  ranging limited to partner SKUs, equipment dependency, flagship volume
  incentives, capped price/margin with support — i.e. exclusivity reduces the
  operator's flexibility in exchange for better terms.

### 7. Cash vs recognition (IFRS 15) per model

Slots into the existing FMX-43/44 cash-schedule vs recognition-schedule split:

| Model | Cash timing | Recognition (IFRS 15) |
|---|---|---|
| Own-operation POS | At sale | At point of sale (cash ≈ revenue; prepaid card → deferred until redeemed) |
| Concession fixed rent | Per contract instalments | Straight-line over term (IFRS 16 if right-to-use space) |
| Revenue-share | Quarterly/annual settle | As concessionaire sales occur (variable consideration, contract asset for earned-not-billed) |
| Royalty (kit/merch licence) | On licensee report | Sales-based royalty exception — as licensee sales occur; no forward estimate |
| MAG + overage | MAG instalments + true-up | MAG straight-line; overage only when sales exceed floor |

Inventory (IAS 2): lower of cost and NRV; COGS in the period of the related
revenue; write-down to NRV for obsolete stock in cost of sales; POS markdown
reduces revenue (not COGS), but expected heavy discounting reduces NRV → earlier
write-down.

### 8. Progressive disclosure (Quick / Standard / Expert)

- **Quick:** a catering/merch contribution badge inside the stadium/finance
  health summary; a one-line "stock risk" / "service" flag; no operational knobs.
- **Standard:** per-family revenue contribution and operating-model choice;
  13-week catering cash/recognition schedule and merch stock-buy vs forecast;
  offer comparison (in-house vs partner) with a risk badge; breach/SLA status.
- **Expert:** full operational surface — per-service-point capacity & queue,
  per-item stock and stockout log, COGS/labour/waste breakdown, merch inventory
  turnover + markdown/returns, supplier-mandate & exclusivity graph, SLA KPI
  dashboard, contract register + obligation log + cash-vs-recognition detail.

### 9. AI-club behaviour (read-only hook for FMX-51)

AI clubs do not run the full operational sim in the MVP. FMX-47 exposes read-only
hooks (operating-model choice, per-cap band, stockout propensity, service-quality
band) so FMX-51 can give AI clubs plausible catering/merch outcomes without
duplicating the player's operational depth. No AI write-back in this beat.

## Acceptance scenarios

1. **Stockout** — A high-draw fixture exceeds the planned beer/food stock for a
   stand; the item sells out before full-time. Settlement records realised
   catering revenue below potential (`lost_revenue = unmet_demand × price`), a
   waste charge of zero for that item, and emits a satisfaction/queue penalty to
   Audience & Atmosphere; repeated occurrences escalate toward a material SLA
   breach (concession model) or hit the club P&L directly (in-house).
2. **Wasted inventory** — Over-ordering for a low-attendance midweek game leaves
   perishable food unsold; settlement posts a spoilage charge (~3-5% of food COGS
   normal, higher here) distinct from COGS, lowering operating margin without a
   revenue line.
3. **Cup-final merch spike** — A cup-final run triggers a demand multiplier
   (×1.1-1.3) and a limited-edition stock buy; settlement recognises a merch
   revenue spike (links `CupMerchandiseSpikePosted`), and any unsold post-run
   stock flows into season-end markdown/write-down rather than a hidden loss.
4. **Poor service-quality penalty** — A low-cost caterer repeatedly misses the
   queue-time and mystery-shopper KPIs; the contract opens a curable→material
   breach (service credits, cure period), Audience & Atmosphere lowers
   satisfaction/NPS and sponsor-fit, and a board prompt offers to replace the
   operator.
5. **Partner guarantee** — A merchandise licensed-partner (or kit-supplier MAG)
   season underperforms the minimum: the club still recognises the guaranteed
   minimum straight-line, while the sales-based overage true-up recognises zero;
   the partner bears the inventory shortfall, the club's downside is the capped
   take vs in-house upside foregone.

## Open questions / Nico decisions

1. **Operational depth ceiling for the MVP** — full per-item inventory/queue
   simulation, or abstracted per-fixture bands (per-cap × capacity factor ×
   stockout probability)? Recommendation: abstracted bands for MVP, with the
   per-item sim reserved for Expert/post-MVP, to avoid micromanagement.
2. **Default operating model per country profile** — should FMX-53 country
   profiles set a default (e.g. in-bowl beer + own-operation bias for
   Germany-like, concourse-only + partner bias for England-like)?
3. **Alcohol-policy modelling depth** — a three-state dial (in-bowl / concourse /
   near-ban) with a fixed revenue↔safety trade-off, or per-country hard
   guardrails tied to Regulations & Compliance?
4. **Service-penalty hardness** — how strongly stockout/queue/quality hit fan
   mood, repeat attendance and sponsor fit (soft flavour vs material economic
   driver)?
5. **Campaign-drop scheduling** — are merch campaign drops (kit launch, icon,
   cup) player-scheduled decisions or automatic events keyed off other contexts?
6. **Catering/merch as MVP-binding vs Standard/Expert-only** — does Quick mode
   abstract these to a single contribution number, deferring the operational loop
   to Standard/Expert?

## Related

- [[raw-perplexity/raw-catering-and-merchandise-operations-2026-06-01]] — raw transcript
- [[commercial-contract-lifecycle-and-breach-model-2026-05-28]] — FMX-44 lifecycle/breach shell this refines
- [[club-economy-impact-map-and-commercial-contracts-2026-05-28]] — FMX-41 impact map (catering/merch rows)
- [[fan-demand-price-elasticity-2026-05-28]] — FMX-42 per-segment demand inputs
- [[cup-and-competition-revenue-profiles-2026-05-28]] — FMX-45 cup merch-spike profile
- [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] — GDDR refined by this beat
- [[../50-Game-Design/economy-system]] — revenue taxonomy + commercial impact graph
- [[../50-Game-Design/stadium-and-campus]] — throughput / module inputs
- [[../50-Game-Design/audience-and-atmosphere]] — demand, service-quality, NPS consumer
- [[../30-Implementation/club-economy-commercial-contracts]] — `CommercialContract` family schedules
- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] — catering/merch ledger events
- [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]] — CommercialPortfolio settlement boundary
