---
title: Design Styleguide — Aurelia Premier
status: current
tags: [architecture, design, ui, styleguide]
created: 2026-05-27
updated: 2026-05-27
type: reference
related: [[09-Design-System]], [[09-Decisions/ADR-0010-design-system]], [[09-Decisions/ADR-0048-design-update-and-migration-path]], [[09-Decisions/ADR-0047-babylon-3d-presentation-engine]]
---

# Design Styleguide — Aurelia Premier

Rendered, at-a-glance styleguide for the **Aurelia Premier** design system
("Sonntagszeitung", Direction A). The **source of truth** is
[[09-Design-System]] §2–4 (synced from claude.ai/design via
[[../30-Implementation/design-sync-workflow]], decision [[09-Decisions/ADR-0010-design-system]]);
the recurring-update path is [[09-Decisions/ADR-0048-design-update-and-migration-path]].
The deployed wiki itself is themed from exactly these tokens
(`tools/docs-preview/custom.scss`).

> Token values below are the export-confirmed set (`tailwind.config.ts`,
> 2026-05-27). If they ever diverge from [[09-Design-System]], that note wins.

## Colour tokens

<div style="display:flex;flex-wrap:wrap;gap:10px;margin:8px 0">
<span style="display:inline-block;width:120px"><span style="display:block;height:42px;border-radius:8px;border:1px solid #00000022;background:#f4ede0"></span><code>paper #f4ede0</code></span>
<span style="display:inline-block;width:120px"><span style="display:block;height:42px;border-radius:8px;border:1px solid #00000022;background:#fbf6ea"></span><code>card #fbf6ea</code></span>
<span style="display:inline-block;width:120px"><span style="display:block;height:42px;border-radius:8px;border:1px solid #00000022;background:#d9cdb4"></span><code>rule #d9cdb4</code></span>
<span style="display:inline-block;width:120px"><span style="display:block;height:42px;border-radius:8px;background:#1a1410"></span><code>ink #1a1410</code></span>
<span style="display:inline-block;width:120px"><span style="display:block;height:42px;border-radius:8px;background:#5a4f44"></span><code>ink-mute #5a4f44</code></span>
<span style="display:inline-block;width:120px"><span style="display:block;height:42px;border-radius:8px;background:#7a6f63"></span><code>ink-soft #7a6f63</code></span>
<span style="display:inline-block;width:120px"><span style="display:block;height:42px;border-radius:8px;background:#b7301b"></span><code>accent #b7301b</code></span>
<span style="display:inline-block;width:120px"><span style="display:block;height:42px;border-radius:8px;background:#e8553b"></span><code>accent dark #e8553b</code></span>
<span style="display:inline-block;width:120px"><span style="display:block;height:42px;border-radius:8px;background:#3f6a2f"></span><code>ok #3f6a2f</code></span>
<span style="display:inline-block;width:120px"><span style="display:block;height:42px;border-radius:8px;background:#a3680f"></span><code>warn #a3680f</code></span>
<span style="display:inline-block;width:120px"><span style="display:block;height:42px;border-radius:8px;background:#9b1f0a"></span><code>danger #9b1f0a</code></span>
</div>

Light/dark switch via the `data-scheme` attribute; the scarlet accent re-tints
per club via `--c-accent` (8 IP-clean clubs). Status is **never colour-only** —
always paired with a glyph/letter.

## Typography

- **Display — Newsreader** (`--font-display`): headlines, tabloid copy, card names.
  <span style="font-family:Newsreader,serif;font-size:26px">Anpfiff in der Sonntagszeitung</span>
- **Sans — Inter** (`--font-sans`): UI chrome, body, controls.
  <span style="font-family:Inter,system-ui;font-size:16px">Weiter zum nächsten Termin — 12.500 €</span>
- **Mono — JetBrains Mono** (`--font-mono`): fees, scoreboard, ticker.
  <span style="font-family:'JetBrains Mono',monospace;font-size:16px">2,4 Mio. € · 90:00 · 3–1</span>

## Radius & spacing

- Radius (paper, not glass): `sm 8` · `md 10` · `lg 14` · `xl 18` · `2xl 24` px.
- Spacing reserves: `thumb 12rem` (one-handed zone) · `hub 7rem` (hub-tile) ·
  `tap 2.75rem` (≥44 px WCAG target).

## Motion

Short, gated keyframes (`event-in` · `cheer` · `ticker-slide` · `pulse-dot`),
all neutralised under `prefers-reduced-motion`.

## Components & screens

The component layers (12 atoms, 10 composites, layout, screens) and the full
45-screen catalogue live in [[09-Design-System]] §5/§10. Post-MVP isometric /
3D stadium scenes render via **Babylon.js**
([[09-Decisions/ADR-0047-babylon-3d-presentation-engine]]).

## Related

- [[09-Design-System]] — code-authoritative design reference (source of truth)
- [[09-Decisions/ADR-0010-design-system]] · [[09-Decisions/ADR-0048-design-update-and-migration-path]]
- [[../30-Implementation/design-sync-workflow]] — how design updates flow in
