---
title: "Raw - roguelite comparable games and football-manager failure surfaces (FMX-137)"
status: raw
tags: [research, raw, perplexity, roguelite, sports-management, meta-progression, fmx-137]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-137
related:
  - [[../roguelite-run-end-and-carry-economy-tuning-2026-06-14]]
  - [[../../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]]
  - [[../../50-Game-Design/mode-create-a-club-roguelite]]
  - [[../../20-Features/feature-roguelite-mvp-first-playable]]
---

# Raw - roguelite comparable games and football-manager failure surfaces (FMX-137)

## Research prompt

Perplexity was asked how football-manager games, sports-management sims and
roguelite games handle campaign failure, post-run summary, meta-progression and
visible cosmetics. The prompt asked for precedents that help tune a
football-manager roguelite without turning it into a grind or removing sporting
stakes.

## Source-quality note

Direct public documentation for football-manager failure and meta systems is
thin. The answer mixed genre articles, community discussion, reviews and video
references. FMX-137 treats the football-manager observations as medium-strength
precedent and uses roguelite design principles plus FMX's own accepted GDDRs as
the stronger decision base.

## Extracted findings

- Traditional football-manager and sports-management games usually avoid a hard
  campaign fail state. The manager is sacked, budgets tighten or a new job is
  offered, but the save often continues.
- Roguelites need the opposite legibility: the player must know what constitutes
  a run loss, why it happened and what is preserved for the next attempt.
- Football-manager board systems are good slow-feedback precedent, but a
  roguelite should expose the board ladder as a visible loss clock once the run
  is at risk.
- Post-run summary is a core genre bridge. It should explain duration, end
  reason, crisis path, board/finance facts and style signals.
- Meta progression works best when it expands choices or identity, not raw
  starting power. Persistent raw cash, squad strength or infrastructure would
  collapse the "build the club again" premise.
- Club identity is the safest cosmetic surface: crests, colors, kit patterns,
  badges and history markers can be visible without changing sporting outcomes.
- Async/private-group visibility should stay light: achievement-badged kit
  patterns are useful social proof, but full competitive/social showcase
  surfaces should wait for privacy, no-P2W and group-governance gates.

## Design implications carried forward

- FMX should preserve the sport-sim credibility of board and finance systems,
  but make the roguelite end state explicit.
- "Contract campaign roguelite" is the useful framing: a run is one club
  lifecycle under a board/finance contract, not an endlessly continuing career.
- Carry slots should shape founding options and soft identity, while the
  competitive core resets.
- Visible kit-pattern achievements are acceptable only when cosmetic-only,
  fiction-safe and mechanically inert.

## Source trail

- Steam community discussion on football-management failure/sacking:
  <https://steamcommunity.com/app/375530/discussions/0/350540780275106600/>
- Rogueliker review of Nutmeg, a football-themed roguelite:
  <https://rogueliker.com/nutmeg-review/>
- MiniReview list of football-management mobile games:
  <https://minireview.io/sports/retro-football-management/games-like>
- Goomba Stomp, football-management game comparison:
  <https://goombastomp.com/the-most-immersive-football-management-games-of-all-time/>
- Perplexity also returned YouTube references for sports-management and
  roguelite examples; those are treated as low-strength supporting context, not
  primary evidence.

## Related

- [[../roguelite-run-end-and-carry-economy-tuning-2026-06-14]]
- [[../../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]]

