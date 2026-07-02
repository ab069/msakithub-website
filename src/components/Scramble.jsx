import { useEffect, useRef, useState } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

/**
 * Text scramble / decode effect — characters cycle through glyphs and
 * settle into the real text, fired once when the element enters the viewport.
 */
export default function Scramble({ text, className = 'eyebrow', as = 'span' }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(text);
  const fired = useRef(false);
  const Tag = as;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return;
    }
    const el = ref.current;
    let raf;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || fired.current) return;
        fired.current = true;
        let frame = 0;
        const total = Math.max(18, text.length * 2);
        const tick = () => {
          frame += 1;
          const progress = frame / total;
          const out = text
            .split('')
            .map((ch, i) => {
              if (ch === ' ') return ' ';
              if (i < progress * text.length) return ch;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('');
          setDisplay(out);
          if (frame < total) raf = requestAnimationFrame(tick);
          else setDisplay(text);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {display}
    </Tag>
  );
}
