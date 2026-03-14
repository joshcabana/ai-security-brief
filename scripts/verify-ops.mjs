#!/usr/bin/env node
/**
 * verify-ops.mjs
 * Pre-launch operator check: validates required env vars and runtime readiness.
 * Run: pnpm verify:ops
 * Exit 0 = ready. Exit 1 = missing config.
 */

import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const ROOT = process.cwd()
const BOLD  = '\x1b[1m'
const RED   = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const CYAN  = '\x1b[36m'
const RESET = '\x1b[0m'

// ── 1. Load .env.local if present (mirrors Next.js runtime lookup) ────────────
const envLocalPath = resolve(ROOT, '.env.local')
if (existsSync(envLocalPath)) {
  const lines = readFileSync(envLocalPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

// ── 2. Required env vars (sourced from .env.example — authoritative contract) ─
const REQUIRED = [
  {
    key: 'BEEHIIV_API_KEY',
    hint: 'Beehiiv dashboard → Settings → API → Generate key',
  },
  {
    key: 'BEEHIIV_PUBLICATION_ID',
    hint: 'Beehiiv dashboard → Settings → Publication ID (starts with pub_)',
  },
  {
    key: 'NEXT_PUBLIC_SITE_URL',
    hint: 'Your Vercel deployment URL, e.g. https://ai-security-brief.vercel.app',
  },
  {
    key: 'NEXT_PUBLIC_SITE_NAME',
    hint: 'Display name, e.g. "The AI Security Brief"',
  },
]

// ── 3. Known stale vars that must NOT be present (prevents misconfiguration) ──
const BANNED = [
  {
    key: 'NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID',
    reason: 'Outdated — use server-side BEEHIIV_PUBLICATION_ID instead',
  },
  {
    key: 'SUPABASE_URL',
    reason: 'Supabase removed from runtime — do not add this',
  },
  {
    key: 'SUPABASE_ANON_KEY',
    reason: 'Supabase removed from runtime — do not add this',
  },
]

// ── 4. Run checks ─────────────────────────────────────────────────────────────
console.log(`\n${BOLD}${CYAN}╔══════════════════════════════════════╗${RESET}`)
console.log(`${BOLD}${CYAN}║     ai-security-brief verify:ops     ║${RESET}`)
console.log(`${BOLD}${CYAN}╚══════════════════════════════════════╝${RESET}\n`)

let errors = 0
let warnings = 0

console.log(`${BOLD}── Required env vars ──────────────────────────────${RESET}`)
for (const { key, hint } of REQUIRED) {
  const val = process.env[key]
  if (!val || val.trim() === '') {
    console.log(`  ${RED}✗ MISSING${RESET}  ${BOLD}${key}${RESET}`)
    console.log(`           ${YELLOW}→ ${hint}${RESET}`)
    errors++
  } else {
    const preview = val.length > 8
      ? val.slice(0, 4) + '…' + val.slice(-4)
      : '****'
    console.log(`  ${GREEN}✓ SET${RESET}     ${BOLD}${key}${RESET} ${YELLOW}(${preview})${RESET}`)
  }
}

console.log(`\n${BOLD}── Stale / banned vars (must be absent) ───────────${RESET}`)
for (const { key, reason } of BANNED) {
  if (process.env[key]) {
    console.log(`  ${RED}✗ FOUND${RESET}   ${BOLD}${key}${RESET}`)
    console.log(`           ${YELLOW}→ ${reason}${RESET}`)
    warnings++
  } else {
    console.log(`  ${GREEN}✓ ABSENT${RESET}  ${BOLD}${key}${RESET}`)
  }
}

// ── 5. .env.example drift check ───────────────────────────────────────────────
console.log(`\n${BOLD}── .env.example contract check ─────────────────────${RESET}`)
const envExamplePath = resolve(ROOT, '.env.example')
if (existsSync(envExamplePath)) {
  const exampleKeys = readFileSync(envExamplePath, 'utf8')
    .split('\n')
    .filter(l => l.trim() && !l.startsWith('#'))
    .map(l => l.split('=')[0].trim())

  const requiredKeys = REQUIRED.map(r => r.key)
  const undocumented = requiredKeys.filter(k => !exampleKeys.includes(k))
  const extra = exampleKeys.filter(k => !requiredKeys.map(r => r).includes(k) && !BANNED.map(b => b.key).includes(k))

  if (undocumented.length) {
    undocumented.forEach(k => {
      console.log(`  ${YELLOW}⚠ NOT IN .env.example${RESET}  ${k}`)
      warnings++
    })
  }
  if (extra.length) {
    extra.forEach(k => console.log(`  ${CYAN}ℹ EXTRA IN .env.example${RESET}  ${k} (informational)`))
  }
  if (!undocumented.length && !extra.length) {
    console.log(`  ${GREEN}✓ .env.example matches required contract${RESET}`)
  }
} else {
  console.log(`  ${YELLOW}⚠ .env.example not found — skipping drift check${RESET}`)
  warnings++
}

// ── 6. Summary ────────────────────────────────────────────────────────────────
console.log(`\n${BOLD}── Summary ─────────────────────────────────────────${RESET}`)
if (errors === 0 && warnings === 0) {
  console.log(`  ${GREEN}${BOLD}✓ All checks passed. Ready to deploy.${RESET}\n`)
  process.exit(0)
} else {
  if (errors > 0) {
    console.log(`  ${RED}${BOLD}✗ ${errors} error(s) — deployment will fail without these.${RESET}`)
  }
  if (warnings > 0) {
    console.log(`  ${YELLOW}⚠ ${warnings} warning(s) — review before deploying.${RESET}`)
  }
  console.log()
  process.exit(errors > 0 ? 1 : 0)
}
