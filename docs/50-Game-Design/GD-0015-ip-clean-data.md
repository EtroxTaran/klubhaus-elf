---
title: GD-0015 IP-clean Data Generation
status: accepted
tags: [game-design, gddr, ip, gamedata, privacy, gdpr, naming, community, fmx-54]
created: 2026-05-17
updated: 2026-06-08
type: game-design
binding: true
related: [[README]], [[GD-0009-league-structure]], [[GD-0003-squad-players]], [[../60-Research/ip-and-licensing]], [[../60-Research/fan-persona-privacy-and-naming-2026-06-01]], [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]], [[../10-Architecture/modules/game-data]], [[../00-Index/Non-Goals]]
---

# GD-0015: IP-clean Data Generation

## Status

approved

> Ratified — restates accepted ADR-0007 and the ip-and-licensing §9 decision.
> The Wave-2 generation *algorithm* (R2-02) is NOT approved.

## Date

2026-05-17

## Player experience goal

A believable football world with familiar structure and zero real IP — the
player never sees, or can search for, a real club or player.

## Decided / strong (ratified)

- **Fully IP-clean at v1**: no real clubs, players, crests, sponsored stadium
  names, or protected competition names; **league structures mirrored** (formats
  uncopyrightable) (ip-and-licensing TL;DR/§9; ADR-0007 accepted).
- Naming schema is **deterministic, `gameId`-seeded, denylist-driven**; all
  generators pass `packages/game-data/src/ip-denylist.ts`;
  `pnpm gamedata:lint` fails on any denied string (ip-and-licensing §5/§9;
  ADR-0007 Consequences).
- **Club names**: `Prefix? Locality Suffix?` from geographic/civic/heraldic
  morphemes; rejected if matching denylist or `top-2000-real-clubs.txt`
  (ip-and-licensing §5.1).
- **Crests/colours** generated procedurally (heraldic vocabulary, 80-colour
  set, optional fictional Latin motto); real club+city matches blocked; SVG
  owned; no raster upload of real crests (ip-and-licensing §5.2/§7).
- **Player names**: locale-aware from CC BY-SA/CC0 data, verified against a
  build-time bloom filter of ~70y of pro footballers (FP <0.5% ⇒ reseed);
  near-miss "tricks" blocked via Levenshtein ≤2 vs top-200 (ip-and-licensing §6).
- **Stadiums / sponsors / broadcasters** fictional patterns, denylist-checked
  (Interbrand top-500 for brands) (ip-and-licensing §5.3/§5.5).
- Hybrid country model: **real country names + ISO codes** for nationality;
  **fictional country names for league branding**; club abbreviations
  (`FCB`,`BVB`,`PSG`) blocked (ip-and-licensing §8/§9).
- Never ship a thin disguise of a real club; **no real-club name on the input
  side** (no "find your favourite club" search) (ip-and-licensing §4.7).
- Excluded gameplay content: doping mini-game, illegal accounting, gambling
  sponsor draws (anstoss-series-deep-dive §6 "Hard boundaries").

## FMX-54 persona and community naming amendment

The IP-clean rule also applies to the social and commercial world around the
club, not only to club/player master data:

- Fan groups, fan reps, journalists, media outlets, board contacts, agents,
  sponsor brands, venues, supporter slogans/chants and community overlay names
  are generated fictional data by default.
- No real supporter association names, real ultras group names, real social
  handles, real chants/slogans, real private-person names, famous brand
  homophones or thin disguises are allowed.
- Fan groups and fan reps are fictional aggregate/narrative actors; they must
  not contain real supporter membership lists, photos, user-account profiles or
  real-world special-category labels.
- Community override packs remain local/P2P at MVP. Import can warn and run
  best-effort validation, but hosted pack distribution is future-scope and needs
  a separate DSA/UGC/privacy gate before activation.

Policy + test gate:

- Run exact denylist checks after normalisation, case folding, accent folding,
  punctuation folding and confusable-character folding.
- Add token-subset, phonetic and edit-distance/similarity checks for
  high-salience names: clubs, venues, sponsors, fan groups, fan reps, media
  outlets and journalists.
- Block protected city + descriptor combinations and famous abbreviations
  (`FCB`, `BVB`, `PSG`, sponsor/venue shorthand, supporter group acronyms).
- Review generated samples per locale/world-size seed, with extra manual review
  for top-tier clubs and narrative social-world actors.

## Open (Wave 2)

- **R2-02 (critical)** — the generation *algorithm* (Markov/n-gram/LM names;
  crest SVG synthesis; budget/wage tiers; bloom-filter pipeline; CC BY-SA
  viral-risk handling). Two `needs-decision` items: community datapack opt-in
  (default: off, revisit M5+); editor-typed real names (default: EULA + dialog).

## Rationale

Formats are facts (safe); names/brands are the IP risk, so they are generated,
seeded and CI-enforced (ip-and-licensing §9).

## Consequences

Positive:

- Zero licensing exposure; deterministic, regenerable world.

Negative / constraints:

- `packages/game-data` is bound by the denylist + CI gate; generation
  algorithm blocked on R2-02.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] (accepted)
- [[../10-Architecture/09-Decisions/ADR-0004-data-model]] (generator-backed schema)

## Related

- Research: [[../60-Research/ip-and-licensing]]
- Module: [[../10-Architecture/modules/game-data]]
- [[README]] — hub · siblings: [[GD-0009-league-structure]] · [[GD-0003-squad-players]] · [[GD-0014-save-career-model]]
