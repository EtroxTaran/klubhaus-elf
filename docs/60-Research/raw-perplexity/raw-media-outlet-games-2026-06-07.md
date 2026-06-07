---
title: "Raw — In-game media outlets / press systems in comparable management sims (FMX-82)"
status: raw
tags: [research, raw, perplexity, media, outlets, press, prior-art, narrative, fmx-82]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
linear: FMX-82
related:
  - [[../media-outlet-operational-behaviour-2026-06-07]]
---

# Raw capture — Other games (Perplexity, 2026-06-07)

Verbatim-faithful capture of the Perplexity strand on how comparable sports-management
sims model in-game **media outlets** as a system (the outlet entity, not the article text).
Synthesis in [[../media-outlet-operational-behaviour-2026-06-07]].

## Prompt (summary)

How do football/sports management sims model in-game **media outlets** as a system?
For Football Manager, OOTP, EA Sports FC / FIFA Career Mode, Anstoss and Motorsport
Manager: are outlets/journalists persistent named entities with memory or ephemeral?
How is editorial stance/bias modelled (tabloid vs broadsheet, club-friendly vs hostile,
pundit relationships, media handling)? Is the outlet persistent with identity & reach
(local/national/global), does coverage cadence scale with club size & events, and does
stance react to rivalries/results/manager relationship? Common patterns + pitfalls; what
makes in-game media feel alive vs hollow?

## Key findings (verbatim-faithful)

Headline: most contemporary sports-management games treat **media outlets as lightweight
flavour layers**, not fully simulated persistent entities with memory, stance and reach.
Where persistence exists, it is usually at the **NPC/journalist level, not the outlet/system
level**, and "bias" is largely scripted or event-driven rather than emergent.

**Football Manager (Sports Interactive).**
- Named **journalists/pundits are persistent NPCs** across a save, attached to regions/nations
  and competitions, with a role, a club/national allegiance, a reputation level (local →
  national → continental → world) and somewhat consistent questioning style. Your handling
  of them affects future tone/coverage; relationships are part of the hidden DB.
- **Outlets themselves are NOT simulated entities** — mostly static labels/backdrops; logic is
  attached to the journalist/relationship, not the outlet.
- Stance modelled at the **NPC level**: journalist traits (favourite club, bias for/against,
  style: critical/sensationalist/positive/neutral) → question framing + headline slant. The
  manager's visible **"Media Handling"** style affects reactions. Tabloid-vs-broadsheet is
  flavour text / templates, not an exposed outlet stat.
- Reach = **reputation scope**; coverage volume scales with club reputation, competition and
  drama (title races, relegation, scandals, big transfers). Narratives shift on form, context
  (derbies/rivalries/finals) and your past comments; some persistent "narratives" tracked.

**OOTP (Out of the Park Baseball).**
- Newspaper/news/storyline systems are **event-driven text** on a chronological feed styled as
  an in-universe paper. Usually **one editable "paper" per league** as a UI wrapper — no scope/
  readership/influence stats. Beat writers/columnists named in flavour text but not persistent
  entities. Broadly neutral with template-driven narrative spin; reacts to performance/contract
  drama/injuries/milestones but **no long-term manager-media relationship memory**.

**EA Sports FC / FIFA Career Mode.**
- Press conferences/interviews/"news center" with **generic fictional outlet branding** that is
  **cosmetic only** — no stats, relationships, per-outlet behaviour or persistent beat writers.
  Responses move player/team morale; narratives are **fixed templates** keyed on form, opponent,
  derby status, player stories. Media are **purely cosmetic + morale levers**.

**Anstoss (German series).**
- In-game newspapers/illustrated headlines are a primary feedback channel with strong, comedic
  **flavour/art**. Named papers/magazines exist as **stylistic categories** (tabloid/serious/
  satirical) but with no per-outlet AI, no circulation/leaning stats, no NPC journalists with
  memory. Sensationalism/frequency scale with league level and controversial actions; tone is
  **global narration** (success = praise, failure = mocking), not outlet-specific.

**Motorsport Manager / other sims.**
- Media via emails/news/interviews; "media events" with response choices affecting chairman
  satisfaction, driver morale, public image/sponsor appeal. **No separate outlet entities**;
  articles in a generic feed; reporters named in flavour text but not trackable/influenceable.
  Stance purely contextual (win=praise/lose=criticism), no long-term per-outlet bias. Many
  text sims do even less (event-log entries + media-day morale modifiers).

## Cross-game patterns

1. **Media as event SURFACE, not agent** — outlet is mostly a skin for events.
2. **Persistence at NPC level if at all** — FM stands out (journalists/pundits); few track outlet
   stats like circulation/editorial policy.
3. **Template-based coverage stance** — tone = event type × entity reputation × hidden traits.
4. **Scaling with club size/importance** — frequency/prominence grow; scope local → national → global.
5. **Media as morale/reputation mechanic** — feeds morale/cohesion/board-fan confidence/sponsors.

## Pitfalls

1. **Repetitive, template-obvious press** (same questions/headlines; players learn optimal answers).
2. **Fake-feeling outlets** — many logos, identical behaviour (FIFA/EA brands are cosmetic).
3. **Lack of memory** — no callbacks to past controversies/feuds/promises/rivalries.
4. **No real performance↔stance loop beyond surface** — only immediate form; arcs underused.
5. **Shallow media choices** — feels like "skip or click the same answer".

## What makes media feel alive vs hollow

- **Persistent identities with coherent behaviour** (stable traits; refer back to prior takes).
- **Structured outlet model** (reach, type, alignment; type-specific impact weights — tabloids
  hit individual morale, broadsheets hit board/fan perception, fan media hit fan confidence).
- **Memory + narrative threads** as first-class objects (emerging → heating → climax → resolved;
  follow-ups), explicitly referenced and surfaced in UI.
- **Dynamic stance from relationships + context** (rivalry/history; outlet-specific relationship).
- **Non-trivial multi-system consequences** (board confidence/job security, player reputation/
  transfer interest, sponsor interest, fan sentiment) with real trade-offs.

## Design implications for a deterministic offline sim

- Represent media as **first-class entities**: identity (name/type/region reach/associations),
  stats (influence, tone, alignment), state (1–5 narrative threads/season, relationship scores).
  Seed once from league structure + fixed seed; evolve deterministically.
- Use **journalists as facades** for outlet behaviour (FM lesson).
- Model **narrative threads** as first-class objects with phases + resolution + involved outlets.
- Scale coverage from **club reputation × competition importance × recent drama**.
- Combat repetition by **parameterising templates by outlet/journalist traits + thread stage**;
  make memory **visible**; make answers **multi-axial** with precomputed deterministic outcomes.

(Perplexity citations were generic/low-quality for this niche — treated as shape evidence only,
not authority, per the vault's "genre evidence for shape not exact numbers" rule.)
