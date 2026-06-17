---
title: Raw security ADR reference hygiene research
status: raw
tags: [research, raw, perplexity, adr, reference-hygiene, threat-model, security, fmx-182]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-182
related:
  - [[../security-adr-reference-hygiene-2026-06-17]]
  - [[raw-security-adr-reference-hygiene-source-checks-2026-06-17]]
  - [[../../40-Execution/fmx-182-security-adr-reference-hygiene-decision-record-2026-06-17]]
  - [[../pre-mortem/threat-model]]
  - [[../../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
---

# Raw security ADR reference hygiene research

## Capture metadata

- **Issue:** FMX-182
- **Date:** 2026-06-17
- **Purpose:** First-pass discovery for repairing stale pre-mortem and
  threat-model references where old drafts used ADR-0026/0027/0028 for security
  topics now owned elsewhere.
- **Status:** Raw Perplexity discovery input. Source-checked conclusions live in
  [[raw-security-adr-reference-hygiene-source-checks-2026-06-17]].

## Prompt 1

Research best practices for correcting stale or renumbered Architecture
Decision Record references in a documentation vault and threat-model/pre-mortem
corpus. Context: old drafts referenced ADR-0026 as Command Signing, ADR-0027 as
BYOC Match Validation Quorum, and ADR-0028 as Save Trust Levels, but current
accepted ADR-0026/0027/0028 are unrelated. Current accepted homes are ADR-0115
Command Integrity & Replay Protection and ADR-0116 Save Trust Levels &
Provenance; BYOC remains future-scope/unassigned. Include ADR numbering and
immutability practice, historical corrections, avoiding implementation-status
overclaiming, and what to save as raw research/synthesis/decision record.

## Raw answer summary 1

- Do not rename, renumber or repurpose ADR-0026/0027/0028 to match older draft
  meanings. ADR numbers should remain stable; previous records stay as history
  and later changes are added as amendments, superseding links or correction
  notes.
- Add explicit correction notes where stale references appear. The safe mapping
  is:
  - stale `ADR-0026 Command Signing` -> current ADR-0115 Command Integrity &
    Replay Protection.
  - stale `ADR-0028 Save Trust Levels` -> current ADR-0116 Save Trust Levels &
    Provenance.
  - stale `ADR-0027 BYOC Match Validation Quorum` -> future-scope, unassigned
    until its own gate and decision.
- Preserve the historical pre-mortem wording where it is useful as research
  context, but prevent accidental live use by adding "obsolete reference" or
  "accepted home" wording near the old reference.
- Separate concept, decision and implementation status. An accepted ADR can close
  a conceptual mitigation gap without meaning the mitigation has shipped in
  code.
- Save the chain as raw research, source checks, synthesis and a decision record.
  The final docs should be traceable without making the raw research binding.

## Mentioned source classes 1

Perplexity cited mixed ADR sources: the `architecture-decision-record` GitHub
repository, Michael Nygard's ADR writeup on Cognitect, AWS ADR best practices,
Cloud Posse ADR guidance, adr.github.io, community articles and weak
secondary/community sources. Primary/current checks are preserved in the
source-check sibling note.

## Prompt 2

Research real-world and comparable-game precedents relevant to distinguishing
command/server authority, save trust/provenance, offline/local save flexibility,
public leaderboard eligibility and future client/distributed compute risk. We
need patterns that support wording like: a mitigation can be conceptually
addressed by an accepted ADR without being implemented; signatures or save
envelopes are evidence/provenance, not client authority; offline/local saves can
remain permissive while public/competitive surfaces require server-verifiable
state; BYOC/distributed match validation must remain future-scope unless a gate
passes.

## Raw answer summary 2

- Server-authoritative game architecture is the baseline precedent for
  competitive integrity: clients submit inputs/events; the server validates and
  owns authoritative state.
- Local/offline saves can remain permissive for singleplayer because they do not
  affect shared outcomes. Public leaderboards, achievements, currencies and
  multiplayer outcomes should require server-verifiable state.
- Signatures, tokens and save envelopes are provenance/evidence artifacts. They
  help the server verify a claim, but they do not make the client authoritative.
- Distributed/client compute for authoritative validation has weak mainstream
  precedent and conflicts with the base server-authoritative assumption. It
  needs a dedicated future gate, threat model and ADR before it can be treated
  as an accepted architecture.
- Design inference: FMX can state that ADR-0115/ADR-0116 conceptually address
  the pre-mortem security risks while still requiring later implementation,
  tests and rollout evidence.

## Mentioned source classes 2

Perplexity cited Gabriel Gambetta's multiplayer architecture article, Unity
Cloud Code server-authority docs, Roblox server-authority forum/engineering
material, LootLocker server-authority/token-exchange guidance and several weak
community/blog/video sources. Primary/current checks are preserved in the
source-check sibling note.

## Raw conclusion

The best repair is reference hygiene, not a new architecture decision. Keep
ADR-0026/0027/0028 bound to their current accepted meanings; redirect old
security intent to ADR-0115/ADR-0116; leave BYOC unnumbered and future-scope;
and make "mitigated" in the pre-mortem layer mean conceptually closed by an
accepted decision, not implemented.
