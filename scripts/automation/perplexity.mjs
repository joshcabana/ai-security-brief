#!/usr/bin/env node

import { DEFAULT_PERPLEXITY_MODEL, PERPLEXITY_API_URL } from './common.mjs';

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

/**
 * @param {{
 *   systemPrompt: string;
 *   userPrompt: string;
 *   validate: (value: unknown) => void;
 *   model?: string;
 *   maxTokens?: number;
 *   temperature?: number;
 *   searchRecencyFilter?: string;
 *   fetchImpl?: typeof fetch;
 * }} options
 */
export async function requestJsonFromPerplexity({
  systemPrompt,
  userPrompt,
  validate,
  model = process.env.PERPLEXITY_MODEL || DEFAULT_PERPLEXITY_MODEL,
  maxTokens = 4000,
  temperature = 0.2,
  searchRecencyFilter = undefined,
  fetchImpl = fetch,
}) {
  const apiKey = process.env.PERPLEXITY_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY is required for automation workflows.');
  }

  const attempts = [
    userPrompt,
    `${userPrompt}\n\nPrevious response was invalid. Return valid JSON only with no markdown fences, no commentary, and no omitted fields.`,
  ];

  let lastError = null;

  for (const prompt of attempts) {
    const response = await fetchImpl(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        temperature,
        max_tokens: maxTokens,
        search_mode: 'web',
        search_language_filter: ['en'],
        ...(searchRecencyFilter ? { search_recency_filter: searchRecencyFilter } : {}),
        web_search_options: {
          user_location: {
            country: 'AU',
          },
        },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Perplexity API request failed with ${response.status}: ${body}`);
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;

    if (typeof content !== 'string' || content.trim().length === 0) {
      lastError = new Error('Perplexity API returned an empty completion.');
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

  throw lastError ?? new Error('Perplexity API did not return valid JSON.');
}
