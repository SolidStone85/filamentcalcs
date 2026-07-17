import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Calculator } from "@/app/tools/remaining-spool-calculator/Calculator";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { SPOOL_BRAND_PAGES, getSpoolBrandPage } from "@/lib/spoolBrands";
import { SITE } from "@/lib/tools";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return SPOOL_BRAND_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getSpoolBrandPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: `${SITE.url}/spools/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: `${SITE.url}/spools/${page.slug}`,
      type: "website",
    },
    twitter: {
      title: page.title,
      description: page.metaDescription,
    },
  };
}

export default async function SpoolBrandPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const page = getSpoolBrandPage(slug);
  if (!page) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: page.title,
        description: page.metaDescription,
        url: `${SITE.url}/spools/${page.slug}`,
        isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  const otherBrands = SPOOL_BRAND_PAGES.filter((p) => p.slug !== page.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-6 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Empty spool weights
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight lg:text-4xl">
          {page.title}
        </h1>
        {page.intro.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className="mt-3 text-muted-foreground"
          >
            {paragraph}
          </p>
        ))}
      </header>

      <Suspense fallback={<div className="h-[400px]" />}>
        <Calculator initialSpoolPresetId={page.presetId} />
      </Suspense>

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          {page.brand} spool weights at a glance
        </h2>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Spool</th>
                <th className="px-3 py-2 text-left font-medium">
                  Empty weight (g)
                </th>
                <th className="px-3 py-2 text-left font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {page.weights.map((row) => (
                <tr key={row.variant} className="border-b last:border-b-0">
                  <td className="px-3 py-2 font-medium text-foreground">
                    {row.variant}
                  </td>
                  <td className="px-3 py-2 font-mono tabular-nums">
                    {row.grams}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          Spools vary a few grams batch to batch, so treat these as good
          starting points. The exact answer takes one minute: weigh an empty
          spool of the type you use, write the number on it with a Sharpie,
          and pick Custom in the calculator from then on.
        </p>
      </section>

      <AffiliatePicks
        pagePath={`/spools/${page.slug}`}
        className="mx-auto mt-10 max-w-3xl"
      />

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          How to weigh it right
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground marker:text-primary">
          <li>
            Take the spool off the printer or out of the AMS. Anything
            supporting the spool skews the reading.
          </li>
          <li>
            Use a kitchen scale on a flat surface. Gram resolution is plenty;
            you do not need a lab scale.
          </li>
          <li>
            Enter the total weight above, pick the matching spool type, and
            read off grams remaining. The result updates as you type.
          </li>
        </ol>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Frequently asked
        </h2>
        <dl className="space-y-4">
          {page.faq.map((item) => (
            <div key={item.q} className="space-y-1">
              <dt className="font-medium text-foreground">{item.q}</dt>
              <dd className="text-sm leading-6 text-muted-foreground">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">
          Where these numbers come from
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Community measurements and crowdsourced spool databases, cross-checked
          in July 2026. If your spool disagrees, trust your scale over any
          table, including this one.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-6 marker:text-primary">
          {page.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Other spool brands
        </h2>
        <ul className="space-y-1 text-sm">
          {otherBrands.map((brand) => (
            <li key={brand.slug}>
              <Link
                href={`/spools/${brand.slug}`}
                className="text-primary underline underline-offset-4"
              >
                {brand.brand} empty spool weight
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/tools/remaining-spool-calculator"
              className="text-primary underline underline-offset-4"
            >
              Remaining Filament Calculator (all brands)
            </Link>
          </li>
        </ul>
      </section>

      <RelatedContent
        pagePath="/tools/remaining-spool-calculator"
        className="mx-auto mt-10 max-w-3xl"
      />
    </div>
  );
}
