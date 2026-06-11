---
title: ADR-0099 Spectator / watch-party streaming over the committed event log (supersedes ADR-0015)
status: accepted
tags: [adr, architecture, watch-party, spectator, streaming, replay, event-sourcing, determinism, offline-first, online-only, fmx-105]
created: 2026-06-08
updated: 2026-06-11
type: adr
binding: false
supersedes: ADR-0015-spectator-snapshot-streaming
superseded_by:
related:
  - [[ADR-0015-spectator-snapshot-streaming]]
  - [[ADR-0026-match-frame-contract]]
  - [[ADR-0049-swappable-spatial-event-match-engine]]
  - [[ADR-0087-live-match-intervention-buffer-and-pause-vote]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[ADR-0011-server-authoritative-multiplayer]]
  - [[ADR-0023-realtime-transport]]
  - [[ADR-0024-match-renderer-abstraction]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../state-machines/watch-party]]
  - [[../state-machines/match]]
  - [[../../50-Game-Design/watch-party-and-conference]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../60-Research/async-multiplayer-research]]
  - [[../../00-Index/Open-Decisions-Dossier]]
  - [[../../00-Index/Decision-Log]]
---

# ADR-0099: Spectator / watch-party streaming over the committed event log (supersedes ADR-0015)

## Status

accepted

> Adopted `accepted` 2026-06-08 — authored and ratified in the same sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`draft` / `binding: false`.** Authored 2026-06-08 from the open-decisions sweep. This ADR
> **supersedes [[ADR-0015-spectator-snapshot-streaming]]** by re-expressing watch-party / spectator
> streaming purely in committed-event-log terms, removing the **"snapshot per virtual minute"
> persisted-snapshot** wording that contradicts the **binding** [[ADR-0026-match-frame-contract]]
> (rule 4: `MatchFrame` is derived-on-demand, **never persisted**) and
> [[../../60-Research/determinism-and-replay]] §3.4/§3.5 (mid-match join = replay/resim from the event
> log; **no periodic snapshots**). It **does not edit ADR-0015** (supersession is expressed only here,
> via `Supersedes:` frontmatter + this body). It flips **no** context to accepted and proposes **no**
> `bounded-context-map` change (a contract between the already-ratified **Match** and **Watch Party**
> contexts). **Awaiting Nico ratify.**

## Date

- Proposed: 2026-06-08 (open-decisions sweep)

## Context

[[ADR-0015-spectator-snapshot-streaming]] (`proposed`, 2026-05-16) chose a **separate spectator
service** that consumes the match worker's stream and broadcasts to viewers with a configurable
**delay** — a sound, well-grounded transport/scaling shape. But its **Implementation** section locks a
specific substrate that has since been overtaken by binding decisions:

