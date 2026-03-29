import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

const repoRoot = process.cwd();
const licensePath = path.join(repoRoot, 'LICENSE');
const readmePath = path.join(repoRoot, 'README.md');
const statusPath = path.join(repoRoot, 'STATUS.md');
const rateLimitPath = path.join(repoRoot, 'lib', 'rate-limit.ts');
const beehiivSetupPath = path.join(repoRoot, 'beehiiv-setup.md');
const generateStatusScriptPath = path.join(repoRoot, 'scripts', 'generate-status.mjs');

function getSlidingWindowLimitPerMinute(): string {
  const rateLimitSource = readFileSync(rateLimitPath, 'utf8');
  const match = rateLimitSource.match(/Ratelimit\.slidingWindow\((\d+),\s*['"]1 m['"]\)/);

  assert.ok(match, 'Expected lib/rate-limit.ts to declare a one-minute sliding window limit.');

  return match[1];
}

test('README and STATUS reflect the published MIT license and canonical PR gate', () => {
  assert.equal(existsSync(licensePath), true);

  const licenseSource = readFileSync(licensePath, 'utf8');
  const readmeSource = readFileSync(readmePath, 'utf8');
  const statusSource = readFileSync(statusPath, 'utf8');

  assert.match(licenseSource, /^MIT License/m);
  assert.match(readmeSource, /pnpm verify:pr/);
  assert.match(readmeSource, /This repository publishes an \[MIT License\]\(LICENSE\)\./);
  assert.doesNotMatch(readmeSource, /No open-source license file is currently published/);
  assert.equal(statusSource.includes('| Repository license | MIT (`LICENSE`) |'), true);
});

test('STATUS documents the active distributed subscribe rate limit', () => {
  const statusSource = readFileSync(statusPath, 'utf8');
  const limitPerMinute = getSlidingWindowLimitPerMinute();
  const expectedLine = `| Rate limiting | Upstash-backed distributed ${limitPerMinute} req/min per IP on \`/api/subscribe\` |`;

  assert.equal(statusSource.includes(expectedLine), true);
});

test('Beehiiv setup guide includes the first live send runbook', () => {
  const beehiivSetupSource = readFileSync(beehiivSetupPath, 'utf8');

  assert.match(beehiivSetupSource, /## First Live Send and Metrics Runbook/);
  assert.match(beehiivSetupSource, /python3 scripts\/update-completion-guide\.py/);
  assert.match(beehiivSetupSource, /gh workflow run "Performance Logger"/);
});

test('generate-status records repository license metadata from LICENSE', () => {
  const tempDirectoryPath = mkdtempSync(path.join(tmpdir(), 'ai-security-brief-status-'));
  const outputPath = path.join(tempDirectoryPath, 'status.json');
  const command = spawnSync(process.execPath, [generateStatusScriptPath, '--output', outputPath], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  try {
    assert.equal(command.status, 0, command.stderr);

    const statusJson = JSON.parse(readFileSync(outputPath, 'utf8')) as {
      legal?: {
        license_spdx?: string | null;
        source_file?: string | null;
      };
    };

    assert.deepEqual(statusJson.legal, {
      license_spdx: 'MIT',
      source_file: 'LICENSE',
    });
  } finally {
    rmSync(tempDirectoryPath, { recursive: true, force: true });
  }
});
