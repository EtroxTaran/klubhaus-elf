---
title: "Stadium construction & expansion models — closing the Stadium Operations contract gap"
status: draft
tags: [research, dual-mode]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-212
sourceType: external
context: [stadium-operations, club-management-economy]
related:
  - [[raw-perplexity/raw-stadium-construction-expansion-models-2026-07-02]]
  - [[../50-Game-Design/stadium-and-campus]]
  - [[../20-Features/feature-stadium-builder]]
  - [[../10-Architecture/modules/stadium-operations]]
  - [[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/progressive-disclosure-ui]]
  - [[club-financing-tools-2026-06-01]]
  - [[dual-mode-precedents-sports-management-2026-07-01]]
  - [[assisted-play-parity-auto-coach-2026-07-01]]
  - [[tier-parity-measurement-calibration-2026-07-01]]
---

# Stadium construction & expansion models — closing the contract gap

## Question

The Stadium Operations public contract (ratified direction in
[[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit|ADR-0061]],
transcribed in [[../10-Architecture/modules/stadium-operations]]) has **no
capacity-expansion or construction command** — it covers matchday timeline,
maintenance, venue events, pitch, compliance checks and seat-class
rebalancing only, while construction/build-out exists only in draft notes
([[../50-Game-Design/stadium-and-campus]] §2/§4/§6,
[[../20-Features/feature-stadium-builder]]). Which expansion/construction
model should close that gap; what new commands, events and ledger flows does
each option need; and how does the easy-vs-pro surface split (D1 two worlds /
three tiers, D3 bounded pro edge, D4 full sweep) apply to it — without turning
the stadium into "a detached tycoon minigame"?

## Summary

The genre evidence is unusually consistent. Anstoss 3's beloved Stadionbau
worked because it combined visible, plot-based growth with *economically
meaningful* per-stand choices (standing/seats/roof/VIP), flavourful grounds
modules (Würstchenbude, Bierzelt, Fanshop, Disco, Hotel) and real construction
time that cost short-term capacity and income — exactly the loop FM's
board-request model lacks, which players describe as passive "one-button"
management, and which We Are Football was praised for restoring but criticised
for shipping *without build time*. Tycoon design analyses locate the fun in
fast, readable cause→effect and layered progression, and the busywork in
parameter counts that don't interact (FIFA Manager's per-toilet settings) and
in builders that lose economic relevance once "solved". Real-world anchors
give calibration bands: single-stand expansions of +3–10k seats take roughly
1.5–3 seasons at ~€2–10k per added seat, new stadiums 3–5 seasons; premium
hospitality is only 5–15% of capacity but 40–60% of matchday revenue; safe
standing packs ~1.6× seated density. Financing maps almost one-to-one onto the
existing FMX-49 `FinancingFacility` layer (bank loan, restructuring) plus two
stadium-flavoured instruments (Fananleihe fan bond, naming-rights-linked
advance via CommercialPortfolio). Three scoped model options are laid out
below; the evidence-based recommendation (not a decision) is to ratify the
**Option B construction-project FSM contract surface now**, ship Option A's
Quick wizard as the Easy compile-down over that same contract (mirroring the
ratified easy-tactic pattern), and defer the plot-based Expert builder
(Option C) as a post-MVP planning layer that compiles to the same commands.

## Findings

1. **Finding:** Contract gap confirmed. The Stadium Operations command list
   (`ScheduleMatchdayTimeline`, `AdvanceMatchdayTimeline`,
   `TriggerMatchdayEvent`, `BookVenueEvent`, `CompleteVenueEvent`,
   `ScheduleMaintenanceProject`, `CompleteMaintenanceProject`,
   `RecordPitchCondition`, `RegisterFacilityComplianceCheck`,
   `RebalanceSeatClassInventory`) contains nothing that adds capacity,
   builds a module or rebuilds a stand — yet the draft design layer
   (capacity tiers, ≥8 attraction modules, construction queue, ageing,
   crash-build for promotion compliance) presumes all of these, and
   `StadiumCommercialSnapshot` already promises "available capacity after
   construction".
   **Source:** [[../10-Architecture/modules/stadium-operations]] §Public
   contract; ADR-0061 §Public contract direction;
   [[../50-Game-Design/stadium-and-campus]] §2/§4/§6/§8;
   [[../20-Features/feature-stadium-builder]] §MVP scope.
   **Confidence:** high (internal, verbatim).

