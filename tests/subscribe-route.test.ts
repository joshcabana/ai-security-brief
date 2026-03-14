import { describe, it, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// ---------------------------------------------------------------------------
// Minimal Next.js shims
// ---------------------------------------------------------------------------

type JsonBody = Record<string, unknown>;

class MockNextResponse {
  public readonly body: JsonBody;
  public readonly status: number;

  constructor(body: JsonBody, init?: { status?: number }) {
    this.body = body;
    this.status = init?.status ?? 200;
  }

  static json(body: JsonBody, init?: { status?: number }): MockNextResponse {
    return new MockNextResponse(body, init);
  }
}

// Stub the next/server module so the route can be imported without Next.js
await mock.module('next/server', {
  namedExports: {
    NextResponse: MockNextResponse,
  },
});

// ---------------------------------------------------------------------------
// Import the route handler AFTER stubbing next/server
// ---------------------------------------------------------------------------

const { POST } = await import('../app/api/subscribe/route.ts');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(body: unknown): Request {
  return {
    json: () => (body !== null ? Promise.resolve(body) : Promise.reject(new Error('bad json'))),
  } as unknown as Request;
}

function mockFetch(status: number, ok: boolean): void {
  mock.method(globalThis, 'fetch', async () => ({
    ok,
    status,
    text: async () => 'error text',
  }));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('POST /api/subscribe', () => {
  beforeEach(() => {
    mock.reset();
    process.env.BEEHIIV_PUBLICATION_ID = 'pub_test';
    process.env.BEEHIIV_API_KEY = 'key_test';
  });

  it('returns 400 for non-object body', async () => {
    const res = await POST(makeRequest(null)) as unknown as MockNextResponse;
    assert.equal(res.status, 400);
  });

  it('returns 400 for missing email field', async () => {
    const res = await POST(makeRequest({})) as unknown as MockNextResponse;
    assert.equal(res.status, 400);
  });

  it('returns 400 for invalid email', async () => {
    const res = await POST(makeRequest({ email: 'not-an-email' })) as unknown as MockNextResponse;
    assert.equal(res.status, 400);
  });

  it('returns 500 when env vars missing', async () => {
    delete process.env.BEEHIIV_PUBLICATION_ID;
    delete process.env.BEEHIIV_API_KEY;
    const res = await POST(makeRequest({ email: 'user@example.com' })) as unknown as MockNextResponse;
    assert.equal(res.status, 500);
  });

  it('returns 201 on success', async () => {
    mockFetch(200, true);
    const res = await POST(makeRequest({ email: 'user@example.com' })) as unknown as MockNextResponse;
    assert.equal(res.status, 201);
    assert.deepEqual(res.body, { success: true });
  });

  it('returns 502 when Beehiiv returns error', async () => {
    mockFetch(400, false);
    const res = await POST(makeRequest({ email: 'user@example.com' })) as unknown as MockNextResponse;
    assert.equal(res.status, 502);
  });
});
