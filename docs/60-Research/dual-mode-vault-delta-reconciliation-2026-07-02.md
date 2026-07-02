---
title: Dual-Mode Vault Delta - Two-Worlds Decision vs the Drafted Three-Tier Model
status: draft
tags: [research, dual-mode]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-212
sourceType: internal
context: [tactics, match]
related:
  - [[../50-Game-Design/progressive-disclosure-ui]]
  - [[../50-Game-Design/tactics-system]]
  - [[../50-Game-Design/GD-0004-tactics]]
  - [[../50-Game-Design/GD-0025-in-match-controls]]
  - [[../50-Game-Design/GD-0016-mobile-ux-loop]]
  - [[../50-Game-Design/GD-0031-analytics-hub-and-statistics]]
  - [[../50-Game-Design/onboarding-and-tutorial]]
  - [[../20-Features/feature-tactics-progressive-disclosure]]
  - [[../20-Features/feature-fan-ecology-ui]]
  - [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
  - [[../40-Execution/ratification-status-inventory-2026-06-11]]
  - [[dual-mode-precedents-sports-management-2026-07-01]]
  - [[assisted-play-parity-auto-coach-2026-07-01]]
  - [[tier-parity-measurement-calibration-2026-07-01]]
  - [[tactic-preset-coverage-and-counters-2026-07-01]]
  - [[in-match-controls-tier-gating-2026-07-01]]
---

# Dual-Mode Vault Delta - Two-Worlds Decision vs the Drafted Three-Tier Model

> **Decision status this note is grounded in (ratified by Nico, not re-opened
> here):** D1 (2026-07-01) keep 3 tiers internally, branded/marketed as **2
> worlds** (Easy world = Quick+Standard, Pro world = Expert). D2 (2026-07-01)
> mode/tier switchable anytime, everywhere. D3 (2026-07-02, revised) bounded
> pro edge via floor+cap envelope (floor-normalised parity ratio ~0.85-0.95,
> head-to-head 52-57 % as evidence-shaped placeholders; exact numbers open),
> pro edge confined to adaptation decision classes, Easy never a dominated
> strategy. D4 (2026-07-01) full sweep across every decision-bearing
> management area. Easy tactic surface (2026-07-02): native coarse
> dials/presets compiling deterministically into the SAME tactic contract Pro
> writes; delegation reserved for non-tactic areas. This note is the
> note-by-note delta analysis **for that decided path**; open forks
> (delegation model shape, stadium expansion model, competitive labeling, MP
> treatment) receive inputs only.

## Question

Given D1 (three internal tiers, two branded worlds), which vault notes encode
the Quick/Standard/Expert three-tier model, what exactly changes in each note
under the decided path, where does the two-worlds branding create a real
semantic conflict rather than a wording delta, and in what order should
Stage-2 documentation apply the deltas?

## Summary

A vault-wide sweep found roughly 60 notes referencing the
Quick/Standard/Expert trio, but the decided D1 shape ("keep 3 tiers
internally") makes most of them **no-change or one-line wording deltas**: the
internal tier vocabulary stays canonical, so architecture-layer artifacts
(ADR-0055's `TacticTier` slot sizing 2/3/3 and presets 0/10/50, ADR-0082's
Quick/Standard 3-band vs Expert numeric disclosure, read models, quality
budgets) need **zero renames**. The genuinely structural work concentrates in
one note — [[../50-Game-Design/progressive-disclosure-ui]], the model SSOT,
which must gain the world layer, the D3 parity envelope and D2 switching
guarantees — plus the tactics pair
([[../50-Game-Design/tactics-system]] §4/§13 and
[[../20-Features/feature-tactics-progressive-disclosure]]) that must encode the
2026-07-02 Easy coarse-dial-to-tactic-contract compiler, and the onboarding
silent-mapping table, which absorbs two worlds with one added column. Three
real semantic conflicts exist: (1) "Easy world" collides with the existing
"Easy **difficulty**" axis in [[../50-Game-Design/onboarding-and-tutorial]]
(feeds the open competitive-labeling fork); (2) the three-tier note models the
tier as a flat three-way user setting, leaving the Quick-vs-Standard surface
*inside* the Easy world undefined (new fork); (3) the future-scope per-area
tier override crosses the world boundary (interacts with the open MP fork).
Almost all heavy-edit notes are `draft` and already sit in the FMX-143
re-approval queue, so the two-worlds revision can be absorbed into their
pending re-approval pass at near-zero extra process cost. The cheapest
correct mechanism is one new binding branding/mapping cover note plus targeted
edits, not a vault-wide rename.

## Method (internal audit)

Grep sweep for `Quick`, `Standard`, `Expert`, `tier`/`Tier` under `docs/`,
then classification of every hit into: (a) UI-tier semantics vs unrelated
"tier" (stadium tiers, league tiers, device tiers, continental-cup tiers —
excluded); (b) decision-bearing notes vs immutable history (60-Research
research records, 95-Archive, 40-Execution handoffs/queues, raw captures —
excluded from the delta by governance: research notes are dated evidence, not
current-truth carriers); (c) player-facing vs internal-vocabulary usage.
No external research (sourceType: internal); no raw capture written.

## Findings

1. **Finding:** The tier trio appears in ~60 notes, but only ~25 are
   decision-bearing current-truth notes; the rest are historical research,
   archives, session handoffs and raw captures that must not be edited.
   **Source:** vault grep sweep (docs/00-Index, 10-Architecture, 20-Features,
   30-Implementation, 50-Game-Design vs 60-Research/95-Archive/40-Execution
   hits). **Confidence:** high.

2. **Finding:** Because D1 keeps the three tiers internally, the
   architecture layer needs no renames: ADR-0055's `TacticTier` configuration
   (Quick/Standard/Expert slot sizing **2/3/3**, saved presets **0/10/50**),
   `ActiveTacticForSlot`, [[../10-Architecture/modules/tactics|modules/tactics]],
   ADR-0082 §3's tier-disclosure table (Quick/Standard = 3-band labels,
   Expert = numeric `value`/`confidence`) and 10-Quality's tactics-editor
   budget line all keep their vocabulary. The world is a *presentation/branding
   layer above* the tier enum, not a replacement.
   **Source:** [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
   (lines re `TacticTier`, slot sizing, presets);
   [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
   §3; [[../10-Architecture/modules/tactics]];
   docs/10-Architecture/10-Quality.md. **Confidence:** high.

3. **Finding:** [[../50-Game-Design/progressive-disclosure-ui]] is the model
   SSOT and the only note whose product rule (§1: "The game ships exactly
   three UI tiers … The tier is a user setting (default Standard); Quick and
   Expert are explicit opt-ins") is *contradicted in framing* by D1: the
   player-facing first-class choice becomes the world, with tier as internal
   depth. §2 (tier targets), §7 (tier switching — already compatible with D2),
   §8 (onboarding "three illustrated options") and §10 (per-area override)
   all need revision; a D3 parity-envelope section is missing entirely
   (the note's "only what is *surfaced* differs" is presentation parity, not
   the outcome-parity envelope D3 now mandates —
   [[tier-parity-measurement-calibration-2026-07-01]] carries the measurement
   model). **Source:** [[../50-Game-Design/progressive-disclosure-ui]] §1-§10.
   **Confidence:** high.

4. **Finding (semantic conflict 1 — naming collision):** "Easy world"
   collides with the existing **Easy difficulty** axis. Onboarding silently
   maps one experience question onto *both* a UI tier and a difficulty
   (Newbie → Quick + **Easy**; Bit → Standard + Normal; Veteran → Expert +
   Normal), and per-difficulty behaviour tables (assistant intensity,
   feed-card auto-complete) key off Easy/Normal/Hard/Sim. If the branded
   world is also literally called "Easy", the settings UI carries two distinct
   axes with the same name ("Easy world" ≠ "Easy difficulty"), in DE and EN.
   This is a real conflict, not wording; it feeds the open competitive-labeling
   fork. **Source:** [[../50-Game-Design/onboarding-and-tutorial]] §2 (silent
   mapping table), §4.3/§5.4 (per-difficulty tables);
   [[../50-Game-Design/progressive-disclosure-ui]] §1. **Confidence:** high.

5. **Finding (semantic conflict 2 — undefined Easy-world depth surface):**
   The drafted model exposes tier as a flat three-way setting. Under D1 the
   player picks a world; Quick vs Standard both live inside the Easy world,
   and no note defines how that internal depth boundary is surfaced (explicit
   sub-toggle? adaptive? hidden setting?). This is a new decision fork D1
   creates, not a wording delta. **Source:**
   [[../50-Game-Design/progressive-disclosure-ui]] §1/§7;
   [[../50-Game-Design/onboarding-and-tutorial]] §2. **Confidence:** high.

6. **Finding (semantic conflict 3 — per-area override crosses the world
   boundary):** The future-scope "per-area tier override (Quick everywhere
   except Expert tactics)" creates players who straddle both worlds. Under
   two-worlds branding the world label stops being a truthful description of
   the player's surface; this interacts with the open MP-treatment and
   competitive-labeling forks and should not ship before those close.
   **Source:** [[../50-Game-Design/progressive-disclosure-ui]] §10;
   [[../20-Features/feature-tactics-progressive-disclosure]] (out-of-scope
   list). **Confidence:** high.

7. **Finding:** The 2026-07-02 Easy-tactic-surface decision (native coarse
   dials/presets compiling deterministically into the same tactic contract) is
   a **structural** addition to the tactics notes: tactics-system §4 currently
   says Quick has "no role UI (locked preset templates)" and §13 gives Quick
   only "5 starter presets + Mentality 5-band + Recommended Counter"; a
   coarse-dial surface (e.g. "3 up front / 5 in defence" + aggressiveness) and
   its deterministic dial→`TacticSnapshot`-contract compiler are not yet
   described anywhere, and ADR-0055 has no compile seam for a
   `CoarseTacticInput`. Slot sizing and preset counts are otherwise untouched.
   Preset/counter coverage evidence is in
   [[tactic-preset-coverage-and-counters-2026-07-01]]; the proposes-only
   Auto-Coach boundary in [[assisted-play-parity-auto-coach-2026-07-01]].
   **Source:** [[../50-Game-Design/tactics-system]] §4, §10, §13;
   [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]].
   **Confidence:** high.

8. **Finding:** The 2026-07-01/02 dual-mode decisions (D1-D4, Easy tactic
   surface) are **not yet recorded** in the index SSOT: Decision-Log.md and
   Current-State.md contain no dual-mode/two-worlds entry (grep verified);
   Current-State still states "three explicit UI tiers … Default Standard"
   as the current product rule. Stage-2 must land the ledger entries first,
   or every downstream edit lacks its authority pointer.
   **Source:** docs/00-Index/Decision-Log.md, docs/00-Index/Current-State.md
   (grep for dual-mode/two-world/2026-07: no hits). **Confidence:** high.

9. **Finding:** All six heavy-edit system notes (progressive-disclosure-ui,
   tactics-system, onboarding-and-tutorial, core-loop, economy-system,
   transfer-market-and-contracts) are `draft`/`binding: false` class-D notes
   already awaiting individual re-approval in the FMX-143 queue (Nico
   2026-06-11: re-approval is a later HITL pass). The two-worlds revision can
   be folded into that pending pass — the vault expects these notes to change
   before re-ratification, so the branding delta is process-free there.
   Accepted GDDRs/ADRs (GD-0004, GD-0022, GD-0025, GD-0031, ADR-0055,
   ADR-0082) instead require additive annotations/pointers, never silent
   rewrites (ADR-0092). **Source:**
   [[../40-Execution/ratification-status-inventory-2026-06-11]] §1/H2/H4;
   frontmatter status check of the listed notes. **Confidence:** high.

10. **Finding:** The remaining tier tables map onto the world split cleanly
    with no semantic conflict — Quick+Standard rows become the Easy world's
    two depths, Expert rows the Pro world: GD-0031's analytics-depth table,
    ADR-0082's confidence disclosure, fan-ecology's mood-badge/bar-chart/grid
    tiers, GD-0022's finance surfaces, transfer/economy/stadium tier rows and
    GD-0025's reserved "per-UI-tier exposure" open item (which stays open;
    tier-gating evidence lives in
    [[in-match-controls-tier-gating-2026-07-01]]). The stadium row (wizard →
    tile map → SimCity grid) shows the widest Easy↔Pro surface gap in the
    vault and is the hardest place to honour D3's "Easy never dominated" —
    input for the open stadium-expansion fork. **Source:**
    [[../50-Game-Design/GD-0031-analytics-hub-and-statistics]] (Progressive
    disclosure table); [[../20-Features/feature-fan-ecology-ui]] (UI tiers);
    [[../50-Game-Design/GD-0025-in-match-controls]] (Open list);
    [[../50-Game-Design/progressive-disclosure-ui]] §3 stadium row.
    **Confidence:** high.

11. **Finding:** GD-0016's ratified loop ("same UI any session length",
    one-handed, hub + drill-down) and GD-0004's ratified goal ("tactical depth
    that is opt-in: three controls in two taps for casual play") are
    *reinforced*, not contradicted, by the two-worlds branding and the coarse
    dial decision — no edit beyond a Related pointer is needed in either.
    **Source:** [[../50-Game-Design/GD-0016-mobile-ux-loop]];
    [[../50-Game-Design/GD-0004-tactics]] (player-experience goal).
    **Confidence:** high.

