"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(1, Math.max(0, window.scrollY / max)));
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-50 h-0.5 w-full bg-transparent"
    >
      <div
        className="h-full origin-left bg-primary transition-[width] duration-75 ease-out"
        style={{
          width: `${progress * 100}%`,
          boxShadow: "0 0 8px oklch(0.78 0.16 205 / 0.7)",
        }}
      />
    </div>
  );
}
