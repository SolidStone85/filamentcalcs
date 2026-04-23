import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { SITE } from "@/lib/tools";

import { Calculator } from "./Calculator";

const TITLE = "3D Printing Material Comparison: PLA vs PETG vs ABS vs TPU";
const DESCRIPTION =
  "Compare 3D printing filaments side by side. Temperature, strength, flex, outdoor use, food safety, and price. Pick the right material for your print.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE.url}/tools/material-comparison`,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/tools/material-comparison`,
    type: "website",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "Which material should a beginner start with?",
    a: "PLA. It's forgiving, prints at low temperatures, doesn't warp badly, and works on almost any printer without an enclosure. Start here, master the basics, then branch out to PETG or TPU when you hit its limits.",
  },
  {
    q: "When should I switch from PLA to PETG?",
    a: "When your prints live outdoors, need to handle temperatures above roughly 50°C (car interiors in summer, garage storage), or need to be stronger and more impact-resistant. PETG is a natural second material for most hobbyists.",
  },
  {
    q: "Is ABS still worth using?",
    a: "Only if you need its specific properties: high heat resistance, acetone vapor smoothing, or authentic automotive-grade parts. ASA is usually a better modern choice because it handles UV exposure that ABS doesn't. Both need an enclosed printer and good ventilation.",
  },
  {
    q: "What makes TPU different?",
    a: "It's flexible. Prints bend, stretch, and bounce back. Good for phone cases, gaskets, wheels, and shock absorbers. Hard to print on Bowden extruders (the tubing flexes during retractions), easy on direct-drive.",
  },
  {
    q: "Is polycarbonate for hobbyists?",
    a: "Generally no. PC needs 260 to 310°C nozzle temps and a heated bed of 100 to 130°C, which exceeds what most consumer printers can hit reliably. If you need extreme strength or transparency, PC is the answer, but the setup cost is high.",
  },
  {
    q: "What about food contact?",
    a: "No 3D print is fully food safe because layer lines trap bacteria. 'Contact-safe' certifications on some PLA and PETG only apply to the raw filament, not the finished print. For food surfaces, use food-safe epoxy coating or pick a different manufacturing method.",
  },
];

export default function MaterialComparisonPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "3D Printing Material Comparison Tool",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any (web)",
        url: `${SITE.url}/tools/material-comparison`,
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
          Material Comparison
        </h1>
        <p className="mt-2 text-muted-foreground">
          Side-by-side specs for common 3D printing filaments. Pick up to
          four to compare. Temperature ranges, strength and flex ratings,
          outdoor and food-contact notes, and use-case guidance for each.
        </p>
      </header>

      <AdSlot slot="top" className="mb-6" />

      <Suspense fallback={<div className="h-[500px]" />}>
        <Calculator />
      </Suspense>

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          How to use this
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          The goal is quick sanity checks, not a comprehensive materials
          database. Ratings are community consensus typicals, not
          scientific measurements. Brand variation matters: a cheap PLA
          from a no-name Amazon seller will print differently than
          Polymaker or Prusament.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          When you've decided on a material, the Filament Cost Calculator
          will estimate what the print will cost. The Print Time Estimator
          covers how long it'll take.
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
              <dt className="font-medium">{item.q}</dt>
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
