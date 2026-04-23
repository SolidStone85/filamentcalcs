import type { Metadata } from "next";
import Link from "next/link";

import { AdSlot } from "@/components/shared/AdSlot";
import { getGuide } from "@/lib/guides";
import { SITE } from "@/lib/tools";

const SLUG = "3d-print-time-expectations";
const guide = getGuide(SLUG)!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: `${SITE.url}/guides/${SLUG}` },
  openGraph: {
    title: guide.title,
    description: guide.description,
    url: `${SITE.url}/guides/${SLUG}`,
    type: "article",
    publishedTime: guide.publishedAt,
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "Why is my slicer estimate often wrong?",
    a: "Slicers simulate the motion commands but can't perfectly predict acceleration, cooling waits, or first-layer slowdowns. Most slicers are optimistic by 10 to 20% on real-world prints. Bambu Studio tends to be closer than PrusaSlicer, which tends to be closer than Cura. If your estimate says 4 hours, budget 4.5.",
  },
  {
    q: "Is faster printing actually worse quality?",
    a: "Sometimes. Above certain speeds, the hotend can't melt filament fast enough (volumetric flow rate limit), layer lines get rougher, and overhangs sag. For most printers, 100 to 150 mm/s with standard PLA is the quality sweet spot. 300+ mm/s is doable on Bambu and Voron but expect visible differences.",
  },
  {
    q: "Does layer height really matter for print time?",
    a: "Huge difference. A print at 0.2mm layer height vs 0.1mm takes roughly half the time, with some loss of detail. 0.08mm or 0.06mm for miniatures can 3x or 4x print times. For most functional prints, 0.2mm is fine. For detailed figurines, 0.12mm is a good balance.",
  },
  {
    q: "Can I leave my printer running overnight?",
    a: "For modern printers with thermal runaway protection and decent build quality: generally yes. Bambu, Prusa, and modern Creality printers have safety features that will shut down on anomalies. Older or modded printers without thermal runaway protection: no, not worth the house fire risk.",
  },
  {
    q: "How long does the first layer take?",
    a: "Usually 5 to 15% of total print time even though it's just one layer. First layer prints at slower speed for adhesion, uses more time per mm of movement. For a 4-hour print, expect 15 to 30 minutes on layer 1 alone. This is a good thing. Rushed first layers fail.",
  },
];

