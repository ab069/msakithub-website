import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '../components/TextReveal.jsx';
import Marquee from '../components/Marquee.jsx';
import MagneticButton from '../components/MagneticButton.jsx';
import Scramble from '../components/Scramble.jsx';
import useSeo from '../hooks/useSeo.js';

gsap.registerPlugin(ScrollTrigger);

const services = [
  { id: 'software', n: 'SRV-001', t: 'Custom Software Development', core: true, intro: 'Custom software solutions tailored to your business processes. Secure, scalable and easy to maintain.', tags: ['Enterprise Software', 'Maintenance & Support'] },
  { id: 'web', n: 'SRV-002', t: 'Web Development', core: true, intro: 'Professional, responsive and performance-optimized websites that represent your brand.', tags: ['Web Applications', 'E-Commerce'] },
  { id: 'mobile', n: 'SRV-003', t: 'Mobile App Development', core: true, intro: 'Mobile applications for Android and iOS focused on usability, performance and reliability.', tags: ['Cross-Platform', 'App Maintenance'] },
  { id: 'marketing', n: 'SRV-004', t: 'Digital Marketing', core: false, intro: 'Marketing services that increase visibility, attract customers and generate measurable growth.', tags: ['SEO', 'Social Media', 'Paid Ads (PPC)', 'Content Marketing'] },
  { id: 'design', n: 'SRV-005', t: 'UI/UX Design', core: false, intro: 'Intuitive, visually appealing interfaces focused on usability, accessibility and consistency.', tags: ['Wireframing & Prototyping'] },
  { id: 'consultancy', n: 'SRV-006', t: 'IT Consultancy', core: false, intro: 'Strategic IT consulting focused on efficiency, scalability and cost optimization.', tags: ['System Analysis', 'Technology Advisory'] },
];

export default function Services() {
  useSeo({
    title: 'Services',
    description: 'Custom software development, web and mobile app development, UI/UX design, digital marketing and IT consultancy — comprehensive IT services from MSAK IT Hub, Pakistan.',
    path: '/services',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'url': 'https://msakithub.com/services',
      'name': 'IT & Software Services — MSAK IT Hub',
      'description': 'Comprehensive IT and digital services: custom software, web development, mobile apps, UI/UX design, digital marketing and IT consultancy.',
      'provider': { '@id': 'https://msakithub.com/#organization' },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://msakithub.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Services', 'item': 'https://msakithub.com/services' },
        ],
      },
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'item': { '@type': 'Service', 'name': 'Custom Software Development', 'description': 'Custom software tailored to your business processes. Secure, scalable and easy to maintain.', 'provider': { '@id': 'https://msakithub.com/#organization' } } },
          { '@type': 'ListItem', 'position': 2, 'item': { '@type': 'Service', 'name': 'Web Development', 'description': 'Professional, responsive and performance-optimized websites that represent your brand.', 'provider': { '@id': 'https://msakithub.com/#organization' } } },
          { '@type': 'ListItem', 'position': 3, 'item': { '@type': 'Service', 'name': 'Mobile App Development', 'description': 'Mobile applications for Android and iOS focused on usability, performance and reliability.', 'provider': { '@id': 'https://msakithub.com/#organization' } } },
          { '@type': 'ListItem', 'position': 4, 'item': { '@type': 'Service', 'name': 'Digital Marketing', 'description': 'Marketing services that increase visibility, attract customers and generate measurable growth.', 'provider': { '@id': 'https://msakithub.com/#organization' } } },
          { '@type': 'ListItem', 'position': 5, 'item': { '@type': 'Service', 'name': 'UI/UX Design', 'description': 'Intuitive, visually appealing interfaces focused on usability, accessibility and consistency.', 'provider': { '@id': 'https://msakithub.com/#organization' } } },
          { '@type': 'ListItem', 'position': 6, 'item': { '@type': 'Service', 'name': 'IT Consultancy', 'description': 'Strategic IT consulting focused on efficiency, scalability and cost optimization.', 'provider': { '@id': 'https://msakithub.com/#organization' } } },
        ],
      },
    },
  });
  const root = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) =>
        gsap.from(el, { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      );

      // stacking cards: each card scales down slightly as the next one slides over it
      gsap.utils.toArray('.stack-card').forEach((card, i, all) => {
        if (i === all.length - 1) return;
        gsap.to(card, {
          scale: 0.94,
          opacity: 0.65,
          ease: 'none',
          scrollTrigger: {
            trigger: all[i + 1],
            start: 'top bottom',
            end: 'top top+=140',
            scrub: true,
          },
        });
        // pill dot blinks when each card pins
        ScrollTrigger.create({
          trigger: card,
          start: 'top center',
          once: true,
          onEnter: () => {
            const dot = card.querySelector('.pill .dot');
            if (dot) dot.classList.add('blink-once');
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <section className="relative max-w-site mx-auto px-5 md:px-10 pt-44 pb-20 border-b border-line">
        <div className="flex items-center gap-3 mb-8" data-reveal><span className="w-8 h-px bg-accent" /><Scramble text="Our Services — Catalog" /></div>
        <TextReveal text="Comprehensive IT & digital solutions" as="h1" className="font-display t-hero text-white" />
        <p className="mt-10 text-muted text-sm md:text-base leading-relaxed max-w-xl" data-reveal>
          A range of IT and digital services designed to support businesses at every stage of growth — flexible, scalable and aligned with modern standards.
        </p>
      </section>

      <div className="py-6 border-b border-line">
        <Marquee items={['Software', 'Web', 'Mobile', 'Marketing', 'Design', 'Consultancy']} variant="stroke" />
      </div>

      {/* ── Sticky stacking catalog — cards pile up as you scroll ── */}
      <section className="max-w-site mx-auto px-5 md:px-10 py-20 md:py-28">
        <div className="stack-wrap space-y-8">
          {services.map((s, i) => (
            <article
              key={s.id}
              id={s.id}
              className="stack-card spot glass p-8 md:p-12 scroll-mt-28"
              style={{ top: `calc(96px + ${i * 26}px)` }}
              data-cursor="view"
            >
              <div className="flex items-center justify-between mb-8 relative z-[2]">
                <span className="mono text-[10px] uppercase tracking-[0.24em] text-muted">{s.n}</span>
                <span className={`pill ${s.core ? '' : 'live'}`}>
                  <span className="dot" />
                  {s.core ? 'Core Service' : 'Available'}
                </span>
              </div>

              <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-16 items-start relative z-[2]">
                <div>
                  <h2 className="font-display t-h3 text-white leading-tight">{s.t}</h2>
                  <p className="text-muted text-sm md:text-base leading-relaxed mt-4 max-w-lg">{s.intro}</p>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end md:pt-2">
                  {s.tags.map((tag) => (
                    <span key={tag} className="mono text-[10px] uppercase tracking-[0.14em] text-white/60 border border-line rounded-full px-3 py-1.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-site mx-auto px-5 md:px-10 pb-24 md:pb-32">
        <div className="relative glass spot p-10 md:p-16 overflow-hidden" data-reveal>
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative z-[2]">
            <Scramble text="Need a custom solution?" />
            <TextReveal text="Let's discuss your requirements." as="h2" className="font-display t-h2 text-white mt-5 mb-6 max-w-2xl" />
            <p className="text-muted text-sm max-w-md mb-10 leading-relaxed">We work with startups, SMEs and established organizations, delivering solutions tailored to specific business needs.</p>
            <MagneticButton to="/contact" className="btn btn-fill" data-cursor="go"><span>Contact Us</span></MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}
