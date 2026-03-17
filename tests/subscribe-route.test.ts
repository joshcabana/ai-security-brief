import assert from 'node:assert/strict';
import test from 'node:test';
import { POST } from '../app/api/subscribe/route';

const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;

function restoreEnvironment() {
  process.env = { ...originalEnv };
  globalThis.fetch = originalFetch;
}

test.afterEach(() => {
  restoreEnvironment();
});

test('subscribe route returns 503 when Beehiiv is not configured', async () => {
  delete process.env.BEEHIIV_API_KEY;
  delete process.env.BEEHIIV_PUBLICATION_ID;

  const response = await POST(
    new Request('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'reader@example.com' }),
    }),
  );

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    ok: false,
    message: 'Newsletter signup is not configured yet. Add BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID first.',
  });
});

test('subscribe route returns 400 for invalid JSON payloads', async () => {
  process.env.BEEHIIV_API_KEY = 'test-key';
  process.env.BEEHIIV_PUBLICATION_ID = 'test-publication';

  const response = await POST(
    new Request('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"email"',
    }),
  );

  assert.equal(response.status, 400);
  assert.equal((await response.json()).message, 'The signup request body was invalid JSON.');
});

test('subscribe route returns 400 for invalid email addresses', async () => {
  process.env.BEEHIIV_API_KEY = 'test-key';
  process.env.BEEHIIV_PUBLICATION_ID = 'test-publication';

  const response = await POST(
    new Request('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' }),
    }),
  );

  assert.equal(response.status, 400);
  assert.equal((await response.json()).message, 'Enter a valid email address to subscribe.');
});

test('subscribe route surfaces upstream Beehiiv errors', async () => {
  process.env.BEEHIIV_API_KEY = 'test-key';
  process.env.BEEHIIV_PUBLICATION_ID = 'test-publication';
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({ errors: [{ message: 'Mock Beehiiv rejected the signup request.' }] }),
      {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      },
    );

  const response = await POST(
    new Request('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'reader@example.com' }),
    }),
  );

  assert.equal(response.status, 422);
  assert.equal((await response.json()).message, 'Mock Beehiiv rejected the signup request.');
});

test('subscribe route returns 502 when Beehiiv cannot be reached', async () => {
  process.env.BEEHIIV_API_KEY = 'test-key';
  process.env.BEEHIIV_PUBLICATION_ID = 'test-publication';
  globalThis.fetch = async () => {
    throw new Error('network down');
  };

  const response = await POST(
    new Request('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'reader@example.com' }),
    }),
  );

  assert.equal(response.status, 502);
  assert.equal(
    (await response.json()).message,
    'Beehiiv could not be reached. Check network access and publication settings, then try again.',
  );
});

test('subscribe route returns 200 on a successful Beehiiv response', async () => {
  process.env.BEEHIIV_API_KEY = 'test-key';
  process.env.BEEHIIV_PUBLICATION_ID = 'test-publication';
  globalThis.fetch = async (input, init) => {
    assert.ok(init?.body);
    assert.deepEqual(JSON.parse(String(init.body)), {
      email: 'reader@example.com',
      reactivate_existing: false,
      send_welcome_email: true,
      utm_source: 'website',
      utm_medium: 'organic',
      utm_campaign: 'site-signup',
      utm_content: 'homepage-hero',
    });
    assert.equal(String(input), 'https://api.beehiiv.com/v2/publications/test-publication/subscriptions');
    assert.equal(init?.method, 'POST');
    assert.equal(init?.headers && (init.headers as Record<string, string>).Authorization, 'Bearer test-key');
    return new Response(JSON.stringify({ data: { id: 'sub_123' } }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const response = await POST(
    new Request('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'reader@example.com', source: 'homepage-hero' }),
    }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    message: "You're in. Check your inbox for Beehiiv's confirmation email.",
  });
});

test('subscribe route defaults the placement source to unknown when omitted', async () => {
  process.env.BEEHIIV_API_KEY = 'test-key';
  process.env.BEEHIIV_PUBLICATION_ID = 'test-publication';
  process.env.NEXT_PUBLIC_SITE_URL = 'https://aithreatbrief.com';
  globalThis.fetch = async (input, init) => {
    assert.equal(String(input), 'https://api.beehiiv.com/v2/publications/test-publication/subscriptions');
    assert.ok(init?.body);
    assert.deepEqual(JSON.parse(String(init.body)), {
      email: 'reader@example.com',
      reactivate_existing: false,
      send_welcome_email: true,
      utm_source: 'website',
      utm_medium: 'organic',
      utm_campaign: 'site-signup',
      utm_content: 'unknown',
      referring_site: 'https://aithreatbrief.com',
    });
    return new Response(JSON.stringify({ data: { id: 'sub_456' } }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const response = await POST(
    new Request('http://localhost/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'reader@example.com' }),
    }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    message: "You're in. Check your inbox for Beehiiv's confirmation email.",
  });
});
