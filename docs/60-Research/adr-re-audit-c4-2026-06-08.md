---
title: ADR re-audit — Cluster C4 (Architecture Style / Modularity / Eventing / Realtime)
status: draft
tags: [research, adr-audit, architecture, modular-monolith, ddd, state-machine, async, realtime, multiplayer, eventing, bounded-context, c4]
created: 2026-06-08
updated: 2026-06-08
type: research
binding: false
related:
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/09-Decisions/ADR-0014-state-machines]]
  - [[../10-Architecture/09-Decisions/ADR-0012-async-cadence-models]]
  - [[../10-Architecture/09-Decisions/ADR-0023-realtime-transport]]
  - [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  - [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../10-Architecture/09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]
  - [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../10-Architecture/state-machines/transfer]]
  - [[../10-Architecture/state-machines/league-week]]
  - [[../10-Architecture/state-machines/watch-party]]
  - [[determinism-and-replay]]
  - [[fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]]
---

# ADR re-audit — Cluster C4: Architecture Style / Modularity / Eventing / Realtime

Read-only audit of eight cluster-C4 ADRs against the current vault. No existing file edited;
supersession framed only as **proposed new draft ADRs**. Decisions belong to Nico (decision
gate, [[../90-Meta/collaboration-and-decision-protocol]]).

ADRs audited: [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]],
[[../10-Architecture/09-Decisions/ADR-0014-state-machines]],
[[../10-Architecture/09-Decisions/ADR-0012-async-cadence-models]],
[[../10-Architecture/09-Decisions/ADR-0023-realtime-transport]],
[[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]],
[[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]],
[[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]],
[[../10-Architecture/09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]].

## Headline cross-ADR findings

1. **Context-count drift is the single biggest cluster-wide defect.** Three live numbers
   coexist: ADR-0019 §Decision says **"eleven bounded contexts"** and `src/domain/<context>/`
   lists eleven; [[../10-Architecture/bounded-context-map]] §1 says **"Nineteen"**; ADR-0089
   proposes **28**. ADR-0019 is the binding architecture-style ADR but its own count is two
   reconciliations stale. None of this is wrong per se (the map is the live source), but the
   *binding* ADR no longer matches the map it governs.
