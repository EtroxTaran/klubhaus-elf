---
title: Raw security ADR reference hygiene source checks
status: raw
tags: [research, raw, source-check, adr, reference-hygiene, threat-model, security, server-authority, fmx-182]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-182
related:
  - [[../security-adr-reference-hygiene-2026-06-17]]
  - [[raw-security-adr-reference-hygiene-2026-06-17]]
  - [[../../40-Execution/fmx-182-security-adr-reference-hygiene-decision-record-2026-06-17]]
  - [[../../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
---

# Raw security ADR reference hygiene source checks

## Capture metadata

- **Issue:** FMX-182
- **Date:** 2026-06-17
- **Purpose:** Validate the Perplexity claims before canonizing FMX-182
  reference-hygiene wording.

## Sources checked

| Source | Relevant finding | FMX implication | Confidence |
|---|---|---|---|
| Michael Nygard, "Documenting Architecture Decisions": <https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions> | ADRs are sequential and monotonic; numbers are not reused; reversed decisions remain available and are marked superseded/deprecated with a replacement reference. | Do not reuse ADR-0026/0027/0028 for old security draft intent. Add explicit correction notes and point to current owners. | High |
| Architecture Decision Record repository: <https://github.com/architecture-decision-record/architecture-decision-record> | Good ADRs keep timestamps; existing information should be amended or superseded rather than silently altered. | FMX-182 should add dated correction notes and front-door mapping instead of rewriting history. | High |
| AWS Architecture Blog ADR best practices: <https://aws.amazon.com/blogs/architecture/master-architecture-decision-records-adrs-best-practices-for-effective-decision-making/> | Effective ADRs capture context, alternatives and rationale; design exploration can live separately from the final decision; superseding links should be maintained. | Preserve raw research + synthesis + decision record. Do not promote the research packet itself as an ADR. | High |
| Gabriel Gambetta, client-server game architecture: <https://www.gabrielgambetta.com/client-server-game-architecture.html> | Competitive multiplayer convention is "do not trust the player": clients send inputs, the server owns authoritative state. | ADR-0115 wording should keep command signatures as provenance evidence; server validation remains authority. | Medium-high |
| Unity Cloud Code server-authority docs: <https://docs.unity.com/en-us/cloud-code/server-authority> | Unity frames server authority as server-owned game logic/data for fair play, progress/high scores and cheat prevention; clients send data for server processing. | Public/competitive FMX surfaces can require server-verifiable state while local SP remains permissive. | High |
| LootLocker server-authority/token-exchange guide: <https://lootlocker.com/guides/supercharging-your-game-servers-token-exchange> | Sensitive actions such as score submission, progression and currency should be validated/performed on the server; client tokens are handed to a server-authorized flow. | Signatures/envelopes/tokens are inputs to server validation, not client authority. | Medium-high |

## Downgraded / not canonized

- Roblox DevForum server-authority pages were useful in Perplexity discovery but
  did not render enough stable page text in the current source check. They are
  not used as canonical evidence in the synthesis.
- Community blog posts, Reddit discussions and videos are not used as
  authoritative FMX evidence.

## Source-check conclusion

- ADR numbers remain immutable for FMX reference hygiene. Current ADR-0026,
  ADR-0027 and ADR-0028 keep their current accepted meanings only.
- The accepted owners for old security intent are ADR-0115 for command
  integrity/replay protection and ADR-0116 for save trust/provenance.
- BYOC quorum remains future-scope/unassigned. A future BYOC ADR needs its own
  gate, source checks and Nico approval.
- Pre-mortem `status: mitigated` means "conceptually addressed by accepted
  decision(s)" unless an implementation artifact says otherwise.
