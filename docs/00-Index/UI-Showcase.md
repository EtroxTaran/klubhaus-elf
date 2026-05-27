---
title: UI Showcase
status: current
tags: [meta, ui, design]
created: 2026-05-22
updated: 2026-05-22
type: index
binding: false
related:
  - [[Home]]
  - [[../10-Architecture/09-Design-System]]
  - [[../30-Implementation/design-sync-workflow]]
---

# UI Showcase (Storybook)

The **UI showcase** note preserves the pre-reset visual reference for the
project's design system. The implementation and Storybook app were removed in
the 2026-05-27 docs-vault-only reset; treat the details below as design memory
for future re-ratification, not as a currently running app.

## Where it is

Pre-reset, it was deployed alongside this wiki — the **same** Dokploy stack, a
separate subdomain, behind the **same** login as these docs:

> Link placeholder: **<https://SHOWCASE_DOMAIN_PLACEHOLDER>**

Pre-reset local command: `pnpm --filter @soccer-manager/web storybook`
(http://localhost:6006). It is not available in the docs-only repository.

## What's in it

Everything in the design system, organised by layer:

| Section | Contents |
|---|---|
| **Foundations / Design Tokens** | Colours, typography, radius/spacing, motion — straight from `app.css`. |
| **Atoms** (10) | Crest, Portrait, StrBar, Talent, FormStrip, PosPill, Sparkline, BreakBar, PillBtn, LevyChip. |
| **Composites** (12) | PlayerCard, HubTile, InboxCard, MatchEvent, StatStrip, FormationPitch, MiniPitch, LiveXgStrip, and the Stadium set (CapacityBar, Glyphs, Plot, TypePlan, StandSideView). |
| **Layout** (1) | ScreenShell. |
| **Screens** (10) | Office Hub, Posteingang, Kader, Anpfiff, Spiel, Halbzeit, Finanzen, Stadion, Onboarding, Karriere. |

Each component also has an auto-generated **Docs** page (its prop API).

## How to read it

- The toolbar switches **Scheme** (light / dark) and **Club** (all 8) — every
  story re-renders through the real `ThemeProvider`, so you can validate the
  whole token + club-accent matrix.
- Screens render from `screens/fixtures.ts` with inert navigation, so they
  look exactly as shipped without a running game.

## Staying complete

Every atom / composite / layout / screen ships a colocated `*.stories.tsx`;
CI fails the build if a story is missing or broken, and `autodocs` documents
new components automatically. So the showcase is a complete mirror of the
design system today and stays that way as deferred screens land (see
[[../10-Architecture/09-Design-System]] §10 for the 45-screen catalogue).
## Related

- [[Home]]
- [[../10-Architecture/09-Design-System]]
- [[../30-Implementation/design-sync-workflow]]
