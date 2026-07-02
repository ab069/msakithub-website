import { useId } from 'react';

/**
 * MSAK IT Hub lockup — three red diagonal slashes forming the "M",
 * chunky white "SAK" wordmark, and an "IT HUB" subtitle underlined with
 * the site's violet accent so the red mark feels intentionally placed
 * inside the violet design system rather than dropped in.
 *
 * Pass `size` to set the rendered height in px (width scales via viewBox).
 * Set `iconOnly` for just the M mark.
 */
export default function Logo({ size = 48, iconOnly = false, className = '' }) {
  const id = useId().replace(/:/g, '');
  const glow = `lg-glow-${id}`;
  const grad = `lg-grad-${id}`;

  const ratio = iconOnly ? 1 : 260 / 90;

  return (
    <svg
      width={size * ratio}
      height={size}
      viewBox={iconOnly ? '0 0 90 90' : '0 0 260 90'}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MSAK IT Hub"
      role="img"
    >
      <defs>
        {/* soft violet aura behind the red M, to tie the mark to the site palette */}
        <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>

      {/* ── violet glow behind the M ── */}
      <g opacity="0.55" filter={`url(#${glow})`}>
        <polygon points="6,72  16,72  28,12  18,12"  fill="#7C5CFF" />
        <polygon points="24,72 34,72  46,12  36,12"  fill="#7C5CFF" />
        <polygon points="42,72 52,72  64,12  54,12"  fill="#7C5CFF" />
      </g>

      {/* ── M mark — three red diagonal slashes ── */}
      <g>
        <polygon points="6,72  16,72  28,12  18,12"  fill="#E63946" />
        <polygon points="24,72 34,72  46,12  36,12"  fill="#E63946" />
        <polygon points="42,72 52,72  64,12  54,12"  fill="#E63946" />
      </g>

      {!iconOnly && (
        <>
          {/* ── SAK wordmark — heavy, condensed, white ── */}
          <text
            x="78"
            y="62"
            fontFamily="'Space Grotesk', 'Archivo', sans-serif"
            fontWeight="800"
            fontSize="62"
            letterSpacing="-3"
            fill="#FFFFFF"
          >
            SAK
          </text>

          {/* ── violet underline accent (ties the red mark to the site palette) ── */}
          <rect x="78" y="72" width="34" height="2" rx="1" fill={`url(#${grad})`} />

          {/* ── IT HUB subtitle ── */}
          <text
            x="118"
            y="82"
            fontFamily="'JetBrains Mono', 'Space Grotesk', sans-serif"
            fontWeight="600"
            fontSize="11"
            letterSpacing="4"
            fill="#FFFFFF"
          >
            IT HUB
          </text>
        </>
      )}
    </svg>
  );
}
