---
title: FMX-143 re-approval packet — two-worlds revision (FMX-212 Stage-2)
status: draft
tags: [execution, decision-queue, re-approval, dual-mode, two-worlds, fmx-212, fmx-143]
created: 2026-07-02
updated: 2026-07-02
type: execution
binding: false
linear: FMX-212
context: [tactics, match]
related:
  - [[ratification-status-inventory-2026-06-11]]
  - [[../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02]]
  - [[../50-Game-Design/GD-0046-two-worlds-mode-model]]
  - [[../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0136-delegation-to-staff-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0137-stadium-construction-and-expansion-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0138-mode-state-placement-and-integrity]]
  - [[../60-Research/tier-parity-measurement-calibration-2026-07-01]]
  - [[../60-Research/management-delegation-and-easy-mode-surfaces-2026-07-02]]
  - [[../60-Research/asymmetric-interface-fairness-multiplayer-2026-07-02]]
  - [[../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]]
  - [[../00-Index/Decision-Log]]
---

# FMX-143 re-approval packet — two-worlds revision (FMX-212 Stage-2)

> **What this is.** The FMX-143 sweep (H2, Nico 2026-06-11) left 27
> non-numbered system/mode notes in `docs/50-Game-Design/` at
> `draft`/`binding: false`, awaiting an individual re-approval pass — the
> queue is recorded in [[ratification-status-inventory-2026-06-11]] §2/§6.
> The 2026-07-01/02 dual-mode ratifications (D1 two worlds over three
> internal tiers; D2 switch anytime; D3 bounded pro-edge envelope; D4 full
> sweep; Easy coarse-dial tactic surface) change what several queued notes
> must say before re-approval makes sense. This packet updates the queue to
> the two-worlds framing: per note — delta type, exact change, covering
> decision note, effort, and a proposed re-approval order.
>
> **This is a plan for Nico to ratify, not an applied change.** No queued
> note has been edited; ratified directions are encoded as given and open
> forks are carried with the research's ★ marks (**recommendations, not
> decisions**). Delta analysis is grounded in
> [[../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02]].

## 1. Scope and method

- **In scope:** all 27 FMX-143 class-D queue notes (H2 list; `fan-ecology.md`
  stays `superseded` and outside the queue) **plus** every row of the ordered
  Stage-2 work-list in
  [[../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02]]
  (accepted GDDRs, features, ADR seam, index/hubs — listed in §5 as the
  companion work-list, since those are not FMX-143 re-approval items).
- **Delta legend:** **structural** = sections/tables/rules must change shape;
  **wording** = branding/annotation only, internal semantics unchanged;
  **nil** = the note already reads correctly through GD-0046's normative
  world mapping and can be re-approved unchanged.