2. **Finding:** Anstoss 3's stadium builder — the vault's flagship
   differentiator reference — was a plot/tile construction screen with four
   independently upgradable stands (size steps, standing↔seats conversion,
   roof, VIP) plus grounds modules (Würstchenbude/Imbiss, Bierstand/Bierzelt,
   Fanshop, Parkplätze, Disco, Hotel, Restaurant, ad boards, VIP-Logen) and a
   buyable new foundation for full rebuilds. Retrospectives attribute its
   longevity to (a) *visually watching the complex grow*, (b) every element
   having a legible income/attendance/satisfaction effect worth optimising
   (fan forums ran Rentabilität threads on stand configs), and (c) humorous
   identity buildings — not to free-form placement depth.
   **Source:** de.wikipedia.org/wiki/Anstoss_3; anstoss-juenger.de topic 5213;
   forum.anstoss-zone.de t=14771; soccer-fans.de thread 1834; details in
   [[raw-perplexity/raw-stadium-construction-expansion-models-2026-07-02]] §1.
   **Confidence:** medium (element list reconstructed from fan
   forums/let's-plays; no authoritative table survives publicly).

3. **Finding:** Construction *duration with temporary pain* is a
   genre-expected mechanic, not optional flavour: Anstoss 3 projects completed
   over multiple matchdays and big projects temporarily reduced usable
   capacity (players priced that into payback planning), while We Are Football
   was explicitly criticised because "Neue Gebäude verfügen über keine
   Bauzeit, sondern sind direkt voll funktionstüchtig" (new buildings have no
   build time and work immediately) — called out as missing genre standard.
   **Source:** PC Games WAF test (pcgames.de, 2021-06-23); anstoss-zone forum
   Rentabilität thread; raw note §1/§5.
   **Confidence:** high (direct review quote).

4. **Finding:** Football Manager's model — board request → wait — is the
   documented anti-pattern for this feature. FM20–24 exposes no design,
   financing or phasing choice; facilities are one abstract quality level;
   community guidance is literally "keep trying, keep asking". German reviews
   of WAF note the stadium/grounds build-out is a feature "von alten
   Anstoss-Veteranen beim FM oft vermisst" (long missed in FM by Anstoss
   veterans), and GameStar recommends WAF specifically to players who enjoy
   stadium/grounds build-out.
   **Source:** fminside.net guide 33 ("How to build a new stadium in FM");
   r/footballmanagergames 1bc8b7c; videospielhalbwissen.de WAF review;
   gamestar.de WAF test.
   **Confidence:** high for the mechanics; medium for the aggregated
   "passive/one-button" sentiment (community synthesis, no single long-form
   critique URL).

5. **Finding:** Tycoon-genre design analyses converge on what separates fun
   depth from busywork: fast loops with *visible cause→effect*, layered
   complexity unlocked by mastery, and constructions that interact — versus
   (a) parameter-count depth where "constructions have minimal impact on each
   other" (Game Developer), (b) builders whose economy is solved early so the
   building layer loses relevance (Planet Coaster "directed sandbox"
   analysis), and (c) "no progression: the tenth hour identical to the first"
   (Polylusion). FIFA Manager 10's "set the number of toilets, VIP rooms and
   similar things" is the concrete football-genre example of granularity
   without interaction.
   **Source:** gamedeveloper.com "What should we do with mediocre gameplay
   depth in management games?"; projectperko.blogspot.com "Directed Sandbox
   (Planet Coaster)"; polylusion.com "What makes a great tycoon game";
   mobygames.com FIFA Manager 10.
   **Confidence:** high (published design analyses, directly quoted).

