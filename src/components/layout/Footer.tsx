import Link from "next/link";

import { SITE } from "@/lib/tools";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-foreground">{SITE.name}.com</p>
          <p className="mt-1 max-w-md text-xs">
            Not affiliated with any 3D printer or filament manufacturer. All
            calculations are estimates. Always verify with your slicer and
            local rates.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4">
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
        </nav>
        <p className="text-xs">© {year} {SITE.name}.com</p>
      </div>
    </footer>
  );
}
