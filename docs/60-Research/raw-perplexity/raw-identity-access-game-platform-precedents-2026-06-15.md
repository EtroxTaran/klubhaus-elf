---
title: Raw Identity & Access Game and Platform Precedents
status: raw
tags: [research, raw, perplexity, identity-access, games, platforms, steam, discord, entitlements, community, fmx-163]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-163
related:
  - [[../identity-access-context-definition-2026-06-15]]
  - [[raw-identity-access-source-checks-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0122-identity-access-context-definition]]
  - [[../../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
---

# Raw Identity & Access Game and Platform Precedents

This note preserves the Perplexity-first discovery pass for game/platform
precedents. It is raw research input and explicitly weaker than the primary
standards checks.

## Prompt

Research comparable game/platform precedents for account identity,
sessions/devices, entitlements, community/group membership, mod/community content
import, and safety/audit separation. Use football/sports management games where
public docs exist, plus game platforms and social/game services such as Steam,
Discord, Xbox/PlayStation/Nintendo/Epic/EA where relevant. Translate findings
into practical guidance for a football manager game architecture. Include
citations/URLs.

## Discovery Summary

Public football-manager backend documentation is sparse. Perplexity therefore
used broader game-platform and social-platform patterns:

- Game platforms separate a global account from game-specific persona/save
  state and commercial entitlements.
- Steam examples support a split between user authentication/ownership checks
  and Workshop-style content package lifecycle.
- Discord examples support a split between global account identity and
  per-server/community roles, permissions and membership.
- Platform safety/audit systems are separate from normal product paths and
  receive events from account, community and gameplay systems.

## Practical Translation for FMX

Use these precedents conservatively:

- Identity & Access owns global account/session/device/global-claim state.
- Manager persona, save membership, club-control slots and watch-party roles
  remain domain state, not account internals.
- Entitlements remain commercial/account-bound facts owned outside Identity.
- Community content import remains Community Overlay Pipeline, not Identity.
- Safety/audit retention remains Audit & Security.

## Source-Quality Caveat

Perplexity's football-specific citations were weak and mostly not official
backend documentation. The synthesis does not treat them as binding evidence.
The source-check layer uses official Steamworks and Discord documentation only
for platform precedent.

## Related

- [[../identity-access-context-definition-2026-06-15]]
- [[raw-identity-access-source-checks-2026-06-15]]
- [[../../10-Architecture/09-Decisions/ADR-0122-identity-access-context-definition]]