- Per D1, `Quick`/`Standard`/`Expert` remain the internal canon — **no
  vault-wide rename** (vault-delta Finding 2 and the NEW-branding-encoding
  fork's ★ Option A, which this packet assumes). Per-note UI-tier tables map
  through [[../50-Game-Design/GD-0046-two-worlds-mode-model]] "World mapping
  (normative)": Quick+Standard rows = Easy world, Expert rows = Pro world
  (vault-delta Finding 10).

## 2. Covering decision set (authority for every delta)

Each queued change is authorized by exactly one Stage-2 decision note; a
queued note is not re-approved before its covering note is ratified.

| Cover | Carries | Status on this branch |
|---|---|---|
| [[../50-Game-Design/GD-0046-two-worlds-mode-model]] | D1 world mapping (normative table), D2 switch-anytime UX, player promise, world-naming + labeling + depth-surface forks | draft (written) |
| [[../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract]] | D3 floor+cap parity envelope (placeholder bands R ~0.85–0.95, H2H 52–57 % — exact numbers explicitly open), pro edge confined to adaptation decision classes, "Easy never dominated" | draft (written) |
| [[../10-Architecture/09-Decisions/ADR-0136-delegation-to-staff-contract]] | Delegation for non-tactic areas; consent-ladder fork carried (★ `manual`/`propose`/`delegate`) | draft (written) |
| [[../10-Architecture/09-Decisions/ADR-0137-stadium-construction-and-expansion-contract]] | Stadium construction/expansion contract; expansion-model fork carried (★ wizard as Quick compile-down) | draft (written) |
| [[../10-Architecture/09-Decisions/ADR-0138-mode-state-placement-and-integrity]] | Where world/tier state lives; per-run world snapshot vs profile preference; D2 switching integrity. Grounded in [[../60-Research/mode-state-contract-placement-and-integrity-2026-07-02]] | draft (written) |

## 3. Queue delta table (all 27 FMX-143 notes)

Order = proposed re-approval sequence (wave in §6). Effort is per-note edit
effort before its re-approval (S/M/L; nil-delta notes carry "—").

### Bucket A — structural deltas (edit before re-approval)

| Order | Note | Delta | Exact change under the ratified directions | Cover | Effort |
|---:|---|---|---|---|---|
| W2.1 | [[../50-Game-Design/progressive-disclosure-ui]] | structural | Model SSOT. §1 product rule reframed: three internal tiers, two player-facing worlds; world is the first-class choice, tier the internal depth. §2 gains a World column. §7 confirms D2 (world and depth switchable anytime, everywhere; Auto-Coach never-overwrite kept). §8 onboarding reworded per GD-0046's mode-choice packet (no 3-option tier leak). New normative D3 section referencing ADR-0135's envelope (numbers stay open until the harness). §10 per-area override flagged world-boundary-crossing, gated on MP + labeling forks. | GD-0046 + ADR-0135 | M |
| W2.2 | [[../50-Game-Design/tactics-system]] | structural | Encode the 2026-07-02 Easy tactic surface: §4 Quick row loses "no role UI (locked preset templates)" and gains native coarse dials (shape "N up front / N in defence", aggressiveness, preset pick) **compiling deterministically into the same tactic contract** Pro writes; §13 Quick row extended accordingly; slot sizing 2/3/3 + presets 0/10/50 explicitly unchanged. Preset count / aggressiveness-mapping forks land here when ruled (★ 6–8 presets over a soft-counter cycle; one macro dial → per-preset lookup — [[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]]). | GD-0046 (+ ADR-0055 compile-seam companion, §5) | M |
| W2.3 | [[../50-Game-Design/onboarding-and-tutorial]] | structural | §1 rule 4 becomes "2 worlds (3 internal tiers) + 4 difficulty modes silently mapped". §2 mapping table gains a World column (Newbie → Easy world/Quick + Easy difficulty; Bit → Easy world/Standard + Normal; Veteran → Pro world/Expert + Normal), answers reframed as purpose statements per GD-0046. Conflict C1: world names must not collide with the "Easy" difficulty axis — final copy gated on the world-naming fork; structure approvable with placeholders. Assistant-intensity tables get a pointer to ADR-0136's consent ladder. | GD-0046 (+ ADR-0136 pointer) | M |
| W5.1 | [[../50-Game-Design/stadium-and-campus]] | structural | Align to ADR-0137's construction/expansion contract: the Quick "build wizard" is restated as the coarse-dial compile-down of the same contract the Expert grid writes (decision-complete, or D3's "Easy never dominated" fails in the finance loop — vault-delta stadium-fork input); UI-tier table gets the world reading. Content of the Easy surface finalizes after the stadium-expansion fork is ruled. | ADR-0137 (+ ADR-0135 for the finance-loop parity claim) | M |
| W4.1 | [[../50-Game-Design/singleplayer-baseline]] | structural (light) | §4 assistant-automation table aligned to ADR-0136's delegation contract (per-area consent levels, deterministic execution, override guarantee restated in contract terms); §3 UI-tier section reads world-first via GD-0046. | ADR-0136 + GD-0046 | S |

### Bucket B — wording/branding deltas (targeted edit, then re-approve)

