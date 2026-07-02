---
title: "Raw capture — Stadium construction & expansion model pressure-test (FMX-216)"
status: raw
tags: [research, raw, dual-mode, fork-resolution]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-216
sourceType: external
---

# Raw capture — Stadium construction & expansion model (ADR-0137 pressure-test)

Raw external-research capture backing the FMX-216 pressure-test of
ADR-0137 (Stadium Construction and Expansion Contract). Queries were scoped
to the four load-bearing claims in the ADR: (1) construction-in-progress →
capitalise → write-off ledger flow under IFRS/IAS, (2) the financing ladder
(FMX-49 facilities + Fananleihe + naming-rights advance), (3) FSM state-set
minimality vs real construction lifecycles, and (4) the disruption model
(reduced-capacity-during-works precedents). Genre/game-design evidence was
already captured in the Stage-1 note
`stadium-construction-expansion-models-2026-07-02.md`; this note adds the
accounting, financing and construction-lifecycle grounding that note lacked.

Tools: `perplexity-ask` (Sonar), `exa web_search`. Figures flagged
low-confidence where the model extrapolated rather than cited a primary
source.

---

## Query 1 — Stadium construction accounting under IFRS/IAS (CIP → capitalise → depreciate; staged payments; borrowing costs)

**Prompt:** How is stadium construction accounted for under IFRS/IAS —
CIP/assets-under-construction recognition, capitalisation trigger, staged
payments and retentions, depreciation, borrowing costs (IAS 23), with real
club examples and what a simplified game model gets wrong.

**Substantive answer:**

- A stand/stadium under construction is **PPE — "assets under construction"**
  under **IAS 16**, recognised at cost once future economic benefits are
  probable and cost is reliably measurable (IAS 16.7, 16.10–16.17). Cost
  includes directly attributable costs (site prep, demolition of old stands,
  professional/architect fees, testing) but **not** general admin/marketing or
  abnormal/wasted costs, which are expensed (IAS 16.16(b), 16.19–20).
- **Assets under construction are NOT depreciated.** CIP is reclassified to
  the specific PPE class ("stadium and stands") when the asset is **available
  for use** — capable of operating as intended (substantially complete +
  safety certificates + can host matches), *not* when final payment clears.
  Depreciation begins from the available-for-use date (IAS 16.50–51).
- **Staged/milestone payments & retentions:** capitalised cost follows **work
  performed**, not cash paid. The full contract cost (including retention to
  be paid later) is capitalised as work is done; retention is carried as a
  **payable**, not an expense and not a reduction of asset cost.
- **Depreciation:** straight-line over useful life is typical; **componentisation**
  is expected — bowl/structure 30–50 yrs, roof/MEP shorter, seats/fit-out/IT
  5–20 yrs, depreciated separately. Useful lives and residual values reviewed
  at least annually (IAS 16.60–62, IAS 16.73 disclosures).
- **Borrowing costs (IAS 23):** a stadium under construction is the textbook
  **qualifying asset**; directly attributable interest is **capitalised** into
  the asset cost while works proceed, **suspended** during extended
  interruptions, and **ceases** at the available-for-use date (thereafter
  interest is expensed). Tottenham and Arsenal both capitalised interest
  during their stadium builds.
- **Impairment (IAS 36):** PPE tested when indicators exist (sustained
  attendance collapse, a stand made unusable, decision to replace); can be a
  **partial** impairment of one stand, not only whole-stadium.
- **Cost vs revaluation:** most clubs use the **cost model** (cost less
  accumulated depreciation/impairment), not annual fair-value revaluation.
  Accounting carrying amount ≠ external "club/stadium value".
- **What simplified game models get wrong (directly relevant to ADR-0137):**
  (a) capitalising *all* project cost incl. admin/relocation rather than only
  directly-attributable; (b) starting depreciation at construction start
  rather than **available-for-use**; (c) one uniform "stadium" life instead of
  componentisation; (d) expensing all interest instead of capitalising
  qualifying borrowing costs; (e) tying recognition to **cash paid** rather
  than **work performed** (the retention trap); (f) skipping IAS 36 impairment
  when economics deteriorate; (g) equating carrying amount with market value.

**Real club examples:** Tottenham Hotspur Stadium — costs accumulated as
assets-under-construction, transferred to PPE "stadium" when brought into use
April 2019, interest capitalised. Arsenal Emirates — "stadium project" /
assets-under-construction balances transferred to "freehold property — stadium"
on 2006 opening, depreciation commenced, interest capitalised during build.
Liverpool Main Stand (2016) / Anfield Road (phased) — treated as additions /
separate components, held in assets-under-construction until able to host
spectators, then reclassified and depreciated.

