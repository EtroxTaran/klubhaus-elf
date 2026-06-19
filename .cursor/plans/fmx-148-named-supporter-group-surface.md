---
title: FMX-148 Named Supporter Group Surface Plan
status: current
tags: [plan, fmx-148, audience, atmosphere, supporter-groups, privacy, dsa, naming]
created: 2026-06-19
updated: 2026-06-19
type: plan
binding: false
related:
  - [[../../docs/60-Research/named-supporter-group-consent-dsa-naming-2026-06-19]]
  - [[../../docs/40-Execution/fmx-148-named-supporter-group-decision-record-2026-06-19]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../../docs/60-Research/fan-persona-privacy-and-naming-2026-06-01]]
---

# FMX-148 Named Supporter Group Surface Plan

## Goal

Close the named supporter-group surface that ADR-0062 left FMX-54-gated:
privacy/legal posture, People reference semantics, DSA/local-vs-hosted UGC
scope and IP-safe naming depth.

## Steps

1. Claim FMX-148 in Linear and work from
   `codex/fmx-148-named-supporter-group-surface`.
2. Preserve Perplexity-first research for GDPR/DSA, football supporter
   representation and comparable-game supporter systems.
3. Source-check strong claims against official or stable sources and downgrade
   weak sources.
4. Record Nico's FMX-148 decisions:
   `NamedSupporterGroup` is opt-in/default-off in MVP; People is not a hard
   blocker when A&A references only opaque actor refs; legal/UGC scope remains
   fictional local/P2P with hosted UGC as a future DSA gate.
5. Fold the binding detail into ADR-0062 without changing the wider Audience &
   Atmosphere boundary.
6. Add a narrow ADR-0052 consumer note so People remains the actor/persona owner
   while A&A owns group facts.
7. Update Decision Log, Current State, Research Map, research/raw indexes and
   session handoff.
8. Validate with `node scripts/docs-check.mjs`, `node
   scripts/status-consistency-check.mjs` and `git diff --check`.

## HITL Decisions

Nico answered the decision questions live on 2026-06-19:

- D1 `NamedSupporterGroup` MVP posture: opt-in/default-off.
- D2 People dependency: not a hard blocker; use opaque refs.
- D3 legal/UGC scope: fictional local/P2P; hosted UGC remains future-scope.

## Out of Scope

- Hosted community-pack marketplace or discovery.
- DSA implementation runbook beyond the future activation gate.
- Full People implementation depth beyond opaque actor/persona references.
- Exact similarity thresholds, denylist contents or generator code.
