# AI Security Brief — Project Status

**Pinned to:** `main` @ `0cdeaa3`  **Last updated:** 26 March 2026  **Updated by:** Perplexity Computer (full project audit + QA audit)

> This file is the single source of truth for project state. Update it on every meaningful commit to `main`. External tools (Perplexity, Codex, etc.) should read this file instead of inferring state from prior sessions.

---

## Site Status

| Property | Value |
|----------|-------|
| Live URL | https://aithreatbrief.com |
| Alt domains | aisecbrief.com, www.aithreatbrief.com |
| Framework | Next.js 15 + Tailwind 3.4.17 |
| Hosting | Vercel (auto-deploys on push to `main`) |
| Latest deploy | `main` @ `0cdeaa3` — READY |
| Newsletter | Beehiiv (subscriber management + delivery) |
| Analytics | Plausible live; homepage browser DOM exposes `https://plausible.io/js/script.js` with `data-domain="aithreatbrief.com"` |
| Monitoring | UptimeRobot HTTP(S) monitors configured for `/` and `/tools`, 5-minute cadence, email alerts enabled |
| Search Console | **Verified** (26 Mar 2026). Sitemap submitted. |
| Affiliate rendering | `/tools` and NordVPN article links verified live on 23 March 2026 |
| Rate limiting | 10 req/min per IP on `/api/subscribe` |
| Tests | 111/111 unit tests pass; `pnpm build` passes; `pnpm verify:live` passes against production |

## Content

| Metric | Count |
|--------|-------|
| Published articles | 12 |
| Analyst-grade | 12 (all articles upgraded to analyst-grade as of 26 Mar 2026) |
| Automation-grade | 0 |

## Open PRs

No open PRs.

Closed this session: #37 (superseded), #41 (draft — duplicate articles, closed without merge), #42 (CI failed, dev tooling), #43 (merged — closeout hardening).

## Affiliate Status

Source: [`ops/affiliate-status.md`](ops/affiliate-status.md) (last updated 18 March 2026)

| Programme | Status |
|-----------|--------|
| NordVPN | **Live in production** (aff_id=143381) |
| Proton (VPN/Mail) | **Live in production** (CJ links via env vars) |
| PureVPN | **Live in production** |
| 1Password | Pending CJ approval (advertiser 5140517) — **do not reapply** |
| Malwarebytes | Blocked externally; Partnerize support ticket submitted 26 Mar 2026 via help.phgsupport.com — awaiting response; hCaptcha blocks password reset |
| Surfshark | Rejected (appeal path available) |

## Automation Pipeline

Five GitHub Actions workflows run weekly (Monday, Sydney time):

1. `weekly-harvest.yml` — RSS feed collection
2. `article-factory.yml` — Article draft generation (default model: `openai/gpt-4.1`)
3. `newsletter-compiler.yml` — Newsletter draft (default model: `openai/gpt-4.1`)
4. `seo-affiliate.yml` — SEO metadata + affiliate placeholders (default model: `openai/gpt-4o-mini`)
5. `performance-logger.yml` — Performance log (default model: `openai/gpt-4o-mini`)

Pipeline outputs land as draft PRs on a content branch. Operator must review, upgrade if needed, and merge.

## Environment Variables

### Required (set in Vercel):
| Variable | Purpose |
|----------|---------|
| `BEEHIIV_API_KEY` | Newsletter subscriber management |
| `BEEHIIV_PUBLICATION_ID` | AI Security Brief publication |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO |
| `NEXT_PUBLIC_SITE_NAME` | Site name for metadata and verification checks |

### Optional (set to activate):
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Activates Plausible analytics (**set to `aithreatbrief.com`**) |
| `AFFILIATE_NORDVPN` | NordVPN affiliate link |
| `AFFILIATE_PUREVPN` | PureVPN affiliate link |
| `AFFILIATE_PROTON_VPN` | Proton VPN affiliate link |
| `AFFILIATE_PROTON_MAIL` | Proton Mail affiliate link |
| `AFFILIATE_LINKS_PATH` | Override path for affiliate mapping files |

### GitHub Actions secrets:
| Variable | Purpose |
|----------|---------|
| `VERCEL_TOKEN` | Vercel deployment from CI |
| `VERCEL_ORG_ID` | Vercel org identifier |
| `VERCEL_PROJECT_ID` | Vercel project identifier |
| `BEEHIIV_API_KEY` | Newsletter subscriber management |
| `BEEHIIV_PUBLICATION_ID` | AI Security Brief publication |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (added 25 Mar) |
| `NEXT_PUBLIC_SITE_NAME` | Site name for metadata (added 25 Mar) |

