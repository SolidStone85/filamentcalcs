import type { Metadata } from "next";
import Link from "next/link";

import { AdSlot } from "@/components/shared/AdSlot";
import { getGuide } from "@/lib/guides";
import { SITE } from "@/lib/tools";

const SLUG = "why-3d-prints-fail";
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
    q: "What failure rate is normal?",
    a: "Under 5% is excellent, 5 to 10% is typical hobbyist range, 10 to 20% means something is off and worth investigating, and over 20% usually points at a specific mechanical or calibration problem. Print farms run at 2 to 4%. 0% is not realistic and chasing it will drive you crazy.",
  },
  {
    q: "Why do prints sometimes fail halfway through but start fine?",
    a: "Usually layer adhesion or thermal problems. Warping pulls a corner up, nozzle catches it on the next pass, print shifts or fails. Inadequate cooling on PLA causes overhangs to droop. Mid-print power fluctuations. Or filament run-out on long prints. Check what layer number or what feature it failed on for a clue.",
  },
  {
    q: "Is it worth using a webcam to monitor prints?",
    a: "Yes, especially for prints over 4 hours. Bambu's built-in cameras on P1S and X1C are good. For other printers, an Octoprint plus a cheap USB webcam works. Catching a failure 20 minutes in instead of 6 hours in saves a lot of wasted filament.",
  },
  {
    q: "Does bed leveling matter as much as people say?",
    a: "Yes. First layer calibration is the single biggest factor in print success. Auto-bed-leveling helps but doesn't replace a properly trammed frame or a clean bed. Print a first-layer calibration square before committing to a long print on a freshly wiped bed.",
  },
  {
    q: "I'm getting failures after replacing a nozzle, why?",
    a: "New nozzles need to be re-calibrated. The exact length from the nozzle tip to the bed changed, so your z-offset is off. Run bed leveling and z-offset calibration before printing. Also check that the nozzle is torqued to the right spec (about 1.5 Nm, or firm hand-tight with a wrench when the hotend is at 250°C).",
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
          Print failures cluster around a dozen common causes. Most of what
          gets posted on Reddit as "why did this fail" is actually one of
          these twelve things, and each has a specific fix. Working through
          them in the order below (rough frequency, most common first) will
          resolve almost every hobbyist failure.
        </p>
        <p>
          Before starting: track your failure rate. If you don't know
          whether you're at 5% or 25% failure, you don't know if you have a
          problem. The{" "}
          <Link
            href="/tools/failure-rate-calculator"
            className="underline underline-offset-4"
          >
            Failure Rate Calculator
          </Link>{" "}
          helps with this and compares you to hobbyist benchmarks.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          1. Poor first layer adhesion
        </h2>
        <p>
          Most common failure by far. Print detaches partway or pulls up at
          a corner. Fixes, in order of likelihood to matter:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Clean the bed with isopropyl alcohol (IPA 70% or higher) or soap and water. Skin oils from handling kill adhesion.</li>
          <li>Recalibrate z-offset. Nozzle should lay filament with a slight squish, not air-printing and not bulldozing.</li>
          <li>Check bed temperature is correct for the material (60°C PLA, 70 to 80°C PETG).</li>
          <li>Brim or raft for tall, small-footprint prints.</li>
          <li>Glue stick or hairspray as a bed prep if the surface is worn.</li>
        </ul>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          2. Wet filament
        </h2>
        <p>
          Symptoms: popping sounds during printing, stringy prints, brittle
          finished parts, inconsistent extrusion. PETG and TPU absorb
          moisture fastest. PLA tolerates more but isn't immune.
        </p>
        <p>
          Fix: dry the filament in a filament dryer for 4 to 8 hours at the
          recommended temperature (40 to 50°C for PLA, 55 to 65°C for PETG,
          45°C for TPU). Store dry filament in airtight containers with
          silica gel packs.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          3. Clogged or partially clogged nozzle
        </h2>
        <p>
          Under-extrusion, thin layer lines, gaps in walls. Usually caused
          by burnt residue from older filament, dust, or carbon buildup.
        </p>
        <p>
          Fix: cold pull. Heat to printing temp, manually feed filament,
          cool to 90°C, pull out cleanly. Repeat until clean. If that
          fails, replace the nozzle (they cost $2 to $10 and last 200 to
          500 hours typically).
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          4. Warping (ABS especially)
        </h2>
        <p>
          Corners lift off the bed as the print cools. Common on ABS,
          occasional on PETG, rare on PLA.
        </p>
        <p>
          Fix: enclosure (the real fix for ABS), heated bed at correct
          temp, reduce part cooling fan on first few layers, brim or mouse
          ears on corners, slower print speeds for first layers. If you
          can't enclose, switch to PETG or PLA.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          5. Layer shift
        </h2>
        <p>
          Print suddenly skews mid-way. The printer lost steps on X or Y.
          Causes include: loose belts, something obstructing the head, too
          high speed and acceleration, or a mechanical collision.
        </p>
        <p>
          Fix: check belt tension (should twang like a guitar string),
          reduce speed or acceleration in slicer, inspect for anything
          catching on the print.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          6. Stringing and oozing
        </h2>
        <p>
          Thin hairs of filament between parts of the print. Common on
          PETG, occasional on PLA, common on TPU.
        </p>
        <p>
          Fix: slower travel moves, higher retraction distance (0.8 to 2mm
          for direct drive, 4 to 6mm for Bowden), slightly lower nozzle
          temp, combing enabled in slicer, dry the filament.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          7. Spaghetti (complete mid-print failure)
        </h2>
        <p>
          The print came off the bed, the nozzle kept extruding into air,
          you come back to a bird's nest. Usually the cascade failure of
          warping or poor bed adhesion.
        </p>
        <p>
          Fix: fix the underlying adhesion issue (#1). A webcam plus print
          monitoring catches this early and pauses the printer before you
          waste 6 hours of filament.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          8. Supports fail or fuse to the part
        </h2>
        <p>
          Overhangs sagging, supports that peel off and ruin the print, or
          supports that weld permanently to the part.
        </p>
        <p>
          Fix: increase support Z distance in slicer (0.2mm is a good
          start), use tree supports for complex overhangs, orient the
          model to minimize overhang area. For critical parts, print with
          two materials and use a water-soluble support material.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          9. Bridging failure
        </h2>
        <p>
          Long unsupported horizontal spans sagging. Usually means cooling
          is insufficient or bridging speed is too high.
        </p>
        <p>
          Fix: increase part cooling fan to 100% during bridges, reduce
          bridging speed to 30 to 50% of normal, increase bridge flow
          slightly if droopy.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          10. Elephant's foot
        </h2>
        <p>
          First layer bulges wider than the rest. Caused by nozzle too
          close to bed or bed too hot.
        </p>
        <p>
          Fix: raise z-offset slightly (~0.02 to 0.04mm), reduce bed temp
          for first layer, or use a small chamfer on bottom edges of the
          model.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          11. Filament run-out
        </h2>
        <p>
          Spool empties mid-print. Happens on prints over about 800g
          without filament run-out sensors.
        </p>
        <p>
          Fix: enable filament run-out sensor (most modern printers have
          one), weigh the spool before long prints, or split large prints
          into multiple files you start manually.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          12. Slicer setting mistakes
        </h2>
        <p>
          Wrong filament profile, wrong nozzle temp, wrong supports
          enabled, etc. The most embarrassing category because it's usually
          user error.
        </p>
        <p>
          Fix: slow down when slicing. Double-check filament type matches
          what's loaded, check print summary for obvious issues (2 hour
          print suddenly showing 20 hours means something is off), print
          the first 10 layers and verify before committing to the full
          print.
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
              href="/tools/failure-rate-calculator"
              className="underline underline-offset-4"
            >
              Failure Rate Calculator
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
