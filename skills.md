# Perplexity Computer Skills — AI Security Brief

> 5 reusable skills for the AI Security Brief content pipeline.  
> Copy each skill's text block and paste it into **Computer → Skills → Create Skill**.

---

## SKILL 1 — Weekly AI Security Harvest

**Name:** `weekly-ai-security-harvest`

**Description:** Deep research the top 5-7 AI security and privacy developments from the past 7 days. Structure findings as headline, summary, key implication, and source URL. Save output as a markdown harvest file to the GitHub repo ai-security-brief /harvests/ folder.

**Instructions:**

```
---
name: weekly-ai-security-harvest
description: Deep research the top 5-7 AI security and privacy developments from the past 7 days. Structure findings as headline, summary, key implication, and source URL. Save output as a markdown harvest file to the GitHub repo ai-security-brief /harvests/ folder.
metadata:
  author: ai-security-brief
  version: '1.0'
---

# Weekly AI Security Harvest

## When to Use This Skill

Use this skill every Monday (or on manual trigger) to gather the latest AI security and privacy intelligence for the week.

## Instructions

1. **Research Phase**: Use search_web to find the top 5-7 AI security and privacy developments from the past 7 days. Focus on:
   - AI-powered cyberattacks (new techniques, incidents, threat reports)
   - AI model vulnerabilities (prompt injection, jailbreaks, data poisoning)
   - Privacy regulation updates (global, with emphasis on Australia, EU, US)
   - AI security tools and defences (new releases, updates, research)
   - Enterprise AI security incidents (breaches, exploits, advisories)
   - Agentic AI security developments (frameworks, standards, vulnerabilities)

2. **Structure each finding as:**
   ```
   ### [NUMBER]. [HEADLINE]
   **Summary:** [2-sentence summary of the development]
   **Key Implication:** [1 sentence on what this means for defenders or organisations]
   **Category:** [AI Threats | Privacy | Endpoint Security | Zero Trust | Deepfakes | Ransomware | Vulnerability]
   **Source:** [URL]
   ```

3. **Save the output** as a markdown file:
   - Filename: `harvest-[YYYY-MM-DD].md` (today's date)
   - Location: `/harvests/` folder in the `ai-security-brief` GitHub repository
   - Include a header: `# AI Security Harvest — [DATE]`

## Output Format

```markdown
# AI Security Harvest — [DATE]

_Generated: [ISO datetime]_
_Coverage period: [7-day range]_

---

### 1. [Headline]
**Summary:** ...
**Key Implication:** ...
**Category:** ...
**Source:** ...

[Continue for 5-7 findings]
```
```

---

## SKILL 2 — Article Factory

**Name:** `article-factory`

**Description:** Convert the latest harvest file into 2 x 950-word SEO articles with YAML frontmatter, 4 real citations, Key Takeaways, and a newsletter CTA. Push articles to the /blog/ folder on GitHub.

**Instructions:**

```
---
name: article-factory
description: Convert the latest harvest file into 2 x 950-word SEO articles with YAML frontmatter, 4 real citations, Key Takeaways, and a newsletter CTA. Push articles to the /blog/ folder on GitHub.
metadata:
  author: ai-security-brief
  version: '1.0'
---

# Article Factory

## When to Use This Skill

Use this skill every Monday after the harvest skill completes, to convert research findings into publication-ready articles.

## Instructions

1. **Read the latest harvest file** from `/harvests/` in the `ai-security-brief` GitHub repository.
   - Find the most recently dated file (e.g., `harvest-2026-03-16.md`)
   - Read its full content

2. **Select the top 2 findings** with the highest news value and audience relevance.

3. **For each selected finding, write a 950-word SEO article** following this exact structure:

### Article Structure

