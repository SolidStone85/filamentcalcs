import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE, TOOLS } from "@/lib/tools";

const TITLE = "All 3D printing calculators on filamentcalcs.com";
const DESCRIPTION =
  "Six free 3D printing calculators in one place: filament cost, print time, electricity, material comparison, failure rate, and AMS purge waste. No sign-up, runs in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE.url}/tools` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/tools`,
    type: "website",
  },
};

const TOOL_DETAILS: Record<string, { useCase: string; whenToUse: string }> = {
  "filament-cost-calculator": {
    useCase:
      "Material cost for a single print. Enter the grams from your slicer, the spool price, and a waste factor. Get the per-print number you can use for pricing on Etsy or just to know what your hobby is costing.",
    whenToUse:
      "Use before slicing if you want a quick ballpark, or after slicing for the precise number. Most people pull this up while standing next to their printer with the spool in hand.",
  },
  "print-time-estimator": {
    useCase:
      "Quick hours-to-print estimate from filament weight and printer class. Bambu, Prusa, Ender, Voron presets included. Rough but useful when you don't have a sliced file yet.",
    whenToUse:
      "Use when you're browsing Printables or Thingiverse and want to know if a 250-gram model will finish before you go to bed. For exact numbers, your slicer is more accurate.",
  },
  "material-comparison": {
    useCase:
      "Side-by-side specs for PLA, PETG, ABS, ASA, TPU, Nylon, and PC. Temperature ranges, strength, flex, outdoor performance, and price-per-kg.",
    whenToUse:
      "Use when picking material for a new project. Especially helpful for comparison between similar options like PLA vs PLA+, ABS vs ASA, or PETG vs PETG-CF.",
  },
  "electricity-cost-calculator": {
    useCase:
      "What a print actually costs in electricity. Watts × hours × your local rate. Most hobbyists overestimate this by 5x or more; the real number is usually pennies.",
    whenToUse:
      "Use to put electricity cost in context relative to filament. Useful for print farms or anyone in a high-rate area like Hawaii or Germany. Otherwise it's almost always negligible.",
  },
  "failure-rate-calculator": {
    useCase:
      "Track your monthly failure rate and compare to hobbyist benchmarks. Computes how much filament you're losing to failed prints and how much your effective per-print cost goes up.",
    whenToUse:
      "Use after every month of printing to spot trends. A spike after switching filament brands or after a humid week tells you what changed.",
  },
  "ams-purge-waste-calculator": {
    useCase:
      "Multi-color print purge waste. Bambu AMS, Prusa MMU, Mosaic Palette presets. Shows how much filament gets dumped into the purge tower per print.",
    whenToUse:
      "Use before any multi-color print to see if it's worth the material cost. For small parts with many color swaps, purge can exceed the part weight.",
  },
  "remaining-spool-calculator": {
    useCase:
      "Filament left on a partial spool. Weigh the spool on any kitchen scale, pick your spool brand from the preset list, get the remaining grams and percent.",
    whenToUse:
      "Use before starting a print to know if your spool will make it, or before reordering to confirm it's actually time. Empty-spool weight presets cover Bambu refillable cores, Polymaker, eSun, Prusament, and generic plastic spools.",
  },
};

export default function ToolsIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "filamentcalcs 3D printing calculators",
    itemListElement: TOOLS.filter((t) => t.available).map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE.url}/tools/${tool.slug}`,
      name: tool.title,
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
          All 3D printing calculators
        </h1>
        <p className="mt-3 text-muted-foreground">
          Six focused calculators for the things hobbyist 3D printer owners
          actually need to compute. Free, fast, mobile-friendly. Every
          calculator runs in your browser, results update as you type, and
          URLs encode your inputs so you can bookmark or share. No sign-up,
          no account, no data collection beyond standard analytics.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          For the formulas behind each calculator and the source data, see
          the{" "}
          <Link href="/methodology" className="underline underline-offset-4">
            methodology page
          </Link>
          .
        </p>
      </header>

      <section className="space-y-6">
        {TOOLS.filter((t) => t.available).map((tool) => {
          const details = TOOL_DETAILS[tool.slug];
          return (
            <Card key={tool.slug} className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="hover:text-primary"
                  >
                    {tool.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                <p>{details?.useCase}</p>
                <p>
                  <span className="font-medium text-foreground">
                    When to use:
                  </span>{" "}
                  {details?.whenToUse}
                </p>
                <p>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-primary underline underline-offset-4"
                  >
                    Open the {tool.shortTitle} calculator
                  </Link>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          What if you don&apos;t see what you need?
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          The calculators here cover what hobbyists ask about most often. If
          you&apos;re looking for a calculator that doesn&apos;t exist on
          this site (resin printing cost, multi-printer farm economics,
          enclosure heater power), tell us via the{" "}
          <Link href="/contact" className="underline underline-offset-4">
            contact page
          </Link>
          . Suggestions help prioritize the next builds.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          For longer-form context on cost, materials, troubleshooting, and
          buyer&apos;s guidance, see the{" "}
          <Link href="/guides" className="underline underline-offset-4">
            guides section
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