12. **Finding:** MVP-Scope.md contains no tier references at all (grep
    verified) — no delta. Cross-genre precedent that a two-label front over
    more internal granularity is a known, workable pattern is in
    [[dual-mode-precedents-sports-management-2026-07-01]].
    **Source:** docs/00-Index/MVP-Scope.md (empty grep);
    [[dual-mode-precedents-sports-management-2026-07-01]].
    **Confidence:** high (MVP-Scope), medium (precedent generalisation).

## Note-by-note delta (decided path: D1 two worlds over three internal tiers)

Legend — **wording**: branding/framing/label additions, internal semantics
unchanged. **structural**: sections, tables, contracts or rules must change
shape. **none**: internal tier vocabulary persists by D1; no edit required.

### A. Player-facing system notes (draft, FMX-143 re-approval queue — absorb there)

| Note | Sections affected | Exact change under D1-path |
|---|---|---|
| [[../50-Game-Design/progressive-disclosure-ui]] | Title, §1, §2, §7, §8, §10; new §(parity) | **structural.** §1 product rule reframed: *three internal tiers, two player-facing worlds; world is the first-class user choice, tier the internal depth*. §2 gains a World column (Easy=Quick, Easy=Standard, Pro=Expert). §7 confirms D2 (switch anytime, everywhere — world and depth both) and keeps the Auto-Coach never-overwrite guarantee. §8 onboarding reworded (see conflict C3). New normative section for D3: floor+cap parity envelope (floor ~0.85-0.95, H2H 52-57 % placeholders), pro edge confined to adaptation decision classes, "Easy never dominated"; pointer to [[tier-parity-measurement-calibration-2026-07-01]]. §10 per-area override flagged as world-boundary-crossing (blocked on MP/labeling forks). |
| [[../50-Game-Design/tactics-system]] | §4 (per-tier exposure), §13 (UI tiers table), §10 (note only), new §(Easy dial surface) | **structural** (Quick row), wording elsewhere. Encode the 2026-07-02 decision: Quick/Easy surface = coarse dials ("N up front / N in defence" shape, aggressiveness, preset pick) **compiling deterministically into the same tactic contract** Pro writes; replace "no role UI (locked preset templates)" with dial+preset surface producing full Position/Role/Duty output; §13 Quick row extended accordingly. Slot sizing 2/3/3 + presets 0/10/50 unchanged (state explicitly). Counter/coverage grounding: [[tactic-preset-coverage-and-counters-2026-07-01]]. |
| [[../50-Game-Design/onboarding-and-tutorial]] | §1 rule 4, §2 silent-mapping table, §2 "Advanced setup" wizard copy | **structural** (mapping table) + conflict C1. Rule 4 becomes "2 worlds (3 internal tiers) and 4 difficulty modes are silently mapped". Mapping table gains a World column: Newbie → Easy world (Quick depth) + Easy difficulty; Bit → Easy world (Standard depth) + Normal; Veteran → Pro world (Expert) + Normal. World naming must not collide with difficulty "Easy" (open labeling fork). |
| [[../50-Game-Design/core-loop.md]] | Match-report tier mention, Quick-session open question | **wording** — annotate tier mentions with world mapping. |
| [[../50-Game-Design/economy-system.md]] | Tier-surface tables (runway/statements rows) | **wording** — world annotation on the Quick/Standard/Expert surface table. |
| [[../50-Game-Design/transfer-market-and-contracts.md]] | Surface table, Expert-clause-editor framing | **wording** — world annotation; full clause editor = Pro world flagship, presets = Easy. |

