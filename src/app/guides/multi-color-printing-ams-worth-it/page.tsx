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

const SLUG = "multi-color-printing-ams-worth-it";
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
    q: "How many grams does AMS waste per color change?",
    a: "There is no single manufacturer-wide grams-per-change value. Transition colors, material, printer profile and slicer settings affect flushing. Use the sliced plate's final filament breakdown. A flushing-volume matrix is measured in cubic millimeters, not grams; converting it requires material density and the actual number of each transition.",
  },
  {
    q: "Does a high waste percentage mean a print is not worth making?",
    a: "No universal percentage decides that. Compare the extra material and machine time with the value of the finished print and the effort of painting or assembling separate pieces. A small print can have a high waste share but a low extra dollar cost. For selling, include labor, failures and fees as well.",
  },
  {
    q: "Will a purge bucket reduce the filament used?",
    a: "A bucket collects discarded filament; it does not change the slicer's flushing requirement. A prime tower has a different job, helping prepare extrusion after a change. Follow the printer and slicer guidance instead of removing the tower just because a bucket is installed.",
  },
  {
    q: "Should I apply the flush multiplier to the final slicer grams?",
    a: "No. Final sliced amounts already reflect the settings used to produce them. Enter those grams once. A multiplier belongs only in a rough estimate whose source baseline has not already had that multiplier applied.",
  },
  {
    q: "How much extra time does multi-color printing take?",
    a: "Slice the same plate in single-color and multi-color and compare the total times. Loading, unloading, flushing, wiping, the tower and printer-specific routines all contribute. A fixed seconds-per-change rule cannot reliably predict every printer and profile.",
  },
  {
    q: "Are separate toolheads or manual color changes waste-free?",
    a: "Separate nozzles can reduce the need to flush one material out of a shared nozzle, but priming, wiping and startup material may remain. Manual color changes can work for color bands at selected heights, but still need a clean transition and your attention. Compare the actual sliced jobs rather than assuming zero waste.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Guide · {guide.readMinutes} min read</p>
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl"><Highlight3D>{guide.title}</Highlight3D></h1>
        <AuthorByline updatedLabel="Reviewed September 5, 2026 (UTC)" />
      </header>

      <figure className="my-8">
        <Image
          src="/images/guides/bambu-x1c-ams.jpg"
          alt="Bambu Lab X1 Carbon 3D printer with the AMS multi-material module attached"
          width={2380}
          height={3480}
          className="w-full h-auto rounded-lg object-cover max-h-96"
          priority
        />
        <figcaption className="mt-2 text-xs text-muted-foreground">
          Bambu Lab X1 Carbon with an AMS module. Material use depends on the sliced job. Photo via{" "}
          <a href="https://commons.wikimedia.org/wiki/File:Bambu_Lab_X1_Carbon_with_AMS_module_(cropped).jpg" className="underline" rel="noreferrer">Wikimedia Commons</a>.
        </figcaption>
      </figure>

      <AdSlot slot="top" className="my-8" />
      <AffiliatePicks pagePath={`/guides/${SLUG}`} className="my-8" />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-5 text-sm leading-7">
        <p>
          Multi-color printing can save painting and assembly work, but color changes can also use extra filament and machine time.
          The useful question is how much extra your particular plate costs. Start with the slicer totals, then decide whether the result is worth that difference.
        </p>
        <p>
          This is a calculation guide based on the manufacturer and slicer documentation linked below.
          The worked example is illustrative, not a measured printer test. Sources were reviewed September 5, 2026 UTC (September 4 Pacific).
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Why a color change uses material</h2>
        <p>
          In a shared-nozzle system, some of the old material remains in the hotend when the new filament arrives.
          Flushing clears that transition. Different color directions need different amounts: a dark pigment can be harder to clear before printing a light color.
          Prusa&apos;s <a href="https://help.prusa3d.com/article/purging-volumes-mmu_125097?product=mmu3" className="underline" rel="noreferrer">purging-volume explanation</a> shows this with example values in mm³. Those examples are not Bambu defaults.
        </p>
        <p>
          Flushing and a prime tower are separate entries to check. Some material is discarded, some may go into supports,
          and supported slicer settings can redirect some into a useful object&apos;s infill. Where the material ends up matters when counting waste.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Use the final sliced plate totals</h2>
        <ol className="list-decimal pl-5 space-y-2 marker:text-primary">
          <li>Slice the exact models, colors and settings you intend to print. Read the material breakdown in the preview or statistics view; labels vary by slicer version.</li>
          <li>Separate useful model material, supports, discarded flushing, tower material, and any additional startup or calibration material you have measured.</li>
          <li>Count each gram once. If a total already includes supports or flushing, do not add that category again. Material flushed into useful infill remains model material; flushing into supports belongs in the support total.</li>
          <li>Enter those amounts in the <Link href="/tools/ams-purge-waste-calculator" className="underline underline-offset-4">AMS Purge Waste Calculator</Link>. Do not apply another flush multiplier to final sliced grams.</li>
        </ol>
        <p>
          In this calculator, discarded material means supports + discarded flushing + tower + other discarded material.
          Total consumed is useful model material + discarded material. The waste share is discarded material divided by total consumed;
          waste overhead is discarded material divided by useful model material. These are different percentages.
        </p>
        <p>
          If your slicer gives only an aggregate total, do not invent a category breakdown. Use the total for a material-cost comparison,
          or obtain the detailed breakdown before estimating waste. Slicer figures remain estimates; weighing the finished parts and collected waste can help check them.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Worked example: the same useful part, two versions</h2>
        <p>
          These are hypothetical final totals for a 100 g useful part. All material costs $20/kg; no printer model, default purge amount or print speed is assumed.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 text-left"><tr><th className="px-3 py-2">Material</th><th className="px-3 py-2">Single color</th><th className="px-3 py-2">Multi-color</th></tr></thead>
            <tbody>
              <tr className="border-t border-border"><th className="px-3 py-2 text-left font-medium">Useful model</th><td className="px-3 py-2">100 g</td><td className="px-3 py-2">100 g</td></tr>
              <tr className="border-t border-border"><th className="px-3 py-2 text-left font-medium">Supports</th><td className="px-3 py-2">5 g</td><td className="px-3 py-2">5 g</td></tr>
              <tr className="border-t border-border"><th className="px-3 py-2 text-left font-medium">Discarded flushing</th><td className="px-3 py-2">0 g</td><td className="px-3 py-2">20 g</td></tr>
              <tr className="border-t border-border"><th className="px-3 py-2 text-left font-medium">Tower</th><td className="px-3 py-2">0 g</td><td className="px-3 py-2">8 g</td></tr>
              <tr className="border-t border-border"><th className="px-3 py-2 text-left font-medium">Other startup waste</th><td className="px-3 py-2">2 g</td><td className="px-3 py-2">2 g</td></tr>
              <tr className="border-t border-border"><th className="px-3 py-2 text-left font-medium">Total consumed</th><td className="px-3 py-2">107 g</td><td className="px-3 py-2">135 g</td></tr>
              <tr className="border-t border-border"><th className="px-3 py-2 text-left font-medium">Material cost</th><td className="px-3 py-2">$2.14</td><td className="px-3 py-2">$2.70</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The extra material costs $0.56: (135 − 107) ÷ 1,000 × $20. The multi-color version discards 35 g,
          which is 25.9% of its total consumption and 35% overhead relative to the useful part.
          Neither percentage alone tells you whether saving the painting work is worth $0.56 plus the extra print time.
        </p>
        <p>
          If the colors have different prices, calculate each spool&apos;s consumed grams × its price per gram and add the costs.
          A single-price calculator needs an average weighted by the amount consumed from each spool.
          For a selling price, add machine time, labor and failures in the <Link href="/tools/print-pricing-calculator" className="underline underline-offset-4">print pricing calculator</Link>.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Estimate from swaps only when you lack sliced totals</h2>
        <p>
          A rough estimate needs your own average purge amount from a comparable profile and transition mix.
          For a volume input, grams = swaps × average mm³ per swap × density in g/cm³ ÷ 1,000.
          Add tower, supports and other discarded material separately. An average hides differences between transitions, so replace it with a fresh slice before committing to a long job.
        </p>
        <p>
          Bambu Studio&apos;s <a href="https://github.com/bambulab/BambuStudio/blob/master/resources/web/flush/WipingDialog.html" className="underline" rel="noreferrer">flushing-volume interface</a> uses mm³ and applies a multiplier to the displayed matrix values.
          If your baseline already includes that adjustment, use a multiplier of 1 in a separate estimate. There is no fixed 8 g-per-change default used in this guide.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Reduce waste by comparing two slices</h2>
        <ul className="list-disc pl-5 space-y-2 marker:text-primary">
          <li><strong>Change orientation or split the model.</strong> Color bands at a few heights, or separate colored pieces assembled afterward, may need fewer transitions. Check fit, strength and assembly effort too.</li>
          <li><strong>Batch copies you actually need.</strong> With layer-by-layer printing, identical copies can share color changes within a layer. Compare waste per useful copy in the slicer; arranging a plate differently can change the result.</li>
          <li><strong>Use a tested transition matrix.</strong> Adjust one color pair at a time and check for contamination. A lower flushing value that spoils the print does not save material.</li>
          <li><strong>Use infill or support flushing where suitable.</strong> Mixed colors can show through light or translucent walls. OrcaSlicer&apos;s <a href="https://github.com/OrcaSlicer/OrcaSlicer/wiki/multimaterial_settings_flush_options" className="underline" rel="noreferrer">flush-options documentation</a> also specifies a prime-tower requirement for these options. Follow your own slicer&apos;s guidance.</li>
        </ul>
        <p>
          Record the before-and-after consumed grams, total time and acceptable finished results. A claimed universal 30–50% saving,
          or a fixed 50% waste cutoff, cannot replace that comparison. Include the actual compatible AMS hardware and accessories in the purchase budget;
          storage and collection accessories serve different purposes from reducing purge.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Frequently asked</h2>
        <dl className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="space-y-1">
              <dt className="font-medium">{item.q}</dt>
              <dd className="text-sm leading-7 text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>

      <AuthorBio />
      <RelatedContent pagePath={`/guides/${SLUG}`} className="mt-8" />
      <AdSlot slot="inline" className="my-10" />
      <nav className="mt-10 rounded-lg border p-5 text-sm">
        <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">Calculators referenced in this guide</p>
        <ul className="space-y-2">
          <li><Link href="/tools/ams-purge-waste-calculator" className="underline underline-offset-4">AMS Purge Waste Calculator</Link></li>
          <li><Link href="/tools/filament-cost-calculator" className="underline underline-offset-4">Filament Cost Calculator</Link></li>
          <li><Link href="/tools/material-comparison" className="underline underline-offset-4">Material Comparison</Link></li>
        </ul>
      </nav>
    </article>
  );
}
