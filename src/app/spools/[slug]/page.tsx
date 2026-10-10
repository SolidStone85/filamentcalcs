import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Calculator } from "@/app/tools/remaining-spool-calculator/Calculator";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { EvidenceBadge } from "@/components/shared/EvidenceBadge";
import { SpoolAnswerTiles } from "@/components/shared/SpoolAnswerTiles";
import { SPOOL_BRAND_PAGES, getSpoolBrandPage } from "@/lib/spoolBrands";
import { SITE } from "@/lib/tools";

type Params = { slug: string };

function formatChecked(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

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
        dateModified: page.checked,
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
  const sources = [
    ...page.weights.flatMap((row) => row.sources),
    ...page.furtherReading,
  ].filter(
    (source, i, all) => all.findIndex((s) => s.url === source.url) === i,
  );

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
        <SpoolAnswerTiles tiles={page.summary} />
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
        {/* A table on wider screens; each row stacks into a card on phones. */}
        <div className="rounded-md border sm:overflow-x-auto">
          <table className="w-full text-xs leading-6 max-sm:block">
            <thead className="max-sm:hidden">
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">
                  Spool and what is on the scale
                </th>
                <th className="px-3 py-2 text-left font-medium">
                  Empty weight (g)
                </th>
                <th className="px-3 py-2 text-left font-medium">
                  Evidence
                </th>
              </tr>
            </thead>
            <tbody className="max-sm:block">
              {page.weights.map((row) => (
                <tr
                  key={row.variant}
                  className="border-b align-top last:border-b-0 max-sm:block max-sm:py-2"
                >
                  <td className="px-3 py-2 max-sm:block max-sm:pb-0">
                    <div className="font-medium text-foreground">
                      {row.variant}
                    </div>
                    <div className="text-muted-foreground">{row.includes}</div>
                  </td>
                  <td className="px-3 py-2 font-mono tabular-nums max-sm:block max-sm:py-1 max-sm:text-base max-sm:font-semibold">
                    {row.grams}
                    <span className="font-sans text-xs font-normal text-muted-foreground sm:hidden">
                      {" "}g empty
                    </span>
                  </td>
                  <td className="space-y-1 px-3 py-2 text-muted-foreground max-sm:block max-sm:pt-0">
                    <EvidenceBadge evidence={row.evidence} />
                    <div>{row.note}</div>
                    {row.sources.length > 0 && (
                      <div className="flex flex-wrap gap-x-3">
                        {row.sources.map((source, i) => (
                          <a
                            key={source.url}
                            href={source.url}
                            title={source.label}
                            aria-label={source.label}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline underline-offset-4"
                          >
                            {row.sources.length > 1 ? `Source ${i + 1}` : "Source"}
                          </a>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          &ldquo;Manufacturer&rdquo; means the brand publishes the number.
          &ldquo;User measurements&rdquo; means people weighed their own
          spools and posted the result, so your spool can differ. The exact
          answer takes one minute:
          weigh an empty spool of the type you use, write the number on it,
          and pick Custom in the calculator from then on.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          What a wrong tare does to your answer
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Every gram of tare error moves the remaining-filament answer by the
          same gram. Say the scale reads 300 g and you are unsure whether the
          tare is 200 g or 225 g. One gives 100 g of filament left, the other
          75 g. For an 80 g print, that is the difference between 20 g to
          spare and 5 g short. When a print is close, weigh an empty spool of
          the same type before you trust any preset.
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
          Each row above names its evidence. Sources were last checked{" "}
          {formatChecked(page.checked)}. Spool designs change without notice,
          so if your spool disagrees, trust your scale over any table,
          including this one.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-6 marker:text-primary">
          {sources.map((source) => (
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
        {page.correction && (
          <p className="text-xs leading-5 text-muted-foreground">
            <span className="font-medium text-foreground">Correction note:</span>{" "}
            {page.correction}
          </p>
        )}
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
