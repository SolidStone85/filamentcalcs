import type { Metadata } from "next";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { MATERIAL_DATASHEETS } from "@/lib/presets/materialDatasheets";
import type { Source } from "@/lib/reference";
import { SITE } from "@/lib/tools";

import { Calculator } from "./Calculator";

const TITLE = "3D Printing Material Comparison: PLA vs PETG vs ABS vs TPU";

// Every data sheet or maker page quoted on this page: the named-product
// rows plus the Prusament and filled-nylon figures cited in the text.
const SOURCES: Source[] = [
  ...MATERIAL_DATASHEETS.map((sheet) => sheet.source),
  ...[
    ["Prusament PLA page and technical data sheet (outdoor use, yield strength, impact)", "https://prusament.com/materials/pla/"],
    ["Prusament PETG technical data sheet", "https://storage.googleapis.com/prusa3d-content-prod-14e8-wordpress-prusament-prod/2023/10/9f8d2165-tds_prusament-petg_n_en.pdf"],
    ["Prusament ASA page (outdoor and UV use)", "https://prusament.com/materials/prusament-asa/"],
    ["Prusament ASA technical data sheet", "https://storage.googleapis.com/prusa3d-content-prod-14e8-wordpress-prusament-prod/2024/05/bc8551ef-tds_prusament-asa_2024_en.pdf"],
    ["Prusament PC Blend technical data sheet", "https://prusament.com/wp-content/uploads/2022/10/PCBlend_Prusament_TDS_2022_16_EN.pdf"],
    ["Prusament PA11 page (heat resistance after annealing)", "https://prusament.com/materials/prusament-pa11/"],
    ["Prusament PA11 Carbon Fiber technical data sheet", "https://prusament.com/wp-content/uploads/2022/08/TDS_PA11CFB.pdf"],
    ["Bambu Lab PAHT-CF technical data sheet", "https://store.bblcdn.com/7166b20bc68f4c87b32c972b856eeb4b.pdf"],
    ["Bambu Lab PA6-CF technical data sheet", "https://store.bblcdn.com/b2abc59ac250492b979a52f1ce3e61b3.pdf"],
    ["Bambu Lab PA6-GF technical data sheet", "https://store.bblcdn.com/s5/default/f0317db8b3f44d0486553c1e214cff9d.pdf"],
  ].map(([label, url]) => ({ label, url, checked: "2026-10-10" })),
];
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
    a: "When a part needs more heat headroom or takes knocks. Bambu Lab's data sheets list a heat deflection temperature of 57 °C for PLA Basic and 71 °C for PETG Basic (at 0.45 MPa), and in both Bambu's and Prusament's impact tests PETG absorbed more than PLA. PETG is a natural second material for most hobbyists. For a hot car or attic, compare the product's data sheet with how hot the part will actually get.",
  },
  {
    q: "Is ABS still worth using?",
    a: "Mainly if you want acetone vapor smoothing or already have it dialed in. ASA has similar printing needs, and Bambu Lab and Prusament both describe their ASA as made for outdoor and UV exposure, so it is usually the better choice for parts that live outside. Both print best in an enclosed printer with good ventilation.",
  },
  {
    q: "What makes TPU different?",
    a: "It's flexible. Prints bend, stretch, and bounce back. Good for phone cases, gaskets, wheels, and shock absorbers. Hard to print on Bowden extruders (the tubing flexes during retractions), easy on direct-drive.",
  },
  {
    q: "Is polycarbonate for hobbyists?",
    a: "It can be, on the right printer. Bambu Lab lists 260 to 280 °C nozzle and 90 to 110 °C bed for its PC, and Prusament lists about 275 °C nozzle and 110 °C bed for PC Blend, so check that your printer reaches those and has an enclosure. PC is a strong candidate when a part needs more heat resistance than PETG, but read the specific product's data sheet rather than assuming the family is strongest at everything.",
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
          four to compare. Typical print temperatures, measured heat and
          strength values for a named product of each type (with the test
          behind each number), outdoor and food-contact notes, and use-case
          guidance.
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
          database. Print temperatures, flexibility and use cases are broad
          tendencies for each family. Measured values are shown only for a
          named product, with the test that produced them, because two
          filaments sold under the same family name can perform very
          differently.
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
            <span className="font-medium text-foreground">Will it live outdoors or somewhere hot?</span>{" "}
            If yes, skip PLA. Its heat deflection temperature is about 55 to
            57 °C in Prusament&apos;s and Bambu Lab&apos;s data sheets, and
            Prusament calls PLA not ideal for outdoor use. ASA is made for
            UV exposure; PETG is a common middle ground. For a hot car,
            compare the product&apos;s data sheet with the conditions.
          </li>
          <li>
            <span className="font-medium text-foreground">Does it need to flex or absorb impact?</span>{" "}
            If yes, TPU. Phone cases, gaskets, watch bands, bumpers. PLA
            and PETG snap; TPU bends.
          </li>
          <li>
            <span className="font-medium text-foreground">Does it need to handle high temperature (above 80°C)?</span>{" "}
            Look at ABS, ASA, PC or a fiber-filled nylon, and check the
            product&apos;s data sheet. Unfilled nylon can be much lower:
            Prusament PA11 lists 58.7 °C at 0.45 MPa. These materials print
            best in an enclosed printer with good ventilation.
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
          Quick reference: typical print temperatures
        </h2>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Material</th>
                <th className="px-3 py-2 text-left font-medium">Nozzle</th>
                <th className="px-3 py-2 text-left font-medium">Bed</th>
                <th className="px-3 py-2 text-left font-medium">Enclosure?</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-2">PLA</td>
                <td className="px-3 py-2">200-220°C</td>
                <td className="px-3 py-2">50-60°C</td>
                <td className="px-3 py-2">No</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">PETG</td>
                <td className="px-3 py-2">230-250°C</td>
                <td className="px-3 py-2">70-85°C</td>
                <td className="px-3 py-2">Helpful</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">ABS</td>
                <td className="px-3 py-2">240-260°C</td>
                <td className="px-3 py-2">100-110°C</td>
                <td className="px-3 py-2">Required</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">ASA</td>
                <td className="px-3 py-2">240-260°C</td>
                <td className="px-3 py-2">100-110°C</td>
                <td className="px-3 py-2">Required</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">TPU</td>
                <td className="px-3 py-2">220-240°C</td>
                <td className="px-3 py-2">50-60°C</td>
                <td className="px-3 py-2">No</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Nylon (PA)</td>
                <td className="px-3 py-2">240-280°C</td>
                <td className="px-3 py-2">70-100°C</td>
                <td className="px-3 py-2">Required</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Polycarbonate (PC)</td>
                <td className="px-3 py-2">260-285°C</td>
                <td className="px-3 py-2">90-120°C</td>
                <td className="px-3 py-2">Required</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Heat and strength: data sheet values for named products
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          One product per family, copied from the maker&apos;s technical data
          sheet. The Bambu Lab rows come from one lab using the same test
          standards, so they are mostly comparable: the PETG sheet states no annealing
          step, PC was tested dry, and TPU has no heat deflection
          value. The nylon row is Prusament&apos;s, tested differently, so
          it does not compare directly.
        </p>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Product</th>
                <th className="px-3 py-2 text-left font-medium">Heat deflection, 0.45 / 1.8 MPa</th>
                <th className="px-3 py-2 text-left font-medium">Tensile strength</th>
                <th className="px-3 py-2 text-left font-medium">Impact (Charpy)</th>
              </tr>
            </thead>
            <tbody>
              {MATERIAL_DATASHEETS.map((sheet) => (
                <tr key={sheet.materialId} className="border-b last:border-b-0 align-top">
                  <td className="px-3 py-2">
                    <a
                      href={sheet.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-4"
                    >
                      {sheet.product}
                    </a>
                  </td>
                  <td className="px-3 py-2 font-mono tabular-nums whitespace-nowrap">
                    {sheet.hdtC045 === null
                      ? "Not published"
                      : `${sheet.hdtC045} / ${sheet.hdtC18} °C`}
                  </td>
                  <td className="px-3 py-2 font-mono tabular-nums whitespace-nowrap">
                    {sheet.tensileMpa} MPa
                  </td>
                  <td className="px-3 py-2 font-mono tabular-nums whitespace-nowrap">
                    {sheet.impactKjM2} kJ/m²
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="list-disc pl-5 space-y-2 text-sm leading-6 text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Tests.</span>{" "}
            Bambu Lab: heat deflection per ISO 75; tensile per ISO 527 and
            Charpy impact per ISO 179 on printed X-Y specimens, mostly
            annealed and dried before testing. Prusament PA11: tensile is
            yield strength and impact is notched; the sheet does not state
            annealing.
            Each material&apos;s card above lists its exact test.
          </li>
          <li>
            <span className="font-medium text-foreground">Heat deflection</span>{" "}
            is the temperature at which a standard test bar bends a set
            amount under load. A real part with less load may survive warmer
            conditions, and a heavily loaded one may not. Use it to compare
            materials, not as a guarantee.
          </li>
          <li>
            <span className="font-medium text-foreground">No family wins everywhere.</span>{" "}
            In Bambu Lab&apos;s sheets PETG Basic&apos;s tensile strength
            (51 MPa) beats PLA Basic&apos;s (35 MPa); in Prusament&apos;s,
            PLA&apos;s yield strength (51 MPa) edges PETG&apos;s (47 MPa).
            In both makers&apos; impact tests PETG absorbed more than PLA.
            Bambu&apos;s PC has the highest tensile strength here, but not
            the highest impact value.
          </li>
        </ul>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          General tendencies (not measurements)
        </h2>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Material</th>
                <th className="px-3 py-2 text-left font-medium">Flex</th>
                <th className="px-3 py-2 text-left font-medium">Outdoor (UV)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-2">PLA</td>
                <td className="px-3 py-2">None</td>
                <td className="px-3 py-2">Poor</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">PETG</td>
                <td className="px-3 py-2">Slight</td>
                <td className="px-3 py-2">Fair</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">ABS</td>
                <td className="px-3 py-2">Slight</td>
                <td className="px-3 py-2">Varies; protect from UV unless the maker says otherwise</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">ASA</td>
                <td className="px-3 py-2">Slight</td>
                <td className="px-3 py-2">Good: made for outdoor use</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">TPU</td>
                <td className="px-3 py-2">High</td>
                <td className="px-3 py-2">Fair</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Nylon</td>
                <td className="px-3 py-2">Slight</td>
                <td className="px-3 py-2">Fair</td>
              </tr>
              <tr>
                <td className="px-3 py-2">PC</td>
                <td className="px-3 py-2">None</td>
                <td className="px-3 py-2">Fair</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          <span className="font-medium text-foreground">Correction note:</span>{" "}
          October 10, 2026: removed one-number &ldquo;heat resistance&rdquo;
          figures per family (for example PETG ~75 °C and nylon ~150 °C) and
          strength star ratings that had no product or test behind them, and
          added named-product data sheet values. The old nylon figure matched
          fiber-filled grades, not unfilled nylon.
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
            replacement clips on appliances, parts that get bumped or see
            moderate warmth. For a car interior or attic, check the
            product&apos;s heat deflection temperature against the
            conditions first.
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
            stiff mechanical parts that need more heat resistance than
            PETG, and transparent pieces. Demanding to print.
          </li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">
          None of these are safety ratings. For a part whose failure could
          hurt someone, use a part that has been engineered and tested for
          the job, not a filament family&apos;s reputation.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Pricing reality (typical US list prices per kg, 2026; not live quotes)
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

      <section className="mx-auto mt-10 max-w-3xl space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Sources</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Data sheets and maker pages behind the figures above, checked
          October 10, 2026.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-xs leading-6 marker:text-primary">
          {SOURCES.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <RelatedContent pagePath="/tools/material-comparison" className="mx-auto mt-10 max-w-3xl" />

      <AdSlot slot="inline" className="mx-auto mt-10 max-w-3xl" />
    </div>
  );
}
