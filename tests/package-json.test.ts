import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = process.cwd();
const packageJsonPath = path.join(repoRoot, 'package.json');
const eslintConfigPath = path.join(repoRoot, 'eslint.config.mjs');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
  scripts?: Record<string, string>;
};

test('lint script uses eslint CLI instead of interactive next lint', () => {
  assert.equal(
    packageJson.scripts?.lint,
    'eslint . --ext .js,.mjs,.ts,.tsx',
  );
});

test('eslint flat config exists and extends next core web vitals', () => {
  assert.equal(existsSync(eslintConfigPath), true);

  const eslintConfigSource = readFileSync(eslintConfigPath, 'utf8');

  assert.match(eslintConfigSource, /compat\.extends\('next\/core-web-vitals'\)/);
  assert.match(eslintConfigSource, /ignores: \['\.next\/\*\*', 'node_modules\/\*\*', 'out\/\*\*'\]/);
});
