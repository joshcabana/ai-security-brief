import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = process.cwd();
const packageJsonPath = path.join(repoRoot, 'package.json');
const eslintConfigPath = path.join(repoRoot, '.eslintrc.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
  scripts?: Record<string, string>;
};

test('lint script uses eslint CLI instead of interactive next lint', () => {
  assert.equal(
    packageJson.scripts?.lint,
    'ESLINT_USE_FLAT_CONFIG=false eslint . --ext .js,.mjs,.ts,.tsx',
  );
});

test('eslint config exists and extends next core web vitals', () => {
  assert.equal(existsSync(eslintConfigPath), true);

  const eslintConfig = JSON.parse(readFileSync(eslintConfigPath, 'utf8')) as {
    extends?: string[];
  };

  assert.deepEqual(eslintConfig.extends, ['next/core-web-vitals']);
});
