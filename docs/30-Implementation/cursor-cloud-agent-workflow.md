---
title: Cursor Cloud Agent Workflow
status: current
tags: [meta, implementation]
created: 2026-05-15
updated: 2026-05-17
type: index
binding: true
related: [[agent-workflow-pattern]], [[linear-task-tracking]], [[../00-Index/Agent-Onboarding]], [[../00-Index/Current-State]], [[../90-Meta/agent-memory-protocol]]
---

# Cursor Cloud Agent Workflow

Start every session via the vault entry chain: [[../00-Index/Agent-Onboarding]]
→ [[../00-Index/Current-State]] → [[../90-Meta/agent-memory-protocol]]. Use the
`vault-memory` skill (`.cursor/skills/vault-memory/SKILL.md`) for the
start/update/wrap-up checklist.

Operational task tracking happens in Linear. See [[linear-task-tracking]] for the
project link, issue wave plan, and required progress-comment conventions. Use
`.cursor/skills/linear-issue-creation/SKILL.md` for repeatable issue quality and
closure checks.

1. Create or update a plan in `.cursor/plans/`.
2. Check file exclusivity, interface stability, and config exclusivity.
3. Use serial work for schema/config contracts; fan out only independent beats.
4. Link the plan and PR in the Linear issue.
5. Commit, push, and create a draft PR before testing; update the PR after fixes.
6. Keep Vault docs and code changes in the same PR.
7. Comment final outcome and Vault/PR links on the Linear issue before marking done.

## Related

- [[agent-workflow-pattern]] — the full workflow this operationalizes
- [[linear-task-tracking]] — operational tracker · [[../00-Index/Agent-Onboarding]] — session start
- [[../90-Meta/agent-memory-protocol]] — memory steps