| Order | Note | Delta | Exact change | Cover | Effort |
|---:|---|---|---|---|---|
| W3.1 | [[../50-Game-Design/core-loop]] | wording | Annotate match-report tier mention + Quick-session open question with the world mapping. | GD-0046 | S |
| W3.2 | [[../50-Game-Design/economy-system]] | wording | World annotation on the Quick/Standard/Expert surface tables (runway/statements rows). | GD-0046 | S |
| W3.3 | [[../50-Game-Design/transfer-market-and-contracts]] | wording | World annotation on the surface table; full clause editor framed as Pro-world flagship, presets as Easy. | GD-0046 | S |
| W3.4 | [[../50-Game-Design/match-engine]] | wording | §7 presentation-tier table gets the world reading; one clarifying line that world ≠ device tier ≠ match-quality profile (three separate axes). | GD-0046 | S |
| W3.5 | [[../50-Game-Design/set-pieces]] | wording | Quick auto-assign/recommended-routines row = Easy world, full editor = Pro; note that auto-assign stays proposes-only per the Auto-Coach guarantee. | GD-0046 | S |
| W3.6 | [[../50-Game-Design/mode-create-a-club-roguelite]] | wording | World annotation on the UI-tier table; one disambiguation line: game *mode* (roguelite/career) ≠ *world* (Easy/Pro). Leaderboard treatment of runs waits on the competitive-labeling fork (★ per-run world badge — GD-0046 fork 3). | GD-0046 (+ ADR-0138 per-run snapshot) | S |
| W3.7 | [[../50-Game-Design/mode-manage-a-club-career]] | wording | Same world annotation + mode-vs-world disambiguation line. | GD-0046 | S |
| W4.2 | [[../50-Game-Design/training-load-and-medicine]] | wording | Quick row "Auto-coach toggle; one-tap optimise" restated in ADR-0136 consent-ladder vocabulary (training = delegable non-tactic area; one-tap optimise = accepted proposal, never silent execution); world annotation. | ADR-0136 + GD-0046 | S |
| W4.3 | [[../50-Game-Design/scouting-and-recruitment]] | wording | World annotation on opacity/surface tables ("Quick/Standard collapse layers" = Easy world); shortlist recommendations flagged as an ADR-0136 delegable area. | GD-0046 + ADR-0136 | S |
| W4.4 | [[../50-Game-Design/squad-and-club-structure]] | wording | World annotation; "Assistant-ranked best 11" flagged proposes-only per ADR-0136/Auto-Coach never-overwrite. | GD-0046 + ADR-0136 | S |
| W4.5 | [[../50-Game-Design/youth-academy-and-development]] | wording | World annotation on intake/development surfaces; intake handling flagged as an ADR-0136 delegable area. | GD-0046 + ADR-0136 | S |
| W6.1 | [[../50-Game-Design/transfer-negotiations-p2p]] | wording | World annotation on the offer surfaces (inbox card = Easy, clause editor = Pro). P2P is player-vs-player: any world labeling/matchmaking treatment is **gated on the MP fork** (★ visible badge + per-match mode log, no locks; reserved field, world not encoded into MP contracts in Stage-2). | GD-0046 (MP fork pending; ADR-0138 reserved field) | S |
| W6.2 | [[../50-Game-Design/async-multiplayer-private-group]] | wording | World annotation on §12 UI-tier surfaces; note that inactivity fallbacks (R5, assistant/last-tactic) are a distinct machinery from ADR-0136 delegation and stay as decided; group/competition labeling **gated on the MP fork** as above. | GD-0046 (MP fork pending; ADR-0138 reserved field) | S |

### Bucket C — ready to re-approve unchanged (nil delta)

Only tier exposure is the standard per-area disclosure table (or single tier
lines) that reads correctly through GD-0046's normative mapping (rule: the
mapping supplies the world reading; the note is not rewritten — vault-delta
Finding 10). Re-approvable as a bulk wave immediately after GD-0046 is
ratified; zero edits.

| Order | Note | Nil-delta rationale | Cover |
|---:|---|---|---|
| W1 (bulk) | [[../50-Game-Design/matchday-event-engine]] | Disclosure table maps cleanly (Quick cards = Easy, full rule view = Pro). | GD-0046 |
| W1 (bulk) | [[../50-Game-Design/regulations-and-compliance]] | Both Quick/Expert disclosure tables (loan badge, promotion-readiness) map cleanly; "tier" hits are league tiers (out of scope). | GD-0046 |
| W1 (bulk) | [[../50-Game-Design/rivalry-system]] | Derby-badge vs rivalry-graph rows map cleanly. | GD-0046 |
| W1 (bulk) | [[../50-Game-Design/sponsorship-portfolio]] | Income-card vs asset-inventory rows map cleanly. | GD-0046 |
| W1 (bulk) | [[../50-Game-Design/audience-and-atmosphere]] | Fan-mood badge/grid rows map cleanly (matches the fan-ecology-UI mapping, vault-delta Finding 10); stadium hits are the physical venue. | GD-0046 |
| W1 (bulk) | [[../50-Game-Design/community-editor-and-datasets]] | One-toggle vs full-editor rows map cleanly. | GD-0046 |
| W1 (bulk) | [[../50-Game-Design/system-interplay]] | Single line ("club health" diagram Expert-only = Pro world) reads through the mapping. | GD-0046 |
| W1 (bulk) | [[../50-Game-Design/club-dna-and-governance]] | Single line ("expert tier shows numbers") reads through the mapping. | GD-0046 |
| W1 (bulk) | [[../50-Game-Design/watch-party-and-conference]] | Viewer-surface tiers map cleanly; watch-party is spectation, so the MP-labeling fork does not alter these surfaces. | GD-0046 |

