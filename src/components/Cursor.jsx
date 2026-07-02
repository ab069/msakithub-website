import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    const pos = { x: mouse.x, y: mouse.y };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    };

    let raf;
    const loop = () => {
      pos.x += (mouse.x - pos.x) * 0.12;
      pos.y += (mouse.y - pos.y) * 0.12;
      ring.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('mousemove', onMove);

    const enter = (e) => {
      ring.classList.add('is-hover');
      const label = e.currentTarget.getAttribute('data-cursor');
      ring.textContent = label || 'view';
    };
    const leave = () => {
      ring.classList.remove('is-hover');
      ring.textContent = '';
    };

    const bind = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
      });
    };
    bind();
    const mo = new MutationObserver(bind);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
