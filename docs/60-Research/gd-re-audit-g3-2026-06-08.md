---
title: "GD Re-Audit — Cluster G3: Players / Squad / Training / Youth / Skills / Development (2026-06-08)"
status: draft
binding: false
tags: [research, gddr, gd-audit, re-audit, players, squad, training, youth, skills, development, persona, ocean, determinism, cluster-g3, 2026-06-08]
created: 2026-06-08
updated: 2026-06-08
type: research
related:
  - "[[../50-Game-Design/GD-0003-squad-players]]"
  - "[[../50-Game-Design/GD-0005-training]]"
  - "[[../50-Game-Design/GD-0007-youth]]"
  - "[[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]"
  - "[[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]"
  - "[[../50-Game-Design/GD-0027-hidden-attribute-substrate-mapping]]"
  - "[[../50-Game-Design/GD-0006-transfers]]"
  - "[[../50-Game-Design/GD-0015-ip-clean-data]]"
  - "[[data-generators]]"
  - "[[player-staff-development-decision-model-2026-05-28]]"
  - "[[eos-player-staff-skills-and-personas-2026-05-28]]"
  - "[[hidden-attribute-substrate-mapping-2026-06-05]]"
  - "[[../10-Architecture/09-Decisions/ADR-0003-match-engine]]"
  - "[[../10-Architecture/09-Decisions/ADR-0004-data-model]]"
  - "[[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]"
  - "[[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]"
  - "[[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]"
  - "[[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]"
  - "[[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]"
  - "[[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]"
  - "[[adr-re-audit-c6-2026-06-08]]"
  - "[[adr-re-audit-master-2026-06-08]]"
  - "[[../00-Index/Decision-Log]]"
  - "[[../00-Index/Current-State]]"
  - "[[../90-Meta/collaboration-and-decision-protocol]]"
  - "[[../90-Meta/vault-governance]]"
---

# GD Re-Audit — Cluster G3: Players / Squad / Training / Youth / Skills / Development

> **Status: draft / proposal — nothing here is ratified.** Read-only re-audit of the six
> G3 GDDRs (squad/attributes, training, youth, EOS skills/personas, development/decision-
> influence, hidden-attribute substrate mapping) for the PLANNING-MODE ratification sweep.
> Everything was reset to `status: draft` on 2026-05-27 ([[../00-Index/Current-State]]),
> so **every** GD needs an explicit disposition — including the ones that are sound. This
> note frames each as answerable D-questions with options + a recommendation + confidence
> **for Nico**; the workflow never decides. Ground-truth constraints (offline-first PWA —
> ADR-0002; LLM out of authoritative state — ADR-0030; Postgres system-of-record —
> ADR-0027) are taken as given and not relitigated. **No existing file was edited.** Builds
> on the C6 ADR re-audit ([[adr-re-audit-c6-2026-06-08]]) and the
> [[adr-re-audit-master-2026-06-08|master report]]; the People/Staff/Youth ADR ownership
> verdicts there are not re-derived.

## Headline cross-cutting findings (read first)