2. **Systematic stale outbox citation.** [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
   has `supersedes: ADR-0013-transactional-outbox` (status accepted). Yet ADR-0019, ADR-0014,
   ADR-0011 and ADR-0018 all still cite **ADR-0013** directly for "domain events publish through
   the transactional outbox" with no supersession note. ADR-0088 is the only cluster ADR that
   correctly redirects ("the issue cites ADR-0013 … superseded by ADR-0028 — this ADR uses 0028").
   The bounded-context-map §3 also still cites ADR-0013.
3. **Renumber residue in ADR-0018.** ADR-0018 was written referencing **"ADR-0010"** for the
   modular-monolith rule (§1 "as required by ADR-0010"; §9 "does not supersede ADR-0010"). That
   ADR-0010 was renumbered to **0019** (the 0010 slot is now the design-system ADR). So ADR-0018's
   two "ADR-0010" citations now point at the *wrong* ADR — a latent ubiquitous-language hazard.
4. **Status-tier mismatch between binding architecture ADRs.** The two load-bearing pillars of
   this cluster — ADR-0012 (async cadence) and ADR-0014 (state machines) — are still
   `status: proposed`, `binding: false`, "Needs Nico's review before acceptance," while everything
   downstream (ADR-0011, ADR-0019, ADR-0088, the league-week/transfer/watch-party FSMs) treats them
   as load-bearing fact. The whole cluster's FSM + cadence foundation is formally unratified.

---

## Per-ADR verdicts

### ADR-0019 — Service-ready Modular Monolith with DDD (verdict: weak; confidence: high)

The decision itself (one deployable, eleven contexts, network-transparent contracts, storage
isolation, no cross-context JOINs, `index.ts`-only imports) is sound and matches 2026 modular-monolith
best practice. The weakness is **staleness of the artefact**, not the architecture:

- §Decision: *"One deployable, **eleven** bounded contexts … eleven contexts live under
  `src/domain/<context>/`"* and the eleven-item list (Identity … Audit & Security). The live
  [[../10-Architecture/bounded-context-map]] §1 holds **nineteen**, and ADR-0089 proposes 28.
- §Decision rule 3 and §Compliance cite [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
  for outbox publishing — superseded by ADR-0028.
- The "## Future" extraction list still reads as the canonical extraction order, but
  bounded-context-map §5 has since elaborated it (CommercialPortfolio extraction priority etc.) — the
  ADR is silent on the FMX-32 additions.

Issues: binding ADR's count and outbox citation are both stale; an onboarding reader who trusts the
*ADR* (correctly, since it is `binding: true`) gets an eleven-context mental model.
Recommendation: a small **superseding ADR** (or, cleaner, fold into the ADR-0089 ratification) that
(a) restates the rule set count-agnostically ("the bounded-context-map is the single source of the
context catalog and count; this ADR owns the *style*, not the *count*"), and (b) redirects outbox
citations to ADR-0028. Do **not** silently edit ADR-0019. Confidence high.

### ADR-0014 — Explicit State Machines (verdict: weak; confidence: high)

Pattern is correct and universally relied on downstream (league-week, transfer, watch-party, match
FSMs; ADR-0011; ADR-0088). Weaknesses:

- Still `status: proposed` / `binding: false` / "Needs Nico's review before acceptance" (2026-05-16),
  yet it is treated as binding by every FSM doc and by ADR-0011/0088. The 2026-05-19 stack-revision
  banner explicitly says "**keep parked** … do not implement," which is now contradicted by ADR-0088
  (FMX-102) actively specifying a new sub-FSM under this pattern.
- Outbox citation is ADR-0013 (§Implementation, §Sources reference [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]),
  superseded by ADR-0028. The 2026-05-19 banner already amends substrate → Postgres but still names
  ADR-0013.
- §Future already anticipates "Cross-state-machine choreography (e.g. Watch Party deadlines feeding
  Match `lineup_lock_at`)" — which is exactly the unresolved race ADR-0088 §B later had to fix. The
  ADR foresaw the hazard but defined no invariant; ADR-0088 supplies it 13 months later.

Issues: parked-but-actively-extended status conflict; stale outbox ref; no choreography invariant.
Recommendation: promote ADR-0014 to `accepted` as part of the same ratification wave that lands
ADR-0088 (they are coupled), redirecting the outbox citation to ADR-0028 in the **new** promotion ADR,
not by editing 0014. Confidence high.

### ADR-0012 — Async Multiplayer Cadence Models (verdict: weak; confidence: medium)

Two-rule-set design (Fixed + Dynamic on one `LeagueWeek` FSM) is sound and matches the async-multiplayer
research. Weaknesses:

- Still `proposed`/`binding: false`/"keep parked," yet ADR-0011 lists "Quorum + countdown + auto-resolve
  timers" as server-authoritative fact and ADR-0088 builds the deadline-anchor rule *on top of* ADR-0012's
  "no mid-cycle mutation" invariant and even appends a draft amendment to it. The invariant is load-bearing
  but unratified.
- The ADR already carries an **embedded FMX-102 draft amendment** (the "Watch-party deadline reconciliation
  (draft — FMX-102)" section) — meaning the file is no longer purely the 2026-05-16 decision; it has been
  appended to in-place. This is acceptable under the project's amendment convention (clearly marked draft),
  but it means ADR-0012 + ADR-0088 must ratify together or the embedded amendment dangles.
- §Implementation "Trigger A (Fixed): scheduled cron-style timer" is in mild tension with the determinism
  posture (no wall-clock in the seeded engine, [[determinism-and-replay]]); cadence timers are real-world
  clock by design, but the ADR doesn't state the boundary between wall-clock scheduling and the seeded sim
  (ADR-0088 §Determinism later draws exactly that line: "deadlines never use wall-clock *in the engine*").

Recommendation: ratify ADR-0012 jointly with ADR-0088; in the promotion note, redirect to ADR-0028 and
state the wall-clock-scheduling-vs-seeded-engine boundary explicitly. Confidence medium (the design is fine;
the uncertainty is purely about ratification sequencing).

### ADR-0023 — Realtime Transport (verdict: sound; confidence: high)

`RealtimeTransport` interface + SSE MVP + Centrifugo upgrade path, with the explicit rule that clients
never treat SSE/Centrifugo delivery as durable (always reconcile against Notification/Postgres). This is
**confirmed current best practice (mid-2026)** by targeted research:

- SSE behind a swappable transport interface remains the mainstream baseline for server→client
  inbox/ticker/notification on an offline-first Node PWA; upgrade to WebSocket/Centrifugo when
  bidirectional/presence/recovery become real. WebTransport (HTTP/3) is *not* yet a mainstream
  replacement for this pattern — worth monitoring only for demanding multiplayer networking
  (Perplexity, 2026-06-08; sources: hpbn.co SSE, ably.com SSE topic, Shopify Engineering SSE streaming).
- Minor gap vs the global "pin exact versions" rule: ADR-0023 says "single Apache-2.0 Docker container"
  for Centrifugo but **pins no version**. Current latest stable is **Centrifugo v5.x** (v5.1.0 per the
  research pass); the planned-upgrade should carry a pinned version when it is actually scheduled. Not
  blocking at MVP (Centrifugo is deferred), but flag it on the upgrade ticket.
- One latent edge the ADR notes but understates: the HTTP/1.1 ~6-SSE-connection cap is "fine over HTTP/2
  behind the reverse proxy" — true, but the offline-first PWA must guarantee HTTP/2 at the Dokploy reverse
  proxy ([[../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]] territory). Worth a one-line crosscutting
  invariant rather than a buried negative-consequence.

Recommendation: keep as-is; add the Centrifugo version pin + HTTP/2-at-proxy invariant when the
upgrade is scheduled. Confidence high.

### ADR-0011 — Server-Authoritative Multiplayer (verdict: sound; confidence: high)

Strong, well-grounded ADR. Server-only authority for all multiplayer FSMs, hotseat one-way handoff,
AI-vs-AI hybrid server-sim with on-demand replay, encrypted saves, hard-reject offline conflict, idempotent
UUIDv7 commands. Consistent with the ground-truth constraints (offline-first; multiplayer post-MVP per
ADR-0020; LLM out of authoritative state). Minor issues only:

- Outbox citations are ADR-0013 (§Implementation, §Future, §Compliance) — superseded by ADR-0028. The ADR
  *does* correctly cite ADR-0027/0028 for the read-model projection in one place, so the staleness is
  partial/inconsistent within the same file.
- `binding: true` but `status: draft` in frontmatter while the body says "Accepted (2026-05-16)" — the
  status-field-vs-body mismatch recurs across the cluster (see cross-ADR issue) and should be reconciled at
  the next governance pass.
- The match-engine references (ADR-0003 historical, ADR-0049 proposed replacement, FMX-10 TS-vs-Rust spike)
  are correctly hedged; no determinism contradiction found.

Recommendation: no superseding ADR needed; sweep the ADR-0013→0028 citation in a governance housekeeping
pass (new note, not in-place edit of 0011 unless the project's amendment convention is used). Confidence high.

### ADR-0018 — Systemic Events and Player Lifecycle (verdict: weak; confidence: high)

Architecture (domain-owned systemic policies + `WorldEventDirector` orchestration, no second simulation
source of truth, RNG-stream discipline, narrative-as-projection, LLM out of authoritative state) is sound
and aligns with ADR-0030 and [[determinism-and-replay]]. The weakness is **dangling renumber references**:

- §1: *"Cross-context facts travel through commands, queries and domain events as required by **ADR-0010**."*
- §9: *"This ADR does not supersede **ADR-0010**, ADR-0013, D8 or D15."*

Both "ADR-0010" references were meant to point at the modular-monolith ADR, which was **renumbered to
ADR-0019** on merge (ADR-0019's own history banner documents this). The 0010 slot is now the *design-system*
ADR. So ADR-0018 currently cites the wrong ADR twice. Plus the standard ADR-0013→0028 outbox staleness and
"the accepted architecture already has **11** bounded contexts" (§Context) count drift.

Recommendation: a housekeeping/superseding note that (a) fixes the two ADR-0010→ADR-0019 references, (b)
redirects ADR-0013→ADR-0028, (c) drops the hardcoded "11". Low-risk, high-clarity. Confidence high.

### ADR-0089 — Bounded-context Portfolio Reconciliation (verdict: sound; confidence: medium)

Genuinely useful reconciliation: fixes the "nine ADRs each claiming to be the 20th" knot with a canonical
catalog + fixed ordinal key (D2=A) and six subdomain clusters (D3=A), landing 19→28. Decision-gate-clean
(`proposed`/`binding: false`, does not edit the map, awaits Nico). Grounding (Perplexity 2026-06-07:
"~28 BCs reasonable for a complex single-player + async game") is reasonable and matches DDD authority
(count is secondary to coupling/cognitive load). Issues are about *risk*, not correctness:

- 28 contexts is a very large surface for a pre-MVP, small-team, offline-first product. The ADR's own
  Negative section concedes this and leans entirely on "clusters + catalog + onboarding" as mitigation.
  The decision is defensible but the **D1 option B (collapse some to sub-aggregates)** deserves to stay
  genuinely live at ratify, not be treated as already-lost — several of the nine (e.g. Scouting vs Transfer,
  Statistics & Analytics projection-only vs a read-model module) are textbook merge candidates the ADR's own
  "standing review to merge co-changing pairs" anticipates.
- ADR-0089 reconciles ADR-0019 §5 ("no shared tables") and ADR-0027 as the architecture-test invariant, but
  does **not** flag that ADR-0019's own "eleven" count is now three steps stale — it should, since it is the
  natural place to retire that number.
- Ordinal-key design (D2=A) is sound and the right call for parallel apply-PRs.

Recommendation: ratify D2/D3 as proposed; keep D1 = A-vs-B genuinely open with the merge-review as a
first-class ongoing gate; have the ADR-0089 apply-PR also retire ADR-0019's hardcoded "eleven". Confidence
medium (the structural mechanism is sound; the 28-count itself is a judgement call that is Nico's to ratify).

### ADR-0088 — Async Escalation FSM + Watch-Party Deadline Source-of-Truth (verdict: sound; confidence: high)

The strongest-engineered ADR in the cluster. Two independent halves: (A) 5-stage Transfer escalation FSM
via hybrid pressure-accumulator + leaky-bucket per-stage-sticky decay + hysteresis + bounded seeded
`TransferRng` variance, with structural FINAL gate ("no strike from one offer"); (B) `broadcast_at` as the
single deadline anchor with pure `computeLockDeadlines`, resolved at schedule time so ADR-0012's
no-mid-cycle-mutation invariant holds without exception. Invariants ES1–ES5 / DL1–DL4 are crisp and
golden-trace-testable. Determinism story is consistent with the locked-9 RNG streams (TransferRng = stream
#7 per [[determinism-and-replay]] — verified), and it is the only cluster ADR that correctly redirects
ADR-0013→ADR-0028. Issues are minor:

- D4=B (seeded variance) is the project's repeated lean (FMX-92, FMX-102) and is well-bounded ("RNG can
  never move a stage by more than one step or reach `media_strike_threat` from a single event") — sound, but
  the **variance bounds themselves are deferred to FMX-52**; until then ES3's structural guarantee is proven
  but the *feel* is uncalibrated. Acceptable for a propose-only phase.
- Depends on ADR-0012 + ADR-0014 + the three FSM docs, all of which are still `proposed`/`parked`. ADR-0088
  is effectively un-ratifiable until those promote — a sequencing coupling worth making explicit on the
  ratify ticket (E8/FMX-64 close).
- Adds payload fields to `WatchPartyScheduled` and `MatchdayOpened` (event-carried state transfer, D7=A) —
  clean, but it is a contract-version bump on two already-ratified events; the ADR should note the
  `contract_version` discipline (ADR-0011 §Implementation requires version pinning) for these payload
  extensions. Currently implicit.

Recommendation: ratify jointly with ADR-0012/0014 promotion; make the contract-version bump on
`WatchPartyScheduled`/`MatchdayOpened` explicit. Confidence high.

---

## Cross-ADR issues (within C4)

1. **Context-count drift (high):** ADR-0019 "eleven" vs map "nineteen" vs ADR-0089 "28". The binding
   style-ADR (0019) is the stale one. Fix: ADR-0089 ratification retires the hardcoded count from 0019 and
   makes the map the sole count source.
2. **ADR-0013→0028 outbox citation rot (high):** ADR-0019, ADR-0014, ADR-0011, ADR-0018 and the
   bounded-context-map §3 all still cite the superseded ADR-0013. Only ADR-0088 redirects. Fix: one
   housekeeping note redirecting all outbox citations to ADR-0028.
3. **ADR-0010→0019 renumber residue (medium):** ADR-0018 cites "ADR-0010" twice intending the
   modular-monolith ADR (now 0019). The 0010 slot is the design-system ADR — the references are now wrong.
4. **Status-field vs body mismatch (medium):** ADR-0011/0019/0023 carry body text "Accepted" while
   frontmatter `status` reads `draft`; ADR-0012/0014 are `proposed`/`parked` yet treated as binding fact by
   downstream ADRs and FSM docs. The cluster's FSM + cadence foundation is formally unratified while
   everything is built on it. Fix: a single ratification wave (0012 + 0014 + 0088 + 0089) plus a frontmatter
   status reconciliation.
5. **Choreography invariant gap closed late (low):** ADR-0014 §Future foresaw cross-FSM choreography
   (watch-party deadlines feeding match lock) but defined no invariant; the race was only fixed by ADR-0088
   §B 13 months later. Lesson, not an active defect — but argues for promoting 0014 with the DL invariants
   referenced.

## Targeted external research (mid-2026)

- **Realtime transport (ADR-0023):** SSE behind a swappable `RealtimeTransport` interface is still sound
  baseline best practice for server→client inbox/ticker/notification on an offline-first Node PWA; upgrade
  to WebSocket/Centrifugo for bidirectional/presence/recovery; WebTransport/HTTP-3 is *not* yet a mainstream
  replacement for this pattern. Centrifugo remains the credible self-hosted OSS default (latest stable
  **v5.x / v5.1.0**); ADR-0023 pins no version (minor gap vs the project's exact-pin rule — flag on the
  upgrade ticket). Sources: Perplexity 2026-06-08 (hpbn.co/server-sent-events, ably.com SSE topic, Shopify
  Engineering SSE streaming, Centrifugo docs).
- **Escalation FSM (ADR-0088):** leaky-bucket + Schmitt-trigger hysteresis + pressure-accumulator is a
  standard, well-grounded construction for anti-flapping staged escalation; already sourced in
  [[fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]] (five Perplexity passes). No
  contradiction found; no additional lookup warranted.

## Proposed decisions (working titles — numbers assigned centrally)

1. **Governance housekeeping ADR (superseding-class): "Reference-integrity sweep for cluster-C4 ADRs"** —
   redirect all ADR-0013→ADR-0028 outbox citations; fix ADR-0018's two ADR-0010→ADR-0019 references; retire
   ADR-0019's hardcoded "eleven" (defer count to the map); reconcile status-field-vs-body. Supersedes none
   outright; amends-by-new-ADR. Confidence high.
2. **Joint ratification wave: "Promote async-coordination foundation (ADR-0012 + ADR-0014) and land
   ADR-0088 + ADR-0089"** — these four are mutually load-bearing and should ratify together so no downstream
   ADR rests on a `parked` dependency. Confidence high.
3. **(only if Nico wants it) "Bounded-context portfolio trim review"** — keep ADR-0089 D1 option B alive as a
   standing merge gate (Scouting/Transfer, Statistics-Analytics-as-read-model) rather than accepting 28 as
   final. Confidence medium; this is a scope judgement for Nico, not an engineering defect.
