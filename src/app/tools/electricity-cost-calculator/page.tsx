import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
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
          Electricity Cost Calculator
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

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
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

      <AdSlot slot="inline" className="mx-auto my-10 max-w-3xl" />

      <section className="mx-auto max-w-3xl space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Frequently asked
        </h2>
        <dl className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="space-y-1">
              <dt className="font-medium">{item.q}</dt>
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
