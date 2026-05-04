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

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          The formula in detail
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Strip everything else away and the math is one line:
        </p>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          cost = (grams / 1000) × price_per_kg × (1 + waste_factor)
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Worked example. Your slicer says a print uses 87 grams. You bought a
          1 kg spool of Polymaker PolyTerra PLA for $22. You typically see 5%
          waste. Math: (87 / 1000) × 22 × 1.05 = $2.01. That print costs you
          two bucks in filament alone.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          The waste factor is where most online calculators get sloppy. Some
          ignore it entirely and quote you the raw filament cost. Others
          stack a 20% buffer to "be safe," which inflates the number for no
          good reason on a clean printer. The defaults here come from real
          community data: 5% PLA, 7% PETG, 8% TPU, 10% ABS. Adjust if your
          specific printer runs hotter or cooler than typical.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          What "waste" actually covers
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          The waste factor in this calculator only counts waste on completed
          prints. That includes:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm leading-6 text-muted-foreground">
          <li>
            Nozzle priming line at the start of every print (1 to 3 grams)
          </li>
          <li>Skirt or brim, if you slice with one (2 to 8 grams)</li>
          <li>
            Stringing and oozing during travel moves (varies by material; PETG
            and TPU are the worst)
          </li>
          <li>
            Small surface defects you reprint, like a single failed corner on
            a multi-part plate
          </li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">
          What it does NOT cover: full print failures (the print delaminated
          at hour 6 and you started over), AMS purge waste on multi-color
          prints, and support material that you remove and discard. Each of
          those needs its own treatment. Failures get amortized in the{" "}
          <a
            href="/tools/failure-rate-calculator"
            className="underline underline-offset-4"
          >
            Failure Rate Calculator
          </a>
          . AMS purge has a dedicated{" "}
          <a
            href="/tools/ams-purge-waste-calculator"
            className="underline underline-offset-4"
          >
            AMS Purge Waste Calculator
          </a>
          . Support material is usually small enough to fold into your
          waste percentage.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          Material-specific waste rates
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Different filaments waste differently. Use these as starting points
          and adjust based on what your printer actually does.
        </p>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Material</th>
                <th className="px-3 py-2 text-left font-medium">
                  Typical waste %
                </th>
                <th className="px-3 py-2 text-left font-medium">
                  Why it sits there
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-2">PLA</td>
                <td className="px-3 py-2">5%</td>
                <td className="px-3 py-2">
                  Stable, low ooze, forgiving printing window
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">PETG</td>
                <td className="px-3 py-2">7%</td>
                <td className="px-3 py-2">
                  Stringing and ooze on travel moves; needs retraction tuning
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">TPU</td>
                <td className="px-3 py-2">8%</td>
                <td className="px-3 py-2">
                  Slow prints, oozes more, sticky filament on the bed
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">ABS</td>
                <td className="px-3 py-2">10%</td>
                <td className="px-3 py-2">
                  Warping causes partial failures and extra brims for adhesion
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">PLA+</td>
                <td className="px-3 py-2">5%</td>
                <td className="px-3 py-2">
                  Same as PLA, slightly tougher; no real waste difference
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2">Nylon</td>
                <td className="px-3 py-2">12%</td>
                <td className="px-3 py-2">
                  Hygroscopic, often needs drying mid-print, more failures
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          If you keep your filament dry and your retraction dialed, you can
          run lower than these numbers. If you live in humid climate or print
          fast on a low-end machine, expect higher.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          Three real worked examples
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          To make this concrete, here are three typical hobbyist prints on
          a Bambu P1S, with the math written out.
        </p>

        <div className="rounded-md border p-4">
          <p className="text-sm font-medium text-primary">
            Small: 3DBenchy in PLA
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-muted-foreground">
            <li>20 g of PLA</li>
            <li>$22 per kg spool (Polymaker PolyTerra)</li>
            <li>5% waste</li>
            <li>Math: (20 / 1000) × 22 × 1.05 = $0.46</li>
          </ul>
        </div>

        <div className="rounded-md border p-4">
          <p className="text-sm font-medium text-primary">
            Medium: phone case in PETG
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-muted-foreground">
            <li>92 g of PETG</li>
            <li>$26 per kg spool (eSun PETG)</li>
            <li>7% waste</li>
            <li>Math: (92 / 1000) × 26 × 1.07 = $2.56</li>
          </ul>
        </div>

        <div className="rounded-md border p-4">
          <p className="text-sm font-medium text-primary">
            Large: articulated dragon in dual-color PLA
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-muted-foreground">
            <li>320 g of PLA across 2 colors</li>
            <li>$22 per kg average spool price</li>
            <li>5% standard waste, plus 180 g of AMS purge waste</li>
            <li>
              Filament math: (320 / 1000) × 22 × 1.05 = $7.39
            </li>
            <li>
              Purge math: (180 / 1000) × 22 = $3.96 (no waste factor on
              purge, it's already lost material)
            </li>
            <li className="font-semibold text-primary">Total: $11.35</li>
          </ul>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          That last example shows why multi-color prints can blow your
          per-print cost. The actual dragon weighs 320 g, but the math says
          you spent material on 500 g of filament. Half your spool can vanish
          on purge for a single show-piece print.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          Common mistakes that throw the number off
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">
              Using length, not weight.
            </span>{" "}
            Slicers can show estimated meters or grams. Use grams. If you only
            have meters, multiply by density (PLA: ~3.0 g/m, PETG: ~3.2 g/m,
            ABS: ~2.8 g/m for 1.75 mm filament).
          </li>
          <li>
            <span className="font-medium text-foreground">
              Forgetting the spool weight.
            </span>{" "}
            A "1 kg" spool often refers to filament weight, not the whole
            package. But some retailers list the gross weight including the
            plastic spool itself (200 to 300 grams of plastic). If the spec
            sheet says 1.2 kg gross, you have 1 kg of filament; convert
            accordingly.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Pricing in the wrong currency.
            </span>{" "}
            European spools are often quoted including VAT, US spools
            usually not. A €25 spool with VAT included is roughly $24 USD
            without VAT, not $27.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Ignoring sale prices vs sticker prices.
            </span>{" "}
            If you buy filament during a Bambu Black Friday or Polymaker
            stock-up sale, your real per-kg cost can be 30 to 40 percent
            below what the spool retails for. Average across what you
            actually pay over a year, not the box price.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Treating the calculator's number as final.
            </span>{" "}
            This estimates material cost only. To price a sale piece on Etsy
            or Patreon, multiply by 3 to cover wear, electricity, and your
            time. The full breakdown lives in the{" "}
            <a
              href="/guides/3d-printing-cost-breakdown"
              className="underline underline-offset-4"
            >
              cost-breakdown guide
            </a>
            .
          </li>
        </ol>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          When this estimate is wrong
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          The calculator is accurate to within a few percent for clean,
          completed prints with reasonable settings. It will mislead you in
          three situations:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">
              Multi-color prints with heavy purging.
            </span>{" "}
            Use the AMS Purge Waste Calculator to add the purge cost on top.
            The two numbers combined are the real material cost.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Frequent failures.
            </span>{" "}
            If you fail 1 in every 5 prints, your effective per-print cost is
            25% higher than what shows here. The Failure Rate Calculator
            handles this.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Wet filament or off-spec material.
            </span>{" "}
            Wet PETG can string so badly that your effective waste hits 15%.
            If your prints look fuzzy and break easily, your waste factor is
            higher than the table above.
          </li>
        </ul>
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
