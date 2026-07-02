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

export default function ProjectCard({ project, index }) {
  const { name, year, desc, tags, image, slug } = project;
  const tileRef = useRef(null);

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

  const inner = (
    <>
      {/* Screenshot / placeholder visual */}
      <div
        ref={tileRef}
        className="clip-reveal relative h-44 md:h-52 bg-card border-b border-line overflow-hidden grid place-items-center"
      >
        {image ? (
          <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
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
          <span className="mono text-[10px] tracking-widest text-muted">{String(index + 1).padStart(2, '0')}</span>
          <span className="mono text-[10px] tracking-widest text-muted">{year}</span>
        </div>
        {/* View indicator on hover */}
        {slug && (
          <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-accent/90 text-bg mono text-[10px] uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-sm">
              View Project →
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <h3 className="font-display text-2xl md:text-[1.7rem] leading-tight text-white group-hover:text-accent transition-colors">
          {name}
        </h3>
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