**Sources (IAS 16 / IAS 23 / IAS 36 standards + practitioner guidance):**
- https://www.ifrs.org/issued-standards/list-of-standards/ias-16-property-plant-and-equipment/ (IAS 16, authoritative)
- https://www.icaew.com/technical/corporate-reporting/ifrs/ifrs-accounting-standards-tracker/ias-16-property-plant-and-equipment (ICAEW, high)
- https://www.cpdbox.com/ias-16-directly-attributable-costs/ (directly-attributable-cost scope, medium)
- https://cpcongroup.com/insights/article/ias-16-asset-recognition-measurement-guide/ (recognition/measurement, medium)
- https://dart.deloitte.com/USDART/home/publications/deloitte/additional-deloitte-guidance/roadmap-ifrs-us-gaap-comparison/chapter-1-assets/1-6-property-plant-equipment (Deloitte, IAS 23 qualifying-asset, high)
- https://ifrscommunity.com/forum/viewtopic.php?t=1068 (no-depreciation-during-construction, medium)

**Confidence:** high on the standard's mechanics; club-specific paragraph
citations are pattern-consistent (clubs don't publish IAS paragraph numbers) —
medium.

---

## Query 2 — Stadium construction financing instruments & real deal sizes (Fananleihe, naming-rights advance, project finance, seat licences)

**Prompt:** How do football clubs finance stadium construction — Fananleihe
fan bonds (St. Pauli, Mainz, Hertha) with sizes/coupons/terms, naming-rights
advances (Emirates, Allianz, Etihad), syndicated/project finance (Tottenham,
Arsenal), premium-seat licences/debentures — with real sizes and confidence
flags.

**Substantive answer:**

- **German fan financing (Fananleihe / co-ops).**
  - **FC St. Pauli** — Millerntor stadium **cooperative (FCSP eG)**, equity-like
    fan financing to acquire a majority stake in the stadium company. **Share
    price €850** (one vote per member); **target raise up to €30m**; stadium
    valued ~€60m; expected **1–3% p.a.** return. Reported **raised ~€27–29m**
    (AP ~€29m; other reports ~€27m from ~20,000 fans; initial tranche ~€8.5m
    from 6,600 members). *This is the strongest, best-sourced anchor.*
  - **Schalke** — sponsors'/members' cooperative for Veltins-Arena
    participation reported at **up to ~€50m** (upper end of German fan
    financing). Medium confidence.
  - **Mainz 05 Fananleihe** — used a fan bond toward its new stadium; typical
    Bundesliga fan-bond size **~€5–10m**, coupon **~5–6% p.a.**, term **~5 yrs**.
    **Low-confidence** (extrapolated from the German fan-bond market, no
    Mainz-specific prospectus in results).
  - **Hertha BSC** — issued fan bonds in the 2010s toward operations/stadium
    costs, **mid-single-digit millions**, **~5–7%**, **5–10 yrs**.
    **Low-confidence** (no Hertha-specific figure in results).
  - General German Fananleihe pattern: retail tranches €100–€1,000, coupon
    **~5–7% p.a.**, term **~5–10 yrs**. (Coupon/term low-confidence.)
- **Naming-rights sponsorships / advances.** Emirates–Arsenal (naming +
  shirt, ~£90–100m initial, low-confidence), Allianz Arena (low tens of €m,
  low-confidence), Etihad–Man City (~£300–400m/10yr integrated campus, low-
  confidence). Mechanic: clubs either take **portions upfront** or use the
  committed future sponsorship cash flows to **support bank facilities/bonds**
  rather than purely cash-funding construction. Elite standalone naming rights
  ~£50–150m over 10–20 yrs; integrated shirt+stadium+campus packages up to
  ~£200–400m.
- **Syndicated / project finance.** Tottenham Hotspur Stadium — bank facilities
  (externally cited ~£400–500m) later refinanced via US private placement /
  long-term notes (~£600m total, maturities into 2030s, coupons ~3–5%),
  serviced by matchday/hospitality/commercial/naming-rights income
  (low-confidence, no prospectus in results). Arsenal Emirates — ~£260–300m
  long-term stadium financing via bonds + bank loans secured on stadium/matchday
  revenue, later refinanced into longer-dated fixed-rate notes (low-confidence).
  Pattern: **£300m–£1bn** packages, construction-period syndicated/revolving
  facilities → long-term fixed-rate bonds, secured on a stadium-owning SPV
  and/or assignment of matchday+hospitality revenue.
- **Premium-seat licences / debentures.** Arsenal debentures — tens of
  thousands £/seat, total ~£30–50m, quasi-equity toward the stadium
  (low-confidence). US PSLs — $500–$30,000/seat, whole-stadium programs into
  the **hundreds of $m** (some >$400m), recognised as capital contributions
  reducing required debt (low-confidence).

**Relevance to ADR-0137 §7 financing ladder:** the ADR's three-rung ladder
(a: FMX-49 `FinancingFacility` unchanged at MVP; b: Fananleihe + naming-rights
advance post-MVP; c: reject dedicated project-finance vehicle as IFRS-lite-
incompatible) maps cleanly onto reality. The **naming-rights advance** is real
and correctly routed as a CommercialPortfolio contract cash-flow, not a Stadium
posting. The **Fananleihe** is real and, per St. Pauli, can reach ~€27–30m
(larger than the ADR's "~€5–25m" band — the €5–25m band understates the
cooperative/large-issue upper end). Rejecting the covenant-heavy project-finance
vehicle is defensible for IFRS-lite, **but** real elite builds are almost always
covenant-bearing secured debt — so "no covenants ever" is a simplification, not
a realism claim (see synthesis).

**Sources:**
- https://apnews.com/article/st-pauli-stadium-owner-fans-6b83635cda8efe6e580bc0ef93ff039a (AP, St. Pauli ~€29m, high)
- https://www.bundesliga.com/en/bundesliga/news/st-pauli-cooperative-first-german-club-jackson-irvine-29680 (Bundesliga.com, €850/share, €30m target, high)
- https://www.nytimes.com/athletic/5793285/2024/09/26/st-pauli-stadium-cooperative/ (The Athletic, structure, high)
- https://www.thenews.coop/st-pauli-football-fans-co-op-to-acquire-majority-stake-in-the-stadium/ (co-op mechanics, medium)
- https://worldfootballindex.com/2024/11/fan-owned-stadiums-st-pauli-lead-the-way-with-fan-powered-stadium-bond/ (fan-bond framing, medium)

**Confidence:** high for St. Pauli cooperative; medium for Schalke; low for
Mainz/Hertha specifics, all naming-rights figures, all project-finance figures,
and all debenture/PSL figures (model-extrapolated, not primary-sourced).

---

## Query 3 — Construction lifecycle phases (FSM minimality) + reduced-capacity-during-works precedents

**Prompt:** Canonical construction-project lifecycle phases (RIBA / 5–6 stage
models) to sanity-check the FSM `Proposed → Committed → SitePrep →
UnderConstruction(multi) → Commissioning → Completed` (+ Paused/Cancelled);
which real phase is most commonly omitted; plus clubs playing at reduced/altered
capacity during rebuilds.

**Substantive answer (FSM minimality):**

- Industry lifecycle models (CMAA/BigRentz 5-phase; Autodesk 6-stage; Acuity/
  Kahua/Accruent 5-phase; a 7-stage extended textbook model) converge on:
  **pre-design/feasibility → design → procurement/tender → construction
  (substructure/superstructure/fit-out) + monitoring → post-construction /
  commissioning / handover → (occupancy → renewal → demolition)**.
- The proposed FSM is a **reasonable minimal operational state machine** *if*
  design/planning-permission/procurement are treated as sub-states of
  `Proposed`/`Committed` and defects-liability/retention as an attribute of
  `Completed`. Explicit mapping the model gave:
  - Proposed → conception/feasibility/business case
  - Committed → end of design + funding approval + **contract award** (wraps
    procurement/tender)
  - SitePrep → preconstruction (mobilisation, enabling works, demolition,
    utilities)
  - UnderConstruction(multi) → substructure/superstructure/fit-out + monitoring
  - Commissioning → testing/balancing/regulatory sign-off
  - Completed → handover, operational for matches
  - Paused/Cancelled → correctly flagged as exception states usually missing
    from textbook lifecycles (a strength of this FSM).
- **Most commonly omitted phases** (and thus the FSM's realism gaps):
  1. **Planning permission / building-permit gate** — real projects treat this
     as its own milestone gate between Proposed and Committed; a stadium can
     die here for years (Milan/Inter San Siro have sat in Proposed/Planning
     for years without ever reaching UnderConstruction).
  2. **Post-handover defects-liability / retention-release** — "Completed"
     (operational for matches) ≠ contractually closed; retention is released
     and defects corrected after fans are already in. Public narratives
     collapse this into "finished", which is exactly why simple state machines
     drop it.
  3. **Procurement/tender** — often merged into Committed; acceptable for a
     game but worth an explicit note.
- The model's key nuance for ADR-0137: **"Completed" should mean
  available-for-use (can host matches), which is also the IAS 16 capitalisation
  trigger** — so `ConstructionProjectCompleted` → `FacilityAssetCommissioned`
  (CIP capitalises) lines up with the accounting trigger *only if* "Completed"
  is defined as available-for-use, not "all defects closed". This is a precise,
  checkable definition the ADR should pin.

**Substantive answer (reduced-capacity precedents — validates §6 disruption):**

- **Real Madrid — Bernabéu redevelopment (~2019–2024):** played through works;
  official ~81k reduced to operational ~60–68k at stages while stands/roof were
  worked on (temporary figures inconsistently published — low-confidence on any
  single number, but reduced-capacity-during-works is well attested).
- **Liverpool — Anfield Road Stand (2023–24):** contractor issues forced
  operating with **only the lower tier open**; usable capacity held ~50–51k vs
  the planned ~61k for months, then **phased opening** as safety sign-offs
  released more seats. Textbook "commissioning constrains capacity even though
  the stand is physically built."
- **Tottenham — final White Hart Lane season (2016–17):** capacity reduced to
  ~32–33k (from ~36k) during overlapping demolition/works; then a **full season
  at Wembley (2017–18)** at altered capacity during main construction — the
  ground-share/temporary-home precedent (already flagged future-scope in the
  Stage-1 note).
- **AC Milan / Inter — San Siro:** *counter-example* — years stuck in
  Proposed/Planning/permits with no capacity impact, illustrating how long the
  pre-Committed phase can run.

**Game-design (exa) corroboration of "not a detached tycoon minigame":**
Game Developer — "in most tycoon games, constructions have minimal impact on
each other" (the busywork failure mode ADR-0137 §Rationale cites). Wayward
Strategy / Callum McCole on RTS base-building — placement/positioning is only
meaningful when structures **interact** (block, funnel, create opportunity cost);
ProjectPerko — a builder is defined by the **deepest constraint** (SimCity =
supply/radius; Evil Genius = congested space/security), i.e. depth comes from a
single load-bearing constraint, not parameter count. GamesAlchemy — layered,
partially-abstracted value and **systemic volatility on non-purchased layers**
keeps builders robust. All support Option B's "few, chunky, interacting
decisions" thesis and the D3 confinement of the pro edge to adaptation classes
(timing/re-phasing/financing reaction) rather than building count.

**Sources:**
- https://www.bigrentz.com/blog/phases-of-construction (CMAA 5-phase, medium)
- https://www.autodesk.com/blogs/construction/the-6-stages-of-construction/ (Autodesk 6-stage, medium)
- https://resources.kahua.com/blog/the-5-stages-of-a-construction-projects-lifecycle (5-stage PM, medium)
- https://acuityinternational.com/blog/construction-life-cycle/ (lifecycle, medium)
- https://www.gamedeveloper.com/design/what-should-we-do-with-mediocre-gameplay-depth-in-management-games- (tycoon depth, high)
- http://projectperko.blogspot.com/2015/11/base-building-variants.html (deepest-constraint thesis, medium)
- https://waywardstrategy.com/2015/11/23/rts-design-thought-control-of-economic-processes/ (meaningful base-building, medium)
- https://gamesalchemy.substack.com/p/58-emergent-gameplay-and-social-depth (layered value/systemic volatility, medium)

**Confidence:** high on lifecycle phase structure and the omitted-phase list;
high on reduced-capacity-during-works as a real pattern; low on individual
temporary-capacity numbers (Bernabéu/Anfield/WHL vary by match/source).

---

## Cross-cutting reconciliation flags surfaced during capture (internal, not external)

These were found while reading the vault to scope the queries; recorded here so
the brainstorm agents can weigh them:

1. **ADR-0050 already defines `ScheduleFacilityProject` (command) and
   `FacilityProjectCommitted` (event) inside Club Management.** ADR-0137 never
   references or reconciles them. Either the new `CommissionConstructionProject`
   (Stadium Operations) supersedes/absorbs `ScheduleFacilityProject`, or there
   are two overlapping "facility project" front doors in two contexts — a
   dual-write / ownership ambiguity that must be closed on ratification.
2. **No facility depreciation posting exists.** ADR-0137 §7 capitalises CIP →
   facility asset and re-bases *maintenance cost* + *ageing-decay curve*, but
   neither ADR-0137 nor ADR-0050's event list carries a facility-**depreciation**
   posting (ADR-0050 amortises player registrations, not PPE). Under IAS 16 a
   capitalised stand depreciates over its life. Modelling ageing purely as
   maintenance OPEX is a defensible IFRS-lite simplification but means the
   balance-sheet-like statement (GD-0008) will show a facility asset that never
   depreciates — a fidelity gap to name explicitly.
3. **`ScheduleMaintenanceProject`/`CompleteMaintenanceProject` (Stadium
   Operations, existing) vs the new construction FSM.** Boundary between a
   capitalised construction project and an expensed maintenance project needs a
   stated test (IAS 16: enhancement/replacement = capitalise; restoration =
   expense) so a "renovation" project type routes to the right ledger treatment.
4. **"Completed" = available-for-use** should be pinned as the definition, since
   it is simultaneously the FSM terminal-ish state and the IAS 16 capitalisation
   trigger; defects/retention is a post-Completed attribute, not a blocker to
   capitalisation or match-hosting.
