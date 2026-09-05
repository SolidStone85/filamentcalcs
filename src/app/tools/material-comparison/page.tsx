import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
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
    a: "A generic filament type does not establish food-contact suitability. Check the exact product's certification and its stated conditions, including whether it covers your finished printing process and intended use. This comparison does not certify printed items or recommend a coating as proof of suitability.",
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

      <AffiliatePicks pagePath="/tools/material-comparison" className="mx-auto mt-8 max-w-3xl" />

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
          When you&apos;ve decided on a material, the{" "}
          <a href="/tools/filament-cost-calculator" className="underline underline-offset-4">
            Filament Cost Calculator
          </a>{" "}
          will estimate what the print will cost. The{" "}
          <a href="/tools/print-time-estimator" className="underline underline-offset-4">
            Print Time Estimator
          </a>{" "}
          covers how long it&apos;ll take.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          The decision tree (skip the table, just answer these)
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          For most prints, four questions resolve the material choice
          faster than reading specs:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Will it live outdoors or in a hot car?</span>{" "}
            If yes, skip PLA. PLA softens at 55 to 60°C and degrades from UV.
            Use PETG (basic) or ASA (UV-stable) instead.
          </li>
          <li>
            <span className="font-medium text-foreground">Does it need to flex or absorb impact?</span>{" "}
            If yes, TPU. Phone cases, gaskets, watch bands, bumpers. PLA
            and PETG snap; TPU bends.
          </li>
          <li>
            <span className="font-medium text-foreground">Does it need to handle high temperature (above 80°C)?</span>{" "}
            If yes, you need ABS, ASA, PA (nylon), or PC. These all need
            an enclosed printer and good ventilation.
          </li>
          <li>
            <span className="font-medium text-foreground">None of the above?</span>{" "}
            Use PLA. It&apos;s cheap, easy, prints clean, doesn&apos;t need
            an enclosure, doesn&apos;t need a fancy hotend. The only reason
            most people leave PLA is one of the constraints above.
          </li>
        </ol>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Quick reference: temperature ranges
        </h2>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Material</th>
                <th className="px-3 py-2 text-left font-medium">Nozzle</th>
                <th className="px-3 py-2 text-left font-medium">Bed</th>
                <th className="px-3 py-2 text-left font-medium">Enclosure?</th>
                <th className="px-3 py-2 text-left font-medium">Heat resistance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-2">PLA</td>
                <td className="px-3 py-2">200-220°C</td>
                <td className="px-3 py-2">50-60°C</td>
                <td className="px-3 py-2">No</td>
                <td className="px-3 py-2">~55°C</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">PETG</td>
                <td className="px-3 py-2">230-250°C</td>
                <td className="px-3 py-2">70-85°C</td>
                <td className="px-3 py-2">Helpful</td>
                <td className="px-3 py-2">~75°C</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">ABS</td>
                <td className="px-3 py-2">240-260°C</td>
                <td className="px-3 py-2">100-110°C</td>
                <td className="px-3 py-2">Required</td>
                <td className="px-3 py-2">~95°C</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">ASA</td>
                <td className="px-3 py-2">240-260°C</td>
                <td className="px-3 py-2">100-110°C</td>
                <td className="px-3 py-2">Required</td>
                <td className="px-3 py-2">~95°C (UV stable)</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">TPU</td>
                <td className="px-3 py-2">220-240°C</td>
                <td className="px-3 py-2">50-60°C</td>
                <td className="px-3 py-2">No</td>
                <td className="px-3 py-2">~70°C (varies)</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Nylon (PA)</td>
                <td className="px-3 py-2">240-280°C</td>
                <td className="px-3 py-2">70-100°C</td>
                <td className="px-3 py-2">Required</td>
                <td className="px-3 py-2">~150°C</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Polycarbonate (PC)</td>
                <td className="px-3 py-2">260-310°C</td>
                <td className="px-3 py-2">100-130°C</td>
                <td className="px-3 py-2">Required</td>
                <td className="px-3 py-2">~135°C</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Strength, flex, and durability ratings (community typical)
        </h2>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Material</th>
                <th className="px-3 py-2 text-left font-medium">Tensile strength</th>
                <th className="px-3 py-2 text-left font-medium">Impact resistance</th>
                <th className="px-3 py-2 text-left font-medium">Flex</th>
                <th className="px-3 py-2 text-left font-medium">Outdoor (UV)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-2">PLA</td>
                <td className="px-3 py-2">Strong (rigid)</td>
                <td className="px-3 py-2">Brittle</td>
                <td className="px-3 py-2">None</td>
                <td className="px-3 py-2">Poor</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">PETG</td>
                <td className="px-3 py-2">Medium</td>
                <td className="px-3 py-2">Good</td>
                <td className="px-3 py-2">Slight</td>
                <td className="px-3 py-2">Fair</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">ABS</td>
                <td className="px-3 py-2">Medium</td>
                <td className="px-3 py-2">Good</td>
                <td className="px-3 py-2">Slight</td>
                <td className="px-3 py-2">Limited; protect from UV</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">ASA</td>
                <td className="px-3 py-2">Medium</td>
                <td className="px-3 py-2">Good</td>
                <td className="px-3 py-2">Slight</td>
                <td className="px-3 py-2">Excellent</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">TPU</td>
                <td className="px-3 py-2">Low (in tension)</td>
                <td className="px-3 py-2">Excellent</td>
                <td className="px-3 py-2">High</td>
                <td className="px-3 py-2">Fair</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Nylon</td>
                <td className="px-3 py-2">High</td>
                <td className="px-3 py-2">Excellent</td>
                <td className="px-3 py-2">Slight</td>
                <td className="px-3 py-2">Fair</td>
              </tr>
              <tr>
                <td className="px-3 py-2">PC</td>
                <td className="px-3 py-2">Highest</td>
                <td className="px-3 py-2">Excellent</td>
                <td className="px-3 py-2">None</td>
                <td className="px-3 py-2">Fair</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          A common mistake: assuming PLA is weak because it&apos;s easy. PLA
          actually has the highest tensile strength of common filaments. It
          just shatters under impact. PETG bends instead.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          When to pick each material (real use cases)
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">PLA:</span>{" "}
            display models, cosplay accents, quick prototypes, tabletop
            minis, indoor functional parts that don&apos;t see heat. Default
            choice.
          </li>
          <li>
            <span className="font-medium text-foreground">PETG:</span>{" "}
            outdoor parts (planters, garden brackets),
            replacement clips on appliances, parts that get bumped, anything
            in a car interior or attic.
          </li>
          <li>
            <span className="font-medium text-foreground">ASA:</span>{" "}
            outdoor parts that PETG isn&apos;t tough enough for. License
            plate frames, exterior automotive trim, mailbox parts. Needs an
            enclosed printer.
          </li>
          <li>
            <span className="font-medium text-foreground">ABS:</span>{" "}
            mostly legacy choice now. Use ASA instead unless you specifically
            need acetone vapor smoothing.
          </li>
          <li>
            <span className="font-medium text-foreground">TPU:</span>{" "}
            phone cases, watch bands, gaskets, soft wheels, drone landing
            gear, anti-vibration mounts.
          </li>
          <li>
            <span className="font-medium text-foreground">Nylon (PA):</span>{" "}
            functional engineering parts. Gears, hinges, snap fits that
            need to flex without breaking. Hygroscopic, needs drying.
          </li>
          <li>
            <span className="font-medium text-foreground">Polycarbonate:</span>{" "}
            high-stress mechanical parts, safety gear, transparent
            structural pieces. Demanding to print.
          </li>
        </ul>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Pricing reality (per kg, average 2026)
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-sm leading-6 text-muted-foreground">
          <li>PLA basic: $18 to $25/kg</li>
          <li>PLA premium (Polymaker, Prusament): $28 to $38/kg</li>
          <li>PETG: $22 to $30/kg</li>
          <li>ABS: $20 to $28/kg</li>
          <li>ASA: $30 to $40/kg</li>
          <li>TPU 95A: $30 to $45/kg</li>
          <li>Nylon (basic): $35 to $55/kg</li>
          <li>Polycarbonate: $50 to $80/kg</li>
          <li>Carbon-fiber-filled (PA-CF, PETG-CF): $60 to $120/kg</li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">
          Sale prices on Bambu, Polymaker, eSun, and Sunlu can drop these
          by 20 to 35% during major events (Black Friday, mid-year
          clearance). Stock up when basic PLA hits $15/kg.
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

      <RelatedContent pagePath="/tools/material-comparison" className="mx-auto mt-10 max-w-3xl" />

      <AdSlot slot="inline" className="mx-auto mt-10 max-w-3xl" />
    </div>
  );
}
