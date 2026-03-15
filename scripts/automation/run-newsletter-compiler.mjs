#!/usr/bin/env node

import path from 'node:path';
import { promises as fs } from 'node:fs';
import matter from 'gray-matter';
import {
  DEFAULT_PERPLEXITY_MODEL,
  REPO_ROOT,
  fileExists,
  readText,
  writeText,
} from './common.mjs';
import { requestJsonFromPerplexity } from './perplexity.mjs';
import {
  getNextNewsletterIssueNumber,
  parseAffiliatePrograms,
  parseAffiliatePlaceholderMap,
  parseHarvestMarkdown,
  renderNewsletterDraft,
} from './renderers.mjs';
import { finishAutomationRun, prepareAutomationRun, requireEnvVars } from './workflow.mjs';

function validateNewsletterPayload(payload) {
  if (
    !payload ||
    typeof payload !== 'object' ||
    !Array.isArray(payload.subject_lines) ||
    payload.subject_lines.length !== 2 ||
    typeof payload.preview_text !== 'string' ||
    !Array.isArray(payload.intro) ||
    !Array.isArray(payload.signals) ||
    payload.signals.length !== 3 ||
    !payload.tool_of_week ||
    !Array.isArray(payload.next_week) ||
    payload.next_week.length < 2
  ) {
    throw new Error('Newsletter payload is missing required fields.');
  }
}

async function main() {
  requireEnvVars(['PERPLEXITY_API_KEY']);

  const context = await prepareAutomationRun({
    kind: 'content',
    schedule: { weekday: 'monday', hour: 13 },
  });

  if (context.skipped) {
    return;
  }

  const model = process.env.PERPLEXITY_MODEL?.trim() || DEFAULT_PERPLEXITY_MODEL;
  const harvestPath = path.join(REPO_ROOT, 'harvests', `harvest-${context.effectiveDate}.md`);
  const draftPath = path.join(REPO_ROOT, 'drafts', `newsletter-${context.effectiveDate}.md`);

  if (!(await fileExists(harvestPath))) {
    throw new Error(`Missing prerequisite harvest file: harvests/harvest-${context.effectiveDate}.md`);
  }

  if (await fileExists(draftPath)) {
    await finishAutomationRun({
      context,
      commitMessage: `automation: refresh newsletter draft ${context.effectiveDate}`,
      model,
      outputs: [`Newsletter draft already exists: \`drafts/newsletter-${context.effectiveDate}.md\``],
      notes: ['No-op run. Weekly newsletter draft is already present.'],
    });
    return;
  }

  const blogDirectory = path.join(REPO_ROOT, 'blog');
  const articleFiles = (await fs.readdir(blogDirectory)).filter((entry) => entry.endsWith('.md')).sort();
  const datedArticles = [];

  for (const fileName of articleFiles) {
    const source = await readText(path.join(blogDirectory, fileName));
    const parsed = matter(source);
    if (parsed.data?.date === context.effectiveDate) {
      datedArticles.push({
        slug: String(parsed.data.slug),
        title: String(parsed.data.title),
        excerpt: String(parsed.data.excerpt),
        path: `blog/${fileName}`,
      });
    }
  }

  if (datedArticles.length < 2) {
    throw new Error(`Newsletter compiler requires 2 dated article drafts for ${context.effectiveDate}.`);
  }

  const harvestFindings = parseHarvestMarkdown(await readText(harvestPath));
  const affiliatePrograms = await readText(path.join(REPO_ROOT, 'affiliate-programs.md'));
  const placeholders = parseAffiliatePlaceholderMap(affiliatePrograms);
  const programs = parseAffiliatePrograms(affiliatePrograms);
  const selectedProgram = programs[(Number(context.identity.weekKey.split('-')[1]) - 1) % programs.length];
  const toolPlaceholder = selectedProgram ? placeholders.get(selectedProgram.placeholderKey) : null;

  if (!toolPlaceholder || !selectedProgram) {
    throw new Error('Affiliate program rotation could not be resolved from affiliate-programs.md');
  }

  const draftFiles = (await fs.readdir(path.join(REPO_ROOT, 'drafts'))).filter((entry) => entry.startsWith('newsletter-') && entry.endsWith('.md'));
  const issueNumber = getNextNewsletterIssueNumber({
    publishedIssueExists: await fileExists(path.join(REPO_ROOT, 'newsletter-issue-001.md')),
    draftCount: draftFiles.length,
  });

  const payload = await requestJsonFromPerplexity({
    model,
    maxTokens: 4500,
    searchRecencyFilter: 'week',
    systemPrompt:
      'You are the newsletter editor for AI Security Brief. Return strict JSON only. No markdown fences. Do not publish or reference any email platform UI.',
    userPrompt: [
      `Compile the weekly newsletter draft for ${context.effectiveDate}.`,
      `Issue number: ${issueNumber}.`,
      `Top three weekly findings:\n${harvestFindings.slice(0, 3).map((finding, index) => `${index + 1}. ${finding.headline} — ${finding.summary}`).join('\n')}`,
      `Article drafts:\n${datedArticles.slice(0, 2).map((article) => `- ${article.title} (/blog/${article.slug}) — ${article.excerpt}`).join('\n')}`,
      `Tool of the week: ${selectedProgram.name} with placeholder ${toolPlaceholder}`,
      'Return JSON in this shape:',
      '{"subject_lines":["string","string"],"preview_text":"string","intro":["paragraph","paragraph"],"signals":[{"headline":"string","summary":"string","article_slug":"string|null","article_title":"string|null","source_name":"string|null","source_url":"https://...|null"}],"tool_of_week":{"program_name":"string","description":"string","placeholder":"[AFFILIATE:KEY]"},"next_week":["item","item","item"]}',
      'Requirements:',
      '- Exactly 3 signals.',
      '- Signals 1 and 2 must link to the two current article drafts by slug.',
      '- Signal 3 may link to a source URL if there is no draft article.',
      '- Keep the preview text under 150 characters.',
      '- Keep subject lines under 50 characters.',
    ].join('\n'),
    validate: validateNewsletterPayload,
  });

  const draft = renderNewsletterDraft({
    date: context.effectiveDate,
    issueNumber,
    subjectLines: payload.subject_lines,
    previewText: payload.preview_text,
    intro: payload.intro,
    signals: payload.signals,
    toolOfWeek: {
      ...payload.tool_of_week,
      program_name: selectedProgram.name,
      placeholder: toolPlaceholder,
    },
    nextWeek: payload.next_week,
  });

  await writeText(draftPath, draft);

  await finishAutomationRun({
    context,
    commitMessage: `automation: add newsletter draft ${context.effectiveDate}`,
    model,
    outputs: [`Newsletter draft generated: \`drafts/newsletter-${context.effectiveDate}.md\``],
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
