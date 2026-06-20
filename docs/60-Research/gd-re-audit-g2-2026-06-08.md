---
title: GD re-audit — Cluster G2 (Match / Tactics / Set-piece / In-match / Live-control)
status: draft
tags: [research, audit, gddr, game-design, match-engine, tactics, set-pieces, in-match-controls, live-coaching, determinism, cluster-g2, ratification-sweep]
context: [match, tactics]
created: 2026-06-08
updated: 2026-06-08
type: research
binding: false
related:
  - "[[../50-Game-Design/GD-0002-match-engine]]"
  - "[[../50-Game-Design/GD-0004-tactics]]"
  - "[[../50-Game-Design/GD-0025-in-match-controls]]"
  - "[[../50-Game-Design/GD-0026-set-piece-coach-readiness]]"
  - "[[../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]"
  - "[[adr-re-audit-master-2026-06-08]]"
  - "[[adr-re-audit-c3-2026-06-08]]"
  - "[[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]"
  - "[[../10-Architecture/09-Decisions/ADR-0003-match-engine]]"
  - "[[../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]]"
  - "[[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]"
  - "[[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]"
  - "[[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]]"
  - "[[../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]"
  - "[[../00-Index/Decision-Log]]"
  - "[[../90-Meta/collaboration-and-decision-protocol]]"
---

# GD re-audit — Cluster G2 (Match / Tactics / Set-piece / In-match / Live-control)

> **Status: draft / proposal — nothing here is ratified.** Read-only decision-readiness
> audit of the five game-design decisions (GDDRs) in cluster **G2** for the PLANNING-MODE
> ratification sweep. Everything was reset to `status:draft` on 2026-05-27 (decisions
> reopened), so **every** GD below needs an explicit disposition — including the ones that
> are content-sound. This note builds on, and is read with, the
> [[adr-re-audit-master-2026-06-08|ADR Re-Audit Master Report]] and its match-engine
> cluster note [[adr-re-audit-c3-2026-06-08|C3]]. **Propose only — Nico ratifies via the
> ask-first gate** ([[../90-Meta/collaboration-and-decision-protocol]]). No existing file
> was edited.

> **Scope of cluster G2.** GD-0002 (match engine & simulation model), GD-0004 (tactics &
> formations), GD-0025 (in-match controls / live-control kit), GD-0026 (set-piece-coach
> effect-readiness multiplier), GD-0035 (live-coaching intervention & pause rules). These
> are the gameplay-design companions to the C3 match-engine ADR cluster; each GD *feeds*
> or *pairs* an ADR whose disposition the master report already framed. The job here is to
> give each **GD** its own ratification disposition without relitigating the paired ADR.

> **External lookup this pass (one, targeted).** IFAB Laws of the Game 2024–2026, Law 3
> "Number of substitutions" (Perplexity, 2026-06-08; primary source thefa.com / theifab.com):
> top-competition rule is **up to 5 substitutes** across **3 substitution opportunities
> (windows) + half-time**, with **concussion substitutions additional**. This validates
> that GD-0025/GD-0035 correctly **defer** the concrete sub/window numbers to the
> Regulations coupling rather than hard-coding "3" — see the GD-0035 finding (the
> "up-to-3-subs-per-point" cap is a *per-acceptance-point* buffer bound, not the
> season/window total, and must not be read as the IFAB limit).

---

## A. Cluster assessment

**Overall: content-healthy, ratification-blocked only by lifecycle drift and by paired-ADR
dependencies.** None of the five GDs has an architectural defect. Their problems are the
same two the master report flags portfolio-wide:

1. **C-2 status/lifecycle drift** (master report §C-2). Every GD carries a body status that
   disagrees with its reopened `draft` frontmatter, and **GD-0004 is the sharpest case in
   the cluster**: frontmatter `binding: true` + `status: draft`, body heading literally
   reads `approved` with an "Approved — ratified design direction" banner. Three truths in
   one file. GD-0002 additionally embeds a **`Status: accepted` (FMX-70)** set-piece
   sub-section inside a `draft` document. The single ADR-0092 governance rule
   (frontmatter canonical; body `Accepted`/`approved` demotes to dated history) resolves
   all five at once; do not hand-edit each GD.
