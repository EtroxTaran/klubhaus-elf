---
title: Named Supporter Group Consent DSA and Naming
status: current
tags: [research, synthesis, fmx-148, audience, atmosphere, supporter-groups, privacy, gdpr, dsa, naming, ip, people]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-148
sourceType: synthesis
related:
  - [[raw-perplexity/raw-fmx-148-legal-privacy-ugc-2026-06-19]]
  - [[raw-perplexity/raw-fmx-148-supporter-representation-2026-06-19]]
  - [[raw-perplexity/raw-fmx-148-game-precedents-naming-2026-06-19]]
  - [[raw-perplexity/raw-fmx-148-source-checks-2026-06-19]]
  - [[../40-Execution/fmx-148-named-supporter-group-decision-record-2026-06-19]]
  - [[fan-persona-privacy-and-naming-2026-06-01]]
  - [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
  - [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
  - [[../50-Game-Design/GD-0015-ip-clean-data]]
---

# Named Supporter Group Consent DSA and Naming

## Question

How should FMX close ADR-0062's named supporter-group stub after FMX-54, while
keeping the MVP privacy/legal surface realistic, IP-clean and future-proof?

## Short answer

Specify `NamedSupporterGroup`, but keep it **opt-in/default-off for MVP**.
Audience & Atmosphere owns fictional group facts and segment effects. People
owns any representative actor/persona behind an opaque ref. The Community
Overlay MVP remains local/P2P only; hosted distribution stays a future legal and
operational gate.

Nico decided the three FMX-148 forks live on 2026-06-19:

- D1: `NamedSupporterGroup` posture = opt-in/default-off.
- D2: People dependency = not a hard blocker when A&A uses only opaque refs.
- D3: legal/UGC scope = fictional local/P2P; hosted UGC is future-scope.

## Source-checked basis

- GDPR Article 6 requires a lawful basis per personal-data processing purpose.
  FMX should avoid needing one for the core supporter-group feature by keeping
  shipped supporter groups and reps fictional and not tied to real users or
  private people.
- GDPR Article 9 makes real-world political, religious, ethnic, health,
  sexuality and similar supporter labels high risk when tied to identifiable
  people. FMX should block these as real-person/community-pack data and avoid
  encoding them as group identity labels.
- The DSA surface is primarily a hosted-content problem. Commission guidance
  confirms easy illegal-content flagging, response to reports and appeal rights
  for online platform contexts; FMX should not activate hosted pack
  distribution without those workflows.
- UEFA Article 45 and the Premier League Fan Engagement Standard support
  representative contact points/forums. They do not imply a need to store
  individual fan dossiers.
- Football Manager's official Supporter Confidence feature is the strongest
  comparable-game source: aggregate fan categories and visible confidence/mood
  feedback are sourceable and readable.

## Recommended model

### `NamedSupporterGroup`

The group is a fictional aggregate overlay attached to one of the existing six
Audience & Atmosphere segments. It may include:

- IP-safe generated `displayName` and stable internal id.
- represented `segmentId`.
- `identityArchetype`: tradition, local-pride, youth-first, anti-owner,
  results-first, style-first or community-first.
- `redLines`: ticket prices, rival transfers, selling icons, sponsor category,
  defensive football, academy neglect or security restrictions.
- `mobilizationStyle`: choreo, banners, social campaign, boycott, meeting or
  delegation.
- `influenceBand` and `visibilityTier`.
- `source`: generated, scenario or local overlay.
- `policyVersion`.
- optional opaque `representativeActorRef` supplied by People.

It must not include real supporter-group identities, ordinary fan records,
membership lists, real handles, photos, private-person imports, real-world
political/religious/ethnic/health/sexuality labels, or platform account joins.

### Public contracts

- `OnboardNamedSupporterGroup` becomes specified but opt-in/default-off. It is
  valid only at save/scenario setup or local overlay import, not as a default
  MVP auto-feature.
- `NamedSupporterGroupOnboarded` carries fictional group facts and optional
  opaque actor refs only.
- `NamedSupporterGroupRoster` remains the opt-in read model, clearly separate
  from `SupporterSegment` population/mood truth.
- Mechanical mood, attendance, protest, trust and atmosphere effects still come
  from Audience & Atmosphere deterministic rules, not generated prose.

### People dependency

People is not a blocker for closing ADR-0062's named-group spec. The dependency
is satisfied at the architecture level by an opaque ref:

- People owns personhood, persona substrate and dialogue context card truth.
- A&A owns group facts and references a representative only as an opaque actor
  reference.
- A&A never stores People internals, relationship graph fields, OCEAN data,
  real contact details or user identity data.

### Local/P2P vs hosted UGC

MVP local/P2P overlay:

- validate schema, provenance, IP/naming, disallowed privacy fields and
  unsupported hosted-only fields;
- block real supporter groups, real private persons, real handles, photos,
  doxxing content and special-category-like labels;
- warn users that local packs are their responsibility and are not hosted by
  FMX.

Future hosted distribution gate:

- DSA Article 16 notice/action mechanism with content id/location, report
  reason, acknowledgement and review;
- appeal/complaint path and outcome notifications;
- moderation logs, repeat-abuse policy, revocation/takedown and provenance;
- DSAR/deletion, Privacy Notice/RoPA update and legal review;
- AI/prompt-injection trust treatment before hosted text reaches Narrative.

## Naming policy

FMX-54's policy+test depth is sufficient for ADR-0062. The generator/importer
must extend ADR-0007/GD-0015 to supporter groups, reps, chants/slogans, banners
and local overlay display names:

- no exact real club, fan-group, person, stadium, sponsor, chant or media names;
- no folded, confusable, phonetic, abbreviation, token-subset or
  city-descriptor thin disguises;
- no real ultras/curva/supporter-association examples in docs;
- generated names use safe locale/template vocabulary and stable internal ids;
- high-salience sample sets require manual review before release.

## Open gates

- Exact similarity thresholds, denylist scope and review cadence remain
  implementation/calibration follow-ups.
- Hosted community distribution is not activated by FMX-148.
- Legal counsel remains the release gate for any feature that processes real
  supporter/person data or hosts community content.

## Related

- [[raw-perplexity/raw-fmx-148-legal-privacy-ugc-2026-06-19]]
- [[raw-perplexity/raw-fmx-148-supporter-representation-2026-06-19]]
- [[raw-perplexity/raw-fmx-148-game-precedents-naming-2026-06-19]]
- [[raw-perplexity/raw-fmx-148-source-checks-2026-06-19]]
- [[../40-Execution/fmx-148-named-supporter-group-decision-record-2026-06-19]]
- [[fan-persona-privacy-and-naming-2026-06-01]]
- [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
- [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
- [[../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
- [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
- [[../50-Game-Design/GD-0015-ip-clean-data]]
