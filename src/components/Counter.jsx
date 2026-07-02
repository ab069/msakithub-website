import { useEffect, useRef, useState } from 'react';

/**
 * Odometer count-up. Fires once on viewport entry; the suffix ("+", "%")
 * pops in at the end with a tiny scale bounce.
 */
export default function Counter({ to, suffix = '', duration = 1200 }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !fired.current) {
          fired.current = true;
          if (reduce) { setN(to); setDone(true); return; }
          const start = performance.now();
          const step = (t) => {
            const p = Math.min((t - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(step);
            else setDone(true);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className="mono tabular-nums">
      {n}
      <span
        className="inline-block"
        style={{
          opacity: done ? 1 : 0,
          transform: done ? 'scale(1)' : 'scale(0.4)',
          transition: 'opacity 0.25s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {suffix}
      </span>
    </span>
  );
}
