import assert from 'node:assert/strict';
import test from 'node:test';
import { getDeploymentProtectionHeaders } from '../scripts/verify-live.mjs';

test('getDeploymentProtectionHeaders returns no headers when no bypass secret is configured', () => {
  assert.deepEqual(getDeploymentProtectionHeaders(''), {});
});

test('getDeploymentProtectionHeaders returns the Vercel bypass header when a secret is configured', () => {
  assert.deepEqual(getDeploymentProtectionHeaders('preview-bypass-secret'), {
    'x-vercel-protection-bypass': 'preview-bypass-secret',
  });
});
