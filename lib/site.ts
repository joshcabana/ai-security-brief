const fallbackSiteName = 'AI Security Brief';
const fallbackSiteUrl = 'http://localhost:3000';

export const siteName = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || fallbackSiteName;
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackSiteUrl;
export const siteDescription =
  'Independent intelligence on AI-powered cyber threats, privacy defence strategies, and security tooling for technology professionals.';

export function getSiteUrl(): URL {
  return new URL(siteUrl);
}
