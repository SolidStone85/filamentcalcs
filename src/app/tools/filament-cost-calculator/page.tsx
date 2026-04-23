import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { SITE } from "@/lib/tools";

import { Calculator } from "./Calculator";

const TITLE = "Filament Cost Calculator: 3D print material cost in seconds";
const DESCRIPTION =
  "Free filament cost calculator for 3D printing. Enter grams used and spool price to get the real per-print cost, including waste. Works for PLA, PETG, ABS, TPU.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE.url}/tools/filament-cost-calculator`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/tools/filament-cost-calculator`,
    type: "website",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "How do I figure out the grams used?",
    a: "Your slicer (Bambu Studio, PrusaSlicer, OrcaSlicer, Cura) shows estimated filament weight next to the estimated print time. Copy that number. If you only have length in meters, multiply by density: PLA is ~3.0 g/m for 1.75mm filament.",
  },
  {
    q: "Why add a waste factor?",
    a: "Real prints waste filament on priming the nozzle, skirts, brims, and occasional short failures. 5% is typical for PLA on a well-tuned printer. PETG and TPU run 7–8% because of stringing and purge. ABS often hits 10% because of warping failures.",
  },
  {
    q: "Does this include electricity or printer wear?",
    a: "No, this is material cost only. For electricity, use the Electricity Cost Calculator. For full per-print cost including printer depreciation, use the Print Pricing guide.",
  },
  {
    q: "How do I convert spool price to price per kg?",
    a: "Divide the spool price by its weight in kilograms. A $25 spool weighing 1 kg is $25/kg. A $25 spool weighing 750 g is $33.33/kg.",
  },
  {
    q: "Is my data saved anywhere?",
    a: "No. All calculation happens in your browser. The URL is updated so you can bookmark or share the exact inputs, but nothing is sent to a server.",
  },
];

export default function FilamentCostCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Filament Cost Calculator",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any (web)",
        url: `${SITE.url}/tools/filament-cost-calculator`,
        description: DESCRIPTION,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
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
          <Highlight3D>Filament Cost Calculator</Highlight3D>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Get the real material cost for any 3D print. Enter the grams from
          your slicer, your spool price, and how much waste you typically see.
          No sign-up, no app download. Results update as you type, and the
          URL updates so you can share or bookmark.
        </p>
      </header>

      <AdSlot slot="top" className="mb-6" />

      <Suspense fallback={<div className="h-[400px]" />}>
        <Calculator />
      </Suspense>

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          How this works
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          3D print filament is sold by the kilogram, but prints use grams. The
          math: convert grams to kg, multiply by price per kg, then add a
          waste factor. Waste covers priming, skirts, brims, and small-scale
          failures, not full print failures, which need to be amortized
          separately.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          This calculator does not convert between currencies or unit
          systems. If your spool price is in Euros, select EUR. If you bought
          a 750 g spool for $25, your price per kg is $33.33. A quick spool
          pricing reference lives in the FAQ below.
        </p>
      </section>

      <AdSlot slot="inline" className="mx-auto my-10 max-w-3xl" />

      <section className="mx-auto max-w-3xl space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          Frequently asked
        </h2>
        <dl className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="space-y-1">
              <dt className="font-medium text-primary">{item.q}</dt>
              <dd className="text-sm leading-6 text-muted-foreground">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <AdSlot slot="inline" className="mx-auto mt-10 max-w-3xl" />
    </div>
  );
}
