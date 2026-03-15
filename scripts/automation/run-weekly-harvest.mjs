#!/usr/bin/env node

import path from 'node:path';
import {
  DEFAULT_PERPLEXITY_MODEL,
  FINDING_CATEGORIES,
  REPO_ROOT,
  buildWeekKey,
  fileExists,
  readText,
  writeText,
} from './common.mjs';
import { requestJsonFromPerplexity } from './perplexity.mjs';
import { parseHarvestMarkdown, renderHarvestMarkdown } from './renderers.mjs';
import { finishAutomationRun, prepareAutomationRun, requireEnvVars } from './workflow.mjs';

function validateHarvestPayload(payload) {
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.findings)) {
    throw new Error('Harvest payload must include a findings array.');
  }

  if (payload.findings.length < 5 || payload.findings.length > 7) {
    throw new Error('Harvest payload must contain between 5 and 7 findings.');
  }

  for (const finding of payload.findings) {
    if (
      typeof finding?.headline !== 'string' ||
      typeof finding?.summary !== 'string' ||
      typeof finding?.implication !== 'string' ||
      typeof finding?.source_name !== 'string' ||
      typeof finding?.source_url !== 'string' ||
      typeof finding?.category !== 'string'
    ) {
      throw new Error('Each harvest finding must include string fields for headline, summary, implication, source_name, source_url, and category.');
    }

    if (!/^https?:\/\//.test(finding.source_url)) {
      throw new Error(`Harvest source URL is invalid: ${finding.source_url}`);
    }

    if (!FINDING_CATEGORIES.includes(finding.category)) {
      throw new Error(`Harvest category is invalid: ${finding.category}`);
    }
  }
}

async function main() {
  requireEnvVars(['PERPLEXITY_API_KEY']);

  const context = await prepareAutomationRun({
    kind: 'content',
    schedule: { weekday: 'monday', hour: 5 },
  });

  if (context.skipped) {
    return;
  }

  const model = process.env.PERPLEXITY_MODEL?.trim() || DEFAULT_PERPLEXITY_MODEL;
  const harvestPath = path.join(REPO_ROOT, 'harvests', `harvest-${context.effectiveDate}.md`);

  if (await fileExists(harvestPath)) {
    const existing = await readText(harvestPath);
    const findings = parseHarvestMarkdown(existing);

    if (findings.length >= 5) {
      await finishAutomationRun({
        context,
        commitMessage: `automation: refresh harvest ${context.effectiveDate}`,
        model,
        outputs: [`Harvest already exists: \`harvests/harvest-${context.effectiveDate}.md\``],
        notes: ['No-op run. Existing harvest file is valid.'],
      });
      return;
    }
  }

  const weekKey = buildWeekKey(context.effectiveDate);
  const payload = await requestJsonFromPerplexity({
    model,
    maxTokens: 3500,
    searchRecencyFilter: 'week',
    systemPrompt:
      'You are the weekly research desk for AI Security Brief. Return strict JSON only. No markdown fences. Use only real, authoritative sources from the last 7 days.',
    userPrompt: [
      `Prepare the weekly AI security harvest for ${context.effectiveDate} (${weekKey}).`,
      'Return JSON in this shape:',
      '{"findings":[{"headline":"string","summary":"string","implication":"string","source_name":"string","source_url":"https://...","category":"Attack|Vulnerability|Regulation|Defence|Incident|Framework"}]}',
      'Requirements:',
      '- 5 to 7 findings only.',
      '- Focus on AI-powered cyberattacks, prompt injection, model vulnerabilities, privacy regulation, AI security tooling, enterprise incidents, and agentic AI security.',
      '- Rank findings by security impact.',
      '- Summary must be exactly 2 sentences.',
      '- Implication must be exactly 1 sentence.',
      '- Every source URL must be directly usable and real.',
      '- Do not invent citations or placeholder URLs.',
    ].join('\n'),
    validate: validateHarvestPayload,
  });

  const { isoWeek } = (() => {
    const [year, month, day] = context.effectiveDate.split('-').map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day));
    const dayNumber = utcDate.getUTCDay() || 7;
    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNumber);
    const isoYearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil((((utcDate.getTime() - isoYearStart.getTime()) / 86400000) + 1) / 7);
    return { isoWeek: weekNumber };
  })();

  const markdown = renderHarvestMarkdown({
    date: context.effectiveDate,
    weekNumber: isoWeek,
    findings: payload.findings,
  });

  await writeText(harvestPath, markdown);

  await finishAutomationRun({
    context,
    commitMessage: `automation: add harvest ${context.effectiveDate}`,
    model,
    outputs: [
      `Harvest generated: \`harvests/harvest-${context.effectiveDate}.md\``,
      `Finding count: ${payload.findings.length}`,
    ],
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
