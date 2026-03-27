# AI Security Brief — Operational Runbook

> Single source of truth for operating this project. Written for any future AI agent or human operator.
> Last updated: 27 March 2026 by Perplexity Computer.

---

## Project Overview

**AI Security Brief** is a weekly cybersecurity intelligence newsletter and content site monetised through affiliate marketing. It targets security professionals, IT administrators, and privacy-conscious developers in the APAC region.

- **Live site:** https://aithreatbrief.com
- **Repository:** github.com/joshcabana/ai-security-brief
- **Framework:** Next.js 15 + Tailwind 3.4.17
- **Hosting:** Vercel (auto-deploys on push to `main`)
- **Newsletter:** Beehiiv (Scale plan, $49/mo)
- **Analytics:** Plausible (privacy-first, no cookies)
- **Monitoring:** UptimeRobot (5-min cadence, email alerts)
- **Owner:** Joshua Cabana (Symonston, ACT, Australia)

---

## Weekly Operating Rhythm

### Every Monday (Content Pipeline)
1. **GitHub Actions fire automatically** (5 workflows):
   - `weekly-harvest.yml` — RSS feed collection
   - `article-factory.yml` — Draft article generation
   - `newsletter-compiler.yml` — Newsletter draft
   - `seo-affiliate.yml` — SEO metadata + affiliate placeholders
   - `performance-logger.yml` — Performance metrics (Sunday 20:00 AEDT)

2. **Human review required:**
   - Review draft PRs created by automation
   - Upgrade content to analyst-grade if needed
   - Merge approved PRs to `main` (triggers Vercel deploy)

3. **Newsletter delivery:**
   - Transfer compiled newsletter to Beehiiv
   - Schedule send for Monday 1:00 PM AEDT
   - Verify affiliate links resolve correctly in preview

### Every Tuesday (Post-Send Analysis)
- Check Beehiiv opens/clicks within 24h
- Log top-performing affiliate links in `logs/revenue-log.md`
- Note any delivery issues or bounces

### Every Friday (Revenue & KPI Update)
- Update `logs/revenue-log.md` with weekly stats
- Check affiliate dashboards for pending commissions
- Review Plausible analytics for traffic trends

### 1st–10th of Each Month (Payouts)
- **PureVPN:** Submit manual payout request (minimum $500 wire / $100 PayPal)
- **NordVPN:** Automatic payout when balance exceeds threshold
- **CJ Affiliate:** Automatic monthly payout to Commonwealth Bank

---

## Affiliate Programme Status & Management

### Active Programmes (Revenue-Generating)

| Programme | Network | Commission | Payment | Links Live |
|-----------|---------|-----------|---------|------------|
| NordVPN | HasOffers | 40% CPS + goals | Wire → CBA | /tools + 4 articles |
| Proton VPN | CJ | 40–100% + 30% renewal | Direct Deposit → CBA | /tools |
| Proton Mail | CJ | 40–100% + 30% renewal | Direct Deposit → CBA | /tools |
| PureVPN | Direct | 40–100% + 35% renewal | Wire → CBA | /tools |

### Pending Programmes

| Programme | Network | Status | Action |
|-----------|---------|--------|--------|
| 1Password | CJ (advertiser 5140517) | Pending approval | DO NOT reapply. Wait. |
| Malwarebytes | Partnerize | Ticket #674504 open | Follow up by 2 Apr 2026 |
| Surfshark | Direct | Appeal sent 26 Mar | Follow up by 2 Apr if no reply |

### Target Programmes (Not Yet Applied)

| Programme | Expected Commission | Network | Priority |
|-----------|-------------------|---------|----------|
| Heimdal Security | 50–75% | Awin (INACTIVE) / Direct (requires biz email) | BLOCKED |
| StationX | 30–40% (5-year cookie!) | Direct | HIGH |
| Norton | 37.5–45% | CJ / GenDigital | MEDIUM |

### How to Add a New Affiliate Link
1. Get approved on the network
2. Add the link to `~/.ai-security-brief/affiliate-links.json` (private, not in repo)
3. Add corresponding `AFFILIATE_` env var in Vercel
4. Run `pnpm affiliate:apply` to backfill tracked links across all articles
5. Verify on live site that links resolve correctly
6. Update `ops/affiliate-status.md` and `logs/revenue-log.md`

---

## Payment Configuration

| Network | Method | Bank | Min Payout | Status |
|---------|--------|------|-----------|--------|
| NordVPN | Wire | Commonwealth Bank (BSB 062900, Acct ending 2710) | TBC | Configured 27 Mar 2026 |
| CJ Affiliate | Direct Deposit | Commonwealth Bank | $100 USD | Configured (pre-existing) |
| PureVPN | Wire | Commonwealth Bank (BSB 062900, Acct ending 2710) | $500 wire / $100 PayPal | Configured 27 Mar 2026 |

**Tax:** CJ W-8BEN-E submitted 27 Mar 2026 with Australian TFN. Allow 24–48h for approval.

---

## Beehiiv Configuration

- **Plan:** Scale ($49/mo, activated 27 Mar 2026, next billing 27 Apr 2026)
- **Subscribers:** 2 (as of 27 Mar 2026)
- **Referral Program:** ON ("Invite 3 colleagues → bonus deep-dive issue")
- **Newsletter #1:** Scheduled Mon 30 Mar 2026, 1:00 PM AEDT
- **Welcome Sequence:** 3-email automation (template in `/home/user/workspace/beehiiv-welcome-sequence.md`)

