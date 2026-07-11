import { useEffect } from 'react';

const BASE = 'https://msakithub.com';
const DEFAULT_IMG = `${BASE}/brand/banner.png`;
const SITE_NAME = 'MSAK IT Hub';
const DEFAULT_TITLE = `${SITE_NAME} — Pakistan's Trusted IT & Software Partner`;

function setMeta(selector, attr, value) {
  if (!value) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    const [prop, key] = selector.replace(/[\[\]"']/g, '').split('=');
    el.setAttribute(prop, key);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
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

export default function useSeo({
  title,
  description,
  path = '',
  image = DEFAULT_IMG,
  imageAlt,
  type = 'website',
  jsonLd,
} = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;
    const url = `${BASE}${path}`;
    const imgAlt = imageAlt || fullTitle;

    document.title = fullTitle;
    setMeta('meta[name="description"]', 'content', description);
    setLink('canonical', url);

    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:image"]', 'content', image);
    setMeta('meta[property="og:image:alt"]', 'content', imgAlt);
    setMeta('meta[property="og:type"]', 'content', type);

    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', image);
    setMeta('meta[name="twitter:image:alt"]', 'content', imgAlt);

    const injected = jsonLd ? injectLd(jsonLd) : [];
    return () => removeLd(injected);
  }, [title, description, path, image, imageAlt, type, jsonLd]);
}
