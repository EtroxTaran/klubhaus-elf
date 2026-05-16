---
title: Cursor Cloud Agent Workflow
status: draft
tags: [meta, implementation]
updated: 2026-05-15
---

# Cursor Cloud Agent Workflow

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
