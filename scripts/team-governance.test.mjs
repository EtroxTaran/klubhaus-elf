import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const governance = readFileSync(join(root, '.project-governance.yaml'), 'utf8')

for (const contract of [
  'collaboration_profile: team',
  'hitl_policy: team-governance',
  'team_readiness: ready-awaiting-collaborator',
  'approval_policy: activate-one-approval-with-second-human',
  'required_human_approvals: 0',
  'graph_profile: full',
]) {
  if (!governance.includes(contract)) {
    throw new Error(`.project-governance.yaml: missing team contract: ${contract}`)
  }
}

const requiredFields = [
  'title:',
  'type:',
  'project: klubhaus-elf',
  'context:',
  'status: active',
  'owner: Nico',
  'updated:',
  'sensitivity: internal',
]
for (const relativePath of [
  'wiki/index.md',
  'wiki/architecture.md',
  'wiki/completion-gates.md',
  'wiki/decisions/index.md',
  'wiki/interfaces/index.md',
]) {
  const source = readFileSync(join(root, relativePath), 'utf8')
  if (!source.startsWith('---\n')) {
    throw new Error(`${relativePath}: YAML frontmatter is required`)
  }
  const closingDelimiter = source.indexOf('\n---\n', 4)
  if (closingDelimiter === -1) {
    throw new Error(`${relativePath}: closing YAML frontmatter delimiter is required`)
  }
  const frontmatter = source.slice(4, closingDelimiter)
  for (const field of requiredFields) {
    if (!frontmatter.includes(field)) {
      throw new Error(`${relativePath}: missing frontmatter field ${field}`)
    }
  }
}

console.log('team governance contract passed')
