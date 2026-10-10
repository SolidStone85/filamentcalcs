import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { EvidenceBadge } from "@/components/shared/EvidenceBadge";
import { SPOOL_BRAND_PAGES } from "@/lib/spoolBrands";
import { SITE } from "@/lib/tools";

import { Calculator } from "./Calculator";

// Calculator presets as shown on the brand pages, with their evidence.
const PRESET_ROWS = SPOOL_BRAND_PAGES.flatMap((page) =>
  page.weights
    .filter((row) => row.presetId)
    .map((row) => ({ page, row })),
);

const TITLE = "Remaining Filament Calculator: how much is left on your spool?";
const DESCRIPTION =
  "Free calculator to figure out how much filament is left on a spool from current scale weight. Includes empty spool presets for Bambu, Polymaker, eSun, Prusament, and others.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE.url}/tools/remaining-spool-calculator`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/tools/remaining-spool-calculator`,
    type: "website",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "Why does empty spool weight matter so much?",
    a: "If you assume the wrong empty spool weight, the calculation is off by exactly that amount in grams. A Polymaker cardboard spool is around 140 g, while a generic plastic spool can be 220 g or more. That's an 80 g swing, roughly a third of a small print. Use the right preset for your spool brand or weigh one empty spool of each type you keep around.",
  },
  {
    q: "How do I weigh the spool?",
    a: "Any kitchen scale that reads to the nearest gram works. Postal scales are also fine. Take the spool off the printer, set it on the scale, read the number. The spool side hub doesn't need to be removed.",
  },
  {
    q: "What if the calculator says I have more filament than the original spool weight?",
    a: "Check the current loaded weight, the matching empty-spool tare and the original net filament amount. A low tare, a high scale reading or an original-fill entry that is too small can each produce this result. The warning alone does not identify which input needs correcting.",
  },
  {
    q: "Will this work for non-1kg spools?",
    a: "Yes. Adjust 'Original filament weight' to match. Common alternatives: 250 g sample spools, 500 g half spools, 750 g spools (some Polymaker), 2 kg or 2.5 kg refill rolls.",
  },
  {
    q: "Can I use this to know when to reorder?",
    a: "Yes. Anything under 100 g remaining is essentially a one-print spool. If you're using that filament regularly, order before you hit 100 g so you're not waiting on shipping mid-project.",
  },
];

export default function RemainingSpoolCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Remaining Filament Calculator",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any (web)",
        url: `${SITE.url}/tools/remaining-spool-calculator`,
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
          <Highlight3D>Remaining Filament Calculator</Highlight3D>
        </h1>
        <p className="mt-2 text-muted-foreground">
          You weighed your spool on a scale. How much filament is actually
          left? Subtract the empty spool weight, get the remaining grams,
          and see whether it&apos;s enough for your next print or if
          it&apos;s time to reorder.
        </p>
      </header>

      <AdSlot slot="top" className="mb-6" />

      <Suspense fallback={<div className="h-[400px]" />}>
        <Calculator />
      </Suspense>

      <p className="mt-6 text-sm text-muted-foreground">
        Looking for one brand's numbers? Dedicated pages:{" "}
        <Link
          href="/spools/bambu-lab"
          className="text-primary underline underline-offset-4"
        >
          Bambu Lab
        </Link>
        ,{" "}
        <Link
          href="/spools/polymaker"
          className="text-primary underline underline-offset-4"
        >
          Polymaker
        </Link>
        ,{" "}
        <Link
          href="/spools/esun"
          className="text-primary underline underline-offset-4"
        >
          eSun
        </Link>
        ,{" "}
        <Link
          href="/spools/prusament"
          className="text-primary underline underline-offset-4"
        >
          Prusament
        </Link>
        .
      </p>

      <AffiliatePicks pagePath="/tools/remaining-spool-calculator" className="mx-auto mt-8 max-w-3xl" />

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          How this works
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          The math is one subtraction. Take what your scale reads, subtract
          the weight of the empty spool itself, and what&apos;s left is
          filament. Divide by the original spool weight and you get a
          percent remaining.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          The trick is knowing the empty spool weight. Spool weights vary
          surprisingly: a Bambu reusable spool with a refill core measured
          245 to 260 g, Polymaker specs its 1 kg cardboard spool at 140 g,
          and plastic spools from other brands commonly measure about 200 to
          265 g. The presets below cover common brands, each with its
          evidence, so you don&apos;t have to weigh an empty spool every time.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          The formula in detail
        </h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          remaining = current_total_weight - empty_spool_weight
        </p>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          percent = remaining / original_filament_weight × 100
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Worked example. You set a Polymaker spool on a kitchen scale and
          it reads 540 g. The empty Polymaker cardboard spool weighs about
          140 g. So remaining = 540 - 140 = 400 g. From a 1 kg spool,
          that&apos;s 400 / 1000 × 100 = 40% remaining. At $22/kg, the value
          remaining is 0.40 × 22 = $8.80.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Common empty spool weights
        </h2>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Spool</th>
                <th className="px-3 py-2 text-left font-medium">Empty weight (g)</th>
                <th className="px-3 py-2 text-left font-medium">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {PRESET_ROWS.map(({ page, row }) => (
                <tr key={row.presetId} className="border-b align-top">
                  <td className="px-3 py-2">
                    <Link href={`/spools/${page.slug}`} className="text-primary underline underline-offset-4">
                      {page.brand}
                    </Link>
                    <div className="text-muted-foreground">{row.variant}</div>
                  </td>
                  <td className="px-3 py-2 font-mono tabular-nums">{row.grams}</td>
                  <td className="px-3 py-2"><EvidenceBadge evidence={row.evidence} /></td>
                </tr>
              ))}
              <tr>
                <td className="px-3 py-2">Generic plastic spool</td>
                <td className="px-3 py-2 font-mono tabular-nums">220</td>
                <td className="px-3 py-2 text-muted-foreground">
                  Starting point only, not a measurement
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          The cleanest workflow: weigh one empty spool of each brand you
          use, write the number on the spool with a Sharpie, never have to
          guess again.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          When the result feels off
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">
              Calculator says you have more than the original weight.
            </span>{" "}
            Check all three inputs: current loaded weight, empty-spool tare
            and original net filament amount. The warning can result from
            more than one input; do not change a measured tare just to make
            the percentage fit.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Calculator says zero or negative.
            </span>{" "}
            Either the spool really is empty, or the empty spool weight is
            higher than the current scale reading. Worth weighing an empty
            spool to verify.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Number seems too low compared to your slicer estimate.
            </span>{" "}
            Some scale variation is normal (1-2 g). Check the scale by
            placing a known-weight object on it (a kilogram is a 1 L
            bottle of water).
          </li>
        </ul>
      </section>

      <AdSlot slot="inline" className="mx-auto my-10 max-w-3xl" />

      <section className="mx-auto max-w-3xl space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Frequently asked
        </h2>
        <dl className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="space-y-1">
              <dt className="font-medium text-foreground">{item.q}</dt>
              <dd className="text-sm leading-6 text-muted-foreground">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <RelatedContent pagePath="/tools/remaining-spool-calculator" className="mx-auto mt-10 max-w-3xl" />

      <AdSlot slot="inline" className="mx-auto mt-10 max-w-3xl" />
    </div>
  );
}
