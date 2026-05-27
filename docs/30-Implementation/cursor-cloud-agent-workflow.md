---
title: Cursor Cloud Agent Workflow
status: current
tags: [meta, implementation]
created: 2026-05-15
updated: 2026-05-17
type: index
binding: true
related: [[agent-workflow-pattern]], [[../00-Index/Agent-Onboarding]], [[../00-Index/Current-State]], [[../90-Meta/agent-memory-protocol]]
---

# Cursor Cloud Agent Workflow

Start every session via the vault entry chain: [[../00-Index/Agent-Onboarding]]
→ [[../00-Index/Current-State]] → [[../90-Meta/agent-memory-protocol]]. Use the
`vault-memory` skill (`.cursor/skills/vault-memory/SKILL.md`) for the
start/update/wrap-up checklist.

Operational task tracking is Linear, team FMX
(<https://linear.app/coding-x/team/FMX/active>). No issues exist yet and there is
no task-tracking process doc; agree lightweight conventions before creating
issues.

1. Create or update a plan in `.cursor/plans/`.
2. Check file exclusivity, interface stability, and config exclusivity.
3. Use serial work for schema/config contracts; fan out only independent beats.
4. Link the plan and PR in the Linear issue.
5. Commit, push, and create a draft PR before testing; update the PR after fixes.
6. Keep Vault docs and code changes in the same PR.
7. Comment final outcome and Vault/PR links on the Linear issue before marking done.

## Related

- [[agent-workflow-pattern]] — the full workflow this operationalizes
- [[../00-Index/Agent-Onboarding]] — session start
- [[../90-Meta/agent-memory-protocol]] — memory steps
