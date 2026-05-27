#!/usr/bin/env node
// configure-quartz.mjs — adapt a Quartz v5 `quartz.config.yaml` for our deploy.
//
// Quartz v5 replaced the TS `quartz.config.ts` with a YAML `quartz.config.yaml`
// (+ a community-plugin system). We start from the shipped
// `quartz.config.default.yaml` (= Quartz's DEFAULT skin/layout) and apply only
// three deployment tweaks — nothing that changes the default look:
//   1. baseUrl        → env DOCS_DOMAIN (sitemap/RSS canonical URLs)
//   2. ignorePatterns → drop "templates" so docs/90-Meta/templates is published
//   3. obsidian-flavored-markdown → parseTags=false. Works around a v5.0.0
//      OFM tag-parser crash ("Invalid code point -4") on a `#tag` token at the
//      end of a soft-wrapped line. We use frontmatter `tags:`, not inline
//      #tags, so disabling inline-tag parsing is safe and loses nothing.
//
// Robust YAML editing (lists + nested keys + indentation) via Quartz's bundled
// `yaml` lib — run from the Quartz checkout so the import resolves.
// Usage: node configure-quartz.mjs [path-to-quartz.config.yaml]
import { readFileSync, writeFileSync } from 'node:fs'
import YAML from 'yaml'

const file = process.argv[2] ?? 'quartz.config.yaml'
const doc = YAML.parse(readFileSync(file, 'utf8'))

doc.configuration ??= {}
const domain = process.env.DOCS_DOMAIN
if (domain) doc.configuration.baseUrl = domain
doc.configuration.ignorePatterns = ['private', '.obsidian']

let patchedOFM = false
for (const p of doc.plugins ?? []) {
  const src = typeof p.source === 'string' ? p.source : (p.source?.repo ?? '')
  if (src.includes('obsidian-flavored-markdown')) {
    p.options ??= {}
    p.options.parseTags = false
    patchedOFM = true
  }
}

writeFileSync(file, YAML.stringify(doc))
console.log(
  `configure-quartz: baseUrl=${doc.configuration.baseUrl ?? '(unset)'}, ` +
    `ignorePatterns=[${doc.configuration.ignorePatterns}], OFM.parseTags=false ${patchedOFM ? 'OK' : '(plugin not found!)'}`,
)
if (!patchedOFM) process.exit(1) // fail fast: the v5 tag-crash workaround must apply
