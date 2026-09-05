import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { SITE } from "@/lib/tools";
import { Calculator } from "./Calculator";

const TITLE = "3D Print Failure Rate Calculator: track your recorded attempts";
const DESCRIPTION = "Calculate the failure rate of your recorded prints and estimate material consumed by failed attempts. Track comparable jobs without unsupported industry benchmarks.";
export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: `${SITE.url}/tools/failure-rate-calculator` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE.url}/tools/failure-rate-calculator`, type: "website" },
};

const FAQ = [
  { q: "What counts as a failed print?", a: "Choose a rule before counting and apply it consistently. For example, count an attempt as failed if it did not produce a usable part and needed a reprint. Decide whether you are tracking individual parts or whole plates. Record partial successes separately if a simple success/failure label would hide useful information." },
  { q: "What is a good failure rate?", a: "This tool has no verified industry benchmark. Compare similar jobs on your own printer and consider the consequences of each failure. A rate alone cannot distinguish experimental prints from repeated production jobs or diagnose the cause." },
  { q: "How should I track this?", a: "Record one row per attempt with its date, model, material, settings, outcome and material consumed if it failed. Count a consistent period or comparable batch. Keep the number of attempts beside the percentage so a small sample is not mistaken for a stable long-term rate." },
  { q: "Does this include multi-color swap failures?", a: "Yes. If a material change causes an attempt to fail under your chosen definition, include it. Normal flushing during a successful print is a separate material cost. The AMS purge waste calculator handles model, support, flushing and tower totals." },
  { q: "What does zero percent mean?", a: "Zero failures among one or more recorded attempts is a valid observed rate of 0%. It does not guarantee future prints will succeed. Zero recorded attempts is different: there is no observed failure rate yet." },
  { q: "Which material weight should I enter?", a: "Use average grams actually consumed by a failed attempt, including discarded supports or purge if you want them included in the estimate. Entering the intended full-print weight assumes every failure consumes that entire amount. Successful prints' ordinary material use is excluded from this failure-waste result." },
];

export default function FailureRatePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", name: "3D Print Failure Rate Calculator", applicationCategory: "UtilityApplication", operatingSystem: "Any (web)", url: `${SITE.url}/tools/failure-rate-calculator`, description: DESCRIPTION, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      { "@type": "FAQPage", mainEntity: FAQ.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
    ],
  };
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mb-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl"><Highlight3D>Print Failure Rate Calculator</Highlight3D></h1>
        <p className="mt-2 text-muted-foreground">See the share of your recorded attempts that failed, and estimate the filament those attempts consumed. Compare consistent records over time.</p>
      </header>
      <AdSlot slot="top" className="mb-6" />
      <Suspense fallback={<div className="h-[400px]" />}><Calculator /></Suspense>
      <AffiliatePicks pagePath="/tools/failure-rate-calculator" className="mx-auto mt-8 max-w-3xl" />

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">What the result tells you</h2>
        <p className="text-sm leading-6 text-muted-foreground">Failure rate is failed attempts divided by all recorded attempts. It describes this sample. For example, one failure in ten attempts and ten failures in one hundred attempts both give 10%, but the sample sizes differ.</p>
        <p className="text-sm leading-6 text-muted-foreground">Zero failures in a recorded batch means an observed rate of 0%. With no attempts, there is no rate to calculate. Neither case establishes the probability of success for the next print.</p>
        <p className="text-sm leading-6 text-muted-foreground">Compare like with like: changing the model mix, material, printer or definition of failure can change the rate. A rise is a reason to inspect the records, not proof of a particular fault.</p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">The material-cost calculation</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">failure_percent = failed / (successful + failed) × 100<br />wasted_g = failed × average_g_consumed_per_failure<br />wasted_cost = wasted_g / 1000 × price_per_kg</p>
        <p className="text-sm leading-6 text-muted-foreground">Illustrative record: nine successful attempts and one failed attempt. The observed failure rate is 10%. If that failure consumed 50 g at $20/kg, its material cost was $1.00.</p>
        <p className="text-sm leading-6 text-muted-foreground">A failure stopped after the first layer may consume much less than the intended complete print. Use measured or recorded failed-attempt consumption when available. Labor, electricity and machine time are excluded from this material-cost result.</p>
        <p className="text-sm leading-6 text-muted-foreground">For normal multi-color consumption, use the <Link href="/tools/ams-purge-waste-calculator" className="text-primary underline underline-offset-4">AMS purge waste calculator</Link>. Count the same discarded material only once when combining totals.</p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Planning prompts, not industry benchmarks</h2>
        <p className="text-sm leading-6 text-muted-foreground">The display uses four descriptive ranges. They do not identify a printer fault or claim how hobbyists and print farms perform. Use them as prompts for reviewing your own record.</p>
        <ul className="list-disc pl-5 space-y-2 text-sm leading-6 text-muted-foreground">
          <li><span className="font-medium text-foreground">Under 5%.</span> Keep recording the number of attempts and the reasons for any failures.</li>
          <li><span className="font-medium text-foreground">5% to under 10%.</span> Check whether failures repeat on the same model or settings.</li>
          <li><span className="font-medium text-foreground">10% to under 20%.</span> Compare a consistent batch and identify which failed attempts consumed the most time or material.</li>
          <li><span className="font-medium text-foreground">20% or more.</span> Review the failures before using the current rate to plan a larger batch.</li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">A costly failure can justify attention at any percentage. If you find a repeatable problem, use the printer or slicer manufacturer&apos;s troubleshooting instructions and change one relevant setting at a time.</p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Estimating repeat-attempt cost</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">expected_attempts_per_success = 1 / (1 − failure_probability)</p>
        <p className="text-sm leading-6 text-muted-foreground">This separate planning model assumes independent attempts with a constant failure probability. At 10%, it gives about 1.111 attempts per success. At 25%, it gives about 1.333. Applying those multipliers to full-print cost also assumes a failed attempt costs as much as a successful one.</p>
        <p className="text-sm leading-6 text-muted-foreground">For an illustrative 8% failure probability and 200 g consumed per attempt, expected consumption per success is 200 / 0.92 = 217.39 g, or $4.78 at $22/kg. This is an expectation under the assumptions, not a guaranteed amount or a measurement of your past waste. At 100% failure probability there is no finite successful-print estimate.</p>
        <p className="text-sm leading-6 text-muted-foreground">The <Link href="/tools/print-pricing-calculator" className="text-primary underline underline-offset-4">print pricing calculator</Link> applies that full-attempt production-cost assumption and adds your entered labor separately.</p>
      </section>
      <AdSlot slot="inline" className="mx-auto my-10 max-w-3xl" />
      <section className="mx-auto max-w-3xl space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Frequently asked</h2>
        <dl className="space-y-4">{FAQ.map((item) => <div key={item.q} className="space-y-1"><dt className="font-medium text-foreground">{item.q}</dt><dd className="text-sm leading-6 text-muted-foreground">{item.a}</dd></div>)}</dl>
      </section>
      <RelatedContent pagePath="/tools/failure-rate-calculator" className="mx-auto mt-10 max-w-3xl" />
    </div>
  );
}
