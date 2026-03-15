import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildAutomationIdentity,
  getLocalTimeParts,
  shouldRunInScheduledWindow,
} from '../scripts/automation/common.mjs';
import { parseFeedDocument, selectRelevantFeedItems } from '../scripts/automation/feeds.mjs';
import { requestJsonFromGitHubModels } from '../scripts/automation/github-models.mjs';
import {
  buildExpectedArticlePlan,
  injectAffiliatePlaceholders,
  parseAffiliatePrograms,
  parseHarvestMarkdown,
  parseAffiliatePlaceholderMap,
  renderHarvestMarkdown,
  upsertPerformanceLog,
} from '../scripts/automation/renderers.mjs';

const originalEnv = { ...process.env };

test.afterEach(() => {
  process.env = { ...originalEnv };
});

test('schedule gate respects Australia/Sydney local hours across DST boundaries', () => {
  const summerRun = shouldRunInScheduledWindow({
    targetWeekday: 'sunday',
    targetHour: 20,
    options: { date: null, dryRun: false, skipScheduleGate: false },
    now: new Date('2026-01-04T09:05:00Z'),
  });
  const winterRun = shouldRunInScheduledWindow({
    targetWeekday: 'sunday',
    targetHour: 20,
    options: { date: null, dryRun: false, skipScheduleGate: false },
    now: new Date('2026-06-14T10:05:00Z'),
  });

  assert.equal(summerRun.shouldRun, true);
  assert.equal(winterRun.shouldRun, true);
  assert.equal(getLocalTimeParts(new Date('2026-03-16T18:05:00Z')).weekday, 'tuesday');
});

test('automation identity uses ISO week naming for content and performance branches', () => {
  assert.deepEqual(buildAutomationIdentity('content', '2026-03-16'), {
    weekKey: '2026-12',
    branchName: 'codex/content-week-2026-12',
    pullRequestTitle: 'Automation: content week 2026-12',
  });

  assert.deepEqual(buildAutomationIdentity('performance', '2026-03-15'), {
    weekKey: '2026-11',
    branchName: 'codex/performance-week-2026-11',
    pullRequestTitle: 'Automation: performance week 2026-11',
  });
});

