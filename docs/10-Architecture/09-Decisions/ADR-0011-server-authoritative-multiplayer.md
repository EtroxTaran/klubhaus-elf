---
title: ADR-0011 Server-Authoritative Multiplayer
status: draft
tags: [adr, architecture, multiplayer, security]
created: 2026-05-16
updated: 2026-05-18
type: adr
binding: false
accepted_at: 2026-05-16
related:
  - [[ADR-0003-match-engine]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0013-transactional-outbox]]
  - [[ADR-0014-state-machines]]
  - [[ADR-0015-spectator-snapshot-streaming]]
  - [[ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[../state-machines/league-week]]
  - [[../state-machines/match]]
  - [[../../60-Research/match-engine-runtime-strategy]]
  - [[../../60-Research/raw-perplexity/raw-architecture]]
---

# ADR-0011: Server-Authoritative Multiplayer

> **REOPENED on 2026-05-27:** This ADR is `draft` again. Any `accepted`, `binding`, or `locked` wording below is historical pre-reopen context until Nico re-ratifies it.

## Status

Accepted (2026-05-16, gap B2 of [[../../95-Archive/gap-reports/wave-3-gap-analysis]]).
Confirmed by [[ADR-0020-hybrid-online-mvp-offline-ready]]: multiplayer is
post-MVP and remains server-authoritative; offline multiplayer effects are never
finalised locally.

## Context

In a private async multiplayer group, *clients cannot be trusted* to
agree on league state. Weekly progression, transfer deadlines, match
results and watch-party scheduling must be decided once, by an
authoritative source.

Sources from
[[../../60-Research/raw-perplexity/raw-architecture]] §1 + §9 emphasise
that anything that is "multiplayer truth" must be produced or authorised
by the server. Anti-cheat best practice and league fairness both require
this.

Gap B2 Q&A (2026-05-16) added four edge-case decisions on top of the
core principle, and a Perplexity research pass settled the AI vs AI
match policy. Those decisions are now part of this ADR.

## Decision

The server is the **only** authority for multiplayer state:

- Week state machine ([[../state-machines/league-week]]).
- Transfer state machine ([[../state-machines/transfer]]).
- Watch-party state machine ([[../state-machines/watch-party]]).
- Match state machine + result ([[../state-machines/match]]).
- Quorum + countdown + auto-resolve timers.

Clients **only** send commands. Server validates against current state
and decides the next state. Drafts may be stored locally, but no multiplayer
effect is final until the server confirms it.

### Operating modes

| Mode | Authority | Network requirement |
|---|---|---|
| Singleplayer | Local client | None |
| Hotseat / pass-and-play (one device, N humans) | Local client | None |
| Private async multiplayer group | Server | Required for any action's *effect* |
| Hotseat save promoted into async MP group | Server (after one-way handoff) | Required at promotion time + thereafter |

### Hotseat handoff (gap B2 outcome)

Hotseat saves are local-authoritative but a hotseat save **can be
promoted** into an async MP group via a one-way handoff:

1. User exports the hotseat save (encrypted JSON envelope, see
   [[ADR-0005-save-format]]).
2. User uploads it to an MP group's "promote from hotseat" flow.
3. Server validates: decrypts with the user's account key, runs schema
   validation, runs an integrity check (event-log replay against the
   stored seed if present, or a checksum if event log is absent).
4. On success, the save's canonical state becomes the server's truth for
   that user's club inside the MP group.
5. From that point forward, the hotseat save is **read-only on the
   device** for the promoted club (the server is authority).
6. The handoff is one-way - there is no "demote MP back to hotseat".

This unlocks a real product use case (play a season at home with a
friend on one device, then promote it into an async group) without
weakening the trust model: the server runs the integrity check before
accepting the save.

Detail: Wave 3 gap D12 (`R2-12 multiplayer-feasibility`).

### AI vs AI match policy (gap B2 outcome)

In an async MP group, every match-day produces *both* matches involving
humans and matches between two AI clubs. The policy is the **hybrid
server-sim with on-demand replay** pattern (Perplexity research,
2026-05-16):

| Match type | Engine profile | Persisted |
|---|---|---|
| Human ↔ Human | `competitive-full` | Full event log + RNG seed + lineups + result |
| Human ↔ AI | `competitive-full` | Full event log + RNG seed + lineups + result |
| AI ↔ AI | `background-detailed` or `background-fast` by fixture relevance | RNG seed + lineups + tactics + quality profile + summary (result + key stats); **no event log by default** |

The engine is deterministic given seed + lineups + tactics (per
[[ADR-0003-match-engine]] and Wave 3 gap D8). Therefore an AI vs AI
match can be **re-simulated on demand** to produce a full event log
whenever a user wants to watch the match (e.g. via a watch-party
proposal in [[ADR-0015-spectator-snapshot-streaming]]).

Rationale:

- CPU is not a constraint at our scale (~50 leagues × 11 fixtures = ~30
  s of CPU per week on a CX22/CX32-class Hetzner VPS).
- Storage is meaningfully reduced (~50 % vs storing full logs for all
  matches).
- Trust model stays intact (no client offload).
- AI vs AI matches use the **same engine** as human matches, preventing
  "meta divergence" where teams optimised for the full engine would
  perform differently in AI-AI fixtures.
- Anti-cheat: stored seed + lineups + tactics + engine version allow
  deterministic audit re-runs.

Match worker fast path: when an AI vs AI match is dispatched, the
worker still runs the full engine but emits only the summary stream by
default. Promotion to "full log" is triggered by either (a) a
watch-party referencing this match, or (b) an admin audit request.

Match worker version pinning: every match record stores
`engine_version`. Re-sim must use the same version. Engine upgrades
that change determinism require a forward migration of stored matches
(re-sim and re-store seeds when needed).

Runtime note: MVP multiplayer simulation uses the TypeScript
`packages/match-engine` implementation from [[ADR-0003-match-engine]]. A
future extracted Rust Match Worker may become authoritative only after the
polyglot extraction gate in
[[../../60-Research/match-engine-runtime-strategy]] passes. This keeps the
AI-vs-AI policy from drifting into a separate balance model.

### Save integrity (gap B2 outcome)

Saves are **encrypted at rest** on the client (IndexedDB / Dexie) and
in export envelopes. Tampering breaks the save entirely. This applies
to singleplayer, hotseat and MP-local-cache alike.

- Encryption: AES-GCM 256 via Web Crypto API.
- Key derivation: PBKDF2 from the user's account secret + device salt
  (singleplayer) or from the account secret (hotseat handoff
  candidates).
- Integrity check: AEAD tag of AES-GCM.
- Export envelope: encrypted payload + ciphertext-authenticated header
  with `engine_version`, `save_version`, `created_at`.

Detail and migration policy: Wave 3 gap A5 (rewrites
[[ADR-0005-save-format]]) and gap E18 (IndexedDB schema design).

### Offline conflict policy (gap B2 outcome)

When a client replays a queued offline command against server state
that has moved on, the server **hard-rejects** with `rejected_with_reason`
and surfaces the new state. The client shows the conflict and prompts
the user to redo the action. No auto-rebase at MVP.

Reasons surfaced:

- `state_changed` - the target entity moved beyond the precondition.
- `resource_unavailable` - the referenced player / slot / member is no
  longer eligible.
- `deadline_passed` - the action's window expired.
- `forbidden` - authorisation changed (membership revoked, etc.).

The client UI lists the queued command, the reason, the new state, and
a "redo" affordance preloaded with what the user originally intended.

A per-action policy table (auto-rebase for some commands) is **out of
scope for MVP** - revisit when we have real user data on conflict
frequency.

## Consequences

### Positive

- Fairness: no client can fake a result, a quorum or a transfer.
- Determinism: replays match across clients (re-sim from seed always
  works).
- Audit trail is meaningful via the transactional outbox.
- Watch-party spectators see a consistent feed.
- Hotseat → async promotion is a real product feature with a clear
  integrity story.
- Encrypted saves protect users on shared devices and gate the hotseat
  handoff (server can trust uploaded saves' contents).

### Negative

- Network connectivity required for any multiplayer action's *effect*.
  Drafts can be local; final effect waits for server confirmation.
- Server CPU cost for every multiplayer match (acceptable at MVP scale
  per research).
- Save encryption adds complexity: lost passphrase = lost save (mitigated
  by tying KDF to the account secret rather than a separate passphrase
  at MVP).
- Offline-conflict hard-reject creates UX friction the first time it
  happens to a player; the redo affordance must be excellent.

### Future

- Service extraction (match worker, scheduler worker, spectator service)
  is open per [[ADR-0019-modular-monolith-ddd]] §Future.
- Offline-first stays viable because drafts persist locally and replay
  on reconnect (per [[ADR-0002-offline-first]] + [[ADR-0013-transactional-outbox]]).
- AI vs AI summary storage opens a Phase-2 option of selectively keeping
  full logs for "marquee" AI vs AI fixtures (e.g. AI title decider).

## Implementation

- Commands sent from client are **idempotent**: every command carries a
  client-generated request ID (UUIDv7). Server stores recent request IDs
  in the outbox to detect replays.
- Server-issued state transitions write events through the transactional
  outbox ([[ADR-0013-transactional-outbox]]).
- Read models project to Postgres tables ([[ADR-0027-postgres-data-model]])
  that clients read directly via the public query layer of the owning
  context (per [[ADR-0019-modular-monolith-ddd]] §6); an optional
  SurrealDB live-graph projection may sit behind the same query layer
  post-launch ([[ADR-0021-revised-tech-stack]], [[ADR-0043-notification-and-messaging-platform]]).
- Match worker emits a *summary stream* for AI vs AI matches (result +
  key stats only) and a *full stream* for human-involving matches.
- Re-sim service exposes a `replayMatch(matchId)` command on the Match
  context that loads (seed, lineups, tactics, engine_version), runs the
  full engine, and stores the full event log against the existing match
  record.

## Compliance

The following compliance rules apply to all server + client code:

- No client may invoke a state transition directly; clients call
  commands, server decides.
- No client may modify another client's outbox.
- Multiplayer matches MUST be simulated server-side.
- Saves on disk MUST be encrypted (AES-GCM 256 via Web Crypto, key
  derived from account secret + device salt).
- Hotseat saves uploaded for promotion MUST pass server validation
  (schema, integrity, optional event-log replay) before becoming MP
  truth.
- Offline-replayed commands that conflict with current state MUST be
  rejected with a typed reason; auto-rebase is forbidden at MVP.

CI enforcement:

- Lint rule blocks direct state-machine transitions from client code.
- Test rule requires every command type to have an idempotency test
  (replay with same request ID is a no-op).

## Sources

- [[../../60-Research/raw-perplexity/raw-architecture]] §1, §9, §16.
- Mirror Networking cheat-protection-stages.
- HeroicLabs forum on authoritative RPG server architecture.
- Perplexity research, 2026-05-16 (gap B2): "Async multiplayer football
  managers - server vs client AI-match simulation". Recommendation:
  hybrid server-sim with on-demand re-simulation, ~50 % storage
  reduction at zero trust cost.
- Wave 3 gap B2 Q&A with Nico (2026-05-16): hotseat handoff, AI-match
  hybrid, encrypted saves, hard-reject offline conflict.
## Related

- [[ADR-0003-match-engine]]
- [[ADR-0019-modular-monolith-ddd]]
- [[ADR-0013-transactional-outbox]]
- [[ADR-0014-state-machines]]
- [[ADR-0015-spectator-snapshot-streaming]]
- [[ADR-0020-hybrid-online-mvp-offline-ready]]
- [[../state-machines/league-week]]
- [[../state-machines/match]]
- [[../../60-Research/match-engine-runtime-strategy]]
- [[../../60-Research/raw-perplexity/raw-architecture]]
