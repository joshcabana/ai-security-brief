import assert from 'node:assert/strict';
import { createServer as createHttpServer } from 'node:http';
import net from 'node:net';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

/** Find a free TCP port */
async function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      const addr = srv.address();
      srv.close(() => resolve(addr.port));
    });
    srv.on('error', reject);
  });
}

/** Poll until a TCP port is accepting connections or timeout */
async function waitForPort(port, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await new Promise((resolve, reject) => {
        const s = net.createConnection(port, '127.0.0.1');
        s.on('connect', () => { s.destroy(); resolve(undefined); });
        s.on('error', reject);
      });
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  throw new Error(`Port ${port} did not open within ${timeoutMs}ms`);
}

/** Tiny HTTP helper */
async function get(url) {
  const { default: http } = await import('node:http');
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    }).on('error', reject);
  });
}

async function post(url, payload) {
  const { default: http } = await import('node:http');
  const data = JSON.stringify(payload);
  return new Promise((resolve, reject) => {
    const opts = new URL(url);
    const req = http.request({
      hostname: opts.hostname,
      port: opts.port,
      path: opts.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;

  console.log(`Starting Next.js on port ${port}…`);
  const child = spawn(
    'node_modules/.bin/next',
    ['start', '--port', String(port)],
    {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, PORT: String(port) },
    },
  );

  let serverOutput = '';
  child.stdout.on('data', (chunk) => { serverOutput += chunk; process.stdout.write(chunk); });
  child.stderr.on('data', (chunk) => { serverOutput += chunk; process.stderr.write(chunk); });

  try {
    await waitForPort(port, 30_000);
    console.log(`Server ready. Running smoke tests…`);

    // 1. Home page returns 200
    const home = await get(`${base}/`);
    assert.equal(home.status, 200, `Home page status: ${home.status}`);
    assert.ok(home.body.includes('AI Security Brief'), 'Home page should include site name');
    console.log('✓ Home page OK');

    // 2. Blog index returns 200
    const blog = await get(`${base}/blog`);
    assert.equal(blog.status, 200, `Blog page status: ${blog.status}`);
    console.log('✓ Blog page OK');

    // 3. Tools page returns 200
    const tools = await get(`${base}/tools`);
    assert.equal(tools.status, 200, `Tools page status: ${tools.status}`);
    console.log('✓ Tools page OK');

    // 4. Newsletter page returns 200
    const newsletter = await get(`${base}/newsletter`);
    assert.equal(newsletter.status, 200, `Newsletter page status: ${newsletter.status}`);
    console.log('✓ Newsletter page OK');

    // 5. Subscribe API returns 400 for missing body
    const sub400 = await post(`${base}/api/subscribe`, {});
    assert.equal(sub400.status, 400, `Subscribe empty body status: ${sub400.status}`);
    console.log('✓ Subscribe API validation OK');

    // 6. Subscribe API returns 400 for invalid email
    const subInvalid = await post(`${base}/api/subscribe`, { email: 'not-an-email' });
    assert.equal(subInvalid.status, 400, `Subscribe invalid email status: ${subInvalid.status}`);
    console.log('✓ Subscribe API email validation OK');

    // 7. Known article slug returns 200 (first slug from content-manifest.json)
    const manifestRaw = await readFile(path.join(ROOT, 'content-manifest.json'), 'utf-8');
    const manifest = JSON.parse(manifestRaw);
    if (manifest.slugs.length > 0) {
      const slug = manifest.slugs[0];
      const article = await get(`${base}/blog/${slug}`);
      assert.equal(article.status, 200, `Article /${slug} status: ${article.status}`);
      console.log(`✓ Article page /${slug} OK`);
    } else {
      console.log('- No articles in manifest, skipping article page test');
    }

    // 8. Unknown article slug returns 404
    const notFound = await get(`${base}/blog/this-slug-does-not-exist-ever`);
    assert.equal(notFound.status, 404, `Unknown slug status: ${notFound.status}`);
    console.log('✓ 404 for unknown slug OK');

    console.log('\nAll smoke tests passed!');
  } finally {
    child.kill();
  }
}

main().catch((err) => {
  console.error('Smoke test failed:', err);
  process.exitCode = 1;
});
