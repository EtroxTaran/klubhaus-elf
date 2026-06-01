---
title: ADR-0007 IP-clean Naming Schema + Data Generators
status: draft
tags: [adr, ip, data-generation, names, crests, worldgen, privacy, gdpr, fmx-54]
created: 2026-05-15
updated: 2026-06-01
accepted_at: 2026-05-17
type: adr
binding: true
related: [[ADR-0004-data-model]], [[ADR-0005-save-format]], [[ADR-0016-community-dataset-overrides]], [[../../60-Research/data-generators]], [[../../60-Research/fan-persona-privacy-and-naming-2026-06-01]], [[../../60-Research/determinism-and-replay]], [[../../60-Research/performance-budgets]]
---

# ADR-0007: IP-clean Naming Schema + Data Generators

## Status

Accepted (2026-05-17, gap D2 of
[[../../95-Archive/gap-reports/wave-3-gap-analysis]]).

## Context

The legacy 10-line ADR-0007 said only: "generate fictional club /
crest / stadium / player names; no real Bundesliga / EPL / La Liga
trademarks". That was sufficient as a constraint but not as
implementation guidance.

The full procedural worldgen research is captured in
[[../../60-Research/data-generators]] (gap D2, 2026-05-17). This ADR
locks the architectural rules + IP-safety contract; the research note
is the binding implementation reference.

## Decision

The product is **fully procedurally generated** from a single
`worldSeed` and is **IP-clean by construction**.

### 1. No real-world identifiers

The product MUST NOT include the following real-world identifiers as
in-game data:

- Real club names (e.g. `Bayern Munich`, `Manchester United`).
- Real club crests, kit designs, or trademarked colour combinations.
- Real player full names (`Erling Haaland`, `Lionel Messi`).
- Real coach / manager / referee / journalist names.
- Real league names where trademarked (`Bundesliga`, `Premier League`,
  `La Liga`, `Serie A`).
- Real federation names where trademarked (`DFL`, `FIFPro`).
- Real stadium names where trademarked (`Allianz Arena`,
  `Signal Iduna Park`).
- Real sponsor brand names.

Mirroring **real league structures** (pyramid shape, promotion /
relegation count, club count per tier) is permitted; trademarked
names are not.

### 2. Real-region / fictional-city policy

Per D2 §6, **regions** (country, state, Bundesland, region, county)
ARE real, sourced from **GeoNames** under CC-BY 4.0 (attribution in
in-app credits).

**Cities** are procedurally generated via phonotactic recombination
of region-typical syllables, validated against a Bloom filter to
**reject any name that matches a real GeoNames city**. This produces
plausible regional flavour ("Borussia Schwarzwald", "FC Brennsdorf")
without any real city-club pairs.

### 3. Name generator architecture

Per [[../../60-Research/data-generators]] §3-4:

- Algorithm: **hybrid wordlist-based primary + phonotactic fallback**
  for rare locales.
- Tier 1 locales at MVP: DACH, British Isles, France, Spain, Italy,
  Low Countries, Lusophone (7 buckets).
- Tier 2 locales post-MVP: Nordic, Eastern Europe, Hispanic LATAM,
  Turkey, Asia (JP/KR/CN), Arabic, Africa (3 buckets).
- Per-locale composition rules at MVP (must-have): Spanish two-
  surname, Portuguese particles, Dutch tussenvoegsel, German `von`
  with low probability. Deferred: Polish gendered, Japanese ordering,
  Korean two-syllable, Arabic patronymics.

### 4. Approved corpus sources

Per [[../../60-Research/data-generators]] §3.2:

