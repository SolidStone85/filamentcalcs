import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SPOOL_BRAND_PAGES } from "@/lib/spoolBrands";
import { SITE } from "@/lib/tools";

const INDEX_TITLE = "Empty spool weights by brand";
const INDEX_DESCRIPTION =
  "How much popular filament spools weigh empty: Bambu Lab, Polymaker, eSun, Prusament. Community-measured tare weights plus a calculator for filament remaining.";

export const metadata: Metadata = {
  title: INDEX_TITLE,
  description: INDEX_DESCRIPTION,
  alternates: { canonical: `${SITE.url}/spools` },
  openGraph: {
    title: INDEX_TITLE,
    description: INDEX_DESCRIPTION,
    url: `${SITE.url}/spools`,
    type: "website",
  },
  twitter: {
    title: INDEX_TITLE,
    description: INDEX_DESCRIPTION,
  },
};

export default function SpoolsIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:py-16">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
          Empty spool weights by brand
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          The empty spool weight is the number you need before a kitchen scale
          can tell you how much filament is left. These pages collect
          community-measured tare weights per brand, with the Remaining
          Filament Calculator preset to the right spool.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {SPOOL_BRAND_PAGES.map((page) => (
          <Link key={page.slug} href={`/spools/${page.slug}`} className="block">
            <Card className="glass-card fc-card-lift h-full">
              <CardHeader>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {page.weights.length}{" "}
                  {page.weights.length === 1 ? "spool type" : "spool types"}
                </p>
                <CardTitle className="mt-1 text-base">
                  {page.brand} empty spool weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {page.metaDescription}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Brand not listed? The{" "}
        <Link
          href="/tools/remaining-spool-calculator"
          className="text-primary underline underline-offset-4"
        >
          Remaining Filament Calculator
        </Link>{" "}
        takes any custom empty weight.
      </p>
    </div>
  );
}
