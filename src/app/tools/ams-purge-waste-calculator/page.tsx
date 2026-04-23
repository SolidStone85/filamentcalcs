import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { SITE } from "@/lib/tools";

import { Calculator } from "./Calculator";

const TITLE =
  "Bambu AMS Purge Waste Calculator: how much filament is your multi-color print actually using?";
const DESCRIPTION =
  "Calculate how much filament Bambu AMS wastes on color purges. Free tool for multi-color print cost estimation. Works for X1C, P1S, A1, and tuned profiles.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE.url}/tools/ams-purge-waste-calculator`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/tools/ams-purge-waste-calculator`,
    type: "website",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "Why does Bambu AMS waste so much filament?",
    a: "Every time the printer changes colors, it has to flush the previous color out of the hotend before the new color prints cleanly. Bambu's default flush is around 8 grams per swap. A print with 40 color changes wastes 320 grams on purge alone, which is often more than the actual part weight.",
  },
  {
    q: "Can I reduce purge waste?",
    a: "Yes, to a point. Lower your 'flush multiplier' in Bambu Studio (default is often 1.0x, tuned users go to 0.4x-0.6x). Use the 'Flushing volumes' matrix to set lighter purges for compatible colors (white to white flush less than white to black). Reduce the number of color changes in the print itself by grouping same-color features.",
  },
  {
    q: "Where do I find the color swap count?",
    a: "In Bambu Studio, slice the print, then click the 'Flush data' or 'Filament change' panel in the preview. It shows total swaps and exact grams flushed. Orca Slicer shows similar data.",
  },
  {
    q: "Is multi-color printing worth the waste?",
    a: "For small prints, usually not. A 30 gram part with 40 swaps uses 320 grams of purge, meaning multi-color costs 10x the base material. For larger prints, the purge percentage drops. Worth asking: could you paint the part instead of printing in color?",
  },
  {
    q: "Does this apply to non-Bambu multi-material systems?",
    a: "The math works for any multi-material setup (Prusa MMU, Mosaic Palette, etc.), but purge-per-swap values differ. MMU2/3 often purges 15-25g per swap. Palette uses transition lengths measured in mm of filament, not grams. Use the custom profile and enter your system's known purge weight.",
  },
];

export default function AmsPurgeWastePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Bambu AMS Purge Waste Calculator",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any (web)",
        url: `${SITE.url}/tools/ams-purge-waste-calculator`,
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
          <Highlight3D>AMS Purge Waste Calculator</Highlight3D>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Figure out how much filament your Bambu AMS (or similar multi-material
          system) is actually wasting on color changes. For multi-color prints,
          purge can easily exceed the weight of the part itself, and most
          filament cost calculators ignore it entirely.
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
          Every color change on a Bambu AMS, Prusa MMU, or Mosaic Palette
          requires purging the old color out of the hotend. The material that
          gets flushed is wasted. For a print with 40 color changes at 8 grams
          per swap, that&apos;s 320 grams of filament dumped into the purge
          tower, which is roughly $6 of PLA or $10 of PETG.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Most hobbyists never calculate this. Bambu Studio shows flush data
          but buries it in the preview panel. This tool surfaces the real
          cost of multi-color printing so you can decide whether it&apos;s
          worth it for a given part.
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
