import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE = 'https://msakithub.com';

const { posts } = await import(new URL('../src/data/posts.js', import.meta.url).href);
const { projects } = await import(new URL('../src/data/projects.js', import.meta.url).href);

const today = new Date().toISOString().slice(0, 10);

const staticPages = [
  { path: '/',         priority: '1.0', changefreq: 'weekly'  },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/projects', priority: '0.9', changefreq: 'weekly'  },
  { path: '/blog',     priority: '0.9', changefreq: 'weekly'  },
  { path: '/about',    priority: '0.8', changefreq: 'monthly' },
  { path: '/contact',  priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy',  priority: '0.3', changefreq: 'yearly'  },
];

const parseBlogDate = (raw) => {
  const m = /^([A-Z]{3})\s+(\d{1,2})\s+(\d{4})$/.exec(raw?.trim() || '');
  if (!m) return today;
  const [, mon, day, year] = m;
  const idx = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'].indexOf(mon);
  if (idx < 0) return today;
  return `${year}-${String(idx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const urls = [
  ...staticPages.map((p) => ({
    loc: `${BASE}${p.path}`,
    lastmod: today,
    changefreq: p.changefreq,
    priority: p.priority,
  })),
  ...projects
    .filter((p) => p.slug)
    .map((p) => ({
      loc: `${BASE}/projects/${p.slug}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: p.featured ? '0.7' : '0.6',
    })),
  ...posts.map((p) => ({
    loc: `${BASE}/blog/${p.slug}`,
    lastmod: parseBlogDate(p.date),
    changefreq: 'monthly',
    priority: p.featured ? '0.8' : '0.7',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const outPath = resolve(ROOT, 'public', 'sitemap.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`sitemap.xml written: ${urls.length} URLs -> ${outPath}`);