6. **Finding:** Real-world calibration anchors (believable scale): single
   major stand expansion ≈ 18–36 months of main works (Liverpool Main Stand
   +8,500 seats ≈ 20–21 months; Anfield Road Stand +7,000–7,800 ≈ 24–30
   months); new 40–60k stadium ≈ 3–5 years (Tottenham Hotspur Stadium;
   Bernabéu rebuilt in ~4–5 years while in use). Cost per added seat ≈
   €2–4k (simple GA end stand), €3–6k (stand with boxes), €6–10k (hospitality
   "super stand"), €4–15k/seat for new builds depending on market. Typical
   capacity steps: +1–3k (minor/corner/rail-seat), +3–7k (end stand), +5–10k
   (major side stand), +10–30k (new stadium jump).
   **Source:** en.wikipedia.org List of European stadiums by capacity
   (Anfield stand data); populous.com Emirates showcase; FT stadium-economics
   reporting (ft.com/content/faeff9d5-…); raw note §3.
   **Confidence:** high for named projects; medium for the €/seat bands
   (aggregated from press by the research model, not per-number cited).

7. **Finding:** Premium/hospitality and standing anchors: hospitality is
   typically 5–15% of capacity at modern venues yet drives ~40–60% of
   matchday revenue (FT on Tottenham/Arsenal/Real Madrid; premium seats yield
   ~5–10× a standard ticket); safe standing packs ≈1.6× seated density
   (Dortmund Südtribüne: 24,454 standing domestically vs ~15,000 seats in
   UEFA configuration); traditional German grounds run ~20–35% standing
   (top flight) to 30–50% (second tier). These validate the seat-mix
   trade-off table already drafted in stadium-and-campus §3 and give it
   numeric envelopes.
   **Source:** ft.com/content/faeff9d5-…; en.wikipedia.org European stadium
   capacity list; ehne.fr stadium-uniformisation encyclopedia entry.
   **Confidence:** high for the Dortmund ratio; medium for the percentage
   bands.

8. **Finding:** Real construction financing maps cleanly onto vault-existing
   contracts: syndicated bank loans/project finance secured on future
   matchday+commercial income (Emirates), naming-rights deals covering large
   capital shares over 10–20 years (Emirates, Allianz Arena, Etihad), owner
   equity/private placements (Tottenham), premium-seat licences/debentures
   (Arsenal), and German retail **Fananleihe** fan bonds (~€5–25m raises,
   e.g. St. Pauli, Mainz 05). FMX already owns the machinery: FMX-49
   `FinancingFacility` (bank loan, sponsor advance, restructuring) in Club
   Management, sponsor/naming-rights contracts in CommercialPortfolio, ledger
   posting exclusively in Club Management per ADR-0050.
   **Source:** populous.com Emirates showcase; ft.com stadium economics;
   [[club-financing-tools-2026-06-01]]; [[../50-Game-Design/GD-0008-finance-economy]]
   §FMX-49 amendment.
   **Confidence:** high for instrument existence and vault mapping; medium
   for the Fananleihe size band (Perplexity aggregate, plausible but the
   specific €5–25m range was not independently source-checked).

