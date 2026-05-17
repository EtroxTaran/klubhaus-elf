<!--
id: D-001
title: [area:ui] Implement remaining 35 Aurelia Premier screens by phase
labels: type:feature, area:ui, prio:medium, size:l, parallel:after-design-system
milestone: M3
depends_on: A-010
output: apps/web/src/screens/**, apps/web/src/routes/**
-->

# [area:ui] Implement remaining 35 Aurelia Premier screens by phase

**ID:** D-001  
**Labels:** `type:feature`, `area:ui`, `prio:medium`, `size:l`, `parallel:after-design-system`  
**Milestone:** M3  
**Depends on:** `A-010`  
**Primary output:** `apps/web/src/screens/**, apps/web/src/routes/**`

## Goal

Phase 1 shipped 10 of 45 Aurelia Premier screens (PR #13). Implement the
remaining 35, recreating each pixel-faithfully on the Phase-1 design-system
foundation (tokens, atoms, composites, theming, i18n, strict TDD).

## Output / touched area

`apps/web/src/screens/**, apps/web/src/routes/**` (new atoms/composites as
needed; tokens already established).

## Screen groups (catalogue in [[../../10-Architecture/09-Design-System]] §10)

- 11–14 Verhandlungen (Spielervertrag, Vorstandsvertrauen, Sponsoren, Presse)
- 15–17 Taktik, Aufstellung, Statistiken
- 18–24 Spielerdetail, Training, Einzeltraining, Krankenstation, Scouting, Mannschaften, Mitarbeiter
- 25–28 Vergleiche, Profi-Modus, Rollen-Editor
- 29–34 Transferbüro, Liga-Tabelle, Pokalbaum, 2D-Ticker, Aufstellung mit Rollen, Einstellungen
- 35–38 Tabloid-Cover, Pressekonferenz, Halbzeit-Sprechblasen, Transfer-Gegenangebot
- 39–41 Heatmap, Karrierebogen, Saison-Album
- 42–45 A11y-Audit, Sponsoren-Pyramide, Tunnel-Moment, Siegerehrung

> **Needs decision:** the phase grouping and ordering of these groups requires
> product input. Treat the list above as catalogue order, not committed phases.

## Acceptance criteria

- [ ] Create a Plan Mode document in `.cursor/plans/` before implementation.
- [ ] Confirm independence checks before dispatching parallel agents.
- [ ] Add/update Vault docs in the same PR.
- [ ] Follow TDD: failing test first; per-file coverage gates green.
- [ ] Keep code, sample data, and copy IP-clean and de-DE.
- [ ] CI green: Biome, typecheck, Vitest, Playwright, Lighthouse where relevant.

## Agent prompt

Use this as an epic seed. Pull the latest design export first
([[../../30-Implementation/design-sync-workflow]]), pick a screen group, write
a plan in `.cursor/plans/`, then implement screen-by-screen on the existing
design-system foundation. Reuse Phase-1 atoms/composites; new shared elements
get the same pure-fn-split + TDD treatment.

## Independence check

- File exclusivity: screens are largely independent; new shared composites must
  be serialized.
- Interface stability: token layer + theme are stable contracts from ADR-0010.
- Config exclusivity: no package/config changes expected.
- Parallel label: `parallel:after-design-system`.