| Source | License | Status |
|---|---|---|
| **Wikidata** (humans, given names, family names) | CC0 1.0 | Primary corpus |
| **UK ONS** baby names | Open Government Licence v3.0 | Approved (attribution) |
| **US SSA** baby names | Public domain | Approved |
| **INSEE** (France) | Etalab / Open Licence | Approved (attribution) |
| **ISTAT, CBS, Statbel, Destatis, IBGE** | Various open / mixed | Approved per-dataset |
| **GeoNames** | CC-BY 4.0 | Approved for regions / city Bloom filter (attribution) |
| **Behind the Name** | Proprietary | **FORBIDDEN** |
| **Wikipedia raw text** | CC-BY-SA 4.0 | **FORBIDDEN** (share-alike risk) |
| **Common Crawl** | Mixed | **FORBIDDEN** |
| **GitHub repos without explicit OSS license** | Unclear | **FORBIDDEN** |

Build-time scripts MUST emit
`packages/game-data/CORPUS-PROVENANCE.md` listing source dataset ID,
license, URL, and access date for every shipped corpus.

### 5. Living-person filter

When pulling from Wikidata, the build-time pipeline MUST filter out
records where `instance_of (P31) = human` AND `date_of_death (P570)`
is unset (i.e. living persons). Only name strings are kept; no
name + nationality + birth-date tuples that could identify real
people are exported.

### 6. Crest generation

Per [[../../60-Research/data-generators]] §5:

- Algorithm: **grammar-based hybrid with lazy generation**.
- 7 shield shapes × 8 divisions × 10 palettes × 40-50 charges × 4
  border styles × 3 banner styles → ~5 M unique combinations.
- Region-biased shape and palette priors (DE → more
  yellow-black + heater; IT → more roundel + blue-white).
- At world creation: only the `CrestDesign` struct (~6 bytes packed)
  is stored per club.
- SVG string rendered on first display; cached as data URI in
  IndexedDB under `club_crest_cache:<clubId>`.
- Pure SVG output; **no WebGL, no raster, no 3D** (per D9
  permanent product decision: no 3D).
- ~1-3 ms per crest render; ~30-40 KB gzipped total crest module
  bundle.

### 7. Crest icon library — IP-safe

Per D2 §5.3:

- ~40-50 charge icons inlined as TS path strings in
  `packages/game-data/src/crests/icons/`.
- Original art **restyled** from Game-Icons.net (CC-BY 3.0) +
  Heroicons (MIT) + Tabler (MIT). Attribution credits required for
  CC-BY-3.0 sources (rendered on the in-app "Credits / Sources"
  screen).
- No copying of national emblems, military insignia, religious
  iconography, or specific real-club emblems.
- No use of CC-BY-SA Wikimedia heraldic SVGs (share-alike risk).

### 8. Club tier model

Per [[../../60-Research/data-generators]] §7:

- 5 tiers per country (Top Flight, Tier 2, Tier 3, Tier 4, Tier 5).
- Country × Tier finance matrix locks wage bills, transfer budgets,
  attendance, prestige ranges for 10 starting countries (DE, EN, ES,
  IT, FR, PT, NL, BR, AR, JP).
- Money + attendance use **log-normal distributions**; prestige uses
  truncated normal clamped 0-100.
- All values driven by `(country_multiplier × tier_band ×
  prestige_factor × noise)` formula.

### 9. Player attribute schema

Per [[../../60-Research/data-generators]] §10:

- **16 visible attributes** (7 Technical + 5 Mental + 4 Physical) on
  a 1-20 integer scale.
- **4 GK-only extras** (reflexes, handling, aerial reach,
  distribution).
- **8 hidden meta attributes** (potential, consistency, pressure,
  professionalism, determination, adaptability, injury proneness,
  big matches).
- Schema maps cleanly to the match-engine basis-points contest math
  (per [[../../60-Research/match-engine-simulation-model]]) via
  `attr × 500 = success_bp`.

### 10. Player generation algorithm

Per [[../../60-Research/data-generators]] §11:

- **Hybrid archetype-first + CA budget allocator** with **~50
  archetypes** (sweeper keeper, ball-playing CB, inverted FB,
  deep-lying playmaker, box-to-box CM, inside forward, poacher,
  target man, etc.).
