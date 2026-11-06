import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GUIDES, BEGINNER_GUIDE_SLUGS } from "@/lib/guides";
import { SITE } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Practical guides for FDM 3D printing: cost, materials, reliability, electricity, and more.",
  alternates: { canonical: `${SITE.url}/guides` },
};

export default function GuidesIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:py-16">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
          Guides
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Start with the four beginner guides, then explore filament choice,
          printer cost, reliability and practical business questions. Every guide links
          to the calculators on this site that apply, with product links only
          where they are useful to the topic.
        </p>
      </header>

      <nav aria-label="Beginner guide sequence" className="mb-10 rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold">Start here</h2>
        <ol className="mt-3 grid list-decimal gap-x-8 gap-y-3 pl-5 text-sm sm:grid-cols-2">
          {BEGINNER_GUIDE_SLUGS.map((slug) => <li key={slug}><Link href={`/guides/${slug}`} className="text-primary underline underline-offset-4">{GUIDES.find((guide) => guide.slug === slug)!.shortTitle}</Link></li>)}
        </ol>
      </nav>

      <div className="grid gap-4 sm:grid-cols-2">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="block"
          >
            <Card className="glass-card h-full transition hover:border-primary/60 hover:shadow-md">
              <CardHeader>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {guide.readMinutes} min read
                </p>
                <CardTitle className="mt-1 text-base leading-snug">
                  {guide.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {guide.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
