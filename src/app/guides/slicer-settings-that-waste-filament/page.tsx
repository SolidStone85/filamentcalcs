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

const SLUG = "slicer-settings-that-waste-filament";
const guide = getGuide(SLUG)!;

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
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "What's the single setting most people get wrong?",
    a: "Brim width. Default brim is often 8mm wide, which is more material than the part needs for adhesion on most prints. Drop it to 4mm or 5mm and you save 30-50% of the brim filament. On parts that warp anyway you can go to zero brim with a glue stick instead.",
  },
  {
    q: "Does infill pattern really matter for waste?",
    a: "Yes, but less than density. Going from 20% to 40% infill roughly doubles the infill material, regardless of pattern. Pattern affects strength and print time more than waste. Gyroid is a good middle ground for both.",
  },
  {
    q: "What's the deal with 'purge volumes' on Bambu?",
    a: "Bambu Studio has a Flushing volumes matrix that sets how much filament gets purged on each color transition. The default 1.0x multiplier is conservative. Tuned users go to 0.5-0.7x for compatible color pairs. Saves a lot of filament on multi-color prints. The AMS Purge Waste Calculator on this site lets you model the impact.",
  },
  {
    q: "How does retraction affect filament use?",
    a: "Marginally. Bad retraction causes stringing, which adds maybe 1-3% extra material per print. Worth fixing for surface quality more than for waste. Calibrate by printing the temperature tower and retraction tower test prints once for each filament you commonly use.",
  },
  {
    q: "Should I always disable supports if possible?",
    a: "If your model can be reoriented to avoid them, yes. Supports can add 20-50% to material use on overhangs-heavy prints. Tree supports usually use less than grid supports for the same surface coverage, but take longer to print.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Guide · {guide.readMinutes} min read
        </p>
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
          <Highlight3D>{guide.title}</Highlight3D>
        </h1>
        <AuthorByline updatedLabel="Updated May 2026" />
      </header>

      <figure className="my-8">
        <Image
          src="/images/guides/prusaslicer.png"
          alt="PrusaSlicer software showing a 3D model with print settings"
          width={2820}
          height={1974}
          className="w-full h-auto rounded-lg object-cover max-h-96"
          priority
        />
        <figcaption className="mt-2 text-xs text-muted-foreground">
          PrusaSlicer is one of several slicers (alongside Bambu Studio
          and OrcaSlicer) where the settings discussed below live.
          Screenshot via{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:PrusaSlicer.png"
            className="underline"
            rel="noreferrer"
          >
            Wikimedia Commons
          </a>
          .
        </figcaption>
      </figure>

      <AdSlot slot="top" className="my-8" />

      <AffiliatePicks pagePath={`/guides/${SLUG}`} className="my-8" />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-5 text-sm leading-7">
        <p>
          Slicer defaults are not optimized for filament economy. They are
          tuned to produce reliably good prints for the average user with
          the average part. That conservative tuning quietly inflates how
          much filament every print uses, sometimes by 30 percent or more,
          and most cost calculators ignore the inflation entirely.
        </p>

        <p>
          Below are the seven slicer settings with the biggest filament
          impact, ordered by how much you can save per print. Numbers
          assume Bambu Studio defaults; PrusaSlicer and OrcaSlicer
          equivalents are noted where they differ meaningfully.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          1. Flush volumes (multi-color only)
        </h2>
        <p>
          On Bambu AMS prints, the Flushing volumes matrix uses cubic
          millimeters for each ordered filament pair. Grams depend on
          density and the transitions in your plate. There is no universal
          8-gram-per-swap default.
        </p>
        <p>
          Compare the slicer&apos;s discarded-material totals before and after
          a change. For example, reducing discarded flushing from 20 g to
          12 g would save 8 g, or about $0.18 at an assumed $22/kg. This is
          an arithmetic example, not a recommended setting or guaranteed saving.
        </p>
        <p>
          Reducing flushing can leave color or incompatible material behind.
          The direction matters: a dark-to-light transition can need more
          flushing than the reverse. Test the actual combination and inspect
          the sliced preview. The{" "}
          <Link
            href="/tools/ams-purge-waste-calculator"
            className="underline underline-offset-4"
          >
            AMS Purge Waste Calculator
          </Link>{" "}
          shows the dollar impact for any combination.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          2. Brim width and skirt count
        </h2>
        <p>
          Default brim is 8mm wide on most slicer profiles. For a typical
          200mm-perimeter part, that&apos;s ~5 grams of brim material on
          PLA. Most prints adhere fine with 4mm brim or even just a thin
          skirt for nozzle priming.
        </p>
        <p>
          When to keep wide brim: ABS, ASA, large flat PETG parts. When to
          drop it: PLA on a clean PEI bed, anything with substantial bed
          contact area, parts you reprint frequently with known good
          adhesion.
        </p>
        <p>
          A skirt is not a brim. Skirts don&apos;t touch the part and
          serve to prime the nozzle. Default skirt is 2 lines, which uses
          maybe 1 gram. Reducing to 1 line saves half a gram, not worth
          worrying about. The brim is where the savings are.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          3. Infill density
        </h2>
        <p>
          Slicer default infill is 15-20% in most profiles. For display
          parts, 10% is plenty. For mechanical parts that need to bear
          load, 30-40% is justified. The math is roughly linear: doubling
          infill density doubles infill material weight.
        </p>
        <p>
          A 100-gram print at 20% infill uses about 35 grams in the
          infill. At 10% infill that drops to 18 grams, saving 17 grams
          per print, or about $0.37 on PLA. Over a year of printing, that
          adds up if you default everything to 20%.
        </p>
        <p>
          Per-part rule: if it sits on a shelf, 10%. If it gets handled,
          15-20%. If it bears weight or shock, 30-40%. If you really need
          strength, you probably also need to switch to PETG or PA.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          4. Support style and overhang threshold
        </h2>
        <p>
          Tree supports use roughly 30-50% less filament than grid
          supports for the same overhang coverage. Tree takes longer to
          print but uses less material. For most decorative parts, switch
          to tree.
        </p>
        <p>
          Support overhang threshold defaults to 30 degrees in most
          slicers. Most modern printers can handle 45 to 50 degrees with
          good cooling. Raising the threshold from 30 to 45 degrees can
          eliminate supports entirely on parts that don&apos;t actually
          need them.
        </p>
        <p>
          Easiest win: rotate the part on the build plate to put
          overhangs at 45+ degrees instead of horizontal. Sometimes a 90
          degree rotation eliminates all supports.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          5. Wall count and top/bottom layers
        </h2>
        <p>
          Default is 2 walls and 4 top/bottom layers in most profiles.
          For most parts, that&apos;s correct. The setting becomes a
          waste source when slicer defaults give you 3 walls on small
          parts that don&apos;t need them.
        </p>
        <p>
          For thin-walled decorative parts (vases, lampshades), consider
          spiral vase mode (1 wall, no infill, no top layer). The print
          uses dramatically less material.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          6. Layer height (affects time more than material)
        </h2>
        <p>
          Layer height has a modest impact on filament use. Going from
          0.20mm to 0.16mm uses about 5% more material due to the way
          extrusion volume calculations round. The bigger impact is
          time: 0.16mm layers take roughly 25% longer than 0.20mm.
        </p>
        <p>
          For most prints where surface finish doesn&apos;t matter,
          0.24mm or 0.28mm layers print 30-40% faster with negligible
          quality loss. For miniatures and detailed display pieces,
          0.12-0.16mm is justified.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          7. Retraction (waste from stringing, not retraction itself)
        </h2>
        <p>
          Retraction itself uses no extra material; it pulls filament
          back from the nozzle. The waste comes from stringing when
          retraction is dialed wrong. Stringing adds maybe 1-3% material
          per print on average, more if your filament is wet (which is a
          separate problem).
        </p>
        <p>
          Print a temperature tower and retraction tower once per
          filament you use regularly. Bambu Studio and OrcaSlicer have
          built-in calibration prints. The savings are small but the
          quality improvement is significant.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Combined impact: a real example
        </h2>
        <p>
          Take a 200-gram phone case in PETG, default Bambu profile.
          Defaults: 20% infill, 8mm brim, 2 walls, 4 top/bottom layers,
          tree supports off. Slicer estimate: 248 grams including support
          and brim.
        </p>
        <p>
          With tuned settings: 12% infill, 4mm brim, tree supports on with
          45 degree threshold, retraction tuned. Slicer estimate: 198
          grams.
        </p>
        <p>
          Saved: 50 grams per print. At PETG $26/kg, that&apos;s $1.30
          saved per copy. Print 30 copies and you&apos;ve saved $39, or
          enough to buy another spool. The{" "}
          <Link
            href="/tools/filament-cost-calculator"
            className="underline underline-offset-4"
          >
            Filament Cost Calculator
          </Link>{" "}
          can model the exact impact for your specific part.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          What NOT to optimize for waste
        </h2>
        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
          <li>
            Print speed (affects time, not material)
          </li>
          <li>
            Cooling fan settings (affects quality, not material)
          </li>
          <li>
            Bed temperature (only matters if it causes adhesion failures)
          </li>
          <li>
            Acceleration and jerk (affects time and quality, not material)
          </li>
        </ul>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Frequently asked
        </h2>
        <dl className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="space-y-1">
              <dt className="font-medium">{item.q}</dt>
              <dd className="text-sm leading-7 text-muted-foreground">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <AuthorBio />

      <RelatedContent pagePath={`/guides/${SLUG}`} className="mt-8" />

      <AdSlot slot="inline" className="my-10" />

      <nav className="mt-10 rounded-lg border p-5 text-sm">
        <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
          Related calculators and guides
        </p>
        <ul className="space-y-2">
          <li>
            <Link
              href="/tools/filament-cost-calculator"
              className="underline underline-offset-4"
            >
              Filament Cost Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/tools/ams-purge-waste-calculator"
              className="underline underline-offset-4"
            >
              AMS Purge Waste Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/guides/multi-color-printing-ams-worth-it"
              className="underline underline-offset-4"
            >
              Is multi-color printing worth it?
            </Link>
          </li>
          <li>
            <Link
              href="/guides/3d-printing-cost-breakdown"
              className="underline underline-offset-4"
            >
              True cost of a 3D print
            </Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}
