---
title: ADR re-audit — cluster C7 (Competition / League / Regulations / Fixtures / National)
status: draft
tags: [research, adr-audit, c7, league-orchestration, regulations, fixtures, tactics, rivalry, awards, national-team, opposition-template, determinism]
created: 2026-06-08
updated: 2026-06-08
type: research
binding: false
related:
  - [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
  - [[../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0069-league-regulations-eligibility-handoff]]
  - [[../10-Architecture/09-Decisions/ADR-0074-tactical-identity-fingerprint-aggregation]]
  - [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]
  - [[../10-Architecture/09-Decisions/ADR-0083-awards-honours-records-and-hall-of-fame-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]
  - [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
  - [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../00-Index/Open-Decisions-Dossier]]
  - [[fixture-scheduling-determinism-2026-06-02]]
  - [[tactical-identity-fingerprint-2026-06-03]]
  - [[../50-Game-Design/GD-0009-league-structure]]
  - [[../50-Game-Design/GD-0033-national-team-dual-role]]
---

# ADR re-audit — cluster C7 (Competition / League / Regulations / Fixtures / National)

Audit of ten ADRs spanning tactics, regulations/compliance, the competition & season
registry, fixture scheduling, eligibility hand-off, the tactical-identity fingerprint,
the national-team dual-role, rivalry, awards/HoF and the opposition-template AI
consumption contract. Read-only against every existing file; supersession proposals are
expressed only as **new** draft ADRs. External grounding via Perplexity (2026-06; round-
robin scheduling + EWMA/empirical-Bayes best practice) confirmed the two most algorithm-
heavy decisions in the cluster (ADR-0068, ADR-0074) are aligned with current practice.

## Snapshot

| ADR | Title | Status | Verdict | Conf |
|---|---|---|---|---|
| 0055 | Tactics Context | accepted/binding | sound | high |
| 0056 | Regulations & Compliance Context | accepted/binding | sound | high |
| 0066 | Competition & Season Registry sub-aggregate | accepted/binding | sound | high |
| 0068 | Fixture scheduling contract + determinism | accepted/binding | sound | high |
| 0069 | League↔Regulations eligibility hand-off | proposed | weak (stale G25 pointer) | medium |
| 0074 | Tactical-identity fingerprint aggregation | proposed | weak (confidence double-count) | medium |
| 0084 | National-team dual-role + intl-window contract | proposed | weak (gov gaps) | medium |
| 0057 | Rivalry System Context | accepted/binding | sound | high |
| 0083 | Awards/Honours/Records/HoF contract | proposed | weak (open RNG item) | medium |
| 0080 | Opposition-template AI consumption contract | proposed | sound | high |

The five accepted/binding ADRs (0055, 0056, 0066, 0068, 0057) are structurally sound and
internally consistent. The five `proposed` ADRs (0069, 0074, 0080, 0083, 0084) are all
"awaiting Nico ratify" per [[../00-Index/Decision-Log]]; the weaknesses below are
refinements to make **before** the ratify flip, not reasons to reject.

---

## Per-ADR findings

### ADR-0055 — Tactics Context · **sound** (high)

Clean Option-C carve (Tactics as own BC) with Reference+Snapshot semantics: Match freezes
a `TacticSnapshot` at `lineup_locked`, the live library is editable afterwards. Five
aggregates (preset / set-piece routine / role-duty / opposition template / tier config) +
the `TacticalIdentityFingerprint` projection. The decision is well-grounded (DDD split
criteria, FM `.ftc` precedent, club-owned-playbook real-world precedent). It is now the
host of two additive proposals (ADR-0067 set-piece appendix — already accepted; ADR-0074
fingerprint algorithm; ADR-0080 opposition selection) and the additive discipline is
followed correctly (no rewrite of the accepted file).

Issue (minor): the body still carries a **stale pointer to ADR-0071** ("if ADR-0071 is
ratified, AI World Simulation may become the planning source") as live planning context;
that's now reconciled centrally in [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
(AI World Sim = BC #25). No action on the accepted file itself.

Recommendation: keep as-is. When ADR-0080 ratifies, ensure the appendix's "proposed"
status flips in lockstep (it is an in-file appendix, so the additive pointer suffices).

### ADR-0056 — Regulations & Compliance Context · **sound** (high)

Option-B carve (own BC, OHS + Published Language, Conformist/ACL consumers, eligibility
chain as Process Manager in the consuming BC). Strong DDD analogue (Stripe Tax / Avalara),
real multi-regulator structure, FM Advanced-Rules precedent. `risk:legal` correctly
scoped to one context; determinism rule (per-save snapshot at creation, no live catalog
read) is consistent with ADR-0051/0027. Read-model surface (`EligibilityForTransfer`,
`SquadRegistrationCheck`, `LicenceTierCompliance`, `FfpRatioCheck`, `CurrentTransferWindow`)
is exactly what ADR-0069 / ADR-0084 later consume.

Recommendation: keep. The only forward dependency is that consumers (ADR-0069 league
eligibility, ADR-0084 intl windows) mirror its query shapes — which they do.

### ADR-0066 — Competition & Season Registry sub-aggregate · **sound** (high)

D1–D4 ratified A/A/A/A. Sub-aggregate cluster inside League Orchestration (not a new BC),
shared `CompetitionSeason` concept + distinct ARs per format family, sibling editions
under one Season, pyramid depth>1 in schema / single-tier MVP data. Invariant catalogue
I1–I9 is concrete and checkable (esp. I5/I6 contiguous-tier + mutually-resolvable
promotion/relegation slots, I8 IP-clean naming, I9 monotonic Season FSM). Reserved cup /
continental / women's-calendar seams are designed-for-not-built with explicit
no-foreclosure. IP posture is unusually rigorous (17 USC §102(b), CJEU FAPL, EU Database
Directive). The map's League Orchestration row was correctly amended in the apply-PR.

Issue (minor): I6 (`Relegation(r).slots == Promotion(r+1).slots`) is a strong invariant
that assumes symmetric pyramids; real pyramids occasionally have asymmetric merges/splits
between tiers. It is inert at single-tier MVP, so harmless now — but flag it as a
review-on-activation item when multi-tier data ships (a future cup/pyramid ADR).

Recommendation: keep. Note I6 for re-validation when depth>1 data lands.

### ADR-0068 — Fixture scheduling contract + determinism · **sound** (high)

D1–D3 ratified A/A/A. Pure `generateFixtures(participants, format, seed)`: stable
ClubId base order → seeded Fisher-Yates draw (single `WorldRng` sub-label
`fixtures:<id>:draw`) → circle method → mirrored second half → deterministic home/away
post-pass (`maxStreak=2`) → calendar placement. Invariants F1–F8 + golden-replay are
exactly the right contract. `standingsRef` correctly externalised (resolved later by
ADR-0081). **External check (Perplexity 2026-06):** the circle method + dummy-bye +
mirrored-DRR + a *deterministic local-search post-pass* to bound consecutive home/away
runs is confirmed as the canonical, correct construction; mirroring alone does **not**
guarantee venue alternation, so the post-pass (F7) is the accepted remedy — ADR-0068 has
it. One literature caveat the ADR already half-acknowledges: the odd-n residual (F7's
"or the residual is logged") — the circle method's pivot/last-fixed club can retain a
venue-repeat that the streak post-pass cannot fully resolve for odd n; MVP is league-only
even-n so this is inert, but the residual-logging escape hatch is the right call.

Recommendation: keep. When cups/odd-n competitions ship, the `CalendarSlotPolicy` hook +
the F7 odd-n residual need a dedicated ADR (already reserved).

### ADR-0069 — League↔Regulations eligibility hand-off · **weak** (medium)

The decision itself is good DDD: D1=A reframes the issue's "Saga" wording into a
*stateless `CompetitionEligibilityPolicy` domain service* (synchronous fan-out-and-decide,
no durable state/compensation → Vernon says policy, not Saga), reusing ADR-0066's
Pyramid-rollover PM only for the genuinely stateful promotion check. Severity model
(block/warn/quarantine) + pure-fn-over-snapshot replay-safety + opaque `ruleRef`/no-rule-
text IP guard (E8) are all correct. Invariants E1–E9 are checkable.

Issues:
1. **Stale cross-cluster pointer (the load-bearing one).** §5 and E9 treat the G25
   deadline-source contradiction (regulatory window vs watch-party `broadcast_at`) as an
   *open reserved hook* — "acknowledged and reserved here, not resolved." But
   [[../10-Architecture/09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]
   (FMX-102, 2026-06-07) now **closes G25** with a League-Orchestration deadline-source-of-
   truth rule. ADR-0069 (2026-06-03) predates it and does not reference it, so it reads as
   if G25 is still open. This is a staleness gap, not a contradiction — but a ratifier
   would be misled.
2. **`block` is "a guard that prevents the transition (no durable side effect)" — but the
   verdict carries `ruleSetVersion` + `inputHash` "persisted"** (§5). The interplay
   between "no durable side effect on block" and "a persisted verdict" is slightly
   under-specified: is a *rejected* verdict persisted (for audit/replay) or only a passing
   one? Worth a one-line clarification.

Recommendation (fix before ratify): (a) add a one-line "G25 now resolved by ADR-0088;
this policy reads League's authoritative deadline anchor for the window-timing read"
note, downgrading the reserved hook to a *cross-reference*; (b) clarify verdict-
persistence on block. Both are additive edits to the still-`proposed` ADR (allowed since
it is not yet accepted) or, more conservatively, a one-line amendment recorded at the
ratify gate. Options: **(A)** annotate ADR-0069 at ratify time with the ADR-0088 cross-ref
(recommended — cheapest, keeps the policy intact); (B) author a tiny superseding ADR that
re-states the eligibility hand-off with G25 resolved inline (heavier, only if Nico wants a
clean single source); (C) leave as-is and rely on ADR-0088's own back-reference (risk: the
two never get linked). **Recommend A.**

### ADR-0074 — Tactical-identity fingerprint aggregation · **weak** (medium)

D1–D4 ratified A/A/A/A. Extends ADR-0055's owned `TacticalIdentityFingerprint` with the
algorithm: five per-match signals (possession/pressing/risk/adaptation/set-piece),
clipped-linear [0,1] normalisation, per-signal EWMA half-life 15, empirical-Bayes
confidence with a familiarity factor, run-end single read into Manager & Legacy. Pure
deterministic projection, declares no `*Rng` (C2). Worked example is concrete and
reproducible. **External check (Perplexity 2026-06):** EWMA h≈15 as a middle ground
between form (3-8) and true-talent (30-40), plus empirical-Bayes/James-Stein shrinkage to
a league prior, is confirmed standard sports-analytics practice.

Issues:
1. **Confidence double-counts uncertainty (the load-bearing one).** Perplexity's explicit
   caveat: "the EWMA already encodes recency weighting, while the confidence weight should
   reflect *effective* sample size... not raw match count alone." ADR-0074's
   `w = n/(n+k_eff)` uses **raw match count `n`** as the data term, while the point estimate
   is the *recency-weighted* EWMA `ŝ`. Under EWMA the effective sample size saturates near
   `~1/α ≈ 22` regardless of how many matches were actually played, so for a long-running
   save `n` (could be 200+) drives `w → 1` even though the EWMA only "remembers" ~22
   matches. This over-states confidence for veteran managers. The variance term `v` and
   familiarity `f` partially regularize but do not fix the `n`-vs-effective-`n` mismatch.
2. **`adaptation` axis** is self-flagged as having no canonical metric (proxied from the
   ADR-0072 intervention log), correctly carrying a larger `k₀=20`. Acceptable as
   calibration debt but worth surfacing as a known low-confidence axis.

Recommendation (fix before ratify): replace the raw `n` in the confidence weight with an
**effective sample size** `n_eff = min(n, ~1/α)` (or the Kish effective-N of the EWMA
weights), so confidence saturates consistent with the EWMA's memory. Options: **(A)** use
`n_eff = (Σwᵢ)²/Σwᵢ²` (Kish effective N of the exponential weights) — principled, matches
the EWMA exactly (recommended); (B) cap `n_eff = min(n, round(1/α)) ≈ min(n, 22)` — cheap
approximation; (C) keep raw `n` but document that confidence is "matches observed," not
"effective evidence in the current estimate." This is a calibration-shape change behind
`algorithmVersion`, so it does not break the contract — but it is a *correctness* nuance,
not pure tuning, so it deserves a decision rather than being folded silently into FMX-52.
**Recommend A**, with the change recorded as an additive note on the `proposed` ADR.

### ADR-0084 — National-team dual-role + intl-window contract · **weak** (medium)

D1–D4 ratified A/A/B/A. Telegraphed reserved-stub for the playable dual-role; League
Orchestration owns the `InternationalWindow` calendar (new VO alongside ADR-0066's
`CalendarWindow`) + self-contained `InternationalWindowsPublished` + `CurrentInternational
Window` (mirrors ADR-0056's `CurrentTransferWindow`); the ADR-0066/0068 scheduler reserves
windows from MVP; deterministic forced-choice clash resolution; national-team caps/honours
fed to ADR-0083 HoF via a forward-additive `factId`. Reuse-don't-invent discipline (§5) is
exemplary. Invariants NT1–NT10 are concrete.

Issues:
1. **Governance staleness (the load-bearing one).** The ADR repeatedly cites a "stable
   19-context map" / "stable 19-context map" as the baseline against which "no new BC" is
   justified (D2 option C). But [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
   (2026-06-07, one day later) reconciles the portfolio to **28 contexts** (nine proposed
   own-BCs accepted). ADR-0084's "19-context map" framing is already stale at the time of
   this audit. The *decision* (windows are a calendar fact in League Orchestration, no new
   BC) is unaffected — but the justification text is out of date.
2. **D3=B drops the trophy path** (`rep≥75 AND 5 seasons`, no "OR 3 trophies"). The ADR's
   own rationale — "reputation already rewards trophies via the region-rep model" — assumes
   the region-rep aggregate is a *single global* number that trophies feed; if region-rep is
   regional/fragmented, a club-legend who dominates one region may not cross a *global* 75
   bar, contradicting the GD-0011 "club legend → national coach" spine. This is a coherence
   risk between D3=B and the reputation model, not a hard contradiction.
3. **`competitionRef?: CompetitionId` inside `InternationalWindow`** points at the
   ADR-0066 registry's reserved cup/continental seam, which is explicitly *unbuilt* at MVP.
   So a `tournament`-kind window carries a ref to a competition type that does not yet
   exist — acceptable as a reserved field, but the invariant set should state it is
   null/inert until the continental seam ships.

Recommendation (fix before ratify): (a) update the "19-context" framing to reference
ADR-0089's reconciled portfolio (cross-ref, not a re-litigation of the no-new-BC call);
(b) add a one-line invariant that `tournament`-window `competitionRef` is reserved/null
until the ADR-0066 continental seam is built; (c) confirm with Nico that the global
reputation aggregate genuinely subsumes the trophy path for D3=B (a coherence check, not a
re-decision). All additive. Options for (a)/(c): **(A)** annotate at ratify gate
(recommended); (B) author a superseding ADR if the reputation-model coherence check fails.
**Recommend A**, pending the (c) coherence confirmation.

### ADR-0057 — Rivalry System Context · **sound** (high)

Option-C carve (Rivalry as own BC owning the `RivalryEdge` graph + 5-sub-score formula +
threshold FSM + decay), with Option D (cross-cutting domain service) explicitly rejected as
a Vernon anti-pattern. Strong reasoning: rivalry is a *between-club relationship* graph, so
embedding it in single-club Club Management (A) or orchestration-language League (B) both
break aggregate boundaries / drift the ubiquitous language. Consumers treat score/tier as
external facts (CQRS read models). Determinism (per-save, seeded decay on `SeasonAdvanced`,
derived tier FSM not independently stored) is consistent with the cluster. The "lighter
scope is fine" risk is honestly named and DDD-backed.

Recommendation: keep. (Reconciled in ADR-0089's portfolio as an existing BC; no change.)

### ADR-0083 — Awards/Honours/Records/HoF contract · **weak** (medium)

D1–D4 ratified A/A/A/B. Extends ADR-0051 additively (no new BC); per-save records stay
Statistics-owned (ADR-0081), cross-save legacy/HoF/legend-ranking owned by Manager &
Legacy under its read-only-at-world-gen rule. Three-layer model + raw-facts-plus-versioned-
formula determinism (a formula change re-scores history, never breaks saves) + forward-
additive keyed `factId` schema. Era-normalization + scarcity-cap as first-class knobs to
fight HoF dilution. Invariants HF1–HF10 are strong. Consumes the FMX-90 taxonomy + FMX-94
snapshot exactly as handed off.

Issues:
1. **D4=B (full HoF in MVP) is a Nico *override* of the recommended reserved-stub**, with
   "all magnitudes unvalidated until FMX-52" as the named consequence. Sound as a scope
   call, but the dilution/distortion risk is *mitigated by design* (knobs), not *resolved*.
   Worth re-confirming at ratify that shipping induction UI + simulated voting in MVP is
   still wanted given the unvalidated magnitudes.
2. **Open RNG item (load-bearing).** HF9 leaves open whether in-world HoF "voting" stays a
   pure deterministic formula (no new `*Rng`) or gains stochastic seeded voting. The
   Open-Decisions-Dossier mini-point M2 already recommends *pure formula for MVP; if
   stochastic later, a sub-label of an existing stream, not a new top-level `LegacyRng`/
   `HoFRng`*. This is an explicit open decision the ratifier must close.

Recommendation: ratify D1–D3 as-is; close the HF9/M2 RNG item explicitly (recommend the
dossier's position: pure deterministic induction for MVP, no new top-level RNG). Re-confirm
D4=B scope. No superseding ADR needed — this is a ratify-gate decision, already staged in
the dossier.

### ADR-0080 — Opposition-template AI consumption contract · **sound** (high)

D1–D3 ratified C/B/C. Split event model: AI-management owns the planning context, Tactics
is the deterministic catalog selector/publisher of `OppositionTemplateSelectedForMatchV1`,
Match freezes it into `TacticSnapshot` at `lineup_locked` (candidate allowed at
`lineup_open`). Fail-fast on missing selection (no silent default). Dedicated
`WorldAiMgmtRng` sub-label isolates out-of-match AI planning from MatchCoreRng and set-
piece sub-labels (OT4). Idempotent per `(fixtureId, club, lockVersion, modelVersion)`.
Self-contained event, no cross-context joins. The contract is precise and replay-safe;
the ADR-0071 dependency (AI World Sim may become the planning source) is correctly handled
as a stable event shape regardless of which context produces the planning context (OT7).

Recommendation: keep / ratify as-is. The only residual is calibration debt (scoring
weights, taxonomy, scouting-confidence effects) explicitly deferred — not a soundness
issue.

---

## Cross-ADR issues (within C7)

1. **G25 resolved upstream but ADR-0069 still reserves it.** ADR-0069 §5/E9 names the
   regulatory-window-vs-`broadcast_at` deadline-source contradiction as an open reserved
   hook; [[../10-Architecture/09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]
   closed G25 four days later. ADR-0069's registration-window timing read
   (`CurrentTransferWindow`/window-FSM as eligibility-timing source) must now be reconciled
   with ADR-0088's deadline-source-of-truth rule. Cross-cluster staleness; fix = a cross-ref
   at ADR-0069's ratify gate.

2. **"19-context map" framing is stale across the cluster.** ADR-0084 (and the older
   accepted ADRs' "could grow to 16/17/18" risk notes) reason against a map size that
   ADR-0089 has since reconciled to 28. None of the *decisions* change (all the C7 "no new
   BC" calls survive), but the justification language is dated. A single dossier note
   pointing the cluster at ADR-0089 as the portfolio source-of-truth would prevent a
   ratifier from re-litigating settled count anxieties.

3. **Determinism / RNG-stream discipline is consistent and good.** Across the cluster the
   sub-label grammar is coherent: fixtures use `WorldRng:fixtures:<id>:draw` (0068),
   opposition templates use `WorldAiMgmtRng:opposition-template:...` (0080), the fingerprint
   and eligibility policy declare *no* RNG (0074, 0069), national-team offers reserve
   `WorldAiMgmtRng:national-team:offers:<seasonId>` (0084), and the only open RNG question
   is HF9 (0083). No drift, no top-level-stream proliferation. This is a cluster strength,
   not an issue — recorded so the ratifier can treat the RNG axis as settled except HF9.

4. **Eligibility-timing vs window-ownership split is clean.** ADR-0056 owns the regulatory
   `CurrentTransferWindow`; ADR-0084 owns the `InternationalWindow` calendar and *mirrors*
   (does not absorb) the query shape; ADR-0069 *reads* both for eligibility timing without a
   join. The "calendar fact vs regulatory verdict" boundary is held consistently — no
   harmful coupling. Worth preserving explicitly when the playable dual-role ships.

5. **Tactics is the busy host.** ADR-0055 now anchors three additive proposals (0067
   accepted, 0074, 0080). The additive-pointer discipline is followed, but the ratifier
   should flip the in-file ADR-0055 appendix statuses (set-piece appendix already accepted;
   opposition appendix flips when ADR-0080 ratifies) in lockstep to avoid an accepted file
   carrying a "proposed" appendix indefinitely.

---

## Proposed decisions (only where the audit warrants a new/superseding ADR or GD)

The cluster does **not** warrant any new bounded context or any superseding ADR for the
five accepted ones — they are sound. The genuine action items are pre-ratify refinements to
three `proposed` ADRs, plus one small cross-cutting governance note. Numbers assigned
centrally later.

1. **Confidence-weight correctness fix for the tactical fingerprint** (additive amendment
   to the still-`proposed` ADR-0074, or a tiny superseding ADR if Nico prefers a clean
   record). Replace raw match-count `n` in `w = n/(n+k_eff)` with an EWMA-consistent
   effective sample size (`n_eff = (Σwᵢ)²/Σwᵢ² ≈ 1/α`). Correctness nuance, not pure FMX-52
   tuning. **Confidence: medium.**

2. **G25 reconciliation for the eligibility hand-off** (additive cross-ref / amendment to
   `proposed` ADR-0069). Link ADR-0088's deadline-source-of-truth rule; downgrade the §5/E9
   "reserved hook" to "resolved upstream," and clarify whether a `block` verdict is
   persisted for audit. **Confidence: medium.**

3. **National-team contract governance + coherence touch-ups** (additive amendment to
   `proposed` ADR-0084). (a) Re-base the "19-context" framing on ADR-0089; (b) add an
   invariant that `tournament`-window `competitionRef` is reserved/null until the ADR-0066
   continental seam ships; (c) HITL confirm the global reputation aggregate subsumes the
   dropped trophy path (D3=B coherence with GD-0011). **Confidence: medium.**

4. **Close the HF9/M2 in-world-voting RNG item at ADR-0083's ratify gate** (no new ADR —
   already staged in the Open-Decisions-Dossier). Recommend: pure deterministic induction
   for MVP, no new top-level `*Rng`; any later stochastic voting uses an existing-stream
   sub-label per ADR-0018 §3. **Confidence: high.**

None of these block the five accepted ADRs; all four are pre-ratify refinements on the
`proposed` set, expressible additively without rewriting any binding file.
