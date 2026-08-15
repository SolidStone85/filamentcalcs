import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { MainNav } from "@/components/layout/MainNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SITE } from "@/lib/tools";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-lg font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          <Logo size={26} className="shrink-0" />
          <span className="truncate">
            {SITE.name}
            <span className="text-muted-foreground">.com</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
