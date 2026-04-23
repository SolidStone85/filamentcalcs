import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { SITE } from "@/lib/tools";

import { Calculator } from "./Calculator";

const TITLE = "3D Print Failure Rate Calculator: track your success rate";
const DESCRIPTION =
  "Calculate your 3D print failure rate and compare it to hobbyist benchmarks. See how much filament and money you're losing to failed prints.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE.url}/tools/failure-rate-calculator`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/tools/failure-rate-calculator`,
    type: "website",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "What counts as a 'failed' print?",
    a: "Whatever you had to throw away or reprint. Complete detachments from the bed, spaghetti, failed supports, layer shifts, warping that ruined the part. Partial successes that you salvaged don't count as failures, but the wasted filament below the salvage point kinda does. Track it however feels honest.",
  },
  {
    q: "What's a good failure rate?",
    a: "Under 5% means your printer is well-tuned and you're printing things you have experience with. 5 to 10% is typical hobbyist territory. 10 to 20% suggests something's off (bed adhesion, filament moisture, first-layer calibration). Over 20% usually means a mechanical or calibration issue worth investigating.",
  },
  {
    q: "How do I actually track this?",
    a: "Simplest: a notes app or spreadsheet with one line per print, marked success or fail. Most slicers log print history. For a month, count them up and plug them in here.",
  },
  {
    q: "Does this include multi-color swap failures?",
    a: "Not specifically. If an AMS swap caused a clog and killed the print, count it as a failure. The dedicated AMS purge waste calculator covers the non-failure waste (intentional purge per swap) in a later update.",
  },
  {
    q: "Is 0% failure realistic?",
    a: "No. Even commercial print farms run at around 2 to 4% failure. Hobbyists aiming for 0% will drive themselves crazy. Aim for single digits consistently and call it a win.",
  },
];

export default function FailureRatePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "3D Print Failure Rate Calculator",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any (web)",
        url: `${SITE.url}/tools/failure-rate-calculator`,
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
          Print Failure Rate Calculator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track how often your prints fail, and see how much filament and
          money that costs. Compare your rate to hobbyist benchmarks so you
          know whether you have a tuning problem or you're doing fine.
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
          Failure rate is simply failed prints divided by total prints,
          expressed as a percent. The benchmark bands come from community
          consensus on forums and Discord servers: under 5% is excellent,
          5 to 10% is typical for hobbyists, 10 to 20% usually points at a
          specific tuning or hardware issue, and anything above 20% warrants
          serious investigation.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Tracking this month over month is more useful than a single
          snapshot. A spike after you changed filament brands tells you
          something. A steady 7% tells you to keep your process and move
          on with your life.
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
