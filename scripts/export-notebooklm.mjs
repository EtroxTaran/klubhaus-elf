#!/usr/bin/env node
// Export the docs vault as one NotebookLM-ready bundle per gameplay domain
// (bounded context + a few cross-cutting topic areas).
//
// The vault is organised by *artefact type* (10-Architecture, 50-Game-Design,
// 60-Research, ...), not by domain. A domain like "Transfer" is scattered across
// ADRs + GDDRs + research + features + implementation, and there is no
// `domain:`/`context:` frontmatter field. We therefore derive membership from
// two signals, combined with OR:
//   (a) frontmatter `tags:` intersecting the domain's tag set, or
//   (b) a seed ADR-/GD- decision number appearing in the file basename.
// The seed numbers come from docs/10-Architecture/bounded-context-map.md, so the
// authoritative decision records land in their domain even when their tags do
// not literally name the domain. A file may belong to several domains — that is
// intended, so each NotebookLM space is self-contained.
//
// Output: export/notebooklm/<NN-slug>/ with NotebookLM-friendly markdown
// (YAML frontmatter rewritten to a readable header, [[wikilinks]] flattened to
// plain text), a per-bundle _index.md, and a top-level _MANIFEST.md coverage
// report listing files that matched no domain.
//
// Usage:
//   node scripts/export-notebooklm.mjs [--out <dir>] [--domain <slug>]
//                                      [--clean] [--include-raw]

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const docsRoot = path.join(root, 'docs')

// --- CLI -------------------------------------------------------------------

function parseArgs(argv) {
  const opts = { out: 'export/notebooklm', domain: null, clean: false, includeRaw: false }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--out') opts.out = argv[(i += 1)]
    else if (arg === '--domain') opts.domain = argv[(i += 1)]
    else if (arg === '--clean') opts.clean = true
    else if (arg === '--include-raw') opts.includeRaw = true
    else if (arg === '--help' || arg === '-h') opts.help = true
    else throw new Error(`unknown argument: ${arg}`)
  }
  return opts
}

// --- Domain manifest -------------------------------------------------------
// The ONLY place to maintain. `tags` are matched case-insensitively against a
// file's frontmatter tags; `seeds` are ADR-/GD- numbers matched against the
// file basename prefix. Order here drives the NN- folder prefix.