### B. Accepted GDDRs (additive annotation / Related pointer only — no silent rewrite, ADR-0092)

| Note | Sections affected | Exact change under D1-path |
|---|---|---|
| [[../50-Game-Design/GD-0004-tactics]] | Related | **wording (additive).** Pointer to the two-worlds cover + Easy-dial decision; goal text already anticipates it ("depth that is opt-in"). |
| [[../50-Game-Design/GD-0025-in-match-controls]] | "Open (Nico-gated)" per-UI-tier bullet | **wording (additive).** Rephrase the reserved tier-gating open item in world terms + link [[in-match-controls-tier-gating-2026-07-01]]; the "MVP ships one tier" stance now needs an explicit statement of which *world* the single MVP kit represents (recommend: it is the shared kit — both worlds see it; Pro extensions later). Open item stays open. |
| [[../50-Game-Design/GD-0031-analytics-hub-and-statistics]] | Progressive-disclosure table | **wording (additive).** Annotate: Quick+Standard rows = Easy world, Expert row = Pro world; no table change. |
| [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] | "Quick / Standard / Expert surfaces" table, Quick-wording rules | **wording (additive).** World annotation only. |
| [[../50-Game-Design/GD-0016-mobile-ux-loop]] | — | **none.** Loop is world-agnostic; reinforced by D1. Optional Related pointer. |
| GD-0019 / GD-0020 / GD-0024 | single tier-disclosure lines | **none.** Internal tier vocabulary persists (ADR-0082-style disclosure). |

