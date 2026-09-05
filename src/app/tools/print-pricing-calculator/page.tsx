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
  "Estimate production cost, break-even and a selling price from material, electricity, machine wear, failures, labor and your chosen markup. Free, no sign-up.";

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
    a: "Choose a multiplier for your costs and the particular product, then compare the resulting price with what buyers will pay. There is no universal 3x minimum. This calculator multiplies failure-adjusted production cost and adds labor afterward. A 3x multiplier is 200% markup on that production cost, not a 300% profit margin.",
  },
  {
    q: "Why divide by one minus the failure rate?",
    a: "The model assumes each failed attempt consumes a full print's material, electricity and machine cost. If 10% of attempts fail, divide production cost by 0.9 to spread those losses across successes. Early failures can cost less, so use your observed losses to refine the estimate. Labor is added separately and is not automatically increased by this adjustment.",
  },
  {
    q: "Should I really charge for my time at hobbyist scale?",
    a: "Recording preparation, finishing, packing and required supervision makes the estimate more useful, even if you choose to discount a job. Enter your own hourly rate. Machine runtime and hands-on labor are separate inputs; include design or repeated failure-cleanup work in your labor total when relevant.",
  },
  {
    q: "What lifetime should I assume for my printer?",
    a: "Use an assumption that fits your replacement plans and test how changing it affects the price. The 5,000-hour default is an editable example, not a measured lifespan. For a $350 printer and six-hour job, changing 5,000 hours to 4,000 raises machine cost from $0.42 to $0.525: a $0.105 difference, about 11 cents, before failure adjustment and markup.",
  },
  {
    q: "Does this include marketplace fees, shipping, and packaging?",
    a: "No. Check your actual platform and payment-processing charges, shipping, packaging, taxes where applicable, and other business costs. Some fees depend on the final selling price or shipping amount, so verify the final take-home amount after adding them. A markup does not guarantee that every omitted cost is covered.",
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
          Estimate production cost, break-even and a selling price using
          your own costs, labor and chosen markup.
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
          Production cost combines material, electricity and a share of the
          printer&apos;s purchase price. For example, $350 spread over 5,000
          useful hours is $0.07/hour, so a six-hour job carries $0.42 of machine
          cost. Price and lifetime are illustrative inputs, not current product
          prices or manufacturer lifespan claims. Replacement parts and repairs
          may require a separate allowance.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          The failure adjustment divides production cost by the success rate.
          At an assumed 8% failure rate, that means division by 0.92. This model
          treats each failure as a full-production-cost attempt; it can overstate
          losses when failures occur early. Use a tracked failure rate and check
          the result against actual material and machine time lost.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Your selected multiplier applies to failure-adjusted production cost;
          labor is added afterward. That is this calculator&apos;s pricing model,
          not a rule every business must use. Break-even covers only the costs
          entered here. Selling fees, shipping, packaging and other omitted costs
          still need to be checked before treating the difference as profit.
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
          Illustrative example. A print uses $2.50 of filament and $0.20 of
          electricity across 6 hours. Wear on a $350 printer over 5,000 hours
          adds $0.42, so production is $3.12. At an 8% failure rate that
          becomes 3.12 ÷ 0.92 = $3.39. Half an hour of prep and cleanup at
          $15/h is $7.50. With a chosen 3× multiplier, (3.12 ÷ 0.92) × 3 +
          7.50 = $17.67, rounded. The entered-cost break-even is $10.89.
          These results use unrounded intermediate values and exclude selling
          fees and other costs described below; they are not market-price recommendations.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Check these before quoting
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">
              Compare the finished product.
            </span>{" "}
            Consider fit, customization, finish and delivery as well as the
            price of alternatives. Your calculated cost alone does not establish
            demand or what someone will pay.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Include the costs beyond plastic.
            </span>{" "}
            The example&apos;s $2.50 of material becomes a $10.89 entered-cost
            break-even after electricity, machine use, assumed failures and
            labor. Use your own inputs instead of a fixed multiple of filament cost.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Price the actual batch.
            </span>{" "}
            Several parts may share preparation and warmup, while finishing
            still takes time for each part. Enter the whole batch&apos;s material,
            duration and labor, then divide by the number of acceptable parts.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Separate machine time from labor.
            </span>{" "}
            Use print duration for the machine-cost input and actual work or
            required supervision for labor. Include design and cleanup work
            where it belongs, without counting the same work twice.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Check the final take-home amount.
            </span>{" "}
            Calculate the fees and other costs of the actual sales channel.
            Compare what remains with your complete costs and intended profit;
            no particular multiplier guarantees a sustainable sale.
          </li>
        </ol>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Where the inputs come from
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Start with your purchase records and sliced job. Calculate material
          cost with the{" "}
          <a
            href="/tools/filament-cost-calculator"
            className="underline underline-offset-4"
          >
            Filament Cost Calculator
          </a>
          , using total consumed grams without adding waste twice. For a detailed
          multi-color breakdown, use the{" "}
          <a href="/tools/ams-purge-waste-calculator" className="underline underline-offset-4">
            AMS Purge Waste Calculator
          </a>
          . Electricity comes from the{" "}
          <a
            href="/tools/electricity-cost-calculator"
            className="underline underline-offset-4"
          >
            Electricity Cost Calculator
          </a>
          . Record successful and failed attempts in the{" "}
          <a
            href="/tools/failure-rate-calculator"
            className="underline underline-offset-4"
          >
            Failure Rate Calculator
          </a>{" "}
          and enter your own purchase price, useful-life assumption and labor time.
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
