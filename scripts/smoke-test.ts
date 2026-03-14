#!/usr/bin/env tsx
/**
 * Production smoke test — run via `pnpm test:smoke`
 *
 * Verifies the Next.js build output exists and critical pages
 * were statically generated. Run after `pnpm build`.
 */

import fs from 'fs';
import path from 'path';

const NEXT_DIR = path.join(process.cwd(), '.next');
const errors: string[] = [];

function check(label: string, condition: boolean) {
  if (!condition) {
    errors.push(label);
    console.error(`  \u274c ${label}`);
  } else {
    console.log(`  \u2705 ${label}`);
  }
}

console.log('\n\ud83d\udea8 Production smoke test\n');

// 1. .next directory exists
check('.next build output exists', fs.existsSync(NEXT_DIR));

if (!fs.existsSync(NEXT_DIR)) {
  console.error('\n\u274c Build output not found. Run `pnpm build` first.\n');
  process.exit(1);
}

// 2. Build manifest exists
check(
  'build-manifest.json exists',
  fs.existsSync(path.join(NEXT_DIR, 'build-manifest.json')),
);

// 3. Check for server output
const serverDir = path.join(NEXT_DIR, 'server');
check('server directory exists', fs.existsSync(serverDir));

// 4. Check critical route chunks exist in the server output
const appDir = path.join(serverDir, 'app');
if (fs.existsSync(appDir)) {
  // Homepage
  const homePagePath = path.join(appDir, 'page_client-reference-manifest.js');
  const homeExists = fs.existsSync(homePagePath) ||
    fs.existsSync(path.join(appDir, 'page.js')) ||
    fs.readdirSync(appDir).some(f => f.startsWith('page'));
  check('homepage route generated', homeExists);

  // Blog route
  const blogDir = path.join(appDir, 'blog');
  check('blog route generated', fs.existsSync(blogDir));

  // Tools route
  const toolsDir = path.join(appDir, 'tools');
  check('tools route generated', fs.existsSync(toolsDir));

  // Newsletter route
  const newsletterDir = path.join(appDir, 'newsletter');
  check('newsletter route generated', fs.existsSync(newsletterDir));

  // API subscribe route
  const apiSubscribeDir = path.join(appDir, 'api', 'subscribe');
  check('api/subscribe route generated', fs.existsSync(apiSubscribeDir));
} else {
  errors.push('app server directory missing');
  console.error('  \u274c app server directory missing');
}

// 5. Static assets
const staticDir = path.join(NEXT_DIR, 'static');
check('static assets directory exists', fs.existsSync(staticDir));

// Summary
console.log('');
if (errors.length > 0) {
  console.error(`\u274c Smoke test failed: ${errors.length} check(s) failed\n`);
  process.exit(1);
} else {
  console.log('\u2705 Smoke test passed: all checks green\n');
  process.exit(0);
}
