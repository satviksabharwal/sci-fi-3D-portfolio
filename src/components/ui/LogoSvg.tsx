export function LogoSvg({
  gradientId,
  size = 26,
  className,
}: {
  gradientId: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="26"
          y2="26"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00f5c4" />
          <stop offset="0.5" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <rect
        x="0.75"
        y="0.75"
        width="24.5"
        height="24.5"
        rx="5.25"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.5"
      />
      <text
        x="13"
        y="18.5"
        textAnchor="middle"
        fontFamily="Syne, sans-serif"
        fontWeight="800"
        fontSize="16"
        fill={`url(#${gradientId})`}
      >
        S
      </text>
    </svg>
  );
}
