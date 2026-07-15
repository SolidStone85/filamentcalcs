import Link from "next/link";

import { Logo } from "@/components/layout/Logo";
import { GUIDES } from "@/lib/guides";
import { AMAZON_DISCLOSURE } from "@/lib/commerce";
import { SITE, TOOLS } from "@/lib/tools";

export function Footer() {
  const year = new Date().getFullYear();
  const popularTools = TOOLS.filter((t) => t.available).slice(0, 4);
  const latestGuides = [...GUIDES]
    .sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1))
    .slice(0, 4);

  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Logo size={20} />
              {SITE.name}.com
            </p>
            <p className="mt-3 max-w-xs text-xs leading-5 text-muted-foreground">
              Practical calculators and guides for 3D printing hobbyists.
              Free, fast, no sign-up.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Popular calculators
            </p>
            <ul className="mt-3 space-y-1.5 text-xs">
              {popularTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {tool.shortTitle}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tools"
                  className="text-muted-foreground hover:text-foreground"
                >
                  All calculators
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Latest guides
            </p>
            <ul className="mt-3 space-y-1.5 text-xs">
              {latestGuides.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/guides/${g.slug}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {g.shortTitle}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/guides"
                  className="text-muted-foreground hover:text-foreground"
                >
                  All guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Resources
            </p>
            <ul className="mt-3 space-y-1.5 text-xs">
              <li>
                <Link
                  href="/spools"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Spool weights
                </Link>
              </li>
              <li>
                <Link
                  href="/glossary"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Glossary
                </Link>
              </li>
              <li>
                <Link
                  href="/methodology"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md">
            Not affiliated with any 3D printer or filament manufacturer.
            All calculations are estimates. Always verify with your slicer
            and local rates. {AMAZON_DISCLOSURE}
          </p>
          <nav className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <span>© {year} {SITE.name}.com</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
