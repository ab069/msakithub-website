import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Logo from './Logo.jsx';

const BOOT_TEXT = 'MSAK_IT_HUB // INITIALIZING...';

/**
 * "Terminal Boot" preloader.
 * 1. Monospace line types itself out with a blinking block cursor.
 * 2. Thin orange progress bar sweeps the full viewport width (0.8s).
 * 3. The screen splits — top half up, bottom half down — like blast doors.
 * Total ≤ 2.2s. Skippable on click.
 */
export default function Preloader({ onDone }) {
  const [typed, setTyped] = useState('');
  const rootRef = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const barRef = useRef(null);
  const contentRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDone();
    };

    // typewriter — chars over ~0.8s
    const chars = BOOT_TEXT.length;
    const typeDur = 0.8;
    let i = 0;
    const typeId = setInterval(() => {
      i += 1;
      setTyped(BOOT_TEXT.slice(0, i));
      if (i >= chars) clearInterval(typeId);
    }, (typeDur * 1000) / chars);

    const tl = gsap.timeline({ onComplete: finish });

    tl.to(barRef.current, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, typeDur + 0.1)
      .to(contentRef.current, { opacity: 0, duration: 0.2, ease: 'none' }, '-=0.1')
      .set(barRef.current, { opacity: 0 })
      // blast doors
      .to(topRef.current, { yPercent: -101, duration: 0.7, ease: 'expo.inOut' }, '<')
      .to(bottomRef.current, { yPercent: 101, duration: 0.7, ease: 'expo.inOut' }, '<');

    // skippable on click
    const skip = () => {
      tl.kill();
      gsap.to(rootRef.current, { opacity: 0, duration: 0.25, onComplete: finish });
    };
    const node = rootRef.current;
    node.addEventListener('click', skip);

    return () => {
      clearInterval(typeId);
      tl.kill();
      node.removeEventListener('click', skip);
    };
  }, [onDone]);

  return (
    <div ref={rootRef} className="boot-screen" aria-hidden="true">
      <div ref={topRef} className="boot-panel top" />
      <div ref={bottomRef} className="boot-panel bottom" />
      <div ref={barRef} className="boot-bar" />
      <div ref={contentRef} className="boot-content">
        <Logo size={52} className="boot-logo" />
        <p className="boot-line">
          {typed}
          <span className="boot-cursor" />
        </p>
      </div>
    </div>
  );
}
