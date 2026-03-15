#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { dirname, isAbsolute, resolve } from 'path';
import { fileURLToPath } from 'url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '..');
const WORKDIR = process.cwd();
const DEFAULT_BASE_URL = 'https://aithreatbrief.com';
const REQUEST_TIMEOUT_MS = 20000;

// Domains that must redirect to DEFAULT_BASE_URL (apex)
const REDIRECT_DOMAINS = [
  { name: 'www-redirect', from: 'https://www.aithreatbrief.com', expectedApex: DEFAULT_BASE_URL },
  { name: 'alias-redirect', from: 'https://aisecbrief.com', expectedApex: DEFAULT_BASE_URL },
];

function getArgValue(name) {
  const flag = `--${name}`;
  const index = process.argv.indexOf(flag);

  if (index === -1 || index === process.argv.length - 1) {
    return null;
  }

  return process.argv[index + 1];
}

function loadManifest() {
  const manifestPath = resolve(REPO_ROOT, 'content-manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  if (!manifest?.articles || !Array.isArray(manifest.articles) || manifest.articles.length === 0) {
    throw new Error('content-manifest.json does not contain any articles.');
  }

  return manifest;
}

function resolveOutputPath(outputPath) {
  if (isAbsolute(outputPath)) {
    return outputPath;
  }

  return resolve(WORKDIR, outputPath);
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      redirect: 'follow',
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchNoFollow(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      redirect: 'manual',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function toSummary(results, baseUrl) {
  const lines = [
    '## verify:live',
    '',
    `Base URL: \`${baseUrl}\``,
    '',
  ];

  for (const result of results) {
    const prefix = result.ok ? '- PASS' : '- FAIL';
    lines.push(`${prefix}: \`${result.name}\` — ${result.message}`);
  }

  return lines.join('\n') + '\n';
}

async function runRedirectChecks() {
  const results = [];

  for (const { name, from, expectedApex } of REDIRECT_DOMAINS) {
    try {
      const response = await fetchNoFollow(from);
      const status = response.status;
      const location = response.headers.get('location') || '';

      // Accept 301 or 308 redirects pointing to the apex (with or without trailing slash)
      const isRedirect = status === 301 || status === 308;
      const pointsToApex = location.startsWith(expectedApex);

      if (!isRedirect) {
        throw new Error(`Expected 301 or 308 redirect from ${from}, received ${status}`);
      }
      if (!pointsToApex) {
        throw new Error(`Redirect location ${location} does not point to apex ${expectedApex}`);
      }

      results.push({
        name,
        ok: true,
        path: from,
        status,
        message: `${from} → ${location} (${status})`,
      });
    } catch (error) {
      results.push({
        name,
        ok: false,
        path: from,
        status: null,
        message: error instanceof Error ? error.message : 'Unknown redirect check error.',
      });
    }
  }

  return results;
}

async function run() {
  const baseUrl = (getArgValue('base-url') || process.env.VERIFY_LIVE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
  const outputPath = getArgValue('output');
  const manifest = loadManifest();
  const featuredArticle = manifest.articles[0];
  const articlePath = `/blog/${featuredArticle.slug}`;

  const routeChecks = [
    {
      name: 'homepage',
      path: '/',
      method: 'GET',
      assert: async (response) => {
        const body = await response.text();
        if (response.status !== 200) {
          throw new Error(`Expected HTTP 200, received ${response.status}`);
        }
        if (!body.includes('AI Security Brief')) {
          throw new Error('Homepage is missing the site title marker.');
        }
      },
    },
    {
      name: 'blog-index',
      path: '/blog',
      method: 'GET',
      assert: async (response) => {
        const body = await response.text();
        if (response.status !== 200) {
          throw new Error(`Expected HTTP 200, received ${response.status}`);
        }
        if (!body.includes(articlePath)) {
          throw new Error(`Blog index is missing expected article path ${articlePath}.`);
        }
      },
    },
    {
      name: 'newsletter-page',
      path: '/newsletter',
      method: 'GET',
      assert: async (response) => {
        const body = await response.text();
        if (response.status !== 200) {
          throw new Error(`Expected HTTP 200, received ${response.status}`);
        }
        if (!body.includes('Subscribe')) {
          throw new Error('Newsletter page is missing the subscribe marker.');
        }
      },
    },
    {
      name: 'article-page',
      path: articlePath,
      method: 'GET',
      assert: async (response) => {
        const body = await response.text();
        if (response.status !== 200) {
          throw new Error(`Expected HTTP 200, received ${response.status}`);
        }
        if (!body.includes(featuredArticle.title)) {
          throw new Error(`Article page is missing expected title: ${featuredArticle.title}`);
        }
      },
    },
    {
      name: 'subscribe-endpoint',
      path: '/api/subscribe',
      method: 'POST',
      body: JSON.stringify({ email: 'not-an-email' }),
      headers: { 'content-type': 'application/json' },
      assert: async (response) => {
        const payload = await response.json();
        if (response.status !== 400) {
          throw new Error(`Expected HTTP 400, received ${response.status}`);
        }
        if (payload?.ok !== false) {
          throw new Error('Subscribe endpoint did not return ok:false for invalid input.');
        }
      },
    },
  ];

  const routeResults = [];

  for (const check of routeChecks) {
    const targetUrl = `${baseUrl}${check.path}`;
    try {
      const response = await fetchWithTimeout(targetUrl, {
        method: check.method,
        headers: check.headers,
        body: check.body,
      });
      await check.assert(response);
      routeResults.push({
        name: check.name,
        ok: true,
        path: check.path,
        status: response.status,
        message: `${check.method} ${check.path} returned ${response.status}`,
      });
    } catch (error) {
      routeResults.push({
        name: check.name,
        ok: false,
        path: check.path,
        status: null,
        message: error instanceof Error ? error.message : 'Unknown verification error.',
      });
    }
  }

  // Run redirect checks only when hitting the real production apex
  const isProductionRun = baseUrl === DEFAULT_BASE_URL;
  const redirectResults = isProductionRun ? await runRedirectChecks() : [];

  const results = [...routeResults, ...redirectResults];

  const report = {
    checkedAt: new Date().toISOString(),
    baseUrl,
    ok: results.every((result) => result.ok),
    results,
  };

  if (outputPath) {
    writeFileSync(resolveOutputPath(outputPath), `${JSON.stringify(report, null, 2)}\n`);
  }

  if (process.env.GITHUB_STEP_SUMMARY) {
    writeFileSync(process.env.GITHUB_STEP_SUMMARY, toSummary(results, baseUrl), { flag: 'a' });
  }

  console.log(JSON.stringify(report, null, 2));

  if (!report.ok) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : 'Unknown top-level verify-live failure.';
  const report = {
    checkedAt: new Date().toISOString(),
    baseUrl: getArgValue('base-url') || process.env.VERIFY_LIVE_BASE_URL || DEFAULT_BASE_URL,
    ok: false,
    results: [
      {
        name: 'verify-live',
        ok: false,
        path: null,
        status: null,
        message,
      },
    ],
  };

  console.log(JSON.stringify(report, null, 2));
  if (process.env.GITHUB_STEP_SUMMARY) {
    writeFileSync(process.env.GITHUB_STEP_SUMMARY, toSummary(report.results, report.baseUrl), { flag: 'a' });
  }
  process.exit(1);
});