const DOMAINS = [
  {
    slug: 'identity-access',
    name: 'Identity & Access',
    tags: ['identity', 'auth', 'account', 'session', 'onboarding'],
    seeds: ['ADR-0019', 'ADR-0020', 'GD-0012'],
  },
  {
    slug: 'league-orchestration',
    name: 'League Orchestration',
    tags: ['league', 'competition', 'cup', 'fixture', 'scheduling', 'promotion', 'relegation', 'national-team'],
    seeds: ['ADR-0066', 'ADR-0068', 'ADR-0070', 'ADR-0084', 'GD-0009', 'GD-0033'],
  },
  {
    slug: 'club-management-economy',
    name: 'Club Management & Economy',
    tags: ['club-management', 'economy', 'finance', 'accounting', 'debt', 'financing', 'investor', 'ownership', 'budget'],
    seeds: ['ADR-0050', 'ADR-0058', 'ADR-0061', 'ADR-0063', 'ADR-0079', 'ADR-0086', 'GD-0008', 'GD-0022', 'GD-0023', 'GD-0030'],
  },
  {
    slug: 'squad-player',
    name: 'Squad & Player',
    tags: ['squad', 'player-skills', 'persona', 'hidden-attribute', 'discipline', 'lifecycle'],
    seeds: ['ADR-0018', 'GD-0003', 'GD-0020', 'GD-0021', 'GD-0027'],
  },
  {
    slug: 'training',
    name: 'Training',
    tags: ['training'],
    seeds: ['GD-0005'],
  },
  {
    slug: 'transfer',
    name: 'Transfer',
    tags: ['transfer', 'transfers', 'scouting', 'recruitment', 'loan', 'contract-lifecycle', 'escalation'],
    seeds: ['ADR-0064', 'ADR-0073', 'ADR-0075', 'ADR-0088', 'GD-0006', 'GD-0036'],
  },
  {
    slug: 'match',
    name: 'Match',
    tags: ['match', 'match-engine', 'matchday', 'replay', 'weather', 'pitch'],
    seeds: ['ADR-0003', 'ADR-0024', 'ADR-0026', 'ADR-0041', 'ADR-0049', 'ADR-0072', 'ADR-0087', 'GD-0002', 'GD-0025', 'GD-0029', 'GD-0035'],
  },
  {
    slug: 'watch-party',
    name: 'Watch Party',
    tags: ['watch-party', 'multiplayer', 'spectator'],
    seeds: ['ADR-0015', 'ADR-0087', 'ADR-0088', 'GD-0035'],
  },
  {
    slug: 'notification',
    name: 'Notification',
    tags: ['notification', 'messaging'],
    seeds: ['ADR-0043', 'GD-0013'],
  },
  {
    slug: 'manager-legacy',
    name: 'Manager & Legacy',
    tags: ['manager', 'legacy', 'prestige', 'dynasty', 'roguelite', 'hall-of-fame', 'awards', 'archetype'],
    seeds: ['ADR-0051', 'ADR-0082', 'ADR-0083', 'GD-0011', 'GD-0019', 'GD-0032'],
  },
  {
    slug: 'staff-operations',
    name: 'Staff Operations',
    tags: ['staff', 'backroom'],
    seeds: ['ADR-0053'],
  },
  {
    slug: 'tactics',
    name: 'Tactics',
    tags: ['tactics', 'set-pieces'],
    seeds: ['ADR-0055', 'ADR-0067', 'ADR-0074', 'ADR-0080', 'GD-0004', 'GD-0026'],
  },
  {
    slug: 'regulations-compliance',
    name: 'Regulations & Compliance',
    tags: ['regulations', 'compliance', 'ffp', 'work-permits'],
    seeds: ['ADR-0056', 'ADR-0069', 'ADR-0078'],
  },
  {
    slug: 'rivalry',
    name: 'Rivalry System',
    tags: ['rivalry', 'derby'],
    seeds: ['ADR-0057'],
  },
  {
    slug: 'stadium-operations',
    name: 'Stadium Operations',
    tags: ['stadium', 'venue'],
    seeds: ['ADR-0061', 'GD-0029'],
  },
  {
    slug: 'audience-atmosphere',
    name: 'Audience & Atmosphere',
    tags: ['fans', 'atmosphere', 'audience', 'fan-service', 'fan-ecology', 'ultras'],
    seeds: ['ADR-0062'],
  },
  {
    slug: 'commercial-portfolio',
    name: 'CommercialPortfolio',
    tags: ['commercial', 'sponsorship', 'merchandise', 'catering', 'ticketing', 'season-tickets', 'breach'],
    seeds: ['ADR-0058', 'ADR-0063', 'GD-0022'],
  },
  {
    slug: 'offline-sync',
    name: 'Offline Sync',
    tags: ['offline', 'sync', 'pwa', 'cache'],
    seeds: ['ADR-0020'],
  },
  {
    slug: 'audit-security',
    name: 'Audit & Security',
    tags: ['audit', 'security', 'privacy', 'anti-abuse', 'secrets', 'gdpr'],
    seeds: [],
  },
  // --- Cross-cutting topic areas (proposed / not-yet-ratified contexts) ----
  {
    slug: 'ai-world-simulation',
    name: 'AI & World Simulation',
    tags: ['world-drift', 'ai-world'],
    seeds: ['ADR-0071', 'GD-0010', 'GD-0024'],
  },
  {
    slug: 'narrative-dialogue',
    name: 'Narrative, Dialogue & Media',
    tags: ['narrative', 'dialogue', 'press', 'media'],
    seeds: ['ADR-0054', 'GD-0018', 'GD-0028', 'GD-0034'],
  },
  {
    slug: 'youth-academy',
    name: 'Youth Academy',
    tags: ['youth', 'academy'],
    seeds: ['ADR-0060', 'GD-0007'],
  },
  {
    slug: 'statistics-analytics',
    name: 'Statistics & Analytics',
    tags: ['statistics', 'analytics'],
    seeds: ['ADR-0081', 'GD-0031'],
  },
]

