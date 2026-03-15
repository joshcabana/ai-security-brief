#!/usr/bin/env node

import matter from 'gray-matter';
import path from 'node:path';
import { countWords, escapeRegex, FINDING_CATEGORIES, REPO_ROOT, slugify } from './common.mjs';

const CTA_LINE = '**Stay ahead of AI security threats.** Subscribe to the AI Security Brief newsletter for weekly intelligence. [Subscribe now →](/newsletter)';

const CATEGORY_MAP = {
  Regulation: 'Privacy',
  Attack: 'AI Threats',
  Vulnerability: 'AI Threats',
  Defence: 'AI Threats',
  Incident: 'AI Threats',
  Framework: 'AI Threats',
};

function quote(value) {
  return JSON.stringify(value);
}

function renderFrontmatter(frontmatter) {
  const lines = ['---'];

  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - ${quote(item)}`);
      }
      continue;
    }

    lines.push(`${key}: ${typeof value === 'boolean' ? String(value) : quote(String(value))}`);
  }

  lines.push('---', '');
  return lines.join('\n');
}

export function validateFindingCategory(value) {
  if (!FINDING_CATEGORIES.includes(value)) {
    throw new Error(`Invalid finding category: ${value}`);
  }
}

export function renderHarvestMarkdown({ date, weekNumber, findings }) {
  const sections = findings.map((finding, index) => {
    validateFindingCategory(finding.category);
    return [
      `### ${index + 1}. ${finding.headline}`,
      `**Summary:** ${finding.summary}`,
      `**Key Implication:** ${finding.implication}`,
      `**Source:** [${finding.source_name}](${finding.source_url})`,
      `**Category:** ${finding.category}`,
      '',
    ].join('\n');
  });

  return [
    renderFrontmatter({
      date,
      week_number: String(weekNumber),
      finding_count: String(findings.length),
    }),
    `# AI Security Harvest — Week of ${date}`,
    '',
    ...sections,
    '---',
    `*Harvested by AI Security Brief on ${date}*`,
    '',
  ].join('\n');
}

export function parseHarvestMarkdown(markdown) {
  const { content } = matter(markdown);
  const pattern = /###\s+\d+\.\s+(.+?)\n\*\*Summary:\*\*\s+(.+?)\n\*\*Key Implication:\*\*\s+(.+?)\n\*\*Source:\*\*\s+\[(.+?)\]\((https?:\/\/[^\s)]+)\)\n\*\*Category:\*\*\s+(.+?)\n/gs;
  const findings = [];
  let match = pattern.exec(content);

  while (match) {
    findings.push({
      headline: match[1].trim(),
      summary: match[2].trim(),
      implication: match[3].trim(),
      source_name: match[4].trim(),
      source_url: match[5].trim(),
      category: match[6].trim(),
    });
    match = pattern.exec(content);
  }

  return findings;
}

export function resolveArticleCategory(findingCategory) {
  return CATEGORY_MAP[findingCategory] ?? 'AI Threats';
}

function calculateReadTime(text) {
  return `${Math.max(5, Math.round(countWords(text) / 180))} min`;
}

export function renderArticleMarkdown({ article, date }) {
  const intro = article.intro.map((paragraph) => paragraph.trim()).join('\n\n');
  const sections = article.sections
    .map((section) => [`## ${section.heading}`, '', ...section.paragraphs.map((paragraph) => paragraph.trim()), ''].join('\n'))
    .join('\n');
  const keyTakeaways = [
    '## Key Takeaways',
    '',
    ...article.key_takeaways.map((item) => `- ${item.trim()}`),
    '',
  ].join('\n');
  const references = [
    '## References',
    '',
    ...article.references.map(
      (reference, index) =>
        `${index + 1}. ${reference.source_name} — ${reference.title}. [${reference.url}](${reference.url})`,
    ),
    '',
  ].join('\n');
  const body = [
    `# ${article.title}`,
    '',
    intro,
    '',
    sections.trim(),
    '',
    keyTakeaways.trim(),
    '',
    references.trim(),
    '',
    CTA_LINE,
    '',
  ].join('\n');

  const frontmatter = renderFrontmatter({
    title: article.title,
    slug: article.slug,
    date,
    author: 'AI Security Brief',
    excerpt: article.excerpt,
    category: article.category,
    featured: false,
    meta_title: article.meta_title,
    meta_description: article.meta_description,
    keywords: article.keywords,
    read_time: calculateReadTime(body),
  });

  return `${frontmatter}${body}`;
}

export function parseAffiliatePlaceholderMap(markdown) {
  const placeholderPattern = /\[AFFILIATE:([A-Z0-9]+)\]\s*→/g;
  const placeholders = new Map();
  let match = placeholderPattern.exec(markdown);

  while (match) {
    placeholders.set(match[1], `[AFFILIATE:${match[1]}]`);
    match = placeholderPattern.exec(markdown);
  }

  return placeholders;
}

export function parseAffiliatePrograms(markdown) {
  const lines = markdown.split('\n');
  const programs = [];

  for (const line of lines) {
    if (!line.startsWith('|') || line.includes('Program') || line.includes('---')) {
      continue;
    }

    const cells = line
      .split('|')
      .map((entry) => entry.trim())
      .filter(Boolean);

    if (cells.length < 3) {
      continue;
    }

    const rawName = cells[1].replace(/\*\*/g, '').trim();
    const placeholderKey = rawName
      .replace(/\s*\(.+?\)/g, '')
      .replace(/\s+/g, '')
      .replace(/[^A-Za-z0-9]/g, '')
      .toUpperCase();

    programs.push({
      name: rawName,
      placeholderKey,
    });
  }

  return programs;
}

