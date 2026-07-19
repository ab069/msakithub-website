import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import HeroCanvas from '../components/HeroCanvas.jsx';
import Marquee, { Conveyor } from '../components/Marquee.jsx';
import TextReveal from '../components/TextReveal.jsx';
import Counter from '../components/Counter.jsx';
import Scramble from '../components/Scramble.jsx';
import MagneticButton from '../components/MagneticButton.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { projects } from '../data/projects.js';
import useSeo from '../hooks/useSeo.js';

gsap.registerPlugin(ScrollTrigger);

const featured = projects.filter((p) => p.featured).slice(0, 6);

const heroLines = ['Building reliable', 'software & digital', 'solutions.'];
const EYEBROW = "PAKISTAN'S TRUSTED IT PARTNER";

const bento = [
  { n: 'SRV-001', t: 'Software Development', d: 'Custom software tailored to your business processes. Secure, scalable, maintainable.', href: '/services#software', big: true },
  { n: 'SRV-002', t: 'Web Development', d: 'Professional, responsive, performance-optimized websites and web applications.', href: '/services#web' },
  { n: 'SRV-003', t: 'Mobile Apps', d: 'Native and cross-platform apps for Android and iOS with a focus on usability.', href: '/services#mobile' },
  { n: 'SRV-004', t: 'Digital Marketing', d: 'Strategic marketing to increase visibility, attract customers and drive growth.', href: '/services#marketing' },
  { n: 'SRV-005', t: 'UI/UX Design', d: 'Intuitive, accessible interfaces that improve experience and engagement.', href: '/services#design' },
  { n: 'SRV-006', t: 'IT Consultancy', d: 'Strategic consulting to make informed technology decisions and optimize operations.', href: '/services#consultancy' },
];

const pillars = [
  { t: 'Technical Excellence', d: 'Deep technical expertise combined with practical business understanding.' },
  { t: 'Clear Communication', d: 'Transparent updates throughout every stage of the project lifecycle.' },
  { t: 'Realistic Timelines', d: 'Achievable deadlines, delivered on. No surprises — just dependable delivery.' },
  { t: 'Professionalism', d: 'Every project handled with confidentiality, accountability and care.' },
];

const bullets = [
  'Custom software development expertise',
  'Transparent and client-focused approach',
  'Long-term partnership mindset',
  'Measurable results and clean execution',
];

const stack = ['React', 'Node.js', 'Flutter', 'Laravel', 'AWS', 'Figma', 'Next.js', 'Shopify'];

const testimonials = [
  {
    q: 'MSAK rebuilt our online storefront from scratch — the new site loads in under a second and looks exactly like the moodboards we shared. Sales went up in the first month.',
    n: 'Superdecor',
    r: 'Interior & Home Décor',
  },
  {
    q: 'Booking used to be handled over WhatsApp and it was chaos. Their team designed a calm, professional booking platform that our clients actually enjoy using. Communication was thoughtful throughout.',
    n: 'Healing Minds',
    r: 'Mental Wellness Studio',
  },
  {
    q: 'Deadlines were tight and expectations were high. MSAK delivered a polished corporate site and CRM integration on schedule with zero surprises. Real professionals.',
    n: 'Sunry Consultants',
    r: 'Business Advisory',
  },
  {
    q: 'What impressed us most was the transparency. Weekly walkthroughs, clean code, clear reporting. It felt like an in-house team, not an agency.',
    n: 'Zaks Consultants',
    r: 'Management Consulting',
  },
  {
    q: 'The MSAK team understood our brand almost instantly. The custom platform they built is fast, secure and easy for our staff to maintain — exactly what we asked for.',
    n: 'iSubhan',
    r: 'Digital Services',
  },
  {
    q: 'We came in with a rough idea and left with a production-ready product. Their engineering discipline and design sensibility are hard to find in one shop.',
    n: 'Ddigi Core',
    r: 'Creative & Digital Agency',
  },
];

