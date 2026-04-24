import type { Metadata } from "next";
import Link from "next/link";

import { AdSlot } from "@/components/shared/AdSlot";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { getGuide } from "@/lib/guides";
import { SITE } from "@/lib/tools";

const SLUG = "multi-color-printing-ams-worth-it";
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
    q: "How many grams does Bambu AMS actually waste per color swap?",
    a: "Default Bambu Studio settings flush around 8 grams per swap on an X1C or P1S. The A1 and A1 Mini tend toward 6 grams. Tuned profiles using the flush multiplier can drop to 4 to 5 grams, and aggressive defaults can push past 12 grams. The exact number is visible in Bambu Studio's flush data panel after slicing.",
  },
  {
    q: "Is AMS worth it for a single-color print?",
    a: "No. AMS adds zero value to single-color prints and costs around $350 on top of the printer. If you only print in one color 95% of the time, skip AMS and buy more filament variety. You can always swap colors between prints the old-fashioned way.",
  },
  {
    q: "What's the break-even point where AMS stops making sense?",
    a: "Purge waste above 50% of total filament usage is the typical break-even. At that point, the cost of the wasted material plus the slower print time starts outweighing the convenience. A 30 gram part with 40 color swaps at 8 grams per swap wastes 320 grams of purge (91% of total filament), which is almost never worth it. For that print, painting the single-color version is cheaper.",
  },
  {
    q: "Can you reduce purge waste without buying a poop chute or waste bucket?",
    a: "Yes, in slicer settings. Lower the flush multiplier (default 1.0, tuned users go 0.4 to 0.6). Use the flushing volumes matrix to set smaller purges for compatible color pairs (white to cream purges less than white to black). Group same-color features in your model to reduce swap count. These adjustments alone can cut purge by 30 to 50% on most prints.",
  },
  {
    q: "Does multi-color slow the print down?",
    a: "Yes, significantly. Each color swap on Bambu AMS adds roughly 30 to 45 seconds for purging, tool change, and wipe. A print with 40 swaps adds 20 to 30 minutes of pure swap time on top of the actual printing. For a 4-hour base print that becomes 4.5 hours. The time cost is real but rarely discussed.",
  },
  {
    q: "Is Prusa MMU or Mosaic Palette better than Bambu AMS for purge efficiency?",
    a: "All multi-material systems waste filament on color transitions. MMU2S and MMU3 purge roughly 15 to 25 grams per swap, which is worse per swap than Bambu AMS. Mosaic Palette uses transitioning in-line and measures waste in millimeters of filament rather than grams, but total waste per swap ends up comparable. No current multi-material system is dramatically more efficient. The physics are similar across all of them.",
  },
  {
    q: "Are there multi-color techniques that don't waste filament?",
    a: "Yes. Paint the print after. IDEX printers (dual independent extruders) can print two colors with zero purge when used with proper slicing. Multi-body prints paused mid-print for a filament swap add zero purge but you have to babysit it. The tradeoff is convenience versus waste.",
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
          <Highlight3D>{guide.title}</Highlight3D>
        </h1>
        <p className="text-sm text-muted-foreground">
          Updated April 2026
        </p>
      </header>

      <AdSlot slot="top" className="my-8" />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-5 text-sm leading-7">
        <p>
          Multi-color 3D printing is one of the most oversold features in the
          hobby. Marketing shows you a vibrant 4-color print and a happy
          owner. It doesn&apos;t show you the 320 grams of purge sitting in
          the waste bucket next to a 30 gram part. That purge is your
          filament. You paid for it. It went in the trash.
        </p>
        <p>
          Bambu&apos;s AMS, Prusa&apos;s MMU, and Mosaic&apos;s Palette all
          have the same fundamental problem: every color swap requires
          flushing the previous color out of the hotend before the next one
          comes through cleanly. The flushed material is waste. On prints
          with many color changes, waste dominates.
        </p>
        <p>
          This guide walks through the actual math, when multi-color is
          worth it, when it isn&apos;t, and what to do about the waste.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          How AMS actually works (the purge mechanic)
        </h2>
        <p>
          When an AMS or similar system changes from color A to color B, the
          existing color A sits inside the hotend. If the printer just
          continued printing, the first centimeter of the next color would
          be contaminated. So before the new color prints cleanly, the
          system flushes material through the nozzle until the color is
          pure.
        </p>
        <p>
          On a Bambu AMS, that flush material goes onto a purge tower
          (parallel structure printed alongside your model) or into a waste
          bucket. Either way, the filament leaves the system and never ends
          up in your actual part. It counts toward your spool usage and your
          filament bill.
        </p>
        <p>
          The default flush on a Bambu X1C or P1S is around 8 grams per
          swap. That means every time the printer changes colors, 8 grams
          of filament gets flushed to the purge tower. A 40-swap print
          wastes 320 grams. That&apos;s a third of a kilogram, which at $20
          per kg is $6.40 of filament for a single print.
        </p>
        <p>
          The{" "}
          <Link
            href="/tools/ams-purge-waste-calculator"
            className="underline underline-offset-4"
          >
            AMS Purge Waste Calculator
          </Link>{" "}
          computes this exactly based on your printer, swap count, part
          weight, and filament price.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          The real math, concrete numbers
        </h2>
        <p>
          Here&apos;s what multi-color actually costs compared to
          single-color across common print types. All figures use
          Bambu&apos;s default 8 grams per swap and $20 per kg PLA.
        </p>
        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
          <li>
            <strong>Small keychain (15g part, 8 swaps):</strong> 64g purge,
            $1.58 filament cost, purge is 81% of total material
          </li>
          <li>
            <strong>Phone case (100g part, 20 swaps):</strong> 160g purge,
            $5.20 filament cost, purge is 62% of total material
          </li>
          <li>
            <strong>Decorative figurine (200g part, 40 swaps):</strong> 320g
            purge, $10.40 filament cost, purge is 62% of total material
          </li>
          <li>
            <strong>Full cosplay helmet (800g part, 15 swaps):</strong> 120g
            purge, $18.40 filament cost, purge is only 13% of total material
          </li>
        </ul>
        <p>
          The pattern: <strong>small parts with many swaps are where AMS
          economics break down</strong>. Large parts with few swaps, where
          most of the filament actually goes into the model, are where AMS
          makes sense.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          When multi-color IS worth it
        </h2>
        <p>
          AMS and similar systems are worth the purge waste in specific
          cases:
        </p>
        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
          <li>
            <strong>Large prints with limited swaps.</strong> A 500g statue
            with 5 color regions wastes 40g on purge (8% overhead). That&apos;s
            fine.
          </li>
          <li>
            <strong>Functional multi-color that needs color
            accuracy.</strong> Logos on signage, color-coded parts, color
            gradients that can&apos;t be painted.
          </li>
          <li>
            <strong>One-off prototypes where time matters more than
            material.</strong> If you&apos;re iterating on a design for a
            client and need it done in two hours, the purge waste is cheaper
            than the time to paint.
          </li>
          <li>
            <strong>Text or detail that can&apos;t be painted.</strong>{" "}
            Fine-detail multi-color (tiny logos, embedded text) is almost
            impossible to paint accurately.
          </li>
        </ul>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          When multi-color is NOT worth it
        </h2>
        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
          <li>
            <strong>Small parts with many color changes.</strong> If purge
            exceeds 50% of total filament used, seriously consider painting
            or printing single-color.
          </li>
          <li>
            <strong>Prints for sale with thin margins.</strong> The purge
            cost eats into your margin hard. A $12 Etsy print with $8 of
            purge waste is not a business.
          </li>
          <li>
            <strong>Models where color regions are large and
            paintable.</strong> A simple 2-color figurine where both colors
            are in large contiguous areas paints faster than it prints
            multi-color.
          </li>
          <li>
            <strong>When print time matters.</strong> Multi-color adds
            roughly 30 to 45 seconds per swap. 40 swaps = 20 to 30 minutes
            of pure waiting time. Often more than the actual additional
            print time from the larger total filament volume.
          </li>
        </ul>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          How to reduce purge waste (without buying hardware)
        </h2>
        <p>
          Before accepting the default 8 grams per swap, try these in
          Bambu Studio (or your slicer of choice):
        </p>
        <ol className="list-decimal pl-5 space-y-1 marker:text-primary">
          <li>
            <strong>Lower the flush multiplier</strong> in the print settings.
            Default is 1.0. Dropping to 0.5 to 0.6 often works fine on most
            color combinations. Bambu&apos;s auto-tuned profiles go
            conservative for safety, not for efficiency.
          </li>
          <li>
            <strong>Use the flushing volumes matrix.</strong> Not all color
            transitions need the same purge. White to cream needs far less
            than white to black. The matrix lets you set per-pair purge
            values. Aggressive tuning cuts waste by 30 to 40%.
          </li>
          <li>
            <strong>Reduce swap count in the model.</strong> Group
            same-color features into contiguous layers. If your model has
            red dots scattered randomly across 40 layers, that&apos;s 40
            swaps. Redesign so all red dots are on 5 layers instead.
          </li>
          <li>
            <strong>Print multiple objects per plate.</strong> AMS swaps
            between plates, not between objects on the same plate. Printing
            4 copies of a 2-color phone case on one plate uses roughly the
            same purge as printing 1 copy.
          </li>
          <li>
            <strong>Skip the purge tower, use the waste bucket.</strong>{" "}
            The purge tower adds material and time to the print. The waste
            bucket collects flushed filament with less overhead.
          </li>
        </ol>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          Worked example: two phone cases compared
        </h2>
        <p>Both prints are 100g PLA phone cases, Bambu P1S, PLA at $20/kg.</p>
        <p>
          <strong>Case A: Single-color black phone case.</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
          <li>Filament: $2.10 (100g + 5% waste)</li>
          <li>No purge, no AMS swaps</li>
          <li>Print time: ~3h 15min</li>
          <li>Total material cost: $2.10</li>
        </ul>
        <p>
          <strong>Case B: Same shape, black case with white logo (30
          swaps default).</strong>
        </p>
        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
          <li>Part filament: $2.10 (100g)</li>
          <li>Purge: $5.04 (240g at 8g/swap)</li>
          <li>Print time: ~3h 45min (30 swaps × 45sec extra)</li>
          <li>Total material cost: $7.14</li>
        </ul>
        <p>
          Adding the logo tripled the material cost and added 30 minutes to
          the print. A sharpie outline would have added roughly 45 seconds
          and $0 in materials.
        </p>
        <p>
          This is not an argument against AMS. It&apos;s an argument for
          knowing what you&apos;re paying and deciding on purpose.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
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
          Calculators referenced in this guide
        </p>
        <ul className="space-y-2">
          <li>
            <Link
              href="/tools/ams-purge-waste-calculator"
              className="underline underline-offset-4"
            >
              AMS Purge Waste Calculator
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
          <li>
            <Link
              href="/tools/material-comparison"
              className="underline underline-offset-4"
            >
              Material Comparison
            </Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}
