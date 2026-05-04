import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { SITE } from "@/lib/tools";

import { Calculator } from "./Calculator";

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
    a: "If you assume the wrong empty spool weight, the calculation is off by exactly that amount in grams. A Bambu refillable core is around 125 g, while a generic plastic spool can be 220 g or more. That's a 95 g swing, which is a third of a typical print on a small part. Use the right preset for your spool brand or weigh one empty spool of each type you keep around.",
  },
  {
    q: "How do I weigh the spool?",
    a: "Any kitchen scale that reads to the nearest gram works. Postal scales are also fine. Take the spool off the printer, set it on the scale, read the number. The spool side hub doesn't need to be removed.",
  },
  {
    q: "What if the calculator says I have more filament than the original spool weight?",
    a: "That means your empty spool weight is set too low. Either pick a different preset that matches your spool, or weigh an actual empty spool to get the real number.",
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

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
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
          surprisingly: Bambu&apos;s refillable cores are around 125 g,
          their cardboard spools are around 205 g, and most generic plastic
          spools are 200-230 g. We&apos;ve included presets for the common
          brands so you don&apos;t have to weigh an empty spool every time.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
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
          it reads 540 g. The empty Polymaker spool weighs about 215 g. So
          remaining = 540 - 215 = 325 g. From a 1 kg spool, that&apos;s
          325 / 1000 × 100 = 32.5% remaining. At $22/kg, the value
          remaining is 0.325 × 22 = $7.15.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          Common empty spool weights
        </h2>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Spool</th>
                <th className="px-3 py-2 text-left font-medium">Empty weight</th>
                <th className="px-3 py-2 text-left font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-2">Bambu refillable core</td>
                <td className="px-3 py-2">~125 g</td>
                <td className="px-3 py-2">
                  Lightweight plastic core, refilled with bulk filament
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Bambu cardboard spool</td>
                <td className="px-3 py-2">~205 g</td>
                <td className="px-3 py-2">
                  Default for most Bambu Lab filament purchases
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Polymaker (PolyTerra etc.)</td>
                <td className="px-3 py-2">~215 g</td>
                <td className="px-3 py-2">
                  Plastic spool, occasionally cardboard for PolyTerra
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">eSun</td>
                <td className="px-3 py-2">~200 g</td>
                <td className="px-3 py-2">Standard plastic spool</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Prusament</td>
                <td className="px-3 py-2">~230 g</td>
                <td className="px-3 py-2">Slightly heavier plastic spool</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Generic plastic spool</td>
                <td className="px-3 py-2">200-250 g</td>
                <td className="px-3 py-2">
                  Most other brands fall in this range
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2">Heavy "premium" spool</td>
                <td className="px-3 py-2">260-280 g</td>
                <td className="px-3 py-2">
                  Some specialty filaments use heavier spools
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
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          When the result feels off
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">
              Calculator says you have more than the original weight.
            </span>{" "}
            Empty spool weight is too low. Either you picked the wrong
            preset, or the spool is heavier than the average for that
            brand. Switch to "Custom" and enter the actual weight.
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