### C. Features

| Note | Sections affected | Exact change under D1-path |
|---|---|---|
| [[../20-Features/feature-tactics-progressive-disclosure]] | Goal, MVP scope, Acceptance | **structural (light).** Goal reframed (2 worlds / 3 internal tiers); add acceptance criteria: dial surface compiles into the same tactic contract; deterministic compile; D3 envelope reference; per-area override stays out of first playable pending MP/labeling forks. |
| [[../20-Features/feature-fan-ecology-ui]] | "UI tiers" + MVP scope bullet | **wording.** World annotation (Quick+Standard = Easy). |
| [[../20-Features/feature-stadium-builder]] | Tier bullets (§ wizard/grid) | **wording** now; the *content* of the Easy stadium surface awaits the open stadium-expansion fork. |
| feature-venue-operations / feature-statistics-analytics-hub-mvp / feature-club-economy-mvp-pillar | single tier lines | **wording** (one line each). |
| docs/20-Features/README.md | tactics line | **wording** (one line). |

### D. Architecture

| Note | Sections affected | Exact change under D1-path |
|---|---|---|
| [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]] + [[../10-Architecture/modules/tactics]] | `TacticTier`, read models; **new** compile seam | **none for naming** (`TacticTier` Quick/Standard/Expert, slots 2/3/3, presets 0/10/50 stay). **structural addition via new/amending ADR**: `CoarseTacticInput` → tactic-contract deterministic compiler (2026-07-02 decision) + open question whether `world` becomes a persisted profile field beside tier. Never a rewrite of the accepted ADR. |
| [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]] | §3 disclosure table | **none.** Quick/Standard = 3 bands ≙ Easy world; Expert numerics ≙ Pro world — maps 1:1; mapping lives in the cover note. |
| docs/10-Architecture/10-Quality.md | tactics-editor budget line | **none** (internal naming). |

