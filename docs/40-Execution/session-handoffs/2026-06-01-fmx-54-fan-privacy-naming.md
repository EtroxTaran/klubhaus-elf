---
title: Handoff FMX-54 Fan Persona Privacy and Naming
status: wrapped
tags: [meta, execution, handoff, privacy, gdpr, ip, naming, community, audience, fmx-54]
created: 2026-06-01
updated: 2026-06-01
type: handoff
related:
  - [[../../60-Research/fan-persona-privacy-and-naming-2026-06-01]]
  - [[../../60-Research/raw-perplexity/raw-fan-persona-privacy-and-naming-2026-06-01]]
  - [[../../50-Game-Design/audience-and-atmosphere]]
  - [[../../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
  - [[../../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
  - [[../../30-Implementation/privacy-and-consent]]
---

# Handoff: FMX-54 Fan Persona Privacy and Naming (2026-06-01)

## Goals

- Research and document the Audience & Atmosphere fan-group / fan-rep privacy
  boundary.
- Extend creative IP-safe naming guardrails to fan, media, sponsor, venue and
  community overlay surfaces.
- Keep Community Overlay / DSA / hosted-pack distribution future-scoped unless
  Nico later opens that gate.

## Completed

- Ran three Perplexity research passes and targeted source checks:
  GDPR boundary for generated fan personas, IP-safe naming for football-manager
  social worlds, and Community Overlay / DSA / AI transparency future gates.
- Captured raw research:
  [[../../60-Research/raw-perplexity/raw-fan-persona-privacy-and-naming-2026-06-01]].
- Added synthesis:
  [[../../60-Research/fan-persona-privacy-and-naming-2026-06-01]].
- Updated Audience & Atmosphere §5a so named fan groups/reps are fictional
  aggregate/narrative actors, not real fans or mechanics owners.
- Updated GD-0015 and ADR-0007 so IP-clean naming covers fan groups, fan reps,
  supporter slogans/chants, media outlets, journalists, sponsors, venues and
  community overlay names.
- Updated Community Editor / ADR-0059 / Privacy & Consent for local/P2P import
  and hosted-platform future gates.
- Updated Research Summary, Raw Perplexity index, Current State, Decision Log,
  IP and Licensing, Data Generators, Sponsorship Portfolio and Game Design Hub.

## Open Tasks

- Nico/legal sign-off before any hosted community-pack platform, pack discovery
  surface or marketplace.
- Decide exact similarity thresholds, phonetic algorithms and manual review
  cadence when generator implementation work starts.
- Decide whether any fictional fan identity labels need narrower wording before
  content lock.

## Decisions Made

- Guided planning choices applied:
  - Community Overlay / DSA scope: **Future-Scope**.
  - Fan persona scope: **Fictional Aggregate**.
  - Naming depth: **Policy + Tests**.
- No ADR or GDDR status was ratified by this beat.

## Blockers

- None for the documentation beat.
- Hosted UGC/community distribution remains blocked until DSA/UGC/privacy/AI
  transparency documentation is prepared and approved.

## Durable Notes Updated

- `docs/60-Research/fan-persona-privacy-and-naming-2026-06-01.md`
- `docs/60-Research/raw-perplexity/raw-fan-persona-privacy-and-naming-2026-06-01.md`
- `docs/50-Game-Design/audience-and-atmosphere.md`
- `docs/50-Game-Design/GD-0015-ip-clean-data.md`
- `docs/50-Game-Design/community-editor-and-datasets.md`
- `docs/50-Game-Design/sponsorship-portfolio.md`
- `docs/50-Game-Design/README.md`
- `docs/10-Architecture/09-Decisions/ADR-0007-naming-schema.md`
- `docs/10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context.md`
- `docs/30-Implementation/privacy-and-consent.md`
- `docs/60-Research/data-generators.md`
- `docs/60-Research/ip-and-licensing.md`
- `docs/60-Research/00-summary.md`
- `docs/60-Research/raw-perplexity/README.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Decision-Log.md`

## Promotion Needed

- If Nico later ratifies hosted Community Overlay distribution, promote the
  future-gate requirements into the Community Overlay ADR/apply PR.
- If generator implementation starts, convert the Policy + Tests language into
  concrete generator/test contracts and exact thresholds with Nico/legal review.
