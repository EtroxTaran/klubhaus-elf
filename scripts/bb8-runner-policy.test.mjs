import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const workflows = readdirSync(join(root, '.github', 'workflows'))
  .filter((workflow) => workflow.endsWith('.yml') || workflow.endsWith('.yaml'))

for (const workflow of workflows) {
  const source = readFileSync(join(root, '.github', 'workflows', workflow), 'utf8')
  if (!source.includes('runs-on: [self-hosted, Linux, X64]')) {
    throw new Error(`${workflow}: must use the repository-scoped bb8 runner`)
  }
  if (source.includes('pull_request_target:')) {
    throw new Error(`${workflow}: pull_request_target is forbidden`)
  }
  if (
    source.includes('pull_request:') &&
    !source.includes('types: [closed]') &&
    (!source.includes('github.event.pull_request.head.repo.full_name != github.repository') ||
      !source.includes('exit 1'))
  ) {
    throw new Error(`${workflow}: fork pull requests must fail explicitly before using bb8`)
  }
  if (
    source.includes('types: [closed]') &&
    !source.includes('github.event.pull_request.head.repo.full_name == github.repository')
  ) {
    throw new Error(`${workflow}: post-merge actions must ignore fork-owned branches`)
  }
  if (
    source.includes('pull_request:') &&
    source.includes('uses: actions/checkout@') &&
    !source.includes('github.event.pull_request.head.repo.full_name == github.repository')
  ) {
    throw new Error(`${workflow}: self-hosted checkout must reject fork pull requests`)
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
  'workflows are intentionally absent',
]) {
  if (!readme.includes(contract)) {
    throw new Error(`README.md: missing runtime contract: ${contract}`)
  }
}

if (existsSync(join(root, '.github', 'workflows', 'auto-merge-label.yml'))) {
  throw new Error('auto-merge-label.yml: local watcher repos must not duplicate the merge actuator')
}

console.log('bb8 runner workflow policy passed')
