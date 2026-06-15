---
title: "Raw responsible-gaming legal/regulatory discovery (FMX-193)"
status: raw
tags: [research, raw, perplexity, responsible-gaming, dark-patterns, loot-boxes, gambling, consumer-law, dsa, usk, iarc, fmx-193]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-193
related:
  - [[../responsible-gaming-binding-record-2026-06-15]]
  - [[raw-responsible-gaming-source-checks-2026-06-15]]
  - [[../../40-Compliance/responsible-gaming]]
  - [[../../10-Architecture/09-Decisions/ADR-0122-responsible-gaming-and-dark-pattern-invariant]]
  - [[../../40-Execution/fmx-193-responsible-gaming-decision-queue-2026-06-15]]
---

# Raw responsible-gaming legal/regulatory discovery (FMX-193)

## Prompt

Perplexity research requested a 2026-06-15 current legal/regulatory view for a
Germany/EU indie football-manager PWA, focused on responsible gaming, loot boxes,
dark patterns, youth/rating evidence, and whether FMX should create a binding
responsible-gaming record.

## Raw capture

Perplexity's answer treated the Austrian Supreme Court decision `6 Ob 228/24h`
as the newest DACH loot-box signal. It said the decision held the specific FIFA
Ultimate Team pack mechanics outside the Austrian gambling act when assessed in
the overall game context, but also warned that the result is fact-specific and
does not create a general safe harbor for paid random rewards.

The answer recommended keeping FMX's existing no-loot-box posture even if some
European case law is moving toward contextual rather than isolated loot-box
analysis. The stated rationale was product trust, German youth-protection risk,
IARC/USK descriptors, consumer-law pressure, and simpler compliance evidence.

For dark patterns, the answer pointed to the EU Digital Services Act (DSA) and
the developing EU digital-fairness policy direction. It recommended treating
false urgency, confusing opt-outs, hidden paid defaults, daily login pressure,
guilt copy, roach-motel cancellation and limited-time monetization pressure as
blocked patterns, even before FMX is large enough to face the strictest platform
obligations.

For age/rating evidence, the answer recommended maintaining IARC/USK evidence
alongside monetization evidence: content descriptors, interactive elements,
in-game-purchase descriptors, randomized-purchase absence, screenshots and
release notes.

## Perplexity source list captured

| Source mentioned by Perplexity | Treatment in this packet |
|---|---|
| DLA Piper article on Austrian Supreme Court `6 Ob 228/24h` | Source-checked and used as high-quality secondary legal commentary. |
| Esports Legal News article on the same Austrian decision | Treated as corroborating secondary commentary only. |
| European Commission DSA overview / DSA text | Source-checked through official Commission material. |
| USK IARC games/apps page | Source-checked and used. |
| IARC developer/rating flow | Source-checked and used. |
| WHO ICD-11 gaming disorder FAQ | Source-checked and used. |
| Digital Fairness Act / fitness-check discussion | Treated as policy-watch only; not used as binding law. |

## Immediate synthesis from discovery

- A "no paid random rewards" invariant is the safest practical choice for FMX.
- The responsible-gaming record should be separate from the no-P2W record:
  no-P2W covers competitive fairness, while FMX-193 covers player wellbeing,
  dark patterns, public statement, rating evidence and compliance artifacts.
- Any accepted record must remain linked to monetization ADRs, but should not
  ratify the draft monetization model by itself.
- Public-facing copy should be versioned and factual, not marketing-only.

## Limitations

The Perplexity result was useful for discovery, but several claims required
source checks before use. Source-checked evidence is preserved in
[[raw-responsible-gaming-source-checks-2026-06-15]].

