import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

const replaceAffiliateLinksScript = path.join(process.cwd(), 'scripts', 'replace-affiliate-links.mjs');

async function createWorkspace(files: Record<string, string>) {
  const workspaceDir = await mkdtemp(path.join(tmpdir(), 'replace-affiliate-links-'));

  for (const [relativePath, source] of Object.entries(files)) {
    const filePath = path.join(workspaceDir, relativePath);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, source, 'utf8');
  }

  return {
    workspaceDir,
    async cleanup() {
      await rm(workspaceDir, { recursive: true, force: true });
    },
  };
}

function runReplaceAffiliateLinks(
  workspaceDir: string,
  args: string[] = [],
) {
  return spawnSync(process.execPath, [replaceAffiliateLinksScript, ...args], {
    cwd: workspaceDir,
    encoding: 'utf8',
  });
}

test('dry-run mode reports tokens without writing files', async () => {
  const workspace = await createWorkspace({
    'ops/affiliate-links.json': JSON.stringify({
      NORDVPN: 'https://example.com/nordvpn',
      PROTON: '',
    }, null, 2),
    'blog/security-stack.md': [
      '# Security Stack',
      '',
      'Use [AFFILIATE:NORDVPN] and [AFFILIATE:PROTON] today.',
      '',
    ].join('\n'),
  });

  try {
    const before = await readFile(path.join(workspace.workspaceDir, 'blog', 'security-stack.md'), 'utf8');
    const result = runReplaceAffiliateLinks(workspace.workspaceDir);
    const after = await readFile(path.join(workspace.workspaceDir, 'blog', 'security-stack.md'), 'utf8');

    assert.equal(result.status, 0);
    assert.equal(after, before);
    assert.match(result.stdout, /Affiliate replacement mode: dry-run/);
    assert.match(result.stdout, /tokens found: 2/);
    assert.match(result.stdout, /tokens replaced: 1/);
    assert.match(result.stdout, /tokens skipped: 1/);
    assert.match(result.stdout, /wrote: dry-run/);
  } finally {
    await workspace.cleanup();
  }
});

test('--write mode replaces populated tokens across files and duplicates', async () => {
  const workspace = await createWorkspace({
    'ops/affiliate-links.json': JSON.stringify({
      NORDVPN: 'https://example.com/nordvpn',
      PROTON: 'https://example.com/proton',
    }, null, 2),
    'blog/one.md': 'One [AFFILIATE:NORDVPN] two [AFFILIATE:PROTON] three [AFFILIATE:NORDVPN]\n',
    'blog/two.md': 'Again [AFFILIATE:PROTON]\n',
  });

  try {
    const result = runReplaceAffiliateLinks(workspace.workspaceDir, ['--write']);
    const one = await readFile(path.join(workspace.workspaceDir, 'blog', 'one.md'), 'utf8');
    const two = await readFile(path.join(workspace.workspaceDir, 'blog', 'two.md'), 'utf8');

    assert.equal(result.status, 0);
    assert.equal(one, 'One https://example.com/nordvpn two https://example.com/proton three https://example.com/nordvpn\n');
    assert.equal(two, 'Again https://example.com/proton\n');
    assert.match(result.stdout, /tokens found: 4/);
    assert.match(result.stdout, /tokens replaced: 4/);
    assert.match(result.stdout, /tokens skipped: 0/);
  } finally {
    await workspace.cleanup();
  }
});

test('tokens with empty mappings are skipped in write mode', async () => {
  const workspace = await createWorkspace({
    'ops/affiliate-links.json': JSON.stringify({
      NORDVPN: '',
      PROTON: 'https://example.com/proton',
    }, null, 2),
    'blog/stack.md': 'Use [AFFILIATE:NORDVPN] and [AFFILIATE:PROTON].\n',
  });

  try {
    const result = runReplaceAffiliateLinks(workspace.workspaceDir, ['--write']);
    const updated = await readFile(path.join(workspace.workspaceDir, 'blog', 'stack.md'), 'utf8');

    assert.equal(result.status, 0);
    assert.equal(updated, 'Use [AFFILIATE:NORDVPN] and https://example.com/proton.\n');
    assert.match(result.stdout, /tokens found: 2/);
    assert.match(result.stdout, /tokens replaced: 1/);
    assert.match(result.stdout, /tokens skipped: 1/);
  } finally {
    await workspace.cleanup();
  }
});

test('missing affiliate-links.json exits with a clear error', async () => {
  const workspace = await createWorkspace({
    'blog/example.md': 'Use [AFFILIATE:NORDVPN].\n',
  });

  try {
    const result = runReplaceAffiliateLinks(workspace.workspaceDir);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Missing ops\/affiliate-links\.json/);
  } finally {
    await workspace.cleanup();
  }
});

test('malformed JSON and missing blog directory exit clearly', async () => {
  const malformedWorkspace = await createWorkspace({
    'ops/affiliate-links.json': '{',
    'blog/example.md': 'Use [AFFILIATE:NORDVPN].\n',
  });
  const missingBlogWorkspace = await createWorkspace({
    'ops/affiliate-links.json': JSON.stringify({
      NORDVPN: 'https://example.com/nordvpn',
    }, null, 2),
  });

  try {
    const malformedResult = runReplaceAffiliateLinks(malformedWorkspace.workspaceDir);
    const missingBlogResult = runReplaceAffiliateLinks(missingBlogWorkspace.workspaceDir);

    assert.equal(malformedResult.status, 1);
    assert.match(malformedResult.stderr, /Invalid ops\/affiliate-links\.json/);

    assert.equal(missingBlogResult.status, 1);
    assert.match(missingBlogResult.stderr, /Missing blog directory/);
  } finally {
    await malformedWorkspace.cleanup();
    await missingBlogWorkspace.cleanup();
  }
});
