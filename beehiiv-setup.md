# Beehiiv Setup Guide — AI Security Brief Newsletter

## Step 1: Create Beehiiv Account

1. Go to [beehiiv.com](https://www.beehiiv.com/) and sign up for a free account (or Scale plan for full features)
2. Choose publication name: **AI Security Brief**
3. Set publication URL: `aisecuritybrief.beehiiv.com` (or custom domain later)

## Step 2: Configure Publication Settings

### Branding
- **Publication Name**: AI Security Brief
- **Tagline**: Intelligence on AI-Powered Threats & Privacy Defence
- **Logo**: Upload the shield logo SVG from the website `/public/` folder
- **Colors**: 
  - Primary: `#00b4ff` (electric blue)
  - Background: `#0d1117` (dark)
  - Text: `#e6edf3` (light gray)
  - Card background: `#161b22`

### Sender Settings
- **From Name**: AI Security Brief
- **From Email**: `newsletter@yourdomain.com` (set up after domain purchase)
- **Reply-to**: `editor@yourdomain.com`

## Step 3: Configure Email Template

### Header
- Shield logo (centered or left-aligned)
- Publication name in Inter Bold, #ffffff
- Tagline in Inter Regular, #8b949e

### Body Template Structure
```
[LOGO]
[PUBLICATION NAME]

THE BRIEF — [DATE]

[INTRO PARAGRAPH]

---

📡 SIGNAL 1: [HEADLINE]
[2-3 sentence summary]
[Read more →]

---

📡 SIGNAL 2: [HEADLINE]
[2-3 sentence summary]
[Read more →]

---

📡 SIGNAL 3: [HEADLINE]
[2-3 sentence summary]
[Read more →]

---

🛡️ TOOL OF THE WEEK
[Tool name + description + affiliate link]

---

[NEWSLETTER CTA / SHARE PROMPT]
[FOOTER WITH UNSUBSCRIBE]
```

### Footer
- "You're receiving this because you subscribed to AI Security Brief"
- Unsubscribe link (Beehiiv handles this automatically)
- Social links
- © 2026 AI Security Brief

## Step 4: Connect the Site Signup Route

1. Generate a Beehiiv API key with subscriber write access
2. Add these values to your local or hosted runtime environment:
   - `BEEHIIV_API_KEY`
   - `BEEHIIV_PUBLICATION_ID`
3. Keep the site form pointing at `/api/subscribe`
4. Submit a test signup from `/newsletter` and verify Beehiiv records the subscriber
5. Confirm the form shows a real success or failure message instead of a silent fallback

Optional: create an embedded Beehiiv form later if you want a hosted fallback, but the site no longer depends on iframe embed code.

## Step 5: Enable API Access

1. Go to **Settings** → **Integrations** → **API**
2. Generate API key
3. Copy API key to your `.env.local` or hosted environment as `BEEHIIV_API_KEY`
4. Note your Publication ID for the Performance Logger skill

### API Endpoints You'll Use
- `GET /v2/publications/{pub_id}/subscriptions` — subscriber count
- `GET /v2/publications/{pub_id}/stats` — open rate, click rate
- `POST /v2/publications/{pub_id}/subscriptions` — add subscriber

## Step 6: Configure Automations

### Welcome Sequence
1. **Email 1** (Immediate): Welcome + what to expect + link to best articles
2. **Email 2** (Day 3): "The AI Threat Landscape in 2026" — curated from your top article
3. **Email 3** (Day 7): "Your Security Stack" — tool recommendations with affiliate links

### Referral Program (Optional)
- Enable Beehiiv's built-in referral program
- Milestones: 3 referrals → exclusive report, 10 referrals → tool discount code

## Step 7: Publish Issue #1

1. Use the content from `newsletter-issue-001.md` in this repo
2. Preview → Test send to yourself
3. Schedule or publish
4. Verify tracking is working in Beehiiv analytics

## API Key Storage

Add to your `.env.local` file or hosting provider environment:
```
BEEHIIV_API_KEY=your_api_key_here
BEEHIIV_PUBLICATION_ID=your_pub_id_here
```

These are used by the site subscribe route and by Skill 5 (Performance Logger) to pull newsletter stats automatically. Do not commit them to Git.
