import type { Metadata } from "next";
import Link from "next/link";

import { AdSlot } from "@/components/shared/AdSlot";
import { getGuide } from "@/lib/guides";
import { SITE } from "@/lib/tools";

const SLUG = "3d-printer-electricity-usage";
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
    q: "Will a 3D printer add a lot to my power bill?",
    a: "Almost certainly not. At 100W average draw for 40 hours per week, that's 208 kWh per year. At US average rates, $37 per year. At expensive rates like California, $73. Compared to a refrigerator (400 kWh/year) or central AC (2000+ kWh/year), a 3D printer is a rounding error.",
  },
  {
    q: "Does leaving the printer on between prints cost much?",
    a: "No. Most modern printers idle at 5 to 15W (controller, screen, optional fans). At 10W idle for 24 hours, that's 0.24 kWh, about 4 cents at US average rates. Over a year of idling, maybe $15 to $25.",
  },
  {
    q: "What about a heated chamber?",
    a: "This is where draw gets meaningful. A heated chamber can pull 200 to 400W when active, and some run continuously. A chamber held at 40°C for a 12-hour print can easily double the total print energy. Budget accordingly if you have one.",
  },
  {
    q: "Are newer printers more efficient?",
    a: "Slightly. Modern printers like Bambu's lineup and Prusa's MK4 use silent steppers, better thermal insulation on the bed, and PID temperature control, which all reduce average draw. A 2020 Ender 3 averages around 125W during active printing. A 2024 Bambu P1S averages closer to 95W. Small improvement, real but not transformative.",
  },
  {
    q: "How do I measure my actual printer wattage?",
    a: "A Kill A Watt or similar wattage meter plugs into your outlet and reads real-time draw. Under $25 on Amazon, lasts forever, useful for measuring any appliance. Plug the printer into it, print something representative, check the kWh readout at the end.",
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
          One of the most common questions from new 3D printer owners is
          whether the hobby is going to spike their electric bill. The
          short answer is no. The long answer has some nuance around
          printer class, how often you print, and whether you run any
          accessories, but even at worst case, a hobby 3D printer is one of
          the cheapest things in your house to run.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Typical wattage by printer class
        </h2>
        <p>
          Power draw varies during a print. The bed heater pulls a lot when
          heating up and cycles on and off to maintain temperature. The
          hotend is similar, smaller draw. The motors, controller, and fans
          add a steady trickle.
        </p>
        <p>Average wattage during an active print:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Bambu X1C:</strong> 115W average, 250W peak during bed heatup</li>
          <li><strong>Bambu P1S:</strong> 95W average</li>
          <li><strong>Bambu A1 / Mini:</strong> 80 to 95W average (A1 Mini is lower)</li>
          <li><strong>Prusa MK4:</strong> 95W average, 200W peak</li>
          <li><strong>Creality Ender 3 (stock):</strong> 125W average</li>
          <li><strong>Creality K1 Max:</strong> 150W average (larger bed)</li>
          <li><strong>Voron 2.4 or custom CoreXY:</strong> 140 to 180W depending on build</li>
        </ul>
        <p>
          These numbers are the full-print average including bed and
          hotend heat cycles. Peak draw during bed preheat can double for
          the first few minutes.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          The math: hourly cost
        </h2>
        <p>
          Electricity is billed in kilowatt-hours (kWh). 1 kWh is 1000
          watts running for 1 hour. Math:
        </p>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          cost = (watts / 1000) × hours × rate_per_kWh
        </p>
        <p>
          Worked examples at the US average rate of $0.18 per kWh:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Bambu X1C, 12-hour print: (115/1000) × 12 × 0.18 = <strong>$0.25</strong></li>
          <li>Ender 3, 12-hour print: (125/1000) × 12 × 0.18 = <strong>$0.27</strong></li>
          <li>Prusa MK4, 5-hour print: (95/1000) × 5 × 0.18 = <strong>$0.09</strong></li>
        </ul>
        <p>
          The{" "}
          <Link
            href="/tools/electricity-cost-calculator"
            className="underline underline-offset-4"
          >
            Electricity Cost Calculator
          </Link>{" "}
          does this for any wattage, duration, and rate combination.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Regional rate variation matters more than printer choice
        </h2>
        <p>
          US electricity rates range roughly 3x between cheap and expensive
          states:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Louisiana, North Dakota, Washington: around $0.12/kWh</li>
          <li>Most of the US: $0.14 to $0.20/kWh</li>
          <li>California, Massachusetts, New York: $0.25 to $0.30/kWh</li>
          <li>Hawaii: $0.35 to $0.40/kWh</li>
        </ul>
        <p>
          Outside the US: EU averages around €0.27/kWh, UK similar at
          £0.27, Canada around C$0.17, Australia closer to A$0.32. Your
          actual rate is on your utility bill in the "supply" or "energy
          charge" line.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Annualized: what a real hobby costs
        </h2>
        <p>
          Typical hobbyist prints 20 to 40 hours per week. At 40 hours and
          100W average, that's 4 kWh per week, 208 kWh per year.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>At cheap US rates ($0.12/kWh): <strong>$25 per year</strong></li>
          <li>At US average ($0.18/kWh): <strong>$37 per year</strong></li>
          <li>At California rates ($0.30/kWh): <strong>$62 per year</strong></li>
        </ul>
        <p>
          For comparison, a refrigerator uses about 400 kWh per year. A
          window AC used a few hours per day in summer can hit 800 kWh.
          Even on California rates, the 3D printer is cheaper to run than
          an old fridge.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          When electricity does matter
        </h2>
        <p>
          Three scenarios where the cost adds up enough to notice:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Commercial print farm.</strong> 10 printers running 20 hours a day, 365 days a year, on California rates is $4,500/year. Material still dominates, but electricity becomes a line item worth tracking.</li>
          <li><strong>Heated enclosure or chamber.</strong> Holding a 40°C chamber can easily double the total per-print energy.</li>
          <li><strong>You're comparing total cost vs. buying prints.</strong> Even then, electricity is usually under 5% of the all-in per-print cost. Filament dominates.</li>
        </ul>

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
              href="/tools/electricity-cost-calculator"
              className="underline underline-offset-4"
            >
              Electricity Cost Calculator
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
