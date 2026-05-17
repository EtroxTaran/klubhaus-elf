---
title: Decision Log
status: current
tags: [adr]
created: 2026-05-15
updated: 2026-05-17
type: index
binding: true
---

# Decision Log

ADR index with status **and lineage**. This table is the single place that
answers "what was the old way and what is the newest way" — it must do so
without opening any ADR. Implement only from `accepted` ADRs. `draft` ADRs are
blocked on Research Wave 2 ([[../60-Research/research-wave-2-gaps]]) — do not
implement from them.

When an ADR is superseded: keep its row, set status `superseded`, and fill the
Supersedes / Superseded-by columns so the chain (old → new) stays readable here.

| ADR | Status | Updated | Supersedes | Superseded by |
|---|---|---|---|---|
| [[../10-Architecture/09-Decisions/ADR-0001-tech-stack]] | accepted | 2026-05-17 | — | — |
| [[../10-Architecture/09-Decisions/ADR-0002-offline-first]] | accepted | 2026-05-17 | — | — |
| [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] | draft (Wave 2) | 2026-05-17 | — | — |
| [[../10-Architecture/09-Decisions/ADR-0004-data-model]] | draft (Wave 2) | 2026-05-17 | — | — |
| [[../10-Architecture/09-Decisions/ADR-0005-save-format]] | accepted | 2026-05-17 | — | — |
| [[../10-Architecture/09-Decisions/ADR-0006-i18n]] | draft (Wave 2) | 2026-05-17 | — | — |
| [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] | accepted | 2026-05-17 | — | — |
| [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]] | draft (Wave 2) | 2026-05-17 | — | — |
| [[../10-Architecture/09-Decisions/ADR-0009-cursor-orchestration]] | accepted | 2026-05-17 | — | — |

> Example of a superseded row once it happens:
> `| [[ADR-0001-tech-stack]] | superseded | 2026-09-01 | — | [[ADR-0012-...]] |`
