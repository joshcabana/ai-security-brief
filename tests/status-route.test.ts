import assert from 'node:assert/strict';
import test from 'node:test';
import { GET } from '../app/status.json/route';

test('status.json route returns the public status snapshot with no-store caching', async () => {
  const response = await GET();
  const payload = (await response.json()) as {
    status_document: {
      pinned_baseline_ref: string;
      pinned_baseline_sha: string;
      site_status: {
        live_url: string;
      };
    };
    runtime: {
      production_url: string;
    };
  };

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(payload.status_document.pinned_baseline_ref, 'origin/main');
  assert.match(payload.status_document.pinned_baseline_sha, /^[0-9a-f]{7,40}$/);
  assert.equal(payload.status_document.site_status.live_url, 'https://aithreatbrief.com');
  assert.equal(payload.runtime.production_url, 'https://aithreatbrief.com');
});
