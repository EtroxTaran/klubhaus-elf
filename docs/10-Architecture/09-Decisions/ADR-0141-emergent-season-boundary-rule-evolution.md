---
title: ADR-0141 Emergent season-boundary rule evolution (amends ADR-0056)
status: accepted
tags: [adr, architecture, regulations, compliance, rule-evolution, world-lifecycle, determinism, fmx-243, fmx-228]
context: [regulations-compliance, league-orchestration]
created: 2026-07-23
updated: 2026-07-23
type: adr
binding: false
linear: [FMX-243, FMX-228]
supersedes:
superseded_by:
related:
  - [[ADR-0056-regulations-compliance-context]]
  - [[ADR-0139-persistent-container-ubiquitous-language]]
  - [[ADR-0005-save-format]]
  - [[ADR-0132-release-versioning-app-build-process]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0136-delegation-to-staff-contract]]
  - [[../../50-Game-Design/regulations-and-compliance]]
---

# ADR-0141: Emergent season-boundary rule evolution (amends ADR-0056)

## Status

accepted

**Ratified by Nico 2026-07-23** — the five fork decisions (D1–D5) accepted as recommended,
with **Alternative B adopted**: a single amendment vote authors exactly **one** dated step (one
effective season); the multi-season phase-in schedule capability is **dropped** for minimal
surface. Authored `proposed` per the never-self-accept rule; **amends the binding ADR-0056** by
supersede-by-amendment (`vault-governance.md`), never a silent overwrite. `binding: false` stays:
enforcement is not wired (D2 declares the mechanism inert at MVP), and per vault-governance
§"Status vs binding" there is no `accepted ⇒ binding: true` rule. The ADR-0056 §Determinism +
regulations GDDR lockstep amendments are already merged (FMX-243, PR #252). FMX-243 (epic FMX-228),
run through the Research / Decision loop; grounded by a dynamic research workflow (IFAB / Premier
League AGM / UEFA FSR governance tracks + OOTP/NBA-2K precedents + a determinism analysis).

## Context

FMX-243 (thoughts T11/T12): Nico wants rules to evolve **emergently** season-to-season
(in-world committee/tribunal decisions, financial-rule changes), not only via changes
**pre-authored at save creation** — which is all ADR-0056 permits today
(*"After save creation, the rule set is immutable except for pre-authored future-changes
that activate at predetermined dates"*, ADR-0056 §Determinism).

Research validated the intent **and** the guardrail: real football rules **do** evolve
year-on-year, but the change is authored by a **governing-body vote** (IFAB ¾ AGM;
Premier League 14/20 AGM; UEFA FSR ExCo) and takes effect at a **season boundary**;
**mid-season the rules are immutable**. The one thing that legitimately hits mid-season is
**tribunal enforcement of existing rules** (points deductions) — never new rule text. So
we can grant emergent evolution **without** weakening ADR-0056's mid-season lock or the
Continuum's byte-exact replay (ADR-0139).

## Decision (proposed amendment to ADR-0056)

ADR-0056 already ships the mechanism FMX-243 needs: a per-save `EffectiveRuleSet` snapshot
plus a date-keyed future-change activation layer triggered at `SeasonAdvanced`. Today that
layer has **one** producer (pre-authored-at-creation). This amendment adds a **second
producer** (in-world governance) feeding the **same** activation path. Mid-season behaviour
and catalog isolation are unchanged.

1. **`EffectiveRuleSet` becomes an append-only, content-addressed version chain.** The save
   holds an append-only sequence of immutable rule-set versions; **each `Season` pins exactly
   one immutable `ruleSetVersion` (+ `ruleSetVersionHash`)**. Past seasons stay pinned to the
   version that governed them.
2. **A second, in-world producer of future-changes** (distinct from the editorial
   `SupersedeRule`/`PublishRule` path): commands `ProposeRuleAmendment`, `RatifyRuleAmendment`;
   event `RuleAmendmentRatified { proposedByBody, effectiveSeason, ruleDiff, newRuleSetVersion,
   newRuleSetVersionHash, ratifiedAtSeq }` written to the per-save transactional outbox
   (ADR-0028). The next-season version is **derived inside the save** from `(prior immutable
   snapshot + ratified diff)`, content-addressed — never a live read of the mutable global
   catalog. **(Ratified Alternative B, 2026-07-23:** one amendment authors exactly **one** dated
   step — one effective season. A gradual change is achieved by re-proposing each season; the
   multi-season phase-in schedule capability is deliberately out of scope to keep the surface
   minimal.**)**
3. **Bounded amendment vocabulary (data, not code):** an enumerated, range-bounded,
   schema-validated catalog of amendable parameters (modelled on GDDR §7.1.5 obligation
   conditions). **No rule DSL, no scripts** — every reachable next-version is a deterministic,
   validatable, content-addressable artifact; the IP/exploit/legal surface is one validator.
4. **Authoring ≠ enforcement (normative):** in-world **enforcement** of *existing* rules
   (tribunal points deductions/fines — FMX-263) stays a **separate track** that may act
   **mid-season** on standings/state but **never** alters rule text.

### Fork decisions (D1–D5 — ratified by Nico 2026-07-23)

- **D1 — vote determinism = seeded variance.** The ratify/reject outcome is a pure function
  of `(event log, aggregate state, reserved RNG sub-stream)`; governance draws come from a
  dedicated `governance:amendments:<seasonId>` sub-stream on the counter/hash substrate
  (ADR-0136 DL10), so they never shift other consumers' draws. Outcome is recorded in the
  event → replay reproduces it. *(Matches real close votes — VAR 19-1, SCR 14-6 — and the
  standing seeded-variance lean, FMX-92/102.)*
- **D2 — MVP scope = declare-now / arm-later.** At Continuum-v1 the `RuleAmendment*` event,
  the version-chain field and the RNG sub-stream are **declared INERT** (zero amendments);
  MVP runtime == current ADR-0056 (pure pre-authored). Emergent evolution **arms post-MVP** as
  a forward-additive content patch — **no save-format break** (ADR-0084 precedent).
- **D3 — scope = parameter-first.** Rule-**parameter** evolution (caps, window dates, sub
  counts, eligibility thresholds) is the armable target. **Structural/format** evolution
  (league reform, expansion) is data-shaped via ADR-0066 per-Season rows but **reserved inert**
  and armed only once the boundary-regeneration pipeline is proven.
- **D4 — modes.** Both Continuum types get the mechanism; **career** uses it fully, **roguelite**
  exposes it as an **opt-in Run modifier** (on/off, aggressiveness) so short Runs aren't
  destabilised by rule drift. *(Touches the two-worlds framing, FMX-212.)*
- **D5 — transition.** **Per-category minimum notice** — financial + registration rules require
  an **N-season notice** before their single effective step; **contract-affecting rules are
  grandfathered** (apply only to contracts signed after the effective season). *(OOTP locks
  contract rules mid-flight.)* **(Per ratified Alternative B, the earlier "mandatory phase-in
  schedule" transition option is dropped** — a gradual ramp like UEFA's 90/80/70 cap is expressed
  as one re-proposed single-step amendment per season, not one scheduling vote.**)**

## Invariants (normative — re-scope existing binding rules)

- **E-a (mid-season immutability, unchanged):** the *running* season's pinned `ruleSetVersion`
  never changes; the arm step is gated on `SeasonAdvanced`, so a mid-season rule-text change is
  impossible by construction and the player always had a full season's notice.
- **E-b (replay-safe stamping):** every rule-dependent event/verdict stamps `ruleSetVersion` +
  `ruleSetVersionHash` and is a pure fn of `(input, aggregate state, ruleSetVersion)` — no
  wall-clock, no live catalog read (ADR-0069 E3, re-scoped save-pinned → season-pinned).
- **E-c (no re-simulation of history):** past seasons replay under their retained old version +
  snapshot; a new version applies only forward. **No `engineVersion` bump; no retroactive
  re-simulation** (ADR-0005 §9, ADR-0120 D5).
- **E-d (catalog isolation, unchanged):** *"No live reading of the mutable global catalog during
  a save"* stands verbatim; the emergent version is derived in-save from the prior immutable
  snapshot.
- **E-e (two version axes stay separate):** in-world rule-**content** evolution (the
  `ruleSetVersion` chain — gameplay state) MUST NEVER trigger a save migration or re-simulation;
  only out-of-world schema/engine/content-pack evolution (ADR-0005 saveVersion/engineVersion,
  ADR-0132 four-layer matrix) migrates. Never conflate the two.

## Seams (ownership)

- **FMX-263** governing bodies / tribunals — *produce* proposals + enforcement actions.
- **FMX-244** approval-gate — *gates* ratification (SP admin / MP majority).
- **Regulations & Compliance BC (this ADR)** — owns the rule catalog, the version chain, the
  bounded amendment schema/validator, and *applies* the ratified amendment into the version
  chain at the boundary. `RuleAmendmentRatified` is the shared seam all three consume.
- Supplies the mechanism ADR-0139 item 3 deferred ("updates enter only at season boundaries").

## QA hook (extends ADR-0120)

Golden-replay test: (a) ratify an amendment in season N via the log; (b) confirm season N
recomputes byte-identically under the OLD version and N+1 under the NEW version; (c) confirm
the amendment is reproduced byte-identically from the log + pinned RNG sub-stream. Add
`ruleSetVersionHash` to the L1 replay-evidence family and the byte-replay match condition.

## Consequences

- Delivers FMX-243's intent with the narrowest edit to a binding ADR: only the *authorship*
  clause of ADR-0056 widens ("pre-authored **or** emergently authored in-world, both arming at
  a season boundary"); the fairness + catalog-isolation invariants stay verbatim.
- MVP behaviour is unchanged (declare-inert); no save-format risk. Full governance sim arms later.
- Lockstep on ratification: the ADR-0056 §Determinism + regulations GDDR §7.1.1 amendments are
  **already applied** (FMX-243, PR #252). The `saveSchemaVersion` bump (ADR-0132) for the
  append-only amendment history is **deferred to post-MVP arming** — D2 declares the mechanism
  inert at Continuum-v1, so no save-format change lands until emergent evolution is switched on.

## Alternatives considered

- **A — keep pre-authored-only (status quo):** zero cost, but fails FMX-243's intent and makes
  FMX-263 governing bodies decorative (they can punish, never legislate).
- **B — season-boundary amendment without phase-in schedules:** the smallest step; drop the
  "multi-season schedule" item. **✅ ADOPTED on ratification (2026-07-23)** — one vote authors one
  dated step; gradual ramps are re-proposed each season.
- Full detail + sources: FMX-243 research workflow synthesis.
