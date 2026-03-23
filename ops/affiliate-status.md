# Affiliate Status — AI Security Brief

Public operational status for affiliate programme applications.

Updated: 18 March 2026

## Current status

| Programme | Status | Notes |
| --- | --- | --- |
| NordVPN | **Live in production** | Tracked link deployed in 4 articles + `/tools` via PR #24 (`aff_id=143381`) |
| PureVPN | **Live in production** | Tracked link deployed in OpenClaw article + `/tools` via PR #25 (`affiliate_id=49384204`) |
| 1Password / CJ | **Application pending advertiser approval** | CJ dashboard verified live on 18 March 2026 (CID 7901635). 1Password (advertiser 5140517) is in Pending Applications. Do not reapply. Email confirmation is no longer an active blocker. |
| Malwarebytes | Partnerize account created, access expired | Partnerize onboarding emails landed on 16 March 2026 and the account username is confirmed, but verification link expired; re-verification needed before Malwarebytes campaign status can be checked. hive0163 article slot reserved. |
| Proton | **Live in production** | CJ links deployed on `/tools` via runtime env vars (`AFFILIATE_PROTON_VPN`, `AFFILIATE_PROTON_MAIL`). CJ advertiser 5227916 provides 29 live links. Direct Proton Partners approval also available as fallback path. |
| Surfshark | Rejected | A password reset email landed first on 16 March 2026, but the programme later sent a rejection email with an appeal path via `affiliates@aff.surfshark.com` |
| CyberGhost | Rejected at login gate, support follow-up sent | Kape signup completed, immediate login failed with `Cannot login. Account rejected.`, and a follow-up was sent to `updates@cyberghost.ro` |
| Jasper AI | No public signup path, enquiry sent | Public affiliate host is not usable and an availability enquiry was sent to `affiliates@jasper.ai` |

## Next actions

1. **1Password: wait for CJ advertiser approval.** Application is already pending (advertiser 5140517). Do not reapply. Post-approval link path saved locally: `/member/7566978/publisher/links/search/#!advertiserIds=5140517`.
2. Recover Partnerize access (re-verify or re-register `aithreatbrief`), then check live Malwarebytes campaign request status from the Partnerize console.
3. Follow up on PureVPN PAP portal access (PAP credentials are needed for commission reporting, not for link tracking which is already live).
4. Decide whether to request re-evaluation from Surfshark using the now-live site as evidence of topical fit and editorial quality. Hold until week 2 content is published.
5. Watch Gmail for 1Password approval, Malwarebytes advertiser decision, and any CyberGhost / Jasper replies.

## Security rules

- No personal address, phone, ABN, or contact email is stored in the public repo.
- Private intake data remains only in `~/.ai-security-brief/intake-private.md`.
- Private affiliate URLs remain only in `~/.ai-security-brief/affiliate-links.json` unless a public-safe exception is chosen deliberately.
- The public repo stores only scrubbed placeholders and operational status.
