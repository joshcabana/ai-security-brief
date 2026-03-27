# Affiliate Status — AI Security Brief

Public operational status for affiliate programme applications.

Updated: 26 March 2026

## Current status

| Programme | Status | Notes |
| --- | --- | --- |
| NordVPN | **Live in production** | Tracked link deployed in 4 articles + `/tools` via PR #24 (`aff_id=143381`) |
| PureVPN | **Live in production** | Tracked link deployed in OpenClaw article + `/tools` via PR #25 (`affiliate_id=49384204`) |
| 1Password / CJ | **Application pending advertiser approval** | CJ dashboard verified live on 18 March 2026 (CID 7901635). 1Password (advertiser 5140517) is in Pending Applications. Do not reapply. Email confirmation is no longer an active blocker. |
| Malwarebytes | Account access confirmed, programme eligibility pending | Partnerize access for `aithreatbrief` was confirmed on 26 March 2026. Awaiting Malwarebytes programme eligibility confirmation from Partnerize support (ticket #674504). hive0163 article slot reserved. |
| Proton | **Live in production** | CJ links deployed on `/tools` via runtime env vars (`AFFILIATE_PROTON_VPN`, `AFFILIATE_PROTON_MAIL`). CJ advertiser 5227916 provides 29 live links. Direct Proton Partners approval also available as fallback path. |
| Surfshark | Rejected, appeal sent | A rejection email landed after signup. An appeal with live-site evidence was sent on 26 March 2026 to `affiliates@surfshark.com`. Awaiting response. |
| CyberGhost | Rejected at login gate, support follow-up sent | Kape signup completed, immediate login failed with `Cannot login. Account rejected.`, and a follow-up was sent to `updates@cyberghost.ro` |
| Jasper AI | No public signup path, enquiry sent | Public affiliate host is not usable and an availability enquiry was sent to `affiliates@jasper.ai` |

## Next actions

1. **1Password: wait for CJ advertiser approval.** Application is already pending (advertiser 5140517). Do not reapply. Post-approval link path saved locally: `/member/7566978/publisher/links/search/#!advertiserIds=5140517`.
2. Monitor Partnerize ticket `#674504` and confirm Malwarebytes programme eligibility once support responds.
3. Follow up on PureVPN PAP portal access (PAP credentials are needed for commission reporting, not for link tracking which is already live).
4. Wait for the Surfshark appeal response before deciding whether to reapply or de-prioritise the programme.
5. Record a go / no-go decision for CyberGhost and Jasper if no useful reply lands after the current follow-up window.
6. Watch Gmail for 1Password approval, Malwarebytes eligibility confirmation, Surfshark appeal updates, and any CyberGhost / Jasper replies.

## Security rules

- No personal address, phone, ABN, or contact email is stored in the public repo.
- Private intake data remains only in `~/.ai-security-brief/intake-private.md`.
- Private affiliate URLs remain only in `~/.ai-security-brief/affiliate-links.json` unless a public-safe exception is chosen deliberately.
- The public repo stores only scrubbed placeholders and operational status.