test('GitHub Models client retries once when the first response is invalid JSON', async () => {
  process.env.GITHUB_TOKEN = 'test-token';
  const responses = [
    { choices: [{ message: { content: 'not valid json' } }] },
    { choices: [{ message: { content: '{"findings":[{"headline":"A","summary":"B","implication":"C","source_name":"D","source_url":"https://example.com","category":"Attack"}]}' } }] },
  ];
  let callCount = 0;

  const payload = await requestJsonFromGitHubModels({
    systemPrompt: 'test',
    userPrompt: 'test',
    validate(value: unknown) {
      assert.equal(Array.isArray((value as { findings: Array<{ source_url: string }> }).findings), true);
    },
    fetchImpl: async () =>
      new Response(JSON.stringify(responses[callCount++]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
  });

  assert.equal(callCount, 2);
  assert.equal(payload.findings[0].source_url, 'https://example.com');
});

test('feed parser and selector keep AI security stories and drop low-signal items', () => {
  const rss = `<?xml version="1.0"?>
  <rss version="2.0">
    <channel>
      <title>Example Security</title>
      <item>
        <title>Prompt injection attacks hit enterprise copilots</title>
        <link>https://example.com/copilot-attack?utm_source=test</link>
        <description><![CDATA[Researchers documented prompt injection chains affecting AI assistants and enterprise data boundaries.]]></description>
        <pubDate>Mon, 16 Mar 2026 02:00:00 GMT</pubDate>
      </item>
      <item>
        <title>Podcast: Security trends this week</title>
        <link>https://example.com/podcast</link>
        <description>Not relevant to the pipeline.</description>
        <pubDate>Mon, 16 Mar 2026 01:00:00 GMT</pubDate>
      </item>
    </channel>
  </rss>`;

  const atom = `<?xml version="1.0" encoding="utf-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom">
    <title>Example AI</title>
    <entry>
      <title>AI privacy rules tighten across Australia</title>
      <link rel="alternate" href="https://example.com/privacy-update" />
      <summary>Australian regulators updated privacy guidance for AI deployments.</summary>
      <updated>2026-03-15T08:00:00Z</updated>
      <id>tag:example.com,2026:privacy-update</id>
    </entry>
  </feed>`;

  const parsed = [
    ...parseFeedDocument(rss, { name: 'Example Security', url: 'https://example.com/rss' }),
    ...parseFeedDocument(atom, { name: 'Example AI', url: 'https://example.com/atom' }),
  ];
  const selected = selectRelevantFeedItems(parsed, { limit: 5 });

  assert.equal(parsed.length, 3);
  assert.equal(selected.length, 2);
  assert.equal(selected[0].source_url, 'https://example.com/copilot-attack');
  assert.equal(selected[1].source_url, 'https://example.com/privacy-update');
});

test('harvest renderer round-trips structured findings', () => {
  const markdown = renderHarvestMarkdown({
    date: '2026-03-16',
    weekNumber: 12,
    findings: [
      {
        headline: 'Prompt injection exploit hits enterprise agent',
        summary: 'Sentence one. Sentence two.',
        implication: 'Security teams need to review agent permissions now.',
        source_name: 'Example Source',
        source_url: 'https://example.com/story',
        category: 'Attack',
      },
      {
        headline: 'Australia updates privacy guidance',
        summary: 'Sentence one. Sentence two.',
        implication: 'Privacy compliance teams need updated assessments.',
        source_name: 'OAIC',
        source_url: 'https://example.com/privacy',
        category: 'Regulation',
      },
    ],
  });

  const parsed = parseHarvestMarkdown(markdown);
  assert.equal(parsed.length, 2);
  assert.equal(parsed[1].category, 'Regulation');
});

test('article plan resolves duplicate slugs deterministically', () => {
  const plan = buildExpectedArticlePlan(
    [
      { headline: 'Agentic AI Security Risks', category: 'Attack' },
      { headline: 'Agentic AI Security Risks', category: 'Attack' },
    ],
    new Set(['agentic-ai-security-risks']),
    '2026-03-16',
  );

  assert.equal(plan[0].slug, 'agentic-ai-security-risks-2026-03-16');
  assert.equal(plan[1].slug, 'agentic-ai-security-risks-2026-03-16-2');
});

test('affiliate placeholder injection only annotates the first matching vendor mention', () => {
  const placeholders = parseAffiliatePlaceholderMap(`
[AFFILIATE:NORDVPN] → Replace with your NordVPN affiliate link
[AFFILIATE:PROTON] → Replace with your Proton affiliate link
`);

  const result = injectAffiliatePlaceholders('NordVPN blocks trackers. Proton protects email. NordVPN also ships Threat Protection.', placeholders);

  assert.match(result.markdown, /NordVPN \(\[AFFILIATE:NORDVPN\]\)/);
  assert.match(result.markdown, /Proton \(\[AFFILIATE:PROTON\]\)/);
  assert.equal(result.injected.length, 2);
});

test('affiliate program parser derives deterministic rotation names and placeholder keys', () => {
  const programs = parseAffiliatePrograms(`
| 1 | **NordVPN** | VPN / Privacy | ... |
| 2 | **Proton (Mail/VPN/Pass)** | Encrypted Email | ... |
`);

  assert.deepEqual(programs, [
    { name: 'NordVPN', placeholderKey: 'NORDVPN' },
    { name: 'Proton (Mail/VPN/Pass)', placeholderKey: 'PROTON' },
  ]);
});

test('performance log upsert replaces placeholder row and updates same-date entries', () => {
  const initial = `# AI Security Brief — Performance Log

| Date | Subscribers | Open Rate | Click Rate | Top Link | Alerts |
|------|------------|-----------|------------|----------|--------|
| — | — | — | — | — | Awaiting first issue |
`;

  const first = upsertPerformanceLog(initial, {
    date: '2026-03-15',
    subscribers: 120,
    openRate: '42%',
    clickRate: '6%',
    topLink: 'https://aithreatbrief.com/blog/example',
    alerts: 'OK',
  });
  const second = upsertPerformanceLog(first, {
    date: '2026-03-15',
    subscribers: 125,
    openRate: '44%',
    clickRate: '7%',
    topLink: 'https://aithreatbrief.com/blog/example',
    alerts: 'OK',
  });

  assert.doesNotMatch(first, /Awaiting first issue/);
  assert.match(second, /\| 2026-03-15 \| 125 \| 44% \| 7% \| https:\/\/aithreatbrief.com\/blog\/example \| OK \|/);
});
