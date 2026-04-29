type Props = {
  size?: number;
  className?: string;
};

export function Logo({ size = 24, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="fc-logo-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.85 0.15 205)" />
          <stop offset="100%" stopColor="oklch(0.55 0.13 205)" />
        </linearGradient>
      </defs>
      {/* Outer hex (infill cell, on-brand for 3D printing) */}
      <path
        d="M16 2 L29 9.5 L29 22.5 L16 30 L3 22.5 L3 9.5 Z"
        fill="url(#fc-logo-grad)"
      />
      {/* Inner hex highlight (suggests stacked layers / extrusion) */}
      <path
        d="M16 8 L23.5 12.25 L23.5 19.75 L16 24 L8.5 19.75 L8.5 12.25 Z"
        fill="oklch(0.95 0.05 205 / 0.25)"
      />
    </svg>
  );
}
