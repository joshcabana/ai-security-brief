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
   npm install
   ```
3. Copy environment template:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in `.env.local` with your actual keys (see Step 5)
5. Test locally:
   ```bash
   npm run dev
   ```
6. Verify all pages load: `/`, `/blog`, `/tools`, `/newsletter`

---

## 3. Vercel Project Connect (~10 min)

**Steps:**
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click "New Project" → Import `ai-security-brief` repo
3. Framework: Next.js (auto-detected)
4. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon key
   - `BEEHIIV_API_KEY` → your Beehiiv API key (added in Step 4)
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
9. Get embed code: Grow → Subscribe Forms → Create embedded form
10. Update `NewsletterForm.tsx` with your Beehiiv publication ID
11. Create Issue #1 using content from `newsletter-issue-001.md`
12. Preview → Test send to yourself
13. Publish or schedule Issue #1

---

## 5. .env Setup (~10 min)

**Create a Supabase project** (if not already done):
1. Go to [supabase.com](https://supabase.com) → New project
2. Copy Project URL and Anon Key

**Fill in `.env.local`:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
BEEHIIV_API_KEY=your-beehiiv-api-key
BEEHIIV_PUBLICATION_ID=your-publication-id
```

**Push env vars to Vercel:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add BEEHIIV_API_KEY
```

---

## 6. Affiliate Signups (~45 min)

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

## 8. Zapier Account Setup + 5 Zaps Activation (~30 min)

**Steps:**
1. Create Zapier account at [zapier.com](https://zapier.com)
2. Follow `zapier-setup.md` to create all 5 Zaps
3. Replace `[INSERT COMPUTER API KEY]` in each Zap with your actual key
4. Create Zaps in this order:
   - Zap 1: Weekly Harvest (Monday 5:00 AM AEDT)
   - Zap 2: Article Factory (Monday 9:00 AM AEDT)
   - Zap 3: Newsletter Compiler (Monday 1:00 PM AEDT)
   - Zap 4: SEO Optimizer (Monday 3:00 PM AEDT)
   - Zap 5: Performance Logger (Sunday 8:00 PM AEDT)
5. Test each Zap with "Run" button
6. Turn on all Zaps

---

## 9. Skills Activation in Computer (~15 min)

Activate in this exact sequence order:

1. **weekly-ai-security-harvest** — Go to Computer → Skills → Create Skill → paste from `skills.md` Skill 1
2. **article-factory** — Paste from `skills.md` Skill 2
3. **newsletter-compiler** — Paste from `skills.md` Skill 3
4. **seo-affiliate-optimizer** — Paste from `skills.md` Skill 4
5. **performance-logger** — Paste from `skills.md` Skill 5

---

## 10. First Manual Test Run (~15 min)

**Validate the full pipeline manually:**

1. Open Perplexity Computer
2. Type: "Use the weekly-ai-security-harvest skill"
3. Verify a `harvest-[DATE].md` file appears in `/harvests/` on GitHub
4. Then type: "Use the article-factory skill"
5. Verify 2 new articles appear in `/blog/` on GitHub
6. Check the live site to confirm articles render correctly
7. Run the newsletter compiler and check `/drafts/`

**If all passes:** The automated pipeline is ready. Zaps will handle everything from next Monday.

---

## Summary

| Step | Est. Time | Status |
|------|----------|--------|
| Domain purchase | 15 min | ☐ |
| GitHub clone + local setup | 15 min | ☐ |
| Vercel project connect | 10 min | ☐ |
| Beehiiv setup + Issue #1 | 30 min | ☐ |
| .env configuration | 10 min | ☐ |
| Affiliate signups (8 programs) | 45 min | ☐ |
| Publisher program email | 5 min | ☐ |
| Zapier setup (5 Zaps) | 30 min | ☐ |
| Skills activation (5 skills) | 15 min | ☐ |
| First manual test run | 15 min | ☐ |
| **TOTAL** | **~3 hours 10 min** | |

---

*After completing all steps, the AI Security Brief content pipeline is fully operational. New content will be researched, written, optimised, and drafted for newsletter distribution every Monday automatically.*
