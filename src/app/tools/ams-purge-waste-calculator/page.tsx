import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AdSlot } from "@/components/shared/AdSlot";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { SITE } from "@/lib/tools";
import { Calculator } from "./Calculator";

const TITLE = "AMS Purge Waste Calculator: slicer material totals and custom estimates";
const DESCRIPTION = "Calculate multi-color material cost from model, flushing, support and tower grams. Or estimate purge from your own average in grams or mm³, with explicit assumptions.";
export const metadata: Metadata = {
  title: TITLE, description: DESCRIPTION,
  alternates: { canonical: `${SITE.url}/tools/ams-purge-waste-calculator` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE.url}/tools/ams-purge-waste-calculator`, type: "website" },
};

const FAQ = [
  { q: "What should I copy from the slicer?", a: "After slicing the complete plate, use its material breakdown in grams. Enter useful model material, discarded flushing, discarded supports and the prime or wipe tower separately. Check whether the slicer includes purging in its tower or support total, and count it only once. Labels differ by slicer version. A total-material figure does not belong in the model field." },
  { q: "Is there a default number of grams per AMS swap?", a: "There is no universal value used here. Flushing depends on the ordered color pair, materials, nozzle and slicer settings. Bambu Studio and PrusaSlicer describe transition volumes in cubic millimeters. A print-specific sliced total is more useful than an unsourced printer preset." },
  { q: "Does the calculator apply my flush multiplier again?", a: "Slicer totals mode never applies a multiplier. In custom estimate mode, keep it at 1 if the average already includes your slicer adjustment. Use a different multiplier only with an unadjusted baseline." },
  { q: "Is material flushed into infill wasted?", a: "Material retained in a useful model is counted as model material here. Flushing into supports is counted in discarded supports if those supports are removed. Never add the same material again as discarded flushing." },
  { q: "Can I reduce flushing?", a: "Compare slices after changing the number of transitions or using suitable infill and purge objects. Calibrate transitions when reducing flushing: dark-to-light changes often need more than the reverse, and mixed materials can affect strength. Test the actual filament combination rather than assuming a fixed saving." },
  { q: "Will this work for Prusa MMU or other systems?", a: "Yes, if you enter separate, non-overlapping material totals. Systems may combine purging and tower material differently. The estimate mode accepts grams or cubic millimeters per swap; it does not accept millimeters of filament length." },
];

export default function AmsPurgeWastePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", name: "AMS Purge Waste Calculator", applicationCategory: "UtilityApplication", operatingSystem: "Any (web)", url: `${SITE.url}/tools/ams-purge-waste-calculator`, description: DESCRIPTION, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      { "@type": "FAQPage", mainEntity: FAQ.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
    ],
  };
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mb-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl"><Highlight3D>AMS Purge Waste Calculator</Highlight3D></h1>
        <p className="mt-2 text-muted-foreground">See what your multi-color print consumes, what gets discarded and what the material costs. Start with your slicer&apos;s grams, or make a custom estimate from your own average per swap.</p>
      </header>
      <AdSlot slot="top" className="mb-6" />
      <Suspense fallback={<div className="h-[400px]" />}><Calculator /></Suspense>
      <AffiliatePicks pagePath="/tools/ams-purge-waste-calculator" className="mx-auto mt-8 max-w-3xl" />

      <section className="mx-auto mt-12 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">How to get a useful result</h2>
        <p className="text-sm leading-6 text-muted-foreground">Slice the entire plate with your actual printer, filament and color assignments. Compare the material breakdown with the categories above. If your slicer reports one combined tower-and-purge amount, enter it once as tower material. If it includes startup lines in another category, leave those out of the extra field.</p>
        <p className="text-sm leading-6 text-muted-foreground">The calculator does not inspect a print file. Slicer totals are predictions, and startup procedures or the real print can consume a different amount. Weighing the output and discarded material after a print is a useful check.</p>
        <p className="rounded-lg border bg-muted/30 p-3 text-xs leading-5 text-muted-foreground">Accuracy update, September 2026: removed unsourced grams-per-swap hardware presets. Older saved links remain available as labeled legacy estimates. Their arithmetic is preserved, but their assumed average needs checking.</p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">The formula and a worked example</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">discarded = flush + support + tower + other<br />consumed = useful_models + discarded<br />material_cost = consumed_g / 1000 × price_per_kg</p>
        <p className="text-sm leading-6 text-muted-foreground">Illustrative plate: 100 g of useful models, 20 g of discarded flushing, 10 g of supports, a 5 g tower and no additional allowance. At $20/kg:</p>
        <ul className="list-disc pl-5 text-sm leading-6 text-muted-foreground">
          <li>Discarded material: 20 + 10 + 5 = 35 g, costing $0.70.</li>
          <li>Total consumed: 100 + 35 = 135 g, costing $2.70.</li>
          <li>Discarded share: 35 / 135 = 25.9% of total material.</li>
          <li>Overhead relative to the useful models: 35 / 100 = 35%.</li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">Those last two percentages use different denominators. Neither is a manufacturer benchmark. For a single-color comparison, slice that version too: it may also need supports, brims and startup material.</p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Custom estimates: grams and cubic millimeters</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">average_g = average_mm³ × density_g_per_cm³ / 1000<br />estimated_flush_g = swaps × average_g × baseline_multiplier</p>
        <p className="text-sm leading-6 text-muted-foreground">For an illustrative average of 400 mm³ per transition and a density of 1.24 g/cm³, each transition uses 0.496 g. Forty transitions at multiplier 1 use 19.84 g. This is a conversion example, not a recommended flush setting.</p>
        <p className="text-sm leading-6 text-muted-foreground">Use an average that reflects your actual transitions and excludes material already counted in models, supports or the tower. If you only know one matrix cell, it may not represent the plate. Bambu Studio&apos;s displayed matrix can already include its multiplier, so do not apply it again.</p>
      </section>

      <section className="mx-auto mt-10 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Sources and ways to reduce waste</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm leading-6 text-muted-foreground">
          <li><a href="https://github.com/bambulab/BambuStudio/blob/master/resources/web/flush/WipingDialog.html" className="text-primary underline underline-offset-4">Bambu Studio flushing dialog source</a> documents mm³ per filament pair and the display multiplier.</li>
          <li><a href="https://help.prusa3d.com/article/purging-volumes-mmu_125097" className="text-primary underline underline-offset-4">Prusa&apos;s purging volumes guide</a> explains why dark-to-light and light-to-dark transitions differ. Its examples are not universal defaults.</li>
          <li><a href="https://github.com/OrcaSlicer/OrcaSlicer/wiki/multimaterial_settings_flush_options" className="text-primary underline underline-offset-4">OrcaSlicer flush options</a> describe flushing into infill and supports. Check the effect in the sliced preview and test for color showing through walls.</li>
          <li><a href="https://store.bblcdn.com/s7/default/b189de92249a4b9ebed28b8ea1f080f0/Bambu_PLA_Basic_Technical_Data_Sheet.pdf" className="text-primary underline underline-offset-4">Bambu PLA Basic datasheet</a> supplies the 1.24 g/cm³ density used in the conversion example. Other filaments can differ.</li>
        </ul>
        <p className="text-sm leading-6 text-muted-foreground">Printing several identical objects on one plate can share color transitions. Printing separate colored parts may avoid some transitions entirely. Compare the resulting slices; the savings depend on the model. The tool does not prescribe a universal safe multiplier or a guaranteed percentage reduction.</p>
        <p className="text-sm leading-6 text-muted-foreground">For a fuller comparison, read <Link href="/guides/multi-color-printing-ams-worth-it" className="text-primary underline underline-offset-4">when multi-color printing is worth the extra material</Link>.</p>
      </section>
      <AdSlot slot="inline" className="mx-auto my-10 max-w-3xl" />
      <section className="mx-auto max-w-3xl space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Frequently asked</h2>
        <dl className="space-y-4">{FAQ.map((item) => <div key={item.q} className="space-y-1"><dt className="font-medium text-foreground">{item.q}</dt><dd className="text-sm leading-6 text-muted-foreground">{item.a}</dd></div>)}</dl>
      </section>
      <RelatedContent pagePath="/tools/ams-purge-waste-calculator" className="mx-auto mt-10 max-w-3xl" />
    </div>
  );
}
