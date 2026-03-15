#!/usr/bin/env node

import { DEFAULT_GITHUB_MODELS_MODEL, GITHUB_MODELS_API_URL } from './common.mjs';

function extractJsonCandidate(content) {
  const trimmed = content.trim();

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return trimmed;
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  const firstBracket = trimmed.indexOf('[');
  const lastBracket = trimmed.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    return trimmed.slice(firstBracket, lastBracket + 1);
  }

  return trimmed;
}

function resolveToken() {
  const token = process.env.GITHUB_MODELS_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim();

  if (!token) {
    throw new Error('GITHUB_TOKEN or GITHUB_MODELS_TOKEN is required for GitHub Models automation.');
  }

  return token;
}

/**
 * @param {{
 *   systemPrompt: string;
 *   userPrompt: string;
 *   validate: (value: unknown) => void;
 *   model?: string;
 *   maxTokens?: number;
 *   temperature?: number;
 *   fetchImpl?: typeof fetch;
 * }} options
 */
export async function requestJsonFromGitHubModels({
  systemPrompt,
  userPrompt,
  validate,
  model = process.env.GITHUB_MODELS_MODEL || DEFAULT_GITHUB_MODELS_MODEL,
  maxTokens = 4000,
  temperature = 0.2,
  fetchImpl = fetch,
}) {
  const token = resolveToken();
  const attempts = [
    userPrompt,
    `${userPrompt}\n\nPrevious response was invalid. Return valid JSON only with no markdown fences, no commentary, and no omitted fields.`,
  ];

  let lastError = null;

  for (const prompt of attempts) {
    const response = await fetchImpl(GITHUB_MODELS_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`GitHub Models request failed with ${response.status}: ${body}`);
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;

    if (typeof content !== 'string' || content.trim().length === 0) {
      lastError = new Error('GitHub Models returned an empty completion.');
      continue;
    }

    try {
      const parsed = JSON.parse(extractJsonCandidate(content));
      validate(parsed);
      return parsed;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown JSON validation error.');
    }
  }

  throw lastError ?? new Error('GitHub Models did not return valid JSON.');
}
