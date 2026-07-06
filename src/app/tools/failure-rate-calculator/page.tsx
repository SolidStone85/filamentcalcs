import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { Highlight3D } from "@/components/shared/Highlight3D";
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
          <Highlight3D>Print Failure Rate Calculator</Highlight3D>
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

      <AffiliatePicks pagePath="/tools/failure-rate-calculator" className="mx-auto mt-8 max-w-3xl" />

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
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

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          The math behind the cost number
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Failure rate by itself is just a number. The interesting part is
          what it&apos;s actually costing you. Two formulas:
        </p>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          failure_rate = failed_prints / total_prints
        </p>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          attempts_needed = 1 / (1 - failure_rate)
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          The second one is the hidden cost. At 10% failure rate, you need
          1.11 attempts on average for every one successful print. That
          means every successful print is carrying 11% extra material cost
          and 11% extra time on average. At 25% failure, you&apos;re paying
          for 1.33 attempts per success, meaning every "good" print
          effectively cost you 33% more than the calculator told you.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Worked example. Failure rate of 8%, 200 g print at $22/kg
          filament: each successful copy of that print effectively used
          200 / (1 - 0.08) = 217 g of material, costing $4.78 instead of
          the $4.40 the filament cost calculator would say.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          The 12 most common failure modes, ranked
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          When your failure rate creeps up, walk this list top to bottom.
          The top items account for most failures across community surveys.
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">First layer adhesion failure.</span>{" "}
            The single biggest cause. Bed level, bed cleanliness, first
            layer height, first layer temperature, and bed surface all
            contribute. Clean the bed with isopropyl alcohol, re-level.
          </li>
          <li>
            <span className="font-medium text-foreground">Detachment mid-print (warping).</span>{" "}
            Especially ABS, ASA, and large flat PETG parts. Enclosure helps,
            brim helps, slowing the cooling fan helps.
          </li>
          <li>
            <span className="font-medium text-foreground">Layer shifts.</span>{" "}
            Belt tension, motor current, sudden moves. More common on belt
            printers running fast.
          </li>
          <li>
            <span className="font-medium text-foreground">Spaghetti from wet filament.</span>{" "}
            Bubbles in the nozzle make extrusion unreliable. Dry the filament.
          </li>
          <li>
            <span className="font-medium text-foreground">Clogged nozzle.</span>{" "}
            Slow extrusion, under-extrusion patterns, missed layers. Cold
            pull or replace nozzle.
          </li>
          <li>
            <span className="font-medium text-foreground">Bridging or overhang failure.</span>{" "}
            Model issue or cooling issue. Slow first bridge layer to 30%
            speed.
          </li>
          <li>
            <span className="font-medium text-foreground">Support detachment.</span>{" "}
            Often happens on tall thin supports. Increase support density or
            switch to tree supports.
          </li>
          <li>
            <span className="font-medium text-foreground">Filament tangle.</span>{" "}
            Extruder pulls until something snaps. Inspect spools when
            mounting.
          </li>
          <li>
            <span className="font-medium text-foreground">Power loss.</span>{" "}
            Some printers can resume, many cannot. UPS for long expensive
            prints if power is unstable.
          </li>
          <li>
            <span className="font-medium text-foreground">Slicer settings wrong.</span>{" "}
            Wrong filament profile, wrong nozzle size in slicer vs printer.
            Always verify before hitting print.
          </li>
          <li>
            <span className="font-medium text-foreground">AMS feed jam.</span>{" "}
            Filament binds in the bowden tube during a swap. Clean the AMS,
            check filament diameter consistency.
          </li>
          <li>
            <span className="font-medium text-foreground">Extruder gear slipping.</span>{" "}
            Worn gear, weak spring, or material too soft (TPU). Tighten or
            replace.
          </li>
        </ol>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          What different failure rates actually mean
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">0 to 4%.</span>{" "}
            Excellent. You&apos;ve dialed your printer in and you&apos;re
            printing things you have experience with. This is the realistic
            ceiling for hobbyists.
          </li>
          <li>
            <span className="font-medium text-foreground">5 to 10%.</span>{" "}
            Normal. Most hobbyists live here. Mostly clean prints with the
            occasional bed adhesion or filament issue.
          </li>
          <li>
            <span className="font-medium text-foreground">10 to 20%.</span>{" "}
            Something specific is off. Usually filament moisture, bed
            adhesion, or a calibration drift. Walk the failure mode list
            above.
          </li>
          <li>
            <span className="font-medium text-foreground">20 to 35%.</span>{" "}
            Mechanical or systemic issue. Belt tension, hotend, extruder,
            firmware bug, or you&apos;re pushing the printer way past its
            tuned envelope.
          </li>
          <li>
            <span className="font-medium text-foreground">Over 35%.</span>{" "}
            Stop printing and troubleshoot. You&apos;re burning filament for
            no reason.
          </li>
        </ul>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          The print farm benchmark
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Commercial print farms track failure obsessively because every
          point of failure rate compounds across hundreds of prints per
          week. Real numbers:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm leading-6 text-muted-foreground">
          <li>
            Top-tier production print farm: 1 to 3% failure rate
          </li>
          <li>
            Etsy seller print farm: 3 to 7% failure rate
          </li>
          <li>
            Hobbyist with experience and dialed printer: 4 to 8%
          </li>
          <li>
            Average hobbyist: 8 to 15%
          </li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">
          If you&apos;re selling prints, every percent of failure rate is
          margin you&apos;re leaving on the table. Worth investing time in
          tuning before you scale up.
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

      <RelatedContent pagePath="/tools/failure-rate-calculator" className="mx-auto mt-10 max-w-3xl" />

      <AdSlot slot="inline" className="mx-auto mt-10 max-w-3xl" />
    </div>
  );
}