// Small, fixed set of cross-domain anchors copied into every bundle so each
// NotebookLM space is readable on its own.
const SHARED_CORE = [
  'docs/00-Index/Glossary.md',
  'docs/00-Index/Home.md',
  'docs/00-Index/Decision-Log.md',
  'docs/10-Architecture/bounded-context-map.md',
  'docs/50-Game-Design/README.md',
  'docs/90-Meta/collaboration-and-decision-protocol.md',
]

// --- Exclusions (mirrors docs-check.mjs, plus export-specific noise) --------

function ignoredParts(includeRaw) {
  const parts = [
    `${path.sep}.obsidian${path.sep}`,
    `${path.sep}90-Meta${path.sep}templates${path.sep}`,
    `${path.sep}90-Meta${path.sep}github-issue-suite${path.sep}issues${path.sep}`,
    `${path.sep}95-Archive${path.sep}`,
    `${path.sep}40-Execution${path.sep}`, // ephemeral session handoffs / beat notes
  ]
  if (!includeRaw) parts.push(`${path.sep}60-Research${path.sep}raw-perplexity${path.sep}`)
  return parts
}

// --- Helpers (same style as scripts/docs-check.mjs) ------------------------

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(absolute)
    return absolute.endsWith('.md') ? [absolute] : []
  })
}

function toPosix(filePath) {
  return path.relative(root, filePath).split(path.sep).join('/')
}

function basenameWithoutExt(filePath) {
  return path.basename(filePath, '.md')
}

function frontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) return null
  const fields = new Map()
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/)
    if (field) fields.set(field[1], field[2].trim())
  }
  return fields
}

function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
}

