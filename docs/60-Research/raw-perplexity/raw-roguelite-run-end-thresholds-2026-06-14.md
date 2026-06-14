---
title: "Raw - roguelite run-end thresholds and football insolvency precedent (FMX-137)"
status: raw
tags: [research, raw, perplexity, roguelite, run-end, insolvency, board, fmx-137]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-137
related:
  - [[../roguelite-run-end-and-carry-economy-tuning-2026-06-14]]
  - [[../../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]]
  - [[../../50-Game-Design/mode-create-a-club-roguelite]]
  - [[../../40-Execution/fmx-137-roguelite-tuning-decision-queue-2026-06-14]]
---

# Raw - roguelite run-end thresholds and football insolvency precedent (FMX-137)

## Research prompt

Perplexity was asked for football-domain precedent that should inform a
Create-a-Club Roguelite run-end rule: financial insolvency, administration,
licence failure, board control loss, club liquidation/expulsion and manager
sacking. The prompt asked for realistic thresholds that still make sense as a
roguelite "run loss" gate.

## Source-quality note

The result was useful for design direction but not enough to set legal or
country-specific licence rules. FMX-137 therefore uses it as product evidence:
real football supports a staged distress ladder and grace period, while exact
country/tier bands remain calibration and regulations-profile work.

## Extracted findings

- Football insolvency is best modelled as a **process**, not a single moment:
  cash stress, overdue obligations, embargoes, administration/restructuring and
  licence consequences appear before final loss of sporting control.
- UEFA-style financial sustainability frames club health around solvency,
  stability and cost control over periods, not an instant "cash below zero =
  game over" switch.
- Liquidity below zero is a clear danger signal, but as a game threshold it
  should open a recovery/licence-review window instead of ending the run
  immediately.
- Administration, licence loss, forced disposal or liquidation are credible
  hard-failure anchors. They arrive after failed remedies, arrears or rule
  breach, not at first forecast breach.
- Board control loss is realistic as a separate run-end route. Football clubs
  may tolerate a bad season if the recovery plan is credible, but repeated
  failure against board objectives should trigger a visible last-chance/sacking
  ladder.
- The best roguelite default is a **tiered failure ladder** with recovery
  levers: visible warning, constrained rescue actions, licence review, last
  chance, then run end.
- "Forced dissolution" is too rare and legally specific for routine tuning. It
  should stay as an extreme/reserved end condition, not the main default.

## Design implications carried forward

- FMX should keep negative liquidity as a pressure state, not a hard end.
- The product-level default can set a simple, readable grace rule, while
  fine-grained monetary bands and country/tier differences stay in calibration
  or regulations profiles.
- A 2-month unresolved month-end failure gate is a reasonable MVP default:
  enough time for recovery choices, short enough that the roguelite stakes are
  legible.
- Board run-end should use the existing GD-0030 board confidence and
  `last_chance` ladder, not a raw "two bad seasons" counter disconnected from
  expectations.

## Source trail

- Oxera, "Assessing the financial regulation of European football clubs":
  <https://www.oxera.com/wp-content/uploads/2024/09/Assessing-the-financial-regulation-of-European-football-clubs.pdf>
- LawInSport, "How financial regulation affects competition across Europe's big five football leagues":
  <https://www.lawinsport.com/topics/item/how-financial-regulation-affects-competition-across-europe-s-big-five-football-leagues>
- ScienceDirect, football-club financial distress / bankruptcy analysis:
  <https://www.sciencedirect.com/science/article/pii/S2405844023100946>
- EFSUPIT, football club finance and insolvency paper:
  <http://efsupit.ro/images/stories/april2024/Art%20104.pdf>
- Wittenborg, "Bankruptcy trends among European football clubs":
  <https://www.wittenborg.eu/bankruptcy-trends-among-european-football-clubs-new-study-reveals-key-insights.htm>
- Entertainment and Sports Law Journal, football insolvency / governance material:
  <https://www.entsportslawjournal.com/article/id/838/>
- PMC, football-club insolvency and governance article:
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC6932787/>

## Related

- [[../roguelite-run-end-and-carry-economy-tuning-2026-06-14]]
- [[../../50-Game-Design/GD-0044-create-a-club-roguelite-run-tuning]]

