import { useEffect, useRef, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '../components/TextReveal.jsx';
import Scramble from '../components/Scramble.jsx';
import MagneticButton from '../components/MagneticButton.jsx';
import { posts } from '../data/posts.js';
import useSeo from '../hooks/useSeo.js';

gsap.registerPlugin(ScrollTrigger);

const initialsOf = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const shortLabel = (text, n = 6) =>
  text.split(' ').slice(0, n).join(' ').replace(/[.,]$/, '') + '…';

export default function BlogPost() {
  const { slug } = useParams();
  const root = useRef(null);
  const post = posts.find((p) => p.slug === slug);
  const [copied, setCopied] = useState(false);

  useSeo(
    post
      ? {
          title: post.title,
          description: post.excerpt,
          path: `/blog/${post.slug}`,
          type: 'article',
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            '@id': `https://msakithub.com/blog/${post.slug}`,
            'headline': post.title,
            'description': post.excerpt,
            'author': { '@type': 'Organization', '@id': 'https://msakithub.com/#organization', 'name': 'MSAK IT Hub' },
            'publisher': { '@id': 'https://msakithub.com/#organization' },
            'datePublished': post.date,
            'image': 'https://msakithub.com/brand/banner.png',
            'mainEntityOfPage': { '@type': 'WebPage', '@id': `https://msakithub.com/blog/${post.slug}` },
            'isPartOf': { '@id': 'https://msakithub.com/#website' },
            'breadcrumb': {
              '@type': 'BreadcrumbList',
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://msakithub.com/' },
                { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://msakithub.com/blog' },
                { '@type': 'ListItem', 'position': 3, 'name': post.title, 'item': `https://msakithub.com/blog/${post.slug}` },
              ],
            },
          },
        }
      : { title: 'Blog', path: '/blog' }
  );

  useEffect(() => {
    if (!post) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) =>
        gsap.from(el, { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      );
    }, root);
    return () => ctx.revert();
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(post.title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) { /* ignore */ }
  };

  return (
    <div ref={root}>
      <section className="relative max-w-site mx-auto px-5 md:px-10 pt-44 pb-16 border-b border-line">
        <Link to="/blog" className="mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-accent transition-colors" data-reveal>
          ← Back to Blog
        </Link>
        <div className="flex items-center gap-3 mt-8 mb-8" data-reveal>
          <span className="w-8 h-px bg-accent" /><Scramble text={post.category} />
        </div>
        <TextReveal text={post.title} as="h1" className="font-display t-hero text-white" />
        <div className="mt-8 flex items-center gap-6 mono text-[11px] uppercase tracking-[0.16em] text-muted" data-reveal>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.read} READ</span>
          <span>·</span>
          <span>{post.author}</span>
        </div>
      </section>

      <section className="max-w-site mx-auto px-5 md:px-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-12 lg:gap-20">
          <article className="max-w-2xl space-y-7 text-white/85 text-base md:text-lg leading-relaxed" data-reveal>
            {post.body.map((para, i) => (
              <div key={i}>
                <p>{para}</p>
                {i === 1 && (
                  <blockquote className="post-pullquote my-10">
                    <span className="mark" aria-hidden>"</span>
                    <p>{post.excerpt}</p>
                    <span className="byline mono">— {post.author}</span>
                  </blockquote>
                )}
                {i === 3 && post.body[2] && (
                  <blockquote className="post-pullquote post-pullquote-alt my-10">
                    <span className="mark" aria-hidden>"</span>
                    <p>{post.body[2].split('.')[0] + '.'}</p>
                    <span className="byline mono">— Editorial Note</span>
                  </blockquote>
                )}
              </div>
            ))}
          </article>

          <aside className="post-aside relative" data-reveal>
            <div className="lg:sticky lg:top-32 space-y-10">
              <div>
                <span className="eyebrow">In this article</span>
                <ol className="mt-5 space-y-3">
                  {post.body.map((p, i) => (
                    <li key={i} className="toc-row">
                      <span className="mono text-[10px] text-muted shrink-0">0{i + 1}</span>
                      <span className="text-white/75 text-sm leading-snug">{shortLabel(p, 7)}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-xl border border-line p-5 spot bg-[rgba(18,19,26,0.55)]">
                <div className="flex items-center gap-4">
                  <span className="author-avatar">{initialsOf(post.author)}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{post.author}</p>
                    <p className="mono text-[10px] tracking-[0.18em] text-muted uppercase mt-1">Editorial</p>
                  </div>
                </div>
                <p className="text-muted text-[12px] leading-relaxed mt-4">
                  Insights from the team building modern web, mobile and design systems at MSAK IT Hub.
                </p>
              </div>

              <div>
                <span className="eyebrow">Share</span>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="share-btn" aria-label="Share on X">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.52 7.46L22 22h-6.79l-4.74-6.21L4.8 22H2l7.04-8.06L2 2h6.91l4.32 5.71L18.24 2zm-2.38 18.16h1.59L7.22 3.74H5.51l10.35 16.42z"/></svg>
                    <span>X</span>
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="share-btn" aria-label="Share on LinkedIn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5.02A2.5 2.5 0 014.98 3.5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.84-1.95 3.78-1.95 4.04 0 4.78 2.66 4.78 6.12V21h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.81V21H9V9z"/></svg>
                    <span>LinkedIn</span>
                  </a>
                  <button onClick={copyLink} className="share-btn" type="button" aria-label="Copy link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                    <span>{copied ? 'Copied' : 'Copy link'}</span>
                  </button>
                </div>
              </div>

              <div className="post-glyph" aria-hidden>
                <svg viewBox="0 0 200 200" width="100%" height="auto">
                  <defs>
                    <linearGradient id="pg" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#F1433A" stopOpacity="0.95"/>
                      <stop offset="100%" stopColor="#FF6B4A" stopOpacity="0.35"/>
                    </linearGradient>
                    <radialGradient id="pgCore" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FF6B4A" stopOpacity="0.55"/>
                      <stop offset="100%" stopColor="#F1433A" stopOpacity="0"/>
                    </radialGradient>
                    <path id="pgTextPath" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
                  </defs>
                  <g className="glyph-spin-cw">
                    <circle cx="100" cy="100" r="92" fill="none" stroke="url(#pg)" strokeWidth="0.6" strokeDasharray="2 6"/>
                    <circle cx="100" cy="8"   r="1.6" fill="#FF6B4A"/>
                    <circle cx="192" cy="100" r="1.6" fill="#FF6B4A"/>
                    <circle cx="100" cy="192" r="1.6" fill="#FF6B4A"/>
                    <circle cx="8"   cy="100" r="1.6" fill="#FF6B4A"/>
                  </g>
                  <g className="glyph-spin-ccw">
                    <text fontFamily="JetBrains Mono, monospace" fontSize="9" letterSpacing="5" fill="#8B8D98">
                      <textPath href="#pgTextPath" startOffset="0">
                        MSAK IT HUB • EDITORIAL • INSIGHTS • DESIGN •
                      </textPath>
                    </text>
                  </g>
                  <circle className="glyph-ring" cx="100" cy="100" r="58" fill="none" stroke="url(#pg)" strokeWidth="1.2"/>
                  <circle cx="100" cy="100" r="30" fill="url(#pgCore)"/>
                  <circle className="glyph-dot" cx="100" cy="100" r="6" fill="#FF6B4A"/>
                </svg>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="max-w-site mx-auto px-5 md:px-10 py-20 md:py-28">
            <span className="eyebrow" data-reveal>Read Next</span>
            <div className="mt-10 border-t border-line">
              {related.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="idx-row group block" data-cursor="read">
                  <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[140px_120px_1fr_90px_40px] items-center gap-4 md:gap-8 py-8 px-2 md:px-4">
                    <span className="mono text-[10px] tracking-[0.18em] text-muted hidden md:block">{p.date}</span>
                    <span className="pill hidden md:inline-flex"><span className="dot" />{p.category}</span>
                    <h2 className="idx-title font-archivo font-extrabold text-lg md:text-2xl uppercase leading-tight text-white">{p.title}</h2>
                    <span className="mono text-[10px] tracking-[0.18em] text-muted text-right">{p.read}</span>
                    <span className="idx-arrow hidden md:grid place-items-center">
                      <svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line text-center py-24 md:py-36 px-5">
        <TextReveal text="Let's work together." as="h2" className="font-display t-mega text-white mb-8" />
        <div data-reveal><MagneticButton to="/contact" className="btn btn-fill" data-cursor="go"><span>Get in touch</span></MagneticButton></div>
      </section>
    </div>
  );
}
