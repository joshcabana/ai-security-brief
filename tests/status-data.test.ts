import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { buildStatusSnapshot, parseStatusDocument } from '../lib/status-data.mjs';

const repoRoot = process.cwd();
const statusPath = path.join(repoRoot, 'STATUS.md');
const originalEnv = { ...process.env };

test.afterEach(() => {
  process.env = { ...originalEnv };
});

test('parseStatusDocument extracts the pinned baseline and markdown tables from STATUS.md', () => {
  const parsedStatus = parseStatusDocument(readFileSync(statusPath, 'utf8'));

  assert.equal(parsedStatus.pinned_baseline_ref, 'origin/main');
  assert.match(parsedStatus.pinned_baseline_sha, /^[0-9a-f]{7,40}$/);
  assert.equal(parsedStatus.site_status.live_url, 'https://aithreatbrief.com');
  assert.equal(parsedStatus.content.published_articles, '12');
  assert.equal(parsedStatus.open_pull_requests.length, 0);
  assert.ok(parsedStatus.recent_merges.length >= 2);
});

test('buildStatusSnapshot formats runtime deployment fields from Vercel environment variables', () => {
  process.env.NEXT_PUBLIC_SITE_NAME = 'AI Security Brief';
  process.env.NEXT_PUBLIC_SITE_URL = 'https://aithreatbrief.com';
  process.env.VERCEL_TARGET_ENV = 'production';
  process.env.VERCEL_URL = 'ai-security-brief-status.vercel.app';
  process.env.VERCEL_BRANCH_URL = 'ai-security-brief-git-status-ops-hardening.vercel.app';
  process.env.VERCEL_PROJECT_PRODUCTION_URL = 'aithreatbrief.com';
  process.env.VERCEL_GIT_COMMIT_SHA = '32ac4b326c60cf25600053da92c2fe503b6dc738';
  process.env.VERCEL_GIT_COMMIT_REF = 'main';
  process.env.VERCEL_GIT_PREVIOUS_SHA = '9f47de4e05d96cabaac033fef158dd07793af064';

  const statusSnapshot = buildStatusSnapshot({});

  assert.equal(statusSnapshot.site.url, 'https://aithreatbrief.com');
  assert.equal(statusSnapshot.runtime.target_env, 'production');
  assert.equal(statusSnapshot.runtime.deployment_url, 'https://ai-security-brief-status.vercel.app');
  assert.equal(
    statusSnapshot.runtime.branch_url,
    'https://ai-security-brief-git-status-ops-hardening.vercel.app',
  );
  assert.equal(statusSnapshot.runtime.production_url, 'https://aithreatbrief.com');
  assert.equal(statusSnapshot.runtime.git_commit_sha, '32ac4b326c60cf25600053da92c2fe503b6dc738');
  assert.equal(statusSnapshot.runtime.git_commit_ref, 'main');
  assert.equal(statusSnapshot.runtime.git_previous_sha, '9f47de4e05d96cabaac033fef158dd07793af064');
});
