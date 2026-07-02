import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

export default function MagneticButton({ to, href, children, className = '', strength = 0.4, ...rest }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    gsap.to(el, { x, y, duration: 0.4, ease: 'power3.out' });
  };
  const onLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  };

  const props = {
    ref,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    className,
    ...rest,
  };

  if (to) return <Link to={to} {...props}>{children}</Link>;
  return <a href={href} {...props}>{children}</a>;
}
