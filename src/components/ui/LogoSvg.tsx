/**
 * The site mark: the astronaut's helmet with its teal visor — the same shape
 * as the 3D character and the MissionHud marker. Colours are the site's own
 * (suit white, accent teal), so it needs no gradient.
 */
export function LogoSvg({
  size = 28,
  className,
}: {
  /** @deprecated the mark no longer uses a gradient */
  gradientId?: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* ear pieces */}
      <rect x="0.6" y="11" width="3" height="6" rx="1.2" fill="#5fd9c9" />
      <rect x="24.4" y="11" width="3" height="6" rx="1.2" fill="#5fd9c9" />
      {/* helmet */}
      <circle cx="14" cy="14" r="11.2" fill="#0f1114" stroke="#e8ecf1" strokeWidth="1.6" />
      {/* visor */}
      <rect x="6.4" y="9" width="15.2" height="9" rx="4.5" fill="#5fd9c9" />
      <path d="M9.4 12.2c.9-1 2.2-1.5 3.6-1.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}
