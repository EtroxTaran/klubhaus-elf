---
title: "RAW - Newsworthiness event-publication semantics"
status: raw
tags: [research, raw, perplexity, narrative, newsworthiness, events, contracts, ddd, fmx-83]
created: 2026-06-04
updated: 2026-06-04
type: research
related:
  - [[../newsworthiness-event-publication-semantics-2026-06-04]]
  - [[../../10-Architecture/09-Decisions/ADR-0075-narrative-newsworthiness-event-contracts]]
  - [[../../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../../30-Implementation/ai-narration-contract-testing-framework]]
---

# RAW Perplexity capture - newsworthiness event-publication semantics (FMX-83)

> Unprocessed research capture and source notes. Synthesised into
> [[../newsworthiness-event-publication-semantics-2026-06-04]].
> Do not implement from raw. Captured 2026-06-04 via Perplexity Sonar,
> targeted source checks and Zod 4 documentation checks.

## Prompt 1 - Real football media/newsworthiness

System: senior football-media researcher and football operations analyst. Use
current football journalism/source practice plus real football administration
patterns. Distinguish official facts, attributed rumours and low-confidence
speculation.

User: research how real football media and clubs report newsworthy events such
as injuries, contract expiry, board pressure, transfer rumours and player
suspensions. What facts are needed for an article/report to be intelligible
without back-office access? Which details should be banded or withheld? Which
source/confidence/attribution fields should a football manager game event
contract carry?

## Captured answer 1 - Summary

- Real coverage separates official facts from attributed reporting and rumours.
  A contract needs `sourceType`, `sourceConfidence`, attribution flags and a
  "may publish" distinction rather than a single truthy news flag.
- Injuries should carry player/club display snapshot, occurrence context,
  body-location/injury-type bands, time-loss band, return-window band, privacy
  class, recurrence flag and whether the source is official medical/public
  reporting. Exact medical detail is not needed for a game article.
- Contract expiry needs player/club display snapshot, expiry window, current
  talks status, option/extension flag, importance band and a next-refresh
  trigger. Financial detail should be banded or omitted unless already public.
- Board pressure needs subject/club display snapshot, pressure band, change
  direction, trigger reason, upcoming fixture/context hook, backing/denial
  statement flag and legal-risk/source-confidence metadata.
- Transfer rumours need linked clubs, player display snapshot, stage/type,
  window context, fee/wage band where public, source type, reinforcement count,
  confidence, attribution requirement, story thread and decay/supersession.
- Suspensions need reason band, competition scope, match/date duration band,
  start/end window, appeal status and legal/privacy risk. FMX-83 should not own
  that schema because the Discipline issue is the source-of-truth owner.

## Targeted source checks - real football and journalism

- Reuters Handbook of Journalism:
  <https://www.mediareform.org.uk/wp-content/uploads/2015/12/Reuters_Handbook_of_Journalism.pdf>
  used for sourcing, attribution and rumour-vs-fact discipline.
- Football injury consensus statement:
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC10646851/>
  and British Journal of Sports Medicine summary:
  <https://bjsm.bmj.com/content/57/21/1341>
  used for time-loss severity bins: 0 days, 1-3, 4-7, 8-28, 29-90,
  91-180 and more than 180 days.
- FIFA judicial bodies:
  <https://inside.fifa.com/legal/judicial-bodies>
  and FIFA Disciplinary Code PDF:
  <https://digitalhub.fifa.com/m/1b1c85f7bbc8b3e6/original/i8zsik8xws0pyl8uay9i-pdf>
  used for sanction/suspension/appeal framing. FMX uses IP-clean fictional
  regulators and does not copy FIFA rule text.
- Football Manager 25 development update:
  <https://www.footballmanager.com/news/development-update-football-manager-25>
  and FM26 reimagined UI:
  <https://www.footballmanager.com/fm26/features/fm26s-reimagined-user-interface>
  used for current genre precedent: card/tile-based portal surfaces with
  important news elevated from structured simulation facts.

## Prompt 2 - Comparable games and systemic narrative patterns

System: senior game systems designer. Compare sports-manager games, Paradox-like
event systems, Failbetter storylets and systemic narrative tooling. Separate
confirmed public mechanics from design inference.

User: analyze how comparable games decide which simulation facts become news,
storylets, inbox items or media articles. Focus on storylet eligibility,
salience/decay, rumour objects, recurring media actors, source confidence and
anti-spam practices. Recommend best practices for FMX.

## Captured answer 2 - Summary

- Best practice is a layered pipeline: committed simulation fact -> eligibility
  or storylet gate -> salience/frequency/decay -> display snapshot/article.
  The narrative layer presents, not creates, authoritative facts.
- Storylet systems fit FMX because facts/qualities unlock or weight authored
  content units. Conditions can be tested and replayed.
- Long-save games need story threads and supersession, not isolated one-off
  events. A rumour should decay, be reinforced, confirmed, contradicted or
  expire.
