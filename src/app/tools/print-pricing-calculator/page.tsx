import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { SITE } from "@/lib/tools";

import { Calculator } from "./Calculator";

const TITLE = "3D Print Pricing Calculator: what to charge for a print";
const DESCRIPTION =
  "Free 3D print pricing calculator. Material, electricity, printer wear, failure rate, and your time, turned into an honest price for Etsy, commissions, or friends.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE.url}/tools/print-pricing-calculator`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/tools/print-pricing-calculator`,
    type: "website",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "What markup should I use?",
    a: "2x is friends-and-family territory, basically covering your risk. 3x is the common floor for Etsy hobbyists and casual commissions. 4x to 5x is where you need to be if this is a business with fees, returns, marketing, and taxes. Underpricing is the most common mistake by far; almost nobody regrets charging more.",
  },
  {
    q: "Why divide by the failure rate instead of just adding a percent?",
    a: "Because a failed print costs a whole print, not a percent of one. If 1 in 10 prints dies, every 9 good prints have to carry the cost of the dead one. Dividing production cost by 0.9 spreads that loss correctly. Adding 10% undercounts it, and the gap grows fast at higher failure rates.",
  },
  {
    q: "Should I really charge for my time at hobbyist scale?",
    a: "Put a number on it even if you end up discounting it. Support removal, sanding, glue-ups, and packing are real work. If you price them at zero, every commission quietly becomes a favor, and favors burn people out. Even $10 to $15 an hour changes the price enough to matter.",
  },
  {
    q: "What lifetime should I assume for my printer?",
    a: "5,000 print hours is a fair default for a modern machine that gets basic maintenance. Budget bedslingers may live shorter, well-maintained CoreXY machines longer. The good news: the number barely moves the result. A $350 printer over 5,000 hours is 7 cents per print hour, so being off by 1,000 hours changes a 6 hour print by about a penny.",
  },
  {
    q: "Does this include marketplace fees, shipping, and packaging?",
    a: "No. Etsy takes roughly 6.5% plus payment processing around 3%, and boxes, tape, and filler are real money. Those depend on the platform and the parcel, so they are not baked in. Treat the suggested price as your workshop-door price and add fees and shipping on top for online sales.",
  },
];

export default function PrintPricingCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "3D Print Pricing Calculator",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any (web)",
        url: `${SITE.url}/tools/print-pricing-calculator`,
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
          <Highlight3D>3D Print Pricing Calculator</Highlight3D>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Work out what a print should sell for, not just what it costs.
          Material, electricity, printer wear, your real failure rate, and
          your hands-on time go in. An honest price comes out, with the
          break-even floor shown right next to it so you know how much room
          you actually have.
        </p>
      </header>

      <AdSlot slot="top" className="mb-6" />

      <Suspense fallback={<div className="h-[400px]" />}>
        <Calculator />
      </Suspense>

      <AffiliatePicks
        pagePath="/tools/print-pricing-calculator"
        className="mx-auto mt-8 max-w-3xl"
      />

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          How the math works
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Production cost is the part most people already track: filament,
          power, and a slice of the printer itself. Machine wear is just the
          printer's price spread over its useful hours. A $350 printer that
          lives 5,000 print hours costs 7 cents per hour to own, so a 6 hour
          job carries 42 cents of wear. Small, but skip it on a hundred prints
          and you gave away a nozzle, a build plate, and half a set of belts.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Then failures. If 8% of your prints die, dividing by 0.92 makes
          every good print carry its share of the wreckage. That is the part
          almost every seller forgets, and it is why a shop with a messy
          printer quietly loses money at prices that look profitable on paper.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Markup multiplies the production cost, and your labor gets added
          after it, at full value. The logic: markup exists to cover profit
          and invisible overhead, but your hour of sanding is not something to
          multiply, it is something to pay for. If a price feels too high for
          the market, the honest lever is reducing hands-on time per piece,
          not silently working for free.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          The formula in detail
        </h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          price = (production ÷ (1 - failure_rate)) × markup + labor
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Worked example. A print uses $2.50 of filament and about $0.20 of
          electricity across 6 hours. Wear on a $350 printer over 5,000 hours
          adds $0.42, so production is $3.12. At an 8% failure rate that
          becomes 3.12 ÷ 0.92 = $3.39. Half an hour of prep and cleanup at
          $15/h is $7.50. With a 3× markup: 3.39 × 3 + 7.50 = $17.67. Round
          to $18 and you have a defensible price, with a break-even floor of
          $10.89 if someone haggles.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          What people get wrong when pricing prints
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">
              Competing with injection molding.
            </span>{" "}
            If a mass-produced version exists for $4, you will not win at $6.
            Sell what printing is actually good at: custom sizes, personalized
            text, niche parts nobody stocks, and repairs.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Pricing from the filament number alone.
            </span>{" "}
            "It only cost $2 of plastic" ignores the machine, the failures,
            the electricity, and the hour you spent removing supports. That $2
            print is closer to $11 at break-even in the worked example above.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Forgetting batch effects.
            </span>{" "}
            Ten keychains on one plate share one setup, one warmup, and one
            cleanup. Price the batch, then divide. Single tiny items priced
            individually always look absurd, because they are.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Treating every hour as billable machine-sitting.
            </span>{" "}
            The printer works alone. Only count the time your hands are
            actually on the job, or your prices will scare off everyone.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Racing to the bottom on Etsy.
            </span>{" "}
            There is always someone selling at a loss. Let them. They churn
            out and disappear; shops that price at 3× and up are the ones
            still around a year later.
          </li>
        </ol>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Where the inputs come from
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Each input has a calculator behind it on this site. Material cost
          comes from the{" "}
          <a
            href="/tools/filament-cost-calculator"
            className="underline underline-offset-4"
          >
            Filament Cost Calculator
          </a>
          , including purge waste for multi-color work. Electricity comes from
          the{" "}
          <a
            href="/tools/electricity-cost-calculator"
            className="underline underline-offset-4"
          >
            Electricity Cost Calculator
          </a>
          . Your failure rate is worth measuring honestly with the{" "}
          <a
            href="/tools/failure-rate-calculator"
            className="underline underline-offset-4"
          >
            Failure Rate Calculator
          </a>{" "}
          instead of guessing; most people guess low.
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

      <RelatedContent
        pagePath="/tools/print-pricing-calculator"
        className="mx-auto mt-10 max-w-3xl"
      />

      <AdSlot slot="inline" className="mx-auto mt-10 max-w-3xl" />
    </div>
  );
}
