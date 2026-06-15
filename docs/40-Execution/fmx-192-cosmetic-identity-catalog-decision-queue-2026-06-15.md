---
title: "FMX-192 cosmetic identity catalog decision queue"
status: current
tags: [execution, decision-queue, cosmetics, identity, monetization, no-p2w, fmx-192]
created: 2026-06-15
updated: 2026-06-15
type: decision-queue
binding: false
linear: FMX-192
related:
  - [[../60-Research/cosmetic-identity-catalog-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-cosmetic-identity-realworld-football-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-cosmetic-identity-game-precedents-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-cosmetic-identity-catalog-ux-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-cosmetic-identity-source-checks-2026-06-15]]
  - [[../50-Game-Design/GD-0045-cosmetic-identity-catalog]]
  - [[../20-Features/feature-cosmetic-identity-catalog]]
  - [[session-handoffs/2026-06-15-fmx-192-cosmetic-identity-catalog]]
---

# FMX-192 cosmetic identity catalog decision queue

## Beat state

- Linear: FMX-192 moved from Backlog to In Progress on 2026-06-15.
- Branch/worktree: `codex/fmx-192-cosmetic-identity-catalog` at
  `/tmp/fmx-192-cosmetic-identity-catalog`.
- Base: refreshed `main` / `origin/main` at `0623009` before work started.
- Packet: raw research, source checks, synthesis, draft GD-0045, draft feature
  slice and handoff prepared.
- Binding status: non-binding until Nico answers D1-D7.

## Nico decisions needed

### D1 - Record shape

Option A: Use draft [[../50-Game-Design/GD-0045-cosmetic-identity-catalog]] plus
draft [[../20-Features/feature-cosmetic-identity-catalog]], no new ADR for this
beat.

Option B: Add a new ADR for the catalog contract now.

Option C: Only update GD-0041 / ADR-0107 without a dedicated cosmetics GDDR.

**Recommendation: A.** This beat is product/game-design taxonomy. ADR-0107,
ADR-0108 and ADR-0122 already cover pricing/no-P2W/responsible-gaming
boundaries. A new ADR now would duplicate future commerce decisions.

### D2 - Free baseline identity

Option A: Require free baseline Create-a-Club identity: name, colors, crest and
starter kit.

Option B: Free only minimal identity, with most visual choice reserved for paid
or supporter layers.

Option C: Delay baseline/premium split until pricing.

**Recommendation: A.** The Create-a-Club fantasy depends on identity expression.
Paywalling baseline identity would weaken onboarding and product trust.

### D3 - Catalog item families

Option A: Use the proposed eight-family taxonomy:
`base_identity`, `crest_variant`, `palette`, `kit_pattern`,
`generic_sponsor_layer`, `profile_frame_banner`, `stadium_visual_ui_theme`,
`season_card_cosmetic_set`.

Option B: Ship only crest/kit/palette now and leave all other families unnamed.

Option C: Define a broader marketplace-style catalog with emotes, stickers,
animations, avatars, stadiums, effects and packs now.

**Recommendation: A.** It is broad enough for future pricing/legal hooks and
narrow enough to avoid launch scope creep.

### D4 - Monetization and acquisition guardrail

Option A: Deterministic, non-tradeable cosmetics only; no paid random rewards,
no paid power, no paid information and no paid extra attempts.

Option B: Deterministic paid cosmetics now, but leave random cosmetic packs open
for later.

Option C: Do not decide guardrails until final pricing.

**Recommendation: A.** It aligns with draft GD-0041, ADR-0108 and FMX-193 while
reducing rating, legal and trust risk.

### D5 - Async/shared visibility

Option A: Allow light cosmetic visibility in async/private groups only when
mechanically inert, IP-clean, accessibility-checked, privacy-safe and not a rank
signal.

Option B: Keep all cosmetics private until a full social/profile system exists.

Option C: Allow public cosmetic display without extra gates because cosmetics
are inert.

**Recommendation: A.** It preserves the accepted GD-0044 achievement-kit
allowance while preventing a de facto paid/status ranking surface.

### D6 - IP-clean and accessibility evidence

Option A: Require item-level and equipped-bundle IP/accessibility evidence
before shared/public display.

Option B: Require item-level checks only.

Option C: Treat evidence as an implementation detail.

**Recommendation: A.** Real risk is bundle similarity and match/UI readability,
not only exact asset copying.

### D7 - Season-card timing

Option A: Later only; cosmetic-only, deterministic, non-tradeable and
evergreen/rerunnable by default.

Option B: Include a launch season card to fund content cadence.

Option C: Leave season-card design fully open.

**Recommendation: A.** It avoids launch scope creep and hard FOMO pressure
while preserving a future non-power product hook.

## Recommended approval string

**D1=A, D2=A, D3=A, D4=A, D5=A, D6=A, D7=A**.

## Research saved

- [[../60-Research/raw-perplexity/raw-cosmetic-identity-realworld-football-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-cosmetic-identity-game-precedents-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-cosmetic-identity-catalog-ux-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-cosmetic-identity-source-checks-2026-06-15]]
- [[../60-Research/cosmetic-identity-catalog-2026-06-15]]

## If Nico approves

- Promote the chosen decision text into GD-0045 and feature scope.
- Only then update `status`/`binding` according to the ratification decision.
- Keep pricing/SKU/payment/refund questions routed to the commerce/legal
  packets rather than smuggling them into this catalog.

## Related

- [[../60-Research/cosmetic-identity-catalog-2026-06-15]]
- [[../50-Game-Design/GD-0045-cosmetic-identity-catalog]]
- [[../20-Features/feature-cosmetic-identity-catalog]]

