import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'blog');

function getBlogFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const READ_TIME = /^\d+\s*min$/;

const REQUIRED_FIELDS = [
  'title',
  'slug',
  'date',
  'author',
  'excerpt',
  'meta_title',
  'meta_description',
  'keywords',
  'read_time',
] as const;

describe('Blog content validation', () => {
  const files = getBlogFiles();

  it('has at least one blog article', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    describe(file, () => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
      const { data, content } = matter(raw);

      it('has all required frontmatter fields', () => {
        for (const field of REQUIRED_FIELDS) {
          expect(data, `missing field: ${field}`).toHaveProperty(field);
          if (field === 'keywords') {
            expect(Array.isArray(data.keywords), 'keywords must be an array').toBe(true);
            expect(data.keywords.length, 'keywords must not be empty').toBeGreaterThan(0);
          } else {
            expect(typeof data[field], `${field} must be a string`).toBe('string');
            expect((data[field] as string).trim().length, `${field} must not be empty`).toBeGreaterThan(0);
          }
        }
      });

      it('has a valid ISO date', () => {
        expect(ISO_DATE.test(data.date), `date "${data.date}" is not YYYY-MM-DD`).toBe(true);
        const d = new Date(data.date + 'T00:00:00Z');
        expect(isNaN(d.getTime()), `date "${data.date}" is not a real calendar date`).toBe(false);
      });

      it('has valid read_time format', () => {
        expect(READ_TIME.test(data.read_time), `read_time "${data.read_time}" doesn't match "N min"`).toBe(true);
      });

      it('has meta_title between 30-70 chars', () => {
        const len = (data.meta_title as string).length;
        expect(len, `meta_title length ${len}`).toBeGreaterThanOrEqual(30);
        expect(len, `meta_title length ${len}`).toBeLessThanOrEqual(70);
      });

      it('has meta_description between 80-170 chars', () => {
        const len = (data.meta_description as string).length;
        expect(len, `meta_description length ${len}`).toBeGreaterThanOrEqual(80);
        expect(len, `meta_description length ${len}`).toBeLessThanOrEqual(170);
      });

      it('has non-empty body content', () => {
        expect(content.trim().length).toBeGreaterThan(100);
      });

      it('has slug matching filename', () => {
        const expectedSlug = file.replace(/\.md$/, '');
        expect(data.slug).toBe(expectedSlug);
      });
    });
  }

  it('has no duplicate slugs', () => {
    const slugs = files.map((f) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, f), 'utf-8');
      return matter(raw).data.slug;
    });
    const unique = new Set(slugs);
    expect(unique.size, `duplicate slugs found: ${slugs.filter((s, i) => slugs.indexOf(s) !== i)}`).toBe(slugs.length);
  });
});
