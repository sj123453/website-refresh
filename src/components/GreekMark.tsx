/** Areviax laurel-and-compass emblem — mirrors the marketing site mark. */
export function GreekMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
    >
      {/* compass star */}
      <path
        d="M24 5 26.6 21.4 43 24 26.6 26.6 24 43 21.4 26.6 5 24 21.4 21.4Z"
        fill="currentColor"
        stroke="none"
        opacity="0.95"
      />
      <path d="M24 12v24M12 24h24" strokeWidth="0.6" opacity="0.5" />
      <circle cx="24" cy="24" r="11" strokeWidth="0.7" opacity="0.45" />
      {/* laurel wreath */}
      <path d="M15 9c-7 5-9 14-5 22 2.5 5 6.5 8.5 11 10" strokeWidth="1.4" opacity="0.8" />
      <path d="M33 9c7 5 9 14 5 22-2.5 5-6.5 8.5-11 10" strokeWidth="1.4" opacity="0.8" />
      {[13, 19, 25, 31].map((y, i) => (
        <g key={y} opacity="0.7">
          <ellipse
            cx={10.5 + i * 0.8}
            cy={y}
            rx="2.6"
            ry="1.2"
            transform={`rotate(-35 ${10.5 + i * 0.8} ${y})`}
            strokeWidth="0.9"
          />
          <ellipse
            cx={37.5 - i * 0.8}
            cy={y}
            rx="2.6"
            ry="1.2"
            transform={`rotate(35 ${37.5 - i * 0.8} ${y})`}
            strokeWidth="0.9"
          />
        </g>
      ))}
    </svg>
  );
}

/** Greek-key hairline divider. */
export function Meander({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`meander ${className}`} />;
}
