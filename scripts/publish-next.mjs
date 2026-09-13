#!/usr/bin/env node
// Daily publish job — pops the next pre-written article from content/queue.json,
// generates its cover image, appends it to src/data/posts.js, regenerates the
// sitemap, pings IndexNow, and commits + pushes.
//
// This is the CHEAP half of the pipeline. The expensive part (researching a
// topic and writing the article) happens once, in a batch, ahead of time —
// this script just does mechanical work so the daily run costs almost nothing.
//
// Usage: node scripts/publish-next.mjs
// Then, separately (needs a browser + your Google login — not automatable
// here): open Google Search Console → URL Inspection → paste the URL this
// script prints → Request Indexing.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execSync, spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const QUEUE_PATH = path.join(ROOT, 'content', 'queue.json');
const POSTS_PATH = path.join(ROOT, 'src', 'data', 'posts.js');
const BASE = 'https://msakithub.com';

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
];
function findChrome() {
  for (const p of CHROME_CANDIDATES) if (existsSync(p)) return p;
  throw new Error('Chrome not found for image generation.');
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
function todayLabel() {
  // "SEP 13 2026" — matches the existing date format in posts.js
  const d = new Date();
  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')} ${d.getUTCFullYear()}`;
}

function renderCoverHtml(entry) {
  return `<!doctype html>
<html><head><meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,800&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@500&display=swap" />
<style>
  html,body{margin:0;padding:0;width:1600px;height:900px;overflow:hidden;background:#0B0C10;}
  .wrap{position:relative;width:1600px;height:900px;font-family:'Space Grotesk',sans-serif;}
  .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:40px 40px;}
  .glow{position:absolute;width:900px;height:900px;border-radius:50%;top:-250px;right:-200px;background:radial-gradient(circle,rgba(241,67,58,.35),transparent 65%);filter:blur(30px);}
  .glow2{position:absolute;width:700px;height:700px;border-radius:50%;bottom:-300px;left:-150px;background:radial-gradient(circle,rgba(255,107,74,.18),transparent 65%);filter:blur(30px);}
  .content{position:relative;height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 100px;}
  .eyebrow{font-family:'JetBrains Mono',monospace;font-size:20px;letter-spacing:6px;color:#FF6B4A;text-transform:uppercase;}
  h1{font-family:'Fraunces',serif;font-weight:800;font-size:78px;line-height:1.08;color:#fff;margin:24px 0 0;max-width:1300px;}
  .sub{margin-top:28px;font-size:24px;color:rgba(255,255,255,.6);max-width:1000px;line-height:1.5;}
  .brand{position:absolute;bottom:56px;left:100px;display:flex;align-items:center;gap:14px;}
  .brand svg{width:44px;height:auto;}
  .brand .name{font-weight:700;font-size:22px;color:#fff;letter-spacing:.5px;}
  .brand .name span{color:#F1433A;font-weight:500;}
</style></head>
<body><div class="wrap">
  <div class="grid"></div><div class="glow"></div><div class="glow2"></div>
  <div class="content">
    <div class="eyebrow">${entry.category}</div>
    <h1>${entry.title}</h1>
    <div class="sub">${entry.excerpt}</div>
  </div>
  <div class="brand">
    <svg viewBox="0 0 142 91" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#F1433A" stroke-width="28" stroke-linecap="round"><line x1="20" y1="71" x2="72" y2="19"/><line x1="71" y1="71" x2="122" y2="20"/></g>
      <circle cx="122" cy="71" r="14.5" fill="#F1433A"/>
    </svg>
    <div class="name">MSAK<span> IT HUB</span></div>
  </div>
</div></body></html>`;
}

function generateCoverImage(entry) {
  const chromePath = findChrome();
  const htmlPath = path.join(ROOT, '.tmp-cover.html');
  const outDir = path.join(ROOT, 'public', 'blog');
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${entry.slug}.png`);
  writeFileSync(htmlPath, renderCoverHtml(entry), 'utf8');
  execSync(
    `"${chromePath}" --headless --disable-gpu --window-size=1600,900 --screenshot="${outPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`,
    { stdio: 'ignore' },
  );
  execSync(`node -e "require('fs').unlinkSync('${htmlPath.replace(/\\/g, '/')}')"`);
  return `/blog/${entry.slug}.png`;
}

function appendToPostsFile(entry, imagePath) {
  const src = readFileSync(POSTS_PATH, 'utf8');
  const marker = 'export const posts = [';
  const idx = src.indexOf(marker);
  if (idx === -1) throw new Error('Could not find posts array in posts.js');

  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const bodyLines = entry.body.map((p) => `      '${esc(p)}',`).join('\n');

  const entryBlock = `  {
    slug: '${entry.slug}',
    title: '${esc(entry.title)}',
    excerpt:
      '${esc(entry.excerpt)}',
    category: '${entry.category}',
    date: '${todayLabel()}',
    read: '${entry.read}',
    featured: false,
    image: '${imagePath}',
    author: '${entry.author}',
    body: [
${bodyLines}
    ],
  },
`;

  const insertAt = idx + marker.length;
  const updated = src.slice(0, insertAt) + '\n' + entryBlock + src.slice(insertAt);
  writeFileSync(POSTS_PATH, updated, 'utf8');
}

function publishOne() {
  const queue = JSON.parse(readFileSync(QUEUE_PATH, 'utf8'));
  if (queue.length === 0) return null;

  const entry = queue.shift();
  console.log(`Publishing: ${entry.slug}`);

  const imagePath = generateCoverImage(entry);
  console.log(`  cover image -> ${imagePath}`);

  appendToPostsFile(entry, imagePath);
  writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n', 'utf8');

  execSync('node scripts/generate-sitemap.mjs', { cwd: ROOT, stdio: 'inherit' });

  const url = `${BASE}/blog/${entry.slug}`;
  try {
    execSync(`node scripts/indexnow-ping.mjs "${url}"`, { cwd: ROOT, stdio: 'inherit' });
  } catch (err) {
    console.warn('IndexNow ping failed (non-fatal):', err.message);
  }

  execSync('git add -A', { cwd: ROOT, stdio: 'inherit' });
  execSync(
    `git commit -m "Publish: ${entry.title.replace(/"/g, '\\"')}" -m "Automated daily publish from content/queue.json." -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"`,
    { cwd: ROOT, stdio: 'inherit' },
  );
  execSync('git push origin main', { cwd: ROOT, stdio: 'inherit' });

  console.log(`Published: ${url}`);
  console.log(`${queue.length} article(s) left in the queue.`);
  console.log('');
  return url;
}

function main() {
  const count = Math.max(1, parseInt(process.argv[2] ?? '1', 10) || 1);
  if (!existsSync(QUEUE_PATH)) {
    console.log('No queue.json found — nothing to publish.');
    return;
  }

  const publishedUrls = [];
  for (let i = 0; i < count; i++) {
    const url = publishOne();
    if (!url) {
      console.log('Queue is empty — nothing more to publish. Write more articles into content/queue.json.');
      break;
    }
    publishedUrls.push(url);
  }

  if (publishedUrls.length > 0) {
    console.log(`Published ${publishedUrls.length} article(s) this run.`);
    console.log('Next: open Google Search Console -> URL Inspection -> Request Indexing for each URL above (batch this weekly, not per-run).');
  }
}

main();
