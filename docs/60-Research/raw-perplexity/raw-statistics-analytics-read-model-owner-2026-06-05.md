---
title: "RAW Perplexity/Web - Statistics & analytics read-model owner (FMX-94)"
status: raw
tags: [research, raw, perplexity, web, statistics, analytics, read-model, cqrs, ddd, fmx-94]
created: 2026-06-05
updated: 2026-06-05
type: research-raw
binding: false
related:
  - [[../statistics-analytics-read-model-owner-2026-06-05]]
  - [[../../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
  - [[../../50-Game-Design/GD-0031-analytics-hub-and-statistics]]
  - [[../../20-Features/feature-statistics-analytics-hub-mvp]]
  - [[../../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
---

# RAW - Statistics & analytics read-model owner (FMX-94)

Perplexity/Web capture for **FMX-94**. Status `raw`: this is source input only;
the synthesis is [[../statistics-analytics-read-model-owner-2026-06-05]] and
the proposed decision is
[[../../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]].

No FMX private data, secrets or user data were sent. Prompts were generic
architecture/product research prompts.

## Prompt 1 - Real-world football analytics and data ownership

**Prompt.** For a football manager simulation, summarize real-world football
analytics/statistics data ownership and derived-metric practice. Focus on match
event data, competition tables/standings, player season/career stat lines,
xG/xA/xGA, PPDA/field tilt/heatmaps/shot maps/pass maps, model versioning, and
which facts should remain official vs derived.

**Key captured findings.**

- Real football separates official facts from analytical interpretation:
  match results, goals, cards, substitutions, fixtures, competition structure
  and tables are official records; xG/xA/xGA, PPDA, field tilt, pass maps,
  shot maps, heatmaps and space/zone metrics are derived model outputs.
- Event feeds combine factual events with provider-specific collection,
  enrichment, schema and quality-control work. A game using simulated matches
  can own its own event stream, but should not copy a commercial provider's
  dataset, schema or exact model outputs.
- Player season/career lines such as appearances, goals, assists, minutes,
  cards and clean sheets are factual counting stats, but they are still
  projections over match and registration facts.
- Advanced metrics vary by model and provider. For a game, derived metrics
  need explicit `metricDefinitionId` / `modelVersion`, recomputation rules and
  UI labeling as estimates rather than official league facts.
- Best-practice implication for FMX: keep official simulation facts in source
  contexts; compute read-model statistics and model outputs in a separate,
  rebuildable projection layer.

**Useful sources returned / checked.**

- StatsBomb, "Soccer Data":
  https://statsbomb.com/what-we-do/soccer-data/
- DataBallPy, "Event data":
  https://databallpy.readthedocs.io/en/latest/introduction/intro_event_data_page.html
- Football Analytics 101, "Football Analytics Companies & Products":
  https://football-analytics-101.readthedocs.io/en/latest/company.html
- Entertainment and Sports Law Journal, "The Legal and Regulatory Issues
  Arising from the Data Analytics in Football":
  https://www.entsportslawjournal.com/article/id/1082/
- Genius Sports, "Tracking data: Past, present & future in football":
  https://www.geniussports.com/content-hub/future-of-tracking-data/
- NCSU Data Column, "Football Analytics":
  https://datacolumn.iaa.ncsu.edu/blog/2023/01/19/football-analytics/
- Footballytics, "Data analytics practice: interpreting event data":
  https://www.footballytics.ch/post/data-analytics-practice-interpreting-event-data
- T&F Online, performance analysis survey:
  https://www.tandfonline.com/doi/full/10.1080/24733938.2024.2341837

## Prompt 2 - Comparable game analytics surfaces

**Prompt.** Compare statistics and analytics surfaces in football/baseball
management games, especially Football Manager/Data Hub and Out of the Park
Baseball history, leaderboards, Hall of Fame, player/team comparisons, and
long-save retention. What should a rich MVP analytics hub include, and what can
stay post-MVP?

**Key captured findings.**

- Football Manager's Data Hub pattern is decision support: Key Findings,
  Last Match, Team Analysis, Player Analysis, Form/Competition Analysis, Goal
  Analysis and Set Piece Analysis; useful metrics include xG/xGA, PPDA,
  progressive passing/carrying, pressures, per-90 comparisons and match maps.
- The main product risk is data overload or low trust. The hub needs curated
  "so what?" summaries, context versus league, and action links instead of
  charts that merely decorate the screen.
- OOTP's history surfaces show the retention value of season/career records,
  leaderboards, awards, Hall of Fame, record books and long-career comparisons.
  The pattern is less about tactical decisions and more about long-save memory.
- A rich MVP can include the tactical Data Hub spine plus basic records/history
  and immutable handoff snapshots. Full custom dashboards, exports, similarity
  search, advanced xT/OBV-style models and deep Hall-of-Fame voting can remain
  post-MVP.

**Useful sources returned / checked.**

- Football Manager, "Gameplay Upgrades" / Data Hub and analytics additions:
  https://www.footballmanager.com/features/gameplay-upgrades
- Football Manager 24 Mobile, Data Hub overview:
  https://www.footballmanager.com/features/fm24-mobile-features
- Sports Interactive manual / Football Manager manual pages:
  https://community.sports-interactive.com/sigames-manual/
- OOTP manual, History:
  https://wiki.ootpdevelopments.com/index.php?title=OOTP_Baseball%3AScreens_and_Menus%2FManager_Menu%2FHistory
- OOTP manual, Hall of Fame sortable page:
  https://manuals.ootpdevelopments.com/index.php?man=ootp17&page=help_league_history_page.hof_sortable

## Prompt 3 - DDD/CQRS projection ownership

**Prompt.** For DDD/CQRS/event-driven systems, summarize best practices for
read-model/projection ownership when analytics need to combine facts from
multiple bounded contexts. Compare a dedicated projection-only
Statistics/Analytics context vs source-owned read models vs UI/API composition.
Cover idempotency, replay/rebuild, projection versioning, and avoiding alternate
truth.

**Key captured findings.**

- CQRS/event-driven guidance treats read models as disposable projections built
  from source facts. They can be optimized for queries and rebuilt from events.
- Cross-context analytics should not become a command authority. Domain
  invariants remain in the source bounded contexts; analytics interprets and
  aggregates.
- Projection consumers need idempotency and checkpointing: processed event IDs,
  stream positions or the ADR-0028-style `consumer_event_offset` pattern.
- For evolving analytics, blue/green rebuild or side-by-side projection versions
  are safer than in-place mutation. Metrics need a model/version identity.
- Dedicated Analytics/Statistics is the clearest owner when multiple UIs and
  systems share metrics, history and long-lived projections. Source-owned
  read models fit narrow local workflows; UI/API composition is only suitable
  for simple, low-volume views.

**Useful sources returned / checked.**

- Event-Driven.io, "Projections and read models in event-driven architecture":
  https://event-driven.io/en/projections_and_read_models_in_event_driven_architecture/
- Microsoft Azure Architecture Center, "CQRS pattern":
  https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs
- Rico Fritzsche, "CQRS/Event Sourcing projections":
  https://ricofritzsche.me/cqrs-event-sourcing-projections/
- Qlerify, "Read model":
  https://www.qlerify.com/event-storming-concepts/read-model

## Decision input captured live

Nico selected the recommended FMX-94 planning line on 2026-06-05:

- dedicated projection-only **Statistics & Analytics** owner;
- per-save projections plus immutable **Manager & Legacy / Hall-of-Fame handoff
  snapshots**;
- full MVP **Analytics Hub** instead of a contracts-only future stub;
- MVP metric set of core stats plus xG/xA/xGA, PPDA, field tilt, shot/pass maps,
  heatmaps, zone control, per-90 leaderboards, form and player/team comparison;
- xT/OBV, custom report builder, export, similarity search and deep HoF voting
  stay post-MVP unless Nico expands scope in a later issue.
