## Launch Promotion Blocked

Date: 31 March 2026

- `main` remains pinned at `2d16a240`, but valid same-site newsletter signup is currently failing with `503` in production
- Latest post-merge `Verify and Deploy` run `23728134983` passed `verify`, `deploy`, `verify_live`, and `status`, but those gates did not exercise a real valid signup request
- Live checks on 31 March 2026 confirmed `/` still returns `200` and same-site invalid subscribe still returns `400`, while valid same-site subscribe returns `503`
- PR #51 preview returns the same `503` with message `Newsletter signup is temporarily unavailable. Check rate limiting service connectivity and try again.`
- Do not merge PR #51 until `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are restored in Vercel for preview and production and a live inbox smoke test passes

---

# AI Security Brief — Project Status

**Pinned baseline:** `origin/main` @ `2d16a240` **Last updated:** 31 March 2026 **Updated by:** Codex (launch promotion baseline refresh)

> This file is the single source of truth for project state. Update it on every meaningful commit to `main`. External tools (Perplexity, Codex, etc.) should read this file instead of inferring state from prior sessions. Public `/status` surfaces use runtime deployment metadata as the authoritative deploy identity and use this document for operator context.

**Verification pipeline:** CI remains GREEN on `main`, but live valid signup is BLOCKED; the latest `Verify and Deploy` run `23728134983` completed successfully on commit `2d16a240` without covering the real-subscriber happy path.

---

## Site Status

| Property | Value |
|---|---|
| Live URL | https://aithreatbrief.com |
| Alt domains | aisecbrief.com, www.aithreatbrief.com |
| Framework | Next.js 15 + Tailwind 3.4.17 |
| Hosting | Vercel (auto-deploys on push to `main`) |
| Repository license | MIT (`LICENSE`) |
| Latest deploy | `main` @ `2d16a240` — READY in Vercel, but launch-blocked because valid same-site `/api/subscribe` requests currently return `503` |
| Newsletter | Beehiiv Scale plan ($49/mo, activated 27 Mar 2026) — referral program ON |
| Analytics | Plausible live; homepage browser DOM exposes `https://plausible.io/js/script.js` with `data-domain="aithreatbrief.com"` |
| Monitoring | UptimeRobot HTTP(S) monitors configured for `/` and `/tools`, 5-minute cadence, email alerts enabled |
| Search Console | **Verified** (26 Mar 2026). Sitemap submitted. |
| Affiliate rendering | `/tools` and NordVPN article links verified live on 23 March 2026 |
| Rate limiting | Upstash-backed distributed 5 req/min per IP on `/api/subscribe` |
| Public status surface | `/status` and `/status.json` (runtime snapshot) |
| Tests | Latest post-merge `main` run `23728134983` passed `verify`, `deploy`, `verify_live`, and `status`. Live spot checks on 31 March 2026 still show `200 /`, `400` on same-site invalid subscribe, and `404` for the retired public cheatsheet path, but a real valid signup now returns `503`. |

## Content

| Metric | Count |
|---|---|
| Published articles | 12 |
| Analyst-grade | 12 (all articles upgraded to analyst-grade as of 26 Mar 2026) |
| Automation-grade | 0 |

## Open PRs

- #51 — draft: `fix(newsletter): Remove app-managed lead magnet delivery`

Most recent merges:
- #49 — `fix(launch): Harden protected signup delivery`
- #47 — latest status and ops hardening merge on `main`
- #46 — `docs(status): Sync repo truth with merged main`
- #45 — `ci(actions): Upgrade pnpm setup to v5`
- #44 — `fix(closeout): Finalize branch hardening`

## Affiliate Status

