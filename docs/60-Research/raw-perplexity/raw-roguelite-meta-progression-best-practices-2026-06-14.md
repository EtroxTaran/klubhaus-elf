---
title: "Raw - roguelite meta-progression best practices (FMX-137)"
status: raw
tags: [research, raw, perplexity, roguelite, meta-progression, carry-slots, cosmetics, fmx-137]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-137
related:
  - [[../roguelite-run-end-and-carry-economy-tuning-2026-06-14]]
  - [[../../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]]
  - [[../../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
---

# Raw - roguelite meta-progression best practices (FMX-137)

## Research prompt

Perplexity was asked for best practices in roguelite meta-progression, with
attention to carry slots, long-run unlock pacing, cosmetic identity, avoiding
raw-power creep and supporting post-run learning.

## Source-quality note

The answer returned a mixture of indie design essays, academic/student work,
community debate and video material. FMX-137 treats the themes as genre
practice, not hard evidence. The actual FMX decision is constrained by
GD-0019, ADR-0082 and the accepted no-start-finance-perk policy.

## Extracted findings

- Meta-progression should make new runs **different**, not simply stronger.
  Better rewards are new options, new constraints, expressive cosmetics and
  clearer mastery.
- Permanent raw stat power risks flattening the early-game tension that makes a
  run matter. This is especially dangerous for a football-manager economy,
  where starting cash or infrastructure can snowball.
- Carry slots are a good pacing device because they force a trade-off. They are
  safer when slots are capped and/or category-limited.
- Diminishing returns are a common best-practice pattern: early runs unlock
  noticeable variety, later runs widen the option pool or add cosmetics/challenge
  variants rather than continuing functional power growth forever.
- Rewarding only victories encourages grinding safe success loops. Rewarding
  completed seasons, survival milestones, crisis recoveries and run stories
  better supports learning without encouraging intentional failure abuse.
- Post-run reflection is part of the progression system. It should explain what
  the player did and why the next run can differ, without exposing a checklist
  of grind thresholds.
- Cosmetics are safest when feat-bound and mechanically inert. They can be
  visible to peers if privacy and competitive-fairness gates are respected.

## Design implications carried forward

- FMX should replace the old linear "1 slot per ~50 seasons" sketch with a
  capped logarithmic curve.
- Functional carry slots should stop at a small cap. After the cap, progression
  should widen founding-option pools, cosmetics and challenge variants.
- The default should preserve one starting carry slot, then grow to two and
  three slots through completed-season milestones across prior runs.
- No MVP carry should increase starting finance, squad strength or stadium
  capacity; ADR-0082 keeps any future start-finance perk behind a fresh Nico
  decision.

## Source trail

- Entalto Studios, "5 essential tips to make your roguelite game work":
  <https://entaltostudios.com/5-essential-tips-to-make-your-roguelite-game-work/>
- Hamatti notes, "Meta-progression with gradual tutorial in roguelike games":
  <https://notes.hamatti.org/gaming/video-games/meta-progression-with-gradual-tutorial-in-roguelike-games>
- Hacker News thread on roguelite meta-progression debate:
  <https://news.ycombinator.com/item?id=43658059>
- Eino Kammonen thesis PDF on roguelike/roguelite design:
  <https://www.theseus.fi/bitstream/10024/881994/2/Kammonen_Eino.pdf>
- Perplexity also returned ResetEra, Steam and YouTube references; these are
  preserved as weak community/genre context and are not decision authority.

## Related

- [[../roguelite-run-end-and-carry-economy-tuning-2026-06-14]]
- [[../../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]]

