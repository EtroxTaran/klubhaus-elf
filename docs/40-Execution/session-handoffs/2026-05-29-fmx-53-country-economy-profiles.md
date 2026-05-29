---
title: Handoff FMX-53 Top-5 Country Economy Calibration Profiles
status: wrapped
tags: [meta, execution, handoff, economy, country-profile, fmx-53]
created: 2026-05-29
updated: 2026-05-29
type: handoff
binding: false
related:
  - [[../../60-Research/top5-country-economy-profiles-2026-05-29]]
  - [[../../60-Research/raw-perplexity/raw-top5-country-economy-profiles-2026-05-29]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
---

# Handoff: FMX-53 Top-5 Country Economy Calibration Profiles (2026-05-29)

## Linear

- Issue: FMX-53 (High; `type:research`, `risk:legal`, `needs:nico-decision`,
  `area:squad-club`, `type:game-design`). Transitioned to In Progress 2026-05-29.
- Related: FMX-41 (economy impact map), FMX-13 (economy blueprint).
- Project: Phase 1 — Research & Architecture.

## Done this session

- Grounded in existing economy/regulation vault docs (economy-system §9,
  GD-0008, GD-0022, regulations-and-compliance, regulations-and-pyramids,
  club-economy-blueprint, club-economy-impact-map, cup-revenue sibling).
- Ran four thematic Perplexity passes spanning all five countries at equal
  depth: (1) revenue mix, (2) media distribution + financial-control regime +
  parachute, (3) matchday & season-ticket culture + stadium ownership,
  (4) commercial scale + tax/levy + matchday operating costs. Captured lossless
  in [[../../60-Research/raw-perplexity/raw-top5-country-economy-profiles-2026-05-29]].
- Authored [[../../60-Research/top5-country-economy-profiles-2026-05-29]]:
  equal-depth Top-5 + abstract matrix, draft `CountryEconomyProfile` schema,
  IP-clean preset handles, gameplay-affecting differences, banded calibration
  ranges (marked NOT final), Gherkin acceptance scenarios, first-baseline
  recommendation, and explicit open Nico decisions.
- Wired into Research-Map (synthesis section + raw-transcript entry), pointed
  economy-system §9 at the note (+ related/tags/updated bump), and added an
  FMX-53 entry to Current-State (+ related/updated bump).
- `node scripts/docs-check.mjs` green (355 notes).

## Open / next step

Nico-gated decisions surfaced in the note:

- First calibration baseline order (proposed abstract → Germany-like →
  England-like).
- One profile per country vs splitting bimodal leagues (Spain/France) into
  giant/tail sub-profiles.
- Continental squad-cost overlay timing (first playable vs profile-data-only).
- Tax/levy depth (single net-wage knob vs modelling time-boxed expat regimes +
  French 5% media levy).
- Confirm England-like is the only profile with a material parachute.
- Whether this feeds a draft ADR or stays research backing economy-system §9.

## Blockers

- Several ticketing / stadium-ownership / tax figures are secondary-source or
  "widely established" confidence — flagged in the note for a primary-source
  re-check before any band becomes a final constant (esp. Italy, and the
  Spain/Italy expat-tax status). Not blocking the synthesis; blocking final
  calibration sign-off.

## Changed vault paths

- `docs/60-Research/top5-country-economy-profiles-2026-05-29.md` (new)
- `docs/60-Research/raw-perplexity/raw-top5-country-economy-profiles-2026-05-29.md` (new)
- `docs/00-Index/Research-Map.md`
- `docs/00-Index/Current-State.md`
- `docs/50-Game-Design/economy-system.md`
- `docs/40-Execution/session-handoffs/2026-05-29-fmx-53-country-economy-profiles.md` (new)
