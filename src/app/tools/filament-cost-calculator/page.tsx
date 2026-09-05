import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
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
    a: "Use your slicer's estimated filament weight. A whole-job total may already include supports, purge and the tower: check the breakdown and set the extra waste allowance to 0% when it includes everything. For length-only estimates, 1.75 mm filament weighs roughly 3.0 g/m for PLA, 3.1 g/m for PETG and 2.5 g/m for ABS using this site's density assumptions; the product's actual density gives a better estimate.",
  },
  {
    q: "Why add a waste factor?",
    a: "The extra waste allowance covers material missing from the weight you entered. Use 0% for a complete slicer total. The material presets are illustrative assumptions, not measured waste rates. Use your own measurements, and never add the same supports or purge twice.",
  },
  {
    q: "Does this include electricity or printer wear?",
    a: "No, this is material cost only. For electricity, use the Electricity Cost Calculator. For a full sale price including printer wear, failures, and your time, use the 3D Print Pricing Calculator.",
  },
  {
    q: "How do I convert spool price to price per kg?",
    a: "Divide the price paid by the net filament weight in kilograms, excluding the spool and packaging. A $25 purchase with 750 g of filament is $33.333.../kg. The spool-price helper performs this conversion without rounding the internal result.",
  },
  {
    q: "Is my data saved anywhere?",
    a: "Arithmetic runs in your browser. If you opt in, selected currency, spool and printer preferences are saved on this device until you clear them; past print jobs are not stored as preferences. Inputs also appear in the page URL for bookmarks and sharing. Opening a URL can send it to the hosting server, and sharing it reveals its inputs to the recipient. The Privacy page explains site analytics and storage.",
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
          Enter print weight and the price you paid for filament. Get a
          material-cost estimate, then carry it into print pricing.
        </p>
      </header>

      <AdSlot slot="top" className="mb-6" />

      <Suspense fallback={<div className="h-[400px]" />}>
        <Calculator />
      </Suspense>

      <AffiliatePicks pagePath="/tools/filament-cost-calculator" className="mx-auto mt-8 max-w-3xl" />

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">How the calculation works</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Convert the entered grams to kilograms, multiply by the filament
          price per kilogram, then apply any extra waste allowance. The
          result covers material only. Electricity, printer wear, repeated
          failed attempts and your time are separate costs.
        </p>
        <p className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs">
          cost = (grams / 1000) × price_per_kg × (1 + waste_factor)
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          For example, 100 g at $20/kg with an assumed 5% extra allowance
          consumes 105 g and costs $2.10. A kilogram covers nine complete
          prints of that size. If a print needs more than 1,000 g including
          waste, the complete-prints-per-kilogram result is zero.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Enter your actual price paid and the new spool's net filament
          weight in the helper, or choose price per kg. A $25 purchase with
          750 g of filament works out to $33.333.../kg; the calculation keeps
          that precision internally. Use the labeled net weight, not the
          gross package weight or an assumed empty-spool weight. The currency
          selector changes formatting; it does not convert prices or taxes.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Count each gram once</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          A slicer's model weight and its whole-job total are different
          inputs. Check which one you copied before adding an allowance:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Whole-job total:</span>{" "}
            if it already includes supports, priming, purge and the tower,
            enter that total and set extra waste to 0%.
          </li>
          <li>
            <span className="font-medium text-foreground">Model weight only:</span>{" "}
            add separately measured or sliced material that the model weight
            excludes. A percentage is a rough allowance when those amounts
            are unavailable, not a substitute for a known breakdown.
          </li>
          <li>
            <span className="font-medium text-foreground">Multi-color print:</span>{" "}
            the{" "}
            <a href="/tools/ams-purge-waste-calculator" className="underline underline-offset-4">
              AMS material calculator
            </a>{" "}
            can combine model, supports, discarded flushing and tower grams.
            Use its total here with 0% extra waste. Do not add its purge or
            total cost again to a result that already includes that material.
          </li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">
          The material presets use illustrative price and allowance values.
          They are not live market prices or measured material-specific
          waste rates. Replace them with your own prices and measurements.
          Supports, brims and priming amounts depend on the sliced job;
          there is no fixed number of grams that fits every print.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Worked examples with assumed inputs</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          These examples demonstrate the arithmetic. They are hypothetical
          jobs and prices, not documented print tests or current product quotes.
        </p>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Entered weight</th>
                <th className="px-3 py-2 text-left font-medium">Price/kg</th>
                <th className="px-3 py-2 text-left font-medium">Extra allowance</th>
                <th className="px-3 py-2 text-right font-medium">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-2">20 g PLA</td>
                <td className="px-3 py-2">$22</td>
                <td className="px-3 py-2">5% (1 g)</td>
                <td className="px-3 py-2 text-right">$0.46</td>
              </tr>
              <tr>
                <td className="px-3 py-2">92 g PETG</td>
                <td className="px-3 py-2">$26</td>
                <td className="px-3 py-2">7% (6.44 g)</td>
                <td className="px-3 py-2 text-right">$2.56</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="pt-3 text-base font-medium">A multi-color dragon</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          Suppose the model uses 320 g of PLA. Assume another 5% (16 g) for
          material not included in that model weight, plus 180 g of separately
          counted AMS purge. Both colors cost $22/kg. Total consumption is
          320 + 16 + 180 = 516 g, costing 0.516 × $22 = $11.352, displayed as
          $11.35. The purge portion alone is 180 g and costs $3.96.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          To reproduce that combined total here, enter 516 g at $22/kg with
          0% extra waste. If your slicer already reported all 516 g, that is
          the same input; adding another 5% or another 180 g would double count.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Check the estimate against your own print</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          The arithmetic follows the entered quantities. Real-world accuracy
          depends on your slicer estimate, scale, filament density and the
          material you include; this tool does not guarantee a percentage of
          accuracy. Comparing predicted grams with a measured spool-weight
          change can help you improve the next estimate.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          If only filament length is available, mass per meter depends on
          diameter and density. For 1.75 mm filament, the densities used in
          this site's material comparison give approximately 3.0 g/m for PLA,
          3.1 g/m for PETG and 2.5 g/m for ABS. Use the filament maker's density
          for the actual product; these conversions do not apply unchanged
          to a different diameter.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          For selling a print, use the result's link to the{" "}
          <a href="/tools/print-pricing-calculator" className="underline underline-offset-4">
            3D Print Pricing Calculator
          </a>{" "}
          to include electricity, wear, your failure-rate assumption and labor.
          The{" "}
          <a href="/tools/failure-rate-calculator" className="underline underline-offset-4">
            Failure Rate Calculator
          </a>{" "}
          helps measure your recorded failure rate, and the{" "}
          <a href="/guides/3d-printing-cost-breakdown" className="underline underline-offset-4">
            cost-breakdown guide
          </a>{" "}
          explains the separate cost lines.
        </p>
      </section>
      <AdSlot slot="inline" className="mx-auto my-10 max-w-3xl" />

      <section className="mx-auto max-w-3xl space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Frequently asked
        </h2>
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

      <RelatedContent pagePath="/tools/filament-cost-calculator" className="mx-auto mt-10 max-w-3xl" />

      <AdSlot slot="inline" className="mx-auto mt-10 max-w-3xl" />
    </div>
  );
}
