---
title: "Raw - game-production phase gates for code-phase DoD (FMX-180)"
status: raw
tags: [research, raw, perplexity, game-production, first-playable, vertical-slice, dod, fmx-180]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-180
related:
  - [[../code-phase-dod-transition-contract-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]]
  - [[../../30-Implementation/mvp-implementation-roadmap]]
---

# Raw - game-production phase gates for code-phase DoD (FMX-180)

## Research prompt

Perplexity was asked for real-world game production and comparable game
development precedent for transitioning from pre-production/design docs into a
first-playable, vertical-slice or code phase. The prompt focused on phase gates,
CI/test readiness, playable-slice acceptance, asset/UI pipeline readiness and
how teams avoid treating design docs as production-complete gates.

## Source-quality note

The sources are production-process articles and secondary game-development
guides, not formal standards. They are useful for product/process framing. FMX's
binding decision still comes from Nico's approval and ADR-0110.

## Extracted findings

- Game production commonly distinguishes pre-production, production and
  post-production, with production milestones such as proof of concept, first
  playable, vertical slice, alpha, beta and gold master.
- Pre-production is where teams answer scope, game idea, engine/tooling, art
  style, monetization, pipeline, schedule and staffing questions. It is not the
  same as a production-ready code gate.
- A proof of concept validates feasibility and resource needs before full
  production work ramps up.
- First playable/vertical slice gates are evidence artifacts: a playable core
  loop, validated tools and version control, a usable asset/data pipeline and
  known test strategy.
- A Game Design Document is a planning input. Treating it as the finished gate
  without playable/pipeline evidence is an anti-pattern.
- Small cheap prototypes are recommended to test assumptions before production.
- A practical FMX transition shape is: vault decisions and GDDRs complete ->
  bootstrap repo/tooling -> first playable core loop -> vertical slice quality
  bar -> scaled content and feature beats.
- For FMX, the code-phase DoD should therefore not ask docs-phase agents to run
  nonexistent app checks. It should first require the bootstrap that makes those
  checks real.

## Source trail

- RocketBrush game development process guide:
  <https://rocketbrush.com/blog/game-development-process-guide>
- GameMaker stages of game development:
  <https://gamemaker.io/en/blog/stages-of-game-development>
- iLogos pre-production in games:
  <https://ilogos.biz/what-is-pre-production-in-games/>
- GDKeys game development process:
  <https://gdkeys.com/game-development-process/>
- Perplexity also cited a YouTube production-process talk; FMX treats video
  citations as low-strength supporting context only.

## Related

- [[../code-phase-dod-transition-contract-2026-06-14]]
- [[../../30-Implementation/mvp-implementation-roadmap]]

