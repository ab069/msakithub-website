import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * <Conveyor> — CSS keyframe tech-token band with diamond separators,
 *              pauses on hover (pass reverse for counter-direction).
 * <Marquee>  — editorial serif divider driven by rAF: speed and skew react
 *              to scroll velocity for a mechanical, weighted feel.
 */

export function Conveyor({ items, reverse = false, className = '' }) {
  const list = [...items, ...items];
  return (
    <div className={`overflow-hidden w-full conveyor-band ${className}`}>
      <div className={`conveyor ${reverse ? 'reverse' : ''}`}>
        {list.map((it, i) => (
          <span key={i} className="conveyor-item">
            {it}
            <span className="conveyor-diamond" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee({ items, baseSpeed = 0.6, direction = 1, variant = 'stroke' }) {
  const trackRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const track = trackRef.current;
    let x = 0;
    let velocity = 0;
    const half = track.scrollWidth / 2;

    const st = ScrollTrigger.create({
      onUpdate: (self) => { velocity = self.getVelocity(); },
    });

    let raf;
    const tick = () => {
      const boost = gsap.utils.clamp(-30, 30, velocity / 200);
      x -= (baseSpeed + Math.abs(boost) * 0.4) * direction;
      if (direction > 0 && x <= -half) x += half;
      if (direction < 0 && x >= 0) x -= half;
      const skew = gsap.utils.clamp(-8, 8, boost);
      track.style.transform = `translateX(${x}px) skewX(${skew}deg)`;
      velocity *= 0.9;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      st.kill();
    };
  }, [baseSpeed, direction]);

  const list = [...items, ...items];

  return (
    <div className="overflow-hidden w-full">
      <div ref={trackRef} className="marquee">
        {list.map((it, i) => (
          <span
            key={i}
            className={`marquee-item ${variant === 'stroke' ? 'stroke' : variant === 'accent' ? 'accent' : ''}`}
          >
            {it}
            <span className="marquee-star">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