function parseTags(raw) {
  if (!raw) return []
  return raw
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((t) => t.trim().replace(/^["']|["']$/g, '').toLowerCase())
    .filter(Boolean)
}

// Pull the leading decision id (ADR-NNNN / GD-NNNN) from a basename, if any.
function decisionId(base) {
  const match = base.match(/^(ADR-\d{4}|GD-\d{4})/)
  return match ? match[1] : null
}

function normalizeTarget(target) {
  return target.split('|')[0].split('#')[0].trim()
}

// [[target]] / [[target|alias]] / [[target#heading]] -> readable plain text.
function flattenWikiLinks(content, titleByBasename) {
  return content.replace(/\[\[([^\]]+)\]\]/g, (_, inner) => {
    const alias = inner.includes('|') ? inner.split('|').slice(1).join('|').trim() : null
    if (alias) return alias
    const target = normalizeTarget(inner)
    const base = basenameWithoutExt(target.replace(/\/+$/, ''))
    return titleByBasename.get(base) || base
  })
}

// --- Build per-file metadata ----------------------------------------------

function loadFiles(includeRaw) {
  const ignore = ignoredParts(includeRaw)
  const abs = walk(docsRoot).filter((f) => !ignore.some((p) => f.includes(p)))
  return abs.map((file) => {
    const content = readFileSync(file, 'utf8')
    const fields = frontmatter(content)
    const base = basenameWithoutExt(file)
    return {
      abs: file,
      posix: toPosix(file),
      base,
      title: fields?.get('title')?.replace(/^["']|["']$/g, '') || base,
      tags: parseTags(fields?.get('tags')),
      type: fields?.get('type') || '',
      status: fields?.get('status') || '',
      updated: fields?.get('updated') || '',
      content,
      decision: decisionId(base),
    }
  })
}

function matchesDomain(file, domain) {
  const tagSet = new Set(domain.tags.map((t) => t.toLowerCase()))
  if (file.tags.some((t) => tagSet.has(t))) return true
  if (file.decision && domain.seeds.includes(file.decision)) return true
  return false
}

function buildHeader(file, domainName, bodyLeadsWithH1) {
  const meta = []
  if (file.type) meta.push(`**Typ:** ${file.type}`)
  if (file.status) meta.push(`**Status:** ${file.status}`)
  if (file.updated) meta.push(`**Aktualisiert:** ${file.updated}`)
  // Skip our own H1 when the body already opens with one, to avoid a duplicate title.
  const lines = bodyLeadsWithH1 ? [] : [`# ${file.title}`, '']
  lines.push(`> **Domäne:** ${domainName}${meta.length ? ` · ${meta.join(' · ')}` : ''}`)
  if (file.tags.length) lines.push(`> **Tags:** ${file.tags.join(', ')}`)
  lines.push(`> **Quelle:** \`${file.posix}\``)
  lines.push('')
  return lines.join('\n')
}

function render(file, domainName, titleByBasename) {
  const body = flattenWikiLinks(stripFrontmatter(file.content), titleByBasename).replace(/^\s+/, '')
  const bodyLeadsWithH1 = /^#\s/.test(body)
  return `${buildHeader(file, domainName, bodyLeadsWithH1)}\n${body}`.replace(/\s*$/, '') + '\n'
}

// Reserve a collision-free filename within a bundle directory.
function uniqueName(used, base, file) {
  let name = `${base}.md`
  if (used.has(name)) {
    const parent = path.basename(path.dirname(file.abs))
    name = `${base}__${parent}.md`
  }
  used.add(name)
  return name
}

// --- Main ------------------------------------------------------------------

function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (opts.help) {
    console.log('Usage: node scripts/export-notebooklm.mjs [--out <dir>] [--domain <slug>] [--clean] [--include-raw]')
    return
  }
  if (!existsSync(docsRoot)) {
    console.error('export-notebooklm: docs/ does not exist')
    process.exit(1)
  }

  const selectedDomains = opts.domain
    ? DOMAINS.filter((d) => d.slug === opts.domain)
    : DOMAINS
  if (opts.domain && selectedDomains.length === 0) {
    console.error(`export-notebooklm: unknown domain "${opts.domain}". Known: ${DOMAINS.map((d) => d.slug).join(', ')}`)
    process.exit(1)
  }

  const files = loadFiles(opts.includeRaw)
  const titleByBasename = new Map(files.map((f) => [f.base, f.title]))

  const outRoot = path.isAbsolute(opts.out) ? opts.out : path.join(root, opts.out)
  if (opts.clean && existsSync(outRoot)) rmSync(outRoot, { recursive: true, force: true })
  mkdirSync(outRoot, { recursive: true })

  const sharedFiles = SHARED_CORE.map((rel) => path.join(root, rel)).filter(existsSync)
  const assignedCount = new Map() // posix -> number of domains it landed in
  const summary = []

  selectedDomains.forEach((domain, idx) => {
    const padded = String(idx + 1).padStart(2, '0')
    const dirName = `${padded}-${domain.slug}`
    const dir = path.join(outRoot, dirName)
    mkdirSync(dir, { recursive: true })

    const matched = files.filter((f) => matchesDomain(f, domain))
    const used = new Set()
    const indexRows = []

    for (const file of matched) {
      const name = uniqueName(used, file.base, file)
      writeFileSync(path.join(dir, name), render(file, domain.name, titleByBasename))
      indexRows.push(`- **${file.title}** — \`${name}\` (Quelle: \`${file.posix}\`)`)
      assignedCount.set(file.posix, (assignedCount.get(file.posix) || 0) + 1)
    }

    // Shared-core anchors, clearly prefixed so they sort together and read as context.
    for (const abs of sharedFiles) {
      const sharedFile = files.find((f) => f.abs === abs) || (() => {
        const content = readFileSync(abs, 'utf8')
        const fields = frontmatter(content)
        const base = basenameWithoutExt(abs)
        return {
          abs,
          posix: toPosix(abs),
          base,
          title: fields?.get('title')?.replace(/^["']|["']$/g, '') || base,
          tags: parseTags(fields?.get('tags')),
          type: fields?.get('type') || '',
          status: fields?.get('status') || '',
          updated: fields?.get('updated') || '',
          content,
          decision: null,
        }
      })()
      const name = `_shared-${sharedFile.base}.md`
      writeFileSync(path.join(dir, name), render(sharedFile, domain.name, titleByBasename))
    }

    const indexLines = [
      `# ${domain.name} — NotebookLM-Bundle`,
      '',
      `Domänen-Slug: \`${domain.slug}\` · ${matched.length} domänenspezifische Datei(en) + ${sharedFiles.length} geteilte Kontext-Datei(en).`,
      '',
      'Tag-Treffer + Seed-Entscheidungen, die dieses Bundle definieren:',
      `- Tags: ${domain.tags.join(', ') || '—'}`,
      `- Seeds: ${domain.seeds.join(', ') || '—'}`,
      '',
      '## Enthaltene Dateien',
      '',
      ...indexRows.sort(),
      '',
      '## Geteilter Kontext (_shared-*)',
      '',
      ...sharedFiles.map((abs) => `- \`_shared-${basenameWithoutExt(abs)}.md\` (Quelle: \`${toPosix(abs)}\`)`),
      '',
    ]
    writeFileSync(path.join(dir, '_index.md'), indexLines.join('\n'))
    summary.push({ dirName, name: domain.name, count: matched.length })
  })

  // Coverage report: which (non-shared) files matched no selected domain.
  const sharedPosix = new Set(sharedFiles.map((abs) => toPosix(abs)))
  const unassigned = files
    .filter((f) => !assignedCount.has(f.posix) && !sharedPosix.has(f.posix))
    .map((f) => f.posix)
    .sort()

  const manifestLines = [
    '# NotebookLM-Export — Manifest & Coverage',
    '',
    `Generiert aus \`docs/\` (${files.length} berücksichtigte Notizen${opts.includeRaw ? ', inkl. raw-perplexity' : ''}).`,
    `Ausgabe: \`${path.relative(root, outRoot) || outRoot}\``,
    opts.domain ? `Gefiltert auf Domäne: \`${opts.domain}\`` : `Domänen: ${selectedDomains.length}`,
    '',
    '## Bundles',
    '',
    '| Ordner | Domäne | Domänenspezifische Dateien |',
    '|---|---|---|',
    ...summary.map((s) => `| \`${s.dirName}/\` | ${s.name} | ${s.count} |`),
    '',
    '## Geteilter Kontext (in jedem Bundle)',
    '',
    ...sharedFiles.map((abs) => `- \`${toPosix(abs)}\``),
    '',
    `## Nicht zugeordnet (${unassigned.length})`,
    '',
    unassigned.length
      ? 'Diese Notizen haben keiner Domäne via Tags/Seeds entsprochen — Manifest bei Bedarf nachschärfen:'
      : 'Alle Notizen wurden mindestens einer Domäne zugeordnet.',
    '',
    ...unassigned.map((p) => `- \`${p}\``),
    '',
  ]
  writeFileSync(path.join(outRoot, '_MANIFEST.md'), manifestLines.join('\n'))

  // Console summary.
  console.log(`export-notebooklm: ${files.length} notes -> ${path.relative(root, outRoot) || outRoot}`)
  for (const s of summary) console.log(`  ${s.dirName.padEnd(28)} ${String(s.count).padStart(3)} files  (${s.name})`)
  console.log(`  shared-core per bundle: ${sharedFiles.length} files`)
  console.log(`  unassigned: ${unassigned.length} (see _MANIFEST.md)`)
}

main()
