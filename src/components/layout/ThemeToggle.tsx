"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch, theme is unknown server-side
  useEffect(() => setMounted(true), []);

  const current = mounted ? resolvedTheme ?? theme : undefined;
  const next = current === "dark" ? "light" : "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Switch to ${next} theme`}
      onClick={() => setTheme(next)}
    >
      <Sun
        className="h-5 w-5 rotate-0 scale-100 text-amber-500 transition-all dark:-rotate-90 dark:scale-0"
        style={{ filter: "drop-shadow(0 0 6px rgba(245, 158, 11, 0.55))" }}
      />
      <Moon
        className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        style={{
          color: "#fef9c3",
          fill: "#fef9c3",
          filter:
            "drop-shadow(0 0 14px rgba(254, 249, 195, 0.7)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))",
        }}
      />
    </Button>
  );
}
