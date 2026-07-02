import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Cursor from './components/Cursor.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import Orbs from './components/Orbs.jsx';

// ChatWidget pulls AI client + UI — defer until the page is interactive.
const ChatWidget = lazy(() => import('./components/ChatWidget.jsx'));

// Code-split each route. Three.js (Home), Framer Motion (modals), GSAP scroll
// triggers — heavy code only ships when the route is visited.
const Home          = lazy(() => import('./pages/Home.jsx'));
const About         = lazy(() => import('./pages/About.jsx'));
const Services      = lazy(() => import('./pages/Services.jsx'));
const Projects      = lazy(() => import('./pages/Projects.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const Blog          = lazy(() => import('./pages/Blog.jsx'));
const BlogPost      = lazy(() => import('./pages/BlogPost.jsx'));
const Contact       = lazy(() => import('./pages/Contact.jsx'));

gsap.registerPlugin(ScrollTrigger);

function ScrollManager({ lenisRef }) {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    const id = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(id);
  }, [pathname, lenisRef]);
  return null;
}

function RouteWipe() {
  const { pathname } = useLocation();
  const ref = useRef(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    const tl = gsap.timeline();
    tl.set(el, { transformOrigin: 'bottom', scaleY: 1 })
      .to(el, { scaleY: 0, transformOrigin: 'top', duration: 0.55, ease: 'expo.inOut', delay: 0.08 });
    return () => tl.kill();
  }, [pathname]);
  return <div ref={ref} className="route-wipe" style={{ transform: 'scaleY(0)' }} />;
}

function useSpotlight() {
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    const onMove = (e) => {
      const card = e.target.closest && e.target.closest('.spot');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove);
  }, []);
}

export default function App() {
  const lenisRef = useRef(null);
  useSpotlight();
  window.__APP_READY__ = true;

  useEffect(() => {
    window.dispatchEvent(new Event('app:loaded'));
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="noise">
        <Cursor />
        <ScrollProgress />
        <ScrollManager lenisRef={lenisRef} />
        <RouteWipe />
        <Navbar />
        <div className="site-content">
          <Orbs />
          <main className="relative z-[1]">
            <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-hidden />}>
              <AnimatedRoutes />
            </Suspense>
          </main>
        </div>
        <Footer />
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
