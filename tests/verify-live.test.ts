import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getDeploymentProtectionHeaders,
  mergeRequestHeaders,
  resolveCanonicalBaseUrl,
} from '../scripts/verify-live.mjs';

test('getDeploymentProtectionHeaders returns no headers when no bypass secret is configured', () => {
  assert.deepEqual(getDeploymentProtectionHeaders(''), {});
});

test('getDeploymentProtectionHeaders returns the Vercel bypass header when a secret is configured', () => {
  assert.deepEqual(getDeploymentProtectionHeaders('preview-bypass-secret'), {
    'x-vercel-protection-bypass': 'preview-bypass-secret',
  });
});

test('getDeploymentProtectionHeaders falls back to Vercel automation bypass secret env var', () => {
  const originalAutomationBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

  process.env.VERCEL_AUTOMATION_BYPASS_SECRET = 'automation-bypass-secret';

  try {
    assert.deepEqual(getDeploymentProtectionHeaders(), {
      'x-vercel-protection-bypass': 'automation-bypass-secret',
    });
  } finally {
    if (originalAutomationBypassSecret === undefined) {
      delete process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
      return;
    }

    process.env.VERCEL_AUTOMATION_BYPASS_SECRET = originalAutomationBypassSecret;
  }
});

test('mergeRequestHeaders preserves Vercel bypass headers when no additional headers are provided', () => {
  assert.deepEqual(mergeRequestHeaders(undefined, getDeploymentProtectionHeaders('preview-bypass-secret')), {
    'x-vercel-protection-bypass': 'preview-bypass-secret',
  });
});

test('mergeRequestHeaders keeps the Vercel bypass header alongside request-specific headers', () => {
  assert.deepEqual(
    mergeRequestHeaders(
      {
        'content-type': 'application/json',
      },
      getDeploymentProtectionHeaders('preview-bypass-secret'),
    ),
    {
      'x-vercel-protection-bypass': 'preview-bypass-secret',
      'content-type': 'application/json',
    },
  );
});

test('resolveCanonicalBaseUrl uses an explicit override when provided', () => {
  assert.equal(
    resolveCanonicalBaseUrl(
      'https://preview.example.vercel.app/',
      'https://aithreatbrief.com/',
    ),
    'https://aithreatbrief.com',
  );
});

test('resolveCanonicalBaseUrl falls back to the request base url when no override is provided', () => {
  assert.equal(resolveCanonicalBaseUrl('https://preview.example.vercel.app/', null), 'https://preview.example.vercel.app');
});
