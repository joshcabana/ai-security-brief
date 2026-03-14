import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/subscribe
 *
 * Accepts { email: string } and forwards to Beehiiv.
 * Returns truthful error states:
 *   400 — missing or invalid email
 *   500 — missing server-side env vars
 *   502 — Beehiiv API returned a non-2xx or network failure
 *   200 — success
 */
export async function POST(request: NextRequest) {
  // ── Parse body ──────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const email =
    typeof body === 'object' && body !== null && 'email' in body
      ? String((body as Record<string, unknown>).email).trim().toLowerCase()
      : '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
  }

  // ── Check env ───────────────────────────────────────────────────────
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) {
    console.error('[subscribe] BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID is not set');
    return NextResponse.json(
      { error: 'Newsletter service is not configured. Please try again later.' },
      { status: 500 },
    );
  }

  // ── Forward to Beehiiv ─────────────────────────────────────────────
  const url = `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: 'website',
      }),
    });
  } catch (err) {
    console.error('[subscribe] Beehiiv network error:', err);
    return NextResponse.json(
      { error: 'Unable to reach newsletter service. Please try again later.' },
      { status: 502 },
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '(no body)');
    console.error(`[subscribe] Beehiiv returned ${res.status}: ${text}`);
    return NextResponse.json(
      { error: 'Newsletter service returned an error. Please try again later.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
