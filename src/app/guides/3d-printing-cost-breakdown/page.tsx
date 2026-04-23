import type { Metadata } from "next";
import Link from "next/link";

import { AdSlot } from "@/components/shared/AdSlot";
import { getGuide } from "@/lib/guides";
import { SITE } from "@/lib/tools";

const SLUG = "3d-printing-cost-breakdown";
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
    q: "What's the biggest hidden cost people miss?",
    a: "Their own time. If you spend 10 minutes setting up a print and 5 minutes cleaning up after it, and you value your time at even $15/hour, that's $3.75 per print before any material cost. For small prints, your time can cost more than the filament.",
  },
  {
    q: "Is 3D printing cheaper than buying the same thing on Amazon?",
    a: "Almost always no, for anything mass-produced. A plastic phone case on Amazon is $10 including shipping. Printing one yourself runs $5 to $15 when you count everything honestly. The win is custom parts, parts nobody sells, or parts you can iterate on quickly. It's rarely about saving money.",
  },
  {
    q: "Does infill percentage change the cost much?",
    a: "Yes, linearly with material. 20% infill uses roughly half the filament of 40% infill on the same model. For most display parts, 10 to 15% is fine. Functional parts that need to hold weight can justify 30 to 50%.",
  },
  {
    q: "What about multi-color prints?",
    a: "Multi-color adds a surprising amount. Bambu's AMS purges 5 to 15 grams of filament per color swap, and prints with dozens of swaps can easily waste half the filament on purge. For a two-color phone case with 40 swaps, you might use 30g on the part and another 200g on purge. The dedicated AMS waste calculator handles this specifically.",
  },
  {
    q: "How do I price a print I'm selling on Etsy?",
    a: "A rough formula that works: (filament cost + electricity) x 3 + your time at a fair hourly rate. The 3x multiplier covers printer wear, failure amortization, post-processing supplies, and a small margin. Then compare to what similar items sell for and adjust. If your number is way above market, your cost structure is off.",
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
        <p className="text-sm text-muted-foreground">
          Updated April 2026
        </p>
      </header>

      <AdSlot slot="top" className="my-8" />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-5 text-sm leading-7">
        <p>
          Most 3D printing cost estimates you find online are either wrong or
          incomplete. Manufacturer marketing talks about "prints for pennies."
          Doom-posters on Reddit lump in printer wear at $5 per print. The
          actual number, for most hobbyist prints, sits in between, and it's
          made up of five things most people ignore at least one of.
        </p>

        <p>
          I print on a Bambu P1S almost daily, and I've done the math enough
          times to have a stable picture of what a real print costs. This
          breakdown walks through each component, with the small numbers that
          add up, so you can stop guessing.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          The five costs that matter
        </h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Filament</li>
          <li>Electricity</li>
          <li>Failure waste (prints that don't complete)</li>
          <li>Printer wear and amortization</li>
          <li>Your time</li>
        </ol>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          1. Filament (the biggest cost, easy to calculate)
        </h2>
        <p>
          Filament is sold by the kilogram. Prints use grams. The math:
          convert grams to kg, multiply by price per kg, add a small waste
          factor for priming and skirts.
        </p>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          cost = (grams / 1000) × price_per_kg × (1 + waste_factor)
        </p>
        <p>
          Concrete example: a 3DBenchy at standard settings uses about 20
          grams of PLA. At $20 per kg with 5% waste, that's $0.42. An
          articulated dragon print at 300g on the same filament is $6.30.
          The{" "}
          <Link
            href="/tools/filament-cost-calculator"
            className="underline underline-offset-4"
          >
            Filament Cost Calculator
          </Link>{" "}
          handles this across the main material types.
        </p>
        <p>
          One caveat that catches people: multi-color prints waste filament
          on AMS purge. A two-color print with 40 color swaps at 8 grams per
          swap adds 320 grams of purge on top of the actual part weight.
          That's often more filament than the print itself.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          2. Electricity (almost nothing, most people get this wrong)
        </h2>
        <p>
          Hobbyists consistently overestimate electricity cost. A Bambu X1C
          averages around 115 watts during a print. At the US average
          electricity rate of $0.18 per kWh, a 12-hour print costs about 25
          cents. An Ender 3 at the same duration runs a bit higher because
          it's less efficient, roughly 27 cents.
        </p>
        <p>
          Electricity is small enough that it almost never changes a
          purchase decision. The{" "}
          <Link
            href="/tools/electricity-cost-calculator"
            className="underline underline-offset-4"
          >
            Electricity Cost Calculator
          </Link>{" "}
          covers the full range of printer classes and regional rates.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          3. Failure waste (small per print, real over time)
        </h2>
        <p>
          Even with a well-tuned printer, you'll lose prints. Community
          consensus for hobbyist failure rates sits around 5 to 10%. When
          something fails mid-print, the filament is gone, the time is gone,
          and you still paid the electricity.
        </p>
        <p>
          To amortize this across your print cost, figure out what fraction
          of prints fail and scale up all other costs by that fraction. A 10%
          failure rate means every successful print is effectively carrying
          about 11% extra cost (since you need ~1.11 attempts on average).
          The{" "}
          <Link
            href="/tools/failure-rate-calculator"
            className="underline underline-offset-4"
          >
            Failure Rate Calculator
          </Link>{" "}
          tracks this and compares to benchmark bands.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          4. Printer wear (the controversial one)
        </h2>
        <p>
          This is where arguments happen on forums. Some people treat it as
          free (paid for the printer already, so ongoing cost is zero).
          Others amortize aggressively (full printer cost spread over
          expected lifetime hours).
        </p>
        <p>
          The honest middle ground: a $700 Bambu P1S used for roughly 2000
          hours before major parts need replacement amortizes to about
          $0.35 per hour of print time. An 8-hour print carries about $2.80
          of wear cost by this math. This covers typical wear parts: nozzles,
          hotends, belts, beds. Include it if you're pricing work for sale.
          Ignore it if you're printing for yourself and the printer is
          already paid off.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          5. Your time (the cost people really miss)
        </h2>
        <p>
          Every print takes some human time even if the printer runs
          unattended. Roughly 5 minutes to slice and send a file, another 5
          to 10 minutes to remove the print, clean the plate, and check the
          nozzle. If you value your time at $15 per hour, that's $1.25 to
          $2.50 per print in setup and cleanup alone.
        </p>
        <p>
          For prints you're selling, this needs to be in your price. For
          prints for yourself, call it a hobby cost. Either way, it's real.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Worked example: a 100g phone case
        </h2>
        <p>Standard PLA, 8-hour print on a Bambu P1S:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Filament: $2.10 (100g × $20/kg × 1.05 waste)</li>
          <li>Electricity: $0.14 (95W × 8h at $0.18/kWh)</li>
          <li>Failure waste amortized: $0.25 (7% typical failure rate)</li>
          <li>Printer wear: $2.80 (8h × $0.35/h)</li>
          <li>Your time: $3.75 (15 min at $15/h)</li>
          <li className="font-semibold">Total: about $9.05</li>
        </ul>
        <p>
          If you're selling that phone case on Etsy, your price needs to
          clear $15 to $20 for it to be worth making. Below that and you're
          essentially subsidizing buyers with your time.
        </p>
        <p>
          If it's a case for yourself and you already own the printer? The
          honest out-of-pocket cost is closer to $2.50 (just filament and
          electricity). Everything else is sunk.
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
          Use the calculators mentioned above
        </p>
        <ul className="space-y-2">
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
              href="/tools/electricity-cost-calculator"
              className="underline underline-offset-4"
            >
              Electricity Cost Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/tools/failure-rate-calculator"
              className="underline underline-offset-4"
            >
              Failure Rate Calculator
            </Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}
