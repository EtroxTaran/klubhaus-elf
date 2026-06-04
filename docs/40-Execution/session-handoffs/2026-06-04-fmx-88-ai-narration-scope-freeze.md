---
title: Handoff FMX-88 AI narration scope freeze
status: wrapped
tags: [meta, execution, handoff, ai, llm, narrative, compliance, fallback, fmx-88]
created: 2026-06-04
updated: 2026-06-04
type: handoff
binding: false
related:
  - [[../../60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]]
  - [[../../60-Research/raw-perplexity/raw-ai-narration-scope-freeze-fallback-coverage-2026-06-04]]
  - [[../../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../../30-Implementation/ai-narration-contract-testing-framework]]
---

# Handoff: FMX-88 AI narration scope freeze (2026-06-04)

## Linear

- Issue: FMX-88
- Status: In Progress -> ready for In Review after PR creation.

## Done this session

- Synced `/root/research-gp` through `main`, created branch
  `codex/fmx-88-ai-narration-scope-freeze`, and claimed Linear FMX-88 by moving
  it to `In Progress`.
- Ran Perplexity research on EU AI Act Article 50 transparency obligations,
  optional-LLM fallback/resilience patterns and football-manager/narrative-game
  precedents.
- Cross-checked promoted claims against official/current source pages for
  Article 50, EC draft guidance, OWASP, NIST, Football Manager and Failbetter.
- Recorded raw research:
  [[../../60-Research/raw-perplexity/raw-ai-narration-scope-freeze-fallback-coverage-2026-06-04]].
- Added synthesis:
  [[../../60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]].
- Updated draft ADR/GDDR/feature/testing notes to record Nico's FMX-88 choices:
  Broad Full Dialogue scope, CI fallback manifest, Nico + external
  legal/compliance release gate and MVP no-export/share.
- Updated maps, summaries, Decision-Log and Current-State so the vault path is
  discoverable.

## Open / next step

- Run `node scripts/docs-check.mjs` and `git diff --check`.
- Commit, push and open a PR titled
  `[FMX-88] Freeze AI narration scope and fallback coverage` with body first
  line `Closes FMX-88`.
- Move Linear FMX-88 to `In Review` after the PR exists.

## Blockers

- No docs blocker. Runtime LLM remains blocked for product release until Nico
  plus external legal/compliance review accepts the Article 50 disclosure,
  provenance and export/share artifact.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-ai-narration-scope-freeze-fallback-coverage-2026-06-04.md`
- `docs/60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04.md`
- `docs/10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state.md`
- `docs/10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework.md`
- `docs/50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue.md`
- `docs/20-Features/feature-ai-narration-mvp-pillar.md`
- `docs/30-Implementation/ai-narration-contract-testing-framework.md`
- `docs/00-Index/Decision-Log.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Architecture-Map.md`
- `docs/00-Index/Research-Map.md`
- `docs/00-Index/Game-Design-Map.md`
- `docs/00-Index/Feature-Map.md`
- `docs/00-Index/Implementation-Map.md`
- `docs/20-Features/README.md`
- `docs/30-Implementation/README.md`
- `docs/50-Game-Design/README.md`
- `docs/60-Research/00-summary.md`
- `docs/60-Research/raw-perplexity/README.md`

## Needs promotion

- ADR-0030 and ADR-0054 remain `draft` until Nico ratifies.
- GD-0018 and the AI narration feature remain `draft`.
- Provider/model routing, exact disclosure copy, cost caps, cache policy and any
  future generated-text export/share policy remain follow-up decisions.
