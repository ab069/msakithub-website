/**
 * MSAK lockup — the actual brand PNG (transparent bg) sitting on a
 * layered warm-red glow: a wide radial aura, a tight halo behind the M,
 * and a warm accent behind the red slashes to give the mark depth
 * against the site's dark palette without altering the mark itself.
 *
 * Pass `size` to set the rendered height in px.
 * Set `iconOnly` to show a square crop centered on the M.
 */
const NATURAL_RATIO = 374 / 98;

export default function Logo({ size = 48, iconOnly = false, className = '' }) {
  const w = iconOnly ? size : Math.round(size * NATURAL_RATIO);
  const h = size;

  const imgScale = iconOnly ? 3.2 : 1;
  const imgW = Math.round(size * NATURAL_RATIO * imgScale);
  const imgH = Math.round(size * imgScale);
  const shift = iconOnly
    ? { left: '18%', transform: 'translate(-50%, -50%)' }
    : { left: '50%', transform: 'translate(-50%, -50%)' };

  return (
    <div
      className={className}
      style={{
        width: w,
        height: h,
        position: 'relative',
        display: 'inline-block',
        overflow: 'visible',
      }}
      aria-label="MSAK"
      role="img"
    >
      {/* wide warm-red aura — bleeds beyond the box for a premium halo */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-40% -12% -40% -12%',
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(230,57,70,0.45), rgba(255,92,110,0.15) 40%, transparent 65%)',
          filter: 'blur(14px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* tight halo hugging the M — brightest hotspot */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: iconOnly ? '18%' : `${(30 / NATURAL_RATIO)}%`,
          width: h * 1.4,
          height: h * 1.4,
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(230,57,70,0.34), rgba(255,92,110,0.20) 45%, transparent 70%)',
          filter: 'blur(10px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* the mark itself */}
      <img
        src="/brand/msak-logo.png"
        alt=""
        draggable={false}
        style={{
          position: 'absolute',
          top: '50%',
          width: imgW,
          height: imgH,
          pointerEvents: 'none',
          userSelect: 'none',
          filter:
            'drop-shadow(0 2px 6px rgba(230,57,70,0.35)) drop-shadow(0 6px 22px rgba(162,13,27,0.30))',
          zIndex: 1,
          ...shift,
        }}
      />
    </div>
  );
}
