// Full author-bio block rendered at the bottom of every guide.
// Doubles as an E-E-A-T signal for AdSense/Google and as a transparent
// "who wrote this" footer for readers.

import Link from "next/link";

import { AUTHOR } from "@/lib/author";

export function AuthorBio() {
  return (
    <aside className="mt-10 rounded-lg border bg-muted/30 p-5 text-sm leading-6">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        About the author
      </p>
      <p className="mt-2 font-semibold text-foreground">{AUTHOR.name}</p>
      <p className="text-xs text-muted-foreground">{AUTHOR.role}</p>
      <p className="mt-3 text-muted-foreground">{AUTHOR.fullBio}</p>
      <p className="mt-3 text-xs">
        <Link
          href="/about"
          className="underline underline-offset-4 hover:text-primary"
        >
          More about how the site is researched
        </Link>{" "}
        ·{" "}
        <Link
          href="/methodology"
          className="underline underline-offset-4 hover:text-primary"
        >
          Methodology and sources
        </Link>{" "}
        ·{" "}
        <Link
          href="/contact"
          className="underline underline-offset-4 hover:text-primary"
        >
          Submit a correction
        </Link>
      </p>
    </aside>
  );
}