- Recurring media actors work best as stance/reach/reliability modifiers around
  a fact, not as a second source of football truth.
- Anti-spam controls should be explicit: audience scope, salience input fields,
  cooldown/frequency caps, decay hint, story thread, duplicate suppression and
  "already covered" flags.
- Avoid random unanchored articles, permanent rumour flags, UI-channel coupling
  and Narrative-only facts that owning domains cannot verify.

## Targeted source checks - games and storylets

- Failbetter on storylets:
  <https://www.failbettergames.com/news/echo-bazaar-narrative-structures-part-two>
  used for quality-gated storylets controlled by state/qualities.
- Failbetter StoryNexus developer diary:
  <https://www.failbettergames.com/news/storynexus-developer-diary-2-fewer-spreadsheets-less-swearing>
  used for quality-based narrative authoring and effects expressed as quality
  changes rather than brittle branches.
- Official Football Manager UI pages above used only for public evidence that
  the current genre surfaces important news through structured cards/tiles and
  click-through detail. Internal FM newsworthiness algorithms are not public.

## Prompt 3 - DDD domain vs integration events

System: senior DDD architect. Prefer primary DDD, Microsoft architecture and
transactional-outbox sources. Focus on modular monolith/event contracts.

User: research best practices for domain events vs integration events when a
Narrative bounded context consumes facts from Squad, Transfer, Club Management
and Discipline. The consumer must render without cross-context joins. What
envelope, idempotency, versioning and payload rules should the contracts use?

## Captured answer 3 - Summary

- Domain events can stay rich and internal to a bounded context. Cross-context
  integration events should be stable, versioned and self-contained in the
  published language.
- A Narrative consumer should not join back into Squad/Transfer/Club/Discipline
  while rendering. The event must carry enough denormalized display data,
  source metadata and bands for the story surface.
- Use a versioned envelope with `eventId`, `eventType`, `eventVersion`,
  producer context, aggregate reference, timestamps, schema version, trace ref
  and idempotency key.
- Consumers should treat events as immutable snapshots and build rebuildable
  projections keyed by `eventId` and `storyThreadId`.
- Publish integration events through the transactional outbox after the owning
  domain transaction commits. Consumers must be idempotent and replay-safe.
- Additive schema evolution should be preferred. Breaking semantic changes get
  a new event version and migration/replay rule.

## Targeted source checks - DDD/events

- Microsoft domain events design/implementation:
  <https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation>
  used for domain event roles and the rule that integration events happen only
  after persistence succeeds.
- Microsoft integration-event communications:
  <https://learn.microsoft.com/en-us/dotnet/architecture/microservices/multi-container-microservice-net-applications/integration-event-based-microservice-communications>
  used for asynchronous integration-event, event-bus and resilience framing.
- FMX ADR-0028 already owns the local transactional outbox substrate. FMX-83
  only adds the Narrative-facing published-language payload rules.

## Dependency/tooling documentation check

- No dependency was added or upgraded for this docs-only issue.
- Zod 4 docs were checked for the future contract implementation posture:
  - discriminated unions:
    <https://zod.dev/api#discriminated-unions>
  - JSON schema export and JSON values:
    <https://zod.dev/api#json>
  - Zod 4 changelog for strict object guidance:
    <https://zod.dev/v4/changelog#deprecates-strict-and-passthrough>
- Draft implementation guidance: use top-level `z.strictObject()` for boundary
  contracts, `z.discriminatedUnion()` for event variants, schema metadata for
  descriptions and `z.toJSONSchema()` from the same source schemas when
  provider/API JSON Schema is needed. Do not hand-maintain parallel shapes.

## Decisions and recommended defaults captured

Nico selected FMX-83 as the next issue and then said "go on". The following are
therefore recorded as recommended proposed defaults, not ratified decisions:

| # | Question | Recommended default |
|---|---|---|
| D1 | Generic `NarrativeFactPublished` or distinct event names? | Distinct source-owned events plus shared Narrative projection/checklist. |
| D2 | Transfer rumour origin | Transfer emits the rumour publication fact; Narrative renders only. |
| D3 | `PlayerSuspended` handling | FMX-83 records projection requirements only; FMX-80/Discipline owns the event schema. |
| D4 | Payload detail | Banded, self-contained, display-ready snapshots with source/confidence/legal/privacy metadata; no raw internals and no consumer joins. |

## Research caveats

- Perplexity returned some public-game inferences because football-manager
  games do not publish internal newsworthiness algorithms. The synthesis
  promotes only shape-level precedent, not proprietary mechanics.
- This is not legal or medical advice. Injury and discipline bins are
  game-design abstraction inputs, not real diagnostic or legal text.
- FMX uses fictional clubs, leagues, regulators, media outlets and people per
  ADR-0007/GD-0015.

## Related

- [[../newsworthiness-event-publication-semantics-2026-06-04]]
- [[../../10-Architecture/09-Decisions/ADR-0075-narrative-newsworthiness-event-contracts]]
- [[../../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
- [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]

