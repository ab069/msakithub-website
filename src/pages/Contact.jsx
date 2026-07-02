import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '../components/TextReveal.jsx';
import Scramble from '../components/Scramble.jsx';
import useSeo from '../hooks/useSeo.js';

gsap.registerPlugin(ScrollTrigger);

const fields = [
  { id: 'name', label: 'Full Name', type: 'text', required: true },
  { id: 'email', label: 'Email Address', type: 'email', required: true },
  { id: 'company', label: 'Company Name', type: 'text', required: false },
  { id: 'subject', label: 'Subject', type: 'text', required: true },
];

const info = [
  { label: 'Email', value: 'info@msakithub.com', href: 'mailto:info@msakithub.com' },
  { label: 'Website', value: 'msakithub.com', href: 'https://msakithub.com' },
  { label: 'Location', value: 'Pakistan', href: null },
  { label: 'Office Hours', value: 'Mon–Fri · 9:00 AM – 6:00 PM (PKT)', href: null },
];

export default function Contact() {
  useSeo({
    title: 'Contact',
    description: 'Get in touch with MSAK IT Hub. Pakistan-based IT and software services — Mon–Fri 9 AM–6 PM PKT. info@msakithub.com.',
    path: '/contact',
  });
  const root = useRef(null);
  const checkRef = useRef(null);
  const boxRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', company: '', subject: '', message: '' });
  const [state, setState] = useState('idle'); // idle | sending | sent

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) =>
        gsap.from(el, { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      );
      // info column — 60ms stagger fade-in
      gsap.from('.info-row', { x: -24, opacity: 0, duration: 0.55, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: '.info-col', start: 'top 80%', once: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  // success morph: checkmark draws itself, border pulses orange once
  useEffect(() => {
    if (state !== 'sent') return;
    const path = checkRef.current;
    if (!path) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out', delay: 0.15 });
    if (boxRef.current) boxRef.current.classList.add('pulse-border');
  }, [state]);

  const change = (e) => setForm((p) => ({ ...p, [e.target.id]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    setState('sending');
    setTimeout(() => setState('sent'), 450);
  };

  return (
    <div ref={root}>
      <section className="relative max-w-site mx-auto px-5 md:px-10 pt-44 pb-16 border-b border-line">
        <div className="flex items-center gap-3 mb-8" data-reveal><span className="w-8 h-px bg-accent" /><Scramble text="Contact Us" /></div>
        <TextReveal text="Get in touch" as="h1" className="font-display t-hero text-white" />
        <p className="mt-10 text-muted text-sm md:text-base leading-relaxed max-w-xl" data-reveal>
          Always open to discussing new projects, partnerships or support. If you have a question or want to start a project, we'd love to hear from you.
        </p>
      </section>

      <section className="max-w-site mx-auto px-5 md:px-10 py-16 md:py-24 grid md:grid-cols-[1fr_1.5fr] gap-16 md:gap-24">
        {/* ── info column ── */}
        <div className="info-col">
          <h2 className="font-archivo font-extrabold text-2xl md:text-3xl uppercase text-white mb-4" data-reveal>Let's start a conversation</h2>
          <p className="text-muted text-sm leading-relaxed mb-12" data-reveal>
            Whether you're building a new product, need help with an existing project, or want to explore how technology can help your business grow — we're here.
          </p>
          <div className="space-y-6">
            {info.map((it) => (
              <div key={it.label} className="info-row border-b border-line pb-6 last:border-0">
                <p className="eyebrow text-muted mb-1.5">{it.label}</p>
                {it.href ? <a href={it.href} className="text-base text-white hover:text-accent transition-colors link-line">{it.value}</a> : <p className="text-base text-white">{it.value}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* ── form — field spotlight ── */}
        <div className="border border-line bg-surface p-8 md:p-12" data-reveal>
          {state === 'sent' ? (
            <div className="text-center py-16">
              <div ref={boxRef} className="w-16 h-16 border border-accent grid place-items-center mx-auto mb-8">
                <svg width="26" height="26" viewBox="0 0 22 22" fill="none">
                  <path ref={checkRef} d="M4 11l5 5 9-9" stroke="#A78BFA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
              <h3 className="font-display t-h3 text-white mb-3">Message Sent</h3>
              <p className="mono text-[11px] uppercase tracking-[0.18em] text-muted">STATUS: DELIVERED // RESPONSE &lt; 24H</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-10">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
                {fields.map((f) => (
                  <div key={f.id} className="field">
                    <input id={f.id} type={f.type} required={f.required} placeholder=" " value={form[f.id]} onChange={change} />
                    <span className="sweep" />
                    <label htmlFor={f.id}>{f.label}{f.required && <span className="text-accent"> *</span>}</label>
                  </div>
                ))}
              </div>
              <div className="field">
                <textarea id="message" required rows={5} placeholder=" " value={form.message} onChange={change} className="resize-none" />
                <span className="sweep" />
                <label htmlFor="message">Message <span className="text-accent">*</span></label>
              </div>
              <button type="submit" disabled={state === 'sending'} className="btn btn-fill btn-sweep w-full justify-center" data-cursor="send">
                <span>{state === 'sending' ? 'Transmitting…' : 'Send Message'}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
