# AI Security Brief

A Next.js 15 publication site for AI security intelligence, built for weekly automated content delivery via Perplexity Computer Skills.

## Overview

AI Security Brief is an independent publication covering AI-powered cyber threats, privacy defence strategies, and security tooling for technology professionals. Content is generated weekly via Perplexity Computer Skills and published automatically.

## Tech Stack

- **Next.js 15** (App Router, static export)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **pnpm** (package manager)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── blog/               # Blog listing and article pages
│   │   └── [slug]/         # Dynamic article routes
│   ├── tools/              # AI security tools directory
│   ├── newsletter/         # Newsletter subscription page
│   └── api/subscribe/      # Newsletter subscription API
├── blog/                   # Markdown article files
├── components/             # Shared React components
├── lib/                    # Utility functions and site config
├── scripts/                # Build and content scripts
├── tests/                  # Unit tests
└── skills.md               # Perplexity Computer Skills definitions
```

## Getting Started

```bash
pnpm install
pnpm dev
```

## Content Pipeline

Articles are Markdown files in `/blog` with YAML frontmatter. The content pipeline is:

1. **Weekly Harvest** — Perplexity Computer Skill researches top AI security developments
2. **Article Factory** — Converts research into publication-ready Markdown articles
3. **Newsletter Compiler** — Drafts weekly email for Beehiiv distribution
4. **SEO + Affiliate Optimizer** — Adds schema markup, internal links, affiliate links
5. **Performance Logger** — Tracks weekly metrics and optimisation opportunities

See `skills.md` for full skill definitions and `zapier-setup.md` for automation configuration.

## Deployment

The site deploys automatically to Vercel on push to `main` via GitHub Actions. See `.github/workflows/deploy.yml`.

## Newsletter

Newsletter subscriptions are handled via [Beehiiv](https://beehiiv.com). See `beehiiv-setup.md` for configuration.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_NAME` | Site display name (default: AI Security Brief) |
| `NEXT_PUBLIC_SITE_URL` | Production URL (default: http://localhost:3000) |
| `BEEHIIV_PUBLICATION_ID` | Beehiiv publication identifier |
| `BEEHIIV_API_KEY` | Beehiiv API key for subscription endpoint |
