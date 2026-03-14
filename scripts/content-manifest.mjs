#!/usr/bin/env node
/**
 * content-manifest.mjs
 *
 * Generates or validates content-manifest.json, which lists all article slugs
 * in the blog directory. Used by CI to detect uncommitted content changes.
 *
 * Usage:
 *   node scripts/content-manifest.mjs --write   # write manifest
 *   node scripts/content-manifest.mjs --check   # exit 1 if manifest is stale
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'blog');
const MANIFEST_PATH = path.join(ROOT, 'content-manifest.json');

async function getSlugs(): Promise<string[]> {
  let files: string[];
  try {
    files = await fs.readdir(BLOG_DIR);
  } catch {
    files = [];
  }
  return files
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .sort();
}

async function writeManifest(): Promise<void> {
  const slugs = await getSlugs();
  const manifest = { slugs };
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Manifest written with ${slugs.length} slug(s): ${slugs.join(', ')}`);
}

async function checkManifest(): Promise<void> {
  const slugs = await getSlugs();
  let existing: { slugs: string[] };
  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf-8');
    existing = JSON.parse(raw);
  } catch {
    console.error('Manifest file not found or invalid. Run --write first.');
    process.exit(1);
  }
  const currentSet = new Set(slugs);
  const existingSet = new Set(existing.slugs);
  const added = slugs.filter((s) => !existingSet.has(s));
  const removed = existing.slugs.filter((s) => !currentSet.has(s));
  if (added.length > 0 || removed.length > 0) {
    if (added.length > 0) console.error(`Added slugs not in manifest: ${added.join(', ')}`);
    if (removed.length > 0) console.error(`Removed slugs still in manifest: ${removed.join(', ')}`);
    console.error('Run `pnpm content:manifest` to update the manifest.');
    process.exit(1);
  }
  console.log('Manifest is up to date.');
}

const arg = process.argv[2];
if (arg === '--write') {
  writeManifest();
} else if (arg === '--check') {
  checkManifest();
} else {
  console.error('Usage: content-manifest.mjs --write | --check');
  process.exit(1);
}
