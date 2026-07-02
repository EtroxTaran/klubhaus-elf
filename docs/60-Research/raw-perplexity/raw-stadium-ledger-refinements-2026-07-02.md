---
title: "Raw capture — Stadium ledger & Expert-joy refinements (FMX-220)"
status: raw
tags: [research, raw, dual-mode, fork-hardening]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-220
sourceType: external
---

# Raw capture — Stadium ledger & Expert-joy refinements (FMX-220)

Raw external-research capture backing the four ADR-0137 stadium sub-forks
(FMX-220): fork 7 `ScheduleFacilityProject` disposition, fork 8 facility
depreciation treatment, fork 9 cancel-from-`Commissioning` ledger semantics,
fork 10 Expert-MVP expressive affordance. Verbatim-ish substance of the tool
answers with source URLs. **Raw, not normative** — the ADR carries the
recommendations; nothing here is a decision.

Tools: `perplexity_ask` (Sonar) for IFRS / accounting / real-club facts,
`exa web_search` for genre design evidence. Four focused queries.

---

## Query 1 (perplexity) — IAS 16 / IAS 36: cancelled / near-complete construction, CIP write-off vs capitalise, "available for use"

**Q:** Under IFRS (IAS 16 PPE, IAS 36 Impairment), how is a construction
project (CIP / asset under construction) cancelled or abandoned partway
through accounted for? When does an asset become "available for use" and stop
being CIP → reclass to PPE + depreciate (IAS 16.20–22)? If cancelled while
essentially complete / commissioning, is CIP written off as sunk cost or
capitalised as a completed asset? Impairment of CIP under IAS 36 on
abandonment? Cite paragraphs + give double-entry for both a mid-build
write-off and a near-complete force-completion.

**A (substantive):**

- **Core principle:** capitalise to CIP until the asset is **"available for
  use" (IAS 16.55)** — "in the location and condition necessary for it to be
  capable of operating in the manner intended by management." At that point:
  stop capitalising, reclass CIP → PPE, begin depreciation. Commissioning /
  testing costs are capitalisable under **IAS 16.16(b)**; once commissioning is
  done and the asset can operate as intended, it is available for use.
  Indicators: construction substantially complete; permits/occupancy
  certificate obtained; can produce output at normal capacity even if not yet
  used.

- **Reclass entry at available-for-use:** `Dr PPE – Building/Plant / Cr CIP`;
  thereafter `Dr Depreciation expense / Cr Accumulated depreciation`.

- **Cancelled with NO future economic benefit (abandoned, no use, no sale,
  no alternative use):** the capitalised CIP **fails IAS 16.7(a)** (probable
  future economic benefits) → does **not** qualify as PPE → **written off as an
  impairment / derecognition loss in P&L** (IAS 16.67–68 derecognition; IAS
  36.59 impairment). Crucially: *"The fact that the asset is almost complete or
  in commissioning does not by itself justify capitalisation as PPE if there
  will be no future benefits."*

- **Cancelled but asset is usable / marketable (repurpose or sale, some
  benefit probable):** it **does** meet PPE recognition → (1) reclass CIP → PPE
  at cost if available for use, (2) **test for impairment under IAS 36** (the
  change of plan is an impairment trigger, IAS 36.12(b)/(c)); write down to
  recoverable amount (higher of value-in-use and FVLCD) if below carrying
  amount.

- **IAS 36 on abandonment:** management's formal decision to abandon is a
  strong impairment indicator (IAS 36.9–12). CIP that doesn't independently
  generate cash inflows is tested within its CGU (IAS 36.66); if the project is
  abandoned and no CGU benefits, recoverable amount may be **nil** (or scrap
  value) → impair the whole balance. Impairment loss = carrying amount −
  recoverable amount, to P&L (IAS 36.59).

- **Postings — mid-build write-off (abandoned, scrap nil):**
  `Dr Impairment loss / Loss on abandonment (P&L) 10.0m / Cr CIP 10.0m`.
  With scrap 0.5m: `Dr Impairment loss 9.5m / Cr CIP 9.5m`, then on scrap sale
  `Dr Cash 0.5m / Cr Other income 0.5m`.

- **Postings — near-complete, forced to completion:**
  - *Case 1 (completed, will be used at lower return):* `Dr PPE / Cr CIP`
    (reclass), then impairment test → `Dr Impairment loss / Cr Accumulated
    impairment` for any excess over recoverable amount; depreciate remainder.
  - *Case 2 (completed/commissioned but then not used at all):* strictly it
    fails IAS 16.7(a) and recoverable amount is nil. **Method A (conceptually
    preferred):** treat as CIP impairment/derecognition, `Dr Impairment loss /
    Cr CIP`, no PPE reclass because it never met the probable-benefits test.
    **Method B (seen where completion + impairment are contemporaneous):**
    reclass `Dr PPE / Cr CIP`, then full impairment `Dr Impairment loss / Cr
    Accumulated impairment`; net carrying amount zero.