```markdown
---
title: "[Compelling, SEO-optimised headline]"
slug: "[url-friendly-slug]"
date: "[YYYY-MM-DD]"
author: "AI Security Brief"
excerpt: "[2-3 sentence compelling excerpt for previews and meta descriptions]"
category: "[AI Threats | Privacy | Endpoint Security | Zero Trust]"
featured: false
meta_title: "[SEO meta title, ~60 chars]"
meta_description: "[SEO meta description, ~160 chars]"
keywords:
  - [primary keyword]
  - [secondary keyword]
  - [long-tail keyword 1]
  - [long-tail keyword 2]
  - [long-tail keyword 3]
read_time: "[N] min"
---

# [Article Title]

[Opening paragraph: hook + context + stakes]

## [Section 1 Heading]

[Body content with specific facts, statistics, and analysis]

## [Section 2 Heading]

[Body content]

## [Section 3 Heading]

[Body content]

## [Final Section: Implications/What to Do]

[Practical guidance or forward-looking analysis]

---

## Key Takeaways

- [Bullet 1: Most important fact or finding]
- [Bullet 2: Key implication]
- [Bullet 3: Practical action or recommendation]
- [Bullet 4: Statistical highlight]
- [Bullet 5: Forward-looking point]

---

## References

1. [Source Name] — *[Article/Report Title]*: [Brief description]. [URL]
2. [Source Name] — *[Article/Report Title]*: [Brief description]. [URL]
3. [Source Name] — *[Article/Report Title]*: [Brief description]. [URL]
4. [Source Name] — *[Article/Report Title]*: [Brief description]. [URL]

---

**Stay ahead of AI security threats.** Subscribe to the AI Security Brief newsletter for weekly intelligence. [Subscribe now →](/newsletter)
```

4. **Requirements for each article:**
   - Exactly 4 real, verified citations with working URLs
   - Minimum 3 specific statistics with attribution
   - Keyword density: primary keyword appears 3-5 times naturally
   - No placeholder text — every field must be populated
   - `read_time` calculated at ~200 words/minute

5. **Save each article** to `/blog/[slug].md` in the `ai-security-brief` GitHub repository.

6. **Update content-manifest.json** after pushing both articles.
```

---

## SKILL 3 — Newsletter Compiler

**Name:** `newsletter-compiler`

**Description:** Compile a weekly newsletter draft from the latest harvest and 2 newest blog articles. Format for Beehiiv. Save to /drafts/ for human review. Do NOT publish.

**Instructions:**

```
---
name: newsletter-compiler
description: Compile a weekly newsletter draft from the latest harvest and 2 newest blog articles. Format for Beehiiv. Save to /drafts/ for human review. Do NOT publish.
metadata:
  author: ai-security-brief
  version: '1.0'
---

# Newsletter Compiler

## When to Use This Skill

Every Monday after the article factory has run (typically 1:00 PM AEDT).

## Instructions

1. **Read source materials:**
   - Latest harvest file from `/harvests/`
   - The 2 newest articles from `/blog/`

2. **Compile a newsletter draft** using this exact structure:

```markdown
# Newsletter Draft — [DATE]

_Status: DRAFT — awaiting human review_
_Do not publish until approved_

---

## Subject Line Options

**A:** [Option A: direct, informative]
**B:** [Option B: curiosity-driven, slightly provocative]

**Preview Text:** [90-100 chars for email client preview]

---

## Issue Body

### This Week in AI Security

[2-paragraph editorial intro summarising the week's most important development]

---

### Story 1: [Headline]

[3-4 sentence summary with the key fact, implication, and a link to the full article]

**Read the full briefing →** [Link]

---

### Story 2: [Headline]

[3-4 sentence summary]

**Read the full briefing →** [Link]

---

### Story 3: [Headline from harvest, not yet a full article]

[2-3 sentence summary from harvest findings]

**Source →** [Original source URL]

---

### Tool of the Week

**[Tool Name]**

[2-sentence description of why this tool is relevant this week]

[AFFILIATE:TOOLNAME] — _[Price point or offer]_

---

### Quick Intel Roundup

- [Bullet 1: Short news item]
- [Bullet 2: Short news item]
- [Bullet 3: Short news item]

---

[Sign-off]

**AI Security Brief**
[Unsubscribe] | [View in browser]
```

3. **Save the draft** as `/drafts/newsletter-[YYYY-MM-DD].md` in the GitHub repository.
4. **Do not publish** — this file is for human review only.
```

---

## SKILL 4 — SEO + Affiliate Optimizer

**Name:** `seo-affiliate-optimizer`

**Description:** Scan all /blog/ markdown files for missing SEO metadata and affiliate link opportunities. Update frontmatter and inject affiliate placeholders where tools are mentioned. Commit changes.

**Instructions:**

```
---
name: seo-affiliate-optimizer
description: Scan all /blog/ markdown files for missing SEO metadata and affiliate link opportunities. Update frontmatter and inject affiliate placeholders where tools are mentioned. Commit changes.
metadata:
  author: ai-security-brief
  version: '1.0'
---

# SEO + Affiliate Optimizer

## When to Use This Skill

Every Monday at 3:00 PM AEDT, after the article factory has published new articles.