9. **Finding:** Per-area depth toggles have direct genre precedent: FIFA
   Manager let players set difficulty *and responsibility* per aspect
   (delegate whole areas such as finance while playing others hands-on), and
   WAF routes unwanted depth to staff who *propose* actions weekly. Both
   support the vault's Auto-Coach "proposes, never overwrites" guarantee and
   the per-area tier override already listed as future-scope in
   [[../50-Game-Design/progressive-disclosure-ui]] §10.
   **Source:** mobygames.com FIFA Manager 10 ("customizable difficulty level…
   chooses which aspects fall in his responsibility"); pcgames.de WAF test
   (staff proposal loop); raw note §5.
   **Confidence:** high.

## Inputs For Decisions

The ratified frame (D1 three tiers branded as two worlds, D2 switch anytime,
D3 bounded pro edge, D4 full sweep, easy surfaces compiling into the same
contract) is taken as given. This section feeds the **open** stadium-expansion
fork plus two newly discovered sub-forks. Every recommendation below is a
**recommendation, not a decision**.

### Open fork: stadium expansion model (this packet)

All three options respect ADR-0061's boundary: Stadium Operations owns
physical/venue facts and the construction lifecycle; Club Management remains
the sole ledger writer (ADR-0050) and owns financing facilities (FMX-49);
CommercialPortfolio owns naming-rights/sponsor contracts and consumes the
capacity/hospitality snapshots. "Not a detached tycoon minigame" is enforced
structurally: every construction output lands in the already-contracted
snapshots (`StadiumCapacitySnapshot`, `StadiumCommercialSnapshot`,
`HospitalityInventorySnapshot`) that Match, CommercialPortfolio, Audience &
Atmosphere and Regulations already consume.

#### Option A — Simple upgrade path (MVP floor)

One linear capacity-tier ladder (the five tiers of stadium-and-campus §2)
plus a curated module list with fixed cost/duration per step. No per-stand
granularity; seat mix changes only as a side effect of tier templates.

- **New contract surface:** commands `CommissionFacilityUpgrade(upgradeId,
  financingPlanRef?)`, `CancelFacilityUpgrade`; events
  `FacilityUpgradeCommissioned`, `FacilityUpgradeCompleted`,
  `StadiumCapacityTierChanged`; read model `UpgradeCatalogBoard`. Completion
  reuses `SeatClassInventoryRebalanced` + snapshot republish.
- **Ledger flow (Club Management via ACL, double-entry):** on commission —
  scheduled cash obligations (stage payments) + capitalised
  construction-in-progress asset; on completion — CIP → facility asset,
  maintenance base raised; per GD-0008 build-economics formulas. Financing
  optional: a single `FinancingFacility` drawdown reference.
- **Easy/pro split:** Quick = build wizard "next 1–3 upgrades" (already the
  drafted Quick surface); Expert sees the same catalogue with numbers. Pro
  surface adds nothing structural — which is exactly the problem.
- **Pros:** smallest contract delta; fastest to first playable (matches
  feature-stadium-builder's "capacity/run-cost signals + simple upgrade path"
  roguelite floor). **Cons:** reproduces FM's criticised passivity one level
  up (Finding 4); no seat-mix or phasing decisions means the Anstoss appeal
  (Finding 2) and the D3-relevant expert decision classes never exist; a
  later move to Option B would break the command surface (upgradeId ladder →
  project spec).

#### Option B — Tiered expansion with a construction-project FSM (recommended contract shape)

Discrete, chunky projects — per-stand upgrade/rebuild, seat-mix conversion,
module build, foundation/new-stadium — each running a deterministic
construction FSM with duration, staged payments and temporary capacity
restrictions. Granularity: 4 stands + curated module slots (stadium-and-campus
§9.1 explicitly prefers slot-based over free placement), *not* plots.

- **New contract surface (draft precision, mirrors existing naming style):**
  - Commands: `CommissionConstructionProject(projectSpec{type: standUpgrade |
    seatMixConversion | moduleBuild | renovation | foundationRebuild, target,
    scope, urgencyFactor}, financingPlanRef?)`,
    `PauseConstructionProject`, `ResumeConstructionProject`,
    `CancelConstructionProject`. Progress is **not** a player command: the
    FSM advances on `SeasonAdvanced` / `EconomyWeekAdvanced` ticks with
    deterministic clocks (same rule as the facility-decay saga), avoiding an
    `AdvanceMatchdayTimeline`-style underspecified edge.
  - FSM: `Proposed → Committed → SitePrep → UnderConstruction(stage 1..n) →
    Commissioning → Completed`, with `Paused` and `Cancelled` exits; per-stage
    facts declare capacity restriction and matchday-cost deltas.
  - Events: `ConstructionProjectCommissioned`,
    `ConstructionProjectStageReached`,
    `ConstructionCapacityRestrictionChanged` (consumed by CommercialPortfolio
    ticketing + Audience & Atmosphere), `ConstructionProjectCompleted`,
    `ConstructionProjectCancelled`, `FacilityAssetCommissioned` (consumed by
    Club Management ledger via ACL, ADR-0050 pattern — the construction
    sibling of `StadiumCommercialSnapshotPublished`).
  - Read models: `ConstructionProjectBoard` (queue, stages, restrictions,
    payback projection); existing snapshots gain their already-promised
    "available capacity after construction" from real project state.
  - Consumed facts: `EffectiveRuleSet` (promotion/crash-build compliance,
    UEFA all-seater conversion), `EconomyWeekAdvanced`, plus a
    financing-approval fact from Club Management (a commission with
    `financingPlanRef` only enters `Committed` once Club Management confirms
    the facility drawdown — Customer-Supplier, ACL both ways).
- **Ledger flow:** stage payments as scheduled obligations per stage
  (double-entry: cash/payables ↔ CIP asset); completion capitalises to
  facility asset and re-bases maintenance + ageing decay; cancellation
  writes off CIP (sunk-cost posting); crash-build (`urgencyFactor`) posts the
  premium cost drafted in GD stadium formulas. Financing via FMX-49
  facilities; naming-rights/seat-licence cash arrives as CommercialPortfolio
  contract events, never as Stadium postings.
- **Easy/pro split (the load-bearing part):** identical to the ratified easy
  *tactic* pattern — the Quick "build wizard" and Standard tile-map both
  **compile deterministically into the same `CommissionConstructionProject`
  command** Pro writes. Quick offers 1–3 recommended projects with one
  pre-selected financing plan (accept/decline/defer); Standard exposes
  project templates, seat-mix presets and 2–3 financing presets; Expert
  composes phased multi-stand programmes, seat-mix ratios inside the
  compliance envelope, financing mixes and cancellation/pause calls. One
  contract, three disclosure depths — no second simulation path to balance.
- **Calibration anchors (Finding 6/7):** minor project +1–3k seats ≈ 0.5–1
  season; stand project +3–7k ≈ 1.5–2 seasons; major stand +6–10k ≈ 2–3
  seasons; foundation rebuild ≈ 3–5 seasons. €2–10k per added seat by
  hospitality share; premium 5–15% of capacity carrying 40–60% of matchday
  revenue; standing↔seating density factor ≈1.6 with league/UEFA conversion
  rules via `EffectiveRuleSet`.
- **Pros:** delivers the three Anstoss fun-carriers (visible growth, legible
  economics, per-stand identity) with tycoon-lesson safeguards (few, chunky,
  interacting decisions — no toilet counts); construction pain satisfies the
  genre expectation WAF missed (Finding 3); creates exactly the bounded
  adaptation-class decisions D3 wants for the pro edge. **Cons:** largest
  MVP contract delta of the two near-term options; needs the FSM,
  restriction facts and financing handshake specified before code.

#### Option C — Plot-based Expert builder (post-MVP layer)

The "SimCity grid, plot pricing, blueprint optimisation" Expert surface from
progressive-disclosure-ui §3 / stadium-and-campus §9.

- **Contract impact if layered correctly: near zero.** The builder becomes a
  *planning/presentation* layer whose blueprints compile into Option-B
  `CommissionConstructionProject` payloads (a `projectSpec` gains an optional
  `plotAllocation` block; one additional command pair
  `ReserveGroundsPlot`/`ReleaseGroundsPlot` if plot scarcity is modelled).
  The optional 2.5D/3D viewer stays read-model-only per ADR-0041.
- **Pros:** preserves the long-term Anstoss/WAF club-architect fantasy as an
  Expert-world reward without forking the simulation; slot/curated fields
  remain the mobile+determinism-friendly default. **Cons:** free placement
  risks exactly the busywork/balance traps in Finding 5 and the vault already
  cautions against it; zero MVP value.
- **D3 guard:** plot layout must be *expressive*, not *stronger* — blueprint
  compilation must not reach effect ranges unreachable from Standard
  templates, or Easy becomes dominated in 20-season saves.

#### Recommendation (recommendation, not a decision)

Ratify **Option B's contract surface now** as the single construction
contract; ship the **Option A experience as B's Quick compile-down** (wizard
issuing real `CommissionConstructionProject` commands against 3–5 curated
templates), and defer **Option C as a compile-to-B planning layer** gated on
the first stadium prototype proving the added depth is fun (same gate
stadium-and-campus §11 already applies to manual venue booking). This closes
the contract gap once, avoids an A→B breaking change, matches the ratified
easy-tactic compile pattern, and keeps every tier on one simulation truth.

