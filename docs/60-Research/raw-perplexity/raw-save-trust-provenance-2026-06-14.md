---
title: Raw Perplexity - Save Trust and Provenance
status: raw
tags: [research, raw, perplexity, security, save-format, save-trust, provenance, hall-of-fame, leaderboards, fmx-184]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-184
related:
  - [[../command-signing-save-trust-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
  - [[../../40-Execution/fmx-184-command-signing-save-trust-decision-queue-2026-06-14]]
---

# Raw Perplexity - Save Trust and Provenance

## Capture metadata

- Captured: 2026-06-14
- Tool: Perplexity Sonar via MCP
- Purpose: FMX-184 save provenance, trust-level and eligibility-gate research.
- Handling: Punctuation normalized to ASCII for vault consistency. This is raw
  research input, not authoritative implementation guidance.

## Prompt

Research save-file provenance and trust-level design for an offline-capable
football manager game that later supports leaderboards, Hall of Fame, async
multiplayer, import/export, and optional cloud sync.

Compare:

- trust_level enum;
- server HMAC/signature;
- command-log Merkle root;
- engine bundle hash;
- signed device snapshot;
- imported/unverified states;
- eligibility gates.

Include real-world security provenance/tamper-evidence best practices and game
precedent such as Ironman/achievement eligibility, modified worlds/saves, and
server-verified competitive records. Give a clear MVP recommendation and
deferred options.

## Raw answer capture

Perplexity recommended a provenance model that lets FMX remain fully playable
offline while separating local play from competitive/public eligibility.

It said each save/run should answer four questions:

1. Where did this save come from?
2. Was the game logic trusted?
3. Was the timeline unbroken?
4. Is this run eligible for competitive features?

### Proposed trust and eligibility shape

Perplexity proposed an explicit trust enum, with examples such as:

```ts
enum TrustLevel {
  DEV,
  LOCAL_UNTRUSTED,
  LOCAL_TRUSTED,
  SERVER_VERIFIED,
  IMPORTED
}
```

It recommended derived eligibility as a separate policy result rather than a
user-settable save claim:

```ts
enum Eligibility {
  COMPETITIVE,
  CASUAL_ONLY,
  VIEW_ONLY
}
```

The answer recommended permanent downgrade rules: once a run uses debug tools,
unverified import, branch rewind or competition-affecting mods, it should not
return to public competitive eligibility.

### Server HMAC or signature

Perplexity recommended that, when online, the server bind a provenance record to
the run:

- user/account;
- run/save ID;
- command-log Merkle root or hash-chain head;
- engine bundle hash;
- data/content hash;
- competitive flags;
- issued time and key ID.

It presented HMAC/signature as tamper-evidence and later verification evidence,
not as a way to stop offline tampering by itself.

### Command-log Merkle root

Perplexity recommended maintaining a root over command/timeline history:

```text
h0 = H(genesis_state)
h(i+1) = H(h(i) || command(i) || reduced_state_summary(i))
```

It said the server can store roots at milestones and require matching roots for
Hall of Fame, leaderboards or async multiplayer submissions. For MVP it said a
hash chain can be enough; full Merkle subproofs and log-slice challenge flows
can be deferred.

### Engine bundle hash

Perplexity recommended recording an engine/content hash in save metadata and
letting the server treat only approved hashes as eligible. The engine hash is a
provenance signal, not a client-hardening guarantee, because browser code can
still be tampered locally.

### Imported states

Perplexity recommended that every imported file starts as imported/unverified.
If the import carries a valid server provenance record and the server can match
the root/hash evidence to a previous record, it may be promoted server-side.
Otherwise it remains playable locally but ineligible for public competitive
surfaces.

### Game precedent

Perplexity referenced common Ironman/achievement and modified-world behavior:

- Ironman/hardcore modes gate achievements or ladders.
- Modified/debug/console usage permanently disables achievements in many games.
- Competitive records are usually server-verified.

The specific citations Perplexity returned for game precedent were weak or
secondary. The synthesis therefore uses targeted source checks, especially the
Paradox Ironman help article and Minecraft Wiki capture, and labels game
precedent as policy precedent rather than cryptographic authority.

### MVP recommendation

Perplexity recommended an MVP save/run metadata shape:

```json
{
  "run_id": "uuid",
  "user_id": "local user or anon",
  "created_at": "...",
  "trust_level": "LOCAL_TRUSTED|LOCAL_UNTRUSTED|IMPORTED|SERVER_VERIFIED",
  "eligibility": "COMPETITIVE|CASUAL_ONLY|VIEW_ONLY",
  "engine_bundle_hash": "sha256...",
  "db_hash": "sha256...",
  "merkle_root": "sha256...",
  "flags": {
    "has_mods_affecting_competition": false,
    "used_debug_features": false,
    "timeline_branched": false,
    "imported_from_unverified": false
  },
  "server_provenance": {
    "last_seen_at": "...",
    "hmac_or_signature": "base64...",
    "server_merkle_root": "sha256..."
  }
}
```

It recommended these flows:

- official local saves can be locally playable and marked local-only/local
  trusted;
- imports are never client-promoted to competitive;
- cloud sync returns a server provenance record over the current root/hash
  evidence;
- public Hall of Fame, leaderboards and async multiplayer accept only
  server-verified, eligible histories;
- conflicting roots or impossible stats downgrade the run to casual-only for
  public surfaces.

### Deferred options

Perplexity recommended deferring:

- richer Merkle trees and server-requested log slices;
- device/app attestation;
- granular mod catalogs;
- explicit competitive-career/Ironman UX;
- multi-device divergent-root conflict UX.

## Source-quality note

Perplexity's design framing is useful, but several returned links were weak
secondary or unrelated game-save pages. The synthesis uses the Perplexity design
ideas only after grounding them in current source checks in
[[raw-command-save-trust-source-checks-2026-06-14]].