1. **Persisted-snapshot contradiction.** ADR-0015 says the match worker "emits a **snapshot per
   virtual minute** … Snapshot + event log **persisted to the match record**." This directly
   contradicts:
   - **[[ADR-0026-match-frame-contract]] rule 4 (binding):** "`MatchFrame` is derived on demand,
     **never persisted** … never stored, never sent over `postMessage`, never part of the save
     envelope. Resim-from-kickoff (~50 ms) remains the only replay model." ADR-0026 rule 8 further
     fixes interventions as **resim-from-new-inputs**, never frame mutation.
   - **[[../../60-Research/determinism-and-replay]] §3.5:** "We do **not** persist intermediate match
     state snapshots." And **§3.4 (mid-match join)** already specifies the replacement: for a live
     human match the server "replays the existing **event log** up to the current minute, then
     continues streaming new events"; for AI-vs-AI it **resims from `(seed, lineups, tactics,
     engineVersion)`** (~50 ms) and streams the resulting log. The event-log streaming model ADR-0015
     needs **already exists** — ADR-0015 simply names the wrong artefact.
   - **[[ADR-0049-swappable-spatial-event-match-engine]]:** "Realtime streams publish **committed
     event/log/spatial packets with replay cursors**." This is the canonical substrate; ADR-0049's
     `MatchEventLog` (append-only canonical events) + `SpatialSample` (normalized pitch state) are the
     only things a spectator feed should carry, and `MatchFrame` is the renderer-side projection of
     them (ADR-0026).

2. **Status drift.** ADR-0015's own file says **"Proposed (2026-05-16). Needs Nico's review."** but
   [[../../00-Index/Decision-Log]] line 132 records it as **"Post-MVP social layer — keep behind
   watch-party gate."** The two states disagree; there is no single current truth for this decision.

3. **Offline-first boundary unstated.** ADR-0015 predates [[ADR-0090-offline-sync-scope-and-conflict-strategy]].
   It never says whether spectator/watch-party streaming is an **offline-first** capability or an
   **online-only** one. Per ADR-0090, core game state is offline-capable behind the command-queue seam,
   but **multi-writer watch-party collaborative surfaces are confined to a separate (online) sync
   channel**; per [[ADR-0011-server-authoritative-multiplayer]] live spectating of *another* manager's
   match is inherently a connected activity. The boundary must be stated, not implied.

4. **A live dependant already assumes a coherent feed.** [[ADR-0087-live-match-intervention-buffer-and-pause-vote]]
   (`proposed`, FMX-101) §7 routes "Coach / Spectator view delay" to **"streaming (ADR-0015)"** and its
   pause-vote saga drives a shared spectator experience. ADR-0087's pause semantics (Design 1: "stop
   advancing the simulation"; `PauseMatch`/`ResumeMatch` fed at the same **command-stream positions**
   on replay, never by real-time gap) **only make sense over an event-log feed**, not over persisted
   per-minute snapshots. ADR-0015's substrate must be coherent **before/with** ADR-0087 ratifies or the
   pause-vote rests on a contradicted base.

The transport/scaling shape ADR-0015 chose (separate spectator service, delay-at-delivery, replay "for
free", conference = many feeds, SSE-now/Centrifugo-planned per [[ADR-0023-realtime-transport]]) is
**preserved**. Only the **persisted-snapshot substrate** and the **unstated status/offline boundary**
are in scope here.

## Options considered

### D1 — Spectator/watch-party streaming substrate

| Option | Description | Trade-off |
|---|---|---|
| **A. Event-log-only streaming with replay cursors (RECOMMENDED)** | The spectator service consumes the **committed event/spatial log + replay cursor** ([[ADR-0049-swappable-spatial-event-match-engine]]); mid-match join = replay/resim from the event log per [[../../60-Research/determinism-and-replay]] §3.4; per-viewer **delay applied at delivery** (unchanged from ADR-0015); **no persisted snapshots** (`MatchFrame` stays derived-on-demand, ADR-0026 rule 4). Also: **align the status** with the Decision-Log ("post-MVP, behind the watch-party gate"), and **declare it online-only** within [[ADR-0090-offline-sync-scope-and-conflict-strategy]]'s narrow sync scope. | **Recommended.** Removes the binding contradiction outright; reuses the already-specified §3.4 join path; gives ADR-0087 a coherent substrate; aligns the two status records; states the offline boundary. Cost: mid-match join is resim/replay-from-cursor, not snapshot-seek (see Risks). |
| B. Non-authoritative delivery snapshot-cache | Keep a snapshot/keyframe **cache as a server-side delivery optimisation ONLY** — explicitly **non-authoritative**, never the replay source, never persisted to the match record, rebuilt from the event log. | Could cut mid-match join cost for very long matches, but **re-introduces the exact "snapshot" artefact** ADR-0026 removed and risks the confusion drifting back into "the snapshot is the truth." Only justified if A's join cost proves unacceptable on device (open question). |
| C. Park ADR-0015 superseded, no replacement | Mark ADR-0015 superseded and defer any spec until watch-party is scheduled for build. | Cleans the contradiction but **leaves ADR-0087's spectator substrate dangling** — its §7 "streaming (ADR-0015)" pointer and pause-vote feed would reference a void. Rejected: ADR-0087 needs a coherent base now. |

### D2 — Status reconciliation

- **A. Single current status = "post-MVP, behind the watch-party gate" (RECOMMENDED).** Adopt the
  Decision-Log's disposition as the one truth and record it here; ADR-0015's `proposed`/"needs review"
  wording is what this supersession resolves. · B. Re-open as active `proposed`. · C. Leave the drift.

### D3 — Offline-first vs online-only boundary

- **A. Online-only, within ADR-0090's narrow sync scope (RECOMMENDED).** Live spectating/watch-party of
  a match is a **connected** activity ([[ADR-0011-server-authoritative-multiplayer]]); the collaborative
  overlay (chat/markers) is the ADR-0090 watch-party CRDT channel; **single-player offline replay** of
  one's *own* completed matches stays the separate, offline-capable resim-from-log path (ADR-0026/§3.5),
  not a spectator-service concern. · B. Leave unstated (status quo). · C. Attempt offline live
  spectating (contradicts server-authoritative live matches).

## Decision (proposed)

Propose, awaiting Nico: **D1 = A, D2 = A, D3 = A.**

Re-express spectator / watch-party streaming **purely in committed-event-log terms**:

1. **Substrate (D1 = A).** The spectator service consumes the **committed `MatchEventLog` +
   `SpatialSample` packets with replay cursors** ([[ADR-0049-swappable-spatial-event-match-engine]]).
   **No snapshots are persisted or streamed.** `MatchFrame` remains a **derived-on-demand** projection
   built renderer-side from the log via the `MatchWorldStateTracker` ([[ADR-0026-match-frame-contract]]
   rules 4–5). **Mid-match join** uses the [[../../60-Research/determinism-and-replay]] §3.4 path:
   replay the committed log up to the current cursor (live human match) or resim from
   `(seed, lineups, tactics, engineVersion)` (~50 ms; AI-vs-AI), then stream forward. **Per-viewer
   delay is applied at delivery time** (ADR-0015's neutralise-coaching-edge intent preserved).
   Transport is **SSE-now / Centrifugo-planned** ([[ADR-0023-realtime-transport]]); a **non-authoritative,
   rebuilt-from-log** delivery cache (D1 = B) is **not** adopted at MVP and is held open only if A's
   join cost proves unacceptable (Open question).
2. **Status (D2 = A).** The single current status is **"post-MVP social layer, behind the watch-party
   gate"** (adopts the Decision-Log disposition; resolves the file-vs-log drift).
3. **Boundary (D3 = A).** Spectator/watch-party **live streaming is online-only**, within
   [[ADR-0090-offline-sync-scope-and-conflict-strategy]]'s narrow sync scope; the collaborative overlay
   is the ADR-0090 watch-party CRDT channel; **offline replay of one's own completed matches** is the
   separate resim-from-log path, not a spectator-service feature.
4. **Sequencing.** Land **before or with** [[ADR-0087-live-match-intervention-buffer-and-pause-vote]]
   ratification so ADR-0087's §7 "streaming (ADR-0015)" pointer and pause-vote feed reference a coherent
   event-log substrate (re-point to ADR-0099 on ratify).

## Invariants

- **SP1** The spectator feed carries only **committed** `MatchEventLog` + `SpatialSample` packets and
  replay cursors; it never carries or persists a `MatchFrame` or any intermediate match-state snapshot
  (ADR-0026 rule 4, determinism §3.5).
- **SP2** Mid-match join is **replay/resim from the event log** to the current cursor, then live forward
  (determinism §3.4); no snapshot-seek.
- **SP3** Per-viewer delay is a **delivery-time** transform; it never enters the seeded engine and never
  alters event ordering (preserves ADR-0087 PV7 / `match.md §6`: no wall-clock in the engine).
- **SP4** The match worker MUST NOT serve spectators directly (ADR-0015 Compliance preserved); all
  viewers attach through the spectator service.
- **SP5** Live spectating/watch-party is **online-only**; offline = resim-replay of one's own completed
  matches only.
- **SP6** Replay "for free" still holds because the **committed event log already is** the replay record
  (ADR-0049 `ReplayRecord`); no extra snapshot store is needed.

## Consequences

**Positive.**

- Removes the **persisted-snapshot contradiction** with binding ADR-0026 + determinism §3.5; one
  coherent substrate (committed event/spatial log + cursors) across engine, replay, ticker and
  spectator (ADR-0049).
- Gives [[ADR-0087-live-match-intervention-buffer-and-pause-vote]] a **coherent spectator substrate**;
  its pause-at-stream-position semantics now rest on an event-log feed as they assume.
- **Aligns the two status records** (file vs Decision-Log) on one truth.
- **Clarifies the online-only boundary** under ADR-0090; keeps offline replay distinct and intact.
- Preserves everything still valid in ADR-0015 (separate spectator service, delivery-side delay,
  conference = many feeds, SSE-now/Centrifugo-planned).

**Negative / constraints.**

- Mid-match join cost is **resim/replay-from-cursor**, not O(1) snapshot-seek; must be validated as
  acceptable on device for long/late joins (Risks; determinism §3.4 estimates ~50 ms resim + O(events)
  replay bytes — promising but unmeasured on the real engine, which is still a spike per ADR-0049).
- Delivery-side **delay buffering** needs sizing (buffer depth vs the 15–60 s delay window).
- If A's join cost is later shown insufficient, a **non-authoritative** delivery cache (D1 = B) would
  have to be introduced carefully so it never drifts back into "the snapshot is the truth."

## Risks

- **R1 — Mid-match join cost.** Resim-from-`(seed,…)` (~50 ms) + log-replay to cursor must stay within
  an acceptable join latency for late spectators of long matches; only measurable on a running engine
  build (ADR-0049 spike). Mitigation: the D1 = B non-authoritative cache stays as a held-open fallback.
- **R2 — Delivery delay buffer sizing.** The per-viewer delay buffer (ADR-0015's anti-coaching-edge
  window) must be sized against memory/latency; unvalidated until a build exists.
- **R3 — Sequencing.** If ADR-0087 ratifies *before* this, its §7 pointer briefly references the
  contradicted ADR-0015 substrate; mitigated by landing ADR-0099 first/with it.

## Open questions

- Is a **non-authoritative delivery cache (D1 = B)** needed for mid-match-join performance, or is **pure
  event-log replay/resim (D1 = A)** sufficient? — answerable only with on-device measurement against the
  real engine (ADR-0049 spike); A is the default until B is shown necessary.
- Exact **delivery-side delay buffer depth** and the canonical delay window (15–60 s per ADR-0015) →
  defer to build-time tuning (FMX-52 territory).

## Supersedes

[[ADR-0015-spectator-snapshot-streaming]] — superseded by re-expressing its watch-party/spectator
streaming purely in committed-event-log terms (no persisted snapshots), aligning its status, and stating
its offline boundary. **ADR-0015 is not edited by this ADR** (supersession is expressed only here, via
`Supersedes:` frontmatter + this body); on ratify, ADR-0015's `superseded_by` is set to `ADR-0099` in
its own apply-PR per the supersede-not-overwrite rule, and the Decision-Log row for ADR-0015 points
here. The valid parts of ADR-0015 (separate spectator service, delivery-side delay, conference, transport
amendment) are carried forward above.

## Related Docs

- [[ADR-0015-spectator-snapshot-streaming]] — superseded; transport/scaling shape carried forward.
- [[ADR-0026-match-frame-contract]] — **binding**; rule 4 (frame derived-never-persisted) is the
  contradiction this ADR resolves.
- [[ADR-0049-swappable-spatial-event-match-engine]] — committed event/spatial log + replay cursors =
  the canonical spectator substrate; `MatchEventLog` / `SpatialSample` / `ReplayRecord`.
- [[ADR-0087-live-match-intervention-buffer-and-pause-vote]] — dependant; gets a coherent spectator feed.
- [[ADR-0090-offline-sync-scope-and-conflict-strategy]] — narrow sync scope; online-only boundary +
  watch-party CRDT overlay channel.
- [[ADR-0011-server-authoritative-multiplayer]] — live matches are server-authoritative (online).
- [[ADR-0023-realtime-transport]] — SSE-now / Centrifugo-planned.
- [[ADR-0024-match-renderer-abstraction]] — `MatchFrame` is a renderer-side projection.
- [[../../60-Research/determinism-and-replay]] — §3.4 (mid-match join) / §3.5 (no periodic snapshots).
- [[../../60-Research/async-multiplayer-research]] — original spectator-delay grounding (ADR-0015 §5-§6).
- [[../state-machines/watch-party]] · [[../state-machines/match]] · [[../../50-Game-Design/watch-party-and-conference]].
- [[../../00-Index/Decision-Log]] — ADR-0015 row (status drift resolved here).
- [[../../00-Index/Open-Decisions-Dossier]] — consolidated open-decision Q&A.