2. **Paired-ADR dependency.** Four of the five GDs ratify cleanly **only after** their
   paired ADR ratifies: GD-0002→ADR-0096 (the determinism/numeric-surface finaliser that
   resolves GD-0002's own "open / spike gates"), GD-0025→ADR-0072, GD-0026→ADR-0067 (+ the
   proposed additive ADR-0067/ADR-0055 amendment), GD-0035→ADR-0087. Ratifying a GD ahead
   of its ADR would re-open a question the ADR owns.

**The genuinely open product questions are small and already enumerated inside the GDs** as
"Nico-gated / playtest" knobs (speed-step count, halftime secondary set, shout magnitudes,
max-queued-subs, pause budgets). These are **FMX-52 calibration debt**, not ratification
blockers: the GDs explicitly ship *shapes and directions*, deferring *values* behind a
`*ModelVersion` / `*PolicyVersion` gate. The sweep should ratify the shapes and let the
values stay open — the recommendation on each card reflects that.

**Per-GD disposition summary:**

| GD | Title | Disposition | Paired/depends-on | Open D-qs |
|---|---|---|---|---|
| GD-0002 | Match engine & simulation model | ratify-with-amendment | ADR-0096, ADR-0049 | 1 |
| GD-0004 | Tactics & formations | ratify-with-amendment | ADR-0092 (lifecycle), R2-03 | 1 |
| GD-0025 | In-match controls / live-control kit | ratify-as-is | ADR-0072 | 0 (calibration only) |
| GD-0026 | Set-piece-coach readiness curve | ratify-as-is | ADR-0067 (+amendment) | 0 (calibration only) |
| GD-0035 | Live-coaching intervention & pause | ratify-as-is | ADR-0087 | 0 (calibration only) |

---

## B. Per-GD findings

### GD-0002 — Match Engine & Simulation Model · disposition: **ratify-with-amendment**

**Content verdict: sound and load-bearing.** The "Decided / strong" block (server-authoritative
spatial-event engine; replaceable behind the ADR-0049 port; event-log + spatial samples as the
single truth for 2D/ticker/replay/reports/LLM; star-player legibility; non-binding local runs in
the hybrid-online MVP; 3-tier presentation, defer 3D; 30-second halftime modal) is internally
coherent and consistent with the ground-truth (ADR-0002 offline-first, ADR-0030 LLM-out-of-state,
ADR-0090 narrow sync). It correctly frames the engine as a *boundary*, not a runtime bet.

**Why amendment, not as-is — two issues, both already owned by master-report drafts:**

1. **The "Open / spike gates" block is exactly what ADR-0096 resolves.** GD-0002's open list
   (TS-vs-Rust contract spike; fixed-point-vs-quantized-float numeric surface; minimum spatial
   sample density per quality profile; statistical envelopes; disconnect timers / pause budgets)
   is the gameplay-side mirror of the determinism gaps the master report assigned to **ADR-0096**
   (cross-runtime determinism + mandatory integer/fixed-point numeric surface + per-quality-profile
   precedence) and C3's ADR-0049 verdict (weak: open spike, unbounded determinism risk). GD-0002
   should not be ratified as if those gates are still open game-design questions — they are
   *architecture* questions now, and the GD should point at ADR-0096/ADR-0049 as their resolution
   owner rather than re-listing them as undecided design.