### Open fork: delegation model shape (stadium evidence only)

Stadium is a non-tactic area, so the ratified line "delegation reserved for
non-tactic areas" applies here. Genre evidence (Finding 9): FIFA Manager's
per-aspect responsibility toggles and WAF's staff-proposal loop both worked as
**proposal-based delegation** — staff/board propose concrete projects the
player accepts/declines — and FM shows that *silent* full delegation (board
decides everything) reads as absence of a feature, not as convenience.
**Input:** whatever delegation shape is chosen, stadium delegation should be
"delegate proposes `CommissionConstructionProject`, player confirms" at Quick
tier (consistent with the Auto-Coach proposes-never-overwrites guarantee),
with an optional full-auto toggle only inside an explicit budget envelope set
by the player. Recommendation, not a decision.

### D3 stress evidence (bounded pro edge — do not re-open, calibrate)

Stadium decisions are slow-cadence and compound over seasons, so unbounded
expert advantage here would silently break the floor-normalized 0.85–0.95
parity envelope in long saves even if per-season deltas look small. Evidence-
shaped guidance: (a) the Quick wizard's recommended projects must be
near-frontier (within the envelope) — the wizard is the parity floor for this
area, measurable with the harness in
[[tier-parity-measurement-calibration-2026-07-01]]; (b) the pro edge should
live in **adaptation decision classes** — timing against promotion-compliance
windows, pausing/re-phasing under cash stress, financing-mix reaction to rate
or covenant events — not in Expert-exclusive buildings or strictly-better
seat-mix reachability; (c) hospitality's outsized revenue share (40–60% from
5–15% of seats, Finding 7) is the single most dominance-prone lever and its
Expert-only granularity should be capped or mirrored by a wizard preset.

