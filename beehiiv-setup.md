# Beehiiv Setup Guide — AI Security Brief

> Configure Beehiiv as the newsletter platform for AI Security Brief. This guide covers publication creation, API key generation, environment variable configuration, and subscriber list management.

## Step 1: Create a Beehiiv Account

1. Go to [beehiiv.com](https://beehiiv.com) and click **Get Started Free**
2. Enter your email and create a password
3. Verify your email address
4. Complete the onboarding: choose **Newsletter** as your publication type

## Step 2: Create Your Publication

1. Publication name: **AI Security Brief**
2. Description: *Independent intelligence on AI-powered cyber threats, privacy defence strategies, and security tooling for technology professionals.*
3. Category: **Technology / Cybersecurity**
4. Posting frequency: **Weekly**
5. Click **Create Publication**

## Step 3: Get Your Publication ID

1. Go to **Settings → Publication**
2. Scroll to **Publication ID** — it looks like `pub_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
3. Copy this value — you will need it for `BEEHIIV_PUBLICATION_ID`

## Step 4: Generate an API Key

1. Go to **Settings → Integrations → API**
2. Click **New API Key**
3. Name it: `AI Security Brief — Production`
4. Permissions required:
   - **Subscriptions: Write** (to create new subscribers)
5. Click **Generate**
6. Copy the key immediately — it will not be shown again
7. This value goes into `BEEHIIV_API_KEY`

## Step 5: Configure Environment Variables

### Local Development

Create `.env.local` in the project root:

```env
BEEHIIV_PUBLICATION_ID=pub_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
BEEHIIV_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=AI Security Brief
```

### Vercel Production

1. Go to your Vercel project dashboard
2. **Settings → Environment Variables**
3. Add each variable:
   - `BEEHIIV_PUBLICATION_ID` — your publication ID
   - `BEEHIIV_API_KEY` — your API key
   - `NEXT_PUBLIC_SITE_URL` — your production domain (e.g. `https://aisecuritybrief.com`)
   - `NEXT_PUBLIC_SITE_NAME` — `AI Security Brief`
4. Set environment to **Production** (and optionally Preview)
5. Click **Save**

## Step 6: Test the Integration

### Using cURL

```bash
curl -X POST https://your-site.vercel.app/api/subscribe \
  -H 'Content-Type: application/json' \
  -d '{"email": "test@example.com"}'
```

Expected response:
```json
{"success": true}
```

### Using the Site

1. Visit your deployed site
2. Enter a test email in the newsletter form
3. Click **Subscribe**
4. Check Beehiiv dashboard → **Subscribers** to confirm the subscription was created

## Subscriber Management

### Viewing Subscribers

- Dashboard → **Audience → Subscribers**
- Filter by status: Active, Inactive, Unsubscribed
- Export CSV for backup

### Sending Your First Newsletter

1. Dashboard → **Posts → New Post**
2. Write your newsletter content
3. Schedule or send immediately
4. Monitor opens/clicks in **Analytics**

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `500 Server configuration error` | Missing env vars | Check Vercel env vars are set |
| `502 Subscription failed` | Invalid API key or publication ID | Regenerate API key, verify publication ID |
| `400 Invalid email address` | Malformed email | Validate client-side before submitting |
| Subscriber not appearing | Beehiiv processing delay | Wait 60 seconds, refresh dashboard |