2. **Embedded `Status: accepted` FMX-70 sub-section inside a `draft` doc** (the set-piece variant
   selection determinism worked example, lines 85–123). This is C-2 lifecycle drift *within* a GD:
   an "accepted (ratified Nico 2026-06-02)" banner sitting inside a document the 2026-05-27 reopen
   reset to `draft`. The ADR-0092 governance rule demotes the inline `accepted` to dated history;
   the worked example itself is correct and should be kept (it is the canonical illustration of
   ADR-0067's `deadBallIndex` fold-forward).

**dependsOn:** ADR-0096 (resolves the open spike-gate substance), ADR-0049 (the port GD-0002
feeds), ADR-0092 (demotes the embedded FMX-70 `accepted` banner). **Not** a pure scope call — the
open substance is technical (determinism), owned by ADR-0096.

**Open D-question (one):**

- **D1 — How does GD-0002's "Open / spike gates" block resolve on ratify?**
  - **(A — RECOMMENDED)** Ratify GD-0002's "Decided / strong" as-is and **redirect** the
    "Open / spike gates" list to ADR-0096/ADR-0049 as the resolution owner (the GD records the
    *design intent* — reproducible, statistically-validated, fixed-point — and defers the
    *mechanism* to the engine ADRs). Confidence: **high**. Keeps DDD layering clean (game-design
    states the goal; the ADR pins the contract) and avoids two docs owning the same determinism
    rule.
  - **(B)** Hold GD-0002 in `draft` until ADR-0096 ratifies, then ratify them together as one wave.
    Safer sequencing but stalls a content-sound GD behind an ADR; only pick if Nico wants the
    determinism contract visibly locked before any match-engine GD is `approved`.
  - **(C)** Ratify GD-0002 fully as-is with the spike gates left as open game-design items.
    **Not recommended** — it would leave the numeric-surface / envelope questions nominally owned
    by game-design after the master report assigned them to ADR-0096, re-creating the C-4
    determinism-regime split.

---

### GD-0004 — Tactics & Formations · disposition: **ratify-with-amendment**

**Content verdict: sound but the thinnest and oldest GD in the cluster** (created 2026-05-17,
never revised). The "Decided / strong" direction — opt-in tactical depth (formation + mentality +
one-tap sub in two taps, deeper behind "More"); live control = subs / tweaks / halftime talks;
the "Eingespielt" team-chemistry multiplier carried over from Anstoss; formation *schemata* are
IP-safe while named coach "playbooks" are not; must beat the Club-Boss "shallow tactics" weakness
— is all still correct and is now **realised in more detail by the newer GD-0025** (which
explicitly cites GD-0004 for the "no free drag-editing during live play; that stays pre-match"
rule). No contradiction between them; GD-0004 is the parent principle, GD-0025 the MVP kit.

**Why amendment, not as-is — two issues:**

1. **Sharpest lifecycle drift in the cluster (C-2).** Frontmatter `binding: true` **and**
   `status: draft`; body `## Status` heading reads `approved` with a ratified-direction banner.
   The 2026-05-27 reopen makes `draft` the truth; `binding: true` + body `approved` are stale.
   ADR-0092's rule resolves it (frontmatter canonical, body demotes to dated history) — but
   because GD-0004 is uniquely carrying `binding: true`, it is the clearest example of why the
   sweep must not ratify on body text.
2. **The "Open (Wave 2)" R2-03 item is a real, still-open design scope.** GD-0004 itself says
   its tactics→engine contract is "unspecified until R2-03/R2-01 → blocks ADR-0003 and ADR-0008
   input blocks." Part of that has since been picked up (ADR-0055 Tactics context, ADR-0072
   control seam, ADR-0074 tactical-fingerprint, GD-0025 kit), but the **formation taxonomy /
   mentality bands / player-roles / set-piece-marking-pressing UX MVP slice** ("5–8 formations,
   3 mentalities, 4 instructions + chemistry multiplier") is still marked *recommended, not
   decided*. Ratifying GD-0004 should either lock that MVP slice or explicitly keep it deferred.

**dependsOn:** ADR-0092 (lifecycle demotion + drop the stale `binding: true`), ADR-0055 / ADR-0072
/ GD-0025 (which already realise parts of R2-03 — confirm no contradiction on ratify).

**Open D-question (one):**

- **D1 — Does ratifying GD-0004 lock the R2-03 MVP tactics slice, or keep it deferred?**
  - **(A — RECOMMENDED)** Ratify the "Decided / strong" opt-in-depth principle as-is and
    **lock the recommended MVP slice** (5–8 formations, 3 mentalities, 4 instructions + chemistry
    multiplier) as the ratified MVP target, with the exact taxonomy/role list as FMX-52-style
    design debt. Confidence: **medium**. The slice is already the long-standing recommendation,
    GD-0025 ships a kit consistent with it, and locking it unblocks the tactics→engine contract
    ADR-0055/ADR-0072 reference. This is a **pure product/scope call** (no technical default) —
    `scopeCallForNico = true`.
  - **(B)** Ratify the principle but keep the R2-03 slice explicitly deferred to a later
    tactics-content GD. Lower commitment; appropriate if Nico wants formation/role taxonomy
    decided with playtest data rather than now.
  - **(C)** Supersede GD-0004 with a fresh, fuller tactics GD that folds in everything learned
    since (GD-0025, ADR-0055, ADR-0074). **Not recommended for the sweep** — heavier than needed;
    the principle is sound and the realising docs already exist. Revisit only if GD-0004's age
    makes it confusing to keep as the parent.

---

### GD-0025 — In-Match Controls & Live-Control Kit · disposition: **ratify-as-is**

**Content verdict: strong, recent, evidence-grounded, and decision-complete.** D1–D4 were put to
Nico live on 2026-06-03 and chosen **A/A/A/A** (Decision-Log row 80, via paired ADR-0072): hybrid
buffer + immutable-snapshot intervention, operational pause, main-thread Canvas-2D, full kit
including shouts. The kit (subs / mentality preset / formation swap / 3 shouts / speed+pause),
the halftime hard-pause planning hub, the provisional shout-effect contract, and the
Text-&-Stats accessibility path are all internally consistent, consistent with GD-0016 (one-handed
loop), GD-0004 (no live drag-editing), and the match FSM (`state-machines/match` §4 "3 controls
minimum"). The shout contract is correctly bounded ("small modifiers, NOT stat cheats, NOT prose
feeding mechanics") and WCAG 2.2 AA is addressed.

**Why ratify-as-is (no open D-question):** every genuinely open item in the GD is already labelled
**"Nico-gated / playtest"** and is *calibration*, not *decision* — exact halftime secondary set,
speed-step count (3 vs 4), shout cooldown/magnitude/decay (FMX-52), max-queued-subs (deferred to
Regulations coupling), the optional 5th "Contain" mentality, per-UI-tier exposure (MVP ships one
tier). The GD is explicitly authored to ship *hooks + provisional values* and tune later (mirrors
GD-0019). None of those block ratification of the *shape*; they are owned by FMX-52 and the
Regulations coupling, behind the existing version gate. The only structural fix it needs is the
shared C-2 lifecycle demotion (body "Decided / strong (proposed)" → dated, frontmatter canonical),
which ADR-0092 handles portfolio-wide.

**dependsOn:** ADR-0072 (the paired control-seam ADR; ratify first or together — GD-0025 is its
gameplay surface), ADR-0092 (lifecycle). The `max-queued-subs` knob also couples to the future
Regulations context (IFAB sub/window rules — see GD-0035 note), but that coupling is already
flagged as deferred and does not block this GD.

**Not a scope call requiring a queue decision** — the open knobs are pre-assigned to FMX-52
calibration; ratify the kit shape, leave the values open.

---

### GD-0026 — Set-Piece-Coach Effect-Readiness Multiplier Curve · disposition: **ratify-as-is**

**Content verdict: the most rigorously specified GD in the cluster.** D1–D4 chosen live by Nico
2026-06-04 **A/A/A/A** (bounded-exponential curve; coach score scales the learning *rate* not the
ceiling; two-layer category+variant granularity; Training is the emitting context). It is grounded
in research ([[setpiece-coach-readiness-2026-06-04]] — the real "+5–10 set-piece goals/season,
diminishing returns" finding and the FM familiarity-bar precedent), obeys its binding frame
(ADR-0053 Staff Ops owns the role/score; Training computes readiness per training-load-and-medicine
§9; ADR-0067 purity; ADR-0018 §3 no-RNG), pins a full Zod event contract
(`SetPieceCoachReadinessUpdated`, self-contained per the ADR-0053 ACL), and carries 8 checkable
invariants (R1–R8) plus a worked example reproducing the ~3-weeks-elite vs ~5-weeks-no-coach
calibration target.

**Why ratify-as-is (no open D-question):** the decisions are made and the design is closed. The
only open items are (a) the named constants `k0, κ, λ, k0_cat, L, d_fresh, d_embedded, r_embed, ρ,
θ_on, θ_off, m_min` — all explicitly **FMX-52 calibration behind `readinessModelVersion`** — and
(b) the **additive ADR-0067/ADR-0055 snapshot-field amendment** (`selectable` +
`efficiencyMultiplier` frozen into `TacticSnapshot` at `lineup_locked`), which the GD correctly
authors as a **proposed, Nico-gated amendment, never self-accepted** (§7). That amendment is the
one real ratification action, and it is an *ADR* action (amend accepted ADR-0067), not a GD
question — so it belongs on ADR-0067's card, not as an open D-question here.

**dependsOn:** ADR-0067 (accepted — but the GD's additive `selectable`/`efficiencyMultiplier`
fields require ratifying the proposed §7 amendment to ADR-0067 §2/§6 + ADR-0055 `TacticSnapshot`),
ADR-0055 (accepted — same amendment), ADR-0053 (accepted — the score input), ADR-0018 (the
no-`*Rng` rule), ADR-0092 (lifecycle). **Caveat for the sweep:** ratifying GD-0026 implies
accepting the additive ADR-0067/0055 amendment; surface that as a linked ADR action so the
amendment is not ratified silently. Not a pure scope call.

---

### GD-0035 — Live-Coaching Intervention & Pause Rules · disposition: **ratify-as-is**

**Content verdict: strong, recent, and decision-complete.** D1–D4 chosen live by Nico 2026-06-07
**A/A/A/A** (Decision-Log row 95, paired ADR-0087). It closes gap G24 (the intervention-flood and
deliberate-pause-grief abuse holes), and is cleanly split along the bounded-context seam: **Match**
owns the deterministic `InterventionBufferPolicy` (per-acceptance-point caps, last-write-wins,
deterministic replay-stable order, typed `InterventionRejected` reasons); **Watch Party** owns the
deliberate pause-vote saga (hybrid consent by group size, discrete per-half budget, cooldown,
mandatory auto-resume). The determinism note is correct and load-bearing: the engine only knows
running/paused, never reads wall-clock, so all budgets/votes live in the watch-party layer and two
viewers of the same replay always see the same match (consistent with ADR-0087, `match.md §6`,
ADR-0090 narrow-sync, ADR-0030).

**Why ratify-as-is (no open D-question):** all magnitudes are explicitly **FMX-52 calibration
behind `interventionPolicyVersion` / a pause-policy version + per-group config** — the GD pins
*shapes, feel and directions*, not values (buffer caps ~8 global / 3 subs / 1 tactical pkg / 1
shout; pause budget ~2/half; cooldown ~90s; max pause ~20s with a fixed 60s ceiling; ~3s veto/vote
window). The "Reserved for later" items (tactics-pause type, reputation-sensitive guardrails, Head
Coach role) are explicitly post-MVP. Nothing is an open *decision*.

**One thing the sweep should NOTE (not block on) — IFAB grounding (external check, 2026-06-08):**
GD-0035's "up to **3 substitutions** (the real 'triple change')" is a **per-acceptance-point buffer
cap**, *not* the season/window total. IFAB Law 3 (2024–2026) actually allows **up to 5 substitutes
across 3 substitution opportunities (windows) + half-time**, with **concussion subs additional**.
The GD is *correct* to defer the real numbers — it says "IFAB stays the boss of substitutions: max
subs + windows come from competition rules, and the buffer cap never lets you exceed them" — but the
phrasing "up to 3 substitutions" reads, in isolation, like a claim that 3 is the IFAB max. On
ratify, clarify that "3 per point" is the *buffer* bound and the *total* (5) + *windows* (3) +
*concussion-additional* rule lives in the future Regulations context. This is a one-line wording
clarification, not a decision — hence still ratify-as-is.

**dependsOn:** ADR-0087 (the paired ADR; ratify first or together — GD-0035 is its design
companion), ADR-0072 (the control-seam it bounds), ADR-0092 (lifecycle), plus a forward coupling to
the future Regulations context for the IFAB sub/window numbers (deferred, non-blocking). Not a pure
scope call.

---

## C. Ratification ordering within G2

So that no GD is ratified ahead of the ADR that owns its open substance:

1. **ADR-0092** (governance/lifecycle) first — demotes the body `approved`/`accepted` banners and
   drops GD-0004's stale `binding: true`, so the sweep can ratify on canonical frontmatter, not
   stale body text. (Master report step 1.)
2. **ADR-0096** + **ADR-0049** — then **GD-0002** (its "open / spike gates" redirect to ADR-0096).
3. **ADR-0072** + **GD-0025** together (gameplay surface of the seam).
4. **ADR-0067 §7 + ADR-0055 amendment** + **GD-0026** together (the additive snapshot fields).
5. **ADR-0087** + **GD-0035** together (buffer/pause saga + its design companion).
6. **GD-0004** — anytime after ADR-0092; lock-or-defer the R2-03 slice (a pure scope call).

---

> **Reminder.** This note creates no binding decision and edits no existing file. Each GD's
> disposition, open D-question(s), dependencies and scope-call flag are carried in the structured
> result returned with this audit. Ratification is Nico's via the ask-first decision gate
> ([[../90-Meta/collaboration-and-decision-protocol]]).