- **Salvageable parts:** impair CIP down to FVLCD of salvage; remaining balance
  may be reclassed to Inventory (IAS 2) if to be sold / reused as materials.

- **IFRIC / disclosure:** IFRIC agenda decision "Disclosure of idle assets and
  construction in progress" (May 2009) — IAS 16.74(b) discloses in-course-of-
  construction expenditure, IAS 16.79(a) encourages disclosing temporarily idle
  PPE, IAS 1.112(c) covers postponed/idle projects. Abandoned projects: recognise
  impairment + disclose nature, reason, amount written off, uncertainties.

**Sources:**
- IAS 16 (IFRS Foundation) — https://www.ifrs.org/issued-standards/list-of-standards/ias-16-property-plant-and-equipment/ ; https://www.iasplus.com/en/standards/ias/ias16
- IFRIC "Disclosure of idle assets and construction in progress" (May 2009) — https://www.ifrs.org/content/dam/ifrs/supporting-implementation/agenda-decisions/2009/ias-16-disclosure-of-idle-assets-and-construction-in-progress-may-2009.pdf
- Deloitte DART IFRS/US-GAAP PPE — https://dart.deloitte.com/USDART/home/publications/deloitte/additional-deloitte-guidance/roadmap-ifrs-us-gaap-comparison/chapter-1-assets/1-6-property-plant-equipment
- ACCA technical article on PPE — https://www.accaglobal.com/us/en/student/exam-support-resources/fundamentals-exams-study-resources/f7/technical-articles/ppe.html
- CIP accounting guides — https://track3d.ai/blog/construction-in-progress-cip-accounting-guide/ ; https://cpcongroup.com/insights/article/cip-accounting-construction-in-progress/

---

## Query 2 (perplexity) — Stadium depreciation under IFRS, useful lives, componentisation, FFP/FSR interaction, EBITDA flattering

**Q:** How do football clubs account for / depreciate stadiums under IAS 16?
Typical useful lives (Spurs, Arsenal, Man Utd, Bayern, Dortmund)? IAS 16
componentisation (structure vs pitch vs fittings vs hospitality)? Interaction
with UEFA FFP / FSR and domestic licensing — is depreciation in or out of
break-even, does excluding it flatter the result? Profit difference depreciate
vs not? Cite UEFA regs, club reports, Deloitte/KPMG.

**A (substantive):**

- **IAS 16 governs, like any preparer:** stadiums/training grounds = PPE at
  **cost** (or revalued amount), **depreciated over useful life**, usually
  **30–50 years** for the main structure. Depreciation is a **large non-cash
  expense** but **generally included** in UEFA break-even, so excluding it in
  commentary materially flatters the apparent result vs the *regulatory* result.
- **Depreciation is mandatory** for a finite-life asset — an entity **cannot
  choose not to depreciate** a stadium it recognises as PPE. The only "no
  depreciation" cases are not owning the asset (rent / short lease) or an
  indefinite-life classification, which IAS 16 does not permit for buildings.