Note: `GITHUB_MODELS_TOKEN` is **not** a GitHub Secret. Workflows use the built-in `github.token` for GitHub Models API access.
Note: `SUPABASE_URL` and `SUPABASE_ANON_KEY` are NOT in secrets or variables (confirmed absent 25 Mar).

## Operator Tasks (Manual)

- [x] Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in Vercel and redeploy
- [x] Set up UptimeRobot for `https://aithreatbrief.com` and `https://aithreatbrief.com/tools`
- [x] Google Search Console verified (26 Mar 2026) + sitemap submitted
- [x] Submit key URLs to Google Indexing API (homepage, /tools, blog articles)
- [x] Validate affiliate tracking for 4 live programmes on `/tools` (NordVPN, Proton VPN, Proton Mail, PureVPN)
- [x] Re-verify Malwarebytes Partnerize account — support ticket submitted 26 Mar 2026 via help.phgsupport.com (hCaptcha blocks direct recovery); awaiting Partnerize response
- [ ] Weekly: review and merge pipeline PRs (when created)
- [ ] Weekly: transfer newsletter draft to Beehiiv and send

## Affiliate Link Audit (23 March 2026)

### /tools page

| Tool | Status | Tracking |
|------|--------|----------|
| NordVPN | **Working** | `aff_id=143381` via HasOffers — resolves to NordVPN special offer page |
| Proton VPN | **Working** | CJ link resolves through `go.getproton.me` with `url_id=471` |
| Proton Mail | **Working** | CJ link resolves through `go.getproton.me` with `url_id=921` |
| PureVPN | **Working** | `affiliate_id=49384204` — resolves to PureVPN order page |
| Mullvad | Non-affiliate | Direct link (expected — no affiliate program) |
| Bitwarden | Non-affiliate | Direct link |
| 1Password | Non-affiliate | Direct link (CJ pending) |
| Malwarebytes | Non-affiliate | Direct link (Partnerize pending) |

**Live verification:** `/tools` renders tracked vendor URLs for NordVPN, Proton VPN, Proton Mail, and PureVPN in production.

### Blog articles (NordVPN tokens)

| Article | Source state | Live render |
|---------|-------|----------|
| `agentic-ai-security-risks` | `[NordVPN]([AFFILIATE:NORDVPN])` | **Working** — tracked `go.nordvpn.net` anchor verified live |
| `australias-privacy-act-reforms-2026` | `[NordVPN]([AFFILIATE:NORDVPN])` | **Working** — tracked `go.nordvpn.net` anchor verified live |
| `how-ai-is-being-used-to-launch-cyberattacks-in-2026` | `[NordVPN]([AFFILIATE:NORDVPN])` | **Working** — tracked `go.nordvpn.net` anchor verified live |
| `ai-flaws-in-amazon-bedrock-langsmith-and-sglang` | `[NordVPN]([AFFILIATE:NORDVPN])` | **Working** — tracked `go.nordvpn.net` anchor verified live |
| `cursorjack-attack-path` | Direct `[1Password](https://1password.com)` | Unchanged by design pending CJ approval |

**Root cause and fix:** article pages were prerendered and freezing the plain-text fallback while `/tools` was already runtime-rendered. The fix landed in `main` at `49798f3`, moving `/blog/[slug]` to runtime rendering so article affiliate tokens resolve against production env vars.

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
| `16a4c1f` | fix(smoke): support multiple Privacy category articles in category pages |
| `dd7f16e` | fix: newsletter issue number + STATUS.md deploy SHA |
| `308ddf9` | ops: add marketing assets + lead magnet + newsletter draft |
| `f974bf3` | content: add 2 buyer-intent comparison articles |
| `affc89f` | feat: dedup fix, JSON-LD schema, affiliate count correction |
| `49798f3` | Merge PR #39: render article affiliate tokens at runtime |
| `6a05715` | Merge PR #38: add live affiliate verification and migrate NordVPN article links |
| `eefad4a` | Document affiliate env var fixes in `STATUS.md` |
| `7996feb` | Update `STATUS.md` with Plausible env var and affiliate audit results |
| `79d4a86` | Plausible analytics (env-gated) + subscribe rate limiting |

---

*Update this file whenever `main` advances. Pin the SHA in the header. External tooling should verify state against this file, not against prior conversation context.*
