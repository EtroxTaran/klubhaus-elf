---
title: UI Showcase
status: current
tags: [meta, ui, design]
updated: 2026-06-09
---

# UI Showcase (Storybook)

> **2026-05-27 — the live showcase is currently the INTERACTIVE design styleguide**
> (the claude.ai/design export, **Babylon-only**), deployed as its own auth-gated site
> (`tools/styleguide/`, `docker-compose.docs.yml`, `STYLEGUIDE_DOMAIN`). Its landing page
> is a **clickable hub** that links every part — the design canvas, component library,
> component-states, both prototypes, the Babylon stadium, a dedicated **isometric
> club-campus scene** (Anstoss-style stadium + infrastructure), the maps and the `.md`
> docs (hub + iso scene added via a build-time overlay, so the export snapshot stays
> untouched). The hub is the landing at `/`; the heavy design canvas is at `/canvas.html`.
> The Storybook description below is the
> **eventual** app's component showcase and returns when the app is rebuilt. Durable
> token reference: [[../10-Architecture/09-Design-Styleguide]].

The **UI showcase** is the canonical *visual* reference for the project's
design system. The code in `apps/web/src` stays authoritative on any conflict
(see [[../10-Architecture/09-Design-System]] §13); the showcase is where you
*see and explore* every piece rendered in isolation.

## Where it is

It is deployed alongside this wiki — the **same** Dokploy stack, a separate
subdomain, behind the **same** login as these docs:

> ðŸ”— **<https://SHOWCASE_DOMAIN_PLACEHOLDER>**

Run it locally instead with `pnpm --filter @klubhaus-elf/web storybook`
(http://localhost:6006).

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
