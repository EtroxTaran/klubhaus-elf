---
title: "Raw - sports-management simulation quality tiers (FMX-147)"
status: raw
tags: [research, raw, perplexity, game-design, sports-management, simulation, quality-profile, settlement, fmx-147]
created: 2026-06-12
updated: 2026-06-12
type: research
binding: false
linear: FMX-147
related:
  - [[../quality-profile-enum-settlement-path-2026-06-12]]
  - [[../../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[../../50-Game-Design/match-engine]]
  - [[../../60-Research/match-engine-runtime-strategy]]
---

# Raw - sports-management simulation quality tiers (FMX-147)

## Research prompt

Perplexity was asked how football/baseball/sports-management games distinguish full interactive matches, quick-play modes, background simulation and mass season simulation, and how those tiers should inform FMX's quality-profile-to-settlement-path mapping.

## Key findings

- Sports-management games commonly separate player attention/control from background simulation throughput.
- High-interaction modes expose granular events and strategic control, while quick-play/background modes collapse many sub-events for pace.
- The simulation can still remain authoritative and deterministic across modes if the contract explicitly states which output depth each mode produces.
- Offscreen mass simulation needs cheap routing and minimal micromanagement; otherwise long-save pacing breaks.
- When a match can later be inspected/resimulated in more detail, the system needs a reconciliation mechanism rather than silent reinterpretation of the original summary.

## Klubhaus Elf-specific extraction

| Game precedent | FMX implication |
|---|---|
| Full play-by-play modes | `competitive-full` should keep foreground per-event settlement |
| Reduced interactive modes | `interactive-standard` can still use foreground per-event settlement, just with less presentation/control detail |
| Quick-play/background modes | `background-fast` should use the lightweight stateless path |
| Detailed offscreen sim | `background-detailed` should settle cheaply now, but be upgradable/reconciled by reversal+repost if resimmed |
| Mass season throughput | Profile routing must be deterministic, typed and cheap to evaluate |

## Source trail

- Perplexity research pass, 2026-06-12: football-manager and sports-management quality tiers, quick-play/background simulation and deterministic output-depth routing. The strongest directly verifiable game sources found in the follow-up pass were OOTP and ZenGM; Football Manager-specific points are treated as genre background unless separately sourced elsewhere in the vault.
- OOTP manual, game controls - play-by-play control, Quick-Play Bar and one-pitch vs pitch-by-pitch modes, with higher-control modes taking longer: <https://manuals.ootpdevelopments.com/index.php?man=ootp15&page=game_controls>
- ZenGM - browser sports-management family emphasizing mass simulation and low micromanagement; public site reports users simulate more than 70,000 seasons per day: <https://zengm.com>
- FMX prior synthesis, match-engine runtime strategy - already defines the need for explicit match quality profiles so hundreds of matchday fixtures do not all run at full fidelity: [[../match-engine-runtime-strategy]]

## Notes for synthesis

Comparable games support four quality profiles: two foreground modes that preserve event-level settlement, one detailed background mode that can reconcile if upgraded/resimmed, and one lightweight mass-simulation path. A three-value commercial class hides the distinction between `interactive-standard` and `background-detailed`, which is exactly the settlement-routing ambiguity FMX-147 is meant to close.
