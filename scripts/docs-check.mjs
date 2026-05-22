#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const docsRoot = path.join(root, 'docs')
const errors = []

const ignoredPathParts = [
  `${path.sep}.obsidian${path.sep}`,
  `${path.sep}90-Meta${path.sep}templates${path.sep}`,
  `${path.sep}90-Meta${path.sep}github-issue-suite${path.sep}issues${path.sep}`,
  // 95-Archive is frozen Historical Memory: its internal planning links point at
  // artefacts the superseded waves never created. Not maintained, not gating.
  `${path.sep}95-Archive${path.sep}`,
]

const secretPatterns = [
  ['private key', /-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----/],
  ['OpenAI-style key', /\bsk-[A-Za-z0-9_-]{20,}/],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9_]{20,}/],
  ['AWS credential', /\bAWS_(ACCESS_KEY_ID|SECRET_ACCESS_KEY|SESSION_TOKEN)\s*=/],
]

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      return walk(absolute)
    }
    return absolute.endsWith('.md') ? [absolute] : []
  })
}

function toPosix(filePath) {
  return path.relative(root, filePath).split(path.sep).join('/')
}

function isIgnored(filePath) {
  return ignoredPathParts.some((part) => filePath.includes(part))
}

function frontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) {
    return null
  }

  const fields = new Map()
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/)
    if (field) {
      fields.set(field[1], field[2].trim())
    }
  }
  return fields
}

function basenameWithoutExt(filePath) {
  return path.basename(filePath, '.md')
}

function normalizeTarget(target) {
  return target.split('|')[0].split('#')[0].trim()
}

function resolveWikiLink(fromFile, target, filesByBasename) {
  const cleanTarget = normalizeTarget(target)
  if (!cleanTarget) {
    return true
  }

  const withExtension = cleanTarget.endsWith('.md') ? cleanTarget : `${cleanTarget}.md`

  if (cleanTarget.startsWith('.') || cleanTarget.includes('/')) {
    const candidate = path.normalize(path.join(path.dirname(fromFile), withExtension))
    return existsSync(candidate)
  }

  return filesByBasename.has(cleanTarget) || filesByBasename.has(basenameWithoutExt(withExtension))
}

function checkFrontmatter(filePath, fields) {
  if (!fields) {
    errors.push(`${toPosix(filePath)}: missing YAML frontmatter`)
    return
  }

  for (const required of ['title', 'status', 'tags', 'updated']) {
    if (!fields.has(required) || fields.get(required) === '') {
      errors.push(`${toPosix(filePath)}: missing frontmatter field "${required}"`)
    }
  }

  const updated = fields.get('updated')
  if (updated && !/^\d{4}-\d{2}-\d{2}$/.test(updated)) {
    errors.push(`${toPosix(filePath)}: updated must use YYYY-MM-DD`)
  }
}

function checkSupersession(filePath, fields, filesByBasename) {
  if (!fields) {
    return
  }

  for (const field of ['supersedes', 'superseded_by']) {
    const value = fields.get(field)
    if (!value) {
      continue
    }
    const target = value.replace(/^["']|["']$/g, '')
    if (target && !resolveWikiLink(filePath, target, filesByBasename)) {
      errors.push(`${toPosix(filePath)}: ${field} points to missing note "${target}"`)
    }
  }
}

function checkWikiLinks(filePath, content, filesByBasename) {
  const links = content.matchAll(/\[\[([^\]]+)\]\]/g)
  for (const link of links) {
    const target = link[1]
    if (!resolveWikiLink(filePath, target, filesByBasename)) {
      errors.push(`${toPosix(filePath)}: broken wikilink [[${target}]]`)
    }
  }
}

function checkSecrets(filePath, content) {
  for (const [name, pattern] of secretPatterns) {
    if (pattern.test(content)) {
      errors.push(`${toPosix(filePath)}: possible secret matched ${name}`)
    }
  }
}

function checkDecisionLog(files) {
  const decisionLog = path.join(docsRoot, '00-Index', 'Decision-Log.md')
  const content = readFileSync(decisionLog, 'utf8')
  const adrFiles = files.filter((file) =>
    toPosix(file).startsWith('docs/10-Architecture/09-Decisions/ADR-'),
  )

  for (const adr of adrFiles) {
    const base = basenameWithoutExt(adr)
    if (!content.includes(base)) {
      errors.push(`docs/00-Index/Decision-Log.md: missing ${base}`)
    }
  }
}

function checkCurrentReachability(files) {
  const currentState = readFileSync(path.join(docsRoot, '00-Index', 'Current-State.md'), 'utf8')
  const home = readFileSync(path.join(docsRoot, '00-Index', 'Home.md'), 'utf8')

  for (const required of [
    'Agent-Onboarding',
    'Current-State',
    'Decision-Log',
    'Architecture-Map',
    'Game-Design-Map',
    'Feature-Map',
    'Research-Map',
    'Implementation-Map',
    'User-Docs-Map',
  ]) {
    if (!home.includes(required) && !currentState.includes(required)) {
      errors.push(`docs/00-Index: ${required} is not reachable from Home or Current-State`)
    }
  }

  for (const file of files) {
    const fields = frontmatter(readFileSync(file, 'utf8'))
    if (fields?.get('status') === 'superseded') {
      const base = basenameWithoutExt(file)
      if (currentState.includes(base)) {
        errors.push(`docs/00-Index/Current-State.md: superseded note ${base} is listed as current`)
      }
    }
  }
}

if (!existsSync(docsRoot)) {
  console.error('docs-check: docs/ does not exist')
  process.exit(1)
}

// Ignored files (templates, issue mirrors, frozen archive) are not validated as
// sources, but they remain valid link *targets* so active notes may reference them.
const allFiles = walk(docsRoot)
const files = allFiles.filter((file) => !isIgnored(file))
const filesByBasename = new Set(allFiles.map(basenameWithoutExt))

for (const file of files) {
  const content = readFileSync(file, 'utf8')
  const fields = frontmatter(content)
  checkFrontmatter(file, fields)
  checkSupersession(file, fields, filesByBasename)
  checkWikiLinks(file, content, filesByBasename)
  checkSecrets(file, content)
}

checkDecisionLog(files)
checkCurrentReachability(files)

if (errors.length > 0) {
  console.error(`docs-check failed with ${errors.length} issue(s):`)
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(`docs-check passed (${files.length} notes checked)`)