Source: [`ops/affiliate-status.md`](https://github.com/joshcabana/ai-security-brief/blob/main/ops/affiliate-status.md) (last updated 27 March 2026)

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
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL for distributed rate limiting on valid signup requests |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token for distributed rate limiting on valid signup requests |

### Optional (set to activate):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Activates Plausible analytics (**set to `aithreatbrief.com`**) |
| `BEEHIIV_WELCOME_AUTOMATION_ID` | Optional Beehiiv automation path for welcome-email delivery |
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
- [x] Beehiiv upgraded to Scale plan ($49/mo) — **27 Mar 2026**
- [x] Beehiiv Referral Program enabled ("Invite 3 → bonus deep-dive") — **27 Mar 2026**
- [x] NordVPN payment configured (wire to Commonwealth Bank) — **27 Mar 2026**
- [x] CJ Affiliate payment configured (direct deposit to Commonwealth Bank) — pre-existing
- [x] CJ W-8BEN-E resubmitted with Australian TFN — **27 Mar 2026**
- [x] PureVPN payment configured (wire to Commonwealth Bank) — **27 Mar 2026**
- [ ] Weekly: review and merge pipeline PRs (when created)
- [x] Transfer newsletter issue #1 to Beehiiv — **scheduled Mon 30 Mar 2026 1:00 PM AEDT**
- [ ] Restore `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in Vercel preview + production; valid signups are currently blocked with `503`
- [ ] Weekly: transfer newsletter draft to Beehiiv and send. Follow `beehiiv-setup.md` → `First Live Send and Metrics Runbook`.

## Verification Notes (31 March 2026)

- A live same-site `POST https://aithreatbrief.com/api/subscribe` with a valid email returned `503` on 31 March 2026 with message `Newsletter signup is temporarily unavailable. Check rate limiting service connectivity and try again.` This is now the active launch blocker on `main`.
- The PR #51 preview deployment at `ai-security-brief-git-codex-launch-c5dcf5-josh-cabanas-projects.vercel.app` returns the same `503` on a valid same-site signup after bypassing Vercel preview protection, confirming the failure is not specific to Beehiiv-only delivery changes.
- Vercel project configuration currently exposes Beehiiv and site metadata env vars, but no `UPSTASH_REDIS_REST_URL` or `UPSTASH_REDIS_REST_TOKEN`, and there are no attached Vercel marketplace resources for this project.
- PR #49 merged into `main` as `2d16a240d7eb8c1ed241e70bbb2f722a00eaa588`; the latest launch hardening baseline is live and the corresponding `Verify and Deploy` run `23728134983` completed successfully on 30 March 2026.
- PR #51 is currently open as a draft release-promotion follow-up to remove app-managed lead magnet delivery and keep Beehiiv email content as the sole cheatsheet delivery path.

- PR #46 merged into `main` as `32ac4b326c60cf25600053da92c2fe503b6dc738`; `README.md`, `STATUS.md`, `beehiiv-setup.md`, and generated status metadata now match the merged repository truth.
- The previous `main` baseline was `b48d8326cc306dd791efb3ae3d42b962944e7b84`, with successful `Verify and Deploy` run `23700345233` on 29 March 2026.
- PR #44 merged into `main` as `b6d322c35707ab53b03058dfd5d7c38f7b892276`; the shipped fix validates subscribe input before Beehiiv or Upstash readiness checks and keeps the removed cheatsheet asset at `404`.
- PR #45 merged into `main` as `9f47de4e05d96cabaac033fef158dd07793af064`; all workflows now use `pnpm/action-setup@v5`, removing the deprecated action runtime from CI.
- Latest post-merge `Verify and Deploy` run `23728134983` completed successfully on `main`.
- Live spot checks on 29 March 2026 confirmed `GET /` returned `200`, same-site `POST /api/subscribe` with an invalid email returned `400`, and the retired public cheatsheet path returned `404`.

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
| `9f47de4` | Merge pull request #45 from joshcabana/codex/actions-node24 |
| `21178be` | ci(actions): Upgrade pnpm setup to v5 |
| `b6d322c` | Merge pull request #44 from joshcabana/codex/full-health-closeout |
| `c59ec9b` | fix(ci): Validate subscribe requests before env checks |
| `bda8fac` | fix(security): Harden signup and feed ingestion |
| `0ac08c2` | ops: add revenue-log.md KPI tracker for affiliate monetisation |
| `e4a0643` | docs: newsletter scheduled, performance logger confirmed, final STATUS.md update |
| `8172600` | docs: update STATUS.md SHA to 4988d59 after CI fix |
| `4988d59` | fix: align affiliate-status.md programme names with intake doc (fixes CI drift check) |
| `a919223` | docs: declare 100% project completion — all automated phases complete |
| `627d7d3` | feat: add social sharing buttons (X + LinkedIn + Web Share API) to blog articles |
| `bf1cba5` | fix: Beehiiv link contrast to #8b949e (WCAG AA compliant) |
| `88781ee` | docs: sync STATUS.md + ops/affiliate-status.md with 26 Mar audit |
| `95b1596` | docs: update STATUS.md — Partnerize access confirmed, Surfshark appeal sent |
| `9775de4` | docs: QA audit — fix STATUS.md header (SHA, duplicate lines), update Malwarebytes/Partnerize ticket status |
| `d21ec5e` | ops: add update-completion-guide.py — updates Task 1 completion guide copy |
| `347cbcd` | ops: add PHG support portal URL to Partnerize template |
| `7806e9b` | ops: fix Surfshark appeal email address to confirmed official |
| `0cdeaa3` | docs: update content metrics — all 12 articles confirmed analyst-grade |
| `2d46236` | docs: update STATUS.md session audit log |
| `d2154d5` | ops: add templates/partnerize-email.txt for Malwarebytes account recovery |
| `135ae64` | ops: add templates/surfshark-appeal.txt |
| `7ac07b9` | ops: add marketing/haro-templates.md with 5 pitch templates |
| `df9bb19` | ops: add marketing/social-posts.md with LinkedIn and Twitter/X launch posts |

Update this file whenever `main` advances. Pin the SHA in the header. External tooling should verify state against this file, not against prior conversation context.
