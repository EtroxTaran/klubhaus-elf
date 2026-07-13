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
if (!docsCheck.includes('node scripts/bb8-runner-policy.test.mjs')) {
  throw new Error('docs-check.yml: CI must enforce the bb8 runner policy')
}

const readme = readFileSync(join(root, 'README.md'), 'utf8')
for (const contract of [
  'bb8-klubhaus-elf',
  'same-repository pull requests only',
  'ai-review-watch@klubhaus-elf.service',
  'safe file-class exemption',
]) {
  if (!readme.includes(contract)) {
    throw new Error(`README.md: missing runtime contract: ${contract}`)
  }
}

const autoMergeLabel = readFileSync(
  join(root, '.github', 'workflows', 'auto-merge-label.yml'),
  'utf8',
)
if (!autoMergeLabel.includes('workflow_dispatch: {}')) {
  throw new Error('auto-merge-label.yml: compatibility workflow must be manual-only')
}
if (autoMergeLabel.includes('status: {}') || autoMergeLabel.includes('auto-merge.yml')) {
  throw new Error('auto-merge-label.yml: local watcher must be the only live merge actuator')
}

console.log('bb8 runner workflow policy passed')
