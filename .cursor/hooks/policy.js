#!/usr/bin/env node
import { readFileSync } from 'node:fs'

const input = JSON.parse(readFileSync(0, 'utf8'))
const cmd = String(input.command || '').trim()

const deny =
  /\b(rm\s+-rf|git\s+push\s+--force|git\s+reset\s+--hard|terraform\s+apply|tofu\s+apply|kubectl\s+delete|aws\s+s3\s+rm|railway\s+.*delete|gh\s+repo\s+delete|sudo|base64\s+-d|curl\s+.*\|\s*(bash|sh)|wget\s+.*\|\s*sh|drop\s+(table|database))\b/i

const ask =
  /\b(pnpm\s+install|pnpm\s+add|pnpm\s+dlx|npx|git\s+push|db:migrate|surreal\s+import|docker\s+compose\s+down\s+-v)\b/i

if (deny.test(cmd)) {
  console.log(
    JSON.stringify({
      decision: 'deny',
      user_message: `Blocked by policy: ${cmd.slice(0, 80)}`,
      agent_message: 'Refused: destructive command requires explicit user invocation.',
    }),
  )
} else if (ask.test(cmd)) {
  console.log(JSON.stringify({ decision: 'ask' }))
} else {
  console.log(JSON.stringify({ decision: 'allow' }))
}