**F-1 — One live content contradiction: the attribute SCALE.** This is the single
load-bearing defect in the cluster. **GD-0003's "Decided / strong" section still records
"1–10 strength + 4 talent buckets"**, but the binding, `status: current` research note
[[data-generators]] (`binding: true`, updated 2026-06-01) and every later GD
(GD-0020/0021/0027) lock **16 visible + 4 GK + 8 hidden meta on a 1–20 scale**. GD-0003's
own reopen banner already flags this ("Do not implement the older 1-10 … language without
a new owner decision") — so the contradiction is *acknowledged* but not *resolved in the
body*. Ratifying GD-0003 as-is would re-bind the wrong scale. It must be ratified
**with amendment** (promote 16+4+8 / 1–20 into the body, demote the 1–10 text to dated
history). This is the cluster's only true ratify-with-amendment-because-of-content item.

**F-2 — Status / lifecycle drift on GD-0005 and GD-0007 (same disease as ADR C2/C6).**
Both carry frontmatter `status: draft` (correct post-reopen) **but `binding: true` and a
body "## Status → approved" + an "Approved" banner**. Three conflicting truths per file,
exactly the pattern the master report's **ADR-0092 (status SSOT)** rule resolves
portfolio-wide (frontmatter canonical; body "approved/accepted" demotes to dated history;
standard reopen banner). The GD cluster should be folded into that **same** governance
sweep rather than each GD edited piecemeal. GD-0003 already shows the *target* shape (its
banner reconciles to draft); GD-0005/0007 have not been given the same banner yet. This is
one governance problem, not two GD problems.

**F-3 — The cluster is otherwise structurally healthy and converging.** GD-0020 → GD-0021
→ GD-0027 form a clean, layered, non-contradictory chain: GD-0020 sets the substrate
direction (16+4+8 kept, skills ≠ attributes, OCEAN internal, football-label surface);
GD-0021 adds the owner/consumer factor matrices (no numerics); GD-0027 specifies the
deterministic meta/OCEAN → label derivation + ownership (D1–D4 already chosen live by Nico
A/A/A/A on 2026-06-05). Determinism discipline is consistent throughout (R-DERIVE/P1 "no
`*Rng` at derivation"; PlayerSkillProfileSnapshot locked at line-up lock; "generated prose
never mutates state" reasserted in all three). No harmful coupling, no ownership leak found.

**F-4 — Two genuine open product/scope gates remain, both already surfaced by the GDs
themselves** (not new defects): (a) the **staff-skill MVP activation** A/B/C gate (GD-0021
§Staff-skill, recommended B), referenced but unresolved by GD-0020 and by ADR-0053's
re-audit; (b) the **OVR / spreadsheet-vs-cards presentation** direction, which GD-0003's
old body half-states and GD-0021 firmly resolves ("No global OVR", Impact Lens). (b) is
effectively decided by the later GDs and only needs GD-0003's body brought into line (folds
into F-1's amendment).

**F-5 — Dependency spine.** GD-0027 explicitly "unblocks the ADR-0052 substrate boundary"
and depends on the binding *direction* of GD-0020 + the proposed People (ADR-0052) /
Scouting (ADR-0064) contexts. So the natural ratification order is **GD-0020 (substrate
direction) → GD-0027 (derivation/ownership) → ADR-0052 (People context) ratify**, with
GD-0021 alongside (it is the consumer-map layer the others reference for the numeric
deferral). GD-0003/0005/0007 are the older "design-pillar" GDs and can ratify independently
once the scale (F-1) and status (F-2) fixes land.

---

## Per-GD verdicts

### GD-0003 — Squad, Players & Attributes — **ratify-with-amendment** · confidence high

The design *intent* (mobile-legible compact player cards never a desktop grid; 8–12
flavour traits; injury-proneness; persistent legacy artefacts as "retention gold") is
sound, matches the Anstoss/Club-Boss research it cites, and is reaffirmed by GD-0020/0021.
**But the "Decided / strong" body still binds the wrong numbers**: "1–10 strength + 4
talent buckets" and the Open items still cite the superseded ADR-0004 schema and the R2-02/
R2-14 Wave-2 placeholders. The canonical baseline is **16+4+8 on 1–20** ([[data-generators]],
`binding:true`; GD-0020/0021/0027). The reopen banner already says so; the body has not
been updated to match. **Amendment:** promote the 16+4+8 / 1–20 baseline (and "No global
OVR / Impact Lens" from GD-0021) into the body as the decided direction; demote the 1–10 +
ADR-0004 language to dated history; redirect `Feeds ADRs` / schema refs from ADR-0004 to
ADR-0027. Then it ratifies cleanly. **dependsOn:** GD-0020 (substrate), ADR-0027 (schema
home), and the ADR-0092 status-SSOT governance rule. Not a scope call — the direction is
already decided downstream; this is reconciling the oldest GD to it.

### GD-0005 — Training & Development — **ratify-with-amendment** (governance/status only) · confidence high

Content is sound and not contradicted anywhere: weekly-plan-with-daily-slots, condition vs
freshness as distinct axes, one individual-training focus/week, "Eingespielt" team
chemistry, training camps with location effects, **mandatory regeneration as the punishing
trade-off**, and **upgradeable** trainer caps (hard cap 5, infra-liftable so it stops
feeling punitive late game). It coheres with GD-0021's "Weekly player development = active
MVP foundation" and ADR-0003 (training → attribute deltas). The **only** issue is the F-2
status drift: frontmatter `draft` vs `binding:true` vs body "approved". **Amendment is
purely the ADR-0092 governance fix** (frontmatter canonical, demote "approved" to history,
add the standard reopen banner GD-0003 already has) — no content change. The numeric
calibration (effect magnitudes, R2-02/R2-03/R2-19 glossary) is correctly left as
post-ratify calibration debt, not a blocker. **dependsOn:** the ADR-0092 status-SSOT rule.
**Open question:** only whether the cluster's status drift is fixed via the central
governance sweep (recommended) vs per-file edits.

### GD-0007 — Youth Academy — **ratify-with-amendment** (governance/status + one cross-ref) · confidence high

Design direction (separate youth screen; ~42-day scout missions; scout quality tied to
staff salary; youth-investment slider; promotion gate player ≥17 + two youth weeks;
continent-targeted scouting; wonderkid / golden-generation archetypes; **rating *range* on
reports as deliberate risk**; upgradeable youth-scout slot; post-season promotion window)
is sound and is the design pillar that ADR-0060 (Youth Academy context) operationalises —
the C6 re-audit rates ADR-0060 "strongest-in-wave 6/6 DDD". Same **F-2 status drift** as
GD-0005 (draft vs binding:true vs "approved" body). **Amendment:** the ADR-0092 governance
fix, **plus** a light cross-ref note that the academy *lifecycle/ownership* now lives in the
proposed ADR-0060 (`AcademySeason`/`YouthCohort` FSMs, investment slider, HoY opinion) and
the loan exit path in ADR-0075 — so the GD reads as the design pillar feeding those, not as
a competing spec. The R2-02 generation algorithm + R2-06 "rising youth nations" stay
calibration/world-drift items. **dependsOn:** ADR-0092 (status), and read-alongside
ADR-0060 / ADR-0075 (no hard ratify-ordering on the GD itself).

### GD-0020 — EOS Player Skills, Personas & People — **ratify-with-amendment** · confidence high

The keystone product direction for the People layer: **keep 16+4+8**; skills/perks are
sparse visible specialisations (never new attributes, never OVR, never hidden stats);
behavioural tendencies stay distinct from skill triggers; **OCEAN is internal substrate**;
football-language labels are the surface; relationship constellations give context not
invented narrative; **generated prose is presentation-only** (ADR-0030). This is internally
coherent, IP-clean-aware (GD-0015), and is the direction GD-0021/0027 + ADR-0052 build on.
It is `binding:false` + body banner already correctly says "Draft only" — so **no status
drift** (unlike 0005/0007). Two things keep it off a clean ratify-as-is: (a) it carries a
real **§Open list** with one product gate that matters downstream — the **staff-skill MVP
activation** (target-only / narrow pipeline / full cards), which it explicitly defers to
GD-0021; (b) several "MVP activates all actor classes for persona context" claims (players,
staff, board, journalists, media outlets, fan segments/groups/reps, agents from the first
playable) are a **scope assertion** worth Nico's explicit confirmation, since it sets the
narration-surface breadth for MVP. **Recommendation:** ratify the substrate *direction*
as-is (it is the binding frame GD-0027 already obeys), but pair it with the GD-0021
staff-skill decision and an explicit yes/no on the full MVP actor-class breadth. **dependsOn:**
GD-0021 (staff-skill gate), ADR-0052 (People context the skills/persona live in).

### GD-0021 — Player & Staff Development & Decision Influence — **ratify-with-amendment** · confidence high

The owner/consumer **factor-matrix** layer (player development; match/tactics/selection;
transfer/contract/squad-planning; staff-pipeline/staff-skill) is exactly the right shape for
a contracts-first DDD model: it names factors, owners, consumers, affected decisions and
phase — and **deliberately approves no numbers** (weights/thresholds/caps deferred to
playtest/FMX-52). "Keep 16+4+8", "No global OVR", "separate layers stay separate", "prose is
presentation-only", and clean domain-ownership (Squad&Player / Training / Transfer / Staff
Ops / People-draft) are all consistent with GD-0020/0027 and the C6 ADRs. The acceptance
Gherkin is a genuine asset. It is `binding:false` + "Draft only" banner — **no status
drift**. The one thing it cannot ratify *clean* on is the **staff-skill MVP A/B/C gate** it
explicitly hands to Nico (recommends **B — narrow pipeline modifiers**); until that is
resolved, the "StaffSkillProfileSnapshot" row stays a hook. This is a real product call (no
technical default forces it) → **scopeCallForNico** on the staff-skill sub-question.
Everything else ratifies once that gate is set and ADR-0052 lands. **dependsOn:** GD-0020,
ADR-0052, ADR-0053.

### GD-0027 — Hidden-Attribute Substrate Mapping — **ratify-as-is** · confidence high

The cleanest GD in the cluster. It closes audit gap G22, **D1–D4 were already put to Nico
live and chosen A/A/A/A on 2026-06-05** (OCEAN persisted-as-state + mutate-in-place;
Scouting `HiddenFlagRevealLedger` as the single reveal gate, People derives; mentoring =
People policy + Training compute; multi-label + exclusion-axes). The derivation model is a
**pure deterministic function** (P1/R-DERIVE, no `*Rng`), reveal is a band read-model with
**no cross-context join** (P5, honours ADR-0064 §3.1), prose may phrase but never mutate
(P9, ADR-0030), and every numeric threshold is correctly flagged `(calibration)` behind
`personaLabelModelVersion`. It obeys the binding *direction* of GD-0020 and records the
boundary ADR-0052 then ratifies. Because the decisions are already made and the open items
are explicitly non-blocking calibration, this is a **reopen → re-ratify unchanged** with no
open D-question. The only nuance: its re-ratification is most meaningful **after** GD-0020's
substrate direction is re-ratified (F-5) and it formally unblocks ADR-0052 — a sequencing
note, not an amendment. **dependsOn:** GD-0020 (substrate direction), ADR-0064 (reveal gate),
ADR-0052 (the boundary it unblocks).

---

## Cross-GD issues within G3

1. **Attribute-scale contradiction (highest priority, content).** GD-0003 body "1–10 + 4
   buckets" vs the binding 16+4+8 / 1–20 in [[data-generators]] + GD-0020/0021/0027. Resolve
   by amending GD-0003's body (F-1). One fix; nothing else in the cluster depends on the old
   scale (the later GDs already use the new one).

2. **Status / lifecycle drift on GD-0005 + GD-0007 (governance).** `draft` frontmatter vs
   `binding:true` + body "approved". Fold into the master report's ADR-0092 status-SSOT
   sweep (frontmatter canonical; demote body "approved"; standard reopen banner). Do **not**
   edit the GDs piecemeal. GD-0003 already demonstrates the target banner shape.

3. **Staff-skill MVP activation gate tracked in two GDs.** GD-0020 §Open and GD-0021
   §Staff-skill both carry the same A/B/C decision (GD-0021 recommends B). It is one product
   decision; resolve once (in GD-0021, the owning GD) and have GD-0020 reference the verdict
   rather than re-state the gate — mirrors the C6 "one open question, not two footnotes"
   hygiene finding for the Contracts/CLM seam.

4. **OVR / presentation direction reconciliation.** GD-0003's old body implies a
   strength/talent rating surface; GD-0021 firmly decides "No global OVR + Impact Lens +
   ranges + explanations". Not a live conflict (later GD wins) but GD-0003's amendment
   should pull in the "No global OVR" line so the oldest pillar matches.

5. **Dependency spine for ratification (F-5).** GD-0020 (substrate direction) → GD-0027
   (derivation/ownership, already A/A/A/A) → **ADR-0052 ratify**; GD-0021 alongside as the
   factor-matrix consumer layer; GD-0003/0005/0007 ratify independently after the scale +
   status fixes. No GD blocks another on *content* — only the ADR-0052 unblock and the
   shared staff-skill gate create soft ordering.

6. **IP-clean label vocabulary (hygiene, already respected).** GD-0027's surfaced labels
   reuse GD-0020's set and are IP-clean per GD-0015 (P8); GD-0020's labels are evocative
   football words, not real taxonomy. Consistent with the vault-wide creative-naming rule;
   no action beyond keeping seed/sample data clean.

---

## External verification (targeted, this audit)

Only one assumption in the cluster was version/fact-sensitive enough to warrant an external
check, and it was already grounded in prior research, so no new lookup was run:

- **OCEAN (Big-Five) as a persona substrate for game characters** — GD-0020/0027 use a mixed
  OCEAN model as internal substrate with derived football labels. This is grounded in the
  existing research notes [[eos-player-staff-skills-and-personas-2026-05-28]] and
  [[hidden-attribute-substrate-mapping-2026-06-05]] (CK3 Opinion / RimWorld trait-axis /
  FM personality precedent), which the GDs cite. The design is genre-standard and the
  determinism/ownership treatment (persist-as-state, pure derivation, reveal-gated bands) is
  the conservative, replay-safe choice. **No correction needed; no fresh external lookup
  required** — the substrate decision is direction, not a version-pinned tech claim.
- **Attribute schema scale** — confirmed against the in-vault binding source
  [[data-generators]] (`status:current`, `binding:true`): 16 visible + 4 GK + 8 hidden meta
  on 1–20, FM-reference CA/PA split, integer-only numerics. This is the canonical baseline;
  GD-0003's 1–10 is the stale outlier. Internal verification sufficient; no external claim.

---

## Disposition summary

| GD | Title | Disposition | Open gate | scopeCall |
|---|---|---|---|---|
| GD-0003 | Squad, Players & Attributes | ratify-with-amendment | scale 1–10 → 16+4+8/1–20 in body; ADR-0004→0027 | no |
| GD-0005 | Training & Development | ratify-with-amendment | governance/status (ADR-0092) only | no |
| GD-0007 | Youth Academy | ratify-with-amendment | governance/status + ADR-0060/0075 cross-ref | no |
| GD-0020 | EOS Player Skills, Personas & People | ratify-with-amendment | MVP actor-class breadth + staff-skill ref | partial |
| GD-0021 | Player & Staff Development & Decision Influence | ratify-with-amendment | **staff-skill MVP A/B/C** | yes (staff-skill) |
| GD-0027 | Hidden-Attribute Substrate Mapping | ratify-as-is | none (D1–D4 = A/A/A/A) | no |

> **Reminder.** This note creates no binding decision and edits no existing file. All
> dispositions, amendments and D-questions are proposals for Nico's ask-first decision gate
> ([[../90-Meta/collaboration-and-decision-protocol]]). The status/governance amendments
> (GD-0005/0007) are intended to ride the same ADR-0092 sweep as the ADR cluster, not
> per-file edits.
