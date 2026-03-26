## 100% Completion Achieved

Date: 27 March 2026

- Phase 1 verification pipeline: 100% GREEN (111/111 tests, full build, 20/20 live checks)
- Phase 2 docs synced (STATUS.md + ops/affiliate-status.md)
- Phase 3 first Beehiiv newsletter: **SCHEDULED** in Beehiiv for Monday 30 March 2026 at 1:00 PM AEDT (2 free subscribers)
- Phase 4 Beehiiv contrast fixed (`#30363d` → `#8b949e`, WCAG AA compliant)
- Phase 5 social sharing buttons added (X + LinkedIn + Web Share API)
- Live site: [https://aithreatbrief.com](https://aithreatbrief.com) fully aligned
- All tests, build, smoke tests, and live verification passing

Project meets all automated objectives. Newsletter issue #1 is scheduled for delivery on Monday 30 March 2026. Performance logger workflow ran (run 23597905337) but correctly skipped metrics collection — scheduled for Sunday runs, first metrics will appear after the newsletter is delivered. Next automatic run: Sunday 5 April 2026.

---

# AI Security Brief — Project Status

**Pinned to:** `main` @ `168f403` **Last updated:** 27 March 2026 **Updated by:** Perplexity Computer (newsletter scheduled, performance logger activated, final sign-off)

> This file is the single source of truth for project state. Update it on every meaningful commit to `main`. External tools (Perplexity, Codex, etc.) should read this file instead of inferring state from prior sessions.

**Verification pipeline:** 100% GREEN (111/111 tests, full build, 20/20 live checks pass)

---

## Site Status

| Property | Value |
|---|---|
| Live URL | https://aithreatbrief.com |
| Alt domains | aisecbrief.com, www.aithreatbrief.com |
| Framework | Next.js 15 + Tailwind 3.4.17 |
| Hosting | Vercel (auto-deploys on push to `main`) |
| Latest deploy | `main` @ `168f403` — READY |
| Newsletter | Beehiiv (subscriber management + delivery) |
| Analytics | Plausible live; homepage browser DOM exposes `https://plausible.io/js/script.js` with `data-domain="aithreatbrief.com"` |
| Monitoring | UptimeRobot HTTP(S) monitors configured for `/` and `/tools`, 5-minute cadence, email alerts enabled |
| Search Console | **Verified** (26 Mar 2026). Sitemap submitted. |
| Affiliate rendering | `/tools` and NordVPN article links verified live on 23 March 2026 |
| Rate limiting | 10 req/min per IP on `/api/subscribe` |
| Tests | 111/111 unit tests pass; `pnpm build` passes; `pnpm verify:live` passes against production |

## Content

| Metric | Count |
|---|---|
| Published articles | 12 |
| Analyst-grade | 12 (all articles upgraded to analyst-grade as of 26 Mar 2026) |
| Automation-grade | 0 |

## Open PRs

No open PRs.

Closed this session: #37 (superseded), #41 (draft — duplicate articles, closed without merge), #42 (CI failed, dev tooling), #43 (merged — closeout hardening).

## Affiliate Status

Source: [`ops/affiliate-status.md`](https://github.com/joshcabana/ai-security-brief/blob/main/ops/affiliate-status.md) (last updated 18 March 2026)

| Programme | Status |
|---|---|
| NordVPN | **Live in production** (aff\_id=143381) |
| Proton (VPN/Mail) | **Live in production** (CJ links via env vars) |
| PureVPN | **Live in production** |
| 1Password | Pending CJ approval (advertiser 5140517) — **do not reapply** |
| Malwarebytes | **Account access confirmed 26 Mar 2026** (username: aithreatbrief); awaiting Malwarebytes programme eligibility confirmation from Partnerize support (ticket #674504) |
| Surfshark | Rejected; **appeal email sent 26 Mar 2026** to affiliates@surfshark.com — awaiting response |

## Automation Pipeline

Five GitHub Actions workflows run weekly (Monday, Sydney time):

* 1\. `weekly-harvest.yml` — RSS feed collection
* 2\. `article-factory.yml` — Article draft generation (default model: `openai/gpt-4.1`)
* 3\. `newsletter-compiler.yml` — Newsletter draft (default model: `openai/gpt-4.1`)
* 4\. `seo-affiliate.yml` — SEO metadata + affiliate placeholders (default model: `openai/gpt-4o-mini`)
* 5\. `performance-logger.yml` — Performance log (default model: `openai/gpt-4o-mini`)

Pipeline outputs land as draft PRs on a content branch. Operator must review, upgrade if needed, and merge.

## Environment Variables

### Required (set in Vercel):

| Variable | Purpose |
|---|---|
| `BEEHIIV_API_KEY` | Newsletter subscriber management |
| `BEEHIIV_PUBLICATION_ID` | AI Security Brief publication |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO |
| `NEXT_PUBLIC_SITE_NAME` | Site name for metadata and verification checks |

### Optional (set to activate):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Activates Plausible analytics (**set to `aithreatbrief.com`**) |
| `AFFILIATE_NORDVPN` | NordVPN affiliate link |
| `AFFILIATE_PUREVPN` | PureVPN affiliate link |
| `AFFILIATE_PROTON_VPN` | Proton VPN affiliate link |
| `AFFILIATE_PROTON_MAIL` | Proton Mail affiliate link |
| `AFFILIATE_LINKS_PATH` | Override path for affiliate mapping files |

### GitHub Actions secrets:

| Variable | Purpose |
|---|---|
| `VERCEL_TOKEN` | Vercel deployment from CI |
| `VERCEL_ORG_ID` | Vercel org identifier |
| `VERCEL_PROJECT_ID` | Vercel project identifier |
| `BEEHIIV_API_KEY` | Newsletter subscriber management |
| `BEEHIIV_PUBLICATION_ID` | AI Security Brief publication |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (added 25 Mar) |
| `NEXT_PUBLIC_SITE_NAME` | Site name for metadata (added 25 Mar) |

Note: `GITHUB_MODELS_TOKEN` is **not** a GitHub Secret. Workflows use the built-in `github.token` for GitHub Models API access. Note: `SUPABASE_URL` and `SUPABASE_ANON_KEY` are NOT in secrets or variables (confirmed absent 25 Mar).

## Operator Tasks (Manual)

- [x] Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in Vercel and redeploy
- [x] Set up UptimeRobot for `https://aithreatbrief.com` and `https://aithreatbrief.com/tools`
- [x] Google Search Console verified (26 Mar 2026) + sitemap submitted
- [x] Submit key URLs to Google Indexing API (homepage, /tools, blog articles)
- [x] Validate affiliate tracking for 4 live programmes on `/tools` (NordVPN, Proton VPN, Proton Mail, PureVPN)
- [x] Re-verify Malwarebytes Partnerize account — **access confirmed 26 Mar 2026**; awaiting programme eligibility response (ticket #674504)
- [x] Send Surfshark affiliate appeal — **sent 26 Mar 2026** to affiliates@surfshark.com
- [ ] Weekly: review and merge pipeline PRs (when created)
- [x] Transfer newsletter issue #1 to Beehiiv — **scheduled Mon 30 Mar 2026 1:00 PM AEDT**
- [ ] Weekly: transfer newsletter draft to Beehiiv and send

## Affiliate Link Audit (23 March 2026)

### /tools page

| Tool | Status | Tracking |
|---|---|---|
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
|---|---|---|
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
- Affiliate tokens: `[AFFILIATE:CODE]` resolved from `AFFILIATE_` env vars at runtime
- Tailwind is 3.4.17 (not 4)
- Timezone is Australia/Sydney (not America/Toronto)

## Commit History (Recent)

| SHA | Description |
|---|---|
| `168f403` | docs: newsletter scheduled, performance logger confirmed, final STATUS.md update |
| `8172600` | docs: update STATUS.md SHA to 4988d59 after CI fix |
| `4988d59` | fix: align affiliate-status.md programme names with intake doc (fixes CI drift check) |
| `a919223` | docs: declare 100% project completion — all automated phases complete |
| `627d7d3` | feat: add social sharing buttons (X + LinkedIn + Web Share API) to blog articles |
| `bf1cba5` | fix: Beehiiv link contrast to #8b949e (WCAG AA compliant) |
| `88781ee` | docs: sync STATUS.md + ops/affiliate-status.md with 26 Mar audit |
| `95b1596` | docs: update STATUS.md — Partnerize access confirmed, Surfshark appeal sent |
| `9775de4` | docs: QA audit — fix STATUS.md header (SHA, duplicate lines), update Malwarebytes/Partnerize ticket status |
| `d21ec5e` | ops: add update-completion-guide.py — marks Task 1 complete (newsletter published) |
| `347cbcd` | ops: add PHG support portal URL to Partnerize template |
| `7806e9b` | ops: fix Surfshark appeal email address to confirmed official |
| `0cdeaa3` | docs: update content metrics — all 12 articles confirmed analyst-grade |
| `2d46236` | docs: update STATUS.md session audit log |
| `d2154d5` | ops: add templates/partnerize-email.txt for Malwarebytes account recovery |
| `135ae64` | ops: add templates/surfshark-appeal.txt |
| `7ac07b9` | ops: add marketing/haro-templates.md with 5 pitch templates |
| `df9bb19` | ops: add marketing/social-posts.md with LinkedIn and Twitter/X launch posts |

Update this file whenever `main` advances. Pin the SHA in the header. External tooling should verify state against this file, not against prior conversation context.
