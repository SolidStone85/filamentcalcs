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
  "Calculate what each 3D print actually costs to run. Free, instant, works for Bambu, Prusa, Ender, and custom builds. Regional electricity rates included.";

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
    a: "Less than you probably think. A Bambu X1C averages around 115W during a print. An Ender 3 is closer to 125W. Over a 10 hour print at the US average rate of $0.18/kWh, you're looking at about 20 cents. Electricity is almost always a tiny fraction of filament cost.",
  },
  {
    q: "Is idle draw included?",
    a: "No. These numbers assume active printing. Most modern printers idle at 5 to 15W (screen, controller, fan), which adds up if you leave them on 24/7 but is negligible per print.",
  },
  {
    q: "What about bed heating?",
    a: "The wattage numbers in the printer presets are averages across a full print, including heated bed cycles. Bed heating is the biggest power draw (heaters pull 200 to 350W), but modern PID controllers cycle them on and off, so the average is much lower.",
  },
  {
    q: "Why are regional averages so different?",
    a: "Electricity markets vary. California and Hawaii average over $0.30/kWh. Louisiana and North Dakota are closer to $0.12. European rates are typically higher than the US. Your actual rate is printed on your utility bill, usually in the 'energy charge' or 'supply rate' line.",
  },
  {
    q: "Should I turn my printer off between prints?",
    a: "For cost: barely matters. 10W idle for 12 hours is 0.12 kWh, or about 2 cents at US average rates. For hardware longevity: probably yes, especially hotbed and power supply. For convenience: leave it on, it's fine.",
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
          Figure out what a 3D print actually costs to run. Enter your
          printer, print duration, and local electricity rate. Most people
          overestimate this by a factor of 5 or more.
        </p>
      </header>

      <AdSlot slot="top" className="mb-6" />

      <Suspense fallback={<div className="h-[400px]" />}>
        <Calculator />
      </Suspense>

      <AffiliatePicks pagePath="/tools/electricity-cost-calculator" className="mx-auto mt-8 max-w-3xl" />

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          How this works
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          A 3D printer is an electrical appliance. Its power draw, measured
          in watts, multiplied by the hours it runs, gives you energy used
          in watt-hours. Divide by 1000 for kilowatt-hours (kWh), then
          multiply by your electricity rate.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          For most hobbyists, electricity is an afterthought. A 24 hour
          print on a Bambu X1C at the US average rate of $0.18/kWh costs
          about 50 cents. Same print on filament at $25/kg uses around
          $18 of material. Filament dominates.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          The formula in detail
        </h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          cost = (watts / 1000) × hours × rate_per_kWh
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Worked example. Bambu P1S averaging 110W during a 12 hour print
          at $0.18/kWh:
        </p>
        <ul className="list-disc pl-5 text-sm leading-6 text-muted-foreground">
          <li>Energy used: (110 / 1000) × 12 = 1.32 kWh</li>
          <li>Cost: 1.32 × 0.18 = $0.24</li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">
          Twenty-four cents. That print also probably used $4 of filament,
          so electricity is about 6% of the material cost. This ratio holds
          almost universally for hobbyist printing.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          Average power draw by printer
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          These are average watt numbers across a full print, including the
          high-draw heating cycles. Numbers are pulled from manufacturer
          specs and community Kill-A-Watt measurements.
        </p>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Printer</th>
                <th className="px-3 py-2 text-left font-medium">Average draw</th>
                <th className="px-3 py-2 text-left font-medium">Peak draw</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-2">Bambu A1 mini</td>
                <td className="px-3 py-2">85W</td>
                <td className="px-3 py-2">350W</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Bambu A1</td>
                <td className="px-3 py-2">95W</td>
                <td className="px-3 py-2">400W</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Bambu P1S</td>
                <td className="px-3 py-2">110W</td>
                <td className="px-3 py-2">500W</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Bambu X1 Carbon</td>
                <td className="px-3 py-2">115W</td>
                <td className="px-3 py-2">500W</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Prusa MK4</td>
                <td className="px-3 py-2">95W</td>
                <td className="px-3 py-2">350W</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Ender 3 V2</td>
                <td className="px-3 py-2">125W</td>
                <td className="px-3 py-2">350W</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Voron 2.4 (350mm)</td>
                <td className="px-3 py-2">180W</td>
                <td className="px-3 py-2">700W</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Enclosed printer with chamber heater</td>
                <td className="px-3 py-2">+50W</td>
                <td className="px-3 py-2">+300W</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          Bigger beds and chamber heaters drive numbers up. ABS or ASA
          prints with a 90C chamber can run 30 to 50% higher average draw
          than the same printer doing PLA at 60C bed.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          Electricity rates by region
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Where you live changes the math more than which printer you own.
          Reference rates as of early 2026 (residential, all-in including
          fixed charges):
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm leading-6 text-muted-foreground">
          <li>US national average: $0.18/kWh</li>
          <li>Hawaii: $0.42/kWh (highest in US)</li>
          <li>California: $0.32/kWh</li>
          <li>Northeast US: $0.22 to $0.28/kWh</li>
          <li>Texas, Pacific Northwest: $0.13 to $0.16/kWh</li>
          <li>Louisiana, North Dakota: $0.11 to $0.13/kWh (lowest in US)</li>
          <li>UK: ~£0.27/kWh</li>
          <li>Germany: ~€0.40/kWh</li>
          <li>Netherlands: ~€0.35/kWh</li>
          <li>Australia: ~$0.30 AUD/kWh</li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">
          Your real number is on your utility bill, usually labeled "energy
          charge," "supply rate," or "delivery + supply" depending on
          provider. Use that, not the calculator default.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          Per-month electricity cost for typical print volume
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          A few common scenarios at $0.18/kWh, Bambu P1S (110W average):
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm leading-6 text-muted-foreground">
          <li>Light: 20 hours/month = 0.40 kWh = $0.07</li>
          <li>Moderate: 60 hours/month = 6.6 kWh = $1.19</li>
          <li>Heavy: 200 hours/month = 22 kWh = $3.96</li>
          <li>Print farm (1 printer running 24/7): 720 hours = 79.2 kWh = $14.26</li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">
          Even printing constantly, a single hobbyist printer adds about $14
          per month to your bill in average-rate areas. In Hawaii or
          Germany, that same usage is closer to $30. Still small compared to
          filament cost over the same period.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          When electricity actually starts to matter
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Print farms.</span>{" "}
            5+ printers running 24/7 turns electricity into a real line
            item. A 6-printer farm at typical loads can cost $80 to $120/month
            in average-rate areas.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Production with engineering filaments.
            </span>{" "}
            ABS and PA-CF need chamber heating that can push average draw to
            200W+. At extreme rates this stops being negligible.
          </li>
          <li>
            <span className="font-medium text-foreground">Hawaii and similar.</span>{" "}
            At $0.42/kWh, a 24-hour print on a Bambu X1C is $1.16, which is
            getting into "noticeable on top of filament" territory.
          </li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">
          For a single hobbyist printer at average rates, electricity will
          basically never change a decision. Don&apos;t lose sleep over it.
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

      <RelatedContent pagePath="/tools/electricity-cost-calculator" className="mx-auto mt-10 max-w-3xl" />

      <AdSlot slot="inline" className="mx-auto mt-10 max-w-3xl" />
    </div>
  );
}
