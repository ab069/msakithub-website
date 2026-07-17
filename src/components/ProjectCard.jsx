import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initials(name) {
  const words = name.replace(/[^a-zA-Z0-9 .]/g, '').split(/[\s.]+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function ProjectCard({ project, index, featured = false }) {
  const { name, year, desc, tags, image, slug, gallery, tagline } = project;
  const tileRef = useRef(null);
  const shotCount = Array.isArray(gallery) ? gallery.length : 0;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = tileRef.current;
    const anim = gsap.to(el, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1,
      ease: 'expo.out',
      delay: (index % 3) * 0.1,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, [index]);

  const mediaClass = featured
    ? 'aspect-[16/10]'
    : 'aspect-[16/10]';

  const inner = (
    <>
      {/* Screenshot / placeholder visual */}
      <div
        ref={tileRef}
        className={`clip-reveal relative ${mediaClass} bg-card border-b border-line overflow-hidden grid place-items-center`}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
            fetchpriority={index === 0 ? 'high' : 'auto'}
            className="absolute inset-0 w-full h-full object-contain object-top p-2 group-hover:scale-[1.02] transition-transform duration-700"
          />
        ) : (
          <>
            <div className="absolute inset-0 grid-bg opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
            <span className="absolute inset-0 grid place-items-center font-display text-[5.5rem] md:text-[7rem] leading-none text-white/[0.05] group-hover:text-accent/20 transition-colors duration-500 select-none">
              {initials(name)}
            </span>
          </>
        )}

        {/* top meta */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="mono text-[10px] tracking-widest text-muted bg-bg/60 backdrop-blur-sm px-2 py-1 rounded">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-2">
            {shotCount > 0 && (
              <span className="mono text-[10px] tracking-widest text-white bg-accent/90 text-bg px-2 py-1 rounded flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                {shotCount}
              </span>
            )}
            <span className="mono text-[10px] tracking-widest text-muted bg-bg/60 backdrop-blur-sm px-2 py-1 rounded">
              {year}
            </span>
          </div>
        </div>

        {/* View indicator on hover */}
        {slug && (
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-bg/90 to-transparent">
            <span className="inline-flex bg-accent/90 text-bg mono text-[10px] uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-sm">
              View Case Study →
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className={`font-display leading-tight text-white group-hover:text-accent transition-colors ${featured ? 'text-3xl md:text-4xl' : 'text-2xl md:text-[1.7rem]'}`}>
            {name}
          </h3>
        </div>

        {featured && tagline ? (
          <p className="text-accent/90 text-sm md:text-base leading-relaxed mt-3 font-display">{tagline}</p>
        ) : null}

        <p className="text-muted text-sm leading-relaxed mt-3 flex-1">{desc}</p>

        {/* tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {tags.map((t) => (
            <span
              key={t}
              className="mono text-[10px] tracking-wider text-white/60 border border-line px-2.5 py-1 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  if (slug) {
    return (
      <Link
        to={`/projects/${slug}`}
        className="project-card group relative border border-line bg-surface card-hov flex flex-col overflow-hidden"
        data-cursor="view"
      >
        {inner}
      </Link>
    );
  }

  return (
    <article
      className="project-card group relative border border-line bg-surface card-hov flex flex-col overflow-hidden"
      data-cursor="view"
    >
      {inner}
    </article>
  );
}