export function injectAffiliatePlaceholders(markdown, placeholders) {
  const replacements = [
    ['NordVPN', 'NORDVPN'],
    ['Proton', 'PROTON'],
    ['Surfshark', 'SURFSHARK'],
    ['1Password', '1PASSWORD'],
    ['Malwarebytes', 'MALWAREBYTES'],
    ['PureVPN', 'PUREVPN'],
    ['CyberGhost', 'CYBERGHOST'],
    ['Jasper AI', 'JASPER'],
    ['Jasper', 'JASPER'],
  ];

  let output = markdown;
  const injected = [];

  for (const [label, key] of replacements) {
    const placeholder = placeholders.get(key);
    if (!placeholder || output.includes(placeholder)) {
      continue;
    }

    const pattern = new RegExp(`\\b${escapeRegex(label)}\\b`, 'i');
    if (!pattern.test(output)) {
      continue;
    }

    output = output.replace(pattern, (match) => `${match} (${placeholder})`);
    injected.push(label);
  }

  return {
    markdown: output,
    injected,
  };
}

export function renderNewsletterDraft({
  date,
  issueNumber,
  subjectLines,
  previewText,
  intro,
  signals,
  toolOfWeek,
  nextWeek,
}) {
  const signalBlocks = signals.map((signal, index) => {
    const block = [
      `### 📡 SIGNAL ${index + 1}: ${signal.headline}`,
      signal.summary,
    ];

    if (signal.article_slug && signal.article_title) {
      block.push(`**[Read the full analysis → ${signal.article_title}](/blog/${signal.article_slug})**`);
    } else if (signal.source_url) {
      block.push(`**[Source → ${signal.source_name}](${signal.source_url})**`);
    }

    return block.join('\n\n');
  });

  const lines = [
    `# Newsletter Issue #${issueNumber} — AI Security Brief`,
    '',
    '## Email Configuration',
    '',
    '**Subject Line A/B Options:**',
    `- **A**: ${subjectLines[0]}`,
    `- **B**: ${subjectLines[1]}`,
    '',
    `**Preview Text:** ${previewText}`,
    '',
    '---',
    '',
    '## Email Body',
    '',
    '### Header',
    '',
    '**AI SECURITY BRIEF**  ',
    '*Intelligence on AI-Powered Threats & Privacy Defence*',
    '',
    `THE BRIEF — ${date} | Issue #${issueNumber}`,
    '',
    '---',
    '',
    ...intro,
    '',
    '---',
    '',
    signalBlocks.join('\n\n---\n\n'),
    '',
    '---',
    '',
    `### 🛡️ TOOL OF THE WEEK: ${toolOfWeek.program_name}`,
    toolOfWeek.description,
    `**[Try ${toolOfWeek.program_name} → ${toolOfWeek.placeholder}](/tools)**`,
    '',
    '---',
    '',
    "### What's Next",
    '',
    ...nextWeek.map((item) => `- ${item}`),
    '',
    '---',
    '',
    '### Stay Sharp',
    '',
    'AI Security Brief publishes every Monday. Forward this to a colleague who should be reading it.',
    '',
    'Was this forwarded to you? **[Subscribe here →](/newsletter)**',
    '',
    '---',
    '',
    '*You’re receiving this because you subscribed to AI Security Brief.*  ',
    '*[Unsubscribe](#) | [Preferences](#) | [View in browser](#)*  ',
    '',
    '*© 2026 AI Security Brief. All rights reserved.*',
    '',
  ];

  return lines.join('\n');
}

export function getNextNewsletterIssueNumber({ publishedIssueExists, draftCount }) {
  return (publishedIssueExists ? 1 : 0) + draftCount + 1;
}

export function resolveUniqueSlug(baseSlug, existingSlugs, dateString) {
  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  const datedSlug = `${baseSlug}-${dateString}`;
  if (!existingSlugs.has(datedSlug)) {
    return datedSlug;
  }

  let index = 2;
  while (existingSlugs.has(`${datedSlug}-${index}`)) {
    index += 1;
  }
  return `${datedSlug}-${index}`;
}

export function buildExpectedArticlePlan(findings, existingSlugs, dateString) {
  return findings.slice(0, 2).map((finding) => {
    const baseSlug = slugify(finding.headline);
    const slug = resolveUniqueSlug(baseSlug, existingSlugs, dateString);
    existingSlugs.add(slug);

    return {
      slug,
      headline: finding.headline,
      finding,
      category: resolveArticleCategory(finding.category),
      filePath: path.join(REPO_ROOT, 'blog', `${slug}.md`),
    };
  });
}

export function upsertPerformanceLog(existingMarkdown, row) {
  const lines = existingMarkdown.trimEnd().split('\n');
  const headerLines = lines.filter((line) => !line.startsWith('|') || line.includes('Date') || line.includes('------'));
  const tableRows = lines.filter((line) => line.startsWith('|') && !line.includes('Date') && !line.includes('------'));
  const filteredRows = tableRows.filter((line) => !line.startsWith('| — |'));
  const rowMap = new Map();

  for (const current of filteredRows) {
    const parts = current.split('|').map((entry) => entry.trim());
    const date = parts[1];
    if (date) {
      rowMap.set(date, current);
    }
  }

  rowMap.set(
    row.date,
    `| ${row.date} | ${row.subscribers} | ${row.openRate} | ${row.clickRate} | ${row.topLink} | ${row.alerts} |`,
  );

  const sortedRows = Array.from(rowMap.entries())
    .sort((left, right) => right[0].localeCompare(left[0]))
    .map((entry) => entry[1]);

  return [
    '# AI Security Brief — Performance Log',
    '',
    '| Date | Subscribers | Open Rate | Click Rate | Top Link | Alerts |',
    '|------|------------|-----------|------------|----------|--------|',
    ...sortedRows,
    '',
  ].join('\n');
}
