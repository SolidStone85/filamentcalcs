import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { SITE } from "@/lib/tools";

import { Calculator } from "./Calculator";

const TITLE = "3D Printer Electricity Cost Calculator: cost per print, per month";
const DESCRIPTION =
  "Estimate a 3D print's electricity cost from average watts, print hours and your rate per kWh. Free, with editable printer and regional reference estimates.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE.url}/tools/electricity-cost-calculator`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/tools/electricity-cost-calculator`,
    type: "website",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "How much electricity does a 3D printer actually use?",
    a: "It depends on the printer, material, temperatures and job duration. As an example, an average 100 W over ten hours uses 1 kWh. At an assumed $0.18/kWh that costs $0.18. Use a measured average for your job; the printer presets are reference estimates, not guaranteed measurements.",
  },
  {
    q: "Is idle draw included?",
    a: "Idle time is not added automatically. The result covers only the watts and hours entered. To include time between prints, calculate measured idle watts times idle hours separately and add that cost, avoiding any period already counted in the print measurement.",
  },
  {
    q: "What about bed heating?",
    a: "Heating and temperature maintenance change the power draw during a job. For a whole-job estimate, measure energy from startup through the end of the job and use its average power over the same duration. A rated maximum or a single reading during warmup is not that average. The presets do not model heating phases separately.",
  },
  {
    q: "Which electricity rate should I enter?",
    a: "Use the per-kWh usage charges that apply to your tariff and printing time, including applicable per-kWh delivery charges. Regional presets are editable reference estimates, not current quotes for your address. For time-of-use rates, calculate each period separately. Use one currency throughout; changing the currency display does not perform an exchange-rate conversion.",
  },
  {
    q: "Should I turn my printer off between prints?",
    a: "Measure the idle draw to see the cost for your schedule. For example, 10 W over twelve idle hours uses 0.12 kWh; at an assumed $0.18/kWh that is $0.0216, about two cents. More idle hours or a higher rate increase that amount. This cost calculation does not establish a printer-lifespan benefit.",
  },
];

export default function ElectricityCostPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "3D Printer Electricity Cost Calculator",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any (web)",
        url: `${SITE.url}/tools/electricity-cost-calculator`,
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
          <Highlight3D>Electricity Cost Calculator</Highlight3D>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Estimate electricity cost from average power, print time and your
          rate per kWh.
        </p>
      </header>

      <AdSlot slot="top" className="mb-6" />

      <Suspense fallback={<div className="h-[400px]" />}>
        <Calculator />
      </Suspense>

      <AffiliatePicks pagePath="/tools/electricity-cost-calculator" className="mx-auto mt-8 max-w-3xl" />

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          How this works
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Average power in watts × hours gives energy in watt-hours. Divide
          by 1,000 to get kilowatt-hours, then multiply by the applicable price
          per kWh. Use the same measurement period for average power and duration.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          All numbers in the examples below are illustrative assumptions.
          Printer and regional presets help you start an estimate; they are not
          measured guarantees or current tariffs. Replace them with your own
          average draw and utility rate for a more useful result.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          The formula in detail
        </h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          cost = (watts / 1000) × hours × rate_per_kWh
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Example: an assumed 110 W average over twelve hours at $0.18/kWh.
          These are not measurements for a specific printer or a national-average rate.
        </p>
        <ul className="list-disc pl-5 text-sm leading-6 text-muted-foreground">
          <li>Energy used: (110 ÷ 1,000) × 12 = 1.32 kWh</li>
          <li>Cost: 1.32 × $0.18 = $0.2376, rounded to $0.24</li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">
          Compare that result with the material cost of the same job. There
          is no fixed relationship between electricity and filament cost:
          print duration, material use and your tariff can all change it.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Choose a representative average wattage
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          A plug-in energy meter can measure a complete job, including warmup
          and temperature maintenance. If it reports total kWh, divide that by
          the measured hours and multiply by 1,000 to get average watts.
          Do not substitute the power-supply rating or a brief heating peak.
        </p>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Assumed average draw</th>
                <th className="px-3 py-2 text-left font-medium">Energy over 10 hours</th>
                <th className="px-3 py-2 text-left font-medium">Cost at $0.18/kWh</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-2">50 W</td>
                <td className="px-3 py-2">0.5 kWh</td>
                <td className="px-3 py-2">$0.09</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">100 W</td>
                <td className="px-3 py-2">1 kWh</td>
                <td className="px-3 py-2">$0.18</td>
              </tr>
              <tr>
                <td className="px-3 py-2">200 W</td>
                <td className="px-3 py-2">2 kWh</td>
                <td className="px-3 py-2">$0.36</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          These rows show how the formula responds to different inputs, not
          what a named printer should draw. Bed temperature, ambient conditions,
          fans and chamber heating can change the average. Measure a representative
          job again when your setup or material changes substantially.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Use the rate on your tariff
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Look for usage charges per kWh, including any applicable per-kWh
          delivery charge. A fixed monthly connection fee does not increase
          just because one more print runs, so it is not automatically part
          of this marginal electricity-cost calculation.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          If the rate changes by time of day, calculate the hours in each
          period separately and add the costs. This calculator does not model
          demand charges or tariff tiers. Keep the entered rate and displayed
          currency consistent; the currency selector does not convert amounts.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Example monthly print schedules
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Assume a constant 110 W printing average and $0.18/kWh for all
          printing hours. Idle time and separate accessories are excluded.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm leading-6 text-muted-foreground">
          <li>20 hours/month = 2.2 kWh = $0.40</li>
          <li>60 hours/month = 6.6 kWh = $1.19</li>
          <li>200 hours/month = 22 kWh = $3.96</li>
          <li>720 hours (continuous printing for 30 days) = 79.2 kWh = $14.26</li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">
          These are arithmetic scenarios, not typical household bills or a
          prediction of printer uptime. Use the number of hours you actually
          expect to print. For several machines, calculate each machine&apos;s
          average draw and schedule, then add the results.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Account for the whole setup
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          A separately powered dryer, extraction fan or chamber heater can
          add energy use. Include it in the measurement or calculate it
          separately, but do not count it twice. For a print&apos;s complete
          cost, add material, machine wear, failures and hands-on time in the{" "}
          <a href="/tools/print-pricing-calculator" className="underline underline-offset-4">
            print pricing calculator
          </a>.
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

      <RelatedContent pagePath="/tools/electricity-cost-calculator" className="mx-auto mt-10 max-w-3xl" />

      <AdSlot slot="inline" className="mx-auto mt-10 max-w-3xl" />
    </div>
  );
}
