import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { READ_TIME_PATTERN } from '../lib/articles.ts';
import {
  getArticles,
  getArticle,
  BLOG_DIR,
} from '../lib/articles.ts';
import {
  setupBlogDir,
  teardownBlogDir,
  writeArticle,
  VALID_FRONTMATTER,
} from './helpers.ts';

const VALID_BODY = '\n## Hello\n\nSome content\n';

describe('getArticles', () => {
  it('returns empty array when blog dir is missing', async () => {
    await teardownBlogDir();
    const result = await getArticles();
    assert.deepEqual(result, []);
  });

  it('returns parsed articles', async () => {
    await setupBlogDir();
    await writeArticle('test.md', VALID_FRONTMATTER + VALID_BODY);
    const result = await getArticles();
    assert.equal(result.length, 1);
    const article = result[0];
    assert.equal(article.title, 'Test Article');
    assert.equal(article.slug, 'test-article');
    assert.equal(article.date, '2025-01-01');
    assert.equal(article.author, 'Test Author');
    assert.equal(article.excerpt, 'Test excerpt.');
    assert.equal(article.category, 'Test Category');
    assert.equal(article.featured, false);
    assert.equal(article.metaTitle, 'Meta Title');
    assert.equal(article.metaDescription, 'Meta description.');
    assert.deepEqual(article.keywords, ['keyword1', 'keyword2']);
    assert.equal(article.readTime, '5 min');
    await teardownBlogDir();
  });

  it('sorts articles by date descending', async () => {
    await setupBlogDir();
    await writeArticle(
      'older.md',
      VALID_FRONTMATTER.replace('2025-01-01', '2024-06-01') + VALID_BODY,
    );
    await writeArticle(
      'newer.md',
      VALID_FRONTMATTER.replace('2025-01-01', '2025-03-01') + VALID_BODY,
    );
    const result = await getArticles();
    assert.ok(result[0].date > result[1].date, 'Expected newer article first');
    await teardownBlogDir();
  });

  it('throws for missing required fields', async () => {
    await setupBlogDir();
    await writeArticle('bad.md', '---\ntitle: Only Title\n---\n');
    await assert.rejects(() => getArticles(), /Expected/);
    await teardownBlogDir();
  });

  it('throws for invalid date', async () => {
    await setupBlogDir();
    await writeArticle(
      'bad-date.md',
      VALID_FRONTMATTER.replace('2025-01-01', 'not-a-date') + VALID_BODY,
    );
    await assert.rejects(() => getArticles(), /Expected "date" to be a valid date/);
    await teardownBlogDir();
  });

  it('throws for invalid read_time format', async () => {
    await setupBlogDir();
    await writeArticle(
      'bad-readtime.md',
      VALID_FRONTMATTER.replace('5 min', 'five minutes') + VALID_BODY,
    );
    await assert.rejects(() => getArticles(), /Expected "read_time"/);
    await teardownBlogDir();
  });
});

describe('getArticle', () => {
  it('returns article with contentHtml for known slug', async () => {
    await setupBlogDir();
    await writeArticle('slug-test.md', VALID_FRONTMATTER + VALID_BODY);
    const result = await getArticle('test-article');
    assert.ok(result !== null);
    assert.equal(result!.slug, 'test-article');
    assert.ok(result!.contentHtml.includes('<h2>'));
    await teardownBlogDir();
  });

  it('returns null for unknown slug', async () => {
    await setupBlogDir();
    const result = await getArticle('no-such-slug');
    assert.equal(result, null);
    await teardownBlogDir();
  });
});

describe('READ_TIME_PATTERN', () => {
  it('matches valid patterns', () => {
    assert.ok(READ_TIME_PATTERN.test('5 min'));
    assert.ok(READ_TIME_PATTERN.test('10 min'));
    assert.ok(READ_TIME_PATTERN.test('100 min'));
  });

  it('rejects invalid patterns', () => {
    assert.ok(!READ_TIME_PATTERN.test('5min'));
    assert.ok(!READ_TIME_PATTERN.test('five minutes'));
    assert.ok(!READ_TIME_PATTERN.test('5 minutes'));
    assert.ok(!READ_TIME_PATTERN.test(''));
  });
});
