---
title: "Raw source checks - Effect-intent taxonomy"
status: raw
tags: [research, raw, source-check, effect-intent, zod, ddd, football-manager, ea-fc, ootp, fmx-162]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-162
related:
  - [[../effect-intent-taxonomy-cross-producer-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]]
---

# Raw source checks - Effect-intent taxonomy

## Official/manual game sources

### EA Sports FC 25 Career Mode Deep Dive

URL:
https://www.ea.com/games/ea-sports-fc/fc-25/news/pitch-notes-fc-25-career-mode-deep-dive

Source-check outcome:

- FC 25's morale system has a target "sweet spot"; morale that is too high can
  create complacency and reduce mental attributes.
- Press conference questions are based on tactical choices, opponent setup and
  match statistics.
- Social Media is a narrative surface for club, league, player and fan posts
  around achievements, match results and transfer news.
- Media/news personalities and outlets are used as transfer/news signal
  surfaces.

Use in synthesis: supports bounded morale effects, tactical/context-sensitive
press questions and social/news surfaces as game precedent. It does not support
large direct media-to-ability changes.

### Football Manager 26 - mastering the end-of-season run-in

URL:
https://www.footballmanager.com/the-dugout/mastering-end-season-run-fm26

Source-check outcome:

- Morale affects team dynamics, cohesion, training, form, match preparation and
  performance.
- Potential player-departure rumours can reduce morale at high-pressure points.
- Media praise of well-performing players is presented as a useful managerial
  tool.
- Public manager communication in the run-in is framed as a way to affect
  players, board and fans.

Use in synthesis: supports press/media as player-confidence, morale and public
pressure levers. It remains a product/help article, not a formal manual.

### OOTP manual - player popularity

URL:
https://manuals.ootpdevelopments.com/index.php?man=ootp21&page=player_popularity

Source-check outcome:

- Player popularity is influenced by performance, personality and news
  articles.
- Contract signings can affect popularity and fan interest.
- Letting a popular player leave can hurt fan interest and revenue.
- High-profile signings can restore fan interest.

Use in synthesis: supports downstream fan-interest effects from news, player
status and transfer/contract stories.

## DDD and contract sources

### Microsoft Learn - domain events

URL:
https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation

Source-check outcome:

- Domain events explicitly represent side effects inside a domain.
- Integration events propagate committed transactions to other bounded contexts
  or external systems.
- Events are facts about something that happened and should be immutable.
- Cross-aggregate consistency can be synchronous within a domain or eventually
  consistent depending on domain requirements.
- An event can have several handlers; commands should be processed once, while
  events can be consumed by zero or many handlers.

Use in synthesis: supports the separation of producer fact, advisory intent
metadata and owner-context result events.

### Zod 4 Context7 + Ref checks

URLs:

- https://zod.dev/api#discriminated-unions
- https://zod.dev/api#records
- https://zod.dev/v4/changelog#improves-enum-support

Source-check outcome:

- `z.discriminatedUnion()` is designed for object unions with a shared
  discriminator key and efficient narrowing.
- Zod 4 `z.record(z.enum(...), valueSchema)` exhaustively checks that all enum
  keys exist in the input during parsing.
- `z.partialRecord()` is the explicit optional-key alternative.

Use in synthesis: when implementation resumes, a generated/hand-authored
contract test can use exhaustive enum-key records so every `EffectIntentId` has
  one mapping entry. This is a future code-phase method, not a dependency
  change in this docs-only PR.

## Real-world football pressure sources

### MDPI Economies - performance expectations and coach dismissals

URL:
https://www.mdpi.com/2227-7099/8/4/82

Source-check outcome:

- The study links head-coach dismissal to drops in expected performance against
  pre-season expectations.
- It reports that teams below expected final ranking were much more likely to
  dismiss coaches.
- It frames dismissal effects as conditional: replacement may help only when
  the team was already underperforming.

Use in synthesis: supports board pressure as expectation-relative, not purely
absolute-table-position based.

### Frontiers - Brazilian top-flight coach turnover

URL:
https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.01246/full

Source-check outcome:

- In the studied Brazilian top-flight seasons, 87 of 120 coaches were sacked
  during a season.
- Median coach survival was about 16.5 rounds.

Use in synthesis: supports high board/club pressure and short-horizon pressure
cycles in elite football contexts.

### MDPI IJERPH - elite football coaches being fired

URL:
https://www.mdpi.com/1660-4601/17/14/5196

Source-check outcome:

- Coaches described dismissal pressure from stakeholders, sponsors, media and
  fans.
- Several coaches perceived performance expectations as unrealistic or
  changing.

Use in synthesis: supports stakeholder/media/fan environment as a pressure
amplifier around performance outcomes.

## Source-quality notes

- Perplexity was useful for discovery, but weak/community sources are kept raw
  and not canonized.
- Official game pages/manuals are used for game-design precedent, not for
  reverse-engineering exact internal mechanics.
- Real-world studies support directional pressure models, not deterministic
  one-to-one media causality.
- Zod checks are current documentation checks only; no dependency or schema is
  added in this docs-only beat.

## Related

- [[../effect-intent-taxonomy-cross-producer-2026-06-15]]
- [[raw-effect-intent-taxonomy-realworld-2026-06-15]]
- [[raw-effect-intent-taxonomy-game-precedents-2026-06-15]]
- [[raw-effect-intent-taxonomy-ddd-contracts-2026-06-15]]
- [[../../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]]
