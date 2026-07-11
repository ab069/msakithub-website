import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '../components/TextReveal.jsx';
import Scramble from '../components/Scramble.jsx';
import MagneticButton from '../components/MagneticButton.jsx';
import useSeo from '../hooks/useSeo.js';

gsap.registerPlugin(ScrollTrigger);

const sections = [
  {
    n: '01',
    h: 'Information We Collect',
    p: [
      'We collect information you provide directly to us — such as your name, email address, company name and message — when you submit a contact form, request a quote or subscribe to updates.',
      'We also collect limited technical information automatically, including your IP address, browser type, device information and pages visited, through standard analytics tools used to improve site performance and user experience.',
    ],
  },
  {
    n: '02',
    h: 'How We Use Your Information',
    p: [
      'To respond to your inquiries, deliver requested services, and provide project updates.',
      'To improve our website, services and client communication.',
      'To send occasional service-related updates when you have opted in.',
      'To comply with legal obligations under the laws of the Islamic Republic of Pakistan.',
    ],
  },
  {
    n: '03',
    h: 'Client Confidentiality',
    p: [
      'Client data, source code, designs and business information shared with MSAK IT Hub are treated as strictly confidential and are protected under written agreements.',
      'We do not sell, rent or share your personal information with third parties for marketing purposes.',
    ],
  },
  {
    n: '04',
    h: 'Cookies & Analytics',
    p: [
      'We use cookies and similar technologies to keep the site functional and to understand aggregate usage patterns. You can disable cookies through your browser settings; some site features may be affected.',
    ],
  },
  {
    n: '05',
    h: 'Third-Party Services',
    p: [
      'We rely on trusted third-party providers for email delivery, analytics and hosting. These providers process data on our behalf under their own privacy commitments and only for the purpose of operating our services.',
    ],
  },
  {
    n: '06',
    h: 'Data Retention',
    p: [
      'We retain personal information only as long as necessary to fulfil the purpose it was collected for, resolve disputes, and meet legal or contractual obligations.',
    ],
  },
  {
    n: '07',
    h: 'Your Rights',
    p: [
      'You may request access to, correction of, or deletion of the personal information we hold about you by contacting us at info@msakithub.com. We will respond within a reasonable timeframe.',
    ],
  },
  {
    n: '08',
    h: 'Security',
    p: [
      'We apply reasonable technical and organizational safeguards to protect the information we hold. However, no method of electronic transmission or storage is completely secure.',
    ],
  },
  {
    n: '09',
    h: 'Changes to This Policy',
    p: [
      'We may update this Privacy Policy from time to time. Material changes will be reflected on this page with an updated effective date.',
    ],
  },
  {
    n: '10',
    h: 'Contact Us',
    p: [
      'If you have any questions about this Privacy Policy or how your information is handled, contact us at info@msakithub.com.',
    ],
  },
];

export default function Privacy() {
  useSeo({
    title: 'Privacy Policy',
    description: 'Privacy Policy for MSAK IT Hub — how we collect, use and protect the information of clients and website visitors.',
    path: '/privacy',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'url': 'https://msakithub.com/privacy',
      'name': 'Privacy Policy — MSAK IT Hub',
      'description': 'How MSAK IT Hub collects, uses and safeguards personal and client information.',
      'isPartOf': { '@id': 'https://msakithub.com/#website' },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://msakithub.com/' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Privacy Policy', 'item': 'https://msakithub.com/privacy' },
        ],
      },
    },
  });

  const root = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) =>
        gsap.from(el, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      );
      gsap.utils.toArray('.p-row').forEach((el, i) =>
        gsap.from(el, { x: -30, opacity: 0, duration: 0.6, delay: i * 0.04, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="relative max-w-site mx-auto px-5 md:px-10 pt-44 pb-20 border-b border-line">
        <div className="flex items-center gap-3 mb-8" data-reveal>
          <span className="w-8 h-px bg-accent" /><Scramble text="Legal" />
        </div>
        <TextReveal text="Privacy Policy" as="h1" className="font-display t-hero text-white" />
        <p className="mt-10 text-muted text-sm md:text-base leading-relaxed max-w-2xl" data-reveal>
          This policy explains how MSAK IT Hub collects, uses and safeguards information provided by clients and website visitors.
        </p>
        <p className="mt-4 mono text-[11px] tracking-[0.14em] text-muted uppercase" data-reveal>
          Effective date · January 2026
        </p>
      </section>

      {/* Sections */}
      <section className="max-w-site mx-auto px-5 md:px-10 py-20 md:py-28">
        <div className="border-t border-line">
          {sections.map((s) => (
            <div key={s.n} className="p-row border-b border-line py-10 md:py-14 grid md:grid-cols-12 gap-6 md:gap-10">
              <div className="md:col-span-3 flex items-start gap-4">
                <span className="mono text-xs text-muted">{s.n}</span>
                <span className="font-display text-white text-xl md:text-2xl leading-tight">{s.h}</span>
              </div>
              <div className="md:col-span-9 space-y-4 text-muted text-sm md:text-base leading-relaxed">
                {s.p.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line text-center py-24 md:py-36 px-5">
        <TextReveal text="Questions about your data?" as="h2" className="font-display t-mega text-white mb-8" />
        <div data-reveal>
          <MagneticButton to="/contact" className="btn btn-fill" data-cursor="go">
            <span>Contact us</span>
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}