### E. Index / hubs (SSOT sweep)

| Note | Sections affected | Exact change under D1-path |
|---|---|---|
| docs/00-Index/Decision-Log.md | new entries | **structural (ledger).** Record D1-D4 (2026-07-01/02, incl. D3 revision) + Easy-tactic-surface decision, with open-fork list. **Must land first.** |
| docs/00-Index/Current-State.md | progressive-disclosure block (≈ line 2659) + banner | **wording.** Restate: 3 internal tiers, 2 branded worlds, D2 switching, D3 envelope; scattered per-domain "Quick-mode" mentions stay (internal vocabulary). |
| docs/00-Index/Documentation-V1.md | "three tiers" line | **wording** (one line). |
| docs/00-Index/Research-Map.md | tier summary bullets | **wording** — add Wave-1 dual-mode research entries; historical summaries stay. |
| docs/50-Game-Design/README.md | progressive-disclosure line | **wording** (one line). |
| docs/00-Index/MVP-Scope.md | — | **none** (no tier references; verified). |

### F. Explicitly no-edit (immutable history)

`docs/60-Research/*` (dated research records incl. onboarding-strategy,
mobile-route-map, tactics-and-formations — they ground past decisions),
`docs/95-Archive/*`, `docs/40-Execution/` handoffs/queues/inventories,
`docs/60-Research/raw-perplexity/*`. Their tier wording is evidence, not
current truth; the branding cover note supplies the mapping.