## Instructions

### Part 1: SEO Metadata Audit

1. Read all `.md` files in `/blog/` from the `ai-security-brief` GitHub repo.

2. For each file, check that the YAML frontmatter contains:
   - `meta_title` (50–60 characters, includes primary keyword)
   - `meta_description` (140–160 characters, compelling, includes keyword)
   - `keywords` (array of 3–5 specific keyword phrases)

3. If any field is missing or empty, generate appropriate values:
   - `meta_title`: Article title + primary keyword if not already present, truncated to 60 chars
   - `meta_description`: 2-sentence description emphasising the article's key insight and value to the reader
   - `keywords`: Extract from article content — include the primary topic, specific threat names, and 2 long-tail phrases

4. Update the files with the generated metadata.

### Part 2: Affiliate Link Injection

5. For each article, scan the body text for mentions of these affiliate tools:
   - NordVPN, ProtonVPN, Proton VPN, Proton Mail, Proton
   - Surfshark
   - 1Password, OnePassword
   - Malwarebytes
   - PureVPN
   - CyberGhost
   - Jasper, Jasper AI
   - Bitwarden

6. If a tool is mentioned **without an existing affiliate link**, add an inline link using the placeholder format:
   `[AFFILIATE:TOOLNAME]` — for example, `[NordVPN [AFFILIATE:NORDVPN]]()`

7. Do not modify existing links. Do not add more than 2 affiliate link placeholders per article.

### Part 3: Commit

8. Commit all modified files with message: `seo-affiliate: update metadata and inject affiliate placeholders [DATE]`

## Constraints

- Preserve all existing frontmatter fields exactly — only add missing fields
- Do not change article titles, slugs, or dates
- Affiliate placeholders are for manual replacement later — do not insert real URLs
- Maximum 2 affiliate placeholders per article
```

---

## SKILL 5 — Performance Logger

**Name:** `performance-logger`

**Description:** Pull Beehiiv stats, check key metrics against targets, and append a row to the performance log in /logs/. Flag if open rate is below 35%.

**Instructions:**

```
---
name: performance-logger
description: Pull Beehiiv stats, check key metrics against targets, and append a row to the performance log in /logs/. Flag if open rate is below 35%.
metadata:
  author: ai-security-brief
  version: '1.0'
---

# Performance Logger

## When to Use This Skill

Every Sunday at 8:00 PM AEDT, to close out the week's performance data.

## Instructions

1. **Pull Beehiiv statistics** via the Beehiiv API:
   - Endpoint: `GET https://api.beehiiv.com/v2/publications/{BEEHIIV_PUBLICATION_ID}/subscribers`
   - Auth: `Bearer {BEEHIIV_API_KEY}` (from environment variables — never hardcode)
   - Retrieve: total subscribers, new subscribers this week

2. **Pull newsletter performance** for the most recent issue:
   - Endpoint: `GET https://api.beehiiv.com/v2/publications/{BEEHIIV_PUBLICATION_ID}/posts`
   - Get the most recent published post's stats: open rate, click rate, top clicked link

3. **Check metrics against targets:**
   - Open rate target: ≥35% (industry benchmark for niche B2B)
   - Click rate target: ≥5%
   - If open rate < 35%: add a `⚠️ WARNING` flag with suggestions

4. **Format a log row:**

```markdown
| [YYYY-MM-DD] | [Total Subscribers] | [New This Week] | [Open Rate] | [Click Rate] | [Top Link] | [Notes] |
```

5. **Read the existing log** from `/logs/performance-log.md` in the `ai-security-brief` GitHub repo. If the file doesn't exist, create it with the header row.

6. **Append the new row** to the log table.

7. **Commit** with message: `performance-log: weekly update [DATE]`

## Log Format

The `/logs/performance-log.md` file should maintain this structure:

```markdown
# Performance Log — AI Security Brief

| Date | Total Subs | New This Week | Open Rate | Click Rate | Top Link | Notes |
|------|-----------|---------------|-----------|------------|----------|-------|
| [rows appended weekly] |
```

## Flag Conditions

- Open rate < 35%: `⚠️ Below target. Consider: stronger subject line A/B testing, send-time optimisation, list hygiene check.`
- Click rate < 5%: `⚠️ Low clicks. Consider: more prominent CTAs, better tool-of-week relevance, shorter email body.`
- New subscribers < 10: `⚠️ Slow growth. Consider: cross-promotion, content SEO audit, social sharing prompts.`
```
