# Launch Checklist — AI Security Brief

> Complete these steps in order after all repo files are pushed to GitHub.  
> Estimated total time: **3–4 hours**

---

## 1. Domain Purchase (~15 min)

**Recommended domain:** `aithreatbrief.com` (available, 15 chars, brandable)  
**Alternative:** `aisecbrief.com` (available, 13 chars, shorter)  
**Backup:** `aithreatalert.com` (available, 16 chars)

**Recommended registrar:** [Namecheap](https://www.namecheap.com) (competitive pricing, free WHOIS privacy)

**Steps:**
1. Go to namecheap.com → Search for your chosen domain
2. Add to cart → Checkout (~$10-12/year for .com)
3. Enable free WHOIS privacy protection
4. Set nameservers to Vercel (if using Vercel for hosting):
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
5. Or configure DNS records manually:
   - A record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com` (for www subdomain)

---

## 2. GitHub Repo Clone + Local Setup (~15 min)

**Steps:**
1. Clone the repo:
   ```bash
   git clone https://github.com/joshcabana/ai-security-brief.git
   cd ai-security-brief
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Copy environment template:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in `.env.local` with your actual keys (see Step 5)
5. Test locally:
   ```bash
   pnpm dev
   ```
6. Verify all pages load: `/`, `/blog`, `/tools`, `/newsletter`

---

## 3. Vercel Project Connect (~10 min)

**Steps:**
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click "New Project" → Import `ai-security-brief` repo
3. Framework: Next.js (auto-detected)
4. Set environment variables:
   - `BEEHIIV_API_KEY` → your Beehiiv API key (added in Step 4)
   - `BEEHIIV_PUBLICATION_ID` → your Beehiiv publication ID
   - `NEXT_PUBLIC_SITE_URL` → your production site URL
   - `NEXT_PUBLIC_SITE_NAME` → `AI Security Brief`
5. Deploy → Note your `.vercel.app` preview URL
6. Add custom domain in Vercel → Project Settings → Domains → Add your purchased domain
7. Set up GitHub Actions secrets:
   - `VERCEL_TOKEN` → Generate at vercel.com/account/tokens
   - `VERCEL_ORG_ID` → Found in `.vercel/project.json` after first deploy
   - `VERCEL_PROJECT_ID` → Found in `.vercel/project.json` after first deploy

---

## 4. Beehiiv Account Creation + Issue #1 Publish (~30 min)

**Steps:**
1. Go to [beehiiv.com](https://www.beehiiv.com) → Create account
2. Publication name: **AI Security Brief**
3. Configure branding (see `beehiiv-setup.md` for colours and template)
4. Set up sender email (requires domain verification)
5. Create email template matching the design in `beehiiv-setup.md`
6. Generate API key: Settings → Integrations → API
7. Copy API key to `.env.local` as `BEEHIIV_API_KEY`
8. Copy Publication ID to `.env.local` as `BEEHIIV_PUBLICATION_ID`
9. Verify `/newsletter` can create a real signup through `/api/subscribe`
10. Create Issue #1 using content from `newsletter-issue-001.md`
11. Preview → Test send to yourself
12. Publish or schedule Issue #1

---

## 5. .env Setup (~10 min)

**Fill in `.env.local`:**
```
BEEHIIV_API_KEY=your-beehiiv-api-key
BEEHIIV_PUBLICATION_ID=your-publication-id
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=AI Security Brief
```

**Run the local release checks before you publish anything:**
```bash
pnpm verify:release
```

**Push env vars to Vercel:**
```bash
vercel env add BEEHIIV_API_KEY
vercel env add BEEHIIV_PUBLICATION_ID
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add NEXT_PUBLIC_SITE_NAME
```

---

## 6. Affiliate Signups (~45 min)

**Status:** Ready to submit once forms are completed with the intake sheet in `ops/affiliate-intake.md`

Sign up in order of highest commission rate:

| # | Program | Commission | Signup URL | Est. Time |
|---|---------|-----------|-----------|-----------|
| 1 | NordVPN | Up to 100% | [nordvpn.com/affiliate](https://nordvpn.com/affiliate/) | 5 min |
| 2 | Proton | Up to 100% | [proton.me/partners/affiliates](https://proton.me/partners/affiliates) | 5 min |
| 3 | PureVPN | 100% monthly | [purevpn.com/affiliates](https://www.purevpn.com/affiliates) | 5 min |
| 4 | CyberGhost | Up to 100% | [cyberghostvpn.com/affiliate](https://www.cyberghostvpn.com/en_US/affiliate) | 5 min |
| 5 | Surfshark | 40%+ rev share | [surfshark.com/affiliate](https://surfshark.com/affiliate) | 5 min |
| 6 | Malwarebytes | Up to 30% | [malwarebytes.com/affiliates](https://www.malwarebytes.com/affiliates) | 5 min |
| 7 | Jasper AI | 30% recurring | [jasper.ai/partners](https://www.jasper.ai/partners) | 5 min |
| 8 | 1Password | $2 + 25% | [1password.com/affiliate](https://1password.com/affiliate/) | 5 min |

**After approval** (may take 1-7 days per program):
- Replace `[AFFILIATE:TOOLNAME]` placeholders in articles and newsletter with actual affiliate links
- Update the `/tools` page with real affiliate URLs

---

## 7. Perplexity Publisher Program Email (~5 min)

**Status:** Complete

Application email sent to [publishers@perplexity.ai](mailto:publishers@perplexity.ai).

Send email to: [publishers@perplexity.ai](mailto:publishers@perplexity.ai)

**Subject:** Publisher Program Application — AI Security Brief

**Body:**
```
Hi Perplexity team,

I'm launching AI Security Brief (aithreatbrief.com), a publication focused on
AI-powered cybersecurity threats, privacy tools, and defence strategies for
tech professionals and IT decision-makers.

We publish weekly intelligence digests covering AI attack vectors, privacy
regulation updates (with an Australia/APAC focus), and security tool reviews.

We'd love to be considered for the Perplexity Publisher Program to ensure our
content is properly attributed and discoverable.

Site: https://aithreatbrief.com
Newsletter: AI Security Brief (Beehiiv)
Content frequency: 2+ articles/week + weekly newsletter
Niche: AI security, privacy, cybersecurity

Thanks,
[Your Name]
```

---

## 8. GitHub Automation Secrets + Schedule (~15 min)

**Steps:**
1. Go to GitHub → Repo → Settings → Secrets and variables → Actions
2. Add repository secrets:
   - `BEEHIIV_API_KEY`
   - `BEEHIIV_PUBLICATION_ID`
3. Add optional repository variable:
   - `GITHUB_MODELS_MODEL=openai/gpt-4o-mini`
4. Review `zapier-setup.md` — it now documents the production GitHub Actions pipeline
5. Confirm the following workflows exist:
   - `weekly-harvest.yml`
   - `article-factory.yml`
   - `newsletter-compiler.yml`
   - `seo-affiliate.yml`
   - `performance-logger.yml`

---

## 9. First Manual Automation Backfill (~20 min)

**Validate the full pipeline with `workflow_dispatch`:**

1. Run `weekly-harvest.yml` with an optional `run_date` override
2. Verify `harvest-[DATE].md` appears on a draft PR branch
3. Run `article-factory.yml` for the same `run_date`
4. Verify 2 new article drafts appear in `/blog/`
5. Run `newsletter-compiler.yml` for the same `run_date`
6. Verify a draft appears in `/drafts/`
7. Run `seo-affiliate.yml`
8. Run `performance-logger.yml`
9. Review the generated draft PRs and merge only after editorial review

**If all passes:** The weekly automated pipeline is ready. Scheduled workflows will maintain it from there.

---

## Summary

| Step | Est. Time | Status |
|------|----------|--------|
| Domain purchase | 15 min | ☐ |
| GitHub clone + local setup | 15 min | ☐ |
| Vercel project connect | 10 min | ☐ |
| Beehiiv setup + Issue #1 | 30 min | ☐ |
| .env configuration | 10 min | ☐ |
| Affiliate signups (8 programs) | 45 min | Ready to submit |
| Publisher program email | 5 min | ✓ |
| GitHub automation secrets | 15 min | ☐ |
| First manual automation backfill | 20 min | ☐ |
| **TOTAL** | **~2 hours 35 min** | |

---

*After completing all steps, the AI Security Brief pipeline is ready for manual approval and then weekly automated content preparation every Monday.*
