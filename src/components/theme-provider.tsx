"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

const THEMES = ["light", "workshop", "dark"];

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider themes={THEMES} {...props}>
      {children}
    </NextThemesProvider>
  );
}
