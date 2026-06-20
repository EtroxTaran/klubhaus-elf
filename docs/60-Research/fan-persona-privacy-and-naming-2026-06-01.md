---
title: Fan Ecology Persona Privacy and Creative IP-Safe Naming Review - Research Synthesis 2026-06-01
status: draft
tags: [research, privacy, gdpr, ip, naming, community, overlay, audience, atmosphere, fmx-54]
context: [audience-atmosphere, community-overlay]
created: 2026-06-01
updated: 2026-06-01
type: research
binding: false
linear: FMX-54
sourceType: external
related:
  - [[raw-perplexity/raw-fan-persona-privacy-and-naming-2026-06-01]]
  - [[../50-Game-Design/audience-and-atmosphere]]
  - [[../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../50-Game-Design/community-editor-and-datasets]]
  - [[../50-Game-Design/sponsorship-portfolio]]
  - [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
  - [[../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
  - [[../30-Implementation/privacy-and-consent]]
  - [[data-generators]]
  - [[ip-and-licensing]]
---

# Fan Ecology Persona Privacy and Creative IP-Safe Naming Review - Research Synthesis 2026-06-01

FMX-54 audits the Audience & Atmosphere named fan-group overlay, fan reps,
persona privacy boundaries, creative IP-safe naming and community overlay
handling. The goal is to keep the fan world rich enough for narration while
keeping mechanics aggregate, names fictional and future UGC/platform risk
explicitly gated.

## Locked guided decisions

Nico selected the recommended direction for all three open planning questions:

1. **Community overlay / DSA scope: Future-Scope.** MVP remains local file
   import / peer-to-peer sharing. Hosted pack distribution, pack discovery or a
   marketplace is not activated by FMX-54.
2. **Fan persona privacy scope: Fictional Aggregate.** Named fan reps are
   generated fictional actors attached to generated fan-group aggregates. They
   are not real fans, account profiles, real handles, photos, private-person
   imports or user profiling records.
3. **Naming depth: Policy + Tests.** This beat defines prohibitions,
   near-match rules and validation/review gates. It does not create a final
   generator implementation schema.

## Synthesis

Generated fan groups and fan reps are safest when they remain fictional
game-world content. They should not be sourced from real supporter lists, social
handles, photos, membership data, private-person names or real fan-group
identities. Segment state stays aggregate: population, mood, attendance,
volatility, trust, protest pressure and demand effects belong to Audience &
Atmosphere rules, not to individual people records.

Fan reps can exist as People/Narrative surface actors only. Their dialogue can
explain or dramatise a deterministic fan intent, but it cannot create mood,
attendance or protest effects by prose. Effects flow from the selected intent
and the Audience & Atmosphere model.

IP-clean naming must extend beyond clubs and players. The ADR-0007/GD-0015
policy now also covers fan groups, fan reps, supporter slogans/chants,
journalists, media outlets, board contacts, sponsor brands, venues and community
overlay names. Exact real strings are insufficient as a block condition: folded
strings, confusable characters, phonetic near-matches, famous abbreviations,
token-subset matches, protected city + descriptor pairs and "thin disguises"
must also be rejected or escalated.

Community overlays remain local/P2P at MVP. The local importer can show warnings
and run best-effort schema/IP/privacy checks, but FMX-54 does not create a
hosted platform. Hosted distribution is a future gate requiring DSA
notice/action, complaint and appeal handling, moderation/audit logs,
repeat-abuse policy, provenance metadata, takedown/revocation, AI transparency
labels where applicable, DSAR/deletion integration and Privacy Notice/RoPA
updates.

## Product and documentation policy

### FanPersonaPrivacyPolicy

- Fan groups are fictional aggregates over one of the six supporter segments,
  not real supporter organisations.
- Fan reps are generated fictional People/Narrative actors, attached to a group
  for presentation only.
- No individual supporter records are stored.
- No real private-person data, social handles, photos, membership lists or
  imported real fan identities are used.
- No real-world special-category profiling is modelled for users or real
  people. Fictional group identity labels stay gameplay-bound and category-free.
- Generated persona records live inside save/world state and follow the
  save/account deletion lifecycle.
- Backend analytics must not join fan-rep traits, supporter identity labels or
  special-category-like themes to a user account.

### NamingSafetyPolicy

- Block exact real names for clubs, players, coaches, fan groups, stadiums,
  sponsors, broadcasters, journalists, media outlets and prominent football
  personalities.
- Block thin disguises: homophones, famous abbreviations, token swaps, protected
  city + descriptor combinations, slogan echoes and confusingly similar brand
  structures.
- Run denylist checks after normalisation, case folding, punctuation folding,
  accent folding and confusable-character folding.
- Add phonetic and edit-distance/similarity checks for high-salience generated
  entities and narrative actors.
- Review generated samples per locale/world-size seed, with extra review for
  top-tier clubs, sponsor/venue names and narrative social-world actors.
- Community imports get the same policy as shipped data, plus visible warnings
  that local packs remain the user's responsibility.

### OverlayImportPrivacyPolicy

- MVP: local import/P2P only; no FMX-hosted pack marketplace.
- Local import should validate schema, required provenance fields, IP-denylist
  matches and disallowed privacy fields.
- Block or warn on real private persons, real supporter membership data, real
  fan-group handles, doxxing content, sensitive personal traits and AI
  impersonations of real people.
- Hosted future: DSA notice/action, complaints/appeals, moderation log,
  revocation, repeat-abuse policy, AI transparency labels, DSAR/deletion path,
  uploader identity retention and updated Privacy Notice/RoPA before launch.

## Ownership boundaries

| Concern | Owner |
|---|---|
| Segment population, mood, volatility, attendance, trust, protest pressure and demand | [[../50-Game-Design/audience-and-atmosphere]] |
| Generated fan-rep/persona cards and dialogue surface | People/Narrative direction, with mechanics still delegated back to Audience & Atmosphere |
| IP-clean naming and generated-data hardline | [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] + [[../50-Game-Design/GD-0015-ip-clean-data]] |
| Community pack import orchestration if ratified | [[../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]] |
| User/account privacy, DSAR/deletion and Privacy Notice | [[../30-Implementation/privacy-and-consent]] |
| Sponsor/venue naming in commercial systems | [[../50-Game-Design/sponsorship-portfolio]] + ADR-0007/GD-0015 |

## Acceptance scenarios

- A generated fan group named for an Ultras segment has a fictional name,
  segment, identity, red lines and influence band, but no individual supporter
  list or real-world organisation reference.
- A named fan rep appears in a dialogue scene. The scene can narrate the
  selected supporter intent; any mood, attendance or protest effect still comes
  from Audience & Atmosphere deterministic rules.
- A community pack imports a real supporter group's name, real social handle or
  membership list. The importer flags it under naming/privacy policy; hosted
  distribution remains unavailable.
- A generated sponsor, stadium, media outlet or fan group near-matches a famous
  real brand, venue, supporter association, abbreviation or slogan. The
  denylist/similarity gate rejects or escalates it.
- A pack tries to encode political, religious, ethnic or health labels for real
  supporters. The importer blocks it; FMX models only fictional, category-free
  gameplay identity labels.
- A future hosted mod platform is proposed. Work stops until DSA/UGC, AI
  transparency, Privacy Notice/RoPA, DSAR/deletion and moderation-retention
  decisions are prepared for Nico.

## Source base

| Source | Use in this synthesis |
|---|---|
| GDPR Articles 4, 6, 9, official text: <https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng> | Personal data boundary, lawful basis, special-category guardrails |
| EDPB SME guide: <https://www.edpb.europa.eu/sme-data-protection-guide/process-personal-data-lawfully_en> | Lawful-processing framing |
| WIPO sports IP overview: <https://www.wipo.int/en/web/sports> | Sports IP risk context |
| Manchester United v Sega, EWHC 1439: <https://mansfield.bailii.org/ew/cases/EWHC/Ch/2020/1439.html> | Football-game naming/IP risk precedent |
| Digital Services Act official text: <https://eur-lex.europa.eu/eli/reg/2022/2065/oj/eng> | Future hosted notice/action and platform-governance gate |
| EU AI Act official text: <https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng> | Future AI transparency gate |
| [[ip-and-licensing]] | Internal IP hardline and naming precedent |
| [[data-generators]] | Generator architecture and social-world actor extension |
| [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] | Binding naming architecture |
| [[../50-Game-Design/GD-0015-ip-clean-data]] | Binding game-design hardline for IP-clean data |