- **Typical component lives:** structural shell/superstructure 30–50y; internal
  fit-out/finishes 10–20y (seats/finishes 5–10y); M&E (lighting, scoreboards,
  escalators, HVAC, security) 5–15y; corporate/hospitality fit-out shorter
  (~10–15y, frequent refurb to keep premium standard); pitch & sub-surface
  systems (drainage, undersoil heating, hybrid turf) short 8–15y (grass surface
  itself is recurring maintenance, not long-lived PPE); surrounding infra
  20–30y. Component replacement derecognises the old part and capitalises the
  new (IAS 16). Clubs disclose qualitatively ("buildings 50 years; fixtures &
  equipment 3–15 years") more often than a named "stadium" line; exact per-club
  lives must be read from each annual report.
- **FFP / FSR:** break-even starts from IFRS accounts with adjustments.
  Depreciation of tangible fixed assets is **part of the normal expense base and
  generally included** in break-even. **BUT** UEFA neutralises certain
  **long-term infrastructure** costs — depreciation and finance costs of *new*
  stadium/training-facility projects — plus youth development, women's football,
  community. European Leagues material: FFP aims to *"exclude certain long term
  investments, such as stadium infrastructure and training facilities, from
  punitive calculations"* while keeping the IFRS accounting treatment. Domestic
  licensing uses audited statements; stadium depreciation is normally **not**
  excluded from domestic profitability/going-concern tests.
- **Flattering:** stadium depreciation for a big club is easily tens of millions
  p.a. In IFRS profit it is fully recognised; in UEFA break-even, parts (new
  infra) may be added back → higher regulatory result than accounting profit.
  Clubs/lenders lean on **EBITDA** (excludes D&A) precisely because depreciation
  is large and non-cash — this flatters the "cash-proxy" performance but does
  not change statutory IFRS profit.

**Sources:**
- IAS 16 (IFRS Foundation) — https://www.ifrs.org/issued-standards/list-of-standards/ias-16-property-plant-and-equipment/
- PwC "Accounting for typical transactions in the football industry (IFRS)" — https://www.scribd.com/document/872941757/Pwc-Accounting-for-Transaction-in-Football-Industry ; https://www.footnotesanalyst.com/football-player-transfers-highlight-wider-reporting-issues/
- European Leagues – Philippa Lombardi, "Accounting of Football Players and FFP" — https://europeanleagues.com/wp-content/uploads/Philippa-Lombardi-Accounting-of-Football-Players-and-FFP.pdf
- KPMG "Blueprint for successful stadium development" — https://assets.kpmg.com/content/dam/kpmg/pdf/2013/11/blueprint-successful-stadium-development.pdf

---

## Query 3 (perplexity) — Stadium vs non-venue facilities (training/youth/medical): org, accounting, game treatment

**Q:** How do clubs distinguish stadium/venue operations from non-venue
facilities (training grounds, youth academy, medical/rehab)? Separate legal
entity/business unit for the venue while training/academy sit in football ops?
Different asset class / cost centre / financing process? In games (FM, WAF,
Anstoss) is stadium expansion a richer construction system while training/youth
facilities are simpler upgrade levels? Cite.

**A (substantive):**

- **Stadiums/venues are commonly ring-fenced more than training grounds.**
  German clubs use dedicated stadium companies/management entities (e.g.
  separate stadium GmbH / management vehicle); legal literature shows many clubs
  place the venue in a separate holding/property/stadium vehicle rather than the
  sporting club entity. Training/academy/medical infrastructure more often sits
  **inside the football/sporting side** or a facilities subsidiary that still
  serves the sporting group. League rules sometimes treat stadium **and**
  training facilities together as required infrastructure, but the *match
  stadium* is separated in a way training facilities usually are not.
- **Accounting:** not a fundamentally different accounting **class** — all are
  PPE / right-of-use assets — but clubs manage them as **different cost centres**
  and fund them through **different capital projects**: stadium projects are
  larger, more externally financed, more regulated, more likely structured via
  **separate SPVs / project vehicles**; training/academy/medical are usually
  **smaller sporting-infrastructure capex** inside the football group or a
  facilities subsidiary. FIFA training-site guidance treats training sites as
  distinct operational facilities with different design priorities from stadiums.
  Medical/rehab is the **least likely** to be a standalone business — usually
  part of the training-centre complex.
- **Games:** FM, WAF and Anstoss model the difference. **Stadium development is
  the more elaborate, slower, board-/owner-driven construction/expansion
  system**, while **training grounds and youth academy are simpler upgrade
  requests / facility levels / improvement menus** rather than the full
  stadium-construction pipeline — mirroring the stadium being the
  revenue-generating venue asset vs training/youth as supporting infrastructure
  with incremental upgrades.

**Sources:**
- KPMG stadium-development blueprint (SPV/project-finance framing) — https://assets.kpmg.com/content/dam/kpmg/pdf/2013/11/blueprint-successful-stadium-development.pdf
- DePaul J. Sports Law — stadium ownership vehicles/entities — https://via.library.depaul.edu/cgi/viewcontent.cgi?article=1186&context=jslcp
- LawInSport — ground-sharing / PL infrastructure requirements (stadium AND training facilities) — https://www.lawinsport.com/topics/item/ground-sharing-arrangements-in-the-premier-league-and-premiership-regulations
- FIFA training-site technical guidelines — https://inside.fifa.com/innovation/stadium-guidelines/technical-guidelines/training-sites/overview-of-training-sites

---

## Query 4 (exa) — Expert stadium-builder joy without free placement / tycoon minigame

**Q:** Game-design evidence on what makes an expert/advanced stadium
construction surface engaging and expressive without free-form placement or
becoming a detached tycoon minigame — FM vs Anstoss vs WAF depth.

**A (substantive highlights):**

- **Anstoss 3 (Retro Replay):** *"Take full command of your club's
  facilities — erect training halls, commercial outlets or up to three custom
  stadiums — and watch your empire flourish both on matchday and in the
  boardroom."* Off-pitch visuals: *"Constructing new buildings, upgrading your
  stadiums, or landscaping the complex is not only a financial decision but also
  a visual one. Watching your club's facilities grow over seasons adds a
  tangible sense of progression that complements the managerial gameplay."*
  *"Investing time in the club compound's construction … yields satisfying
  payoffs, reinforcing the sense of progression season after season."*
  → The load-bearing Expert joy is **visible multi-season growth + a legible
  financial-and-visual dual decision**, NOT free-form placement.
- **Anstoss 2 (Retro Replay):** stadium construction/expansion is one of the
  breadth pillars ("training, scouting, budgeting, stadium construction") that
  makes the sim reward "careful planning" — construction reads as a
  boardroom-level strategic decision, integrated with the rest, not a separate
  minigame.
- **FM 2023 stadium/facilities (Outsider Gaming):** upgrades ("increasing
  seating capacity or adding VIP boxes") *"impact your club's finances,
  reputation, and overall success"*; framed as **strategic long-term decisions
  aligned to a club philosophy/identity** ("Develop a Club Philosophy … Align
  your stadium and facilities upgrades with this philosophy"). The depth is in
  **consequence + identity alignment**, not placement UI.
- **WAF (Fuller FM 2024 review):** cautionary evidence — the reviewer's core
  complaint is *"too many worthless 'features' that don't add to the
  experience"* and pleads to *"strip out the unnecessary bloat, and instead add
  some more substance."* WAF's simplification / delegation ("These tasks can be
  delegated to other staff members if you just want to manage the basics") is
  praised for accessibility but the *bloat-without-substance* failure mode is
  exactly the "detached minigame / dialogs over the same toys" risk to avoid.
- **WAF (WayTooMany / Fuller 2021):** the behind-the-scenes/finance layer
  ("handling the club's finances … take loans or even start selling shares")
  is called *"way more interesting than actually coaching"* — i.e. an
  economically-consequential building/finance layer is a genuine draw when it
  feeds the club, but must be substance not fluff.

**Design read for Expert-MVP (fork 10):** the differentiator that makes Expert
"more than Standard-plus-dialogs" without a tycoon minigame is **expressive
composition + visible multi-season progression + identity**, all landing back
in the shared contract: phased multi-stand *programme* authoring (sequence &
overlap the player composes), a before/after / season-by-season growth
visualisation of that programme, and curated identity-module *composition*
(name/compose the stand & identity buildings) — expressive, not stronger, and
read-model-only per the "not a detached tycoon minigame" guard.

**Sources:**
- Anstoss 3 (Retro Replay) — https://retro-replay.com/db/windows/anstoss-3-der-fusballmanager/
- Anstoss 2 (Retro Replay) — https://retro-replay.com/db/windows/anstoss-2-der-fusballmanager/
- FM2023 stadium & facilities deep dive (Outsider Gaming) — https://outsidergaming.com/football-manager-2023-stadium-and-facilities-upgrades/
- We Are Football 2024 review (Fuller FM) — https://fullerfm.com/2024/04/24/review-we-are-football-2024/
- We Are Football review (WayTooManyGames) — https://waytoomany.games/2021/06/17/review-we-are-football/
- We Are Football review (Fuller FM 2021) — https://fullerfm.com/2021/12/29/review-we-are-football/

---

## Cross-fork takeaways (raw, for the ADR synthesis)

- Fork 9 has a **clean IFRS answer**: "essentially complete" does NOT force
  capitalisation — the test is *probable future economic benefit* at the
  decision date, not physical %-complete. Cancel-from-`Commissioning` should key
  on **intent-to-use**, not stage. A venue rebuild almost always retains
  future benefit → the realistic path is **force-complete → reclass to PPE →
  IAS 36 impairment test** (Case 1 / Method B), not a blanket sunk-cost
  write-off. Blanket write-off only fits genuine abandonment (no use).
- Fork 8: **not depreciating is a real IFRS deviation** (depreciation is
  mandatory for finite-life PPE) — so "held at cost, ageing = OPEX" must be
  named as an explicit IFRS-lite simplification, and its honesty caveat is
  sharpened by the fact that **FFP/licensing P&L is read** and depreciation is
  normally *in* break-even (excluding it flatters going-concern) — though UEFA
  itself neutralises *new-infrastructure* depreciation, which softens the
  distortion.
- Fork 7: real-world + genre both support **scope-to-non-venue**: venue is the
  ring-fenced, larger, SPV-financed, richer-construction asset; training/youth/
  medical are lighter incremental upgrades inside sporting ops — so a lighter
  path for non-venue facilities is the evidence-backed default, not full retire.
- Fork 10: genre evidence says Expert joy = **visible growth + expressive
  composition + identity**, and the anti-pattern to avoid is WAF-style
  bloat/dialogs — supports an expressive-not-stronger affordance over the shared
  contract, read-model-only.
