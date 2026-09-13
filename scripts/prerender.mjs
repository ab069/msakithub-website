// Post-build prerender step.
//
// msakithub-website is a pure client-side-rendered Vite SPA (BrowserRouter,
// no SSR). Crawlers and link-preview bots (WhatsApp, LinkedIn, Slack, and
// Google's *first-pass* HTML fetch before its slower JS-render pass) only
// see the near-empty shell in dist/index.html — the useSeo hook injects the
// real per-page <title>/description/OG tags client-side, after mount.
//
// This script fixes that without adopting a whole SSR framework: after
// `vite build`, it spins up the exact same static server Vercel will serve
// (`vite preview`), visits every route in a real headless Chrome, lets React
// mount and useSeo run, and writes the fully-rendered DOM to
// dist/<route>/index.html. Vercel serves that static file directly for a
// matching path before falling back to the SPA rewrite in vercel.json, so
// real visitors still get the normal client-rendered app — this only changes
// what a non-executing crawler/bot sees on first fetch.

import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = 4319;
const BASE = `http://localhost:${PORT}`;
const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
];

function findChrome() {
  for (const p of CHROME_CANDIDATES) if (existsSync(p)) return p;
  throw new Error('Chrome not found — checked: ' + CHROME_CANDIDATES.join(', '));
}

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Server at ${url} did not respond within ${timeoutMs}ms`);
}

function dumpDom(chromePath, url) {
  return new Promise((resolvePromise, reject) => {
    const args = [
      '--headless',
      '--disable-gpu',
      '--dump-dom',
      '--virtual-time-budget=4000',
      '--no-pdf-header-footer',
      url,
    ];
    const proc = spawn(chromePath, args);
    let out = '';
    let err = '';
    proc.stdout.on('data', (d) => (out += d));
    proc.stderr.on('data', (d) => (err += d));
    proc.on('close', (code) => {
      if (code !== 0 && !out) return reject(new Error(`chrome exited ${code}: ${err}`));
      resolvePromise(out);
    });
  });
}

function routeToOutPath(route) {
  if (route === '/') return join(DIST, 'index.html');
  return join(DIST, route.replace(/^\//, ''), 'index.html');
}

async function main() {
  const { posts } = await import(new URL('../src/data/posts.js', import.meta.url).href);
  const { projects } = await import(new URL('../src/data/projects.js', import.meta.url).href);

  const routes = [
    '/',
    '/about',
    '/services',
    '/projects',
    '/blog',
    '/contact',
    '/faq',
    '/privacy',
    ...projects.filter((p) => p.slug).map((p) => `/projects/${p.slug}`),
    ...posts.map((p) => `/blog/${p.slug}`),
  ];

  const chromePath = findChrome();

  console.log(`Starting static preview server on ${BASE} ...`);
  const viteBin = join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
  const server = spawn(
    process.execPath,
    [viteBin, 'preview', '--port', String(PORT), '--strictPort'],
    { cwd: ROOT, stdio: 'pipe' },
  );
  server.stderr.on('data', (d) => process.stderr.write(d));

  try {
    await waitForServer(BASE);
    console.log(`Prerendering ${routes.length} routes...`);

    for (const route of routes) {
      const url = `${BASE}${route}`;
      let html;
      try {
        html = await dumpDom(chromePath, url);
      } catch (err) {
        console.error(`  ✗ ${route} — ${err.message}`);
        continue;
      }
      if (!html.trim().toLowerCase().startsWith('<!doctype')) {
        html = `<!doctype html>\n${html}`;
      }
      const outPath = routeToOutPath(route);
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, html, 'utf8');
      console.log(`  ✓ ${route} -> ${outPath.replace(ROOT, '.')}`);
    }
  } finally {
    server.kill();
  }

  console.log('Prerender complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
