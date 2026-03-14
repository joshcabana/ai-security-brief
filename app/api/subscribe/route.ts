import { NextResponse } from 'next/server';

const BEEHIIV_API_URL = 'https://api.beehiiv.com/v2';
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;
const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.email !== 'string') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  if (!BEEHIIV_PUBLICATION_ID || !BEEHIIV_API_KEY) {
    console.error('Beehiiv environment variables not configured');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `${BEEHIIV_API_URL}/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Beehiiv API error:', response.status, errorText);
      return NextResponse.json({ error: 'Subscription failed' }, { status: 502 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Subscribe route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
