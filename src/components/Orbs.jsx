import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Floating parallax gradient orbs — fixed depth layer behind the page.
 * Each orb drifts slowly (yoyo float) and parallaxes at a different rate
 * against scroll for depth.
 */
export default function Orbs() {
  const root = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.orb').forEach((orb, i) => {
        // slow idle float
        gsap.to(orb, {
          x: () => gsap.utils.random(-60, 60),
          y: () => gsap.utils.random(-50, 50),
          duration: gsap.utils.random(9, 14),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        // scroll parallax — different rate per orb
        gsap.to(orb, {
          yPercent: (i + 1) * -18,
          ease: 'none',
          scrollTrigger: { trigger: document.body, start: 'top top', end: 'max', scrub: 1.2 },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div className="orb a w-[480px] h-[480px] -top-32 -left-24" />
      <div className="orb b w-[380px] h-[380px] top-[55%] -right-28" />
      <div className="orb c w-[420px] h-[420px] top-[120%] left-[20%]" />
    </div>
  );
}
