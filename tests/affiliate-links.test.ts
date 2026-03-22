import assert from 'node:assert/strict';
import test from 'node:test';
import { getAffiliateUrl, getAffiliateUrlByPriority, replaceAffiliateTokens } from '../lib/affiliate-links';
import { getArticleCacheKey, parseArticleSource } from '../lib/articles';

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

test('getAffiliateUrl returns null for malformed urls with unresolved placeholders', () => {
  assert.equal(
    getAffiliateUrl(
      'PROTON_VPN',
      {
        AFFILIATE_PROTON_VPN:
          'https://go.getproton.me/aff_c?offer_id=32&aff_id=2914&url_id=471&ad_id={eventId}&pubcid={pubcid}',
      },
    ),
    null,
  );
});

test('getAffiliateUrl returns null for invalid urls', () => {
  assert.equal(getAffiliateUrl('NORDVPN', { AFFILIATE_NORDVPN: 'not-a-url' }), null);
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

test('getArticleCacheKey returns a stable snapshot for configured affiliate env values', () => {
  const cacheKey = getArticleCacheKey({
    AFFILIATE_PUREVPN: ' https://example.com/purevpn ',
    AFFILIATE_NORDVPN: 'https://example.com/nordvpn',
    NEXT_PUBLIC_SITE_URL: 'https://ignored.example.com',
  });

  assert.equal(
    cacheKey,
    'AFFILIATE_NORDVPN=https://example.com/nordvpn\x00AFFILIATE_PUREVPN=https://example.com/purevpn',
  );
});

test('getArticleCacheKey ignores unrelated env vars and blank affiliate values', () => {
  assert.equal(
    getArticleCacheKey({
      AFFILIATE_NORDVPN: '   ',
      AFFILIATE_PUREVPN: '\n',
      NEXT_PUBLIC_SITE_URL: 'https://ignored.example.com',
      OTHER_SETTING: 'still ignored',
    }),
    '',
  );
});

test('getArticleCacheKey changes when affiliate env values change', () => {
  const baseKey = getArticleCacheKey({
    AFFILIATE_NORDVPN: 'https://example.com/nordvpn',
  });
  const changedKey = getArticleCacheKey({
    AFFILIATE_NORDVPN: 'https://example.com/nordvpn-updated',
  });

  assert.notEqual(baseKey, changedKey);
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
