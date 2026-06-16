---
title: "Raw - staff skill MVP scope DDD and contracts (FMX-152)"
status: raw
tags: [research, raw, perplexity, staff, skills, ddd, cqrs, contracts, deterministic-replay, fmx-152]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-152
related:
  - [[../staff-skill-mvp-scope-2026-06-15]]
  - [[raw-staff-skill-mvp-scope-source-checks-2026-06-15]]
  - [[../../40-Execution/fmx-152-staff-skill-mvp-scope-decision-queue-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
---

# Raw - staff skill MVP scope DDD and contracts (FMX-152)

## Research prompt

Perplexity was asked on 2026-06-15:

> From a domain-driven design/contracts-first product architecture perspective,
> should staff skills in an MVP be target-only, narrow pipeline modifiers, or
> full visible staff skill cards? Existing model: People owns
> StaffSkillProfileSnapshot; Staff Operations owns staff lifecycle, role
> assignment, pipeline coverage; Training/Scouting/Medical/Match-Day consume
> pipeline quality. Analyze bounded contexts, CQRS/read models, deterministic
> replay, balance risk, and future extensibility. Provide 6-10 findings, source
> URLs, and a recommendation with caveats.

## Source-quality note

Perplexity's DDD direction aligned with FMX's existing ADR-0052/ADR-0053 seam,
but several returned citations were weak or secondary. FMX-152 therefore used
Microsoft Learn's DDD/domain-analysis and CQRS guidance plus Martin Fowler's
bounded-context reference as the stronger source-check basis.

## Extracted findings

- Bounded-context ownership supports keeping the shared contract narrow:
  People owns the capability/profile snapshot; Staff Operations owns staff role
  assignment and pipeline coverage; consuming domains apply their own rules.
- A rich staff-card model should not become a cross-context contract. It would
  force Training, Scouting, Medical and Match-Day to share one vocabulary for
  concepts that each context interprets differently.
- CQRS supports separating the write model from read/presentation models:
  domain commands/events/snapshots stay stable while UI read models can compose
  richer staff cards or explanation bands later.
- Deterministic replay is safer when simulation logic consumes stable pipeline
  modifiers or typed capability snapshots rather than mutable UI card layouts.
- Balance risk is lower when each staff skill feeds a bounded number of
  pipeline effects and each consumer context owns the final formula.
- Future extensibility is better if new contexts can translate People/Staff
  Operations outputs through an anti-corruption style mapping instead of being
  forced to depend on a full staff-card schema.
- Product UX still needs visible explanation. "Pipeline-only" should not mean
  invisible; it should mean the domain contract is narrow while the UI can show
  bands, summaries and reasons.

## Perplexity recommendation surfaced

Perplexity recommended:

- Use a narrow domain/write model and pipeline-level outputs.
- Treat full visible staff cards as read-model/UI projections, not canonical
  cross-context write contracts.
- Keep `StaffSkillProfileSnapshot` abstract enough for each domain to translate.
- Use Staff Operations as the place where role assignment and pipeline quality
  meet.

FMX-152 synthesis adopts this as the DDD basis for recommending Option B,
pending Nico's decision.

## Perplexity citations surfaced

Strong source checks replaced or supplemented these:

- Martin Fowler bounded-context reference:
  <https://martinfowler.com/bliki/BoundedContext.html>
- Microsoft Learn archived DDD article:
  <https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/best-practice-an-introduction-to-domain-driven-design>
- Weak/secondary sources returned and not promoted as source-backed:
  <https://claudemarketplaces.com/skills/wondelai/skills/domain-driven-design>,
  <https://www.youtube.com/watch?v=ez9GWESKG4I>,
  <https://www.youtube.com/watch?v=am-HXycfalo>,
  <https://www.linkedin.com/posts/vaughnvernon_dddesign-ddd-domaindrivendesign-activity-7307679672224358400-dXj5>,
  <https://www.sciencedirect.com/science/article/pii/S0164121225002055>,
  <https://lobehub.com/skills/booklib-ai-skills-domain-driven-design>

## Related

- [[../staff-skill-mvp-scope-2026-06-15]]
- [[raw-staff-skill-mvp-scope-source-checks-2026-06-15]]
- [[../../40-Execution/fmx-152-staff-skill-mvp-scope-decision-queue-2026-06-15]]
