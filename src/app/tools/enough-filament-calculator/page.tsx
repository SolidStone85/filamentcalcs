import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { SITE } from "@/lib/tools";

import { Calculator } from "./Calculator";

const TITLE = "Enough Filament Calculator: will the spool finish your print?";
const DESCRIPTION =
  "Check if the filament left on a spool covers your next print. Enter what's left and the slicer estimate, get a clear yes, risky, or no with real margins.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE.url}/tools/enough-filament-calculator`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/tools/enough-filament-calculator`,
    type: "website",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "How accurate is the slicer's weight estimate?",
    a: "Usually within a few percent for the model itself. What it can miss depends on settings: priming lines, skirts, brims, and ooze add grams the preview doesn't always show. That is what the waste margin slider covers. 5% is enough for most single-color prints on a tuned machine.",
  },
  {
    q: "How do I find out how much filament is actually left?",
    a: "Weigh the spool on a kitchen or 0.1 g scale, then subtract the empty spool weight. Empty weights run from about 140 g for cardboard spools to 250 g for heavy plastic ones. The Remaining Filament Calculator on this site has verified empty-spool presets for Bambu, Polymaker, eSun, Prusament, and others.",
  },
  {
    q: "Can I trust the last few meters of a spool?",
    a: "Mostly, with caveats. The tightest winding is at the core, so the last meters hold the most curl and kink stress, and on an opened spool they have been exposed to humidity the longest. On quality filament they usually print fine. On budget spools, the last 20 to 30 g is where tangles and snapped filament show up most.",
  },
  {
    q: "What are my options if I'm short?",
    a: "Split the model across two plates and print the second part on a new spool. Drop infill a notch, 15% to 10% can save real grams on chunky models. Scale the model down a few percent if dimensions aren't critical. Or plan a runout swap: most modern printers pause on filament runout and let you load a new spool mid-print. Bambu printers with an AMS can even auto-switch to a backup spool of the same material.",
  },
  {
    q: "Does this work for multi-color prints?",
    a: "Yes. Slicers usually include purge waste in their total estimate for multi-color jobs; if yours shows it separately, put the model weight in the print field and the purge grams in the purge field. The AMS Purge Waste Calculator estimates purge if you don't have a sliced number yet.",
  },
];

export default function EnoughFilamentCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Enough Filament Calculator",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any (web)",
        url: `${SITE.url}/tools/enough-filament-calculator`,
        description: DESCRIPTION,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
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
          <Highlight3D>Enough Filament Calculator</Highlight3D>
        </h1>
        <p className="mt-2 text-muted-foreground">
          The 2 a.m. question every printer owner knows: is what's left on
          this spool going to survive a 14 hour print? Enter what the spool
          has left and what the slicer says the job needs. You get a straight
          yes, risky, or no, with the margin in grams instead of a guess.
        </p>
      </header>

      <AdSlot slot="top" className="mb-6" />

      <Suspense fallback={<div className="h-[400px]" />}>
        <Calculator />
      </Suspense>

      <AffiliatePicks
        pagePath="/tools/enough-filament-calculator"
        className="mx-auto mt-8 max-w-3xl"
      />

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          How the verdict works
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          The math is short: the print's slicer weight, plus a waste margin
          for priming and skirts, plus purge for multi-color jobs. That total
          gets compared against what the spool has left. The interesting part
          is the judgment band. A print that fits with 3 grams to spare is
          not a yes, it is a coin flip, because slicer estimates drift and
          spool tails misbehave.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          So the verdict demands headroom before it says yes: 8% of the job,
          or 10 grams, whichever is bigger. Inside that window you get
          "risky" instead. You can still hit print, but do it knowing the
          margin, ideally on a job where a runout swap or a failed tail
          doesn't hurt.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Why spool tails are the risky part
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          The end of a spool is wound tightest against the core, so it
          carries the most curl. Feed that through a long PTFE path and
          resistance climbs right when you have zero slack for error. Opened
          spools also sit around: the outer layers you printed months ago
          were fresh, the core layers have been drinking humidity ever since.
          And "1 kg" spools are not lab instruments. Budget brands can run 10
          to 20 g light, which is exactly the margin you were counting on.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          None of that means the tail is unusable. It means a 260 g print
          against 270 g of 8-month-old budget PLA is a gamble, and this tool
          will call it that instead of nodding along.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Get the "what's left" number right
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Garbage in, gamble out. The reliable way to know what a spool holds
          is a scale: weigh the whole spool, subtract the empty spool weight,
          and what remains is filament. The{" "}
          <a
            href="/tools/remaining-spool-calculator"
            className="underline underline-offset-4"
          >
            Remaining Filament Calculator
          </a>{" "}
          does the subtraction with verified empty weights per brand, and the{" "}
          <a href="/spools" className="underline underline-offset-4">
            spool weight pages
          </a>{" "}
          list the common ones if you just want the raw numbers. Eyeballing
          the spool's side window is how half-finished prints happen; a $12
          scale ends the guessing permanently.
        </p>
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

      <RelatedContent
        pagePath="/tools/enough-filament-calculator"
        className="mx-auto mt-10 max-w-3xl"
      />

      <AdSlot slot="inline" className="mx-auto mt-10 max-w-3xl" />
    </div>
  );
}
