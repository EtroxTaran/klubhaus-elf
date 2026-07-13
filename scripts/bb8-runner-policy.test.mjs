import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const workflows = [
  'docs-check.yml',
  'linear-link-check.yml',
  'notebooklm-export.yml',
  'post-merge-cleanup.yml',
  'redeploy-docs.yml',
]

for (const workflow of workflows) {
  const source = readFileSync(join(root, '.github', 'workflows', workflow), 'utf8')
  if (!source.includes('runs-on: [self-hosted, Linux, X64]')) {
    throw new Error(`${workflow}: must use the repository-scoped bb8 runner`)
  }
  if (source.includes('pull_request_target:')) {
    throw new Error(`${workflow}: pull_request_target is forbidden`)
  }
}

const docsCheck = readFileSync(
  join(root, '.github', 'workflows', 'docs-check.yml'),
  'utf8',
)
if (!docsCheck.includes('github.event.pull_request.head.repo.full_name == github.repository')) {
  throw new Error('docs-check.yml: self-hosted checkout must reject fork PRs')
}

console.log('bb8 runner workflow policy passed')
