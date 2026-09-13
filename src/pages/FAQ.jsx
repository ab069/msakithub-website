import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '../components/TextReveal.jsx';
import Scramble from '../components/Scramble.jsx';
import MagneticButton from '../components/MagneticButton.jsx';
import useSeo from '../hooks/useSeo.js';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: 'What services does MSAK IT Hub offer?',
    a: 'MSAK IT Hub provides custom software development, web development, mobile app development (iOS and Android), UI/UX design, digital marketing (SEO, social media, paid ads) and IT consultancy. Most engagements combine two or three of these — for example a web app plus its design system, or a mobile app plus ongoing IT consultancy.',
  },
  {
    q: 'How much does custom software development cost in Pakistan?',
    a: "It depends on scope, but most fixed-price engagements fall into three tiers: a focused MVP or single-purpose tool, a mid-size business system (POS, CRM, internal dashboard), and a larger multi-module platform (ERP-scale). We quote a fixed price and timeline after a short discovery call — not an hourly estimate that can drift — so you know the total cost before work starts.",
  },
  {
    q: 'How long does a typical project take?',
    a: 'A focused MVP or marketing website usually ships in 3-6 weeks. A mid-size system (POS, booking platform, CRM) typically takes 6-12 weeks. Larger, multi-module platforms (ERP-scale) run 3-6 months, delivered in staged milestones so you see working software throughout, not just at the end.',
  },
  {
    q: 'Do we own the source code after the project is delivered?',
    a: "Yes. You own the source code, the repository access and any accounts created for the project once final payment is made. We don't lock clients into our own hosting or maintenance to keep control of the codebase — that's a separate, optional service.",
  },
  {
    q: 'Can MSAK IT Hub build a minimum viable product (MVP) for a startup?',
    a: 'Yes — MVP builds for early-stage founders are a regular part of our work. We scope the smallest version that proves the core idea, ship it fast, and leave the architecture in a state that can be extended rather than rebuilt once you have real user feedback.',
  },
  {
    q: 'What technologies does MSAK IT Hub work with?',
    a: 'Our core stack is TypeScript, React and Node.js on the frontend/backend, with PostgreSQL for data and serverless functions (Vercel) for APIs — the same stack behind our own shipped products (ERP, POS, CRM, marketplace platforms). We also work in Next.js, React Native for mobile, and integrate AI/LLM features (OpenAI, Anthropic) where they add real value, not as a checkbox.',
  },
  {
    q: 'Does MSAK IT Hub only work with clients in Pakistan?',
    a: 'No — we are a Pakistan-based team serving clients in Pakistan, the United Kingdom and the United States, and are set up for fully remote engagements: video calls, shared project boards, and async updates for clients in different time zones.',
  },
  {
    q: 'What happens after the software is launched — is there ongoing support?',
    a: "Every project includes a warranty period after launch for fixing anything that surfaces under real usage. Beyond that, we offer ongoing maintenance and support retainers — updates, monitoring, backups and small feature additions — for clients who want a long-term partner rather than a one-off vendor.",
  },
  {
    q: 'How do I get a quote from MSAK IT Hub?',
    a: "Email info@msakithub.com or use the contact form with a short description of what you're trying to build. We reply within 24 hours to schedule a call, and follow up with a fixed-price quote and timeline — no obligation, no pressure.",
  },
  {
    q: 'Does MSAK IT Hub offer internships, and how do I verify a certificate?',
    a: 'Yes, MSAK IT Hub runs a structured internship program across development, design and security tracks. Certificates issued to interns can be verified by number on our Verify Certificate page.',
  },
  {
    q: 'Does MSAK IT Hub offer ready-made systems, or is everything custom-built?',
    a: 'Both. We maintain a library of ready-to-customize management systems for common business types (cafes, gyms, clinics, schools, retail) as a faster, lower-cost starting point, with the option to extend into a fully custom system as the business grows. If nothing off-the-shelf fits, we scope a custom build from the ground up.',
  },
  {
    q: 'How does MSAK IT Hub handle data security and client confidentiality?',
    a: 'Client data, source code and business information are treated as strictly confidential under clear written agreements. We follow standard security practices — role-based access control, encrypted connections, and least-privilege credentials — across every system we build and every account we\'re given access to.',
  },
];

export default function FAQ() {
  useSeo({
    title: 'FAQ',
    description: 'Answers to common questions about MSAK IT Hub — pricing, timelines, technology stack, source code ownership, support and how to get a quote.',
    path: '/faq',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'url': 'https://msakithub.com/faq',
        'mainEntity': faqs.map((f) => ({
          '@type': 'Question',
          'name': f.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': f.a },
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://msakithub.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'FAQ', 'item': 'https://msakithub.com/faq' },
        ],
      },
    ],
  });

  const root = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) =>
        gsap.from(el, { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      );
      gsap.utils.toArray('.faq-row').forEach((el, i) =>
        gsap.from(el, { y: 24, opacity: 0, duration: 0.6, delay: (i % 6) * 0.05, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <section className="relative max-w-site mx-auto px-5 md:px-10 pt-44 pb-16 border-b border-line">
        <div className="flex items-center gap-3 mb-8" data-reveal><span className="w-8 h-px bg-accent" /><Scramble text="FAQ" /></div>
        <TextReveal text="Common questions" as="h1" className="font-display t-hero text-white" />
        <p className="mt-10 text-muted text-sm md:text-base leading-relaxed max-w-xl" data-reveal>
          Straight answers on pricing, timelines, technology and how we work — the questions we hear most before a project starts.
        </p>
      </section>

      <section className="max-w-site mx-auto px-5 md:px-10 py-16 md:py-24">
        <div className="max-w-3xl mx-auto divide-y divide-line border-t border-b border-line">
          {faqs.map((f) => (
            <div key={f.q} className="faq-row py-8">
              <h2 className="font-archivo font-bold text-lg md:text-xl text-white">{f.q}</h2>
              <p className="mt-3 text-muted text-sm md:text-base leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-16 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between border border-line bg-surface p-8 md:p-10">
          <div>
            <p className="eyebrow text-muted mb-2">Still have a question?</p>
            <h3 className="font-display t-h3 text-white">Ask us directly.</h3>
          </div>
          <MagneticButton to="/contact" className="btn btn-fill shrink-0" data-cursor="go">
            <span>Contact us</span>
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}