### Real semantic conflicts (vs wording deltas) — summary

- **C1 — "Easy world" vs "Easy difficulty"** ([[../50-Game-Design/onboarding-and-tutorial]] §2/§4.3/§5.4): two axes, one name; DE-primary UI doubles the exposure ("Einfach"). Feeds the open competitive-labeling fork.
- **C2 — Easy-world depth surface undefined** ([[../50-Game-Design/progressive-disclosure-ui]] §1/§7): flat 3-way tier setting must become world-first; how Quick vs Standard is exposed inside Easy world is a **new fork** (below).
- **C3 — Onboarding "three illustrated options"** ([[../50-Game-Design/progressive-disclosure-ui]] §8): 3-option depth question leaks the internal tier count against a 2-world brand; resolvable inside the C2 fork (experience question with silent mapping already avoids tier labels).
- **C4 — Per-area tier override crosses worlds** (§10 future-scope): keep future-scope, gate on MP-treatment + labeling forks.

## Ordered Stage-2 work-list

Order = apply sequence. Deliverables: **S2-A** decision ledger + two-worlds
branding/mapping cover (new GDDR, binding cover over progressive-disclosure);
**S2-B** progressive-disclosure-ui revision; **S2-C** tactics pack
(tactics-system + feature + GD-0004 pointer + ADR-0055 compile-seam input);
**S2-D** onboarding revision; **S2-E** index/hub sweep; **S2-F** per-area
annotation sweep (economy/transfer/fan/stadium/analytics/match).

