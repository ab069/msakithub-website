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
        <TextReveal text="Projects & case studies" as="h1" className="font-display t-hero text-white" />
        <div className="mt-10" data-reveal>
          <p className="text-muted text-sm md:text-base leading-relaxed max-w-xl">
            A selection of {projects.length} builds — from full-stack platforms and serverless POS systems to portfolios and experiments.
          </p>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-8 border-b border-line">
        <Marquee items={['Full Stack', 'TypeScript', 'MERN', 'Serverless', 'PostgreSQL']} variant="stroke" />
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

      {/* Grid */}
      <section className="max-w-site mx-auto px-5 md:px-10 py-16 md:py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((p, i) => (
            <ProjectCard key={p.repo} project={p} index={i} />
          ))}
        </div>
        {shown.length === 0 && <p className="text-muted text-sm text-center py-20">No projects with this tag.</p>}
      </section>
    </div>
  );
}
