import { promises as fs } from 'node:fs';
import path from 'node:path';
import { BLOG_DIR } from '../lib/articles.ts';

export const VALID_FRONTMATTER = `---
title: Test Article
slug: test-article
date: '2025-01-01'
author: Test Author
excerpt: Test excerpt.
category: Test Category
featured: false
meta_title: Meta Title
meta_description: Meta description.
keywords:
  - keyword1
  - keyword2
read_time: 5 min
---
`;

export async function setupBlogDir(): Promise<void> {
  await fs.mkdir(BLOG_DIR, { recursive: true });
}

export async function teardownBlogDir(): Promise<void> {
  await fs.rm(BLOG_DIR, { recursive: true, force: true });
}

export async function writeArticle(fileName: string, content: string): Promise<void> {
  await fs.writeFile(path.join(BLOG_DIR, fileName), content, 'utf-8');
}
