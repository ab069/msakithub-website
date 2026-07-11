/**
 * <Conveyor> — CSS keyframe tech-token band with diamond separators.
 * <Marquee>  — editorial serif divider driven by pure CSS animation.
 *              (Previously ran a per-frame rAF loop reading scroll velocity;
 *              removed for scroll performance.)
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

export default function Marquee({ items, direction = 1, variant = 'stroke' }) {
  const list = [...items, ...items];
  return (
    <div className="overflow-hidden w-full">
      <div className={`marquee ${direction < 0 ? 'reverse' : ''}`}>
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
