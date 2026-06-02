---
title: Raw Perplexity - Fan Ecology Persona Privacy and Naming 2026-06-01
status: raw
tags: [research, raw, perplexity, privacy, gdpr, ip, naming, community, overlay, fmx-54]
created: 2026-06-01
updated: 2026-06-01
type: research
binding: false
linear: FMX-54
sourceType: perplexity
related:
  - [[../fan-persona-privacy-and-naming-2026-06-01]]
  - [[../../50-Game-Design/audience-and-atmosphere]]
  - [[../../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
  - [[../../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
  - [[../../30-Implementation/privacy-and-consent]]
---

# Raw Perplexity - Fan Ecology Persona Privacy and Naming 2026-06-01

> Raw FMX-54 research capture. This file preserves the substance of the
> Perplexity research passes and targeted source checks. It is not binding by
> itself; promoted decisions live in
> [[../fan-persona-privacy-and-naming-2026-06-01]] and the linked
> GDDR/ADR notes.

## Prompt 1 - GDPR lawful basis for generated fan personas

Research question: how GDPR Articles 4, 6 and 9 apply to fictional fan groups,
named fan reps and segment-level supporter state in a single-player football
manager game.

Condensed answer:

- GDPR applies only where information relates to an identified or identifiable
  natural person. Purely fictional generated supporter groups, fan reps, media
  contacts and board actors are game-world content, not personal data, if they
  are not derived from a real person and are not linked to a user account or
  real-world profile.
- Segment-level fan facts are safer than individual supporter records. Mood,
  attendance, protest risk and price sensitivity should stay aggregate per
  supporter segment or generated fan group.
- A named fan rep can still be safe if the actor is synthetic, generated from
  IP-clean corpora, and explicitly not a real supporter, real handle, real
  photo, real membership list or community-uploaded private person.
- Article 6 lawful basis analysis becomes relevant once FMX processes user
  account data, telemetry, hosted community uploads or imported data that
  identifies a natural person.
- Article 9 special-category risk should be avoided by design. Do not model
  real-world political opinion, religion, ethnicity, union membership, health or
  comparable sensitive traits for real persons or user profiles. Fictional
  supporter identity labels should be category-free and gameplay-bound
  ("tradition", "local pride", "results-first"), not demographic profiling.
- Retention should follow the save lifecycle. Generated fan personas live
  inside the save/world state and disappear with save/account deletion; no
  backend analytics should join persona traits to the user identity.

Source anchors:

- GDPR official text, especially Articles 4, 6 and 9:
  <https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng>
- EDPB SME guide on lawful processing:
  <https://www.edpb.europa.eu/sme-data-protection-guide/process-personal-data-lawfully_en>
- Irish Data Protection Commission guidance on legal bases:
  <http://www.dataprotection.ie/en/dpc-guidance/guidance-legal-bases-processing-personal-data>
- ICO lawful-basis guide:
  <https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/a-guide-to-lawful-basis/>

## Prompt 2 - Creative IP-safe naming for football-manager social worlds

Research question: how to name fictional fan groups, fan reps, sponsors,
stadiums, media outlets and sports-world personas without producing trademark,
passing-off, publicity-right or "thin disguise" risk.

Condensed answer:

- The same hardline used for clubs, players, stadiums and sponsors must extend
  to fan groups, supporter slogans/chants, journalists, media outlets, fan reps,
  board contacts and community overlay content.
- Risk is not limited to exact strings. Thin disguises, homophones, famous
  abbreviations, protected city + descriptor combinations, confusingly similar
  brand structures and player/person stand-ins are all unsafe.
- A generator policy should combine exact denylist, folded/normalised string
  matching, confusable character folding, token-subset matching, phonetic
  matching and edit-distance/similarity thresholds. Manual review is still
  needed for high-salience generated samples and narrative actors.
- Fan groups need additional guardrails: no real supporter association names,
  no real chants/slogans, no real ultras group names, no real social handles,
  and no real-world political or discriminatory labels. Gameplay identity
  should be fictional and abstract.
- Sponsor and venue names should use generic fictional commercial patterns,
  never real brands, famous campaigns, brand homophones, near-slogans or
  trademarked venue naming rights.
- Community imports should be treated as riskier than shipped data. Even local
  imports need visible warnings and best-effort validation; hosted distribution
  requires a separate legal/compliance gate.

Source anchors:

- WIPO sports IP overview:
  <https://www.wipo.int/en/web/sports>
- Manchester United Football Club Ltd v Sega Publishing Europe Ltd [2020]
  EWHC 1439 (Ch):
  <https://mansfield.bailii.org/ew/cases/EWHC/Ch/2020/1439.html>
- Internal FMX source:
  [[../ip-and-licensing]]
- Internal FMX source:
  [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
- Internal FMX source:
  [[../../50-Game-Design/GD-0015-ip-clean-data]]

## Prompt 3 - Community overlays, UGC, DSA and AI transparency

Research question: how community overlay / mod-pack persona data should be
handled if FMX later moves from local/P2P pack import to hosted distribution.

Condensed answer:

- Current FMX direction stays local file import / peer-to-peer sharing. That
  keeps FMX from operating a hosted pack marketplace in MVP and avoids pulling
  DSA hosting workflows into the current scope.
- Local import still needs user-facing warnings, schema validation, IP-safety
  checks and privacy validation. Packs should be blocked or strongly warned if
  they include real private-person data, real supporter membership lists, real
  fan-group handles, doxxing content, sensitive personal traits or generated
  impersonations of real people.
- Hosted distribution is a future product and legal gate. Before hosting packs,
  FMX needs notice-and-action intake, complaint/appeal handling, moderation
  logs, takedown/revocation workflow, repeat-abuse policy, creator provenance
  metadata and retention rules.
- AI-generated community content may trigger transparency obligations when it
  is presented as generated or manipulated content. At minimum, future hosted
  pack flows need labels and provenance fields for generated assets/personas.
- GDPR becomes relevant for hosted UGC if user accounts, uploader identities,
  moderation logs, takedown complainants or uploaded personal data are
  processed. The Privacy Notice, RoPA, DSAR export and deletion paths must be
  expanded before that launch.

Source anchors:

- Digital Services Act official text, especially Article 16 notice/action:
  <https://eur-lex.europa.eu/eli/reg/2022/2065/oj/eng>
- European Commission DSA Q&A:
  <https://ec.europa.eu/commission/presscorner/detail/en/QANDA_20_2348>
- EU AI Act official text, especially Article 50 transparency obligations:
  <https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng>
- GDPR official text:
  <https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng>
- Internal FMX source:
  [[../../10-Architecture/09-Decisions/ADR-0059-community-overlay-pipeline-context]]
- Internal FMX source:
  [[../../50-Game-Design/community-editor-and-datasets]]

## Guided Nico decisions captured for synthesis

- Community overlay / DSA scope: **Future-Scope**. MVP keeps local/P2P import;
  hosted distribution is documented as a future legal/platform gate.
- Fan persona privacy model: **Fictional Aggregate**. Fan reps remain generated
  fictional actors attached to segment/group aggregates; no real-person data or
  user profiling.
- Naming guardrail depth: **Policy + Tests**. Define rules, prohibitions,
  near-match checks and review/test gates, but do not design a full runtime
  implementation schema in this beat.
