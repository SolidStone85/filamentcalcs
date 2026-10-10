import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { RelatedContent } from "@/components/shared/RelatedContent";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { MATERIAL_DATASHEETS } from "@/lib/presets/materialDatasheets";
import { MATERIALS_FULL } from "@/lib/presets/materialsFull";
import { SITE } from "@/lib/tools";

import { Calculator } from "./Calculator";

const TITLE = "Filament Length to Weight Converter: grams to meters and back";
const DESCRIPTION =
  "Convert filament grams to meters (and meters to grams) for 1.75 mm or 2.85 mm filament, using densities from named product data sheets. Optional cost per meter.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE.url}/tools/filament-length-converter`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/tools/filament-length-converter`,
    type: "website",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "How many meters are in a 1 kg spool of 1.75 mm PLA?",
    a: "About 335 m at a density of 1.24 g/cm³, the figure on Bambu Lab's PLA Basic data sheet. A different PLA with a different density, or filament slightly over or under 1.75 mm, gives a slightly different length.",
  },
  {
    q: "Why does PETG or ABS give a different length for the same weight?",
    a: "Length depends on density. A lighter material packs more length into each gram: at 1.75 mm, ABS at 1.05 g/cm³ is about 2.53 g per meter, while PLA at 1.24 g/cm³ is about 2.98 g per meter.",
  },
  {
    q: "My slicer reports filament in meters. How do I get the cost?",
    a: "Switch to length to grams, enter the meters, then follow the link to the filament cost calculator, which carries the grams over and lets you add waste. Or enter a price per kg here for the cost of that length directly.",
  },
  {
    q: "How do I convert what is left on a spool?",
    a: "Weigh the spool and subtract the empty spool weight in the remaining filament calculator first. The grams it gives are net filament, which is what this converter needs.",
  },
];

export default function FilamentLengthConverterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Filament Length to Weight Converter",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any (web)",
        url: `${SITE.url}/tools/filament-length-converter`,
        description: DESCRIPTION,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
          <Highlight3D>Filament Length to Weight Converter</Highlight3D>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Turn grams of filament into meters, or a slicer&apos;s meters into
          grams. Pick your diameter and a density from a named product&apos;s
          data sheet, or enter your own.
        </p>
      </header>

      <Suspense fallback={<div className="h-[400px]" />}>
        <Calculator />
      </Suspense>

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">How it works</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          grams_per_meter = density × π × (diameter ÷ 2)²
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          One meter of filament is a cylinder 1000 mm long. Its volume in
          cubic centimeters equals its cross-section area in square
          millimeters, so multiplying that area by the density in g/cm³
          gives grams per meter. Worked example: 1.75 mm filament has a
          cross-section of π × 0.875² = 2.405 mm². At 1.24 g/cm³ that is
          2.983 g per meter, so 1000 g is about 335 m. At $24 per kg, each
          meter costs about 7.2 cents.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Real filament is not perfectly round or exactly its nominal
          diameter, and density varies by product, color and additive.
          Expect a few percent of difference from a weighed spool.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Density presets and where they come from
        </h2>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Material</th>
                <th className="px-3 py-2 text-left font-medium">Product data sheet</th>
                <th className="px-3 py-2 text-left font-medium">Density</th>
              </tr>
            </thead>
            <tbody>
              {MATERIAL_DATASHEETS.map((sheet) => (
                <tr key={sheet.materialId} className="border-b last:border-b-0">
                  <td className="px-3 py-2">
                    {MATERIALS_FULL.find((m) => m.id === sheet.materialId)?.label}
                  </td>
                  <td className="px-3 py-2">
                    <a
                      href={sheet.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-4"
                    >
                      {sheet.product}
                    </a>
                  </td>
                  <td className="px-3 py-2 font-mono tabular-nums">
                    {sheet.densityGPerCm3} g/cm³
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          These are one product each, not values for every filament of that
          type. The same products appear with their heat and strength data
          in the{" "}
          <Link href="/tools/material-comparison" className="underline underline-offset-4">
            material comparison
          </Link>
          .
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Frequently asked</h2>
        <dl className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="space-y-1">
              <dt className="font-medium text-foreground">{item.q}</dt>
              <dd className="text-sm leading-6 text-muted-foreground">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <RelatedContent
        pagePath="/tools/filament-length-converter"
        className="mx-auto mt-10 max-w-3xl"
      />
    </div>
  );
}
