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
- `/tools` — Research-led tools directory with runtime-resolved affiliate links and clean vendor fallbacks
- `/newsletter` — Newsletter signup page using the server-side Beehiiv route

## Content Pipeline

Automated via 5 scheduled GitHub Actions workflows backed by GitHub Models and curated security feeds:

1. **Weekly Harvest** — Researches the top AI security developments and writes `harvests/harvest-YYYY-MM-DD.md`
2. **Article Factory** — Writes 2 SEO article drafts from that week’s harvest into `/blog`
3. **Newsletter Compiler** — Compiles a review-only newsletter draft in `/drafts`
4. **SEO + Affiliate Optimiser** — Fills missing metadata and injects approved affiliate placeholders on the weekly branch
5. **Performance Logger** — Pulls Beehiiv metrics and upserts `logs/performance-log.md`

Each workflow creates or updates a draft PR on a weekly branch (`codex/content-week-YYYY-WW` or `codex/performance-week-YYYY-WW`) so AI-generated content never lands directly on `main`.

Required GitHub automation secrets:

- `BEEHIIV_API_KEY`
- `BEEHIIV_PUBLICATION_ID`

Optional GitHub automation variable:

- `GITHUB_MODELS_MODEL` — defaults to `openai/gpt-4o-mini`

GitHub Actions uses the built-in `GITHUB_TOKEN` plus `models: read` permission for model inference. See `automation-architecture.md` and `zapier-setup.md` for the current runbook. `skills.md` remains as a legacy reference only.
The article factory and newsletter compiler workflows use `openai/gpt-4.1` by default when no override is set, because long-form drafting needs a stronger model than the weekly harvest ranking and SEO steps.

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

- `pnpm affiliate:dry` — scan blog placeholders against the active affiliate link mapping without writing changes
- `pnpm affiliate:apply` — replace blog placeholders using the active affiliate link mapping
- `pnpm affiliate:dry:drafts` — extend the affiliate placeholder scan to newsletter drafts
- `pnpm content:manifest` — regenerate `content-manifest.json` from `/blog/*.md`
- `pnpm check:content` — verify frontmatter and manifest stay in sync
- `pnpm ops:check-monday-pipeline -- --date YYYY-MM-DD` — confirm the Monday content PR, the prior-Sunday performance PR, and the expected workflow runs
- `pnpm typecheck` — run TypeScript without emitting files
- `pnpm test:unit` — run content and API regression tests with Node’s built-in test runner
- `pnpm build` — run the production Next.js build
- `pnpm test:smoke` — boot the production server and verify key routes plus subscribe API scenarios
- `pnpm verify:release` — run the full pre-release verification pipeline
- `pnpm automation:weekly-harvest` — run the weekly harvest job from a clean local checkout
- `pnpm automation:article-factory` — generate weekly article drafts from the current harvest
- `pnpm automation:newsletter-compiler` — generate the weekly newsletter draft
- `pnpm automation:seo-affiliate` — fill SEO metadata gaps and inject affiliate placeholders
- `pnpm automation:performance-logger` — upsert the weekly Beehiiv metrics log

## Affiliate Ops

- Article markdown can use `[Tool Name]([AFFILIATE:CODE])`; article rendering resolves `AFFILIATE_<CODE>` from environment variables and degrades unresolved links to plain text.
- Set affiliate URLs with environment variables such as `AFFILIATE_NORDVPN` and `AFFILIATE_PUREVPN` in Vercel for preview and production builds.
- Store approved tracked URLs in `~/.ai-security-brief/affiliate-links.json`, or point `AFFILIATE_LINKS_PATH` at another local JSON file.
- The repo copy at `ops/affiliate-links.json` is a scrubbed fallback template only.
- Replacement order is: `AFFILIATE_LINKS_PATH` override, local private file, then repo template.
- `pnpm affiliate:apply` remains available for local or manual replacement flows that need fully expanded URLs on disk.

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
├── scripts/               # Content verification + automation tooling
├── tests/                 # Unit-level regression coverage
├── .github/workflows/     # GitHub Actions CI/CD
├── affiliate-programs.md  # Affiliate program database
├── beehiiv-setup.md      # Newsletter platform setup guide
├── newsletter-issue-001.md # Issue #1 template
├── skills.md             # Legacy Computer skill reference
├── automation-architecture.md # Canonical automation design
├── zapier-setup.md       # GitHub Actions + GitHub Models automation runbook
└── launch-checklist.md   # Step-by-step launch guide
```

## License

© 2026 AI Security Brief. All rights reserved.
