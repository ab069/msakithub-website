import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import MagneticButton from './MagneticButton.jsx';
import Logo from './Logo.jsx';

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const overlayRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (open) {
      gsap.set(overlayRef.current, { display: 'flex' });
      gsap.fromTo(overlayRef.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' });
      gsap.fromTo(itemsRef.current, { yPercent: 120 }, { yPercent: 0, duration: 0.7, stagger: 0.07, ease: 'expo.out', delay: 0.25 });
    } else {
      gsap.to(overlayRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.5,
        ease: 'expo.inOut',
        onComplete: () => gsap.set(overlayRef.current, { display: 'none' }),
      });
    }
  }, [open]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[8500]">
        <div className={`border-b border-line bg-bg flex items-center justify-center gap-2.5 transition-all duration-500 overflow-hidden ${scrolled ? 'h-0 border-b-0 opacity-0' : 'h-8'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot shrink-0" />
          <span className="mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Building reliable software for growing businesses
          </span>
        </div>

        <div
          className={`transition-all duration-500 ${
            scrolled
              ? 'bg-bg/75 backdrop-blur-[12px] border-b border-line'
              : 'bg-transparent border-b border-transparent'
          }`}
        >
          <div className="max-w-site mx-auto px-5 md:px-10 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center group" data-cursor="home" aria-label="MSAK IT Hub home">
              <Logo size={48} className="shrink-0 transition-transform duration-300 group-hover:scale-[1.04]" />
            </Link>

            <nav className="hidden md:flex items-center gap-9">
              {links.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className={`mono text-[11px] font-medium uppercase tracking-[0.18em] nav-link transition-colors ${
                    pathname === l.href ? 'text-accent' : 'text-white/55 hover:text-white'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:block">
              <MagneticButton to="/contact" className="btn btn-fill" data-cursor="go">
                <span>Get Started</span>
              </MagneticButton>
            </div>

            <button
              className="md:hidden flex flex-col gap-[5px] p-2 z-[9100]"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <span className={`block w-7 h-[2px] bg-white transition-transform duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-7 h-[2px] bg-white transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block w-7 h-[2px] bg-white transition-transform duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9000] bg-bg hidden flex-col items-center justify-center grid-bg"
        style={{ display: 'none' }}
      >
        <nav className="flex flex-col items-center gap-3">
          {links.map((l, i) => (
            <span key={l.href} className="overflow-hidden">
              <Link
                ref={(el) => (itemsRef.current[i] = el)}
                to={l.href}
                className="block font-display t-mega text-white hover:text-accent transition-colors"
              >
                {l.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>
    </>
  );
}
