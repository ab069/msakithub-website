import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Masked word-by-word reveal. Each word sits in an overflow-hidden box and
 * slides up from below as it enters the viewport.
 */
export default function TextReveal({
  text,
  as = 'h2',
  className = '',
  stagger = 0.06,
  duration = 0.9,
  delay = 0,
  trigger = true,
}) {
  const ref = useRef(null);
  const Tag = as;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const words = el.querySelectorAll('.tr-inner');

    const anim = gsap.fromTo(
      words,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration,
        delay,
        stagger,
        ease: 'expo.out',
        scrollTrigger: trigger
          ? { trigger: el, start: 'top 88%', once: true }
          : undefined,
      }
    );

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [text, stagger, duration, delay, trigger]);

  const words = String(text).split(' ');

  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className="word mr-[0.22em] last:mr-0">
          <span className="tr-inner inline-block">{w}</span>
        </span>
      ))}
    </Tag>
  );
}
