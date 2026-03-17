import { NextResponse } from 'next/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_SOURCE = 'unknown';

function getBeehiivConfig() {
  const apiKey = process.env.BEEHIIV_API_KEY?.trim();
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID?.trim();
  const apiBaseUrl = (process.env.BEEHIIV_API_BASE_URL?.trim() || 'https://api.beehiiv.com').replace(/\/$/, '');

  return {
    apiKey,
    publicationId,
    apiBaseUrl,
    configured: Boolean(apiKey && publicationId),
  };
}

function normalizeSource(source: unknown): string {
  if (typeof source !== 'string') {
    return DEFAULT_SOURCE;
  }

  const normalizedSource = source.trim().toLowerCase();

  if (!normalizedSource) {
    return DEFAULT_SOURCE;
  }

  return normalizedSource.replace(/\s+/g, '-');
}

export async function POST(request: Request) {
  const { apiKey, publicationId, apiBaseUrl, configured } = getBeehiivConfig();

  if (!configured || !apiKey || !publicationId) {
    return NextResponse.json(
      {
        ok: false,
        message:
          'Newsletter signup is not configured yet. Add BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID first.',
      },
      { status: 503 },
    );
  }

  let payload: { email?: string; source?: string } | null = null;

  try {
    payload = (await request.json()) as { email?: string; source?: string };
  } catch {
    return NextResponse.json(
      { ok: false, message: 'The signup request body was invalid JSON.' },
      { status: 400 },
    );
  }

  const email = payload?.email?.trim().toLowerCase();
  const source = normalizeSource(payload?.source);

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { ok: false, message: 'Enter a valid email address to subscribe.' },
      { status: 400 },
    );
  }

  const referringSite = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const upstreamBody = {
    email,
    reactivate_existing: false,
    send_welcome_email: true,
    utm_source: 'website',
    utm_medium: 'organic',
    utm_campaign: 'site-signup',
    utm_content: source,
    ...(referringSite ? { referring_site: referringSite } : {}),
  };

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(`${apiBaseUrl}/v2/publications/${publicationId}/subscriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(upstreamBody),
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: 'Beehiiv could not be reached. Check network access and publication settings, then try again.',
      },
      { status: 502 },
    );
  }

  let upstreamPayload: unknown = null;

  try {
    upstreamPayload = await upstreamResponse.json();
  } catch {
    upstreamPayload = null;
  }

  if (!upstreamResponse.ok) {
    const upstreamMessage =
      typeof upstreamPayload === 'object' &&
      upstreamPayload !== null &&
      'errors' in upstreamPayload &&
      Array.isArray((upstreamPayload as { errors?: Array<{ message?: string }> }).errors)
        ? (upstreamPayload as { errors: Array<{ message?: string }> }).errors
            .map((error) => error.message)
            .filter(Boolean)
            .join(' ')
        : '';

    return NextResponse.json(
      {
        ok: false,
        message:
          upstreamMessage ||
          'Beehiiv rejected the signup request. Double-check the publication settings and try again.',
      },
      { status: upstreamResponse.status },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      message: "You're in. Check your inbox for Beehiiv's confirmation email.",
    },
    { status: 200 },
  );
}