| # | Note | Delta type | Effort | Stage-2 deliverable |
|---:|---|---|---|---|
| 1 | 00-Index/Decision-Log.md | structural (ledger entries) | S | S2-A |
| 2 | NEW: two-worlds branding & tier-mapping GDDR (cover) | new note (carries world names, mapping table, D3 envelope pointer) | M | S2-A |
| 3 | 50-Game-Design/progressive-disclosure-ui.md | structural | M | S2-B (folds into FMX-143 re-approval) |
| 4 | 50-Game-Design/tactics-system.md | structural (Quick/Easy dial surface) | M | S2-C (FMX-143 queue) |
| 5 | 20-Features/feature-tactics-progressive-disclosure.md | structural (light) | S | S2-C |
| 6 | ADR-0055 amendment / new ADR: coarse-dial→contract compile seam | structural (additive contract) | M | S2-C |
| 7 | 50-Game-Design/GD-0004-tactics.md | wording (additive pointer) | S | S2-C |
| 8 | 50-Game-Design/onboarding-and-tutorial.md | structural (mapping table) + C1 naming | M | S2-D (FMX-143 queue; world names from labeling fork) |
| 9 | 00-Index/Current-State.md | wording | M | S2-E |
| 10 | 00-Index/Documentation-V1.md · Research-Map.md · 50-GD/README.md · 20-Features/README.md | wording | S | S2-E |
| 11 | 50-Game-Design/GD-0025-in-match-controls.md | wording (additive; open item reworded) | S | S2-F |
| 12 | 50-Game-Design/GD-0031-analytics-hub-and-statistics.md | wording (additive) | S | S2-F |
| 13 | 50-Game-Design/GD-0022-economy… + economy-system.md + transfer-market-and-contracts.md + core-loop.md | wording | S | S2-F (FMX-143 queue for the drafts) |
| 14 | 20-Features/feature-fan-ecology-ui.md + feature-stadium-builder.md + feature-venue-operations.md + feature-statistics-analytics-hub-mvp.md + feature-club-economy-mvp-pillar.md | wording | S | S2-F (stadium content gated on stadium fork) |
| 15 | ADR-0082 · modules/tactics.md · 10-Quality.md · GD-0016 · GD-0019/0020/0024 · MVP-Scope.md | none (verify-only) | S | S2-E checklist row |

Total: 2 structural notes + 1 new cover + 1 additive ADR + ~6 M/S structural-light
edits + ~15 one-line wording touches + a verify-only list. No L-effort item.

## Inputs For Decisions

### OPEN fork: competitive labeling (world names)

- **Option A — literal "Easy / Pro" (Einfach / Profi).** Pros: instantly
  legible; matches Nico's framing. Cons: collides with the Easy **difficulty**
  axis (Finding 4) in settings, onboarding mapping and assistant-intensity
  copy; "Easy" carries a mild stigma that D3's "never dominated" guarantee is
  specifically designed to avoid.
