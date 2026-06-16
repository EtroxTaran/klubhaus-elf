---
title: Data Generators — Names, Crests, Cities, Clubs, Players
status: current
binding: true
tags: [research, data-generation, worldgen, names, crests, players, clubs, determinism, ip-safe, privacy, gdpr, fmx-54]
created: 2026-05-17
updated: 2026-06-01
type: research
related: [[../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../10-Architecture/09-Decisions/ADR-0004-data-model]], [[../10-Architecture/09-Decisions/ADR-0005-save-format]], [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]], [[../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides]], [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]], [[determinism-and-replay]], [[performance-budgets]], [[surrealdb-schema-patterns]], [[eos-player-staff-skills-and-personas-2026-05-28]], [[ai-narration-world-and-dialogue-mvp-2026-05-28]], [[fan-persona-privacy-and-naming-2026-06-01]], [[../50-Game-Design/scouting-and-recruitment]], [[../50-Game-Design/youth-academy-and-development]], [[../50-Game-Design/club-dna-and-governance]], [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
---

# Data Generators — Names, Crests, Cities, Clubs, Players

> Gap D2 of [[../95-Archive/gap-reports/wave-3-gap-analysis]]. Locks the procedural-generation
> architecture for fictional names, crests, cities, clubs (with finances
> + stadium + prestige), and players (with attribute schema + archetype
> + lazy expansion) for an offline-first PWA football manager. All
> generators are deterministic from a single `worldSeed`. All output is
> IP-safe by construction.

## 1. Context and inputs

This note assembles a complete worldgen architecture on top of
decisions already locked elsewhere:

- **ADR-0007 Naming Schema** (current draft, promoted to `accepted`
  by this note): fully fictionalised; no real Bundesliga / EPL /
  La Liga / Serie A / DFL / FIFPro names or assets.
- **ADR-0004 Data Model** (substrate superseded by
  [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]):
  `player` + `club` are typed Drizzle tables (typed columns + `CHECK`)
  with intra-context FKs on opaque branded `uuid` refs; integer-only
  numerics; app-generated UUIDv7 IDs.
- **ADR-0005 Save Format**: compressed binary saves; engine-version
  pinned; deterministic re-load.
- **D8 Determinism + Replay** ([[determinism-and-replay]]): PCG32 via
  `pure-rand`; 8 named RNG streams; **stream additions are forward-
  compatible by label** — adding a 9th stream does not invalidate
  existing replays. This note adds stream #9 `GeneratorRng` (§12).
- **D9 Performance Budgets** ([[performance-budgets]]): world-size
  presets Small (~700 players / 1 nation), Medium (~2 500 / 3),
  Large (~7 500 / 8); ~5 s budget for full world genesis on Snapdragon
  695; total IndexedDB usage ≤ 200 MB.
- **D14 Schema Patterns** ([[surrealdb-schema-patterns]], substrate
  superseded by
  [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]):
  per-save schema isolation (one Postgres `save_<…>` schema per save);
  the governance split is typed columns + `CHECK` for the structured
  core vs `jsonb` (Zod-validated) for SCHEMALESS event payloads; Drizzle
  is the source of truth with a generated `packages/db-schema` Zod
  mirror.
- **A3 Match Engine** (ADR-0003): match engine reads from generated
  player attributes via integer basis-points contests; the attribute
  schema below MUST be representable in the contest math.

This note adds: the full Country × Tier matrix, locale corpus strategy,
crest grammar, city-naming policy, archetype library, lazy-expansion
strategy, and the RNG-stream extension.

## 2. Comparative analysis — how other manager games generate worlds

Distilled from public dev commentary, modding community reverse-
engineering, and product teardowns.

### 2.1 Comparison table

| Game | Approach | Player attrs | Newgen depth | Procedural clubs? | IP strategy |
|---|---|---|---|---|---|
| **Football Manager** (PC) | **Real clubs** + procedural **newgens** (regens) over time. CA/PA split; nation youth output. ~40 visible + ~14 hidden attrs on 1-20 scale | Maximum (full taxonomy) | World-class - the industry reference | No procedural worlds | Real licences + community real-name fix mods |
| **FM Mobile** | Same regen system, simplified | ~20 visible | Strong | No | Same |
| **Anstoss 1-3** (legacy DE) | **Procedural random worlds** since A2; simplified clubs + players; tier-based budgets | 4-7 attrs per player | Light | **Yes** - random world generator | Fully fictional in random mode; licensed in regular |
| **Top Eleven** | One user-club per "world"; thin server-sim; user crest builder | 5 attrs (AT/DE/ST/GK/fitness) | Minimal | No (each user is their own club) | Fully fictional |
| **OSM** | Real clubs licensed; no procedural | 3-5 stats simplified | None | No | Licensed |
| **Hattrick** | Procedural world; deterministic per-server; 7 skills 20-level scale; weekly youth pulls | 7 skills | Light | **Yes** - structured pyramid | Fully fictional |
| **SM24** | Real clubs licensed | Moderate (~10-15 attrs) | Light | No | Licensed |
| **EA SPORTS FC Career** | Real clubs + procedural **youth regens** for academy | 6 visible (PAC/SHO/PAS/DRI/DEF/PHY) + card | Moderate | No | Real licences + FIFPro |
| **Champ Man Mobile** (legacy) | Real clubs + simple newgens | ~10 attrs | Light | No | Licensed |

### 2.2 The two architectures (and where we land)

The market splits cleanly:

- **Real-club games with procedural newgens** (FM / FM Mobile / SM /
  EA FC / Champ Man / OSM): rely on the licensed real-world DB as
  the world-genesis; newgens only add youth players over time.
- **Procedural-world games** (Anstoss random mode / Hattrick / Top
  Eleven): generate the entire world from a seed.

We are in the **second camp by ADR-0007 constraint**: no real names
ever. This pushes us toward Hattrick / Anstoss-random as the closest
prior art — but both are decades old, and neither shipped a polished
modern procedural-crest system or rich cultural naming. We have room
to be the **best-in-class** procedural-worldgen manager in 2026.

### 2.3 Techniques we adopt

| # | Technique | Source | Adoption |
|---:|---|---|---|
| 1 | **Wordlist-based name generation + cultural composition rules** | Everyone | **Primary technique** (§4) |
| 2 | **CA / PA split with hidden potential** | FM newgens (industry reference) | Locked (§10-11) - extended to "potential range" |
| 3 | **Archetype-first player generation** | FM's role + duty model | Locked - 50 archetypes (§11) |
| 4 | **Lazy expansion of obscure players** | Hattrick (server-side; deterministic) | Locked - compressed records + on-demand expansion (§11.6) |
| 5 | **Country × Tier finance matrix** | FM (from real-world data); Anstoss random worlds | Locked - 10-country starting matrix (§7) |
| 6 | **Log-normal money distributions** | Real-world football economics | Locked (§7.4) |
| 7 | **Hierarchical seed derivation** | Hattrick + modern PRNG practice | Locked (§12) |
| 8 | **Region-biased crest grammar** | Hattrick simple templates - nobody does this well | **Our unique twist** (§5) |
| 9 | **Procedural crests as a polish point, not an afterthought** | FM's procedural crests are widely mocked | **Our unique twist** (§5) |
| 10 | **IP-safe public-domain corpus (Wikidata / GeoNames)** | Nobody does this cleanly | **Our unique twist** (§3, §6) |

### 2.4 Our unique style

Where we differ from every competitor:

- **Wikidata CC0 + government open-data primary corpus** — proprietary
  / scraped name databases are the industry default; our legal-
  cleanliness story is a marketing differentiator.
- **Region-biased crest grammar** — FM procedural crests are widely
  mocked as ugly; Top Eleven gives users a logo builder; nobody does
  region-coherent procedural crests well. We do.
- **Lazy expansion** — enabled by our determinism (D8) + offline-first
  storage (A2). Hattrick does similar server-side; we do it client-
  side without burning IndexedDB.
- **Same generators run client-side AND post-MVP server-side** (per
  ADR-0019 service extraction). World genesis runs in a Web Worker on
  the client at MVP; server-side genesis remains useful for server-created MP
  sessions, but FMX-189 forbids hotseat/SP saves as MP seed material.
- **No 3D crest rendering** (per D9) — pure SVG, scales to all DPRs,
  ~1-3 KB per crest. Bundle-friendly + offline-friendly.

## 3. Locale strategy

### 3.1 Locale list at MVP

Two-tier locale rollout:

**Tier 1 (MVP)** — 7 buckets covering Bundesliga + EPL + top-5
European leagues + Lusophone South America:

| Bucket | Countries | Why MVP |
|---|---|---|
| DACH | Germany, Austria, Switzerland | Primary audience |
| British Isles | England, Scotland, Wales, Ireland | Secondary audience (EPL fans) |
| France | France | Top-5 league + francophone fan base |
| Spain | Spain | Top-5 league + LaLiga fans |
| Italy | Italy | Top-5 league + Serie A fans |
| Low Countries | Netherlands, Belgium | Strong football culture + Eredivisie fans |
| Lusophone | Portugal, Brazil | Top developer of talent + Brazilian player pool feeds elsewhere |

**Tier 2 (post-MVP)** — extended set:

| Bucket | Countries |
|---|---|
| Nordic | Denmark, Sweden, Norway, Finland, Iceland |
| Eastern Europe | Poland, Czechia, Slovakia, Hungary, Croatia, Serbia, Ukraine |
| Balkans | additions to above |
| Hispanic LATAM | Argentina, Uruguay, Chile, Colombia, Peru, Mexico |
| Turkey | Turkey |
| Asia | Japan, South Korea, China |
| Arabic | Egypt, Morocco, Tunisia, Saudi Arabia, UAE, Qatar |
| Africa | Francophone Africa, Anglophone Africa, Lusophone Africa (3 buckets) |

Total Tier 1 corpus: ~150-200 KB gzipped. Total with Tier 2:
~400-500 KB. Loaded lazily by locale on demand for transfer market
+ scouting screens.

### 3.2 Corpus sources

| Source | License | Use |
|---|---|---|
| **Wikidata** | CC0 1.0 | **Primary** for given names + surnames + nationality filter |
| **UK ONS** | Open Government Licence v3.0 (commercial OK with attribution) | UK given names |
| **US SSA Baby Names** | Public domain | US given names (used for diaspora) |
| **INSEE** (France) | Etalab / Open Licence (commercial OK with attribution) | French given names |
| **ISTAT** (Italy) | Open license (verify per dataset) | Italian given names |
| **CBS** (Netherlands) | CC-BY-style | Dutch given names |
| **Statbel** (Belgium) | Open data | Belgian given names |
| **Destatis** (Germany) | Mixed (some datasets open; surnames typically from Wikidata) | German given names |
| **IBGE** (Brazil) | Open | Brazilian given names |
| **GeoNames** | CC-BY 4.0 (attribution required) | Real regions / cities (§6) |
| **Behind the Name** | Not free for commercial bulk use | **DO NOT USE** |
| **Wikipedia raw text** | CC-BY-SA 4.0 | **DO NOT USE** (share-alike would taint our DB) |
| **Common Crawl** | Mixed (original content still copyrighted) | **DO NOT USE** |

All build-time scripts MUST log corpus provenance + license per name
into `packages/game-data/CORPUS-PROVENANCE.md`. Attribution rendered
in the in-app "Credits / Sources" screen.

### 3.3 Locale composition rules

Must-have at MVP (per locale):

| Locale | Composition rule | Notes |
|---|---|---|
| DACH | `First Last`; `Last-Last` hyphenated (~5 %); `First von Last` (~1 %) | "von / zu" particle list ~10 entries |
| British Isles | `First Last`; `First Last-Last` (~5 %); Welsh / Irish first names weighted by sub-region | Scottish surnames separate weights |
| France | `First [Second] Last`; `Last-Last` hyphenated (~3 %) | |
| Spain | `First [Second] LastP LastM` — two surnames required | Shirt name typically `LastP`; UI must support |
| Italy | `First Last`; optional middle | Regional weighting deferred to Tier 2 |
| Low Countries | `First [tussenvoegsel] Last` — `van`, `van der`, `de`, `ter`, `ten` particles | Store `tussenvoegsel` separately for sort |
| Lusophone | `First [Second] [particle] LastP [LastM]` — `de`, `da`, `do`, `dos`, `das` particles common | Brazilian: optional single-name nickname field |

Deferred to Tier 2:

- Polish gendered surnames (`-ski / -ska`) — relevant only with women's
  football or detailed Eastern Europe.
- Japanese family-name-first ordering — UI toggle.
- Korean two-syllable given names with hyphen.
- Arabic patronymic `ibn / bin / bint` middle parts.
- Italian regional first-name clustering.

## 4. Name generation algorithm

### 4.1 Algorithm: Hybrid wordlist + phonotactic fallback

**Primary** for Tier 1 locales: wordlist-based weighted sampling.

```ts
// packages/game-data/src/names/types.ts

export interface FirstNameEntry {
  name: string
  gender: 'M' | 'F' | 'U'
  weight: number   // build-time normalised to cumulative
}

export interface LastNameEntry {
  name: string
  weight: number
  particle?: string  // 'von', 'de', 'van der', etc.
  hyphenable?: boolean
}

export interface LocaleNameConfig {
  id: LocaleId           // 'de', 'en-gb', 'es', 'pt-br', ...
  firstNames: FirstNameEntry[]
  lastNames: LastNameEntry[]
  particles: ParticleSet   // {given, surname} optional
  composition: CompositionRule  // see §3.3
}
```

Generation pipeline per player:

1. Derive `seed = hash(masterSeed, 'generator/player/' + playerId + '/name')`.
2. Sample `gender` from configured distribution (default 100 % male
   at MVP; D13 women's-football gap separately).
3. Sample `firstName` via cumulative-weight binary search on PRNG roll.
4. Sample `lastName` via same mechanism.
5. Apply composition rule (e.g. Spanish two-surname → sample second
   surname).
6. Apply particle injection at the configured probability.
7. Return `GeneratedName` record:
   ```ts
   interface GeneratedName {
     localeId: LocaleId
     given: string[]          // ['Carlos', 'José']
     surname: string[]        // ['García', 'López']
     particle?: string
     shirtName: string        // 'García' or 'C. García'
     fullDisplay: string      // 'Carlos José García López'
     sortKey: string          // 'GARCIA LOPEZ CARLOS JOSE'
   }
   ```

Performance: O(log n) per name via cumulative-array binary search;
~7 500 names × ~3-5 µs/name = ~25-40 ms on Snapdragon 695. Well
within the §13 budget.

### 4.2 Phonotactic fallback (Tier 2 + underrepresented locales)

For locales with < 200 names in the corpus, supplement with a tiny
phonotactic generator:

```ts
interface Phonotactics {
  consonants: string[]
  vowels: string[]
  rules: SyllableRule[]   // ('C'|'V')[]
  minSylls: number
  maxSylls: number
  endings?: string[]      // common name endings (-son, -ovich, etc.)
}
```

At **build time** (not runtime): for Tier 2 locales, pre-generate
~500 first + ~1 000 last names using phonotactic rules with a fixed
build seed, store as JSON, ship in the bundle. This keeps runtime
deterministic + fast (still wordlist-based) and lets us avoid
runtime Markov / phonotactic code paths in the hot path.

Phonotactic code is only invoked at build time + on-demand if user
adds a new locale via community packs (per ADR-0016).

### 4.3 Collision handling

Expected collisions: in a 7 500-player world, ~2-4 duplicate full
names per ~2 000-player locale (per §5.3 of the research note;
standard birthday-paradox math).

Policy:

- **Allow duplicates globally**: realistic ("John Smith", "José García").
- **Disallow duplicates within the same club**: regenerate surname up
  to 3 times with deterministic `seed + attemptIndex` derivation.
- **Optional disallow within the same league** at "High Realism"
  setting (off by default; deferred).

### 4.4 IP / legal compliance

Hard rules:

- Never include any **real living person's full name** verbatim. The
  Wikidata pull MUST filter out `instance of (P31) = human` records
  with `date of death` unset (i.e. living persons) — only use names,
  not name+nationality+DoB combinations that could identify someone.
- Each shipped corpus carries provenance metadata: source dataset
  ID, license, URL, accessed-on date.
- ADR-0007 enforces no real club / league / player names; this note
  extends it to **no real coach / referee / journalist names either**.
- Community packs (per ADR-0016) MUST validate against the same rules
  or be flagged.

## 5. Crest generation grammar

### 5.1 Approach: grammar-based hybrid with lazy generation

A small grammar of layers produces tens of millions of unique
combinations:

```text
Crest := Shield × Division × FieldColors × Charge × Border × Banner
```

| Layer | Cardinality | Notes |
|---|---|---|
| Shield shape | 7 | heater / spanish / french_modern / swiss / roundel / oval_vertical / tabbed |
| Division | 8 | none / per_pale / per_fess / per_bend / per_chevron / tierced_pale / tierced_fess / roundel_center |
| Palette | 10 | region-biased (DE more black-yellow; IT more blue-white; etc.) |
| Charge icon | 40-50 | animals + sports + abstract + regional |
| Border | 4 | none / thin / thick / double |
| Banner | 3 | none / top / bottom |
| Year (founding) | 0-1 | optional bottom text |

Combinatorial space: 7 × 8 × 10 × 40 × 4 × 3 × 2 ≈ 538 000 base
combinations, then × ~10 micro-shape jitters = ~5 M unique crests.

### 5.2 Lazy generation pipeline

At **world creation**: only compute the `CrestDesign` struct (~16
bytes per club):

```ts
interface CrestDesign {
  shieldId: ShieldShapeId         // 3 bits
  divisionId: DivisionId          // 3 bits
  paletteId: PaletteId            // 4 bits
  primaryFieldHue: 'a' | 'b'      // which palette color is bg
  iconId: IconId                  // 8 bits (256 max)
  borderStyle: BorderStyleId      // 2 bits
  bannerStyle: BannerStyleId      // 2 bits
  iconScale: number               // 4 bits (quantised 0.5-1.0)
  microSeed: number               // 16 bits jitter for shape control points
}
```

Total: ~6 bytes packed; stored on the `club` record (per A4).

At **first display**: render `CrestDesign` to SVG string via pure
template functions, cache the SVG as a data URI in IndexedDB under
`club_crest_cache:<clubId>`. Subsequent renders hit the cache.

```ts
function renderCrestSvg(design: CrestDesign): string {
  const shield = SHIELDS[design.shieldId]
  const division = DIVISIONS[design.divisionId]
  const palette = PALETTES[design.paletteId]
  const icon = ICONS[design.iconId]
  // ... pure string concatenation ...
  return `<svg viewBox="${shield.viewBox}">...</svg>`
}
```

Render cost: ~1-3 ms per crest on Snapdragon 695 (pure string
template work).

### 5.3 Icon library

40-50 icons inlined as TS path strings in
`packages/game-data/src/crests/icons/`:

| Category | Examples | Count |
|---|---|---|
| Animals | eagle, lion, bull, wolf, horse, falcon, stag, bear, ram, fox | 10-12 |
| Sports | classic ball, modern ball, boot, goal, crossed-boots | 5 |
| Nature | tree, mountain, river, wheat, oak-leaf, anchor | 6-8 |
| Abstract | star, stripe-set, chevron, laurel-wreath, crown, sun, compass | 7-8 |
| Architectural | tower, bridge, gear (industrial), wheel | 4 |
| Regional flair | half-eagle (DE), trident (UK), fleur-de-lis (FR), fasces (IT), ship (NL/coast) | 6-8 |

Sources:

- Custom illustrations restyled from **Game-Icons.net** (CC-BY 3.0;
  attribution in credits) — already heraldic / fantasy / sports flavour.
- Heroicons / Tabler (MIT) for some abstract shapes — simplified +
  restyled.
- No copying of national emblems, military insignia, or specific
  real-club emblems.

Bundle: ~10-15 KB gzipped (paths only, no full SVG wrappers).

### 5.4 Palette system

10 base palettes with metals + colours per heraldic rule of tincture:

| Palette ID | Primary | Secondary | Metal | Region bias |
|---|---|---|---|---|
| `red_white` | #C8102E | #FFFFFF | #F0E0B8 | universal |
| `blue_white` | #003D7A | #FFFFFF | #F0E0B8 | universal |
| `green_white` | #006400 | #FFFFFF | #F0E0B8 | universal |
| `yellow_black` | #FFCC00 | #1A1A1A | #FFFFFF | DACH, BR |
| `maroon_gold` | #6F1A07 | #C89F0A | #FFFFFF | British Isles, IT |
| `black_white` | #1A1A1A | #FFFFFF | #C89F0A | universal |
| `blue_yellow` | #003D7A | #FFCC00 | #FFFFFF | Nordic, Spain |
| `red_black` | #C8102E | #1A1A1A | #F0E0B8 | DACH (HSV-style), IT |
| `purple_white` | #4B1A6E | #FFFFFF | #F0E0B8 | Anstoss-flavour rare |
| `teal_white` | #008080 | #FFFFFF | #F0E0B8 | universal modern |

Region-biased weights stored per locale. Contrast ratio enforced
≥ 3:1 between primary field and primary charge color (WCAG-aligned;
ensures 24 px thumbnail readability).

### 5.5 Region-biased shape priors

| Region | Shield priors | Palette priors |
|---|---|---|
| DACH | heater 35 %, tabbed 25 %, oval 20 %, roundel 15 %, other 5 % | yellow_black + red_white + black_white over-weighted |
| British Isles | heater 40 %, spanish 25 %, french_modern 20 %, oval 10 %, other 5 % | red_white + blue_white + maroon_gold over-weighted |
| Italy | roundel 30 %, oval 25 %, spanish 20 %, heater 15 %, other 10 % | green_white + blue_white + black_white over-weighted |
| Spain | spanish 35 %, heater 25 %, roundel 15 %, french_modern 15 %, other 10 % | red_white + blue_yellow over-weighted |
| France | french_modern 35 %, heater 25 %, oval 15 %, roundel 15 %, other 10 % | red_white + blue_white over-weighted |
| Lusophone | spanish 30 %, oval 25 %, heater 25 %, other 20 % | red_white + green_white over-weighted |
| Low Countries | heater 30 %, tabbed 25 %, french_modern 20 %, roundel 15 %, other 10 % | red_white + blue_white over-weighted |

## 6. City + location generation

### 6.1 Approach: real region + fictional city

Per the gap-D2 Q&A:

- **Region** (state, county, Bundesland, comarca, regione) comes from
  **GeoNames** (CC-BY 4.0, attribution in credits). GeoNames provides
  ~11 M place records with hierarchical region structure.
- **City name** is generated procedurally to be plausible-sounding
  for the region but **not match any real city in GeoNames**.

Algorithm:

1. Pick a real region by weighted population (urban regions get more
   clubs).
2. Generate a fictional city name via phonotactic recombination of
   syllables extracted from real cities in that region.
3. Reject any name that exactly matches a real GeoNames entry
   (Bloom filter, ~10 KB compressed).
4. Assign approximate coordinates (lat/lon) within the region's
   bounding box, with deterministic jitter.

### 6.2 Phonotactic city name generator

Per region, extract:

- Common prefixes (`Brand-`, `Berg-`, `Lin-`, `Mün-`).
- Common suffixes (`-hausen`, `-burg`, `-feld`, `-heim`, `-bach`).
- Allowed mid-syllables.

Compose: `prefix + [mid?] + suffix`, with deterministic seed-driven
choice. Validate against the Bloom filter of real cities.

Example outputs:

- DACH: `Brennsdorf`, `Lindenheim`, `Steinbach`, `Hafenfeld`.
- British Isles: `Westborough`, `Hillton`, `Eastfield`, `Greenhaven`.
- Spain: `Villarejo`, `San Felipe del Mar`, `Casareso`.
- Italy: `Montepiano`, `Sangiomo`, `Castelnuovo del Lago`.

### 6.3 Club code / abbreviation

3-4 letter code derived from city + club-type prefix:

| Club-type prefix | Example | Notes |
|---|---|---|
| `FC` | `FC Brennsdorf` | universal |
| `SV` | `SV Schwarzwald` | DACH |
| `KSV` | `KSV Ruhrtal` | DACH variant |
| `AC` | `AC Montepiano` | Italian |
| `CD` | `CD Villarejo` | Spanish |
| `RC` | `RC Vlissinghaven` | French / Belgian |
| `Borussia` | `Borussia Schwarzwald` | DACH historical-flavour |
| `Sporting` | `Sporting Linhares` | Lusophone |
| `Real` | `Real Casareso` | Spanish high-prestige |

Prefix selection weighted by region; prestige influences fancier
prefixes (Real, Borussia, Olympique reserved for higher-prestige
clubs).

## 7. Club tier model + Country × Tier matrix

### 7.1 Pyramid structure per country

5 tiers; structure per nation:

| Tier | Typical clubs/league | Status | Reputation band |
|---|---|---|---|
| 1 | 16-20 | Fully professional, top flight | 65-85 |
| 2 | 16-22 | Strong pro | 48-62 |
| 3 | 18-22 | Mixed pro / semi-pro | 32-44 |
| 4 | 16-20 (regionalised) | Semi-pro | 20-32 |
| 5 | variable/unbounded | Semi-pro / amateur | 8-22 |

Total clubs per country depends on world-size preset (per D9):

- Small world: 1 nation × 2 tiers × ~18 clubs = ~36 clubs.
- Medium world: 3 nations × 4 tiers × ~18 avg = ~216 clubs.
- Large world: 8 nations × 5 tiers × ~18 avg = ~720 clubs.

(Player counts in §11.7.)

### 7.2 Country × Tier matrix (10 starting countries)

All money values in **€ million** (mean ± std-dev); attendance in
average home attendance; prestige 0-100.

#### Germany (baseline)

| Tier | Wage bill | Transfer budget | Attendance | Prestige |
|---|---|---|---|---|
| 1 | 18.0 ± 12.0 | 10.0 ± 7.0 | 23 000 ± 9 000 | 72 ± 12 |
| 2 | 6.8 ± 5.0 | 4.2 ± 3.4 | 13 000 ± 6 000 | 54 ± 11 |
| 3 | 2.9 ± 2.5 | 1.8 ± 1.6 | 7 000 ± 3 500 | 38 ± 10 |
| 4 | 1.3 ± 1.2 | 0.9 ± 0.8 | 4 000 ± 2 200 | 26 ± 9 |
| 5 | 0.55 ± 0.70 | 0.35 ± 0.45 | 2 100 ± 1 200 | 16 ± 8 |

#### England

| Tier | Wage bill | Transfer budget | Attendance | Prestige |
|---|---|---|---|---|
| 1 | 29.7 ± 22.0 | 18.0 ± 14.0 | 35 700 ± 14 000 | 78 ± 12 |
| 2 | 10.2 ± 8.0 | 6.5 ± 5.2 | 17 700 ± 7 000 | 60 ± 11 |
| 3 | 4.4 ± 4.0 | 2.9 ± 2.6 | 9 500 ± 4 400 | 43 ± 10 |
| 4 | 2.0 ± 1.8 | 1.3 ± 1.1 | 5 400 ± 2 900 | 31 ± 9 |
| 5 | 0.85 ± 1.0 | 0.55 ± 0.65 | 2 900 ± 1 500 | 20 ± 8 |

#### Spain

| Tier | Wage bill | Transfer budget | Attendance | Prestige |
|---|---|---|---|---|
| 1 | 16.6 ± 11.5 | 9.5 ± 7.2 | 18 000 ± 8 500 | 75 ± 12 |
| 2 | 6.0 ± 4.6 | 3.8 ± 3.0 | 10 500 ± 5 000 | 57 ± 11 |
| 3 | 2.5 ± 2.1 | 1.6 ± 1.4 | 5 900 ± 3 000 | 40 ± 10 |
| 4 | 1.1 ± 1.0 | 0.75 ± 0.7 | 3 300 ± 1 900 | 28 ± 9 |
| 5 | 0.48 ± 0.55 | 0.30 ± 0.35 | 1 700 ± 1 000 | 18 ± 8 |

#### Italy

| Tier | Wage bill | Transfer budget | Attendance | Prestige |
|---|---|---|---|---|
| 1 | 15.8 ± 11.0 | 9.0 ± 6.8 | 17 500 ± 8 000 | 74 ± 12 |
| 2 | 5.4 ± 4.2 | 3.4 ± 2.8 | 9 800 ± 4 700 | 56 ± 11 |
| 3 | 2.2 ± 2.0 | 1.4 ± 1.3 | 5 400 ± 2 900 | 39 ± 10 |
| 4 | 1.0 ± 0.95 | 0.68 ± 0.65 | 3 000 ± 1 800 | 27 ± 9 |
| 5 | 0.42 ± 0.50 | 0.26 ± 0.32 | 1 600 ± 900 | 17 ± 8 |

#### France

| Tier | Wage bill | Transfer budget | Attendance | Prestige |
|---|---|---|---|---|
| 1 | 14.4 ± 10.0 | 8.2 ± 6.2 | 16 100 ± 7 500 | 70 ± 12 |
| 2 | 5.0 ± 3.9 | 3.1 ± 2.6 | 9 000 ± 4 400 | 52 ± 11 |
| 3 | 2.1 ± 1.8 | 1.3 ± 1.2 | 5 000 ± 2 700 | 36 ± 10 |
| 4 | 0.95 ± 0.90 | 0.62 ± 0.60 | 2 800 ± 1 700 | 25 ± 9 |
| 5 | 0.40 ± 0.45 | 0.25 ± 0.30 | 1 500 ± 850 | 15 ± 8 |

#### Portugal

| Tier | Wage bill | Transfer budget | Attendance | Prestige |
|---|---|---|---|---|
| 1 | 9.4 ± 7.5 | 5.2 ± 4.2 | 13 300 ± 6 300 | 67 ± 12 |
| 2 | 3.1 ± 2.8 | 1.9 ± 1.8 | 7 800 ± 3 800 | 49 ± 11 |
| 3 | 1.3 ± 1.2 | 0.82 ± 0.82 | 4 300 ± 2 300 | 33 ± 10 |
| 4 | 0.56 ± 0.65 | 0.36 ± 0.42 | 2 300 ± 1 400 | 22 ± 9 |
| 5 | 0.24 ± 0.30 | 0.15 ± 0.20 | 1 200 ± 700 | 13 ± 8 |

#### Netherlands

| Tier | Wage bill | Transfer budget | Attendance | Prestige |
|---|---|---|---|---|
| 1 | 10.8 ± 8.0 | 6.0 ± 4.8 | 14 000 ± 6 500 | 69 ± 12 |
| 2 | 3.9 ± 3.2 | 2.4 ± 2.0 | 8 300 ± 4 000 | 51 ± 11 |
| 3 | 1.6 ± 1.5 | 1.0 ± 1.0 | 4 700 ± 2 500 | 35 ± 10 |
| 4 | 0.72 ± 0.80 | 0.46 ± 0.50 | 2 700 ± 1 500 | 24 ± 9 |
| 5 | 0.30 ± 0.35 | 0.19 ± 0.24 | 1 400 ± 800 | 14 ± 8 |

#### Brazil

| Tier | Wage bill | Transfer budget | Attendance | Prestige |
|---|---|---|---|---|
| 1 | 12.6 ± 10.0 | 8.4 ± 7.2 | 19 000 ± 11 000 | 71 ± 13 |
| 2 | 4.4 ± 3.8 | 3.0 ± 2.8 | 10 200 ± 6 500 | 52 ± 12 |
| 3 | 1.9 ± 1.8 | 1.3 ± 1.2 | 5 800 ± 4 000 | 36 ± 11 |
| 4 | 0.86 ± 0.95 | 0.60 ± 0.70 | 3 100 ± 2 500 | 25 ± 10 |
| 5 | 0.36 ± 0.45 | 0.24 ± 0.30 | 1 700 ± 1 400 | 15 ± 9 |

#### Argentina

| Tier | Wage bill | Transfer budget | Attendance | Prestige |
|---|---|---|---|---|
| 1 | 7.6 ± 6.6 | 4.4 ± 4.0 | 13 500 ± 8 500 | 68 ± 13 |
| 2 | 2.4 ± 2.4 | 1.5 ± 1.6 | 7 800 ± 5 000 | 50 ± 12 |
| 3 | 0.95 ± 1.0 | 0.60 ± 0.70 | 4 400 ± 3 200 | 34 ± 11 |
| 4 | 0.40 ± 0.50 | 0.26 ± 0.32 | 2 300 ± 1 800 | 23 ± 10 |
| 5 | 0.16 ± 0.20 | 0.10 ± 0.14 | 1 100 ± 900 | 13 ± 9 |

#### Japan

| Tier | Wage bill | Transfer budget | Attendance | Prestige |
|---|---|---|---|---|
| 1 | 9.9 ± 7.6 | 6.0 ± 5.2 | 14 500 ± 6 800 | 70 ± 12 |
| 2 | 3.4 ± 2.8 | 2.2 ± 2.0 | 8 400 ± 4 100 | 52 ± 11 |
| 3 | 1.4 ± 1.3 | 0.92 ± 0.90 | 4 800 ± 2 500 | 36 ± 10 |
| 4 | 0.64 ± 0.70 | 0.42 ± 0.48 | 2 700 ± 1 400 | 25 ± 9 |
| 5 | 0.28 ± 0.32 | 0.18 ± 0.22 | 1 500 ± 800 | 15 ± 8 |

### 7.3 Distribution shape

Money + attendance use **log-normal distributions**, not normal:

```ts
function sampleLogNormal(rng: PCG32, mean: number, std: number): number {
  // Convert mean/std to underlying log-space parameters
  const sigma2 = Math.log(1 + (std / mean) ** 2)
  const mu = Math.log(mean) - sigma2 / 2
  // Box-Muller transform from PRNG
  const u1 = rng.nextFloat()
  const u2 = rng.nextFloat()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return Math.exp(mu + Math.sqrt(sigma2) * z)
}
```

Prestige uses **truncated normal** clamped to [0, 100]; allows mean +
std-dev as above with sensible tails.

### 7.4 Inter-related ratios

After sampling tier baseline:

```text
wage_bill        = country_mul[C] × tier_wage_band[T] × prestige_factor × noise
transfer_budget  = wage_bill × budget_ratio[T] × prestige_factor × noise
cash_reserves    = transfer_budget × cash_ratio[T] × noise
attendance_avg   = country_att_mul[C] × tier_att_band[T] × prestige_factor × noise
```

Ratios:

- `budget_ratio[T]` = 0.35 (T5) → 0.90 (T1).
- `cash_ratio[T]` = 1.0 (T1) → 4.0 (T5) (smaller clubs sit on relatively
  more cash; less revenue volatility absorbed).
- `prestige_factor` = `0.7 + 0.006 × prestige` (range 0.7-1.3).

## 8. Stadium generation

### 8.1 Capacity

```text
capacity = clamp(
  round(base_capacity[C,T] × prestige_factor × country_att_mul[C] × log_normal_noise),
  500,    // amateur floor
  90000   // top stadium cap
)
```

Base capacities (Germany baseline):

| Tier | Capacity mean | Std-dev |
|---|---|---|
| 1 | 40 000 | 18 000 |
| 2 | 22 000 | 10 000 |
| 3 | 11 500 | 6 000 |
| 4 | 6 000 | 3 500 |
| 5 | 2 800 | 1 800 |

Country multiplier (attendance multiplier from §7.2 row).

### 8.2 Age model — bimodal

```text
age_band âˆˆ { modern (0-25y), hybrid (15-70y), old (45-120y) }
```

Probability per tier:

| Tier | Modern | Hybrid | Old |
|---|---|---|---|
| 1 | 35 % | 45 % | 20 % |
| 2 | 20 % | 50 % | 30 % |
| 3 | 10 % | 40 % | 50 % |
| 4-5 | 5 % | 25 % | 70 % |

Plus optional `renovated_year` separately if `age > 30`.

### 8.3 Stadium naming

Three pattern categories with tier-weighted selection:

| Pattern | Examples | Probability by tier |
|---|---|---|
| **Traditional / local** | `Weserstadion`, `Stadion am Park`, `Westend Park` | T1 35 / T2 45 / T3 60 / T4-5 75 % |
| **Modern arena** | `Brennsdorf Arena`, `Südpark Arena`, `Kaiser Arena` | T1 35 / T2 25 / T3 15 / T4-5 10 % |
| **Sponsor-named** | `HanseBank Arena`, `VitaMed Stadium`, `NordTel Arena` | T1 30 / T2 30 / T3 25 / T4-5 15 % |

Sponsor names use procedurally-generated fictional brand names (per
ADR-0007 IP-cleanliness; no `Allianz`, `Signal Iduna`, etc.). Sponsor
brand generator is a phonotactic + suffix generator (`Brand →
[stem][suffix]`, where stems are CV phonotactic outputs and suffixes
âˆˆ {`Bank`, `Tel`, `Med`, `Tech`, `Auto`, `Logistik`, `Versicherung`}).

### 8.4 Build / upgrade cost

```text
build_cost = capacity × cost_per_seat[C, age_band]
```

`cost_per_seat`:

- T1 modern: €2 800-5 500 / seat
- T2-3: €1 200-3 000 / seat
- T4-5: €500-1 500 / seat

Upgrade path (per [[../50-Game-Design/stadium-and-campus]]):

- Capacity expansion (steps of +5 000 to +10 000 typical).
- Comfort / commercial tier (multiplier on matchday revenue).
- Facility quality (training, youth-development bonus).

## 9. Reputation / prestige formula

```ts
prestige = clamp(
  tier_base[T]                         // 10 / 24 / 38 / 52 / 66
  + country_offset[C]                  // EN +6, DE +4, ES +4, ...
  + history_bonus                      // log10(1 + years_since_founding) × 4
  + recent_success_bonus               // champion last 5y +8..+12; promoted +2; relegated -3..-6
  + facilities_bonus                   // stadium quality + youth academy + training: 0..+8
  + fanbase_bonus                      // city population proxy: 0..+6
  + N(0, 4),                           // noise
  0, 100
)
```

Internal mapping for compatibility with FM-style 4-digit reputation
(if needed for analytics): `repFM = prestige × 100`.

Bands:

- 0-20: local amateur
- 21-35: regional semi-pro
- 36-50: national lower-league
- 51-65: strong domestic professional
- 66-80: top-flight established
- 81-90: continental regular
- 91-100: global elite (rare in procedural worlds; typically only via
  long save success)

## 10. Player attribute schema

### 10.1 Visible attributes (16) + GK extras (4)

All on a **1-20 integer scale** (FM convention; fits 5-bit storage;
maps cleanly to basis-points contest math in [[match-engine-simulation-model]]
via `attr × 500 = success_bp`).

#### Technical (7)

| Attribute | Drives |
|---|---|
| `passing` | Pass success rate (short + medium) |
| `firstTouch` | Receiving success on contested balls |
| `dribbling` | Take-on success; ball control under pressure |
| `finishing` | Shot conversion |
| `crossing` | Cross delivery quality |
| `tackling` | Tackle / interception success |
| `heading` | Aerial duel success |

#### Mental (5)

| Attribute | Drives |
|---|---|
| `decisions` | Choosing the right action (shot vs pass vs hold) |
| `positioning` | Off-ball positioning quality (esp. defenders) |
| `vision` | Through-ball + creative pass detection |
| `composure` | Performance under pressure (penalties, big chances) |
| `workRate` | Stamina-efficient pressing + tracking back |

#### Physical (4)

| Attribute | Drives |
|---|---|
| `pace` | Speed (sprint + acceleration combined for simplicity) |
| `strength` | Shielding + duels + aerial |
| `agility` | Body-feints, quick changes of direction |
| `stamina` | 90-minute work rate, late-game fatigue |

#### GK-only extras (4)

| Attribute | Drives |
|---|---|
| `reflexes` | Shot-stopping (close range) |
| `handling` | Clean catches + parry quality |
| `aerialReach` | Catching + punching crosses |
| `distribution` | Throwing + kicking accuracy |

### 10.2 Hidden meta (8)

| Attribute | Drives | Scale |
|---|---|---|
| `potential` | Max CA the player can reach | 1-200 (FM scale; or 1-20 visible mapping) |
| `consistency` | Variance in match performance | 1-20 |
| `pressure` | Performance in cup finals, derbies, relegation 6-pointers | 1-20 |
| `professionalism` | Training gains, off-field discipline | 1-20 |
| `determination` | Pressure resilience, comeback effort | 1-20 |
| `adaptability` | Foreign league success, position-flex | 1-20 |
| `injuryProneness` | Annual injury risk multiplier | 1-20 |
| `bigMatches` | Clutch factor for important fixtures | 1-20 |

Hidden attributes are **never shown** to the user directly. They're
surfaced via:

- Scout reports (per [[../50-Game-Design/scouting-and-recruitment]])
  with uncertainty bands.
- Coaching staff "personality" reads.
- Observable behaviour over time (poor consistency = scout note
  "inconsistent performer").

FMX-23 adds draft player skills/perks and People/persona planning in
[[eos-player-staff-skills-and-personas-2026-05-28]] and
[[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]. That layer
does **not** expand this attribute schema: skills/perks are generated and
balanced as separate sparse specializations, and internal OCEAN persona values
are a People-context substrate, not additional player attributes.

FMX-3 adds draft MVP narration-world generation in
[[ai-narration-world-and-dialogue-mvp-2026-05-28]]. That layer extends worldgen
with active narrative actors - staff, board contacts, media outlets,
journalists, fan groups, fan reps and agents - but still follows this note's
determinism and IP-clean rules. The LLM never generates canonical actors or
facts at runtime; it only phrases scenes from generated context cards.

### 10.3 Physical metadata

Per player, generate:

- `birthDate` (deterministic from age band).
- `height` (cm) — sampled from position-conditional distribution.
- `weight` (kg) — correlated with height via BMI band.
- `preferredFoot`: `'left'` 20 % | `'right'` 75 % | `'both'` 5 %;
  position-biased (left-backs lean left-footed; +15 % left).

Position height distributions (mean ± std-dev):

| Position | Height (cm) |
|---|---|
| GK | 188 ± 4 |
| CB | 187 ± 4 |
| FB / WB | 178 ± 4 |
| DM | 181 ± 4 |
| CM | 179 ± 4 |
| AM | 177 ± 4 |
| W / IF | 175 ± 5 |
| ST | 183 ± 6 (target-man + nimble forward bimodal) |

### 10.4 Nationality + heritage

Per player:

- `birthNationality`: from club's country (~80 %) or sampled from
  global pool weighted by club tier (T1 has more imports).
- `secondaryNationality`: 5-15 % chance (higher in migration-heavy
  nations: 12 % EN/FR/DE; 5 % JP/AR).
- `nationalTeamEligibility`: derived list.
- `nationalTeamChoice`: deferred decision at age 17-23 based on
  best sporting pathway (handled in development sim, not at genesis).

Foreign-player share by tier:

| Tier | Home % | Foreign % (mostly neighbouring) |
|---|---|---|
| 1 | 45-70 | 30-55 |
| 2 | 60-85 | 15-40 |
| 3 | 75-92 | 8-25 |
| 4 | 85-97 | 3-15 |
| 5 | 90-99 | 1-10 |

## 11. Player generation algorithm

### 11.1 Pipeline overview

```text
generatePlayer(seed, clubContext) →
  1. derive sub-seed from (worldSeed, clubId, slotIndex)
  2. pick (position, archetype, age_band)
  3. sample PA from skewed nation×club-quality distribution
  4. sample CA from age + environment
  5. allocate CA budget across attributes (archetype weights + Dirichlet noise)
  6. generate hidden meta from personality priors
  7. generate physicals from position + nation priors
  8. generate name (§4) + nationality (§10.4)
  9. assemble Player record
```

### 11.2 Archetype library (~50 archetypes)

| Position | Archetypes (count) |
|---|---|
| **GK** | sweeper_keeper, shot_stopper, distributor_keeper (3) |
| **CB** | ball_playing, stopper, sweeper, wide_cb (4) |
| **FB / WB** | overlapping_fb, inverted_fb, defensive_fb, wing_back (4) |
| **DM** | destroyer, deep_lying_playmaker, anchor, half_back (4) |
| **CM** | box_to_box, deep_lying_playmaker, advanced_playmaker, mezzala, carrilero (5) |
| **AM** | classic_10, false_9_attacking, shadow_striker, wide_playmaker (4) |
| **W / IF** | classic_winger, inside_forward, inverted_winger, raumdeuter (4) |
| **ST** | poacher, target_man, complete_forward, false_9, deep_lying_forward, pressing_forward (6) |

Plus rare archetypes (~8): regista, libero, trequartista,
verteidigender flügelspieler, falscher neuner, etc. for flavour.

Each archetype has:

```ts
interface PlayerArchetype {
  id: ArchetypeId
  position: Position
  attrWeights: Partial<Record<AttributeId, number>>  // normalised to sum to 1
  heightBias: 'short' | 'avg' | 'tall' | 'bimodal'
  preferredFootBias?: 'left' | 'right' | null
  personalityPriors: Partial<Record<HiddenAttrId, [number, number]>>  // mean, std
  ageBandPriors: { youth: number; prime: number; veteran: number }
}
```

### 11.3 PA + CA distribution

#### Potential Ability (PA), 1-200 scale

```text
PA_base = sampleSkewed(rng, mode=80, scale=country_youth_quality[C] × club_youth_quality[K])
PA = clamp(round(PA_base + tier_bonus + noise), 30, 200)
```

Distribution shape: log-normal-ish with median ~85, long tail. ~1 %
of players are "wonderkid" tier (PA ≥ 150).

`country_youth_quality`:

- Brazil, Argentina: 1.15 (talent factory)
- England, Germany, France, Spain: 1.05
- Italy, Netherlands: 1.00
- Portugal: 1.10
- Japan, Belgium: 0.95
- Smaller nations: 0.80-0.90

#### Current Ability (CA), 1-200 scale

Age-conditioned:

| Age band | CA target |
|---|---|
| 15-17 | 20-55 |
| 18-21 | 30-100 |
| 22-29 | PA × (0.90 + small_noise) |
| 30-32 | PA × (0.85-0.95) |
| 33-36 | PA × (0.70-0.85), physicals decline faster |

Club tier influences CA at sub-PA ages: T1 clubs have better-developed
youth than T5 clubs at the same age.

### 11.4 CA → attribute allocation (Dirichlet)

Given CA budget B and archetype weights w:

1. Convert weights to Dirichlet concentration parameters (multiply by
   strength factor, e.g. `Î±_i = w_i × 30`).
2. Sample Dirichlet draw `p_i ~ Dir(Î±)` deterministically via PRNG.
3. Allocate B × p_i to each attribute.
4. Clamp to [1, 20] and re-distribute overflow.

This produces archetype-coherent players with realistic variance
("not every box-to-box CM is identical").

### 11.5 Hidden attribute sampling

Sample independently from personality priors:

```text
hidden[attr] = clamp(
  sampleNormal(mu_attr_for_archetype, sigma=3) +
  nation_offset[attr][nation],
  1, 20
)
```

Nation offsets: e.g. German nation gets +1 `professionalism`,
Brazilian gets +1 `composure` and `vision`; these are gameplay-
flavour decisions, kept conservative to avoid stereotypes.

### 11.6 Lazy expansion (the big perf trick)

Only **Tier A** and **Tier B** players (top 2 leagues per active
nation; ~10-15 % of total) get full attribute generation at world
creation.

**Tier C** players (lower leagues; ~85-90 % of total) store only a
**compact profile**:

```ts
interface CompactPlayerProfile {
  seed: number              // 4 bytes
  archetypeId: ArchetypeId  // 1 byte
  ageBandId: AgeBand        // 1 byte
  tier: ClubTier            // 1 byte
  nationId: NationId        // 1 byte
  paBand: PABand            // 1 byte (5 bands)
  // ~10-12 bytes total per Tier C player
}
```

Full attributes are generated on demand when:

- Player is scouted (transfer market browse).
- Player is drafted / signed.
- Player faces the user's club in a match.
- Player enters the user's view in a scout report.

Generated attributes are then cached in the player record (per A4)
and never regenerated.

Tier C player count for Large world: ~6 500 players × ~12 bytes =
~78 KB compact representation. Massive saving.

### 11.7 Squad composition

Per club (25 players target):

| Position group | Count | Role distribution |
|---|---|---|
| GK | 3 | 1 starter + 1 backup + 1 youth/veteran |
| DEF | 8 | 4 CB + 4 FB/WB |
| MID | 8 | 2 DM + 4 CM + 2 AM/W |
| ATT | 6 | 4 W/IF + 2 ST + flexible |

Age mix per tier:

| Tier | Youth (17-21) | Prime (22-29) | Veteran (30-36) |
|---|---|---|---|
| 1 | 12 % | 58 % | 30 % |
| 2 | 15 % | 60 % | 25 % |
| 3 | 20 % | 55 % | 25 % |
| 4 | 22 % | 50 % | 28 % |
| 5 | 25 % | 45 % | 30 % |

Wage budget check: total weekly wages ≤ 95 % of `wage_bill_annual /
52`. If over budget, downgrade fringe players' attributes / age until
fit.

### 11.8 Age curves (post-generation development)

Out of scope for D2 (covered by [[../50-Game-Design/youth-academy-and-development]]
+ [[../50-Game-Design/training-load-and-medicine]]). Worth noting the
target shape here for completeness:

- Youth 17-21: +1 to +3 in trained attributes/year.
- Prime 22-29: stable.
- 30+: pace / agility / stamina drop -1 to -3/year; technicals -0 to -1.
- Mentals slowly improve until late career.

## 12. Determinism + RNG stream

### 12.1 New RNG stream — `GeneratorRng`

Per D8 §2.3 (label-derived seeds, future-proof), we add:

```ts
const generatorRng = pcg32(deriveStreamSeed(masterSeed, 'generator'))
```

Sub-streams via further labels:

```text
generator:country:<countryId>
generator:league:<countryId>:<tier>
generator:club:<clubId>
generator:club:<clubId>:crest
generator:club:<clubId>:stadium
generator:club:<clubId>:staff
generator:player:<clubId>:<slotIndex>
generator:player:<playerId>:attributes
generator:player:<playerId>:hidden
generator:player:<playerId>:name
generator:player:<playerId>:nationality
```

This means:

- Adding a sponsor sub-system later doesn't reshuffle existing
  clubs / players.
- Adding a 51st archetype doesn't change any existing player's
  generation.
- Same `worldSeed` always produces the same world (D8 contract).
- Each subsystem is isolated from cross-contamination.

### 12.2 Locked stream list update

[[determinism-and-replay]] §2.2 currently lists 8 streams. This note
adds:

| # | Stream | Scope | Persistence |
|---|---|---|---|
| **9** | **`GeneratorRng`** | One-time world-genesis randomness (clubs, stadiums, crests, players, names, locations) | World save (master seed only; derived seeds re-computed) |

D8 §2.3 already permits this addition without breaking replays.

### 12.3 Generation order is canonical

Always generate in this order to keep derivations stable:

1. Countries (sorted by `countryId`).
2. Leagues per country (sorted by tier, ascending).
3. Clubs per league (sorted by internal ID).
4. For each club: stadium → staff → crest design → squad slots.
5. Players (sorted by `clubId`, then `slotIndex`).

Re-ordering on a re-load (e.g. iterating a Set) would NOT change
output because seeds are label-derived, but canonical order is still
required for **debug equivalence** (golden test diffing).

## 13. Performance budget

### 13.1 Targets per world size

| World size | Clubs | Players | Total gen time on Snapdragon 695 | IndexedDB delta |
|---|---|---|---|---|
| **Small** | ~36 | ~700 (full) | ≤ 2 s | ≤ 2 MB |
| **Medium** | ~216 | ~2 500 (full) + ~3 000 compact | ≤ 5 s | ≤ 8 MB |
| **Large** | ~720 | ~7 500 (full Tier A/B) + ~55 000 compact | ≤ 8 s | ≤ 25 MB |

Phase budget breakdown (Large world worst case):

| Phase | Budget |
|---|---|
| Country / league structures | < 50 ms |
| Club shells (name, location, palette, finances, prestige) | ~ 1 s for 720 clubs |
| Stadiums | ~ 0.5 s |
| Staff (basic) | ~ 0.5 s |
| Crest designs (struct only, not SVG) | ~ 0.5 s |
| Tier A/B players (full attrs) | ~ 3-4 s for ~7 500 players |
| Tier C players (compact only) | ~ 1 s for ~55 000 players |
| Total | ~ 7-8 s |

### 13.2 Implementation notes

- World genesis runs in a **dedicated Web Worker** (per ADR-0019 §
  cross-context). UI thread stays responsive; progress bar driven by
  postMessage events.
- Batches of 50-100 clubs / 200-500 players per tick; yield via
  `await new Promise(r => setTimeout(r, 0))` to keep main thread
  free.
- Final write to IndexedDB happens in a single transaction at the
  end (avoids cascading commits).
- Total CPU usage capped at ~80 % of one big core to avoid thermal
  throttling per D9 §9.3.

### 13.3 Crest SVG render budget

Crest SVG strings are generated **lazily**, not at world genesis:

- ~1-3 ms per crest on first display (pure string template work).
- Cached as data URI in IndexedDB under `club_crest_cache:<clubId>`.
- 24 px thumbnail render: ~5 KB SVG per crest × N visible clubs in a
  league table = ~100 KB per page; cheap.

## 14. Narrative actor generation extension

For the AI narration MVP pillar, world creation should also produce stable
fictional social-world records:

- media outlets: generated name, outlet type, reach, audience, cadence,
  reliability, sensationalism and editorial stance;
- journalists: generated name, outlet link, beat, tone, fairness, stance and
  relationship seed to club/manager;
- fan groups: generated name, represented segment, identity, red lines,
  mobilization style and influence band;
- fan reps: generated name, group link, role, temperament, agenda and trust
  seed;
- board contacts: generated name, role, patience, risk tolerance, time horizon
  and communication style;
- agents: generated name, negotiation style, client tendency, leakage risk and
  trust seed;
- staff personas: generated role, expertise, authority, work style and football
  philosophy.

These records use the same `GeneratorRng` hierarchy and opaque IDs as the rest
of worldgen. They are canonical inputs for People and Narrative context cards,
not generated prose.

FMX-54 constrains this extension:

- social-world records are synthetic and deterministic, not real-person source
  tuples;
- fan groups and fan reps are fictional aggregate/narrative actors, not real
  supporter organisations, user profiles, handles, photos or membership lists;
- media outlets, journalists, sponsors, venues and fan-service labels use the
  same ADR-0007/GD-0015 IP-clean naming policy as clubs and players;
- no generated record encodes real-world political, religious, ethnic, health
  or comparable special-category labels for real persons or users;
- generated actor traits are save/world state and must not be joined to the user
  account in backend analytics.

Generator acceptance tests must include shipped fixtures that reject exact and
near-match names for clubs, players, fan groups, fan reps, media outlets,
journalists, sponsors and venues. Community-import fixtures must reject or flag
real private-person data, real supporter handles and special-category-like fan
labels before activation.

## 15. Open follow-ups

- **D13 Women's football data model readiness**: this generator
  initially produces only male players (`gender: 'M'`). When D13 is
  closed, the locale corpora + archetypes need female variants.
  Schema is forward-compatible (`gender` is already in the schema).
- **D15 Narrative event content**: club founding stories and manager bios still
  need authoring depth. Journalist profiles, media outlets, fan groups, fan
  reps, board contacts and agents are now draft MVP narration inputs via
  FMX-3.
- **I4 Youth: partner schools + wonderkid tagging**: wonderkid
  detection (PA ≥ 150 + low reputation) feeds the scouting hype
  system.
- **ADR-0007 Naming Schema promotion**: this note's locked decisions
  collapse ADR-0007 from a 10-line stub into a full Decision Record
  (see follow-up sub-task).
- **Community pack format** (ADR-0016): allow community-contributed
  name corpora + crest icon packs via the override-pack pipeline.
- **GeoNames bulk download + Bloom filter build** is build-time
  infrastructure work; pending E21 asset pipeline gap.

## 15. Sources

- Perplexity Sonar research, 2026-05-17 (gap D2): locale-aware name
  generation algorithms (Markov / phonotactic / wordlist / LM
  comparison); legal-safe open data corpora (Wikidata CC0, gov stats,
  GeoNames); locale-specific composition rules (ES two-surname, PT
  particles, NL tussenvoegsel); collision handling.
- Perplexity Sonar research, 2026-05-17 (gap D2): heraldic grammar
  for football crests (shield shapes, divisions, charges, tinctures);
  procedural SVG generation techniques; IP-safe icon libraries
  (Game-Icons.net CC-BY 3.0, Heroicons MIT, Tabler MIT); colour
  theory for thumbnail readability; concrete grammar spec.
- Perplexity Sonar research, 2026-05-17 (gap D2): club tier model;
  Country × Tier financial matrix for DE / EN / ES / IT / FR / PT /
  NL / BR / AR / JP; stadium generation (capacity, age, naming, build
  costs); prestige formula; IP-safe city naming (real-region +
  fictional city via GeoNames CC-BY 4.0).
- Perplexity Sonar research, 2026-05-17 (gap D2): player attribute
  taxonomy (FM ~40 visible + hidden; FM Mobile ~20; Top Eleven 5;
  Hattrick 7; FIFA Career 6); FM regen system reverse-engineered
  consensus (CA / PA split; nation youth output; archetype-first);
  position-attribute weighting; age curves; hidden / personality
  attributes; lazy expansion strategy.
- Wikidata Licensing (CC0 1.0); UK ONS Open Government Licence v3.0;
  Etalab Open Licence (INSEE); GeoNames CC-BY 4.0; Game-Icons.net
  CC-BY 3.0.
- D2 Q&A with Nico (2026-05-17): all 8 recommendations accepted
  (locale list 7-bucket MVP; hybrid wordlist + phonotactic; grammar-
  based crests with lazy generation; custom inlined icon library;
  real-region + fictional city; 5-tier × 10-country matrix; 16 + 4
  + 8 attribute schema; hybrid archetype + CA budget + lazy
  expansion).
- Locked context: ADR-0004 (data model), ADR-0005 (save format),
  ADR-0007 (naming schema), [[determinism-and-replay]] (D8 RNG
  streams), [[performance-budgets]] (D9 world-size + perf budgets),
  [[match-engine-simulation-model]] (basis-points contest math).
