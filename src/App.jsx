import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
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

function ScrollManager() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const id = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(id);
  }, [pathname]);
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

export default function App() {
  window.__APP_READY__ = true;

  useEffect(() => {
    window.dispatchEvent(new Event('app:loaded'));
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="noise">
        <ScrollProgress />
        <ScrollManager />
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
