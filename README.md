# AI Security Brief

> Intelligence on AI-Powered Threats & Privacy Defence

AI Security Brief is an authority publication covering AI-powered cybersecurity threats, privacy tools, and defence strategies for tech professionals and IT decision-makers.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase
- **Newsletter**: Beehiiv
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions

## Design

- Dark theme: `#0d1117` background, `#00b4ff` electric blue accent
- Typography: Inter (body), JetBrains Mono (code/data)
- Card surfaces: `#161b22` with `#30363d` borders

## Pages

- `/` — Homepage with hero, latest articles, tools preview
- `/blog` — Article listing
- `/blog/[slug]` — Individual article pages
- `/tools` — Affiliate tools directory (VPNs, password managers, endpoint protection)
- `/newsletter` — Newsletter signup with Beehiiv integration

## Content Pipeline

Automated via 5 Perplexity Computer Skills + Zapier:

1. **Weekly Harvest** — Researches top AI security developments
2. **Article Factory** — Writes 2 SEO articles from harvest findings
3. **Newsletter Compiler** — Compiles weekly newsletter draft
4. **SEO + Affiliate Optimizer** — Adds metadata and affiliate links
5. **Performance Logger** — Tracks newsletter metrics weekly

See `skills.md` and `zapier-setup.md` for full automation details.

## Getting Started

```bash
git clone https://github.com/joshcabana/ai-security-brief.git
cd ai-security-brief
npm install
cp .env.example .env.local
# Fill in your Supabase and Beehiiv keys
npm run dev
```

## Repository Structure

```
ai-security-brief/
├── app/                    # Next.js 15 App Router pages
│   ├── blog/              # Blog listing + dynamic article pages
│   ├── tools/             # Affiliate tools directory
│   └── newsletter/        # Newsletter signup page
├── blog/                  # Markdown article files
├── components/            # Reusable React components
├── lib/                   # Supabase client + utilities
├── harvests/              # Weekly AI security research harvests
├── drafts/                # Newsletter drafts (pre-publish)
├── logs/                  # Performance tracking logs
├── .github/workflows/     # GitHub Actions CI/CD
├── affiliate-programs.md  # Affiliate program database
├── beehiiv-setup.md      # Newsletter platform setup guide
├── newsletter-issue-001.md # Issue #1 template
├── skills.md             # 5 Perplexity Computer Skills
├── zapier-setup.md       # Automation setup guide
└── launch-checklist.md   # Step-by-step launch guide
```

## License

© 2026 AI Security Brief. All rights reserved.

---

Created with [Perplexity Computer](https://www.perplexity.ai/computer)
