import { readFileSync } from 'node:fs'

const expectedPnpmVersion = '11.1.2'

function fail(message) {
  throw new Error(message)
}

function assertIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    fail(`${label} must include "${expected}"`)
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

const packageJson = readJson('package.json')
const environment = readJson('.cursor/environment.json')
const miseToml = readFileSync('.mise.toml', 'utf8')

if (packageJson.packageManager !== `pnpm@${expectedPnpmVersion}`) {
  fail(`packageManager must pin pnpm@${expectedPnpmVersion}`)
}

assertIncludes(miseToml, 'node = "22"', '.mise.toml')
assertIncludes(miseToml, `pnpm = "${expectedPnpmVersion}"`, '.mise.toml')

assertIncludes(environment.install, 'mise install', '.cursor install command')
assertIncludes(
  environment.install,
  `corepack prepare pnpm@${expectedPnpmVersion} --activate`,
  '.cursor install command',
)
assertIncludes(environment.install, 'pnpm install --frozen-lockfile', '.cursor install command')
assertIncludes(
  environment.install,
  'pnpm exec playwright install --with-deps chromium',
  '.cursor install command',
)

assertIncludes(environment.start, 'service docker start', '.cursor start command')
assertIncludes(
  environment.start,
  'docker compose -f docker-compose.dev.yml up -d --wait surrealdb',
  '.cursor start command',
)
assertIncludes(environment.start, 'pnpm db:migrate', '.cursor start command')

if (!environment.agentCanUpdateSnapshot) {
  fail('.cursor/environment.json must allow agent snapshot updates')
}

const portNumbers = new Set(environment.ports?.map((port) => port.port))

if (!portNumbers.has(3000)) {
  fail('.cursor/environment.json must expose web port 3000')
}

if (!portNumbers.has(8000)) {
  fail('.cursor/environment.json must expose SurrealDB port 8000')
}

console.log('Cursor Cloud environment configuration is valid')
