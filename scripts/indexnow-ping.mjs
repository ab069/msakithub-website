#!/usr/bin/env node
// Pings IndexNow (Bing, Yandex, Seznam, Naver) so new/changed URLs get
// picked up faster than waiting for their own crawl schedule. Google does
// not support IndexNow — that side still goes through Search Console.
//
// Usage: node scripts/indexnow-ping.mjs /blog/my-new-post [/faq ...]
// Each argument is a path (or full URL) on https://msakithub.com.

const HOST = 'msakithub.com';
const KEY = 'bc5f55dd8e2b8aa75f38d1b17b4e528b';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const paths = process.argv.slice(2);
if (paths.length === 0) {
  console.error('Usage: node scripts/indexnow-ping.mjs <path-or-url> [more...]');
  process.exit(1);
}

const urlList = paths.map((p) => (p.startsWith('http') ? p : `https://${HOST}${p.startsWith('/') ? '' : '/'}${p}`));

const body = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList,
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

console.log(`IndexNow: ${res.status} ${res.statusText}`);
urlList.forEach((u) => console.log(`  -> ${u}`));
if (!res.ok && res.status !== 202) {
  const text = await res.text().catch(() => '');
  console.error(text);
  process.exit(1);
}
