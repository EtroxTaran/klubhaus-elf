<!--
id: A-010
title: [architecture] Expand arc42 docs from research and ADRs
labels: type:adr, area:docs, area:architecture, prio:high, size:m, parallel:after-adr
milestone: M1 Research & Architecture
depends_on: A-001, A-002, A-003, A-004, A-005, A-006, A-007, A-008, A-009
output: docs/10-Architecture/
-->

# [architecture] Expand arc42 docs from research and ADRs

**ID:** A-010  
**Labels:** `type:adr`, `area:docs`, `area:architecture`, `prio:high`, `size:m`, `parallel:after-adr`  
**Milestone:** M1 Research & Architecture  
**Depends on:** `A-001`, `A-002`, `A-003`, `A-004`, `A-005`, `A-006`, `A-007`, `A-008`, `A-009`  
**Primary output:** `docs/10-Architecture/`

## Goal

Expand the arc42 architecture skeleton into a coherent draft that reflects completed research and ADRs.

## Output

Update files in `docs/10-Architecture/01-Introduction.md` through `11-Risks.md`, excluding individual ADR files unless fixing links.

## Acceptance criteria

- [ ] Building blocks and runtime views reflect ADR decisions.
- [ ] Crosscutting concerns include security, PWA updates, accessibility, performance, error handling.
- [ ] Deployment chapter matches Dokploy plan and known external blockers.
- [ ] Risks chapter includes TanStack Start beta, IP naming, offline save migrations, cloud sync.
- [ ] Mermaid diagrams render and are simple enough for Obsidian/GitHub.
- [ ] Decision Log links are current.

## Agent prompt

Read the finalized ADRs and research summary. Expand the arc42 docs in `docs/10-Architecture/` into a coherent architecture draft. Do not edit app code or package configs.

## Independence check

- File exclusivity: writes architecture docs except ADRs.
- Interface stability: no code/schema changes.
- Config exclusivity: no config changes.
- Parallel label: `parallel:after-adr`.
