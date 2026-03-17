import assert from 'node:assert/strict';
import test from 'node:test';
import { getAffiliateUrl, getAffiliateUrlByPriority, replaceAffiliateTokens } from '../lib/affiliate-links';
import { parseArticleSource } from '../lib/articles';

test('getAffiliateUrl returns null for missing and blank environment values', () => {
  assert.equal(getAffiliateUrl('NORDVPN', {}), null);
  assert.equal(getAffiliateUrl('NORDVPN', { AFFILIATE_NORDVPN: '   ' }), null);
});

test('getAffiliateUrl trims configured environment values', () => {
  assert.equal(
    getAffiliateUrl('NORDVPN', { AFFILIATE_NORDVPN: ' https://example.com/nordvpn ' }),
    'https://example.com/nordvpn',
  );
});

test('getAffiliateUrlByPriority returns the first configured affiliate url', () => {
  assert.equal(
    getAffiliateUrlByPriority(
      ['PROTON_VPN', 'PROTON'],
      {
        AFFILIATE_PROTON: 'https://example.com/proton',
        AFFILIATE_PROTON_VPN: 'https://example.com/proton-vpn',
      },
    ),
    'https://example.com/proton-vpn',
  );
});

test('getAffiliateUrlByPriority falls back to later configured affiliate urls', () => {
  assert.equal(
    getAffiliateUrlByPriority(
      ['PROTON_VPN', 'PROTON'],
      {
        AFFILIATE_PROTON: 'https://example.com/proton',
      },
    ),
    'https://example.com/proton',
  );
  assert.equal(getAffiliateUrlByPriority(['PROTON_VPN', 'PROTON'], {}), null);
});

test('replaceAffiliateTokens resolves configured markdown affiliate links', () => {
  const result = replaceAffiliateTokens(
    'Use [NordVPN]([AFFILIATE:NORDVPN]) and [PureVPN]([AFFILIATE:PUREVPN]).',
    {
      AFFILIATE_NORDVPN: 'https://example.com/nordvpn',
      AFFILIATE_PUREVPN: 'https://example.com/purevpn',
    },
  );

  assert.equal(
    result,
    'Use [NordVPN](https://example.com/nordvpn) and [PureVPN](https://example.com/purevpn).',
  );
});

test('replaceAffiliateTokens degrades markdown links to plain text when env vars are missing', () => {
  const result = replaceAffiliateTokens(
    'Use [NordVPN]([AFFILIATE:NORDVPN]) today.',
    {},
  );

  assert.equal(result, 'Use NordVPN today.');
});

test('replaceAffiliateTokens only resolves bare placeholders with configured urls', () => {
  const result = replaceAffiliateTokens(
    'Primary [AFFILIATE:NORDVPN] secondary [AFFILIATE:PUREVPN].',
    {
      AFFILIATE_NORDVPN: 'https://example.com/nordvpn',
    },
  );

  assert.equal(
    result,
    'Primary https://example.com/nordvpn secondary [AFFILIATE:PUREVPN].',
  );
});

test('parseArticleSource renders resolved affiliate links into article html', async () => {
  const previousNordVpnValue = process.env.AFFILIATE_NORDVPN;
  process.env.AFFILIATE_NORDVPN = 'https://example.com/nordvpn';

  try {
    const article = await parseArticleSource(
      'example.md',
      `---
title: "Example"
slug: "example"
date: "2026-03-17"
author: "AI Security Brief"
excerpt: "Example excerpt."
category: "AI Threats"
featured: false
meta_title: "Example Meta Title"
meta_description: "Example meta description."
keywords:
  - one
  - two
  - three
  - four
  - five
read_time: "5 min"
---

# Example

Use [NordVPN]([AFFILIATE:NORDVPN]) when you need it.
`,
    );

    assert.match(article.body, /\[NordVPN\]\(https:\/\/example\.com\/nordvpn\)/);
    assert.match(article.contentHtml, /href="https:\/\/example\.com\/nordvpn"/);
  } finally {
    if (typeof previousNordVpnValue === 'string') {
      process.env.AFFILIATE_NORDVPN = previousNordVpnValue;
    } else {
      delete process.env.AFFILIATE_NORDVPN;
    }
  }
});
