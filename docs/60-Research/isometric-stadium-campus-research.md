---
title: Isometric Stadium & Campus — Presentation Research
status: current
tags: [research, design, 3d, stadium, presentation]
updated: 2026-05-27
type: research
related: [[stadium-and-campus]], [[anstoss-series-deep-dive]], [[presentation-renderer-strategy]], [[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]], [[../10-Architecture/09-Design-Styleguide]]
---

# Isometric Stadium & Campus — Presentation Research

Grounds the **isometric "Vereinsgelände" (club-campus) scene** in the interactive
styleguide deployment (`tools/styleguide/overlay/iso/`, Babylon.js). Captures the
external research (Perplexity + web, 2026-05-27) and the resulting build decision.
The on-the-pitch/game mechanics this visualises are owned by
[[stadium-and-campus]]; the renderer policy by [[presentation-renderer-strategy]]
and [[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]].

## 1. What an Anstoss-style isometric club campus shows

Anstoss (esp. *Anstoss 3* / *2005*) rendered the stadium **and its surroundings
("Stadionumfeld")** as an isometric, SimCity-like campus of individually
upgradeable structures. Our scene mirrors that vocabulary, mapped to our own
[[stadium-and-campus]] modules:

| Tier | Elements | Our mechanic (source) |
|---|---|---|
| **Core** | Pitch + 4 stands (N/S/E/W), roof ring, floodlight masts, scoreboard, forecourt/concourse + entrance gates | capacity/atmosphere/seat-mix — [[stadium-and-campus]] §1–§4 |
| **Economic** | Parking, fan shop, catering/Würstchenbude, VIP/hospitality hint (east stand) | dwell-time + per-capita revenue — [[stadium-and-campus]] §4, [[fan-ecology]] |
| **Campus** | Training pitches, youth academy, medical/rehab, museum, boutique hotel | process quality + long-term value — [[stadium-and-campus]] §5, [[youth-academy-and-development]] |
| **Decoration** | Trees/greenery, signage, paths | atmosphere only |

Comparable references: *We Are Football* (editable grounds), *Top Eleven 2026*
campus, *New Star Manager*, *Club Manager* — all read as "a football club" from an
iso angle via **pitch-centred stadium + separate training fields + parking + a few
named facility buildings**.

Sources: Anstoss 3 infrastructure gameplay (youtube.com/watch?v=MuTabPKO0mk),
We Are Football campus builder (youtube.com/watch?v=paZgLl593P0), Top Eleven 2026
(topeleven.com/topeleven2026/).

## 2. Babylon.js isometric best practices (applied)

- **Orthographic camera** at the true isometric angle (azimuth 45°, elevation
  ≈35.264°); zoom by adjusting the ortho frustum, not the radius.
  (forum.babylonjs.com/t/how-to-properly-setup-a-scene-for-an-isometric-game/24447)
- **Thin instances** for repeated props (parked cars, trees) — one draw call each.
  (doc.babylonjs.com/features/featuresDeepDive/Mesh/thinInstances)
- **MergeMeshes** for static chunks (markings, masts); `material.freeze()`,
  `mesh.freezeWorldMatrix()`, `scene.freezeActiveMeshes()`, `skipPointerMovePicking`,
  `engine.setHardwareScalingLevel(1/min(DPR,1.5))` for mobile.
  (doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene)
- Responsive canvas via `ResizeObserver` → `engine.resize()` + ortho recompute;
  `prefers-reduced-motion` disables auto-rotate; static SVG fallback when WebGL is
  unavailable; keyboard controls for a11y.

## 3. Asset options — for a future asset pass (reference)

Not used now (see decision below), kept for when richer visuals are wanted:

- **CC0 / CC-BY model sources:** Kenney.nl (city/building kits), Quaternius,
  Poly Pizza (native GLB), Sketchfab (CC0/CC-BY + glTF filter), OpenGameArt.
  Track attribution; convert to GLB; keep textures ≤1024², vertex colours preferred.
- **AI text-to-3D (2025–2026):** Meshy (best game-ready topology), Tripo3D (fast),
  Rodin/Hyper3D (export-rich); avoid Luma Genie / Stable Fast 3D for low-poly props.
  **Commercial licensing of free tiers is unclear — verify before any branded use.**
- **Prompt template (low-poly, game-ready, single object):** front-load
  `low-poly, flat-shaded, game-ready, single object, centered, no background,
  under ~Ntris`, then the subject + muted brand-colour language; generate props
  separately, reuse a fixed style header for set consistency.
  (sloyd.ai/blog/7-best-practices-for-ai-generated-3d-models-in-game-development)

## 4. Decision (result)

**The styleguide iso campus is built procedurally in Babylon.js** (no binary
assets, no AI models). Rationale: full Aurelia-Premier brand control, zero
licensing ambiguity, tiny footprint, no build pipeline, and it is safely shippable
without visual verification in CI. Curated CC0 / AI-generated assets remain a
documented **future, optional** enhancement (§3).

This is recorded as research/reference, **not** a new ADR — it is a styleguide-demo
implementation choice under the existing
[[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]]
(Babylon as the optional 3D engine) and [[presentation-renderer-strategy]];
promotion to an ADR remains an owner decision. Implementation lives in
`tools/styleguide/overlay/iso/` (`config.js` tokens, `campus.js` geometry,
`main.js` orchestration); see [[../10-Architecture/09-Design-Styleguide]].

## Related

- [[stadium-and-campus]] — the game mechanics this visualises
- [[anstoss-series-deep-dive]] — Anstoss DNA (stadium + Umfeld)
- [[presentation-renderer-strategy]] · [[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]]
- [[../10-Architecture/09-Design-Styleguide]] · [[../10-Architecture/09-Design-System]]
