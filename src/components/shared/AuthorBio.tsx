// "About this guide" block rendered at the bottom of every guide.
// Functions as the trust signal (methodology, sources, contact) without
// attaching a personal byline. Same pattern as calculator.net's
// site-level disclosure.

import Link from "next/link";

import { AUTHOR } from "@/lib/author";

export function AuthorBio() {
  return (
    <aside className="mt-10 rounded-lg border bg-muted/30 p-5 text-sm leading-6">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        About this guide
      </p>
      <p className="mt-3 text-muted-foreground">{AUTHOR.fullBio}</p>
      <p className="mt-3 text-xs">
        <Link
          href="/about"
          className="underline underline-offset-4 hover:text-primary"
        >
          About the site
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
