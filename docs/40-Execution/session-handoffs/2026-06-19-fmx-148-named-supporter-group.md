---
title: "Session handoff: FMX-148 Named Supporter Group"
status: current
tags: [handoff, fmx-148, audience, atmosphere, supporter-groups, privacy, dsa, naming]
created: 2026-06-19
updated: 2026-06-19
type: handoff
binding: false
linear: FMX-148
related:
  - [[../../60-Research/named-supporter-group-consent-dsa-naming-2026-06-19]]
  - [[../fmx-148-named-supporter-group-decision-record-2026-06-19]]
  - [[../../60-Research/raw-perplexity/raw-fmx-148-source-checks-2026-06-19]]
  - [[../../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
---

# Session handoff: FMX-148 Named Supporter Group

## Goals

Close the named supporter-group surface in ADR-0062 by turning FMX-54's
research direction into a source-checked, Nico-decided contract for MVP posture,
People references, legal/UGC scope and naming safety.

## Completed

- Claimed FMX-148 from Backlog to In Progress.
- Used a clean `/tmp/fmx-148-named-supporter-group-surface` worktree on
  `codex/fmx-148-named-supporter-group-surface`.
- Ran Perplexity-first research for GDPR/DSA, football supporter
  representation and comparable-game fan systems.
- Source-checked strong claims against GDPR/DSA source URLs, UEFA Article 45,
  Premier League Fan Engagement Standard, Football Manager Supporter Confidence
  and local FMX-54 research.
- Recorded Nico's D1-D3 decisions: opt-in/default-off; People is not a hard
  blocker via opaque refs; fictional local/P2P legal/UGC scope.
- Preserved raw captures, source checks, synthesis and decision record.
- Folded the accepted FMX-148 posture into ADR-0062 and added a narrow ADR-0052
  consumer note.
- Updated Current State, Research Map, Decision Log, research summary, raw
  index and handoff index.

## Open Tasks

- Implementation-time work still needs exact denylist/similarity thresholds,
  sample-review cadence and local overlay validation tests.
- Hosted community-pack distribution remains a future decision packet with DSA
  Article 16, moderation, appeal, revocation, DSAR and legal review.
- If People implementation depth changes later, keep A&A on opaque refs unless
  a future ADR changes the boundary.

## Decisions Made

- D1: `NamedSupporterGroup` is specified now but MVP opt-in/default-off.
- D2: People is not a hard blocker; A&A stores only opaque actor refs.
- D3: MVP legal/UGC posture is fictional local/P2P only.

## Blockers

No blocker remains for closing FMX-148. Hosted UGC and exact naming thresholds
are intentionally future-scope.

## Durable Notes Updated

- [[../../60-Research/raw-perplexity/raw-fmx-148-legal-privacy-ugc-2026-06-19]]
- [[../../60-Research/raw-perplexity/raw-fmx-148-supporter-representation-2026-06-19]]
- [[../../60-Research/raw-perplexity/raw-fmx-148-game-precedents-naming-2026-06-19]]
- [[../../60-Research/raw-perplexity/raw-fmx-148-source-checks-2026-06-19]]
- [[../../60-Research/named-supporter-group-consent-dsa-naming-2026-06-19]]
- [[../fmx-148-named-supporter-group-decision-record-2026-06-19]]
- [[../../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
- [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
- [[../../00-Index/Open-Decisions-Dossier]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../60-Research/00-summary]]
- [[../../60-Research/raw-perplexity/README]]

## Promotion Needed

None for FMX-148. Nico's D1-D3 answers are already folded into ADR-0062 as the
current named-group surface. Future hosted UGC activation needs its own packet.
