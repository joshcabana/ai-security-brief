# AI Security Brief

> Intelligence on AI-Powered Threats & Privacy Defence

AI Security Brief is an authority publication covering AI-powered cybersecurity threats, privacy tools, and defence strategies for tech professionals and IT decision-makers.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 3
- **Newsletter**: Beehiiv
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions

## Design

- Dark theme: `#0d1117` background, `#00b4ff` electric blue accent
- Typography: Inter (body), JetBrains Mono (code/data)
- Card surfaces: `#161b22` with `#30363d` borders

## Pages

- `/` — Homepage driven by repo-backed markdown content
- `/blog` — Article listing sourced from `/blog/*.md`
- `/blog/[slug]` — Individual article pages rendered from markdown + frontmatter
- `/tools` — Research-led tools directory with plain vendor links until affiliate approvals exist
- `/newsletter` — Newsletter signup page using the server-side Beehiiv route

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
pnpm install
cp .env.example .env.local
# Fill in your Beehiiv and site keys
pnpm dev
```

## Scripts

- `pnpm content:manifest` — regenerate `content-manifest.json` from `/blog/*.md`
- `pnpm check:content` — verify frontmatter and manifest stay in sync
- `pnpm typecheck` — run TypeScript without emitting files
- `pnpm test:unit` — run content and API regression tests with Node’s built-in test runner
- `pnpm build` — run the production Next.js build
- `pnpm test:smoke` — boot the production server and verify key routes plus subscribe API scenarios
- `pnpm verify:release` — run the full pre-release verification pipeline

## Repository Structure

```
ai-security-brief/
├── app/                    # Next.js 15 App Router pages
│   ├── blog/              # Blog listing + dynamic article pages
│   ├── api/subscribe/     # Beehiiv signup API route
│   ├── tools/             # Affiliate tools directory
│   └── newsletter/        # Newsletter signup page
├── blog/                  # Markdown article files
├── content-manifest.json  # Generated article inventory
├── components/            # Reusable React components
├── lib/                   # Content loader and site metadata
├── harvests/              # Weekly AI security research harvests
├── drafts/                # Newsletter drafts (pre-publish)
├── logs/                  # Performance tracking logs
├── scripts/               # Content verification + manifest tooling
├── tests/                 # Unit-level regression coverage
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
