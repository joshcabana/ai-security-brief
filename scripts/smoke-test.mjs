import assert from 'node:assert/strict';
import { createServer as createHttpServer } from 'node:http';
import net from 'node:net';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';

const repoDir = process.cwd();

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();

      if (!address || typeof address === 'string') {
        reject(new Error('Could not resolve a free port.'));
        return;
      }

      const { port } = address;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(port);
      });
    });
    server.on('error', reject);
  });
}

async function waitForServer(url, label) {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Retry until timeout.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${label}.`);
}

function startApp(port, extraEnv = {}) {
  const child = spawn('pnpm', ['start', '-p', String(port)], {
    cwd: repoDir,
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: `http://127.0.0.1:${port}`,
      ...extraEnv,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let logs = '';

  child.stdout.on('data', (chunk) => {
    logs += chunk.toString();
  });
  child.stderr.on('data', (chunk) => {
    logs += chunk.toString();
  });

  return {
    child,
    getLogs() {
      return logs;
    },
    async stop() {
      if (child.exitCode !== null) {
        return;
      }

      child.kill('SIGINT');
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          if (child.exitCode === null) {
            child.kill('SIGKILL');
          }
        }, 5_000);

        child.once('exit', () => {
          clearTimeout(timeout);
          resolve();
        });
        child.once('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });
    },
  };
}

async function startMockBeehiivServer() {
  const port = await findFreePort();
  const server = createHttpServer(async (request, response) => {
    if (
      request.method !== 'POST' ||
      request.url !== '/v2/publications/test-publication/subscriptions'
    ) {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ message: 'Not found' }));
      return;
    }

    let requestBody = '';
    for await (const chunk of request) {
      requestBody += chunk.toString();
    }

    const payload = JSON.parse(requestBody);
    if (payload.email === 'error@example.com') {
      response.writeHead(422, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ errors: [{ message: 'Mock Beehiiv rejected the signup request.' }] }));
      return;
    }

    response.writeHead(201, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ data: { id: 'sub_123', email: payload.email } }));
  });

  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    async stop() {
      await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    },
  };
}

function extractArticleLinks(html, knownSlugs) {
  return knownSlugs.filter((slug) => html.includes(`/blog/${slug}`));
}

async function requestJson(url, init) {
  const response = await fetch(url, init);
  return {
    response,
    payload: await response.json(),
  };
}

async function main() {
  const manifest = JSON.parse(
    await readFile(path.join(repoDir, 'content-manifest.json'), 'utf8'),
  );
  const articleSlugs = manifest.articles.map((article) => article.slug);
  const privacyArticle = manifest.articles.find((article) => article.category === 'Privacy');
  assert.ok(privacyArticle, 'Expected one Privacy article in content-manifest.json.');

  const coldStartPort = await findFreePort();
  const coldStartApp = startApp(coldStartPort);

  try {
    await waitForServer(`http://127.0.0.1:${coldStartPort}/`, 'cold-start production server');

    const homeHtml = await fetch(`http://127.0.0.1:${coldStartPort}/`).then((response) => response.text());
    for (const slug of articleSlugs) {
      assert.match(homeHtml, new RegExp(`/blog/${slug}`), `Expected homepage to link to ${slug}.`);
    }

    const privacyHtml = await fetch(`http://127.0.0.1:${coldStartPort}/blog?category=Privacy`).then((response) => response.text());
    assert.deepEqual(extractArticleLinks(privacyHtml, articleSlugs), [`${privacyArticle.slug}`]);

    for (const article of manifest.articles) {
      const articleHtml = await fetch(`http://127.0.0.1:${coldStartPort}/blog/${article.slug}`).then((response) => response.text());
      assert.match(articleHtml, new RegExp(article.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      assert.match(articleHtml, new RegExp(article.category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      assert.match(articleHtml, /Back to all articles/);
      assert.match(articleHtml, /Browse tools/);
    }

    const toolsHtml = await fetch(`http://127.0.0.1:${coldStartPort}/tools`).then((response) => response.text());
    assert.match(toolsHtml, /plain vendor URLs/);

    const newsletterHtml = await fetch(`http://127.0.0.1:${coldStartPort}/newsletter`).then((response) => response.text());
    assert.match(newsletterHtml, /real status message either way/);
    assert.match(newsletterHtml, /Beehiiv credentials live in runtime environment variables/);

    const missingConfigResult = await requestJson(`http://127.0.0.1:${coldStartPort}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'reader@example.com' }),
    });
    assert.equal(missingConfigResult.response.status, 503);
    assert.equal(
      missingConfigResult.payload.message,
      'Newsletter signup is not configured yet. Add BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID first.',
    );
  } finally {
    await coldStartApp.stop();
  }

  const mockBeehiiv = await startMockBeehiivServer();
  const configuredPort = await findFreePort();
  const configuredApp = startApp(configuredPort, {
    BEEHIIV_API_KEY: 'smoke-test-key',
    BEEHIIV_PUBLICATION_ID: 'test-publication',
    BEEHIIV_API_BASE_URL: mockBeehiiv.baseUrl,
  });

  try {
    await waitForServer(`http://127.0.0.1:${configuredPort}/`, 'configured production server');

    const invalidJsonResult = await requestJson(`http://127.0.0.1:${configuredPort}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"email"',
    });
    assert.equal(invalidJsonResult.response.status, 400);
    assert.equal(invalidJsonResult.payload.message, 'The signup request body was invalid JSON.');

    const invalidEmailResult = await requestJson(`http://127.0.0.1:${configuredPort}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' }),
    });
    assert.equal(invalidEmailResult.response.status, 400);
    assert.equal(invalidEmailResult.payload.message, 'Enter a valid email address to subscribe.');

    const upstreamErrorResult = await requestJson(`http://127.0.0.1:${configuredPort}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'error@example.com' }),
    });
    assert.equal(upstreamErrorResult.response.status, 422);
    assert.equal(upstreamErrorResult.payload.message, 'Mock Beehiiv rejected the signup request.');

    const successResult = await requestJson(`http://127.0.0.1:${configuredPort}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'success@example.com' }),
    });
    assert.equal(successResult.response.status, 200);
    assert.equal(successResult.payload.message, "You're in. Check your inbox for Beehiiv's confirmation email.");
  } finally {
    await configuredApp.stop();
    await mockBeehiiv.stop();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
