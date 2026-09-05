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
      {/* Three faces keep the original hex silhouette while giving it depth. */}
      <path
        d="M3 9.5 L16 17 L16 30 L3 22.5 Z"
        fill="oklch(0.7 0.14 205)"
      />
      <path
        d="M16 17 L29 9.5 L29 22.5 L16 30 Z"
        fill="oklch(0.56 0.12 215)"
      />
      <path
        d="M16 2 L29 9.5 L16 17 L3 9.5 Z"
        fill="oklch(0.85 0.13 200)"
      />
      {/* Continuous courses read as printed layers at small sizes. */}
      <path
        d="M3 13 L16 20.5 L29 13 M3 16.5 L16 24 L29 16.5 M3 20 L16 27.5 L29 20"
        stroke="oklch(0.3 0.07 215 / 0.55)"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      {/* An inset perimeter and crossed infill describe the top surface. */}
      <path
        d="M16 5.5 L23 9.5 L16 13.5 L9 9.5 Z M12.5 7.5 L19.5 11.5 M19.5 7.5 L12.5 11.5"
        stroke="oklch(0.4 0.09 210 / 0.65)"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
