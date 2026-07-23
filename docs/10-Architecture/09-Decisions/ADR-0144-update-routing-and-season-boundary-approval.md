---
title: ADR-0144 Update-routing policy & season-boundary approval gate
status: accepted
tags: [adr, architecture, world-lifecycle, continuum, live-ops, governance, update-routing, fmx-244, fmx-228]
context: [league-orchestration, regulations-compliance]
created: 2026-07-23
updated: 2026-07-23
type: adr
binding: false
linear: [FMX-244, FMX-228]
supersedes:
superseded_by:
related:
  - [[ADR-0141-emergent-season-boundary-rule-evolution]]
  - [[ADR-0139-persistent-container-ubiquitous-language]]
  - [[ADR-0132-release-versioning-app-build-process]]
  - [[ADR-0005-save-format]]
  - [[ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0011-server-authoritative-multiplayer]]
---

# ADR-0144: Update-routing policy & season-boundary approval gate

## Status

accepted

**Ratified by Nico 2026-07-23** (the six open questions resolved below). Authored
`proposed` per the never-self-accept rule. `binding: false` stays: enforcement (schemas,
CI, DoD) is not wired in this planning phase, and per vault-governance §"Status vs binding"
there is no `accepted ⇒ binding: true` rule. FMX-244 (epic FMX-228), run through the
Research / Decision loop. Discharges ADR-0139 item 3 ("updates enter only at season
boundaries") and fills the ADR-0141 seam ("FMX-244 approval-gate — SP admin / MP majority").
Builds on the now-merged ADR-0142/ADR-0143. *(Research note: 2 of 4 grounding legs failed;
the design rests on a complete DDD/vault synthesis — precedent grounding can be deepened on
request.)* Two additive lockstep touches (ADR-0132 routing-lane enum; async-mp §9
generalization) are pre-authorized here and tracked as the paired FMX-244 lockstep follow-up
(mirrors the ADR-0141 → ADR-0056 two-PR pattern), **not** applied in this ratification.

## Context

Nico (T8/T30/T32): which updates flow **live** into a running Continuum, which are
**start-params** (new Continua only), which enter only at the **next season boundary**; plus a
**won't-break** validation and an **approval gate** (SP admin decides; MP majority votes). The
versioning machinery exists (ADR-0132 four-layer compat; ADR-0005 versions; ADR-0120 save-forward;
ADR-0141 season-boundary amendment path) but the routing **policy** and the majority-approval
**mechanism** are undecided. This is the routing + approval **layer** on top of those.

## Decision

### D1 — Two-axis frame (inherited invariant, ADR-0141 E-e)

Never conflate: **(A) out-of-world runtime evolution** (app / API / save-schema / engine-module
availability — ADR-0132/ADR-0005, handled at load time; its **forced-update category
security/data-loss/unsupported-contract CANNOT be vetoed** by the gate — a MP group can never vote
to stay on an insecure or data-losing build); and **(B) in-world gameplay-content/behaviour**
(sim behaviour, rule parameters, market model, balance, content packs) — **the axis FMX-244 routes**,
and the only axis the approval gate governs.

### D2 — Routing is DERIVED, not chosen

Lane = f(two tests): **Test-1** does it alter the running season's deterministic outputs? **Test-2**
is it graftable onto this Continuum's creation-time frozen baseline (ADR-0139 item 1) + current
in-flight state?

| Test-1 outputs | Test-2 graftable | Lane |
|---|---|---|
| unchanged | yes | **LIVE** (into running Continuum) |
| changed | yes | **NEXT-SEASON-BOUNDARY** (arm-later; the ADR-0141 path) |
| any | no | **START-PARAM-ONLY** (new Continua only; joins the ADR-0139 item-1 creation snapshot) |

Determinism (ADR-0141 E-a/E-b/E-d) **forecloses LIVE for all simulation-bearing content by
construction** — a mid-season live swap of sim content is architecturally impossible. LIVE is
available only for **non-simulation content** (cosmetic / UI / narrative-flavour / telemetry /
pure crash+security fixes byte-identical to the sim). This is a deliberate, principled divergence
from generic live-service norms (which hot-swap balance/drop-rate data live), justified because
this cluster makes mid-season immutability + byte-exact replay sacred.

**Per-class default lanes** (still derived per release): game-engine sim behaviour →
NEXT-SEASON-BOUNDARY (running season pinned to start engine; new engine arms at N+1; past seasons
replay old engine — ADR-0005 §9 / ADR-0120 D5); pure crash/security fix (byte-identical sim) →
LIVE via ADR-0132 forced-update; rules content-pack patch → NEXT-SEASON-BOUNDARY (feeds the same
ADR-0141 arm path); structural/league-reform rule change → START-PARAM-ONLY (ADR-0141 D3 reserved);
transfer-market algorithm/tuning → NEXT-SEASON-BOUNDARY (alters outputs; mid-window change breaks
replay); content/data pack → LIVE if additive-only + future-only + graftable, else
NEXT-SEASON-BOUNDARY (changes running-season pools) or START-PARAM-ONLY (redefines/removes baseline
entities); balance tables → NEXT-SEASON-BOUNDARY.

### D3 — Season-boundary won't-break validation (`CompatibilityGate`)

Runs in the pre-boundary window; extends ADR-0120 save-forward + ADR-0132 four-layer + ADR-0141
bounded-amendment validator. Five checks: (1) version/schema compat; (2) referential
integrity/graftability (no in-flight entity — clubs, competitions, active contracts, open transfer
window, pending tribunal — removed/incompatibly redefined → route to START-PARAM-ONLY); (3)
bounded-amendment validation for rule updates (ADR-0141 item 3); (4) determinism golden-replay
dry-run (season ≤N recomputes byte-identically under its OLD pinned version; arm produces the NEW
version for N+1 only — ADR-0141 QA hook, ADR-0120 L1, E-c); (5) in-flight guard via ADR-0141 D5
(per-category notice/phase-in; contract-affecting rules grandfathered). Emits
`BoundaryUpdateValidated` / `BoundaryUpdateRejected{reason}`. **Validation is a precondition of
approval** — an un-validated update can never be approved.

### D4 — Approval gate FSM

`Proposed → Validated → PendingApproval → {Approved | Declined | QuorumFailed | Expired} →
[Approved] Armed@SeasonAdvanced`.

- **Singleplayer:** the admin **is** the player — `ApproveBoundaryUpdate{actor=admin}`
  (accept/decline/defer), **no quorum**, plus a per-Continuum **auto-confirm policy** (defaults:
  auto-accept additive content + balance; always-ask engine + rules) so the player isn't nagged.
- **Multiplayer:** **majority quorum of active Run-holders** (seats, not spectators).
  `CastBoundaryUpdateVote{continuumId, updateId, memberId, ballot}`; tally is a **pure,
  server-authoritative** function (ADR-0011 — a real vote, NOT the ADR-0141 D1 seeded mechanism);
  approved when yes-share clears the threshold (see open fork). Generalizes async-mp §5 pause-vote
  quorum from pause to update-entry.
- **Fail-safe (async-mp "never stop the world"):** timeout / no-quorum = **NO ARM** — the Continuum
  keeps its current version; the update stays offered next boundary or for new Continua. Fail-safe
  default = "no change" preserves mid-season immutability. The armed version is content-addressed
  (ADR-0141) so all MP members converge on byte-identical next-season rules.

### D5 — Ownership

A thin **Continuum Lifecycle / Update-Governance** context (answers ADR-0142 Q7 + ADR-0143 Run
ownership) owns a `ContinuumUpdatePlan` aggregate and **orchestrates only**: ingests candidates
(release/content-pack layer + Regulations' `RuleAmendmentRatified`), runs the CompatibilityGate by
**delegating** layer-specific validation to each owning BC, runs the gate, and on Approved +
`SeasonAdvanced` emits `ArmBoundaryUpdate` to the owning BC. It does **not** apply content itself
(Regulations applies `ruleSetVersion`; League owns the Season timeline + fires `SeasonAdvanced`;
Platform/Save-Format owns orthogonal schema migration — out of gate scope).

### D6 — MVP scope (declare-now / arm-later)

SP path + routing table + CompatibilityGate ship at MVP. MP quorum commands/events are declared
**inert** until MP Continua exist (matches ADR-0141 D2 + "MP = design the seam now, build later").

### Contracts (per-save outbox, ADR-0028; replay-safe stamped, ADR-0141 E-b)

Commands: `RegisterUpdateCandidate · RunCompatibilityGate · ApproveBoundaryUpdate ·
CastBoundaryUpdateVote · ArmBoundaryUpdate`. Events: `UpdateCandidateRegistered ·
UpdateRouted{lane} · BoundaryUpdateValidated/Rejected · BoundaryUpdateApproved/Declined ·
BoundaryVoteQuorumFailed · BoundaryUpdateArmed{effectiveSeason,newVersion,newVersionHash} ·
StartParamUpdateShelved`. QA hook: extends ADR-0141/ADR-0120 golden-replay with a MP-vote-tally
determinism test (same recorded ballots → same arm).

## Ratified decisions (Nico, 2026-07-23)

The six open questions are resolved as follows (recommendations accepted; D4 closed by the
now-merged ADR-0142):

- **D1 (load-bearing) — LIVE restricted to non-simulation content only → YES.** Option B
  (mid-season re-pin) is rejected: it breaks ADR-0141 E-a/E-c + ADR-0120's "never present a
  re-simulated result as canonical."
- **D2 — per-class default lane table CONFIRMED as derived** (content packs + balance → the
  next boundary of a *running* Continuum when graftable, else new-Continua-only). The table in D2
  is normative; lanes remain derived per release from the two tests.
- **D3 — MP threshold = the configurable async-mp §5 quorum, 66% default, group-tunable.** A bare
  >50% is treated as a floor most groups will raise for engine/rules changes.
- **D4 — eligible voter / abstention (now CLOSED via ADR-0142).** Eligible voters = **active
  (non-`dormant`) Run-holder seats** per ADR-0142's presence-driven `active ⇄ dormant` lifecycle
  FSM; `dormant` seats do not count toward quorum or tally. Outcome = **majority-of-cast with the
  async-mp §7 quorum floor** (abstention = not-cast). Late-join is boundary-only server `AddMember`
  with zero imported state (ADR-0142 D3), so a late-joiner is eligible only from the boundary at
  which they join — never retroactively for a vote already in progress.
- **D5 — ownership = the thin Continuum-Lifecycle / Update-Governance context** (not League —
  avoids a god-context). Consistent with the "Continuum Lifecycle" platform-tier context introduced
  by ADR-0142.
- **D7 — START-PARAM late-graft = reserved-inert** (declare-now / arm-later). A full
  migration/regeneration pipeline carries real re-sim/replay risk and is deferred post-MVP.

## Reopens? — none

ADR-0141 pre-delegated this gate to FMX-244; ADR-0132/0005/0120/0028/0011 are **consumed, not
contradicted**. Two additive lockstep touches are **pre-authorized by this ratification and tracked
as the paired FMX-244 lockstep follow-up** (not applied here): (a) binding ADR-0132's per-pack
compatibility flag gains an additive **routing-lane enum** (`live | next-boundary |
new-continuum-only`) alongside its existing `applies-to-existing-save | requires-new-run`; (b)
async-mp §9 generalizes admin-only season-boundary changes to member-majority for update entry.

## Alternatives considered

- **B — admin-only MP** — rejected (contradicts Nico's T30/T32 majority ask).
- **C — a live hotfix escape lane** — rejected (re-pins mid-season, breaks the sacred fairness/replay
  guarantee; the correct remedy for a broken table is "ship it, arm at next boundary"). C's tiered
  thresholds are kept as open fork D3.