export default function GuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        datePublished: guide.publishedAt,
        author: { "@type": "Organization", name: SITE.name },
        publisher: { "@type": "Organization", name: SITE.name },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/guides/${SLUG}` },
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
    <article className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Guide · {guide.readMinutes} min read
        </p>
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
          {guide.title}
        </h1>
        <p className="text-sm text-muted-foreground">Updated April 2026</p>
      </header>

      <AdSlot slot="top" className="my-8" />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-5 text-sm leading-7">
        <p>
          Print time is one of those numbers nobody can pin down exactly
          because it depends on everything: your printer, the filament,
          the layer height, speed, infill, geometry. But there are
          realistic ranges by printer class, and knowing them helps set
          expectations and plan your prints.
        </p>
        <p>
          The quickest useful number: <strong>grams per hour of
          throughput</strong>. This is how much filament your printer can
          reliably extrude in an hour at typical print settings. Divide
          your part weight by throughput and you get rough hours to print.
          For a more specific estimate, the{" "}
          <Link
            href="/tools/print-time-estimator"
            className="underline underline-offset-4"
          >
            Print Time Estimator
          </Link>{" "}
          has presets for common printer classes.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Throughput by printer class
        </h2>
        <p>Realistic g/hr averages for default quality settings:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Fast CoreXY (Bambu X1C, P1S):</strong> 28 to 35 g/hr</li>
          <li><strong>Modern bedslinger (Bambu A1, Prusa MK4):</strong> 18 to 25 g/hr</li>
          <li><strong>Legacy budget printer (Ender 3 stock, older Creality):</strong> 8 to 12 g/hr</li>
          <li><strong>Klipper-tuned custom builds:</strong> 35 to 50 g/hr</li>
          <li><strong>Ultra-fast custom (Voron V2.4 tuned, Rat Rig V-Core):</strong> 40 to 70 g/hr</li>
        </ul>
        <p>
          The gap between a stock Ender and a fast CoreXY is roughly 3x.
          That's the biggest single speed improvement you can get for
          money: a modern printer will print faster than upgrading a slow
          one can achieve in most cases.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Real-world examples
        </h2>
        <p>Actual prints with weight-based time estimates:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>3DBenchy (20g):</strong> Bambu X1C 35 min. Prusa MK4 60
            min. Ender 3 120 min.
          </li>
          <li>
            <strong>Articulated dragon (250g):</strong> Bambu X1C 8 hours.
            MK4 12 hours. Ender 3 24+ hours.
          </li>
          <li>
            <strong>Phone stand (60g):</strong> Bambu X1C 2 hours. Ender 3
            6 hours.
          </li>
          <li>
            <strong>Terrain tile (150g):</strong> Bambu X1C 5 hours. Ender
            3 13 hours.
          </li>
          <li>
            <strong>Functional replacement part (35g):</strong> Bambu X1C
            75 min. Ender 3 3 hours.
          </li>
        </ul>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          What makes prints slower than weight suggests
        </h2>
        <p>
          Throughput-based estimates assume a "normal" part shape and
          settings. Some things throw the estimate off:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Lots of travel moves.</strong> Multi-part prints with
            gaps between parts spend time moving without extruding.
          </li>
          <li>
            <strong>Fine detail at low layer heights.</strong> 0.06 to
            0.08mm layers cut throughput roughly 2x.
          </li>
          <li>
            <strong>High infill.</strong> 100% infill on a large part can
            double the print time vs 20% infill.
          </li>
          <li>
            <strong>Supports.</strong> Tree supports for figurines can add
            30 to 50% to print time.
          </li>
          <li>
            <strong>Small parts.</strong> Layer times under 15 seconds
            need minimum-layer-time slowdown, which cuts throughput to
            maybe 30% of max. A 3g miniature takes much longer per gram
            than a 300g dragon.
          </li>
          <li>
            <strong>Multi-color with AMS.</strong> Each color swap costs
            30 to 90 seconds plus purge time. A 40-swap print adds 20 to
            60 minutes on top of base time.
          </li>
        </ul>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Why your slicer's estimate isn't always right
        </h2>
        <p>
          Slicers predict print time by simulating the G-code move by
          move, applying your speed and acceleration settings. They're
          pretty good but imperfect because:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Acceleration estimation is hard. Real printers ramp up more
            slowly than slicers predict.
          </li>
          <li>
            Slicers don't know about real-world delays: bed levelling,
            nozzle wipe, filament loading, brief pauses during fan ramp-up.
          </li>
          <li>
            Volumetric flow limits cap speed on high-demand moves. Slicers
            sometimes underestimate.
          </li>
        </ul>
        <p>
          Rule of thumb: PrusaSlicer and OrcaSlicer are usually within 10%
          of actual. Cura tends to be 15 to 25% optimistic. Bambu Studio
          is usually within 5 to 10% on Bambu printers.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Planning overnight prints
        </h2>
        <p>
          Before you start an 11pm print, do the math: slicer estimate
          plus 20% buffer. If that runs past when you need the printer
          free, either start earlier or split the print. For multi-day
          prints, weigh the spool first (need enough filament) and watch
          for clog risk.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Frequently asked
        </h2>
        <dl className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="space-y-1">
              <dt className="font-medium">{item.q}</dt>
              <dd className="text-sm leading-7 text-muted-foreground">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <AdSlot slot="inline" className="my-10" />

      <nav className="mt-10 rounded-lg border p-5 text-sm">
        <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
          Related tools
        </p>
        <ul className="space-y-2">
          <li>
            <Link
              href="/tools/print-time-estimator"
              className="underline underline-offset-4"
            >
              Print Time Estimator
            </Link>
          </li>
          <li>
            <Link
              href="/tools/filament-cost-calculator"
              className="underline underline-offset-4"
            >
              Filament Cost Calculator
            </Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}
