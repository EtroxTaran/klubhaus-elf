---
title: Raw Perplexity - Catering and Merchandise Operations Depth 2026-06-01
status: raw
tags: [research, raw, perplexity, economy, catering, merchandise, operations, inventory, ifrs15, legal, fmx-47]
created: 2026-06-01
updated: 2026-06-01
type: research
binding: false
linear: FMX-47
sourceType: perplexity
related:
  - [[../catering-and-merchandise-operations-2026-06-01]]
  - [[../commercial-contract-lifecycle-and-breach-model-2026-05-28]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
---

# Raw Perplexity - Catering and Merchandise Operations Depth 2026-06-01

This note preserves the FMX-47 research prompts and condensed raw outputs. It is
not implementation authority and not final balance data. The synthesis is
[[../catering-and-merchandise-operations-2026-06-01]]. All numeric ranges are
external benchmarks / industry inference, to be treated as calibration inputs
only. Competitor and operator names appear for analysis sourcing; in-game names
must follow [[../ip-and-licensing]] and
[[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]].

## Prompt 1 - stadium catering / concession commercial models and economics

Standard commercial models for stadium F&B (own-operation, concession lease,
management fee, revenue-share, minimum-guarantee-plus-share); who bears cost and
inventory risk; revenue/cost split; gross margin, COGS, labour, waste ranges;
per-capita spend benchmarks and drivers; MAG / management-fee / revenue-share
structuring; operational failure modes (stockout, queue, throughput).

### Condensed raw answer

- **Five models, distinct risk allocation:**
  - **In-house / own operation** — club owns capex, hires staff, buys stock,
    bears 100% inventory/waste risk, full price control. Keeps 100% top line but
    pays COGS ~25-35%, labour ~25-35%, other opex ~10-20% → operating margin
    ~10-20% of F&B revenue. "High control, lower cash yield after overhead."
  - **Concession lease (tenant)** — operator runs everything, bears 100%
    inventory/demand risk; venue gets fixed base rent and/or % of gross
    (~8-20%); venue take ≈ 10-20% of sales-equivalent; venue risk low.
  - **Management fee (cost-plus)** — operator manages but charges costs back to
    venue; **venue bears volume + inventory risk**; venue keeps all gross, pays
    actual opex + management fee (base ~1-5% of F&B revenue + incentive on
    profit/EBITDA above threshold).
  - **Revenue-share (participation)** — operator bears cost/waste; venue gets %
    of gross, commonly ~15-40% (food often mid-20s), can be tiered or split
    food vs alcohol.
  - **MAG + revenue-share** — operator pays max(MAG, % of gross). MAG often
    benchmarked to ~80-90% of expected % rent from a conservative year, grows
    with CPI; share ~15-25% of gross. Predictable floor for venue; operator
    carries volume risk up to MAG, both share upside above.
- **Economics bands (mixed sourced + inferred):** blended stadium COGS ~23-32%
  of revenue (gross margin 68-77%); beverages very high margin (soft drinks
  COGS <15-20%, draft beer ~20-25%); labour ~20-35% of F&B revenue (lower with
  kiosks/mobile order); other opex ~10-15%. Normal food waste ~3-5% of food
  COGS (≈1-2% of food revenue); badly-run/shock events up to ~10-15% of food
  COGS (3-5% of revenue).
- **Per-capita spend (PCP):** European football roughly €5-15/attendee
  (low €5-7 GA-heavy, mid €8-12, high €12-18+); US entertainment venues
  $15-30, $73/fan cited at major events. Hospitality/premium per-cap 3-10×
  general admission (partly booked under ticket/package, not pure F&B).
- **PCP drivers:** dwell time (longer stay → more buy occasions; clubs add
  pre/post experiences deliberately), product mix/quality, queue/throughput &
  friction (mobile order/express pickup/self-checkout raise transactions),
  stadium design/stand placement & "footfall coverage", demographics/fan
  profile (corporate/family spend more), premium vs GA.
- **Operational failure modes that cap revenue:** queue/throughput (a staffed
  POS lane ~60-120 transactions/hr; max sales in a window =
  transactions/min × window minutes × average basket; demand above capacity =
  lost demand); **stockouts** (sales of an item instantly capped at 0; worst at
  halftime peak with no restock window; lost revenue = unmet demand × price +
  satisfaction penalty); payment/tech failure; staffing shortfall (under =
  slow/queues/walk-aways; over = labour % up); layout/walk-by capture; weather
  (mix shift + attendance, raises waste if plan not adjusted).
- Sources: SportsBusinessJournal venue F&B provider breakdown; Wicketsoft
  concessions insights; FESmag sports-venue foodservice trends; FCSI stadium
  foodservice; Ground Control superior F&B; Foodbuy; Oracle Stadium-of-the-Future
  (per-cap and queue). Aramark / Delaware North / Levy-Compass / Sodexo cited as
  industry reference operators only (exact private terms not public → inferred
  bands flagged).

## Prompt 2 - football merchandise / retail commercial models, economics, demand spikes, inventory

Four retail archetypes (club-owned store + e-commerce, licensed partner /
wholesale, kit-supplier guarantee, pure licensing/royalty); who bears inventory
& fulfilment risk; margins, COGS, royalty rates, kit MGs; demand spikes (kit
launch, star signing, cup final, promotion); inventory risk (stockout,
overstock/markdown, returns, fulfilment); club annual-report reporting.

### Condensed raw answer

- **Four models:**
  - **Club-owned retail (store + e-commerce)** — club buys product wholesale,
    owns inventory, bears all stockout/overstock/markdown/obsolescence +
    fulfilment risk (3PL cost still on P&L). Books gross retail revenue.
  - **Licensed partner / wholesale** — partner (e.g. Fanatics-type) owns
    inventory, staffs, fulfils; club books **royalty/commission income**, not
    gross; gets guaranteed minimum + royalty on net sales.
  - **Kit-supplier guarantee** — manufacturer (Adidas/Nike/Puma-type) bears
    replica production + inventory risk; club gets fixed annual base
    fee/MG + royalty on net sales above threshold + value-in-kind (free
    playing/training kit).
  - **Pure licensing/royalty** — licensee bears all inventory/fulfilment; club
    gets royalty (~8-15% of licensee net sales) + per-category/territory MG.
- **Shirt economics (FootyHeadlines £80 shirt breakdown):** production ~£8
  (~10% of retail), retailer margin £26.40 (~40% ex-VAT), manufacturer share
  £23.47 (~35% ex-VAT), **club licensing fee £4.80 (~7% of retail)**, marketing
  £2.40, local distribution £1.60, VAT £13.33. In-house, club captures retail
  margin (~40%) + licence (~7%) ≈ ~47% ex-VAT gross. Bringing retail in-house
  lets a top club capture ~£38/shirt, ~5× a traditional kit-deal take.
- **Game bands:** replica kit retail gross margin 40-50% of net sales (COGS
  35-45%); other licensed apparel/accessories 50-60% margin. Club royalty from
  manufacturer/licensee 10-20% of net sales (elite ~20%; Liverpool cited at 20%).
  Kit-deal annual MG: global superstar club €70-120m; big top-5-league club
  €15-40m; smaller top-flight €2-10m; fixed cash often 60-80% of headline value.
- **Demand spikes:** kit-launch month ~3-5× average monthly kit sales, launch
  window (4-8 wks) ~30-50% of annual volume, then 10-15% MoM decay + Christmas
  bump + season-end clearance. Global-icon signing: year-1 kit volume ×1.3-1.5,
  named shirt 20-40% of name-set sales in launch month; regional star ×1.1-1.2.
  Cup-final merch month ×1.1-1.3 (+10-20% for winning); promotion +20-40% retail
  next season; league/CL trophy year +10-30%.
- **Inventory risk:** target stockout prob for core home shirt main sizes
  <5-10% month 1 (higher for extreme sizes / special editions). Season-end
  markdown 30-50% typical (up to 70% clearance); 20-40% of units sold
  discounted; lifecycle margin ends ~5-10pts below full-price. E-commerce
  apparel returns 15-25%; fulfilment ~€5-10/order all-in; dispatch 1-2 business
  days (customised shirts +days, peak delays).
- **Reporting:** Man Utd 20-F — Commercial (sponsorship; retail/merchandising/
  apparel/product licensing) vs Broadcasting vs Matchday; gross if principal
  (own retail), royalty if agent (licensing). BVB — Merchandising as distinct
  segment alongside Match operations / Advertising / TV / Conference-catering.
  Real Madrid / Barça — Commercial income split sponsorship vs merchandising &
  licensing; both internalising retail to capture more margin.
- Sources: FootyHeadlines shirt-price breakdown; Retail-Focus football retail
  economics; TheFootballWeek kit/merch business model; Togwe shirt-sponsorship;
  Man Utd / BVB / Real Madrid / Barça reporting structure.

## Prompt 3 - IFRS 15 revenue recognition for catering and merchandise (cash vs recognised)

IFRS 15 treatment of own-operation POS, concession lease/fixed rent,
revenue-share variable consideration, royalty income (sales-based royalty
exception), MAG vs sales-based true-up; deferred revenue mechanics for upfront
fees/advances/season deals; inventory write-down / COGS (IAS 2); football-club
practice.

### Condensed raw answer

- **(a) Own-operation POS food/beverage/retail** — single obligation to
  transfer goods; revenue **at point of sale** when control passes;
  cash ≈ revenue same time (unless prepaid stored value → contract liability
  until redeemed).
- **(b) Concession lease / fixed rent** — if it grants right to use identified
  space → **IFRS 16**, lease income straight-line over term; if fundamentally a
  service → IFRS 15 over time. Fixed rent/fees recognised evenly over term
  regardless of cash timing.
- **(c) Revenue-share from concessionaire** — **variable consideration**
  recognised as the concessionaire's underlying sales occur, subject to the
  constraint (only amount highly probable not to reverse); cash may lag
  (quarterly/annual settle) → accrue contract asset for earned-not-billed.
- **(d) Royalty from licensed merch/kit partner** — licence of IP; IFRS 15
  **sales-/usage-based royalty exception**: recognise at the later of the
  sale/usage occurring and the obligation being satisfied → recognise **as the
  licensee makes sales**; do not bring forward future expected royalties.
- **(e) MAG vs sales-based true-up** — fixed minimum guarantee = fixed
  consideration, usually recognised **straight-line over the licence term** (a
  right-to-access licence); variable **overage** above threshold = sales-based
  royalty recognised **only when licensee sales exceed the minimum and occur**
  (often later in season once data known).
- **Deferred revenue / cash-vs-recognition:** upfront signing fee → contract
  liability, released over term; advance hospitality/catering package cash →
  deferred revenue until match/event occurs; season-long sponsor/box deals →
  over time across the season (per match/month). Distinguish **billing schedule
  (cash)** from **recognition schedule (performance obligations)**; deferred
  revenue unwinds as matches/events simulate.
- **Inventory (IAS 2):** measure at lower of cost and net realisable value;
  COGS recognised in same period as related revenue; write-down to NRV (unsold
  last-season kits, obsolete merch) charged in cost of sales; markdown at POS
  reduces **revenue** (COGS unaffected) but expected heavy discounting reduces
  NRV → write-down before sale. Lower-performing kits hurt margin twice (lower
  unit revenue + possible impairment).
- **Football practice:** matchday ticket/hospitality/catering recognised when
  match played; season tickets/boxes allocated over home games (cash up front →
  contract liability released per game); own retail at point of sale/delivery
  with COGS + write-downs in cost of sales; licensing/kit = guaranteed minimum
  over term + royalties as licensee sales occur (sales-based royalty exception).
- Sources: ACCA AB Magazine "IFRS and football finance"; KPMG IFRS 15 ISG
  handbook; PwC "Accounting for typical transactions in the football industry";
  ICAEW IFRS 15 tracker; Compass Group IFRS 15 presentation; IAS 2.

## Prompt 4 - service-quality → fan effects, alcohol policy, catering/retail SLAs and breach grading

How F&B/retail service quality (queue, stockout, quality, sold-out merch)
affects satisfaction / repeat spend / NPS; stadium alcohol regimes (England &
Wales 1985 Act, Germany, Spain, Italy) and revenue/safety impact; concession SLA
KPIs and remedies; breach grading minor/material/critical.

### Condensed raw answer

- **Service quality → outcomes:** baseball-stadium study (Kim, Trail & Magnusen)
  models food quality + service quality + price fairness + physical environment
  → satisfaction → revisit intention + word-of-mouth (NPS proxy); all
  significant positive. Generalises to football: better food/service/price →
  higher satisfaction → repeat attendance + recommendation.
- **Queues:** Oracle Stadium-of-the-Future (3,000+ fans) — 72% had F&B
  experience issues (long lines highlighted), 74% would use express pick-up,
  57% want pre-order. NFL Ralph Wilson study — top concern was long waits.
  No single threshold; gameable stepwise penalty (inferred, consistent with
  data): 0-5 min none/small bonus; 5-10 min −5-10% spend, small NPS hit; 10-20
  min −15-30% spend, complaints; 20+ min −40-50% spend, fans-leave-angry events.
- **Stockout/quality shock:** each ~10% of fans hitting a stockout ≈ −2-3% cohort
  matchday satisfaction, −1-2% NPS, −5-8% incremental F&B/merch from that cohort
  (calibration, direction sourced). Sold-out star shirts = lost basket + NPS hit
  among high-involvement fans + possible pent-up pre-order demand.
- **Alcohol regimes:** England & Wales — Sporting Events (Control of Alcohol
  etc.) Act 1985: no alcohol **in view of the pitch**, concourse/hospitality
  only → ~10-30% lower per-cap than in-bowl, intense half-time concourse queues.
  Germany/Bundesliga — alcohol generally allowed in view of pitch (beer culture,
  high volume); temporary bans / "alkoholfrei" for high-risk games. Spain —
  effectively prohibits >1% ABV sale inside stadiums (low-alcohol only). Italy —
  strength-restricted, local risk-based bans. Pattern = general regime +
  match-specific risk restriction. Liberal alcohol → +F&B + atmosphere but
  +disorder probability + policing cost; strict → −F&B + −some atmosphere but
  −incidents.
- **SLA KPIs:** service speed (avg transaction time, max queue, % served under
  X min at peak), availability/stock (≥95-98% menu items, no top-5 stockout
  before ~75th min, POS uptime ~99%), quality/hygiene (food-safety audits,
  cleanliness, temperature), customer experience (mystery-shopper ≥85/100,
  fan-survey ≥4/5), commercial (per-cap targets, revenue-share/MAG),
  compliance/staffing (levels per stand, alcohol/H&S/fire).
- **Remedy ladder:** service credits / fee reductions (tiered, ~0.5-10% of event
  fee) → cure period + corrective action plan (30-90 days) → step-in rights
  (venue/replacement operator takes over, costs charged back) → termination for
  cause (persistent uncured failure, regulatory/licence breach, fraud, gross
  negligence) ± termination for convenience.
- **Breach grading:** **minor/curable** (single KPI miss, low impact, quick fix
  → warning + small credit); **material** (repeated KPI failures e.g. queue SLA
  missed 50% of matches, repeated flagship stockouts, sub-minimum survey scores,
  missed/under-reported revenue share → formal notice + 30-90d cure + bigger
  credits, grounds for termination/step-in); **critical/event-of-default**
  (food-poisoning from gross negligence, hygiene closure, alcohol-law violation,
  fraud, abandonment/not opening stands → immediate step-in + fast termination +
  damages).
- Sources: Kim/Trail/Magnusen baseball F&B study (Emerald IJSMS); Oracle
  Stadium-of-the-Future; NFL/Ralph Wilson concessions studies; The Sport Journal
  concessions review; Foodbuy/Middleby operational metrics; Sporting Events
  (Control of Alcohol etc.) Act 1985 + comparative DE/ES/IT notes.

## Prompt 5 - supplier exclusivity, pouring rights and category carve-outs

How pouring-rights / category-exclusivity deals work (beer, soft-drink, energy);
what venue gets vs what supplier gets; carve-outs and conflicts vs kit/league
sponsors; food/catering supplier mandates constraining operators; contract
length, exclusivity scope, renewal/breach; quantified examples.

### Condensed raw answer

- **Pouring-rights structure:** one supplier gets exclusive right to sell/serve/
  market beverages in a defined **category × territory × asset set** for a fixed
  term. Categories defined narrowly (all non-alcoholic packaged; or split lots:
  draught beer / bottled beer / wine / spirits / soft drinks). Common carve-outs:
  tap/bulk water, milk, brewed coffee/tea, fresh juice.
- **Venue gets:** rights/sponsorship fee (often multi-year), revenue share
  (Arkansas: 40% of cold-beverage vending, 25% of snack vending retained as
  licence fee), marketing/brand activation + category-exclusive use of club
  marks + competitor protection in owned inventory, free/subsidised dispensing
  equipment & branded fridges, sometimes capital improvements for term.
- **Supplier gets:** monopoly on relevant taps/packaged beverages in scope
  ("served exclusively at all games/events/concessions"), category-exclusive use
  of marks, advertising exclusivity (menu boards, LED, cups, napkins).
- **Carve-outs/conflict resolution:** hierarchy/master agreement (property owner
  league/venue reserves pouring rights downstream operators must honour;
  airport-restaurant national partners yield to venue master deal); narrow
  category/sub-category definition (league "official global beer" = media/IP vs
  venue "exclusive draught inside concourses" = physical product); territory &
  asset carve-outs (league owns pitch-perimeter LED/broadcast/player image;
  venue owns concourse/kiosk/in-seat; club kit-sponsor beer on jersey + media
  backdrops but **no in-stadium sales**); volume-based minor-exception carve-out
  (competing product allowed if <~10% of sales); pre-existing statutory rights
  (e.g. visually-impaired vendor licences) as accepted carve-outs.
- **Food/catering supplier mandates:** must-buy obligation (operator purchases
  all in-category from contracted supplier, no parallel sourcing, contracted
  prices), menu/ranging constraints (SKUs from partner portfolio beyond
  carve-outs), equipment dependency (supplier owns dispensing kit), promotional
  alignment / volume incentives (operator must run flagship campaigns), price/
  margin capped by master agreement but with lower wholesale + support.
- **Length/scope/renewal/breach:** PRCs average 8-10 years (examples: Arkansas
  10y; Peoria 10y + two 5y options = up to 20y; Brockton Rox 5y; Dublin EHS
  3.5y). Realistic range 3-10y. Scope = category × territory (single stadium vs
  campus + training + parks) × assets (vending, concessions, club stores,
  in-seat, event catering, IP/marks). Renewal usually re-tendered (incumbent
  advantage / right of first offer; performance-conditioned). Breach = selling
  competing volume in restricted scope / failing to protect exclusivity → cure
  period → fee suspension/reduction → termination + damages (repay incentives /
  pro-rated fees) + "poisoned well" future-bid effect.
- **Quantified examples:** Peoria pouring-rights est. $0.5-2.0m over term;
  major pro-sports venue pouring rights mid-six to low-eight figures over
  multi-year; minor-league hundreds of thousands to low millions over 5-10y.
  Scale with capacity, event days, league tier, category (beer higher per-cap).
- Sources: HigherGov Peoria pouring-rights RFP; Brockton Rox-Coca-Cola; Univ.
  Arkansas sponsorship proposal; Dublin EHS/Abargrove tender; IJHPM university
  pouring-rights review; Enliven airport pouring-rights; Miami Univ. Pepsi
  redacted contract (statutory carve-out).

## Rules

- Raw notes may quote competitor / operator / brand names for analysis only.
  In-game caterer, supplier, brand and product names must follow
  [[../ip-and-licensing]] and
  [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]] (evocative but
  clearly not real; genre-generic terms like Würstchenbude are acceptable).
- All numeric ranges are external benchmarks or industry inference — calibration
  inputs only, never final balance constants, never binding.
- Promoted points are linked both ways to the synthesis
  [[../catering-and-merchandise-operations-2026-06-01]].
