"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const ANIMATION_DURATION_MS = 2800;

export function PrinterProcess() {
  const id = useId();
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState(
    "Static diagram. Use the button for an optional short layer-by-layer SVG animation.",
  );
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function playAnimation() {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsPlaying(false);
      setStatus(
        "The static diagram is shown because reduced motion is preferred. It shows horizontal layers building from the print bed upward.",
      );
      timeoutRef.current = null;
      return;
    }

    setIsPlaying(true);
    setStatus("Showing a simplified layer-by-layer SVG animation.");
    timeoutRef.current = window.setTimeout(() => {
      setIsPlaying(false);
      setStatus("Animation finished. The static layer diagram remains visible.");
      timeoutRef.current = null;
    }, ANIMATION_DURATION_MS);
  }

  return (
    <figure
      className={`printer-process glass-card flex w-full max-w-xs flex-col items-center gap-3 rounded-xl p-4 ${
        isPlaying ? "is-playing" : ""
      }`}
    >
      <svg
        viewBox="0 0 220 140"
        role="img"
        aria-labelledby={`${id}-title ${id}-description`}
        className="h-auto w-full max-w-[220px]"
      >
        <title id={`${id}-title`}>Layer-by-layer 3D printing</title>
        <desc id={`${id}-description`}>
          A simplified side view of a nozzle above a small printed block on a bed.
          Horizontal lines divide the block into layers. The optional SVG animation
          briefly highlights those layers from bottom to top. It is illustrative
          and not to scale.
        </desc>

        <path
          d="M100 12h20v10l-3 2-5 9h-4l-5-9-3-2z"
          fill="var(--foreground)"
        />
        <path d="M110 33v6" stroke="var(--primary)" strokeWidth="2" />

        <path
          d="m84 49 26-15 26 15-26 15z"
          fill="var(--accent)"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="m84 49 26 15v42L84 91z"
          fill="var(--secondary)"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="m110 64 26-15v42l-26 15z"
          fill="var(--card)"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        <g fill="none" stroke="var(--card-foreground)" strokeWidth="1.4">
          <path
            className="printer-process__layer printer-process__layer--top"
            d="m84 59 26 15 26-15"
          />
          <path
            className="printer-process__layer printer-process__layer--upper"
            d="m84 70 26 15 26-15"
          />
          <path
            className="printer-process__layer printer-process__layer--lower"
            d="m84 80 26 15 26-15"
          />
          <path
            className="printer-process__layer printer-process__layer--bottom"
            d="m84 90 26 15 26-15"
          />
        </g>

        <path
          d="m59 116 51-8 51 8-51 11z"
          fill="var(--accent)"
          stroke="var(--foreground)"
          strokeWidth="1.5"
        />
        <path
          d="M52 129h116"
          stroke="var(--foreground)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <figcaption className="text-center text-sm text-muted-foreground">
        Simplified layer diagram. Optional 2.8-second SVG animation; not to scale.
      </figcaption>
      <Button type="button" variant="outline" size="sm" onClick={playAnimation}>
        Play layer build
      </Button>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {status}
      </p>
    </figure>
  );
}
