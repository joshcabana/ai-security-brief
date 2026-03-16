#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const blogDir = path.join(root, 'blog');
const mappingPath = path.join(root, 'ops', 'affiliate-links.json');
const tokenPattern = /\[AFFILIATE:([A-Z0-9]+)\]/g;
const writeMode = process.argv.includes('--write');
const supportedFlags = new Set(['--write']);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function formatList(items) {
  return items.length === 0 ? 'none' : items.join(', ');
}

async function loadMappings() {
  let raw;

  try {
    raw = await fs.readFile(mappingPath, 'utf8');
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      throw new Error('Missing ops/affiliate-links.json. Create it before running affiliate replacements.');
    }

    throw error;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid ops/affiliate-links.json: ${detail}`);
  }

  assert(parsed && typeof parsed === 'object' && !Array.isArray(parsed), 'Invalid ops/affiliate-links.json: expected a JSON object mapping affiliate codes to URLs.');

  for (const [key, value] of Object.entries(parsed)) {
    assert(typeof value === 'string', `Invalid ops/affiliate-links.json: expected "${key}" to map to a string.`);
  }

  return parsed;
}

async function loadBlogFiles() {
  let stats;
  try {
    stats = await fs.stat(blogDir);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      throw new Error('Missing blog directory. Expected blog/*.md files under the current workspace.');
    }

    throw error;
  }

  assert(stats.isDirectory(), 'Missing blog directory. Expected blog/*.md files under the current workspace.');

  const entries = await fs.readdir(blogDir);
  return entries.filter((entry) => entry.endsWith('.md')).sort();
}

async function processFile(fileName, mappings) {
  const filePath = path.join(blogDir, fileName);
  const source = await fs.readFile(filePath, 'utf8');
  const matches = Array.from(source.matchAll(tokenPattern));

  if (matches.length === 0) {
    return {
      fileName,
      found: 0,
      replaced: 0,
      skipped: 0,
      tokens: [],
      nextSource: source,
    };
  }

  let replaced = 0;
  let skipped = 0;
  const tokens = matches.map((match) => match[1]);
  const nextSource = source.replaceAll(tokenPattern, (fullMatch, code) => {
    const replacement = mappings[code];
    if (typeof replacement !== 'string' || replacement.trim() === '') {
      skipped += 1;
      return fullMatch;
    }

    replaced += 1;
    return replacement;
  });

  return {
    fileName,
    found: matches.length,
    replaced,
    skipped,
    tokens,
    nextSource,
  };
}

async function main() {
  const unsupportedFlags = process.argv.slice(2).filter((flag) => !supportedFlags.has(flag));
  assert(unsupportedFlags.length === 0, `Usage: node scripts/replace-affiliate-links.mjs [--write]\nUnsupported flag(s): ${unsupportedFlags.join(', ')}`);

  const mappings = await loadMappings();
  const files = await loadBlogFiles();

  let tokensFound = 0;
  let tokensReplaced = 0;
  let tokensSkipped = 0;

  console.log(writeMode ? 'Affiliate replacement mode: write' : 'Affiliate replacement mode: dry-run');

  for (const fileName of files) {
    const result = await processFile(fileName, mappings);
    tokensFound += result.found;
    tokensReplaced += result.replaced;
    tokensSkipped += result.skipped;

    if (result.found === 0) {
      continue;
    }

    console.log(`\n${fileName}`);
    console.log(`  tokens: ${formatList(result.tokens)}`);
    console.log(`  found: ${result.found}`);
    console.log(`  replaceable: ${result.replaced}`);
    console.log(`  skipped: ${result.skipped}`);

    if (writeMode && result.replaced > 0 && result.nextSource !== await fs.readFile(path.join(blogDir, fileName), 'utf8')) {
      await fs.writeFile(path.join(blogDir, fileName), result.nextSource, 'utf8');
      console.log('  wrote: yes');
    } else {
      console.log(`  wrote: ${writeMode ? 'no' : 'dry-run'}`);
    }
  }

  console.log('\nSummary');
  console.log(`  files scanned: ${files.length}`);
  console.log(`  tokens found: ${tokensFound}`);
  console.log(`  tokens replaced: ${tokensReplaced}`);
  console.log(`  tokens skipped: ${tokensSkipped}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
