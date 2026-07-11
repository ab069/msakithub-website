import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from './TextReveal.jsx';
import MagneticButton from './MagneticButton.jsx';
import Logo from './Logo.jsx';

gsap.registerPlugin(ScrollTrigger);

const services = ['Software Development', 'Web Development', 'Mobile Apps', 'Digital Marketing', 'UI/UX Design', 'IT Consultancy'];
const company = [
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

/**
 * "Curtain Lift" footer — sticky at the viewport bottom behind the page
 * (z-index 0); the main content (z-index 1, opaque) scrolls up to uncover it.
 */
export default function Footer() {
  const root = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.f-col', {
        y: 32, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 92%', once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={root}
      className="relative bg-bg border-t border-line overflow-hidden md:sticky md:bottom-0 md:z-0"
    >
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Big CTA */}
      <div className="relative max-w-site mx-auto px-5 md:px-10 pt-24 md:pt-32 pb-16">
        <span className="eyebrow">Ready to start?</span>
        <TextReveal
          text="Let's build something amazing."
          as="h2"
          className="font-display t-mega text-white mt-6 max-w-5xl"
        />
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <MagneticButton to="/contact" className="btn btn-fill" data-cursor="go">
            <span>Get in touch</span>
          </MagneticButton>
          <a href="mailto:info@msakithub.com" className="btn btn-ghost"><span>info@msakithub.com</span></a>
        </div>
      </div>

      {/* Links */}
      <div className="relative max-w-site mx-auto px-5 md:px-10 py-16 border-t border-line grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="f-col col-span-2">
          <div className="flex items-center mb-5">
            <Logo size={44} className="shrink-0" />
          </div>
          <p className="text-muted text-sm leading-relaxed max-w-sm">
            A Pakistan-based IT and software services company providing software development, web, mobile, marketing, design and consultancy services.
          </p>
        </div>

        <div className="f-col">
          <h4 className="eyebrow mb-5 text-white/40">Services</h4>
          <ul className="space-y-2.5">
            {services.map((s) => (
              <li key={s}><Link to="/services" className="text-sm text-muted hover:text-white transition-colors link-line">{s}</Link></li>
            ))}
          </ul>
        </div>

        <div className="f-col">
          <h4 className="eyebrow mb-5 text-white/40">Company</h4>
          <ul className="space-y-2.5">
            {company.map((c) => (
              <li key={c.href}><Link to={c.href} className="text-sm text-muted hover:text-white transition-colors link-line">{c.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="relative overflow-hidden border-t border-line">
        <div className="font-display text-center leading-none text-white/[0.04] select-none py-6" style={{ fontSize: 'clamp(4rem,18vw,18rem)' }}>
          MSAK IT HUB
        </div>
      </div>

      {/* Bottom row — status heartbeat */}
      <div className="relative max-w-site mx-auto px-5 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-line">
        <p className="mono text-[11px] tracking-[0.14em] text-muted uppercase">© 2026 MSAK IT Hub. All rights reserved.</p>
        <Link to="/privacy" className="mono text-[11px] tracking-[0.14em] text-muted uppercase hover:text-white transition-colors link-line">
          Privacy Policy
        </Link>
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3ddc6f] pulse-dot" />
          <span className="mono text-[10px] uppercase tracking-[0.18em] text-muted">
            Operations active — Mon–Fri 9AM–6PM PKT
          </span>
        </div>
      </div>
    </footer>
  );
}
