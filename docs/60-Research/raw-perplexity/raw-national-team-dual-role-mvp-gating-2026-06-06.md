---
title: "Raw: Late-game prestige content — MVP vs post-MVP gating & reserved stubs"
status: raw
tags: [research, raw, perplexity, late-game, mvp-scope, reserved-stub, retention, fmx-84]
created: 2026-06-06
updated: 2026-06-06
type: research
source: perplexity (sonar)
linear: FMX-84
related:
  - [[../national-team-dual-role-2026-06-06]]
---

# Raw capture — gating late-game prestige content (MVP vs post-MVP, reserved stubs)

> **`status: raw`.** Verbatim Perplexity (Sonar) capture for FMX-84. Synthesised in
> [[../national-team-dual-role-2026-06-06]]. Not implementation authority.

## Prompt

> Game design best practices for LATE-GAME / end-game prestige content in long-running
> management and simulation games (e.g. 50-year dynasty saves in sports sims). Specifically:
> (1) When should a niche aspirational feature (like a secondary 'national-team manager' role
> unlocked only after long play) ship in an MVP versus be deferred post-launch, and what are
> the risks of cutting late-game content from a v1 of a retention-driven game? (2) Best
> practices for gating/unlocking aspirational content behind reputation, time-played, or
> achievement thresholds without frustrating players — banding thresholds, telegraphing the
> goal early, avoiding grind. (3) How dynasty/career sims fight the 'mid-game engagement
> flatline' (players quitting around season 4-6) and the role of fresh late-game goals. (4)
> The principle of building a 'reserved stub' or extension point for a deferred feature so the
> architecture doesn't have to be reworked later. Cite game-design sources, GDC talks,
> postmortems, and sports-sim examples.

## Response (verbatim)

For a **retention-driven long-running sim**, a niche aspirational feature like a late-unlocked
national-team manager role is usually better treated as a **planned post-launch expansion or
"reserved stub"** unless it is central to the game's core fantasy and can be supported without
endangering the MVP's primary loops. Cutting late-game content from v1 saves schedule risk but
risks leaving the game without a long-horizon goal — especially dangerous in progression-heavy
games where prestige/endgame goals are part of the retention strategy.

- **Ship in MVP** when the feature is part of the core promise, is needed to validate the main
  retention loop, or the opening hours would feel incomplete without a visible path to it.
- **Defer post-launch** when the feature is aspirational, expensive, mostly serves very late
  retainers, or would distract from stabilising the core loop/economy/pacing.
- The main risk of cutting from v1 is **flattening the long-term fantasy**: players hit a
  mid-game wall, lose a sense of future mastery, and churn before retention systems can work.

Practical rule: is the feature a **core pillar** or a **stretch goal**? If "stretch goal," ship
an MVP that **names the possibility, telegraphs the path, and leaves room for later expansion**,
without spending full production budget before the core game is proven.

**1) MVP vs post-launch.** In MVP include only the **minimum scaffolding** to preserve the
fantasy: UI hooks, data fields, progression rules, narrative foreshadowing. Build the full
feature in v1 only if needed to test whether players stay long enough to reach it, or if it
materially changes early decisions/pacing. Defer if it is mainly a late retention lever and the
base game still needs validation on onboarding, mid-game pacing, economy and save stability. The
risk of cutting late-game content is optimising for launch scope while weakening the systems that
support long-tail engagement (idle/progression guidance: prestige, layered upgrades, new goals
help players re-enter the curve after growth slows).

**2) Gating & unlocking.** Use **banded thresholds** not a single opaque cliff; **telegraph
early** that the role exists and what it requires; make the unlock feel like a **reward for
mastery, not a punishment for non-grinding**; thresholds should map to meaningful milestones, not
arbitrary hours; avoid pure time-gating — **combine time played with achievement, reputation, or
performance**; ensure **intermediate rewards** before the final unlock. Common failure mode: a
"long-term" goal that feels like a **blank wall**. Expose the aspiration early, break it into
visible subgoals, and ensure each step changes play in a rewarding way.

**3) Mid-game flatline.** Dynasty/career sims lose players when early novelty fades and the sim
becomes optimised repetition; late-game goals are a main tool to escape the flatline. A healthy
late game introduces **fresh motivations**: prestige, new roles, alternate career arcs,
meta-progression, status goals that reframe the same systems. Design so the player periodically
gets a **new reason to care** about the next season, not just a bigger number. For sports/dynasty
sims that often means late-game roles, federation-level responsibilities, legacy objectives, or
cross-sim achievements relevant only after several seasons of mastery.

**4) Reserved stub / extension point.** If you defer a feature, create a **reserved stub**: a
data model, UI affordance, save slot, or system interface that can later be expanded without
rewriting the surrounding architecture. Preserve the **design intent** and the **technical seam**
so the feature activates later with minimal refactoring — especially important for late-game
systems that depend on save-game structure, progression state and presentation logic (expensive
to retrofit). Production rule: core-to-validating-first-release → build playable now; core-to-the-
long-tail-fantasy-but-not-needed-to-validate-first-hours → ship the stub now, full content later;
neither → cut entirely.

## Citations (as returned)

1. https://gridinc.co.za/blog/idle-games-best-practices
2. https://www.youtube.com/watch?v=UTE_bVUeHCQ
3. https://brandonthegamedev.com/10-elements-of-good-game-design/
4. https://www.youtube.com/watch?v=DMdv01D1uFI
5. https://ch0m5.github.io/Game-Design-Pillars/
6. https://forum.greenheartgames.com/t/some-late-game-advice-please-anyone/9939
7. https://forum.paradoxplaza.com/forum/threads/essay-on-game-design-ideas-to-fix-poor-game-progression-and-lategame-micromanagement-hell.1603103/
