import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { BLOG_DIR } from '../lib/articles.ts';
import {
  setupBlogDir,
  teardownBlogDir,
  writeArticle,
  VALID_FRONTMATTER,
} from './helpers.ts';

const MANIFEST_PATH = path.join(process.cwd(), 'content-manifest.json');
const MANIFEST_BACKUP = MANIFEST_PATH + '.bak';

const VALID_BODY = '\n## Hello\n\nSome content\n';

async function runManifestScript(args: string[] = []): Promise<{ exitCode: number | null; stdout: string; stderr: string }> {
  const { spawn } = await import('node:child_process');
  return new Promise((resolve) => {
    const proc = spawn(
      process.execPath,
      ['scripts/content-manifest.mjs', ...args],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk: Buffer) => { stdout += chunk.toString(); });
    proc.stderr.on('data', (chunk: Buffer) => { stderr += chunk.toString(); });
    proc.on('close', (exitCode) => resolve({ exitCode, stdout, stderr }));
  });
}

describe('content-manifest script', () => {
  before(async () => {
    // Back up existing manifest if present
    try {
      await fs.copyFile(MANIFEST_PATH, MANIFEST_BACKUP);
    } catch {
      // No existing manifest
    }
  });

  after(async () => {
    // Restore backup
    try {
      await fs.rename(MANIFEST_BACKUP, MANIFEST_PATH);
    } catch {
      // No backup to restore
    }
    await teardownBlogDir();
  });

  it('--write creates manifest with correct slugs', async () => {
    await setupBlogDir();
    await writeArticle('article-a.md', VALID_FRONTMATTER + VALID_BODY);
    await writeArticle('article-b.md', VALID_FRONTMATTER.replace('test-article', 'another-article').replace('Test Article', 'Another Article') + VALID_BODY);

    const { exitCode, stderr } = await runManifestScript(['--write']);
    assert.equal(exitCode, 0, `Expected exit 0, got ${exitCode}. stderr: ${stderr}`);

    const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf-8'));
    assert.ok(Array.isArray(manifest.slugs), 'manifest.slugs should be an array');
    assert.ok(manifest.slugs.includes('test-article'), 'Should include test-article slug');
    assert.ok(manifest.slugs.includes('another-article'), 'Should include another-article slug');
  });

  it('--check passes when manifest matches articles', async () => {
    // Reuse blog dir from previous test
    const { exitCode, stderr } = await runManifestScript(['--check']);
    assert.equal(exitCode, 0, `Expected exit 0, got ${exitCode}. stderr: ${stderr}`);
  });

  it('--check fails when manifest is stale', async () => {
    // Add a new article without updating manifest
    await writeArticle(
      'extra.md',
      VALID_FRONTMATTER.replace('test-article', 'extra-article').replace('Test Article', 'Extra Article') + VALID_BODY,
    );
    const { exitCode } = await runManifestScript(['--check']);
    assert.equal(exitCode, 1, 'Expected exit 1 when manifest is stale');
  });
});
