import { useEffect } from 'react';

const BASE = 'https://msakithub.com';
const DEFAULT_IMG = `${BASE}/brand/banner.png`;
const SITE_NAME = 'MSAK IT Hub';
const DEFAULT_TITLE = `${SITE_NAME} — Pakistan's Trusted IT & Software Partner`;
const TWITTER_SITE = '@msakithub';

function upsertMeta(selectorParts, value, remove = false) {
  const [attrName, attrValue] = selectorParts;
  const selector = `meta[${attrName}="${attrValue}"]`;
  let el = document.head.querySelector(selector);
  if (remove) {
    if (el) el.parentNode.removeChild(el);
    return;
  }
  if (value == null || value === '') return;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function injectLd(data) {
  const items = Array.isArray(data) ? data : [data];
  return items.map((schema) => {
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.dataset.routeLd = '1';
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);
    return el;
  });
}

function removeLd(els) {
  els.forEach((el) => el.parentNode && el.parentNode.removeChild(el));
}

const ARTICLE_META = [
  ['property', 'article:published_time'],
  ['property', 'article:modified_time'],
  ['property', 'article:author'],
  ['property', 'article:section'],
];

export default function useSeo({
  title,
  description,
  path = '',
  image = DEFAULT_IMG,
  imageAlt,
  type = 'website',
  jsonLd,
  article,
  twitterCreator,
  noindex = false,
} = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;
    const url = `${BASE}${path}`;
    const imgAlt = imageAlt || fullTitle;

    document.title = fullTitle;
    upsertMeta(['name', 'description'], description);
    upsertMeta(['name', 'robots'], noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
    setLink('canonical', url);

    upsertMeta(['property', 'og:title'], fullTitle);
    upsertMeta(['property', 'og:description'], description);
    upsertMeta(['property', 'og:url'], url);
    upsertMeta(['property', 'og:image'], image);
    upsertMeta(['property', 'og:image:alt'], imgAlt);
    upsertMeta(['property', 'og:type'], type);
    upsertMeta(['property', 'og:site_name'], SITE_NAME);
    upsertMeta(['property', 'og:locale'], 'en_US');

    upsertMeta(['name', 'twitter:card'], 'summary_large_image');
    upsertMeta(['name', 'twitter:site'], TWITTER_SITE);
    upsertMeta(['name', 'twitter:title'], fullTitle);
    upsertMeta(['name', 'twitter:description'], description);
    upsertMeta(['name', 'twitter:image'], image);
    upsertMeta(['name', 'twitter:image:alt'], imgAlt);
    upsertMeta(['name', 'twitter:creator'], twitterCreator || TWITTER_SITE);

    if (type === 'article' && article) {
      upsertMeta(['property', 'article:published_time'], article.publishedTime);
      upsertMeta(['property', 'article:modified_time'], article.modifiedTime || article.publishedTime);
      upsertMeta(['property', 'article:author'], article.author);
      upsertMeta(['property', 'article:section'], article.section);
      const tags = Array.isArray(article.tags) ? article.tags : [];
      document.head.querySelectorAll('meta[property="article:tag"]').forEach((n) => n.parentNode.removeChild(n));
      tags.forEach((tag) => {
        const el = document.createElement('meta');
        el.setAttribute('property', 'article:tag');
        el.setAttribute('content', tag);
        document.head.appendChild(el);
      });
    } else {
      ARTICLE_META.forEach((sel) => upsertMeta(sel, null, true));
      document.head.querySelectorAll('meta[property="article:tag"]').forEach((n) => n.parentNode.removeChild(n));
    }

    const injected = jsonLd ? injectLd(jsonLd) : [];
    return () => removeLd(injected);
  }, [title, description, path, image, imageAlt, type, jsonLd, article, twitterCreator, noindex]);
}
