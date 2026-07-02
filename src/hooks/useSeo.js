import { useEffect } from 'react';

/**
 * Per-route SEO without a runtime dep. Updates <title>, meta description,
 * canonical, OG and Twitter tags directly on document.head when a page
 * mounts. Resets on unmount-free since the next page just overrides them.
 */
const BASE = 'https://msakithub.com';
const DEFAULT_IMG = `${BASE}/brand/banner.png`;

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

export default function useSeo({
  title,
  description,
  path = '',
  image = DEFAULT_IMG,
  type = 'website',
  jsonLd,
} = {}) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} — MSAK IT Hub`
      : 'MSAK IT Hub — Pakistan’s Trusted IT & Software Partner';
    const url = `${BASE}${path || ''}`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', 'content', description);
    setLink('canonical', url);

    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:image"]', 'content', image);
    setMeta('meta[property="og:type"]', 'content', type);

    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', image);

    let ldEl = null;
    if (jsonLd) {
      ldEl = document.createElement('script');
      ldEl.type = 'application/ld+json';
      ldEl.dataset.routeLd = '1';
      ldEl.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(ldEl);
    }
    return () => {
      if (ldEl && ldEl.parentNode) ldEl.parentNode.removeChild(ldEl);
    };
  }, [title, description, path, image, type, JSON.stringify(jsonLd || null)]);
}