- **Option B — distinct evocative brand names** (e.g. DE-primary
  "Trainerbank" vs "Taktikzentrale" — placeholder, IP-clean, decision is
  Nico's), with Easy/Pro kept as internal shorthand in the vault. Pros: kills
  the C1 collision; brandable; avoids stigma. Cons: needs explanation once;
  localisation care.
- **Option C — neutral depth labels** ("Kompakt / Komplett"). Pros: no
  collision, descriptive. Cons: weaker marketing identity than "two worlds".
- **Recommendation (recommendation, not a decision):** Option B — distinct
  non-difficulty brand names; never reuse "Easy/Einfach" for both axes; keep
  Quick/Standard/Expert as the internal enum everywhere (per D1).

### OPEN fork: MP treatment

- Input from this delta: D2 (switch anytime) + the future-scope per-area
  override (C4) make the world label a *branding* attribute, not a truthful
  capability descriptor. Any MP labeling/matchmaking keyed on "world" will
  misclassify mixed-surface players. Evidence-based input: key MP rules to
  the actual surfaces used (or to nothing at all, per D3's envelope which is
  designed to make the distinction competitively minor —
  [[tier-parity-measurement-calibration-2026-07-01]]), and gate the per-area
  override on this fork. **Recommendation (not a decision):** do not encode
  world into MP contracts in Stage-2; leave a reserved field.

### OPEN fork: stadium expansion model

- Input from this delta: the stadium row is the widest Easy↔Pro surface gap
  in the vault (1-3-upgrade wizard vs SimCity grid, Expert grid Phase 2).
  Whichever expansion model is chosen, the Easy world needs the wizard row to
  remain decision-complete (every economically material stadium decision must
  be reachable from the wizard) or D3's "Easy never dominated" fails in the
  finance loop, not the match loop. **Recommendation (not a decision):**
  evaluate stadium-model options against the D3 envelope explicitly; treat
  the wizard as the compiling "coarse dial" of the stadium area (same pattern
  as the tactic dials).

### OPEN fork: delegation model shape (non-tactic areas)

- Input from this delta: the vault already contains a working delegation seam
  — onboarding's assistant auto-handling ("may prepare local drafts or
  prefill low-impact actions on Easy/Normal; authoritative mutations still
  require explicit user confirmation") plus the proposes-only Auto-Coach
  guarantee ([[assisted-play-parity-auto-coach-2026-07-01]]). Reusing this
  confirm-gated assistant machinery for Easy-world non-tactic areas avoids a
  second delegation concept. **Recommendation (not a decision):** shape
  delegation as "assistant prepares, player confirms" per area, consistent
  with the never-overwrite invariant; do not introduce silent full-auto
  delegation in the Easy world.

### NEW fork: NEW-easy-world-depth-surface (created by D1)

How is the Quick-vs-Standard boundary exposed *inside* the Easy world?

- **Option A — explicit depth toggle inside Easy world** ("Mehr Details"
  comfort switch, silently mapped at onboarding). Pros: honest, reversible,
  fits D2. Cons: one more setting.
- **Option B — adaptive/auto depth** (UI promotes Standard elements on
  engagement signals). Pros: zero settings. Cons: unpredictable UI violates
  the mobile one-primary-action ethos; hard to test; silent changes conflict
  with the never-overwrite spirit.
- **Option C — keep the flat 3-way tier setting in Settings; worlds exist
  only in marketing/onboarding copy.** Pros: smallest delta. Cons: settings
  UI contradicts the brand (user sees 3 options after being sold 2 worlds).
- **Recommendation (recommendation, not a decision):** Option A; Option C is
  acceptable as a transitional Stage-2 default since it changes no contracts.

### NEW fork: NEW-branding-encoding-mechanism (Stage-2 method)

- **Option A — one new binding branding/mapping GDDR cover** + targeted edits
  (per the work-list); accepted notes get additive pointers only. Pros:
  single source for world semantics; respects ADR-0092 no-silent-rewrite;
  ~20 files touched instead of ~60. Cons: readers must follow one hop.
- **Option B — vault-wide rename of tier vocabulary to world vocabulary.**
  Pros: no hop. Cons: contradicts D1 (tiers persist internally), rewrites
  accepted ADRs/GDDRs, touches immutable research, breaks `TacticTier`
  contract naming. **Recommendation (recommendation, not a decision):**
  Option A — this is the assumption the work-list above is built on.

## Future-scope notes (classified future-scope)

- Per-area tier override (progressive-disclosure §10) stays future-scope and
  is now additionally gated on the MP-treatment + labeling forks (C4).
- Community tactic-preset import (Expert/Pro) may later need world-aware
  labeling if presets encode dial-compiled vs hand-authored provenance.
- If a fourth internal depth ever appears (e.g. a "Broadcast/спectator" view),
  the world mapping table in the S2-A cover is the single place to extend —
  keep it table-driven.
- DE/EN world-name localisation and the marketing copy for "two worlds" are
  content work (i18n R2-10), not vault-structure work.
