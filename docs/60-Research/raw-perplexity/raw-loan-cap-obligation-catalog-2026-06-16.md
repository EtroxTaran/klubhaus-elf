---
title: Raw Perplexity - Loan Cap and Obligation Catalog
status: raw
tags: [research, raw, perplexity, transfer, loan, regulations, obligation-to-buy, fmx-155]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-155
related:
  - [[../loan-cap-and-obligation-catalog-2026-06-16]]
  - [[raw-loan-cap-obligation-source-checks-2026-06-16]]
  - [[../../40-Execution/fmx-155-loan-cap-obligation-catalog-decision-queue-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
  - [[../../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../../50-Game-Design/GD-0006-transfers]]
  - [[../../50-Game-Design/regulations-and-compliance]]
---

# Raw Perplexity - Loan Cap and Obligation Catalog

## Prompt

Research current loan regulation inputs and game-design precedents for a
football-manager game issue. Cover:

- FIFA RSTP Article 10 current international loan rules, including duration,
  caps, pair caps, U21/club-trained exemptions, bridge/sub-loan concepts.
- Domestic loan overlays or notable profiles for England, Germany, France,
  Italy, Spain, especially loan caps and youth exemptions.
- Real-world obligation-to-buy trigger categories used in football loan deals.
- Genre precedents in Football Manager, EA FC Career and OOTP-like management
  sims for loans, loan-to-buy, future fee, playing time or vesting/conditional
  options.
- DDD/product recommendation for a deterministic Regulations-owned
  `LoanRegulationProfile` and focused `ObligationConditionCatalog`.

## Perplexity capture

Perplexity framed FIFA Article 10 as the global baseline and domestic rules as
association-specific overlays. It recommended treating real regulations as
research anchors, not as literal game text, because FMX must remain IP-clean and
because national loan rules evolve by season.

Core FIFA/RSTP findings returned:

- International professional loans require a written loan agreement, player
  consent and a loan-period employment contract.
- Duration has a window-to-window minimum and a one-year maximum; renewal is a
  separate consented action.
- From the completed transition period, international loans are capped at six
  incoming and six outgoing professionals at a club at any time in a season.
- Pair caps limit loans between the same two clubs to three in each direction.
- U21 plus club-trained players are exempt from the counting caps. Perplexity
  emphasized that both conditions are required.
- Sub-loans are prohibited; a loan to a third club requires ending the active
  loan first.
- Bridge-transfer logic should be modelled as a separate anti-circumvention
  guard around rapid two-step moves.

Domestic-overlay findings returned:

- England is the strictest accessible public top-profile pattern: Premier
  League domestic temporary transfers use a two-at-a-time incoming cap, a four
  per-season cap, a same-club cap and special goalkeeper restrictions. Overseas
  loans are outside those domestic quotas.
- Germany's public DFL material points to a six-player national loan quota with
  explicit youth/local-player exemptions, including U21 local-player and U23
  affiliate-oriented treatment from 2026/27.
- France/LFP public material lists a five incoming, seven outgoing, two
  same-club domestic pattern plus the international six/six FIFA cap.
- Italy and Spain public official sources were weaker in this pass. Perplexity
  surfaced secondary reporting around domestic tightening and six/eight-style
  ceilings, but the result should be canonized only as fictional design profile
  values, not as current-law claims.

Real-world obligation-to-buy patterns returned:

- Unconditional obligation at loan end.
- Appearance thresholds, including match-count, starts or minutes thresholds.
- Team-outcome triggers such as promotion, avoiding relegation, qualification
  for a competition class or reaching a position/round.
- Simple combined conditions, usually appearance plus team outcome.
- Date/window clauses, more common as option windows than as rich legal
  conditions.
- Accounting/regulator-driven timing is real-world relevant but too deep for
  FMX v1 because it would couple to finance/legal implementation before the
  playable transfer loop exists.

Comparable-game findings returned:

- Football Manager is the strongest precedent. Perplexity identified duration,
  wage contribution, loan fee, playing/non-playing fee, role intention, future
  fee and loan options as the relevant player-facing loan package shape.
- EA FC Career is a simpler accessibility precedent: loan and loan-to-buy are
  useful as a low-friction UX reference, but not as the depth target.
- OOTP-like sports-management sims are indirect precedents for central league
  rule configuration and vesting/conditional contract options, not direct
  football-loan authority.

## Perplexity recommendation captured

Perplexity recommended:

- **Regulations-owned data.** `LoanRegulationProfile` belongs in Regulations &
  Compliance, with Transfer querying `LoanCapVerdict` and never embedding cap
  numbers.
- **Layered profiles.** Use FIFA/global baseline rules plus domestic profile
  overlays per MVP nation profile and fallback.
- **Declarative exemptions.** Encode exemptions as predicates
  (`ageMax`, `clubTrained`, `associationTrained`, `localPlayerStatus`) rather
  than hard-coded branches.
- **Focused obligations.** Support appearance/minutes, promotion/survival,
  qualification and fixed option window in v1. Avoid bespoke rich KPI triggers.
- **Determinism.** `EvaluateObligationToBuy` should be pure over logged Match,
  League and Calendar facts. No RNG, no wall-clock and no hidden manual
  judgement.
- **Inspectable UI.** Players should see why a loan is blocked and exactly
  which obligation conditions will trigger an auto-buy.

## Weak citations / do not canonize without checks

Perplexity produced several weak/secondary citations for Italy, Spain, EA FC
and OOTP details. FMX-155 therefore uses those as pattern evidence only. The
canonical packet source-checks FIFA, Premier League, DFL, Ligue 1/LFP and
Sports Interactive directly in [[raw-loan-cap-obligation-source-checks-2026-06-16]].

## URLs surfaced

- FIFA loan regulations overview:
  https://inside.fifa.com/media-releases/fifa-to-introduce-new-loan-regulations
- FIFA RSTP June 2024 PDF:
  https://digitalhub.fifa.com/m/69b5c4c7121b58d2/original/Regulations-on-the-Status-and-Transfer-of-Players-June-2024-edition.pdf
- Premier League temporary transfer explainer:
  https://www.premierleague.com/en/news/464747
- Premier League publications:
  https://www.premierleague.com/en/media/publications
- DFL loan-player rule update:
  https://www.dfl.de/de/aktuelles/mehr-einsatzzeit-fuer-toptalente-dfl-passt-leihspieler-regelungen-an/
- Ligue 1 / LFP transfer-market rules:
  https://ligue1.com/en/articles/l1_article_244-transfer-market-now-open-what-are-the-rules-for-french-clubs
- Sports Interactive FM 2024 manual:
  https://community.sports-interactive.com/sigames-manual/football-manager-2024/transfers-recruitment-and-scouting-r4962/

