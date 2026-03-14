import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ── Types ────────────────────────────────────────────────────────────

export interface Article {
  title: string;
  slug: string;
  date: string; // ISO 8601 date string YYYY-MM-DD
  author: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  keywords: string[];
  read_time: string; // e.g. "7 min"
  content: string;
}

export interface ContentError {
  file: string;
  field: string;
  message: string;
}

// ── Validation helpers ───────────────────────────────────────────────

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const READ_TIME = /^\d+\s*min$/;

function isValidDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const d = new Date(value + 'T00:00:00Z');
  return !isNaN(d.getTime());
}

function requireString(val: unknown, name: string, errors: ContentError[], file: string): string {
  if (typeof val !== 'string' || val.trim().length === 0) {
    errors.push({ file, field: name, message: `required string field "${name}" is missing or empty` });
    return '';
  }
  return val.trim();
}

// ── Core parser ──────────────────────────────────────────────────────

const BLOG_DIR = path.join(process.cwd(), 'blog');

export function getBlogFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();
}

export function parseArticle(filename: string): { article: Article | null; errors: ContentError[] } {
  const filePath = path.join(BLOG_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const errors: ContentError[] = [];

  const title = requireString(data.title, 'title', errors, filename);
  const slug = requireString(data.slug, 'slug', errors, filename);
  const dateStr = requireString(data.date, 'date', errors, filename);
  const author = requireString(data.author, 'author', errors, filename);
  const excerpt = requireString(data.excerpt, 'excerpt', errors, filename);
  const meta_title = requireString(data.meta_title, 'meta_title', errors, filename);
  const meta_description = requireString(data.meta_description, 'meta_description', errors, filename);
  const read_time = requireString(data.read_time, 'read_time', errors, filename);

  // Date validation
  if (dateStr && !isValidDate(dateStr)) {
    errors.push({ file: filename, field: 'date', message: `invalid ISO date: "${dateStr}"` });
  }

  // read_time format
  if (read_time && !READ_TIME.test(read_time)) {
    errors.push({ file: filename, field: 'read_time', message: `malformed read_time: "${read_time}" (expected "N min")` });
  }

  // keywords must be a non-empty array of strings
  const keywords: string[] = [];
  if (!Array.isArray(data.keywords) || data.keywords.length === 0) {
    errors.push({ file: filename, field: 'keywords', message: 'keywords must be a non-empty array' });
  } else {
    for (const kw of data.keywords) {
      if (typeof kw !== 'string' || kw.trim().length === 0) {
        errors.push({ file: filename, field: 'keywords', message: `invalid keyword entry: ${JSON.stringify(kw)}` });
      } else {
        keywords.push(kw.trim());
      }
    }
  }

  // meta_title length
  if (meta_title && (meta_title.length < 30 || meta_title.length > 70)) {
    errors.push({ file: filename, field: 'meta_title', message: `length ${meta_title.length} outside 30-70 char range` });
  }

  // meta_description length
  if (meta_description && (meta_description.length < 80 || meta_description.length > 170)) {
    errors.push({ file: filename, field: 'meta_description', message: `length ${meta_description.length} outside 80-170 char range` });
  }

  // Body must not be empty
  if (content.trim().length === 0) {
    errors.push({ file: filename, field: 'content', message: 'article body is empty' });
  }

  if (errors.length > 0) {
    return { article: null, errors };
  }

  return {
    article: { title, slug, date: dateStr, author, excerpt, meta_title, meta_description, keywords, read_time, content: content.trim() },
    errors: [],
  };
}

/**
 * Parse all blog articles and validate the full corpus.
 * Returns per-file errors plus corpus-level checks (duplicate slugs).
 */
export function validateAllArticles(): { articles: Article[]; errors: ContentError[] } {
  const files = getBlogFiles();
  const allErrors: ContentError[] = [];
  const articles: Article[] = [];
  const slugsSeen = new Map<string, string>(); // slug -> first filename

  for (const file of files) {
    const { article, errors } = parseArticle(file);
    allErrors.push(...errors);
    if (article) {
      // Duplicate slug check
      if (slugsSeen.has(article.slug)) {
        allErrors.push({
          file,
          field: 'slug',
          message: `duplicate slug "${article.slug}" (also in ${slugsSeen.get(article.slug)})`,
        });
      } else {
        slugsSeen.set(article.slug, file);
      }
      articles.push(article);
    }
  }

  return { articles, errors: allErrors };
}
