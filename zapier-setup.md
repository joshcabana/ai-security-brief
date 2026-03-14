# Zapier Automation Setup Guide — AI Security Brief

> This guide configures 5 Zaps to trigger Perplexity Computer Skills on a weekly schedule, automating the entire content pipeline.

## Prerequisites

- Zapier account (Free tier supports 5 Zaps with limited tasks; **Starter plan recommended** for reliable scheduling)
- Perplexity Computer API access and API key
- All 5 Computer Skills activated (see `skills.md` for activation sequence)

## Architecture Overview

```
MONDAY PIPELINE (AEDT):
  5:00 AM  → Zap 1 → Skill 1: Weekly Harvest
  9:00 AM  → Zap 2 → Skill 2: Article Factory
  1:00 PM  → Zap 3 → Skill 3: Newsletter Compiler
  3:00 PM  → Zap 4 → Skill 4: SEO + Affiliate Optimizer

SUNDAY:
  8:00 PM  → Zap 5 → Skill 5: Performance Logger
```

Each Zap fires in sequence with enough buffer time (4 hours between harvest → articles, 4 hours between articles → newsletter) to ensure the previous skill has completed before the next one starts.

---

## Zap 1 — Weekly AI Security Harvest

**Schedule:** Every Monday at 5:00 AM AEDT

### Step 1: Schedule by Zapier

| Setting | Value |
|---------|-------|
| Trigger | Schedule by Zapier |
| Frequency | Every Week |
| Day of Week | Monday |
| Time of Day | 5:00 AM |
| Timezone | Australia/Canberra |

### Step 2: Webhooks by Zapier (POST)

| Setting | Value |
|---------|-------|
| Action | POST |
| URL | `https://api.perplexity.ai/computer/v1/tasks` |
| Payload Type | JSON |
| Headers | `Authorization: Bearer [INSERT COMPUTER API KEY]` |
| Headers | `Content-Type: application/json` |
| Body | See below |

**Request Body:**
```json
{
  "task": "Use the 'weekly-ai-security-harvest' skill. Deep research the top 5-7 AI security and privacy developments from the past 7 days. Structure each finding with headline, 2-sentence summary, key implication, source URL, and category. Save as harvest-[TODAY'S DATE].md to the GitHub repo ai-security-brief in the /harvests/ folder.",
  "skill": "weekly-ai-security-harvest"
}
```

---

## Zap 2 — Article Factory

**Schedule:** Every Monday at 9:00 AM AEDT

### Step 1: Schedule by Zapier

| Setting | Value |
|---------|-------|
| Trigger | Schedule by Zapier |
| Frequency | Every Week |
| Day of Week | Monday |
| Time of Day | 9:00 AM |
| Timezone | Australia/Canberra |

### Step 2: Webhooks by Zapier (POST)

| Setting | Value |
|---------|-------|
| Action | POST |
| URL | `https://api.perplexity.ai/computer/v1/tasks` |
| Payload Type | JSON |
| Headers | `Authorization: Bearer [INSERT COMPUTER API KEY]` |
| Headers | `Content-Type: application/json` |
| Body | See below |

**Request Body:**
```json
{
  "task": "Use the 'article-factory' skill. Read the latest harvest file from /harvests/ in the ai-security-brief GitHub repo. Write 2 x 950-word SEO articles on the top 2 findings. Format as markdown with YAML frontmatter (title, slug, date, author, excerpt, meta_title, meta_description, keywords, read_time), 4 real verified citations, Key Takeaways, and newsletter CTA. Push both articles to /blog/ in the GitHub repo.",
  "skill": "article-factory"
}
```

---

## Zap 3 — Newsletter Compiler

**Schedule:** Every Monday at 1:00 PM AEDT

### Step 1: Schedule by Zapier

| Setting | Value |
|---------|-------|
| Trigger | Schedule by Zapier |
| Frequency | Every Week |
| Day of Week | Monday |
| Time of Day | 1:00 PM |
| Timezone | Australia/Canberra |

### Step 2: Webhooks by Zapier (POST)

| Setting | Value |
|---------|-------|
| Action | POST |
| URL | `https://api.perplexity.ai/computer/v1/tasks` |
| Payload Type | JSON |
| Headers | `Authorization: Bearer [INSERT COMPUTER API KEY]` |
| Headers | `Content-Type: application/json` |
| Body | See below |

**Request Body:**
```json
{
  "task": "Use the 'newsletter-compiler' skill. Read the latest /harvests/ file and the 2 newest /blog/ posts from the ai-security-brief GitHub repo. Read newsletter-issue-001.md as a template and affiliate-programs.md for affiliate placeholders. Compile a newsletter draft with 2 A/B subject lines, preview text, 3 story summaries, and a Tool of the Week with affiliate placeholder. Save as /drafts/newsletter-[TODAY'S DATE].md in the GitHub repo. Do NOT publish.",
  "skill": "newsletter-compiler"
}
```