### Beehiiv Features to Use (Scale Plan)
- Referral program (subscriber growth flywheel)
- Recommendation network (cross-promotion with other newsletters)
- Email automations (welcome sequence, re-engagement)
- 3D Analytics (deep engagement insights)
- Segment sends (target by behaviour)
- Boost network (get paid for recommending other newsletters)

---

## Content Strategy

### Current Content (12 articles, all analyst-grade)
Articles cover AI threats, privacy law, VPN comparisons, password managers, and vulnerability analysis. Each article includes:
- Affiliate token placeholders (`[AFFILIATE:CODE]`) resolved at runtime
- Schema.org structured data
- SEO-optimised metadata (5 keywords per article)
- Social sharing buttons (X + LinkedIn + Web Share API)

### Content Pipeline Targets
| Month | Articles Target | Total Published |
|-------|----------------|----------------|
| Apr 2026 | +8 (weekly automation) | 20 |
| Jun 2026 | +15 | 35 |
| Sep 2026 | +13 | 48 |
| Dec 2026 | +12 | 60 |

### High-Value Money Pages to Create
1. "Best Antivirus for Remote Workers 2026" (outline delivered)
2. "Best Email Security Tools 2026"
3. "AI Security Tools Comparison"
4. "Cybersecurity Training Platforms Ranked" (StationX affiliate opportunity)
5. "Enterprise VPN vs Consumer VPN for Security Teams"

---

## Revenue Growth Strategies

### Immediate (Week 1–4)
1. **Beehiiv Boosts** — Get paid $1–$3 per subscriber when recommending other newsletters. Apply via Beehiiv dashboard → Monetize → Boosts.
2. **Beehiiv Ad Network** — Once at 1,000+ subscribers, apply for automated ad placements. Brands like HubSpot, AG1, etc.
3. **Referral program** — Already enabled. Monitor referral conversions weekly.

### Short-Term (Month 1–3)
4. **Cross-post on LinkedIn** — Repurpose newsletter content as LinkedIn articles for organic reach.
5. **X/Twitter thread strategy** — Post thread summaries of each newsletter issue (template already delivered).
6. **Reddit engagement** — Share insights (not links) in r/cybersecurity, r/netsec, r/privacy.
7. **HARO/Connectively pitches** — Position as AI security expert for media quotes (templates in `marketing/haro-templates.md`).

### Medium-Term (Month 3–6)
8. **Digital product** — Create a paid "AI Threat Intelligence Report" (quarterly, $29–$49).
9. **Sponsored content** — Once at 500+ subscribers, approach cybersecurity tool vendors for sponsored placements.
10. **Beehiiv paid tier** — Offer premium deep-dive analysis for $5–$10/mo once content library is substantial.

### Long-Term (Month 6–12)
11. **Course partnership** — Partner with StationX or similar for co-branded cybersecurity courses.
12. **Consulting/advisory** — Leverage newsletter authority for AI security consulting leads.
13. **Newsletter acquisition** — At scale (5,000+ subscribers), the newsletter itself becomes a sellable asset (typical valuations: 20–40x monthly revenue).

---

## Technical Reference

### Environment Variables (Vercel)
See `STATUS.md` → Environment Variables section for full list.

### Key Commands
```bash
# Setup
corepack enable && corepack prepare pnpm@latest --activate
export PATH="/usr/local/bin:$PATH"

# Development
pnpm dev              # Local dev server
pnpm build            # Production build
pnpm test:unit        # Run 111 unit tests
pnpm check:content    # Content integrity check
pnpm verify:live      # 20-point live site verification

# Affiliate management
pnpm affiliate:apply  # Backfill affiliate links across articles

# Content
node scripts/content-manifest.mjs --write  # Regenerate content manifest
```

### Key Constraints
- Articles require exactly 5 keywords in frontmatter
- `read_time` must match pattern `N min`
- Tailwind is 3.4.17 (NOT 4)
- Timezone is Australia/Sydney (AEDT/AEST)
- Affiliate tokens: `[AFFILIATE:CODE]` resolved from `AFFILIATE_` env vars at runtime
- No personal data (address, phone, ABN, TFN) in public repo

### File Structure
```
STATUS.md              # Single source of truth for project state
ops/affiliate-status.md # Affiliate programme tracker
ops/affiliate-links.json # Public-safe affiliate link mappings
ops/RUNBOOK.md         # This file — operational guide
logs/revenue-log.md    # Revenue and KPI tracker
marketing/social-posts.md # Social media templates
marketing/haro-templates.md # Media pitch templates
blog/*.md              # Published articles (12 total)
drafts/                # Unpublished draft articles
scripts/automation/    # Pipeline automation scripts
```

---

## Escalation Contacts

| Service | Contact | Purpose |
|---------|---------|---------|
| NordVPN affiliate | info@nordvpnmedia.com | Account manager |
| CJ Affiliate | members.cj.com support | Payment/tax issues |
| PureVPN affiliate | Dashboard support | Payout requests |
| Malwarebytes | Partnerize ticket #674504 | Programme eligibility |
| Surfshark | affiliates@surfshark.com | Appeal follow-up |
| Beehiiv | In-app support | Plan/billing issues |
| Vercel | vercel.com/support | Deployment issues |

---

## Change Log

| Date | Change | By |
|------|--------|-----|
| 27 Mar 2026 | Initial runbook created | Perplexity Computer |
| 27 Mar 2026 | Beehiiv upgraded to Scale, referral program enabled | Perplexity Computer |
| 27 Mar 2026 | All payment methods configured (NordVPN, CJ, PureVPN) | Perplexity Computer |
| 27 Mar 2026 | CJ W-8BEN-E resubmitted with Australian TFN | Perplexity Computer |
