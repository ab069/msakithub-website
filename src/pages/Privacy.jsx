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
    h: 'Data Collected via Meta Platforms',
    p: [
      'When you use our application and authenticate via Facebook Login, we may collect the following information from your Meta account: your public profile (name, email address, profile picture), friend list (if permitted), and any additional information you choose to share.',
      'If our application integrates with the Instagram Graph API, we may access Instagram business account data including profile information, media (photos, videos, stories), comments, insights and follower counts, strictly for the purposes described in this policy.',
      'When using the Pages API, we may access Page information, Page posts, insights and messaging capabilities associated with Pages you manage.',
      'If our application utilizes the Messenger Platform, we may collect and process messages, conversation context and user-provided information through Messenger interactions.',
    ],
  },
  {
    n: '03',
    h: 'How We Use Your Information',
    p: [
      'To respond to your inquiries, deliver requested services, and provide project updates.',
      'To improve our website, services and client communication.',
      'To send occasional service-related updates when you have opted in.',
      'To authenticate users and provide personalized experiences through Meta platform integrations.',
      'To manage and respond to communications sent via Facebook Messenger.',
      'To display and manage Instagram and Facebook Page content within our application.',
      'To comply with legal obligations under the laws of the Islamic Republic of Pakistan.',
    ],
  },
  {
    n: '04',
    h: 'Data Sharing & Third Parties',
    p: [
      'We do not sell, rent or trade your personal information. We may share data only in the following circumstances: with Meta Platforms as required by their terms of service and API policies; with trusted service providers who assist in operating our application and who are bound by confidentiality obligations; when required by law or to protect our legal rights.',
      'Data processed through Meta APIs is subject to Meta\'s own Data Policy. We encourage users to review Meta\'s privacy practices at https://www.facebook.com/privacy/policy/.',
    ],
  },
  {
    n: '05',
    h: 'Client Confidentiality',
    p: [
      'Client data, source code, designs and business information shared with MSAK IT Hub are treated as strictly confidential and are protected under written agreements.',
    ],
  },
  {
    n: '06',
    h: 'Cookies & Analytics',
    p: [
      'We use cookies and similar technologies to keep the site functional and to understand aggregate usage patterns. You can disable cookies through your browser settings; some site features may be affected.',
      'Meta platforms may also use cookies and similar technologies in accordance with their own policies when you interact with our application through Facebook or Instagram.',
    ],
  },
  {
    n: '07',
    h: 'Data Retention',
    p: [
      'We retain personal information only as long as necessary to fulfil the purpose it was collected for, resolve disputes, and meet legal or contractual obligations.',
      'Data obtained through Meta APIs is retained only for as long as necessary to provide the requested service. You may request deletion of your data at any time by contacting us.',
    ],
  },
  {
    n: '08',
    h: 'Your Rights',
    p: [
      'You have the right to access, correct, or delete the personal information we hold about you. This includes data obtained through Meta platform integrations.',
      'You may revoke our application\'s access to your Meta data at any time through your Facebook or Instagram settings.',
      'To exercise your rights or request data deletion, contact us at info@msakithub.com. We will respond within a reasonable timeframe.',
    ],
  },
  {
    n: '09',
    h: 'Data Security',
    p: [
      'We apply reasonable technical and organizational safeguards to protect the information we hold, including encryption in transit and at rest. However, no method of electronic transmission or storage is completely secure.',
      'We do not store Meta account credentials. Authentication is handled entirely through Meta\'s OAuth flow.',
    ],
  },
  {
    n: '10',
    h: 'Children\'s Privacy',
    p: [
      'Our application is not directed to individuals under the age of 13 (or the applicable age in your jurisdiction). We do not knowingly collect personal information from children through Meta platforms or otherwise.',
    ],
  },
  {
    n: '11',
    h: 'Changes to This Policy',
    p: [
      'We may update this Privacy Policy from time to time. Material changes will be reflected on this page with an updated effective date.',
    ],
  },
  {
    n: '12',
    h: 'Contact Us',
    p: [
      'If you have any questions about this Privacy Policy or how your information is handled, contact us at info@msakithub.com.',
      'For Meta-specific data inquiries, you may also reach us through the contact information provided on our website.',
    ],
  },
];

export default function Privacy() {
  useSeo({
    title: 'Privacy Policy',
    description: 'Privacy Policy for MSAK IT Hub — how we collect, use and protect the information of clients, website visitors and Meta platform users.',
    path: '/privacy',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'url': 'https://msakithub.com/privacy',
      'name': 'Privacy Policy — MSAK IT Hub',
      'description': 'How MSAK IT Hub collects, uses and safeguards personal, client and Meta platform data.',
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
          This policy explains how MSAK IT Hub collects, uses and safeguards information provided by clients, website visitors and users of our Meta platform integrations (Facebook, Instagram, Messenger).
        </p>
        <p className="mt-4 mono text-[11px] tracking-[0.14em] text-muted uppercase" data-reveal>
          Effective date · July 2026
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