---

## Zap 4 — SEO + Affiliate Optimizer

**Schedule:** Every Monday at 3:00 PM AEDT

### Step 1: Schedule by Zapier

| Setting | Value |
|---------|-------|
| Trigger | Schedule by Zapier |
| Frequency | Every Week |
| Day of Week | Monday |
| Time of Day | 3:00 PM |
| Timezone | Australia/Canberra |

### Step 2: Webhooks by Zapier (POST)

| Setting | Value |
|---------|-------|
| Action | POST |
| URL | `https://api.perplexity.ai/computer/v1/tasks` |
| Payload Type | JSON |
| Headers | `Authorization: Bearer [INSERT COMPUTER API KEY]` |
| Headers | `Content-Type: application/json` |
| Body | See below |

**Request Body:**
```json
{
  "task": "Use the 'seo-affiliate-optimizer' skill. Scan all /blog/ markdown files in the ai-security-brief GitHub repo. For any files missing meta_title, meta_description, or keywords in their YAML frontmatter, generate and add these fields. Then scan article bodies for mentions of NordVPN, Proton, Surfshark, 1Password, Malwarebytes, PureVPN, CyberGhost, or Jasper — and inject affiliate link placeholders from affiliate-programs.md where tools are mentioned but not yet linked. Commit all changes.",
  "skill": "seo-affiliate-optimizer"
}
```

---

## Zap 5 — Performance Logger

**Schedule:** Every Sunday at 8:00 PM AEDT

### Step 1: Schedule by Zapier

| Setting | Value |
|---------|-------|
| Trigger | Schedule by Zapier |
| Frequency | Every Week |
| Day of Week | Sunday |
| Time of Day | 8:00 PM |
| Timezone | Australia/Canberra |

### Step 2: Webhooks by Zapier (POST)

| Setting | Value |
|---------|-------|
| Action | POST |
| URL | `https://api.perplexity.ai/computer/v1/tasks` |
| Payload Type | JSON |
| Headers | `Authorization: Bearer [INSERT COMPUTER API KEY]` |
| Headers | `Content-Type: application/json` |
| Body | See below |

**Request Body:**
```json
{
  "task": "Use the 'performance-logger' skill. Pull Beehiiv API stats using runtime environment variables or a secure secret store for BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID. Get subscriber count, open rate, click rate, and top clicked link. Append a new row to /logs/performance-log.md in the repo. If open rate is below 35%, flag it with a warning and suggest improvements. Commit the updated log.",
  "skill": "performance-logger"
}
```

---

## Setup Checklist

- [ ] Create Zapier account (or upgrade to Starter plan)
- [ ] Obtain Perplexity Computer API key
- [ ] Create Zap 1 (Weekly Harvest — Monday 5:00 AM AEDT)
- [ ] Create Zap 2 (Article Factory — Monday 9:00 AM AEDT)
- [ ] Create Zap 3 (Newsletter Compiler — Monday 1:00 PM AEDT)
- [ ] Create Zap 4 (SEO Optimizer — Monday 3:00 PM AEDT)
- [ ] Create Zap 5 (Performance Logger — Sunday 8:00 PM AEDT)
- [ ] Replace `[INSERT COMPUTER API KEY]` in all 5 Zaps
- [ ] Test each Zap manually using "Test step" in Zapier
- [ ] Turn on all 5 Zaps
- [ ] Verify first Monday run completes the full pipeline

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Zap doesn't fire | Check timezone is set to Australia/Canberra, not UTC |
| Computer API returns 401 | Verify API key is correct and has not expired |
| Harvest file not found by Article Factory | Increase buffer time between Zaps (try 6 hours instead of 4) |
| Articles not appearing in repo | Check GitHub MCP connection in Computer is active |
| Performance Logger can't access Beehiiv secrets | Provide BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID through a secure environment or secret store; do not commit them to Git |

## Cost Estimate

Each Zap execution = 1 Zapier task. With 5 Zaps running weekly:
- **5 tasks/week** = ~20 tasks/month
- Zapier Free plan: 100 tasks/month (sufficient)
- Perplexity Computer: Credits consumed per skill execution (varies by research depth)

## API Endpoint Note

The URL `https://api.perplexity.ai/computer/v1/tasks` is a placeholder. When the Perplexity Computer API becomes available:
1. Replace with the actual endpoint URL
2. Update the request body format to match the API specification
3. You may also trigger skills via the Computer chat interface manually if the API is not yet available

Alternative trigger method: Use Zapier's Email trigger to send a pre-formatted email to your Perplexity account, which can then be processed by Computer. This works as a bridge until direct API access is available.
