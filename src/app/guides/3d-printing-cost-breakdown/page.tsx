import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AdSlot } from "@/components/shared/AdSlot";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { AuthorBio } from "@/components/shared/AuthorBio";
import { AuthorByline } from "@/components/shared/AuthorByline";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { AUTHOR_JSONLD } from "@/lib/author";
import { getGuide } from "@/lib/guides";
import { SITE } from "@/lib/tools";

const SLUG = "3d-printing-cost-breakdown";
const guide = getGuide(SLUG)!;
const UPDATED_AT = "2026-09-05";

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
    modifiedTime: UPDATED_AT,
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "What's the biggest hidden cost people miss?",
    a: "Their own time. If you spend 10 minutes setting up a print and 5 minutes cleaning up after it, and you value your time at even $15/hour, that's $3.75 per print before any material cost. For small prints, your time can cost more than the filament.",
  },
  {
    q: "Is 3D printing cheaper than buying the same thing on Amazon?",
    a: "Compare the delivered price of a suitable product with your own material, machine and labor costs. A custom fit, an unavailable replacement part or quick design changes can make printing useful even when it is not the cheapest option. There is no fixed saving that applies to every model.",
  },
  {
    q: "Does infill percentage change the cost much?",
    a: "More infill can increase material and print time, but halving the infill percentage does not halve total filament: walls, top and bottom layers, supports and other structures remain. Slice both settings and compare total grams. Choose walls, orientation and infill for the part's actual requirements.",
  },
  {
    q: "What about multi-color prints?",
    a: "Use final slicer totals for the useful model, supports, discarded flushing and tower. The amount varies by model, transitions and profile; there is no universal grams-per-change default. Count each gram once, including any startup material, and use the AMS waste calculator to compare consumption and cost.",
  },
  {
    q: "How do I price a print I'm selling on Etsy?",
    a: "Start with material, electricity, machine wear, expected failures and labor. Add packaging, finishing supplies, applicable selling fees and your intended profit. A fixed 3x multiplier does not guarantee those costs are covered. The pricing calculator provides a starting estimate; compare that with what buyers will pay for the particular product.",
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
        dateModified: UPDATED_AT,
        author: AUTHOR_JSONLD,
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
        <AuthorByline updatedLabel="Reviewed September 5, 2026 (UTC)" />
      </header>

      <figure className="my-8">
        <Image
          src="/images/guides/printing-materials.jpg"
          alt="Assorted 3D printing materials and filaments on display"
          width={1600}
          height={1067}
          className="w-full h-auto rounded-lg object-cover max-h-96"
          priority
        />
        <figcaption className="mt-2 text-xs text-muted-foreground">
          Filament is one component of a print&apos;s total cost. Photo via{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:3D_Printing_Materials_(16863368275).jpg"
            className="underline"
            rel="noreferrer"
          >
            Wikimedia Commons
          </a>
          .
        </figcaption>
      </figure>

      <AdSlot slot="top" className="my-8" />

      <AffiliatePicks pagePath={`/guides/${SLUG}`} className="my-8" />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-5 text-sm leading-7">
        <p>
          A slicer&apos;s filament cost is a useful start, but it does not cover
          every cost of a finished print. Material, electricity, failed attempts,
          machine wear and hands-on time answer different parts of the question.
        </p>

        <p>
          All prices, power figures, failure rates and printer lifetimes below
          are illustrative assumptions, not current product quotes or measured
          industry averages. Replace them with your purchase records, utility
          rate and printing history. Calculations were reviewed September 5,
          2026 UTC (September 4 Pacific).
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          The five costs that matter
        </h2>
        <ol className="list-decimal pl-5 space-y-1 marker:text-primary font-medium">
          <li>Filament</li>
          <li>Electricity</li>
          <li>Failure waste (prints that don't complete)</li>
          <li>Printer wear and amortization</li>
          <li>Your time</li>
        </ol>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          1. Filament
        </h2>
        <p>
          Convert the spool price to a cost per kilogram, then multiply by the
          grams consumed divided by 1,000. Add a waste allowance only for material
          missing from the input. Final slicer totals may already include supports,
          brims, flushing and other structures.
        </p>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          cost = (grams / 1000) × price_per_kg × (1 + waste_factor)
        </p>
        <p>
          Example: a 20 g model at $20/kg, with an assumed additional 5% of
          material not already counted, costs $0.42. A 300 g model under the
          same assumptions costs $6.30. These weights are examples, not promises
          for a particular downloaded model.
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
          For multi-color prints, use the actual sliced flushing and tower
          totals instead of a fixed grams-per-swap assumption. The{" "}
          <Link href="/guides/multi-color-printing-ams-worth-it" className="underline underline-offset-4">
            AMS cost guide
          </Link>{" "}
          explains the categories and how to avoid counting redirected flushing twice.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          2. Electricity
        </h2>
        <p>
          Electricity cost is average watts ÷ 1,000 × hours × your price per kWh.
          For example, a measured average of 115 W for 12 hours at an assumed
          $0.18/kWh gives 1.38 kWh and $0.2484, or about $0.25. This is an
          example, not a named printer benchmark or a national-average rate.
        </p>
        <p>
          Use measured average power for a representative job; a power-supply
          rating is not the draw throughout a print. The{" "}
          <Link
            href="/tools/electricity-cost-calculator"
            className="underline underline-offset-4"
          >
            Electricity Cost Calculator
          </Link>{" "}
          lets you substitute your own wattage, duration and utility rate.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          3. Failed attempts
        </h2>
        <p>
          Record successful and failed attempts instead of assuming a universal
          failure rate. A failure consumes some filament, electricity and machine
          time; an early failure usually costs less than one near completion.
        </p>
        <p>
          The pricing calculator divides material + electricity + machine wear
          by (1 − failure rate). This assumes each failed attempt costs a complete
          print&apos;s production cost. At 10% failures, that is division by 0.9,
          or about 11.1% extra production cost per success. Labor is added separately.
          If failures happen early, use your actual lost material and time to refine the estimate.
          The{" "}
          <Link
            href="/tools/failure-rate-calculator"
            className="underline underline-offset-4"
          >
            Failure Rate Calculator
          </Link>{" "}
          tracks your observed rate and estimates discarded material from your
          average grams actually consumed by a failed attempt.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          4. Machine cost
        </h2>
        <p>
          Allocating the purchase price across useful printing hours helps you
          include eventual replacement in a selling price. It is an accounting
          assumption for your own setup, not a prediction of when a printer will fail.
        </p>
        <p>
          Example: an assumed $700 printer spread over 2,000 useful hours gives
          $0.35/hour, or $2.80 for an eight-hour print. These inputs deliberately
          differ from the calculator&apos;s editable example defaults; neither is
          a universal lifetime. This purchase-price allocation does not automatically
          pay for replacement nozzles, plates or repairs, so budget those separately
          where relevant without charging the same item twice.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          5. Your time (the cost people really miss)
        </h2>
        <p>
          Record hands-on preparation and finishing time separately from machine
          runtime. For example, five minutes preparing a job plus five to ten
          minutes cleaning up is ten to fifteen minutes of labor. At an assumed
          $15/hour, that costs $2.50 to $3.75.
        </p>
        <p>
          For prints you're selling, this needs to be in your price. For
          prints for yourself, call it a hobby cost. Either way, it's real.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Worked example: a 100g phone case
        </h2>
        <p>
          An illustrative 100 g useful part taking eight hours. Assume $20/kg
          filament, 5% additional material not included in that 100 g, 95 W average
          draw, $0.18/kWh, a $700 machine over 2,000 hours, and 15 minutes of labor
          at $15/hour. The assumed 7% failure rate uses the full-production-cost model above.
        </p>
        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
          <li>Filament: $2.10 (100g × $20/kg × 1.05 waste)</li>
          <li>Electricity: $0.14 (95W × 8h at $0.18/kWh)</li>
          <li>Printer wear: $2.80 (8h × $0.35/h)</li>
          <li>Production subtotal: $5.0368 before failures</li>
          <li>Failure allowance: $0.38 ($5.0368 ÷ 0.93 − $5.0368)</li>
          <li>Your time: $3.75 (15 min at $15/h)</li>
          <li className="font-semibold">Total: $9.17 ($5.0368 ÷ 0.93 + $3.75, rounded)</li>
        </ul>
        <p>
          This $9.17 is the example&apos;s estimated cost before packaging,
          selling fees, extra finishing supplies and profit. It does not imply
          a market price. Use the{" "}
          <Link href="/tools/print-pricing-calculator" className="underline underline-offset-4">
            print pricing calculator
          </Link>{" "}
          with these inputs or your own costs, then account for any charges it does not include.
        </p>
        <p>
          For a successful attempt, filament plus electricity alone is $2.2368,
          or $2.24. Spreading those two costs across successes with the same
          assumed 7% full-cost failure rate gives about $2.41. Those figures
          exclude your time and future machine expenses; they do not make those
          expenses disappear.
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

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Sources and references
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-xs leading-6 marker:text-primary">
          <li>
            Prusa Research,{" "}
            <a
              href="https://blog.prusa3d.com/3d-printing-price-calculator_38905/"
              className="underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              3D printing price calculator
            </a>{" "}
            (separate material, electricity, labor and machine-cost inputs).
          </li>
          <li>
            Bambu Lab,{" "}
            <a
              href="https://github.com/bambulab/BambuStudio/blob/master/resources/web/flush/WipingDialog.html"
              className="underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Bambu Studio flushing-volume interface
            </a>{" "}
            (volume units and multiplier behavior; not a universal grams-per-swap default).
          </li>
          <li>
            All worked numbers on this page are transparent examples. See our{" "}
            <Link href="/methodology" className="underline underline-offset-4">
              calculation methodology
            </Link>{" "}
            for assumptions and limits.
          </li>
        </ul>
      </div>

      <AuthorBio />

      <RelatedContent pagePath={`/guides/${SLUG}`} className="mt-8" />

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
