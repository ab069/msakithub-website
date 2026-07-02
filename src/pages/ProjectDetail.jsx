import { useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '../components/TextReveal.jsx';
import MagneticButton from '../components/MagneticButton.jsx';
import { projects } from '../data/projects.js';
import useSeo from '../hooks/useSeo.js';

gsap.registerPlugin(ScrollTrigger);

function initials(name) {
  const words = name.replace(/[^a-zA-Z0-9 .]/g, '').split(/[\s.]+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const root = useRef(null);
  const project = projects.find((p) => p.slug === slug);

  useSeo(
    project
      ? {
          title: project.name,
          description: project.desc,
          path: `/projects/${project.slug}`,
        }
      : { title: 'Projects', path: '/projects' }
  );

  useEffect(() => {
    if (!project) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) =>
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      );
    }, root);
    return () => ctx.revert();
  }, [project]);

  if (!project) return <Navigate to="/projects" replace />;

  const hasDetail = project.workflow && project.workflow.length > 0;

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="relative max-w-site mx-auto px-5 md:px-10 pt-40 pb-16 border-b border-line">
        <Link
          to="/projects"
          className="mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-accent transition-colors"
          data-reveal
        >
          ← Back to Projects
        </Link>

        <div className="flex items-center gap-3 mt-8 mb-6" data-reveal>
          <span className="w-8 h-px bg-accent" />
          <span className="eyebrow">{project.year}</span>
        </div>

        <TextReveal text={project.name} as="h1" className="font-display t-hero text-white" />

        {project.tagline && (
          <p className="mt-4 font-display text-xl md:text-2xl text-accent" data-reveal>
            {project.tagline}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-2" data-reveal>
          {project.tags.map((t) => (
            <span
              key={t}
              className="mono text-[10px] tracking-wider text-white/60 border border-line px-3 py-1.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-8 flex gap-4 flex-wrap" data-reveal>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="btn btn-fill text-sm"
            >
              <span>View Live →</span>
            </a>
          )}
          {project.github && (
            <a
              href={`${project.github}/${project.repo}`}
              target="_blank"
              rel="noreferrer"
              className="btn text-sm"
            >
              <span>GitHub Repo</span>
            </a>
          )}
        </div>
      </section>

      {/* Hero Image */}
      <section className="border-b border-line" data-reveal>
        {project.image ? (
          <div className="relative overflow-hidden bg-card" style={{ maxHeight: '600px' }}>
            <img
              src={project.image}
              alt={`${project.name} screenshot`}
              className="w-full h-full object-cover object-top"
              style={{ maxHeight: '600px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="relative h-72 md:h-96 bg-card grid place-items-center overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <span className="font-display text-[10rem] text-white/[0.04] select-none">
              {initials(project.name)}
            </span>
          </div>
        )}
      </section>

      {/* Overview */}
      {hasDetail && (
        <section className="max-w-site mx-auto px-5 md:px-10 py-20 md:py-28 border-b border-line">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div data-reveal>
              <span className="eyebrow mb-6 block">The Problem</span>
              <p className="text-white/80 text-base md:text-lg leading-relaxed">
                {project.problem}
              </p>
            </div>
            <div data-reveal>
              <span className="eyebrow mb-6 block">The Solution</span>
              <p className="text-white/80 text-base md:text-lg leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Workflow */}
      {hasDetail && (
        <section className="border-b border-line">
          <div className="max-w-site mx-auto px-5 md:px-10 py-20 md:py-28">
            <div className="flex items-center gap-3 mb-12" data-reveal>
              <span className="w-8 h-px bg-accent" />
              <span className="eyebrow">How It Works</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {project.workflow.map((step) => (
                <div
                  key={step.step}
                  className="relative border border-line bg-surface p-8 group hover:border-accent/40 transition-colors duration-300"
                  data-reveal
                >
                  <span className="font-display text-[4rem] leading-none text-white/[0.04] group-hover:text-accent/10 transition-colors select-none block mb-6">
                    {step.step}
                  </span>
                  <h3 className="font-display text-lg text-white mb-3">{step.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                  <span className="absolute top-6 right-6 mono text-[10px] text-muted/40">{step.step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="border-b border-line">
          <div className="max-w-site mx-auto px-5 md:px-10 py-20 md:py-28">
            <div className="flex items-center gap-3 mb-12" data-reveal>
              <span className="w-8 h-px bg-accent" />
              <span className="eyebrow">Product Screenshots</span>
            </div>

            <div className="space-y-6">
              {project.gallery.map((src, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden border border-line bg-card group"
                  data-reveal
                >
                  <img
                    src={src}
                    alt={`${project.name} screenshot ${i + 1}`}
                    className="w-full h-auto object-cover object-top group-hover:scale-[1.01] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute bottom-4 right-4 mono text-[10px] text-white/30">
                    {String(i + 1).padStart(2, '0')} / {String(project.gallery.length).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tech Stack */}
      {project.tech && (
        <section className="border-b border-line">
          <div className="max-w-site mx-auto px-5 md:px-10 py-20 md:py-28">
            <div className="flex items-center gap-3 mb-12" data-reveal>
              <span className="w-8 h-px bg-accent" />
              <span className="eyebrow">Tech Stack</span>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              {project.tech.map((group) => (
                <div key={group.category} data-reveal>
                  <span className="mono text-[10px] uppercase tracking-[0.18em] text-muted block mb-5">
                    {group.category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="text-sm text-white/70 border border-line px-3 py-1.5 rounded-full hover:border-accent/40 hover:text-white transition-colors"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-line text-center py-24 md:py-36 px-5">
        <TextReveal text="Want something like this?" as="h2" className="font-display t-mega text-white mb-8" />
        <div data-reveal>
          <MagneticButton to="/contact" className="btn btn-fill" data-cursor="go">
            <span>Let's build it</span>
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}
