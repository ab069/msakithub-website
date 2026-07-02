import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '../components/TextReveal.jsx';
import Scramble from '../components/Scramble.jsx';
import Marquee from '../components/Marquee.jsx';
import MagneticButton from '../components/MagneticButton.jsx';
import useSeo from '../hooks/useSeo.js';

gsap.registerPlugin(ScrollTrigger);

const MISSION =
  'We empower businesses through reliable software and digital solutions that support growth, innovation and long-term success.';

const values = [
  { n: '01', v: 'Transparency', d: 'We keep clients informed at every stage — clear timelines, honest pricing and no hidden surprises.' },
  { n: '02', v: 'Professionalism', d: 'Every engagement is handled with discipline, clear communication and respect for client time and resources.' },
  { n: '03', v: 'Accountability', d: 'We own our commitments. If something goes wrong, we say so, fix it, and learn from it.' },
  { n: '04', v: 'Continuous Improvement', d: 'We invest in better tools, sharper skills and refined processes so every project benefits from what we learned on the last one.' },
  { n: '05', v: 'Client Confidentiality', d: 'Client data, code and business information are treated as strictly confidential, protected under clear agreements.' },
];

export default function About() {
  useSeo({
    title: 'About',
    description: 'About MSAK IT Hub — our mission, values, and how we deliver reliable software and digital solutions for growing businesses.',
    path: '/about',
  });
  const root = useRef(null);
  const missionRef = useRef(null);
  const [openValue, setOpenValue] = useState(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) =>
        gsap.from(el, { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      );
      gsap.utils.toArray('.value-row').forEach((el, i) =>
        gsap.from(el, { x: -40, opacity: 0, duration: 0.7, delay: i * 0.05, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      );

      /* ── Word-by-word scroll highlight — scrubbed to scroll position ── */
      const words = (missionRef.current && missionRef.current.querySelectorAll('.hl-word')) || [];
      if (words.length) {
        gsap.to(words, {
          opacity: 1,
          ease: 'none',
          stagger: 0.6,
          scrollTrigger: {
            trigger: missionRef.current,
            start: 'top 75%',
            end: 'bottom 35%',
            scrub: true,
          },
        });
      }

      /* ── Mission/Vision panels — borders draw four sides sequentially ── */
      gsap.utils.toArray('.draw-panel').forEach((panel) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: panel, start: 'top 82%', once: true },
        });
        tl.to(panel.querySelector('.edge.top'), { scaleX: 1, duration: 0.35, ease: 'power2.inOut' })
          .to(panel.querySelector('.edge.right'), { scaleY: 1, duration: 0.35, ease: 'power2.inOut' })
          .to(panel.querySelector('.edge.bottom'), { scaleX: 1, duration: 0.35, ease: 'power2.inOut' })
          .to(panel.querySelector('.edge.left'), { scaleY: 1, duration: 0.35, ease: 'power2.inOut' })
          .from(panel.querySelector('.panel-body'), { opacity: 0, y: 16, duration: 0.5, ease: 'power3.out' }, '-=0.3');
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="relative max-w-site mx-auto px-5 md:px-10 pt-44 pb-20 border-b border-line">
        <div className="flex items-center gap-3 mb-8" data-reveal>
          <span className="w-8 h-px bg-accent" /><Scramble text="About Us" />
        </div>
        <TextReveal text="About MSAK IT Hub" as="h1" className="font-display t-hero text-white" />
        <p className="mt-10 text-muted text-sm md:text-base leading-relaxed max-w-xl" data-reveal>
          An IT and software services company operating in Pakistan, providing technology solutions to businesses across various industries.
        </p>
      </section>

      <div className="py-6 border-b border-line">
        <Marquee items={['Mission', 'Vision', 'Values', 'Trust', 'Quality']} variant="stroke" />
      </div>

      {/* ── MISSION — word-by-word scroll highlight ── */}
      <section className="max-w-site mx-auto px-5 md:px-10 py-28 md:py-44">
        <span className="eyebrow block mb-10" data-reveal>Our Purpose</span>
        <p ref={missionRef} className="font-display text-white leading-[1.05]" style={{ fontSize: 'clamp(1.9rem,4.6vw,4.4rem)' }}>
          {MISSION.split(' ').map((w, i) => (
            <span key={i} className="hl-word inline-block mr-[0.24em]">{w}</span>
          ))}
        </p>
      </section>

      {/* Who we are */}
      <section className="max-w-site mx-auto px-5 md:px-10 pb-24 md:pb-36 grid md:grid-cols-2 gap-16 md:gap-24 items-start border-t border-line pt-24">
        <TextReveal text="Who we are" as="h2" className="font-display t-h2 text-white" />
        <div className="space-y-5 text-muted text-sm leading-relaxed" data-reveal>
          <p>We work closely with our clients to understand their goals and deliver solutions that are practical, scalable and secure.</p>
          <p>Our team consists of experienced developers, designers, marketers and consultants committed to delivering high-quality digital products. We believe technology should simplify processes, improve efficiency and create measurable value.</p>
          <p>As a professional software house registered in Pakistan and operating under the laws of the Islamic Republic of Pakistan, we maintain the highest standards of professionalism and accountability.</p>
        </div>
      </section>

      {/* ── Mission / Vision — border-draw panels ── */}
      <section className="max-w-site mx-auto px-5 md:px-10 pb-24 md:pb-36 grid md:grid-cols-2 gap-6">
        {[
          { label: 'Mission', text: 'To empower businesses through reliable software and digital solutions that support growth, innovation and long-term success.' },
          { label: 'Vision', text: 'To become a trusted technology partner by delivering consistent quality, ethical practices and future-ready digital solutions.' },
        ].map((b) => (
          <div key={b.label} className="draw-panel p-10">
            <span className="edge top" /><span className="edge right" /><span className="edge bottom" /><span className="edge left" />
            <div className="panel-body">
              <div className="flex items-center gap-3 mb-5"><span className="w-1.5 h-1.5 bg-accent" /><span className="eyebrow">{b.label}</span></div>
              <p className="text-white/85 text-lg leading-relaxed">{b.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Values */}
      <section className="border-t border-line">
        <div className="max-w-site mx-auto px-5 md:px-10 py-24 md:py-36">
          <span className="eyebrow" data-reveal>Our Values</span>
          <TextReveal text="What guides everything we do." as="h2" className="font-display t-h2 text-white mt-5 mb-4" />
          <p className="text-muted text-sm max-w-sm mb-14" data-reveal>These values guide every project we undertake and every relationship we build.</p>
          <div className="border-t border-line">
            {values.map((v) => {
              const isOpen = openValue === v.n;
              return (
                <div key={v.n} className="value-row border-b border-line">
                  <button
                    type="button"
                    onClick={() => setOpenValue(isOpen ? null : v.n)}
                    aria-expanded={isOpen}
                    className="group w-full flex items-center justify-between py-7 hover:px-3 transition-all text-left"
                  >
                    <div className="flex items-center gap-8">
                      <span className="mono text-xs text-muted">{v.n}</span>
                      <span className="font-display text-2xl md:text-4xl text-white group-hover:text-accent transition-colors">{v.v}</span>
                    </div>
                    <span className={`w-9 h-9 border border-line grid place-items-center transition-all ${isOpen ? 'bg-accent border-accent' : 'group-hover:bg-accent group-hover:border-accent'}`}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-all ${isOpen ? 'text-black rotate-45' : 'text-white group-hover:text-black'}`}><path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </button>
                  <div className="value-excerpt" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                    <div>
                      <p className="text-muted text-sm leading-relaxed max-w-xl pb-7">{v.d}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line text-center py-24 md:py-36 px-5">
        <TextReveal text="Let's work together." as="h2" className="font-display t-mega text-white mb-8" />
        <div data-reveal><MagneticButton to="/contact" className="btn btn-fill" data-cursor="go"><span>Get in touch</span></MagneticButton></div>
      </section>
    </div>
  );
}
