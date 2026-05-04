import type { Metadata } from "next";
import Link from "next/link";
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
        <p className="text-sm leading-6 text-muted-foreground">
          For the full breakdown of when AMS is worth it, when it isn&apos;t,
          and how to cut purge waste by 30 to 50% without buying extra
          hardware, read the companion guide:{" "}
          <Link
            href="/guides/multi-color-printing-ams-worth-it"
            className="text-primary underline underline-offset-4"
          >
            Is multi-color 3D printing actually worth it?
          </Link>
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          The formula in detail
        </h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          purge_waste_g = swaps × purge_per_swap_g × flush_multiplier
        </p>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          total_material = part_weight + purge_waste
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Worked example. A two-color phone case: 92 g part weight, 38 color
          swaps, 8 g per swap (Bambu default), flush multiplier 1.0.
        </p>
        <ul className="list-disc pl-5 text-sm leading-6 text-muted-foreground">
          <li>Purge waste: 38 × 8 × 1.0 = 304 g</li>
          <li>Total material: 92 + 304 = 396 g</li>
          <li>At $22/kg PLA: 396 / 1000 × 22 = $8.71 instead of the $2.02 the part alone would cost</li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">
          The purge waste is more than 4x the part weight. This is the
          part most cost calculators silently miss. Multi-color isn&apos;t
          free; it&apos;s a serious material multiplier.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          Purge per swap by system
        </h2>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">System</th>
                <th className="px-3 py-2 text-left font-medium">Default purge per swap</th>
                <th className="px-3 py-2 text-left font-medium">Tunable down to</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-2">Bambu AMS (X1C, P1S)</td>
                <td className="px-3 py-2">7-9 g</td>
                <td className="px-3 py-2">3-4 g (compatible colors)</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Bambu AMS Lite (A1)</td>
                <td className="px-3 py-2">8-10 g</td>
                <td className="px-3 py-2">4-5 g</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Prusa MMU2/MMU3</td>
                <td className="px-3 py-2">15-25 g</td>
                <td className="px-3 py-2">10-15 g</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Mosaic Palette 3 Pro</td>
                <td className="px-3 py-2">~6 g equivalent</td>
                <td className="px-3 py-2">3-4 g</td>
              </tr>
              <tr>
                <td className="px-3 py-2">ERCF / 3MS (DIY Klipper)</td>
                <td className="px-3 py-2">5-12 g</td>
                <td className="px-3 py-2">2-4 g (well-tuned)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          The Bambu AMS isn&apos;t the worst here. Prusa MMU historically
          purges much more per swap. Bambu&apos;s lighter purge is one
          reason their multi-color experience feels cheaper to use.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          When multi-color is worth the waste
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Big parts, few swaps.</span>{" "}
            A 500 g print with 8 swaps wastes 64 g on purge (13% overhead).
            Acceptable.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Color is the entire point of the part.
            </span>{" "}
            Articulated dragon, hueforge portrait, custom logo plaque. The
            color IS the value.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Parts you cannot easily paint.
            </span>{" "}
            Embedded interior color, mechanical articulation that paint
            would clog, layer-shifted surface effects.
          </li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">
          Not worth it: small parts (under 100 g), prints where you could
          paint the color in afterward in 10 minutes, and parts where the
          color is purely cosmetic and the buyer doesn&apos;t care.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          How to cut purge waste 30 to 50% (free, no extra hardware)
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">
              Lower the flush multiplier.
            </span>{" "}
            Bambu Studio default is 1.0. Tuned users go to 0.5 to 0.7.
            Lower means more chance of color bleed in the first layers
            after a swap, but the savings are real.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Use the Flushing volumes matrix.
            </span>{" "}
            Bambu Studio &gt; Filament &gt; Flushing volumes lets you set
            different purge amounts for each color pair. Light to light
            colors flush less than light to dark.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Purge into the model.
            </span>{" "}
            Enable "purge into infill" or "purge into object" in slicer
            settings. The flushed material goes into hidden internal
            structure instead of a separate purge tower. Reduces visible
            waste even if total material is similar.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Group same-color features.
            </span>{" "}
            Slice your model so all the white parts print in one batch,
            then all blue, then all red. Cuts swap count drastically.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Use the Bambu sponge.
            </span>{" "}
            The little sponge clip on the AMS reduces purge needed for
            certain color transitions. Worth a small amount.
          </li>
        </ol>
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