## 4. Count check

27 queue notes = 5 (A) + 13 (B) + 9 (C). Matches the H2 class-D set of
[[ratification-status-inventory-2026-06-11]] §6 (27 notes; `fan-ecology.md`
superseded, untouched, outside the queue).

## 5. Companion work-list (vault-delta rows outside the FMX-143 queue)

Not re-approval items — accepted records get **additive** annotations only
(ADR-0092 no-silent-rewrite), index/hub edits happen in the later index
stage. Listed here so the packet covers the full vault-delta work-list and
the sequencing interlocks are visible.

| Work-list row | Note(s) | Delta | Cover | Effort |
|---|---|---|---|---|
| 1 (S2-A) | [[../00-Index/Decision-Log]] (+ [[../00-Index/Current-State]] banner) | structural (ledger): record D1–D4 (incl. the 2026-07-02 D3 revision) + Easy-tactic-surface decision with the open-fork list. **Must land before any downstream edit cites its authority** (vault-delta Finding 8). | GD-0046 + ADR-0135–0138 as the recorded decisions | S |
| 2 (S2-A) | [[../50-Game-Design/GD-0046-two-worlds-mode-model]] | the branding/mapping cover itself — ratification target, not an edit target | — | — |
| 5 (S2-C) | [[../20-Features/feature-tactics-progressive-disclosure]] | structural (light): goal reframed 2 worlds / 3 internal tiers; acceptance criteria for the deterministic dial→contract compile + D3 envelope reference; per-area override stays out of first playable | GD-0046 + ADR-0135 | S |
| 6 (S2-C) | ADR-0055 amendment / new ADR: `CoarseTacticInput` → tactic-contract deterministic compile seam | structural (additive contract; never a rewrite of accepted [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]) | GD-0046 "Feeds ADRs" | M |
| 7 (S2-C) | [[../50-Game-Design/GD-0004-tactics]] | wording: additive Related pointer (goal text already anticipates the split) | GD-0046 | S |
| 9–10 (S2-E) | [[../00-Index/Current-State]], Documentation-V1, Research-Map, 50-GD README, 20-Features README | wording (index sweep, later stage) | GD-0046 | M+S |
| 11 (S2-F) | [[../50-Game-Design/GD-0025-in-match-controls]] | wording (additive): per-UI-tier open item reworded in world terms + link [[../60-Research/in-match-controls-tier-gating-2026-07-01]]; state which world the single MVP kit represents (vault-delta ★: the shared kit — both worlds see it); item stays open | GD-0046 | S |
| 12 (S2-F) | [[../50-Game-Design/GD-0031-analytics-hub-and-statistics]] | wording (additive): world annotation on the disclosure table | GD-0046 | S |
| 13 (S2-F) | [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] | wording (additive): world annotation only | GD-0046 | S |
| 14 (S2-F) | [[../20-Features/feature-fan-ecology-ui]], [[../20-Features/feature-stadium-builder]], [[../20-Features/feature-venue-operations]], [[../20-Features/feature-statistics-analytics-hub-mvp]], [[../20-Features/feature-club-economy-mvp-pillar]] | wording (one line each; stadium-builder content gated on the stadium fork / ADR-0137) | GD-0046 (+ ADR-0137) | S |
| 15 | [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]], [[../10-Architecture/modules/tactics]], 10-Quality, [[../50-Game-Design/GD-0016-mobile-ux-loop]], GD-0019/0020/0024, MVP-Scope | **none** — verify-only checklist (internal tier vocabulary persists per D1; GD-0016 reinforced, no edit) | GD-0046 mapping | S (verify) |

## 6. Proposed re-approval order

