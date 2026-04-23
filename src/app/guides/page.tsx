import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GUIDES } from "@/lib/guides";
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
          Practical write-ups on filament choice, printer cost, reliability,
          and the other questions hobbyists actually ask. Every guide links
          to the calculators on this site that apply. No affiliate spam, no
          listicle filler, no AI-generated nonsense.
        </p>
      </header>

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
