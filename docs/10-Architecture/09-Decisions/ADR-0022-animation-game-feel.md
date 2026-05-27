---
title: ADR-0022 Animation & Game-Feel Stack
status: draft
tags: [adr, architecture, ui, animation]
created: 2026-05-19
updated: 2026-05-22
accepted_at: 2026-05-19
type: adr
binding: true
supersedes:
superseded_by:
related: [[ADR-0021-revised-tech-stack]], [[ADR-0010-design-system]], [[ADR-0024-match-renderer-abstraction]]
---

# ADR-0022: Animation & Game-Feel Stack

## Status

accepted

## Date

2026-05-19

## Context

The product goal explicitly includes "modern graphic and game feeling,
animations, cool handling". The prior plan ("minimal Tailwind keyframes only")
was assessed as insufficient: CSS cannot interrupt/redirect in-flight
transitions, do shared-element/layout animation, run seekable multi-step
timelines, or gesture-physics. A real animation library is required.

## Options Considered

- Tailwind/CSS keyframes only (rejected — insufficient, see Context).
- Motion (formerly Framer Motion) — stateful, gesture, layout/shared-element.
- GSAP — directed, seekable, multi-step timelines; can tween inside Canvas.

## Decision

Use **both, by role**:

- **Motion** (`motion/react`) for UI/gesture/layout/route transitions, via the
  slim `m` component + `LazyMotion` (≈4.6 kb initial; lazy-load features).
- **GSAP** + `@gsap/react` (`useGSAP`) for choreographed match-event sequences
  and in-canvas tweening (see [[ADR-0024-match-renderer-abstraction]]).
- **Tailwind keyframes** retained for trivial CSS-only micro-states
  (hover/press/skeleton/spinner).

Both are free for commercial use (GSAP fully free incl. plugins since 2025;
Motion MIT) and React-19-ready as of 2026.

## Rationale

Motion owns React-state-driven motion (layout prop, gestures, springs); GSAP
owns precise, reversible, sequenced choreography and is the animation tool for
the Canvas 2D match view. Bundle cost is controlled via
`m`+`LazyMotion` and by loading GSAP only where the match view mounts.

## Consequences

Positive:

- Genuine game-feel: interruptible springs, shared-element screen transitions,
  drag-with-momentum, choreographed goal/event sequences.
- Bundle cost bounded by the `m`+`LazyMotion` pattern.

Negative:

- Two animation libraries to learn/maintain; a clear role boundary
  (Motion = DOM/UI, GSAP = timelines/canvas) must be enforced in review.

## Supersedes

None (supersedes the "minimal keyframes only" stance carried in
[[ADR-0001-tech-stack]], now retired via [[ADR-0021-revised-tech-stack]]).

## Related Docs

- [[ADR-0021-revised-tech-stack]] · [[ADR-0010-design-system]] · [[ADR-0024-match-renderer-abstraction]]
