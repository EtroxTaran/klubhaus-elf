---
title: Raw Source Checks - Loan Cap and Obligation Catalog
status: raw
tags: [research, raw, source-check, transfer, loan, regulations, obligation-to-buy, fmx-155]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-155
related:
  - [[../loan-cap-and-obligation-catalog-2026-06-16]]
  - [[raw-loan-cap-obligation-catalog-2026-06-16]]
  - [[../../40-Execution/fmx-155-loan-cap-obligation-catalog-decision-queue-2026-06-16]]
  - [[../../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
  - [[../../50-Game-Design/regulations-and-compliance]]
---

# Raw Source Checks - Loan Cap and Obligation Catalog

## Scope

Targeted source checks for FMX-155. Perplexity is discovery; these checks decide
which facts are strong enough to cite in canonical notes.

## Primary / official anchors

### FIFA RSTP June 2024

URL:
https://digitalhub.fifa.com/m/69b5c4c7121b58d2/original/Regulations-on-the-Status-and-Transfer-of-Players-June-2024-edition.pdf

Checked findings:

- FIFA defines `Bridge transfer` as two consecutive transfers, national or
  international, connected through a middle club to circumvent rules or defraud
  a party.
- FIFA defines `Club-trained player` as registration with the current club for
  three entire seasons or 36 months between age 15 and 21.
- Article 1 allows national loan-system limits to differ from Article 10 if
  they follow integrity, youth-development and anti-hoarding principles.
- Article 10 confirms the global international loan frame used in ADR-0075:
  window-to-window minimum, maximum one year, sub-loan prohibition, six in/six
  out international cap after transition, same-pair three cap and U21
  club-trained exemption from the counting caps.
- Article 5bis presumes two consecutive transfers within 16 weeks are a bridge
  transfer unless established otherwise.

Status for FMX: strong primary source for global baseline and the need for
domestic overlays.

### FIFA 2022 loan regulations media release

URL:
https://inside.fifa.com/media-releases/fifa-to-introduce-new-loan-regulations

Checked findings:

- FIFA states objectives: youth development, competitive balance and preventing
  hoarding.
- FIFA names the written-agreement requirement, duration limits,
  sub-loan prohibition, three-per-pair cap and transition to six in/six out
  from 1 July 2024.
- FIFA says member associations get a domestic implementation period aligned
  with the same principles.

Status for FMX: strong official explainer for design rationale and readable
summary; PDF remains canonical wording.

### Premier League temporary transfers

URL:
https://www.premierleague.com/en/news/464747

Checked findings:

- Premier League calls loans between Premier League clubs and other English
  clubs temporary transfers.
- Premier League clubs may not register more than two domestic loan players at
  one time.
- Maximum domestic loans registrable in one season is four.
- No more than one domestic loan from the same club at one time.
- A club cannot loan to another Premier League club a player acquired in the
  same transfer window.
- A Premier League club may loan no more than one goalkeeper to another Premier
  League club.
- Loans from clubs in another national association do not count toward the
  Premier League domestic quotas, with the Welsh-club exception noted by the
  source.

Status for FMX: strong official source for an England-like strict domestic
profile pattern.

### Premier League publications

URL:
https://www.premierleague.com/en/media/publications

Checked findings:

- Premier League Handbook 2025/26 was published 24 July 2025.

Status for FMX: supports current-publication currency. FMX uses the public
explainer, not direct handbook text, to avoid copying rule wording.

### DFL loan-player rule update

URL:
https://www.dfl.de/de/aktuelles/mehr-einsatzzeit-fuer-toptalente-dfl-passt-leihspieler-regelungen-an/

Checked findings:

- On 4 December 2025 DFL announced changes for loaned young German players from
  the following season.
- Clubs must hold at least twelve German licensed players on the eligibility
  list for each competitive match.
- Up to two German licensed players who complete at most age 23 in the season
  may count for that requirement while loaned to a German club at Regionalliga
  level or above.
- Those players do not count toward the national loan quota of at most six if
  the loaning club runs a U23 team.
- U21 licensed players with local-player status are generally exempt from the
  national loan limit.

Status for FMX: strong official source for a Germany-like youth-exemption
profile. The exact full domestic loan catalog still needs legal review before
release because this page is an update, not a full handbook.

### Ligue 1 / LFP transfer-market rules

URL:
https://ligue1.com/en/articles/l1_article_244-transfer-market-now-open-what-are-the-rules-for-french-clubs

Checked findings:

- Loans may be made for one season, with possible renewal.
- A French club can host a maximum of five loaned players.
- A club can temporarily transfer seven licensed players.
- A club can loan at most two players to the same club.
- International loans are six outgoing and six incoming.
- LFP notes non-EU loanee handling as a separate squad-registration issue.

Status for FMX: strong official/public league source for a France-like domestic
profile.

### Sports Interactive Football Manager 2024 manual

URL:
https://community.sports-interactive.com/sigames-manual/football-manager-2024/transfers-recruitment-and-scouting-r4962/

Checked findings:

- Football Manager differentiates transfer offers and loan offers.
- Loan offers can specify duration, wage contribution, fees and loan options.
- Playing and non-playing monthly fees/wages can depend on whether the player
  reaches playing-time expectations.
- Future fee can be configured when there is an intention to keep the player
  long-term.
- When loaning a player out, the source explicitly surfaces parent-club match
  availability, cup-tied concern, early termination and regular playing-time
  intent.

Status for FMX: strong official game-precedent source for loan package depth,
not for legal regulation values.

## Secondary / weak pattern-only inputs

- Italy and Spain domestic caps were not source-checked against a stable
  official public document in this pass. FMX should treat Italy-like and
  Spain-like numbers as fictional profile presets, not legal clones.
- EA FC Career and OOTP-like precedents are useful accessibility and league-rule
  configurability signals, but no primary source was canonized here. Football
  Manager remains the direct game precedent.

## FMX source-check conclusion

Canonize the structural data model, not source wording:

- FIFA/global baseline is strong and should be layered under every profile.
- England-like, Germany-like and France-like domestic overlays can use
  official-source patterns.
- Italy-like and Spain-like profiles should be fictional, balanced and
  source-reviewable later.
- All rule labels and UI text must use FMX-owned terminology under GD-0015 and
  ADR-0007.

