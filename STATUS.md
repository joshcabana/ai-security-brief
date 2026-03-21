# AI Security Brief — Project Status

**Pinned to:** `main` @ [`7ae38a6`](https://github.com/joshcabana/ai-security-brief/commit/7ae38a6)
**Last updated:** 22 March 2026
**Updated by:** Perplexity Computer (automated session)

> This file is the single source of truth for project state. Update it on every meaningful commit to `main`. External tools (Perplexity, Codex, etc.) should read this file instead of inferring state from prior sessions.

---

## Site Status

| Property | Value |
|----------|-------|
| Live URL | https://aithreatbrief.com |
| Alt domains | aisecbrief.com, www.aithreatbrief.com |
| Framework | Next.js 15 + Tailwind 3.4.17 |
| Hosting | Vercel (auto-deploys on push to `main`) |
| Latest deploy | `dpl_7S1M4Y9EEnPRktoiGBu5TkBVWL1k` — READY |
| Newsletter | Beehiiv (subscriber management + delivery) |
| Analytics | Plausible (code deployed, **env var `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` not yet set**) |
| Rate limiting | 10 req/min per IP on `/api/subscribe` |
| Tests | 98/98 pass (`pnpm run verify:release`) |

## Content

| Metric | Count |
|--------|-------|
| Published articles | 9 |
| Analyst-grade | 2 (Bedrock/LangSmith/SGLang, CursorJack) |
| Automation-grade | 7 (need editorial upgrade) |

## Open PRs

None as of 22 March 2026.

## Affiliate Status

Source: [`ops/affiliate-status.md`](ops/affiliate-status.md) (last updated 18 March 2026)

| Programme | Status |
|-----------|--------|
| NordVPN | **Live in production** (aff_id=143381) |
| Proton (VPN/Mail) | **Live in production** (CJ links via env vars) |
| PureVPN | **Live in production** |
| 1Password | Pending CJ approval (advertiser 5140517) — **do not reapply** |
| Malwarebytes | Partnerize account needs re-verification |
| Surfshark | Rejected (appeal path available) |

## Automation Pipeline

Five GitHub Actions workflows run weekly (Monday, Sydney time):

1. `weekly-harvest.yml` — RSS feed collection
2. `article-factory.yml` — Article draft generation (default model: `openai/gpt-4.1`)
3. `newsletter-compiler.yml` — Newsletter draft (default model: `openai/gpt-4.1`)
4. `seo-affiliate.yml` — SEO metadata + affiliate placeholders (default model: `openai/gpt-4o-mini`)
5. `weekly-performance.yml` — Performance log (default model: `openai/gpt-4o-mini`)

Pipeline outputs land as draft PRs on a content branch. Operator must review, upgrade if needed, and merge.

## Environment Variables

### Required (set in Vercel):
| Variable | Purpose |
|----------|---------|
| `BEEHIIV_API_KEY` | Newsletter subscriber management |
| `BEEHIIV_PUBLICATION_ID` | AI Security Brief publication |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO |

### Optional (set to activate):
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Activates Plausible analytics (**not yet set**) |
| `AFFILIATE_NORDVPN` | NordVPN affiliate link |
| `AFFILIATE_PUREVPN` | PureVPN affiliate link |
| `AFFILIATE_PROTON_VPN` | Proton VPN affiliate link |
| `AFFILIATE_PROTON_MAIL` | Proton Mail affiliate link |
| `AFFILIATE_LINKS_PATH` | Override path for affiliate mapping files |

### GitHub Actions secrets:
| Variable | Purpose |
|----------|---------|
| `GITHUB_MODELS_TOKEN` | GitHub Models API access |
| `VERCEL_TOKEN` | Vercel deployment from CI |
| `BEEHIIV_API_KEY` | Performance log subscriber count |

## Operator Tasks (Manual)

- [ ] Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in Vercel and redeploy
- [ ] Set up UptimeRobot for aithreatbrief.com
- [ ] Verify site in Google Search Console + submit sitemap
- [ ] Validate affiliate tracking for 3 live programmes
- [ ] Re-verify Malwarebytes Partnerize account
- [ ] Weekly: review and merge pipeline PRs (when created)
- [ ] Weekly: transfer newsletter draft to Beehiiv and send

## Key Constraints

- Articles require exactly 5 keywords in frontmatter
- `read_time` must match pattern `N min`
- Content manifest: regenerate via `node scripts/content-manifest.mjs --write`
- Affiliate tokens: `[AFFILIATE:CODE]` resolved from `AFFILIATE_<CODE>` env vars at runtime
- Tailwind is 3.4.17 (not 4)
- Timezone is Australia/Sydney (not America/Toronto)

## Commit History (Recent)

| SHA | Description |
|-----|-------------|
| `79d4a86` | Plausible analytics (env-gated) + subscribe rate limiting |
| `22ab4ef` | Merge PR #36: Week 12 performance log |
| `22f59cd` | Merge PR #35: Week 12 content — analyst-grade articles + newsletter |
| `2a2d44b` | Upgrade: rewrite articles to analyst-grade quality |
| `10ae6bf` | Tag: `v1.0-handover` |

---

*Update this file whenever `main` advances. Pin the SHA in the header. External tooling should verify state against this file, not against prior conversation context.*
