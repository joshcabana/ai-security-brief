# Affiliate Status — AI Security Brief

Public operational status for affiliate programme applications.

Updated: 17 March 2026 (late evening)

## Current status

| Programme | Status | Notes |
| --- | --- | --- |
| NordVPN | **Live in production** | Tracked link deployed in 3 articles + `/tools` via PR #24 (`aff_id=143381`) |
| PureVPN | **Live in production** | Tracked link deployed in OpenClaw article + `/tools` via PR #25 (`affiliate_id=49384204`) |
| 1Password / CJ | Signup verification email landed, confirmation still pending | CJ publisher sign-up emails landed on 16 March 2026 and the publisher account still needs email confirmation before advertiser applications can continue |
| Malwarebytes | Partnerize account created, access expired | Partnerize onboarding emails landed on 16 March 2026 and the account username is confirmed, but verification link expired; re-verification needed before Malwarebytes campaign status can be checked. hive0163 article slot reserved. |
| Proton | **Approved** | Initially rejected 16 March 2026; re-evaluation requested same day and approved by Proton Partners Team at 19:06 on 17 March 2026. Proton Partners Program and Marketing Assets links provided. Next: log in, get tracking links, deploy. |
| Surfshark | Rejected | A password reset email landed first on 16 March 2026, but the programme later sent a rejection email with an appeal path via `affiliates@aff.surfshark.com` |
| CyberGhost | Rejected at login gate, support follow-up sent | Kape signup completed, immediate login failed with `Cannot login. Account rejected.`, and a follow-up was sent to `updates@cyberghost.ro` |
| Jasper AI | No public signup path, enquiry sent | Public affiliate host is not usable and an availability enquiry was sent to `affiliates@jasper.ai` |

## Next actions

1. **Proton: log in to Proton Partners Program, get tracking links, and deploy across articles + `/tools` page.** (Newly approved — highest immediate leverage.)
2. Complete the CJ publisher email-confirmation click, then apply to 1Password inside CJ. (1Password is editorial fit for every security article.)
3. Recover Partnerize access (re-verify or re-register `aithreatbrief`), then check live Malwarebytes campaign request status from the Partnerize console.
4. Follow up on PureVPN PAP portal access if no reply by 18 March (PAP credentials are needed for commission reporting, not for link tracking which is already live).
5. Decide whether to request re-evaluation from Surfshark using the now-live site as evidence of topical fit and editorial quality. Hold until week 2 content is published.
6. Watch Gmail for Malwarebytes advertiser decision and any CyberGhost / Jasper replies.

## Security rules

- No personal address, phone, ABN, or contact email is stored in the public repo.
- Private intake data remains only in `~/.ai-security-brief/intake-private.md`.
- Private affiliate URLs remain only in `~/.ai-security-brief/affiliate-links.json` unless a public-safe exception is chosen deliberately.
- The public repo stores only scrubbed placeholders and operational status.
