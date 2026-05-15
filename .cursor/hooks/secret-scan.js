#!/usr/bin/env node
import { readFileSync } from 'node:fs'

const filePath = process.env.CURSOR_FILE_PATH

if (!filePath) {
  process.exit(0)
}

const content = readFileSync(filePath, 'utf8')

const patterns = [
  ['AWS credential', /\bAWS_(ACCESS_KEY_ID|SECRET_ACCESS_KEY|SESSION_TOKEN)\s*=/],
  ['private key', /-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----/],
  ['OpenAI-style key', /\bsk-[A-Za-z0-9_-]{20,}/],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9_]{20,}/],
  ['Slack token', /\bxox[baprs]-[A-Za-z0-9-]{20,}/],
  ['generic secret assignment', /\b(secret|token|password|api[_-]?key)\s*=\s*["'][^"']{16,}["']/i],
]

const hit = patterns.find(([, pattern]) => pattern.test(content))

if (hit) {
  console.error(`Secret scan blocked ${filePath}: matched ${hit[0]}`)
  process.exit(1)
}
