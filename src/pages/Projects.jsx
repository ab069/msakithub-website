import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '../components/TextReveal.jsx';
import Marquee from '../components/Marquee.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { projects } from '../data/projects.js';
import useSeo from '../hooks/useSeo.js';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  useSeo({
    title: 'Work',
    description: 'Selected projects shipped by MSAK IT Hub — custom software, web apps, mobile apps and digital solutions for startups, SMEs and enterprises in Pakistan.',
    path: '/projects',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'url': 'https://msakithub.com/projects',
      'name': 'Projects — MSAK IT Hub',
      'description': 'A curated portfolio of custom software, web and mobile apps delivered by MSAK IT Hub.',
      'creator': { '@id': 'https://msakithub.com/#organization' },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://msakithub.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Work', 'item': 'https://msakithub.com/projects' },
        ],
      },
    },
  });
  const root = useRef(null);
  const [filter, setFilter] = useState('All');

  const filters = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ['All', ...Array.from(set)];
  }, []);

  const shown = filter === 'All' ? projects : projects.filter((p) => p.tags.includes(filter));
  const featured = shown.filter((p) => Array.isArray(p.gallery) && p.gallery.length > 0);
  const rest = shown.filter((p) => !Array.isArray(p.gallery) || p.gallery.length === 0);
  const totalShots = projects.reduce((n, p) => n + (Array.isArray(p.gallery) ? p.gallery.length : 0), 0);

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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo('.project-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out' });
  }, [filter]);

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="relative max-w-site mx-auto px-5 md:px-10 pt-40 pb-16 border-b border-line">
        <div className="flex items-center gap-3 mb-8" data-reveal>
          <span className="w-8 h-px bg-accent" /><span className="eyebrow">Selected Work</span>
        </div>
        <TextReveal text="Project gallery & case studies" as="h1" className="font-display t-hero text-white" />
        <div className="mt-10 grid md:grid-cols-3 gap-8 md:gap-16" data-reveal>
          <p className="text-muted text-sm md:text-base leading-relaxed md:col-span-2 max-w-2xl">
            A curated look at {projects.length} builds — full-stack platforms, serverless POS systems, marketplaces and portfolios. Click any card for a walkthrough, screenshots and the tech behind it.
          </p>
          <div className="flex md:justify-end gap-8 md:gap-10">
            <div>
              <div className="font-display text-4xl md:text-5xl text-white leading-none">{projects.length}</div>
              <div className="mono text-[10px] uppercase tracking-widest text-muted mt-2">Projects</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl text-white leading-none">{totalShots}</div>
              <div className="mono text-[10px] uppercase tracking-widest text-muted mt-2">Screens</div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-8 border-b border-line">
        <Marquee items={['Full Stack', 'TypeScript', 'MERN', 'Serverless', 'PostgreSQL', 'Marketplace', 'POS']} variant="stroke" />
      </div>

      {/* Filters */}
      <div className="border-b border-line">
        <div className="max-w-site mx-auto px-5 md:px-10 flex gap-2 py-4 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 mono text-[11px] uppercase tracking-wider rounded-full whitespace-nowrap transition-all ${
                filter === f ? 'bg-accent text-bg' : 'text-muted hover:text-white border border-line'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Featured — case studies with real screenshots */}
      {featured.length > 0 && (
        <section className="max-w-site mx-auto px-5 md:px-10 pt-16 md:pt-24 pb-8 md:pb-12">
          <div className="flex items-end justify-between gap-6 mb-10 md:mb-14" data-reveal>
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-accent" />
              <span className="eyebrow">Case Studies</span>
            </div>
            <span className="mono text-[10px] uppercase tracking-widest text-muted">
              {featured.length} live product{featured.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {featured.map((p, i) => (
              <ProjectCard key={p.repo} project={p} index={i} featured />
            ))}
          </div>
        </section>
      )}

      {/* Other projects */}
      {rest.length > 0 && (
        <section className="max-w-site mx-auto px-5 md:px-10 pt-8 pb-16 md:pb-24">
          {featured.length > 0 && (
            <div className="flex items-end justify-between gap-6 mb-10 md:mb-14 pt-8 md:pt-12 border-t border-line" data-reveal>
              <div className="flex items-center gap-3 pt-8 md:pt-12">
                <span className="w-8 h-px bg-accent" />
                <span className="eyebrow">More Work</span>
              </div>
              <span className="mono text-[10px] uppercase tracking-widest text-muted pt-8 md:pt-12">
                {rest.length} project{rest.length === 1 ? '' : 's'}
              </span>
            </div>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((p, i) => (
              <ProjectCard key={p.repo} project={p} index={featured.length + i} />
            ))}
          </div>
        </section>
      )}

      {shown.length === 0 && (
        <p className="text-muted text-sm text-center py-20">No projects with this tag.</p>
      )}
    </div>
  );
}