### NEW-construction-financing (newly discovered sub-fork)

How does construction financing surface? Options: **(a)** reuse the FMX-49
`FinancingFacility` core unchanged (bank loan / board support / restructuring
fund construction like anything else); **(b)** add stadium-flavoured
instruments — Fananleihe fan bond (strong German-identity fit, real €5–25m
scale, doubles as a fan-mood lever for Audience & Atmosphere), naming-rights
advance (CommercialPortfolio contract fact + Club Management liquidity action,
exactly the FMX-49 sponsor-advance hybrid pattern), premium-seat
licences/debentures; **(c)** dedicated project-finance vehicle with covenant
semantics. **Recommendation (not a decision):** (a) for the first playable,
(b) as the first post-MVP financing expansion — Fananleihe and naming-rights
advance reuse existing contracts and add distinctive flavour; defer (c) as
IFRS-lite-incompatible complexity per GD-0008's "playable IFRS-lite" posture.

### NEW-construction-disruption (newly discovered sub-fork)

Do projects impose temporary capacity/revenue pain? Options: **(a)** none
(WAF's instant builds — documented as a criticised genre-standard miss);
**(b)** deterministic per-stage capacity restriction published as
`ConstructionCapacityRestrictionChanged` (Anstoss + real-world pattern:
Liverpool and Real Madrid both played through works at reduced/altered
capacity); **(c)** restriction plus seeded-variance delay/incident events.
**Recommendation (not a decision):** (b) for MVP — the restriction fact is
what makes construction a *decision* rather than a purchase, and Quick tier
must preview it in the wizard card ("Kessel-Nordkurve rebuild: −4,000 seats
for 30 weeks") so Easy players are never surprised; (c) fits Nico's
established seeded-variance preference and can arrive later through the
existing `StadiumRng` sub-label without contract changes.

## Future-scope notes (classified future-scope)

- Option C plot builder + blueprint optimisation: post-MVP, gated on the
  first stadium prototype proving depth is fun (aligns with
  stadium-and-campus §11's venue-booking gate); compiles to Option-B commands.
- Fananleihe fan bond + seat licences/debentures as post-MVP financing
  instruments (NEW-construction-financing option b); potential Audience &
  Atmosphere mood coupling for fan-funded stands.
- Seeded construction delay/incident events via `StadiumRng`
  (NEW-construction-disruption option c).
- Ground-share / temporary-home during foundation rebuilds (real-world
  precedent: clubs decant during full rebuilds) — touches League Orchestration
  fixture allocation; out of first-playable scope like multi-stadium
  ownership.
- 2.5D/3D construction visualisation stays a read-model consumer per
  ADR-0029/ADR-0041; construction FSM state is presentation-agnostic.
- Non-matchday revenue interaction: hospitality "super stands" also raise
  venue-event eligibility (concert/conference facts in
  `StadiumCommercialSnapshot`) — worth a calibration pass once venue-event
  economics are numbered.
- All in-game examples must stay IP-clean per GD-0015 (fictional pattern:
  "SV Blaukessel" expanding its "Nordkurve" with a "Kesselwurst-Stand" —
  evocative, clearly not real).
