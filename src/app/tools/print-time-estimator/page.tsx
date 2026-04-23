import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { SITE } from "@/lib/tools";

import { Calculator } from "./Calculator";

const TITLE = "3D Print Time Estimator: ballpark hours from filament weight";
const DESCRIPTION =
  "Quick 3D print time estimate from filament weight and printer class. Free, instant, no sign-up. Works for Bambu, Prusa, Ender, and custom Klipper builds.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE.url}/tools/print-time-estimator`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/tools/print-time-estimator`,
    type: "website",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "How accurate is this compared to a slicer?",
    a: "Not as accurate. Slicers simulate every move at the actual speeds you've configured, so they're the authoritative source. This calculator gives a rough hours-to-print estimate from weight, useful before you've sliced a file or when you just want to know if a print will finish before bed.",
  },
  {
    q: "What does 'throughput' mean?",
    a: "Grams of filament your printer extrudes per hour during normal printing. A Bambu X1C averages around 30 g/hr. An Ender 3 at stock settings is closer to 10 g/hr. Klipper-tuned fast builds can push 40+ g/hr.",
  },
  {
    q: "Why is my print so much slower than this estimate?",
    a: "Throughput varies hugely with print settings. Fine detail at 0.1mm layers with 80% infill can halve the throughput. Sparse gyroid infill with 0.28mm layers speeds it up. Supports add time without adding much filament. Travel moves also cost time. Check your slicer.",
  },
  {
    q: "Is this throughput number the same as volumetric flow?",
    a: "Close but not identical. Volumetric flow (mm³/s) is what limits your printer at the hotend. Throughput in g/hr already accounts for filament density and typical infill patterns. For most users, g/hr is the more practical number.",
  },
  {
    q: "Do multi-color prints take longer?",
    a: "Yes, significantly. Bambu AMS color swaps add 30 to 90 seconds each plus purge filament. A print with 50 color swaps adds roughly 30 to 75 minutes on top of the base time this calculator estimates. The dedicated AMS calculator ships in a later update.",
  },
];

export default function PrintTimeEstimatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "3D Print Time Estimator",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any (web)",
        url: `${SITE.url}/tools/print-time-estimator`,
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
          <Highlight3D>3D Print Time Estimator</Highlight3D>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Ballpark how long a print will take from filament weight and printer
          class. This is a rough guide. Your slicer is always the authoritative
          source, but sometimes you just want a number before you slice.
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
          Different printers extrude filament at different rates. A fast
          CoreXY like the Bambu X1C averages around 30 grams per hour at
          typical settings. An older Ender 3 at stock speeds is closer to 10
          g/hr. Divide your filament weight by throughput and you get a
          rough hours-to-print estimate.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Why this is rough: throughput depends on layer height, infill,
          speed profiles, and whether your print has a lot of small detail
          or long flat walls. Slicers simulate every move and can tell you
          the actual expected time for a specific file. Use them for
          precise answers.
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

      <AdSlot slot="inline" className="mx-auto mt-10 max-w-3xl" />
    </div>
  );
}
