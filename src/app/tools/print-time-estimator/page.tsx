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

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          The formula in detail
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          The math is straightforward:
        </p>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          hours = grams / throughput_g_per_hr
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Worked example. A vase that uses 240 grams of PLA on a Bambu P1S
          (typical throughput 28 g/hr): 240 / 28 = 8.57 hours, or roughly 8
          hours 35 minutes. The same vase on an Ender 3 V2 at stock speeds
          (10 g/hr): 24 hours. Same file, same filament, two and a half times
          longer because the printer is slower.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          The throughput numbers in this calculator come from community-aggregated
          data: print logs people post on Reddit, Bambu forums, and Klipper
          Discord. They represent typical real-world settings, not advertised
          maximums. Your specific machine can run slower (poor cooling, fine
          detail, slow profile) or faster (Klipper input shaping, lightweight
          toolhead, aggressive acceleration).
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          Throughput by printer class
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Reference numbers for the most common printer tiers, at default
          settings on PLA. Adjust down for tougher materials or fine detail.
        </p>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Printer class</th>
                <th className="px-3 py-2 text-left font-medium">Typical g/hr</th>
                <th className="px-3 py-2 text-left font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-2">Ender 3 (stock)</td>
                <td className="px-3 py-2">8 to 12</td>
                <td className="px-3 py-2">Bowden, slow accel, conservative speeds</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Ender 3 V3 KE</td>
                <td className="px-3 py-2">15 to 20</td>
                <td className="px-3 py-2">Klipper-based, faster than original</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Prusa MK4</td>
                <td className="px-3 py-2">20 to 28</td>
                <td className="px-3 py-2">Quality first, speed second</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Bambu A1 / A1 mini</td>
                <td className="px-3 py-2">22 to 30</td>
                <td className="px-3 py-2">Bedslinger but tuned for speed</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Bambu P1S</td>
                <td className="px-3 py-2">25 to 32</td>
                <td className="px-3 py-2">CoreXY, balanced quality and speed</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Bambu X1 Carbon</td>
                <td className="px-3 py-2">28 to 36</td>
                <td className="px-3 py-2">CoreXY, fast on PLA, slows down on engineering filaments</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Voron 2.4 (tuned)</td>
                <td className="px-3 py-2">35 to 50</td>
                <td className="px-3 py-2">Klipper, light toolhead, input shaping</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Resin printer (rough comparison)</td>
                <td className="px-3 py-2">N/A</td>
                <td className="px-3 py-2">Time depends on print height, not weight</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          What slows your print down
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Knowing why prints take longer than the slicer estimate helps you
          plan around it. The big factors:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Layer height.</span>{" "}
            Halving layer height roughly doubles print time. A part at 0.16mm
            layers takes about 1.5x longer than the same part at 0.24mm.
          </li>
          <li>
            <span className="font-medium text-foreground">Infill density and pattern.</span>{" "}
            Going from 15% to 50% infill on the same part can add 30 to 50%
            print time. Gyroid is faster than honeycomb at the same density.
          </li>
          <li>
            <span className="font-medium text-foreground">Wall count.</span>{" "}
            Each extra perimeter adds outer-loop time at the slowest speed.
            Walls are usually printed slower than infill for surface quality.
          </li>
          <li>
            <span className="font-medium text-foreground">Supports and tree supports.</span>{" "}
            Tree supports use less filament than grid but often take more
            time to print because of all the small features.
          </li>
          <li>
            <span className="font-medium text-foreground">Travel distances.</span>{" "}
            Lots of small islands across the bed means more travel time, even
            if total filament stays the same.
          </li>
          <li>
            <span className="font-medium text-foreground">Cooling.</span>{" "}
            Small layers (small parts at high detail) need cooling time. Your
            slicer adds minimum layer time to keep the part from melting.
          </li>
        </ul>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          Three quick examples
        </h2>

        <div className="rounded-md border p-4">
          <p className="text-sm font-medium text-primary">Quick 3DBenchy</p>
          <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-muted-foreground">
            <li>20 g of PLA on a Bambu A1 (26 g/hr typical)</li>
            <li>Math: 20 / 26 = 0.77 hours, about 46 minutes</li>
            <li>Reality: closer to 30 minutes on standard speed profile (small parts run faster than weight suggests)</li>
          </ul>
        </div>

        <div className="rounded-md border p-4">
          <p className="text-sm font-medium text-primary">Mid-size cosplay piece</p>
          <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-muted-foreground">
            <li>180 g of PLA on a Bambu P1S (28 g/hr typical)</li>
            <li>Math: 180 / 28 = 6.4 hours</li>
            <li>Reality: close to estimate if printed at standard quality</li>
          </ul>
        </div>

        <div className="rounded-md border p-4">
          <p className="text-sm font-medium text-primary">Articulated dragon (heavy supports)</p>
          <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-muted-foreground">
            <li>320 g of PLA on a Bambu P1S</li>
            <li>Math: 320 / 28 = 11.4 hours</li>
            <li>Reality: 13 to 15 hours because of tree supports and small joint detail</li>
          </ul>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          The estimator is closest to truth for medium prints with normal
          settings. Very small prints finish faster (less material per layer
          but layer count is what dominates time). Very detailed prints with
          heavy supports take longer.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          When to trust this estimate vs the slicer
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Use this calculator</span>{" "}
            when you don&apos;t have a sliced file yet. Browsing Printables and
            wondering if a 250 g model fits in your evening? Two-second
            answer.
          </li>
          <li>
            <span className="font-medium text-foreground">Use your slicer</span>{" "}
            when you&apos;re about to commit to the print. The slicer simulates
            every move at your actual speeds and gives a number that&apos;s
            usually within 5 to 10% of real time.
          </li>
          <li>
            <span className="font-medium text-foreground">Trust neither</span>{" "}
            for prints that are mostly supports, mostly small detail, or use
            non-standard speed profiles. Add 30% to whichever number you got.
          </li>
        </ul>
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
