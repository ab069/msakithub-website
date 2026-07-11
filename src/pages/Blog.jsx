import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '../components/TextReveal.jsx';
import Scramble from '../components/Scramble.jsx';
import Marquee from '../components/Marquee.jsx';
import { posts } from '../data/posts.js';
import useSeo from '../hooks/useSeo.js';

gsap.registerPlugin(ScrollTrigger);

const filters = ['All', 'Design', 'Development', 'Technology'];

export default function Blog() {
  useSeo({
    title: 'Blog',
    description: 'Insights on web development, mobile apps, UI/UX design, digital marketing and IT consultancy from the MSAK IT Hub team in Pakistan.',
    path: '/blog',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      'url': 'https://msakithub.com/blog',
      'name': 'MSAK IT Hub Blog',
      'description': 'Insights on web development, mobile apps, design, marketing and IT consultancy.',
      'publisher': { '@id': 'https://msakithub.com/#organization' },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://msakithub.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://msakithub.com/blog' },
        ],
      },
    },
  });
  const root = useRef(null);
  const filterBarRef = useRef(null);
  const indicatorRef = useRef(null);
  const [active, setActive] = useState('All');
  const [openSlug, setOpenSlug] = useState(null);
  const filtered = active === 'All' ? posts : posts.filter((p) => p.category === active);
  const featured = posts.find((p) => p.featured) || posts[0];

  const categories = ['Design', 'Development', 'Technology'];
  const catCounts = categories.map((c) => ({
    name: c,
    count: posts.filter((p) => p.category === c).length,
  }));

  useLayoutEffect(() => {
    const bar = filterBarRef.current;
    const ind = indicatorRef.current;
    if (!bar || !ind) return;
    const btn = bar.querySelector(`[data-filter="${active}"]`);
    if (!btn) return;
    const barRect = bar.getBoundingClientRect();
    const r = btn.getBoundingClientRect();
    gsap.to(ind, {
      x: r.left - barRect.left,
      width: r.width,
      duration: 0.55,
      ease: 'expo.out',
    });
  }, [active]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) =>
        gsap.from(el, { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      );
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    setOpenSlug(null);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo('.idx-row', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' });
    gsap.fromTo('.idx-num', { x: -14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.05 });
  }, [active]);

  const toggle = (slug) => setOpenSlug((cur) => (cur === slug ? null : slug));

  return (
    <div ref={root}>
      {/* ─────────── HERO ─────────── */}
      <section className="relative max-w-site mx-auto px-5 md:px-10 pt-44 pb-20 md:pb-32 border-b border-line">
        <div className="flex items-center gap-3 mb-10" data-reveal>
          <span className="w-8 h-px bg-accent" /><Scramble text="Blog — Index" />
        </div>
        <TextReveal text="Insights & ideas" as="h1" className="font-display t-hero text-white" />
        <div className="mt-12 grid md:grid-cols-[1fr_auto] gap-10 items-end">
          <p className="text-muted text-base md:text-lg leading-relaxed max-w-xl" data-reveal>
            The latest trends, best practices and insights from our team of experts in technology, design and digital marketing — a quiet log of what we're building, learning, and shipping.
          </p>
          <div className="mono text-[10px] uppercase tracking-[0.22em] text-muted flex md:flex-col gap-6 md:gap-3 md:text-right" data-reveal>
            <div><span className="text-white text-base font-display block leading-none">{posts.length.toString().padStart(2, '0')}</span> ARTICLES</div>
            <div><span className="text-white text-base font-display block leading-none">{categories.length.toString().padStart(2, '0')}</span> CATEGORIES</div>
            <div><span className="text-white text-base font-display block leading-none">W26</span> UPDATED</div>
          </div>
        </div>
      </section>

      {/* ─────────── EDITORIAL MARQUEE ─────────── */}
      <section className="border-b border-line py-6 md:py-8 overflow-hidden">
        <Marquee
          items={['Editorial', '◆', 'Design', '◆', 'Development', '◆', 'Technology', '◆', 'Insights']}
          variant="stroke"
        />
      </section>

      {/* ─────────── FEATURED ─────────── */}
      <section className="border-b border-line">
        <div className="max-w-site mx-auto px-5 md:px-10 py-16 md:py-24">
          <div className="flex items-center justify-between mb-10" data-reveal>
            <span className="eyebrow">Featured Post</span>
            <span className="mono text-[10px] uppercase tracking-[0.22em] text-muted">— 01 / 01</span>
          </div>
          <Link to={`/blog/${featured.slug}`} className="feat-card group block" data-reveal data-cursor="read">
            <div className="grid md:grid-cols-[1.1fr_1fr] gap-8 md:gap-16">
              <div className="relative">
                <div className="feat-visual">
                  <div className="feat-glow" />
                  <span className="mono text-[10px] uppercase tracking-[0.22em] text-white/70 absolute top-4 left-4">{featured.category}</span>
                  <span className="mono text-[10px] uppercase tracking-[0.22em] text-white/70 absolute top-4 right-4">{featured.read}</span>
                  <span className="font-display feat-mark">FT</span>
                  <span className="mono text-[10px] uppercase tracking-[0.22em] text-white/70 absolute bottom-4 left-4">{featured.date}</span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="mono text-[10px] uppercase tracking-[0.22em] text-accent2 mb-4">{featured.category} · {featured.read}</span>
                <h2 className="font-display text-3xl md:text-5xl leading-[1.05] text-white mb-6">{featured.title}</h2>
                <p className="text-muted text-sm md:text-base leading-relaxed max-w-md mb-8">{featured.excerpt}</p>
                <span className="mono text-[11px] uppercase tracking-[0.16em] text-accent link-line inline-flex items-center gap-2 self-start">
                  Read article
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ─────────── CATEGORIES BAND ─────────── */}
      <section className="border-b border-line">
        <div className="max-w-site mx-auto px-5 md:px-10 py-10 md:py-14">
          <div className="grid md:grid-cols-4 gap-6 md:gap-10">
            <div className="md:col-span-1" data-reveal>
              <span className="eyebrow">By Category</span>
              <p className="text-muted text-xs mt-3 leading-relaxed">Filter the editorial index below by domain.</p>
            </div>
            {catCounts.map((c) => (
              <button
                key={c.name}
                onClick={() => setActive(c.name)}
                className={`cat-tile text-left ${active === c.name ? 'is-active' : ''}`}
                data-reveal
              >
                <span className="mono text-[10px] uppercase tracking-[0.22em] text-muted">{c.name}</span>
                <span className="font-display block text-4xl md:text-5xl text-white mt-2">{c.count.toString().padStart(2, '0')}</span>
                <span className="block mono text-[10px] uppercase tracking-[0.22em] text-muted mt-2">{c.count === 1 ? 'Article' : 'Articles'}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── FILTER BAR (sticky) ─────────── */}
      <div className="border-b border-line sticky top-0 z-30 backdrop-blur-md bg-[rgba(11,12,16,0.7)]">
        <div className="max-w-site mx-auto px-5 md:px-10 flex items-center justify-between py-3">
          <span className="mono text-[10px] uppercase tracking-[0.22em] text-muted hidden md:inline">Filter —</span>
          <div ref={filterBarRef} className="relative flex gap-1 overflow-x-auto">
            <span ref={indicatorRef} className="filter-indicator" aria-hidden />
            {filters.map((f) => (
              <button
                key={f}
                data-filter={f}
                onClick={() => setActive(f)}
                className={`filter-btn relative z-10 px-5 py-2 mono text-[11px] uppercase tracking-[0.16em] whitespace-nowrap ${
                  active === f ? 'text-black' : 'text-muted hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="mono text-[10px] uppercase tracking-[0.22em] text-muted hidden md:inline">
            <span className="text-white">{filtered.length.toString().padStart(2, '0')}</span> / {posts.length.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ─────────── INDEX LIST ─────────── */}
      <section className="max-w-site mx-auto px-5 md:px-10 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10" data-reveal>
          <div>
            <span className="eyebrow">All Articles</span>
            <h2 className="font-display text-3xl md:text-5xl text-white mt-3">The full archive</h2>
          </div>
          <span className="mono text-[10px] uppercase tracking-[0.22em] text-muted hidden md:inline">— SORT: NEWEST</span>
        </div>
        <div className="border-t border-line">
          {filtered.map((p, i) => {
            const isOpen = openSlug === p.slug;
            return (
              <div key={p.slug} className={`idx-row group ${isOpen ? 'is-open' : ''}`} data-cursor="read">
                <button
                  type="button"
                  onClick={() => toggle(p.slug)}
                  aria-expanded={isOpen}
                  aria-controls={`panel-${p.slug}`}
                  className="idx-trigger w-full text-left relative"
                >
                  <span className="idx-bar" aria-hidden />
                  <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[60px_140px_130px_1fr_100px_44px] items-center gap-3 md:gap-8 py-10 md:py-12 px-2 md:px-4">
                    <span className="idx-num mono text-[11px] tracking-[0.22em] text-muted">{(i + 1).toString().padStart(2, '0')}</span>
                    <span className="mono text-[10px] tracking-[0.18em] text-muted hidden md:block">{p.date}</span>
                    <span className="pill hidden md:inline-flex"><span className="dot" />{p.category}</span>
                    <h2 className="idx-title font-archivo font-extrabold text-xl md:text-3xl uppercase leading-tight text-white">
                      {p.title}
                    </h2>
                    <span className="mono text-[10px] tracking-[0.18em] text-muted text-right hidden md:block">{p.read}</span>
                    <span className="idx-arrow hidden md:grid place-items-center">
                      <svg width="20" height="20" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>
                </button>

                <div id={`panel-${p.slug}`} className="idx-panel" role="region" aria-hidden={!isOpen}>
                  <div className="idx-panel-inner">
                    <div className="grid md:grid-cols-[200px_1fr] gap-6 md:gap-10 px-2 md:px-4 pb-10 pt-2 max-w-4xl">
                      <div className="mono text-[10px] tracking-[0.18em] text-muted space-y-2">
                        <div>{p.date}</div>
                        <div>{p.read} READ</div>
                        <div className="text-white/70">{p.author}</div>
                      </div>
                      <div>
                        <p className="text-white/85 text-sm md:text-base leading-relaxed mb-6">{p.excerpt}</p>
                        <Link
                          to={`/blog/${p.slug}`}
                          className="mono text-[11px] uppercase tracking-[0.16em] text-accent link-line inline-flex items-center gap-2"
                        >
                          Read full article
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && <p className="text-muted text-sm text-center py-20">No posts in this category yet.</p>}
      </section>
    </div>
  );
}