| Wave | Content | Gate |
|---|---|---|
| **W0** | Ratify the covering set: GD-0046, ADR-0135, ADR-0136, ADR-0137, ADR-0138; land Decision-Log entries (companion row 1) | Nico HITL (this packet + the five notes) |
| **W1** | Bulk re-approval of Bucket C (9 notes, unchanged) | GD-0046 ratified |
| **W2** | Structural core, in order: progressive-disclosure-ui → tactics-system (with companion rows 5–7) → onboarding-and-tutorial | GD-0046 + ADR-0135; onboarding final copy additionally on the world-naming fork (structure approvable with placeholders) |
| **W3** | Wording sweep, 7 notes: core-loop, economy-system, transfer-market-and-contracts, match-engine, set-pieces, mode-create-a-club-roguelite, mode-manage-a-club-career | GD-0046 |
| **W4** | Delegation-touching set, 5 notes: singleplayer-baseline, training-load-and-medicine, scouting-and-recruitment, squad-and-club-structure, youth-academy-and-development | ADR-0136 ratified incl. consent-ladder fork |
| **W5** | stadium-and-campus | ADR-0137 ratified incl. stadium-expansion fork |
| **W6** | MP-gated pair: transfer-negotiations-p2p, async-multiplayer-private-group | MP-treatment + competitive-labeling forks; ADR-0138 for the reserved world field |

Effort totals: 4 M + 1 S structural (Bucket A), 13 S wording (Bucket B),
9 zero-edit (Bucket C); companion list 2 M + ~10 S. No L item — consistent
with the vault-delta estimate.

## 7. Open forks this packet depends on (★ = recommendation, not a decision)

Owned by the covering notes; listed here only with what they block in the
queue. Nico rules each; nothing below is decided by this packet.

1. **World naming (player-facing pair, DE-first)** — GD-0046 fork 1.
   ★ distinct purpose-/identity-framed pair, never reusing "Easy/Einfach"
   for both axes (conflict C1). Blocks final copy of W2.3 onboarding (and
   settings copy in W2.1).
2. **Parity band numbers (D3 constants)** — ADR-0135 / GD-0046 fork 2.
   ★ keep the evidence-shaped placeholders (R ~0.85–0.95, H2H 52–57 %) and
   fix the numbers only from the calibration harness. Blocks nothing in the
   queue (the envelope section in W2.1 cites the open constants).
3. **Competitive labeling** — GD-0046 fork 3. ★ prestige-neutral world badge
   on one main board + opt-in Pro-pure boards. Blocks leaderboard framing in
   W3.6 and the W6 pair.
4. **MP treatment** — sibling packet
   ([[../60-Research/asymmetric-interface-fairness-multiplayer-2026-07-02]]).
   ★ mode-blind unified competition + full transparency; do not encode world
   into MP contracts in Stage-2 (reserved field). Blocks W6.
5. **Delegation model shape + consent ladder** — ADR-0136. ★ throttled
   per-area delegation with a `manual`/`propose`/`delegate` ladder,
   deterministic execution, never-overwrite pins. Blocks W4.
6. **Stadium expansion model** — ADR-0137. ★ one construction contract with
   the wizard as its Quick compile-down (tactic-dial pattern). Blocks W5.
7. **Preset count / aggressiveness mapping** — ★ 6–8 presets spanning a
   soft-counter cycle; one macro dial → per-preset (mentality, pressing)
   lookup ([[../60-Research/tactic-preset-coverage-and-counters-2026-07-01]]).
   Lands inside W2.2.
8. **Per-area override** — GD-0046 fork 4. ★ stays future-scope, gated on
   forks 3–4. Blocks nothing now (flagged in W2.1 §10 only).
9. **Easy-world depth surface (Quick vs Standard inside the Easy world)** —
   GD-0046 / vault-delta NEW fork. ★ explicit depth toggle ("Mehr Details");
   flat 3-way Settings acceptable as transitional default. Shapes W2.1 §7
   and W2.3 wizard copy.

## 8. What Nico is asked to do with this packet

1. Ratify (or amend) the bucket assignment and wave order above.
2. Approve W1 as a bulk re-approval ("unchanged" bucket) once GD-0046 is
   ratified.
3. Rule the forks in §7 as they come up per wave — each unblocks its wave;
   none blocks W0–W1.
