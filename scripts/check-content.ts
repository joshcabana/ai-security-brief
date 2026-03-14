#!/usr/bin/env tsx
/**
 * Content validation script — run via `pnpm check:content`
 *
 * Parses every .md file in /blog, validates frontmatter and body,
 * and exits non-zero if any violations are found.
 */

import { validateAllArticles } from '../lib/content';

const { articles, errors } = validateAllArticles();

if (errors.length > 0) {
  console.error('\n\u274c Content validation failed:\n');
  for (const err of errors) {
    console.error(`  ${err.file} → ${err.field}: ${err.message}`);
  }
  console.error(`\n  ${errors.length} error(s) in ${new Set(errors.map((e) => e.file)).size} file(s)\n`);
  process.exit(1);
}

console.log(`\u2705 Content validation passed: ${articles.length} article(s), 0 errors`);
process.exit(0);