- Pipeline: pick `(nation, club_tier, age_band, position,
  archetype)` → sample PA from skewed nation × club-quality
  distribution → sample CA from age + environment → Dirichlet
  allocation of CA across attributes per archetype weights.
- **Lazy expansion** for Tier C players (lower leagues; ~85-90 % of
  total): store only compact profile (~12 bytes); expand to full
  attributes on demand (scouted / drafted / faced in match). Massive
  perf + storage saving.

### 11. RNG stream extension

Per [[../../60-Research/data-generators]] §12:

- New RNG stream **`GeneratorRng`** (stream #9) added to
  [[../../60-Research/determinism-and-replay]] §2.2.
- Hierarchical sub-stream labels: `generator:country:<id>`,
  `generator:league:<country>:<tier>`, `generator:club:<id>`,
  `generator:club:<id>:crest`, `generator:club:<id>:stadium`,
  `generator:player:<clubId>:<slotIndex>`,
  `generator:player:<playerId>:attributes`, etc.
- Per D8 §2.3, this addition does NOT affect any existing replay
  because seed derivation is by label, not by sequence position.
- Same `worldSeed` → byte-identical world.

### 12. Generation order

Canonical order for genesis (debug-equivalence):

1. Countries (sorted by `countryId`).
2. Leagues per country (sorted by tier ascending).
3. Clubs per league (sorted by internal ID).
4. Per club: stadium → staff → crest design → squad slots.
5. Players (sorted by `clubId`, then `slotIndex`).

### 13. Community packs (per ADR-0016)

Community-contributed content via the override-pack pipeline:

- Custom name corpora per locale (validated against §5 living-person
  filter + provenance requirements).
- Custom crest icon packs (must declare license; CC-BY and MIT
  accepted).
- Custom city / region overlays (must respect §2 real-region /
  fictional-city policy).

Pack acceptance requires the same legal-cleanliness contract as the
shipped core data.

### 13a. FMX-54 fan, media and commercial persona naming

The naming contract extends to every generated social-world and commercial
surface introduced for AI narration, fan politics, sponsor activation and
community overlays:

- fan groups, fan reps and supporter slogans/chants;
- journalists, media outlets and board/agent/staff persona names;
- sponsor brands, venue names, hospitality/commercial partners and fan-service
  campaign labels;
- community override pack names, manifest display names and imported name
  corpora.

All such actors are fictional. They MUST NOT be real-person stand-ins, real
supporter organisations, real fan-group handles, real chants, real sponsor
brands, real venues, famous media brands or confusingly similar variants.

The generator and import gate must reject or escalate:

- exact denylist hits after normalisation, case folding, accent folding,
  punctuation folding and confusable-character folding;
- token-subset matches and protected city + descriptor combinations;
- famous abbreviations and acronyms from clubs, fan groups, brands and venues;
- phonetic near-matches and high-similarity edit-distance matches for
  high-salience names;
- real private-person data, real supporter membership lists, photos, social
  handles or special-category-like fan labels.

Community overlay remains local/P2P at MVP. Hosted pack distribution is blocked
until a separate DSA/UGC/privacy/AI-transparency gate is prepared and approved.

## Consequences

### Positive

- **Legal cleanliness as a marketing differentiator**: most
  competitors rely on licensed real-world data; we have a clear
  provenance story that resists IP challenge.
- **Procedural world is the canonical experience** — no "real names
  add-on", no licensing-cliff risk if a federation pulls licences.
- **Lazy expansion** keeps the Large world (~62 500 players)
  feasible on Snapdragon 695 within the D9 performance budgets.
- **Region-biased crests + cultural naming rules** are a polish
  point that no PWA competitor matches.
- **Determinism preserved**: same `worldSeed` always produces the
  same world; replays remain stable across engine updates as long
  as the generator subsystem labels don't change.

### Negative

- Initial corpus build is significant engineering work
  (~packages/game-data/ build scripts to pull Wikidata + national
  open-data; deduplication; license metadata; provenance tracking).
- ~150-200 KB gzipped Tier-1 corpus on initial install
  (acceptable per D9 §5.1 budgets).
- Some players may feel the lack of "real club packs" — we offset
  this with the community-pack pipeline (ADR-0016).
- Procedural crests will never match the polish of hand-designed
  real club crests; we mitigate via region-biased grammar +
  curated icon library.

### Future

- **D13 Women's football**: corpora + archetypes need female
  variants; schema already supports it.
- **D15 Narrative content**: club / manager bios use the same RNG
  stream with `:narrative:*` labels.
- **Phase 2 locale rollout** (Tier 2 buckets) post-MVP.
- **Server-side world genesis** (per ADR-0019 §service extraction):
  hot-seat-to-async-MP promotion (per ADR-0011) can re-generate the
  same world server-side from the master seed.

## Design source

Implements the approved IP-clean data record [[../../50-Game-Design/GD-0015-ip-clean-data]] and constrains [[../../50-Game-Design/GD-0009-league-structure]] plus current world-generation notes in [[../../50-Game-Design/README]].

## Compliance

The following rules apply to all code in `packages/game-data/` +
any module consuming generator output:

- All generator code MUST use `GeneratorRng` (stream #9) sub-labels;
  `Math.random` is forbidden (per D8 §2.4).
- Build-time scripts MUST emit `CORPUS-PROVENANCE.md` with full
  license + source metadata for every shipped corpus.
- The Wikidata pull MUST apply the living-person filter (§5).
- City names MUST be Bloom-filter checked against the real GeoNames
  city dataset; matches are rejected.
- The crest grammar MUST produce SVG output only; no WebGL / no
  raster / no 3D (per D9 permanent product decision).
- The icon library MUST cite original sources in
  `packages/game-data/src/crests/icons/CREDITS.md`.

CI enforcement:

- Lint rule: `Math.random` forbidden in `packages/game-data/src/`.
- Test rule: every locale corpus has a provenance metadata test.
- Test rule: generator output is byte-identical for the same seed
  across runs (golden test with 10 canonical seeds).
- Test rule: living-person filter unit test (Wikidata fixtures
  including living + deceased; only deceased pass through).
- Test rule: Bloom-filter false-positive rate < 1 % on a 100k-real-
  city sample.
- Test rule: 0 real-world club / player / coach names in shipped
  corpora (string-match list of 1 000 known real names; if any
  match in shipped data → fail build).
- Test rule: 0 generated fan group, fan rep, journalist, media outlet, sponsor,
  venue or supporter slogan names match the denylist or configured near-match
  thresholds.
- Test rule: community import fixtures with real supporter groups, real handles,
  real private-person data or special-category-like fan labels are rejected or
  flagged before activation.
- Review rule: high-salience generated samples (top-tier clubs, sponsors,
  venues and narrative social-world actors) receive periodic manual review
  before corpus/generator promotion.

## Sources

- [[../../60-Research/data-generators]] (gap D2, 2026-05-17) — full
  research note; binding implementation reference.
- [[../../60-Research/determinism-and-replay]] (gap D8) — PCG32 +
  label-derived RNG streams; this ADR adds stream #9.
- [[../../60-Research/performance-budgets]] (gap D9) — world-size
  presets + perf budgets; lazy expansion sized to meet ≤ 5-8 s
  world-gen on Snapdragon 695.
- [[ADR-0027-postgres-data-model]] (supersedes ADR-0004) — `player` +
  `club` typed Drizzle table (SCHEMAFULL-governance) definitions.
- [[ADR-0005-save-format]] — compressed binary save envelope; gen
  outputs are part of the save payload.
- [[ADR-0016-community-dataset-overrides]] — override pack pipeline
  for community-contributed names + crests + locale extensions.
- Wikidata Licensing (CC0 1.0), UK ONS Open Government Licence v3.0,
  Etalab Open Licence (INSEE), GeoNames CC-BY 4.0, Game-Icons.net
  CC-BY 3.0.
- D2 Q&A with Nico (2026-05-17): all 8 recommendations accepted.
