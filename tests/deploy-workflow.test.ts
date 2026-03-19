import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const deployWorkflowSource = readFileSync(
  new URL('../.github/workflows/deploy.yml', import.meta.url),
  'utf8',
);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractJobBlock(jobName: string): string {
  const escapedJobName = escapeRegExp(jobName);
  const match = deployWorkflowSource.match(
    new RegExp(`^  ${escapedJobName}:\\n([\\s\\S]*?)(?=^  [a-z][a-z0-9_]*:|\\Z)`, 'm'),
  );

  assert.ok(match, `Expected deploy workflow to define the ${jobName} job.`);

  return match[0];
}

test('deploy workflow verifies preview deployments on pull requests and uploads a preview artifact', () => {
  const previewJob = extractJobBlock('verify_preview');

  assert.match(previewJob, /needs:\s+\[verify, deploy_gate, deploy\]/);
  assert.match(previewJob, /github\.event_name == 'pull_request'/);
  assert.match(
    previewJob,
    /node scripts\/verify-live\.mjs --base-url "\$\{\{ needs\.deploy\.outputs\.url \}\}" --output verify-live-preview\.json/,
  );
  assert.match(previewJob, /name:\s+verify-live-preview/);
});

test('deploy workflow sanitises the Vercel deploy URL and keeps production live verification warn-only', () => {
  const deployJob = extractJobBlock('deploy');
  const productionVerificationJob = extractJobBlock('verify_live');

  assert.match(deployJob, /DEPLOYMENT_OUTPUT=.*2>&1/);
  assert.match(deployJob, /grep -v 'https:\/\/vercel\.com\//);
  assert.match(deployJob, /Failed to parse deployment URL from Vercel CLI output\./);
  assert.match(productionVerificationJob, /continue-on-error:\s+true/);
});
