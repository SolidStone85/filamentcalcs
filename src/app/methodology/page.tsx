import type { Metadata } from "next";
import Link from "next/link";

import { SITE } from "@/lib/tools";

const TITLE = "Methodology: how the calculators work, sources, and update policy";
const DESCRIPTION =
  "How filamentcalcs.com derives its numbers. Formulas, source data, default values, and how often pages are reviewed.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE.url}/methodology`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/methodology`,
    type: "article",
  },
};

export default function MethodologyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Methodology
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          How the calculators work
        </h1>
        <p className="text-sm text-muted-foreground">Last reviewed May 2026</p>
      </header>

      <div className="prose prose-sm dark:prose-invert mt-8 max-w-none space-y-5 text-sm leading-7">
        <p>
          Every calculator on this site comes with assumptions baked in.
          This page documents what those are, where the numbers come from,
          and how often each page is reviewed. The goal is transparency:
          you should be able to see why the calculator says what it says,
          and disagree with the defaults if your situation is different.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          1. Filament Cost Calculator
        </h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          cost = (grams / 1000) × price_per_kg × (1 + waste_factor)
        </p>
        <p>
          Three inputs, one formula. The waste factor defaults are based on
          community-aggregated data from Reddit (r/3Dprinting,
          r/BambuLab, r/PrusaSlicer), Bambu Lab forums, and the Klipper
          Discord. Defaults: PLA 5%, PETG 7%, TPU 8%, ABS 10%, Nylon 12%.
          These represent typical waste on a clean printer running standard
          settings, not edge cases.
        </p>
        <p>
          Currency conversion is not handled by this calculator. Enter
          your spool price in your local currency and the math is the
          same. The "USD" / "EUR" toggle is cosmetic only.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          2. Print Time Estimator
        </h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          hours = grams / throughput_g_per_hr
        </p>
        <p>
          Throughput numbers per printer come from community print logs
          posted on Reddit, Bambu Lab community forums, and the Klipper
          Discord, plus manufacturer specifications where available. The
          calculator uses typical PLA throughput at standard quality
          settings. Faster speeds reduce time linearly, finer detail
          (smaller layer heights) increases it.
        </p>
        <p>
          This estimate is intentionally rough. For accurate per-file
          times, use your slicer&apos;s built-in estimate, which simulates
          every move at your configured speeds.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          3. Electricity Cost Calculator
        </h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          cost = (watts / 1000) × hours × rate_per_kWh
        </p>
        <p>
          Average watt numbers per printer come from manufacturer specs
          and community Kill-A-Watt measurements. Numbers represent
          average power draw across a complete print, including bed
          heating cycles, not peak draw. Regional electricity rates are
          checked annually against EIA (US Energy Information
          Administration) data and Eurostat for European rates.
        </p>
        <p>
          Bed heating dominates power draw in any printer, but PID
          controllers cycle the bed heater on and off, so average draw
          stays well below peak. A printer rated 350W peak typically
          averages 110 to 130W during a print.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          4. Failure Rate Calculator
        </h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          failure_rate = failed_prints / total_prints
        </p>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          attempts_needed = 1 / (1 - failure_rate)
        </p>
        <p>
          The benchmark bands (under 5% excellent, 5-10% typical, 10-20%
          investigate, 20%+ serious issue) come from informal community
          surveys and conversations with print farm operators. They are
          not standards, just rough guideposts.
        </p>
        <p>
          The "attempts needed" number is the geometric expectation:
          if 10% of attempts fail independently, on average you need
          1 / 0.9 = 1.11 attempts per success. This is a simplification
          (real-world failures cluster, not all are independent), but it
          gives a useful upper bound on amortized cost.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          5. AMS Purge Waste Calculator
        </h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          purge_waste = swaps × purge_per_swap × flush_multiplier
        </p>
        <p>
          Default purge values (8 g for Bambu AMS, 20 g for Prusa MMU,
          etc.) come from the slicer&apos;s default flush settings as of
          early 2026. Bambu Studio shows the actual flushed grams in the
          slicer&apos;s preview panel; that&apos;s the most accurate
          number for any specific print. The flush multiplier is
          adjustable in slicer settings between 0.4x and 1.5x.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          6. Material Comparison
        </h2>
        <p>
          Material specifications come from manufacturer datasheets
          (Polymaker, Prusament, Bambu Lab, eSun) cross-referenced with
          community testing on Reddit and YouTube (CNC Kitchen, Stefan
          Hermann&apos;s tensile testing series). Where datasheets and
          real-world tests disagree, the calculator favors real-world
          numbers since marketing values are often optimistic.
        </p>
        <p>
          Heat resistance numbers reflect deflection temperature under
          light load (HDT 0.45 MPa), not glass transition. This is more
          relevant for hobbyist use cases (does the part hold its shape
          in a warm car?).
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          Source data summary
        </h2>
        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
          <li>
            Manufacturer documentation: Bambu Lab wiki, Prusa knowledge
            base, Polymaker datasheets
          </li>
          <li>
            Community forums: Reddit r/3Dprinting, r/BambuLab, r/PrusaSlicer,
            r/FixMyPrint
          </li>
          <li>
            Regional electricity rates: US EIA residential rate data,
            Eurostat household electricity prices
          </li>
          <li>
            Tensile and impact data: CNC Kitchen YouTube test series,
            Stefan Hermann published results
          </li>
          <li>
            Print throughput: community-posted print logs, Klipper Discord
            performance threads
          </li>
        </ul>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          Update policy
        </h2>
        <p>
          Each calculator is reviewed at least once per quarter to:
        </p>
        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
          <li>Update default prices when filament market shifts (Black Friday, supply changes)</li>
          <li>Add new printers as they reach hobbyist relevance</li>
          <li>Refresh regional electricity rate defaults</li>
          <li>Incorporate any reader corrections submitted via the contact page</li>
        </ul>
        <p>
          Major calculator changes (formula changes, default value shifts
          larger than ~10%) get a note in the relevant page&apos;s "How
          this works" section. Minor corrections (typos, wording) are
          made silently.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          Limitations and what this site does not do
        </h2>
        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
          <li>
            The calculators are not certified by any standards body. They
            are practical estimates based on community data, suitable for
            hobbyist use. For production work, use your slicer plus actual
            measurement.
          </li>
          <li>
            No data leaves your browser. The calculations run entirely
            client-side in JavaScript. URLs include your inputs so you can
            bookmark or share, but nothing is sent to a server.
          </li>
          <li>
            Pricing data is reviewed quarterly but inevitably lags the
            market. If you see a default that&apos;s off by more than 20%,
            let us know via the{" "}
            <Link href="/contact" className="underline underline-offset-4">
              contact page
            </Link>
            .
          </li>
        </ul>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          Corrections and feedback
        </h2>
        <p>
          If you spot a wrong default, a stale price, or a calculation
          that doesn&apos;t match your printer&apos;s real behavior,
          please write in via the{" "}
          <Link href="/contact" className="underline underline-offset-4">
            contact page
          </Link>
          . Feedback gets reviewed within a week and integrated into the
          next quarterly update.
        </p>
      </div>
    </article>
  );
}