export default function Home() {
  useSeo({
    description: 'MSAK IT Hub is a Pakistan-based IT and software company delivering custom software, web and mobile apps, design, marketing and IT consultancy — engineered for outcomes.',
    path: '/',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': 'https://msakithub.com/#webpage',
        'url': 'https://msakithub.com/',
        'name': "MSAK IT Hub — Pakistan's Trusted IT & Software Partner",
        'description': 'Pakistan-based IT and software company delivering custom software, web and mobile apps, design, marketing and IT consultancy.',
        'isPartOf': { '@id': 'https://msakithub.com/#website' },
        'about': { '@id': 'https://msakithub.com/#organization' },
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [{ '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://msakithub.com/' }],
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'IT & Software Services by MSAK IT Hub',
        'url': 'https://msakithub.com/services',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Custom Software Development', 'url': 'https://msakithub.com/services#software' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Web Development', 'url': 'https://msakithub.com/services#web' },
          { '@type': 'ListItem', 'position': 3, 'name': 'Mobile App Development', 'url': 'https://msakithub.com/services#mobile' },
          { '@type': 'ListItem', 'position': 4, 'name': 'Digital Marketing', 'url': 'https://msakithub.com/services#marketing' },
          { '@type': 'ListItem', 'position': 5, 'name': 'UI/UX Design', 'url': 'https://msakithub.com/services#design' },
          { '@type': 'ListItem', 'position': 6, 'name': 'IT Consultancy', 'url': 'https://msakithub.com/services#consultancy' },
        ],
      },
    ],
  });
  const root = useRef(null);
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const pillarSectionRef = useRef(null);
  const pillarTrackRef = useRef(null);
  const railRef = useRef(null);
  const [eyebrowText, setEyebrowText] = useState('');
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Hero load orchestration: doors → eyebrow type → lines → sub → CTAs → 3D fade ── */
  useEffect(() => {
    if (reduce) { setEyebrowText(EYEBROW); return; }
    const lines = (heroTitleRef.current && heroTitleRef.current.querySelectorAll('.tr-inner')) || [];
    gsap.set(lines, { yPercent: 120, skewY: 4 });
    gsap.set([heroSubRef.current, ctaRef.current], { opacity: 0, y: 24 });
    const canvasRoot = document.querySelector('.hero-canvas-root');
    if (canvasRoot) gsap.set(canvasRoot, { opacity: 0 });

    let typeId;
    const play = () => {
      let i = 0;
      typeId = setInterval(() => {
        i += 1;
        setEyebrowText(EYEBROW.slice(0, i));
        if (i >= EYEBROW.length) clearInterval(typeId);
      }, 28);

      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(lines, { yPercent: 0, skewY: 0, duration: 1.0, stagger: 0.09, ease: 'expo.out' }, 0.5)
        .to(heroSubRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.45')
        .to(canvasRoot || '.hero-canvas-root', { opacity: 1, duration: 1.2, ease: 'power2.inOut' }, '-=0.6');
    };

    play();
    return () => {
      clearInterval(typeId);
    };
  }, [reduce]);

  /* ── Scroll-driven animations ── */
  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      gsap.utils.toArray('[data-stagger]').forEach((group) => {
        gsap.from(group.children, {
          y: 40, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        });
      });

      /* STATS — vertical hairlines draw top→bottom */
      gsap.from('.stat-divider', {
        scaleY: 0, transformOrigin: 'top', duration: 0.8, stagger: 0.15, ease: 'power3.inOut',
        scrollTrigger: { trigger: statsRef.current, start: 'top 85%', once: true },
      });

      /* CHECKLIST — items slide from right, checkmarks draw stroke */
      gsap.utils.toArray('.check-item').forEach((item, i) => {
        const path = item.querySelector('.check-path');
        if (path) {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        }
        gsap.from(item, {
          x: 24, opacity: 0, duration: 0.6, delay: i * 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.check-list', start: 'top 85%', once: true },
        });
        if (path) {
          gsap.to(path, {
            strokeDashoffset: 0, duration: 0.5, delay: 0.25 + i * 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: '.check-list', start: 'top 85%', once: true },
          });
        }
      });

      /* BENTO — stagger rise */
      ScrollTrigger.batch('.flood', {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.from(els, { y: 40, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }),
      });

      /* WHY CHOOSE US — horizontal scroll-jack (desktop only) */
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        const track = pillarTrackRef.current;
        const section = pillarSectionRef.current;
        if (!track || !section) return;
        const panels = track.children.length;
        const tween = gsap.to(track, {
          xPercent: -100 * ((panels - 1) / panels),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (railRef.current) railRef.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
        return () => tween.kill();
      });
      mm.add('(max-width: 767px)', () => {
        gsap.utils.toArray('.pillar-panel').forEach((el) => {
          gsap.from(el, {
            y: 40, opacity: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={root}>
      {/* ───────────── HERO — 3D WIREFRAME CORE ───────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        <HeroCanvas />
        <div className="hero-inner relative z-10 max-w-site w-full mx-auto px-5 md:px-10 pb-16 pt-40">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px bg-accent" />
            <span className="eyebrow">{eyebrowText || ' '}</span>
          </div>

          <h1 ref={heroTitleRef} className="font-display t-hero text-white">
            {heroLines.map((line, i) => (
              <span key={i} className="word block overflow-hidden">
                <span className="tr-inner block">
                  {i === 2 ? <em>{line}</em> : line}
                </span>
              </span>
            ))}
          </h1>

          <div className="mt-10 flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
            <p ref={heroSubRef} className="text-white/60 text-sm md:text-base leading-relaxed max-w-sm">
              Scalable, secure and results-driven technology solutions for startups, SMEs and enterprises.
            </p>
            <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
              <MagneticButton to="/contact" className="btn btn-fill" data-cursor="go">
                <span>Get Started</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </MagneticButton>
              <MagneticButton to="/services" className="btn btn-ghost"><span>Our Services</span></MagneticButton>
            </div>
          </div>
        </div>

      </section>

      {/* ───────────── STATS STRIP — odometer + hairline draw ───────────── */}
      <section ref={statsRef} className="border-y border-line bg-surface">
        <div className="max-w-site mx-auto px-5 md:px-10 grid grid-cols-1 sm:grid-cols-3">
          {[
            { v: 5, s: '+', l: 'Years of Combined Experience' },
            { v: 100, s: '%', l: 'Client Satisfaction' },
            { v: 50, s: '+', l: 'Projects Delivered' },
          ].map((st, i) => (
            <div key={st.l} className="relative py-12 md:py-16 px-2 sm:px-10 first:pl-0">
              {i > 0 && <span className="stat-divider hidden sm:block absolute left-0 top-0 h-full w-px bg-line" />}
              <div className="font-display text-accent leading-none" style={{ fontSize: 'clamp(3rem,6vw,5.5rem)' }}>
                <Counter to={st.v} suffix={st.s} />
              </div>
              <p className="mono text-muted text-[11px] uppercase tracking-[0.18em] mt-3">{st.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── WHO WE ARE — split reveal + checklist cascade ───────────── */}
      <section className="relative max-w-site mx-auto px-5 md:px-10 py-24 md:py-40">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div>
            <div className="flex items-center gap-3 mb-6" data-reveal>
              <span className="w-8 h-px bg-accent" /><Scramble text="Who We Are" />
            </div>
            <TextReveal text="A professional software house built on trust." as="h2" className="font-display t-h2 text-white" />
            <div className="mt-8 space-y-5 text-muted text-sm leading-relaxed max-w-md" data-reveal>
              <p>MSAK IT Hub is a professional software house registered in Pakistan, specializing in custom software, web and mobile apps, digital marketing and IT consulting designed to support business growth.</p>
              <p>Our approach is practical, transparent and client-focused. We believe in long-term partnerships, clean execution and measurable results.</p>
            </div>
            <div className="mt-10" data-reveal>
              <Link to="/about" className="btn btn-ghost"><span>Learn more about us</span></Link>
            </div>
          </div>

          {/* QA checklist being ticked live */}
          <div className="glass spot p-8 md:p-12">
            <p className="mono text-[10px] uppercase tracking-[0.22em] text-muted mb-8">QA_CHECKLIST // VERIFIED</p>
            <ul className="check-list space-y-7">
              {bullets.map((b, i) => (
                <li key={b} className="check-item flex items-center gap-5 text-sm md:text-base text-white/80 border-b border-line pb-7 last:border-0 last:pb-0">
                  <span className="w-7 h-7 border border-line grid place-items-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path className="check-path" d="M2.5 7.5l3 3 6-7" stroke="#FF6B4A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </span>
                  <span className="mono text-[10px] text-muted shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────── SERVICES BENTO — card flood inversion ───────────── */}
      <section className="border-y border-line bg-bg">
        <div className="max-w-site mx-auto px-5 md:px-10 py-24 md:py-36">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <div className="flex items-center gap-3 mb-6" data-reveal>
                <span className="w-8 h-px bg-accent" /><Scramble text="What We Do" />
              </div>
              <TextReveal text="End-to-end digital solutions" as="h2" className="font-display t-h2 text-white" />
            </div>
            <Link to="/services" className="btn btn-ghost shrink-0" data-cursor="view"><span>All services</span></Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 [grid-auto-rows:minmax(220px,auto)]">
            {bento.map((s) => (
              <Link
                key={s.n}
                to={s.href}
                data-cursor="view"
                className={`flood spot group p-8 md:p-10 flex flex-col justify-between ${s.big ? 'sm:col-span-2 sm:row-span-2' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <span className="flood-eyebrow mono text-[10px] uppercase tracking-[0.22em] text-muted">{s.n}</span>
                  <svg className="flood-arrow text-accent" width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M2 12L12 2M4 2h8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div className={s.big ? 'mt-24' : 'mt-10'}>
                  <h3 className={`flood-title font-archivo font-extrabold uppercase text-white leading-tight ${s.big ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'}`}>{s.t}</h3>
                  <p className="flood-desc text-muted text-sm mt-4 leading-relaxed max-w-sm">{s.d}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── TECH STACK — conveyor belt ───────────── */}
      <section className="border-b border-line">
        <div className="py-4 border-b border-line">
          <Conveyor items={stack} />
        </div>
        <div className="py-4">
          <Conveyor items={stack} reverse />
        </div>
      </section>

      {/* ───────────── SELECTED WORK ───────────── */}
      <section className="max-w-site mx-auto px-5 md:px-10 py-24 md:py-36">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-6" data-reveal>
              <span className="w-8 h-px bg-accent" /><Scramble text="Selected Work" />
            </div>
            <TextReveal text="Projects we're proud of." as="h2" className="font-display t-h2 text-white" />
          </div>
          <Link to="/projects" className="btn btn-ghost shrink-0" data-cursor="view"><span>View all work</span></Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-stagger>
          {featured.map((p, i) => (
            <ProjectCard key={p.repo} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* ───────────── TESTIMONIALS — client voices ───────────── */}
      <section className="border-y border-line bg-surface">
        <div className="max-w-site mx-auto px-5 md:px-10 py-24 md:py-36">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <div className="flex items-center gap-3 mb-6" data-reveal>
                <span className="w-8 h-px bg-accent" /><Scramble text="Client Voices" />
              </div>
              <TextReveal text="Trusted by teams we've helped grow." as="h2" className="font-display t-h2 text-white" />
            </div>
            <p className="text-muted text-sm max-w-sm leading-relaxed" data-reveal>
              A few words from businesses we've partnered with across software, design and consulting.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" data-stagger>
            {testimonials.map((t) => (
              <figure
                key={t.n}
                className="card-hov relative flex flex-col justify-between p-7 md:p-8 bg-bg/60 border border-line h-full"
              >
                <svg className="text-accent mb-6 shrink-0" width="26" height="20" viewBox="0 0 26 20" fill="currentColor" aria-hidden="true">
                  <path d="M0 20V11.5C0 5.15 3.55 1.05 10.65 0v3.6C6.35 4.6 4.4 6.85 4.4 10h4.35V20H0zm15.35 0V11.5C15.35 5.15 18.9 1.05 26 0v3.6c-4.3 1-6.25 3.25-6.25 6.4h4.35V20H15.35z" opacity="0.7"/>
                </svg>
                <blockquote className="text-white/85 text-[15px] leading-relaxed flex-1">
                  {t.q}
                </blockquote>
                <figcaption className="mt-6 pt-5 border-t border-line">
                  <div className="font-display text-white text-lg leading-tight">{t.n}</div>
                  <div className="mono text-[10px] uppercase tracking-[0.18em] text-muted mt-1.5">{t.r}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── MARQUEE DIVIDER ───────────── */}
      <div className="py-8 border-y border-line">
        <Marquee items={['Trusted', 'Scalable', 'Secure', 'Results-Driven', 'Professional']} variant="accent" direction={-1} />
      </div>

      {/* ───────────── WHY CHOOSE US — horizontal scroll-jack ───────────── */}
      <section ref={pillarSectionRef} className="relative bg-surface border-b border-line md:h-[400vh]">
        <div className="relative md:sticky md:top-0 md:h-screen overflow-hidden">
        <div className="absolute top-0 inset-x-0 z-10 max-w-site mx-auto px-5 md:px-10 pt-20 md:pt-24 pointer-events-none">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-accent" /><Scramble text="Why Choose Us — Inspection Line" />
          </div>
          <h2 className="font-display t-h3 text-white">Technology that works for you</h2>
        </div>

        <div
          ref={pillarTrackRef}
          className="flex flex-col md:flex-row md:h-full md:w-max will-change-transform pt-44 md:pt-0"
        >
          {pillars.map((p, i) => (
            <div
              key={p.t}
              className="pillar-panel relative shrink-0 w-full md:w-screen md:h-full flex items-center border-t md:border-t-0 md:border-l border-line first:border-0"
            >
              <span
                className="absolute right-4 md:right-16 bottom-8 md:bottom-16 font-display leading-none select-none text-stroke pointer-events-none"
                style={{ fontSize: 'clamp(8rem,28vw,26rem)', opacity: 0.5 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="relative max-w-site w-full mx-auto px-5 md:px-10 py-16 md:py-0">
                <span className="mono text-[10px] uppercase tracking-[0.22em] text-muted block mb-6">STATION_{String(i + 1).padStart(2, '0')} / 04</span>
                <h3 className="font-display t-h2 text-white max-w-2xl">{p.t}</h3>
                <p className="text-muted text-sm md:text-base mt-6 max-w-md leading-relaxed">{p.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pillar-rail hidden md:block">
          <div ref={railRef} className="fill" />
        </div>
        </div>
      </section>

      {/* ───────────── BOTTOM CTA ───────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative max-w-site mx-auto px-5 md:px-10 py-28 md:py-44 text-center">
          <span className="eyebrow" data-reveal>Start today</span>
          <TextReveal text="Ready to build something amazing?" as="h2" className="font-display t-mega text-white mt-6 max-w-5xl mx-auto" />
          <p className="text-muted text-sm md:text-base max-w-md mx-auto mt-8 leading-relaxed" data-reveal>
            Whether you're a startup with a new idea or an enterprise looking to optimize, we're here to help build technology that works.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4" data-reveal>
            <MagneticButton to="/contact" className="btn btn-fill" data-cursor="go"><span>Start a Project</span></MagneticButton>
            <MagneticButton to="/services" className="btn btn-ghost"><span>See How We Work</span></MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}
