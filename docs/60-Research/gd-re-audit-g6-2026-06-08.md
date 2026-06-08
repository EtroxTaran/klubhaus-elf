---
title: GD re-audit — cluster G6 (Competition / League / National / Awards / Stats / Weather)
status: draft
tags: [research, audit, gd-re-audit, g6, league, national-team, awards, hall-of-fame, statistics, analytics, weather, pitch]
created: 2026-06-08
updated: 2026-06-08
type: research
binding: false
related:
  - [[../50-Game-Design/GD-0009-league-structure]]
  - [[../50-Game-Design/GD-0029-weather-and-pitch-design-model]]
  - [[../50-Game-Design/GD-0031-analytics-hub-and-statistics]]
  - [[../50-Game-Design/GD-0032-awards-honours-records-and-hall-of-fame]]
  - [[../50-Game-Design/GD-0033-national-team-dual-role]]
  - [[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
  - [[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
  - [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
  - [[../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
  - [[adr-re-audit-c7-2026-06-08]]
  - [[adr-re-audit-c8-2026-06-08]]
  - [[adr-re-audit-c9-2026-06-08]]
  - [[adr-re-audit-master-2026-06-08]]
  - [[../90-Meta/collaboration-and-decision-protocol]]
  - [[../00-Index/Open-Decisions-Dossier]]
---

# GD re-audit — cluster G6 (Competition / League / National / Awards / Stats / Weather)

Decision-readiness audit of the five G6 game-design records against the mature vault and the
already-completed ADR re-audit (clusters C7/C8/C9 + master). Scope: league/competition structure
([[../50-Game-Design/GD-0009-league-structure|GD-0009]]), weather/pitch
([[../50-Game-Design/GD-0029-weather-and-pitch-design-model|GD-0029]]), analytics/statistics
([[../50-Game-Design/GD-0031-analytics-hub-and-statistics|GD-0031]]), awards/honours/HoF
([[../50-Game-Design/GD-0032-awards-honours-records-and-hall-of-fame|GD-0032]]), national-team
dual-role ([[../50-Game-Design/GD-0033-national-team-dual-role|GD-0033]]).

**Decision gate ([[../90-Meta/collaboration-and-decision-protocol]]): every recommendation below
is options + a recommendation + confidence, for Nico to ratify. Nothing here is accepted; this
note edits no existing file.** Ground-truth constraints (offline-first PWA, LLM out of
authoritative state, Postgres = system-of-record, seeded-variance-over-pure-determinism where
Nico has repeatedly leaned) are respected.

## Headline findings

1. **Four of five G6 GDs are content-sound and their feeding ADRs were already verdicted
   `sound`/`weak-but-fixable`.** GD-0029→ADR-0077 (sound, high), GD-0031→ADR-0081 (sound, high),
   GD-0009→ADR-0066 (sound, high) are clean. The two `weak` ADRs (ADR-0083 HoF, ADR-0084
   national-team) carry **one genuinely open D-question each** that the GD already flags as an
   "open ratification item" — those flow straight up into the matching GD card.

2. **The single highest-value open D-question in G6 is the HoF in-world induction RNG**
   (GD-0032 §6 / ADR-0083 HF9 / dossier M2): pure deterministic formula vs a seeded `*Rng`
   sub-label. This is the one G6 decision that touches the determinism axis Nico has repeatedly
   re-weighted toward bounded seeded variance (FMX-92 D4=C, FMX-102 D4=B) — so it must be framed
   as a real two-option choice, not a rubber-stamp of "pure formula."

3. **GD-0009 carries the same status/lifecycle drift the C9 cluster flagged vault-wide.** Its
   front-matter says `binding: true`, its body says "approved" / "Decided / strong … is ratified",
   yet the phase banner reopened everything to `draft` (2026-05-27) and the matching ADRs were
   reopened too. GD-0009 is the only G6 GD with `binding: true`; the other four are correctly
   `draft`/`binding: false`. This is governance metadata, not design substance — it folds into the
   proposed vault-governance ADR (ADR-0092), so GD-0009 ratifies-with-amendment, not redesign.

4. **Stale bounded-context-count language reaches into GD-0033** (via ADR-0084's "19-context map"
   framing) the same way the ADR audit found. ADR-0089 reconciles the portfolio to **28** (Stats
   = #27, Environment & Climate = #26). No G6 *decision* changes; only justification text is dated.

5. **GD-0009 has a structural duplication risk worth a ratify-gate note:** the "Open (Wave 2)"
   R2-14 schema item was *resolved* by ADR-0066 (ratified 2026-06-02) and an Appendix A diagram was
   pasted into the GD. With ADR-0066 reopened to `draft`, the GD now embeds a copy of an
   architecture diagram whose source-of-truth (ADR-0066) is itself un-ratified — a single-source-of-
   truth smell, not a contradiction.

---

## Per-GD verdicts

### GD-0009 — League & Competition Structure — **ratify-with-amendment** (status drift + SSOT)

Confidence: **high**.

Evidence: the design substance is uncontroversial ground-truth IP doctrine — real-world league
*structures* are uncopyrightable formats (17 USC §102(b), CJEU FAPL, EU Database Directive, already
re-confirmed in ADR-0066's C7 verdict), real names generated (GD-0015/ADR-0007), Aurelia-Premier
fictional default, pyramid + parallel cups, Aug–May calendar, women's-calendar offset reserved as
per-`Season` data not schema. The R2-14 domain schema is owned by
[[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate|ADR-0066]], which the
prior ADR audit verdicted **sound (high)** (D1–D4 ratified A/A/A/A; reserved cup/continental/women's
seams designed-for-not-built). Nothing in the design needs to change.

Issues (all metadata / SSOT, not design):
1. **Status/lifecycle drift.** Front-matter `binding: true` + body "## Status → approved" +
   "Decided / strong … is ratified design direction" collide with the phase reopen to `draft` and
   the Decision-Log. Three truths in one file — exactly the X1 pattern from C9.
2. **Embedded ADR-0066 artefact.** Appendix A duplicates the Competition & Season registry class
   diagram (owned by ADR-0066) and labels it "Status: accepted (ratified 2026-06-02)" — but ADR-0066
   is itself reopened to `draft`. The GD now asserts an accepted-ness its source no longer claims.
3. **Stale internal cross-refs.** R2-14 still references the superseded SurrealDB schema note and
   ADR-0004 (data-model), which the master audit confirms is **superseded by ADR-0027** (Postgres).

Recommendation: ratify-with-amendment. (a) Reconcile status under the proposed governance ADR
(ADR-0092: front-matter is canonical SSOT) — the design *content* re-ratifies unchanged. (b) Make
Appendix A a **rendered reference to ADR-0066** rather than an owned copy (or label it explicitly
"non-authoritative mirror of ADR-0066") so the diagram has one owner. (c) Re-point R2-14's
schema/data-model references to ADR-0027/ADR-0066. **dependsOn: ADR-0066** (the schema authority)
and the governance ADR-0092. All are ratification chores, not redesign.

### GD-0029 — Weather & Pitch Design Model — **ratify-as-is**

Confidence: **high**.

Evidence: companion to [[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch|ADR-0077]],
which the C9 audit verdicted **sound (high)** — WGEN/Richardson-grounded, uses the already-reserved
`WeatherRng` stream #5, 11 explicit invariants, lock-time snapshot discipline, replay-safe fallible
forecast. GD-0029 fixes only effect *directions* (rain/wind/heat/cold/altitude/pitch as the
amplifier) with every magnitude explicitly deferred to FMX-52 behind `weatherModelVersion`. D1–D4 =
C/A/A/A were chosen live by Nico (2026-06-05). The "keep weather modest, make pitch+infrastructure
the engaged system" thesis is the correct FM/OOTP lesson (cautionary cases — OOTP wind, CM frozen
pitches — are correctly named). Postponement/abandonment, dynamic mid-match weather, and the
drinks-break band are cleanly reserved out of MVP (D4). This is a model GDDR: directions fixed,
numbers deferred, determinism delegated to a sound ADR.

Issues: none load-bearing. Minor: the pitch-condition *state ownership* split (Stadium Ops owns the
aggregate / Environment owns weather as input) is the one open boundary item, but it is owned by
**ADR-0077's** ratify gate (C9 §X1 / the 2026-06-07 recommendation), not by this GD — so it is a
dependsOn, not an open question of GD-0029 itself.

Recommendation: ratify-as-is. **dependsOn: ADR-0077** (ownership/determinism authority; ratify
first so the pitch-state split is settled). No open D-question belongs to the GD.

### GD-0031 — Analytics Hub and Statistics — **ratify-as-is**

Confidence: **high**.

Evidence: feeds [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner|ADR-0081]],
verdicted **sound (high)** in C8 (CQRS projection-only read-model context, no command authority,
idempotent via ADR-0028 offsets, deterministic rebuild per `metricSetVersion`, immutable
`SeasonAnalyticsHandoffSnapshot`, SA9 separates in-world football statistics from product telemetry).
GD-0031's design is disciplined and consistent: Analytics Hub MVP-active; **statistics never become
an OVR substitute** (respects player-strength-presentation — no universal OVR / no hidden best-player
shortcut); **official counts vs model estimates always visually distinguished**; broad-but-bounded
MVP metric set (xG/xA/xGA, PPDA, field tilt, maps, zone control, per-90, form windows); every insight
routes to an action; long-save memory (season summaries + HoF handoff snapshot) starts in MVP. All
genuinely-uncertain items (xG/xA formulas, PPDA/field-tilt zone defs, grid resolution, insight
weights, record thresholds) are correctly parked under "Open / calibration" (FMX-52), not guessed.

Issues: one **cross-cluster coupling to watch** (already flagged in C8): the MVP derived-metric
families (xG/xA/PPDA/field-tilt) must exist in the **Match engine output contract** for SA4's
byte-identical rebuild to hold. That is a Match-contract-existence check, owned by the Sporting-Core
cluster, not an open design question of GD-0031.

Recommendation: ratify-as-is. **dependsOn: ADR-0081** (read-model owner). Note at the
implementation gate: confirm the Match analytics output-layer contract exists before building the
derived projections. No open D-question of the GD itself.

### GD-0032 — Awards, Honours, Records & Hall of Fame — **ratify-with-amendment** (one open RNG D-question)

Confidence: **medium-high**.

Evidence: feeds [[../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract|ADR-0083]],
verdicted **weak (medium)** in C7 — content sound, two ratify-gate items. The three-layer model
(season awards → per-save records book → legacy/HoF synthesis) is the canonical prior-art shape;
raw-facts-plus-versioned-formula determinism (a formula change re-scores history, never breaks saves)
is correct; era-normalization + scarcity/quota caps are the right anti-dilution knobs; HF1–HF10 are
strong; cross-save legacy is read-only-at-world-gen (D8) and never read by a running save. D1–D4 =
A/A/A/B, with **D4=B (full HoF in MVP) a Nico override** of the recommended reserved-stub.

Issues:
1. **Open RNG item — the load-bearing G6 decision (GD-0032 §6 / ADR-0083 HF9 / dossier M2).**
   In-world HoF induction is deterministic sim state, so its "voting" is either a pure deterministic
   formula (no new `*Rng`) or genuinely stochastic seeded voting (new `LegacyRng`/`HoFRng` sub-label
   under ADR-0018 §3). The GD and ADR both *recommend* the pure-formula path and leave it explicitly
   open for the ratifier. Given Nico's repeated lean toward bounded seeded variance on the
   determinism axis, this must be framed as a real choice (see card open D-question).
2. **D4=B scope re-confirm.** Shipping induction UI + simulated voting in MVP with all magnitudes
   unvalidated until FMX-52 is a sound scope call but the dilution risk is *mitigated by design*
   (knobs), not *resolved*; worth a one-line re-confirm at ratify (pure scope, no technical default).
3. National-team caps/tournament inputs to records/HoF are **reserved (depend on FMX-84 / GD-0033)**
   — correctly forward-additive, not a contradiction.

Recommendation: ratify-with-amendment — close the HF9/M2 RNG item explicitly. **dependsOn:
ADR-0083** (contract), and **GD-0031/ADR-0081** (consumes the analytics snapshot), and **GD-0033**
(reserved national-team prestige seam). The D4=B scope re-confirm is a `scopeCallForNico`-adjacent
product call, but since it pairs with the technical RNG question it is carried on this card.

### GD-0033 — National-Team (Bundestrainer) Dual-Role — **ratify-with-amendment** (D3=B coherence check)

Confidence: **medium-high**.

Evidence: feeds [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract|ADR-0084]],
verdicted **weak (medium)** in C7 — content sound, justification stale, one coherence check. The
design is well-grounded: a reputation-gated earned "side-job" (Anstoss Bundestrainer canon; FM's
"don't over-build international management" lesson kept lean); MVP ships **only** the reserved
`InternationalWindow` calendar (owned by League Orchestration per ADR-0066 `CalendarWindow` / ADR-0068
`FixturesPublished`) + early telegraphing + a reserved prestige seam into ADR-0083 HoF — a telegraphed
reserved stub, not a cut feature. D1–D4 = A/A/B/A, all chosen live (2026-06-06). Deterministic
forced-choice same-day clash resolution (no RNG, replay-safe, media story beat) is the emotional hook
and correctly replay-safe. Reuse-don't-invent discipline (mirrors ADR-0056's transfer-window VO) is
exemplary.

Issues:
1. **D3=B coherence check (the load-bearing one, from C7).** D3=B set the unlock gate to
   `rep ≥ 75 AND ≥ 5 seasons` and **dropped the "OR 3 trophies" path**, on the rationale that
   "reputation already rewards trophies via the region-rep model." That holds **only if** the
   region-rep aggregate is a *single global* number trophies feed into; if region-rep is
   regional/fragmented, a club legend dominating one region may never cross a *global* 75 bar —
   contradicting the GD-0011 "club legend → national coach" spine. This is a coherence risk between
   D3=B and the reputation model, not a hard contradiction; the ratifier should confirm it.
2. **Stale "19-context map" framing** in the feeding ADR-0084 (ADR-0089 reconciles to 28). No
   decision changes; cross-ref fix at the ratify gate.
3. **`competitionRef` in `InternationalWindow`** points at ADR-0066's *unbuilt* continental seam —
   acceptable as a reserved/null field; add the inert-until-continental-seam invariant note.

Recommendation: ratify-with-amendment — confirm the D3=B reputation-coherence assumption (one
D-question below) and apply the ADR-0089 cross-ref + reserved-`competitionRef` note at the ADR-0084
gate. **dependsOn: ADR-0084** (contract), **ADR-0066/ADR-0068** (window calendar host), and
**GD-0011** (the career spine D3=B must remain coherent with). The unlock-threshold *numbers* (75 / 5)
are FMX-52 calibration debt, not an open decision here.

---

## Cross-GD issues within G6

- **GX1 — Status/lifecycle drift (governance, vault-wide).** GD-0009 alone in G6 carries
  `binding: true` + body "approved" while the phase reopened it to `draft`. Same X1 pattern the C9
  ADR audit found; resolved by the proposed governance ADR-0092 (front-matter canonical SSOT), not by
  per-GD edits. Highest-leverage, lowest-risk.

- **GX2 — Determinism / RNG discipline is good across G6, with exactly one open question.** GD-0029
  (WeatherRng #5), GD-0033 (no-RNG forced-choice clash; `WorldAiMgmtRng:national-team:offers`),
  GD-0031 (deterministic rebuild) all use the established sub-label grammar with no top-level-stream
  proliferation. The **only** open RNG decision in the cluster is GD-0032 §6 / HF9 (in-world HoF
  induction). Keeping it the single open RNG item is a cluster strength.

- **GX3 — Stale bounded-context-count language** reaches GD-0033 via ADR-0084's "19-context map."
  ADR-0089 fixes the catalog at 28 (Stats #27, Environment & Climate #26, national-team windows stay a
  calendar fact in League Orchestration — no new BC). No G6 decision changes; a single dossier cross-ref
  to ADR-0089 prevents a ratifier re-litigating settled count anxieties.

- **GX4 — Snapshot/handoff coupling is the connective tissue of G6 and is consistent.** GD-0031's
  immutable `SeasonAnalyticsHandoffSnapshot` → GD-0032 awards/records/HoF (computed *from* the
  snapshot) → GD-0033 reserved prestige seam *into* GD-0032 HoF. The dependency chain is acyclic and
  the read-only-at-world-gen rule is honoured throughout; ratify ADR-0081 → ADR-0083 → (GD-0033 seam)
  in that order.

## Targeted external lookup

No G6 GD rests on a version-sensitive or empirically-uncertain external assumption that the prior ADR
audit had not already grounded: weather (WGEN/Richardson + FIFA WBGT cooling-break threshold) was
verified in C9; fixture/competition IP doctrine (17 USC §102(b), CJEU FAPL, EU Database Directive) and
the circle-method scheduling construction were verified in C7; the xG/xA/PPDA/field-tilt metric
families are MVP-bounded with formulas explicitly deferred to FMX-52, so no "is this the current best
metric" lookup is decision-blocking. The one genuinely open question (HoF induction RNG) is an
internal determinism-policy choice, not an external-fact question. Targeted lookup therefore returned
no decision-changing external input for G6; the FMX-52 calibration gate is the correct place for the
numeric/formula currency checks.

## Disposition summary (machine-readable list in the structured output)

| GD | Disposition | Open D-questions | dependsOn |
|---|---|---|---|
| GD-0009 | ratify-with-amendment | status SSOT + Appendix-A ownership (metadata, no design D-question) | ADR-0066, ADR-0092 |
| GD-0029 | ratify-as-is | — | ADR-0077 |
| GD-0031 | ratify-as-is | — | ADR-0081 |
| GD-0032 | ratify-with-amendment | HF9/M2 in-world induction RNG; D4=B scope re-confirm | ADR-0083, ADR-0081, GD-0031, GD-0033 |
| GD-0033 | ratify-with-amendment | D3=B reputation-coherence confirmation | ADR-0084, ADR-0066, GD-0011 |
