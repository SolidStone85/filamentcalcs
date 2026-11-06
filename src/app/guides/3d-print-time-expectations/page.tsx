import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AdSlot } from "@/components/shared/AdSlot";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { AuthorBio } from "@/components/shared/AuthorBio";
import { AuthorByline } from "@/components/shared/AuthorByline";
import { GuideImageCredit } from "@/components/shared/GuideImageCredit";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { AUTHOR_JSONLD } from "@/lib/author";
import { calculatePrintTime } from "@/lib/formulas/printTime";
import { getGuide } from "@/lib/guides";
import { SITE } from "@/lib/tools";

const SLUG = "3d-print-time-expectations";
const guide = getGuide(SLUG)!;
const UPDATED_AT = "2026-11-06";

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

const FAQ = [
  { q: "Why can my slicer estimate differ from elapsed time?", a: "The estimate depends on the selected printer profile and its motion settings. Startup routines, firmware limits, cooling waits, pauses and changes made at the printer can affect elapsed time. Compare predicted and actual durations for comparable jobs. This guide has no controlled test supporting a universal error percentage or a ranking of slicer accuracy." },
  { q: "Is faster printing always worse quality?", a: "Quality depends on the printer, material, geometry and profile. Motion limits, cooling and the hotend's flow capacity can constrain a usable speed. Use the maker's profile as a starting point and compare small test parts; there is no single speed that suits every printer and filament." },
  { q: "Does halving layer height double print time?", a: "It increases the number of layers for the same height, but total time also depends on paths, speeds, travel and cooling. Re-slice the same model at both settings instead of assuming an exact multiplier." },
  { q: "Can I leave my printer running overnight?", a: "Follow your printer manufacturer's safety instructions. Thermal protection and a webcam do not make unattended operation safe by themselves. Prusa explicitly advises against leaving its printers switched on unattended. Plan long jobs for times when you can provide the supervision your printer requires." },
  { q: "What share of the job does the first layer take?", a: "There is no fixed percentage. The footprint, first-layer speed, startup sequence and number of later layers all matter. Inspect the sliced preview and compare it with your printer's actual startup and first-layer time." },
];

const EXAMPLES = [
  { grams: 60, throughput: 10 },
  { grams: 60, throughput: 20 },
  { grams: 60, throughput: 30 },
  { grams: 150, throughput: 20 },
];

export default function GuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", headline: guide.title, description: guide.description,
        datePublished: guide.publishedAt, dateModified: UPDATED_AT,
        author: AUTHOR_JSONLD, publisher: { "@type": "Organization", name: SITE.name },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/guides/${SLUG}` } },
      { "@type": "FAQPage", mainEntity: FAQ.map((item) => ({ "@type": "Question", name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a } })) },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Guide · {guide.readMinutes} min read</p>
        <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl"><Highlight3D>{guide.title}</Highlight3D></h1>
        <AuthorByline updatedLabel="Reviewed November 6, 2026 (UTC)" />
      </header>

      <figure className="my-8">
        <Image src="/images/guides/printer-makers-party.jpg" alt="A 3D printer mid-print at a maker community event"
          width={4928} height={3264} className="w-full h-auto rounded-lg object-cover max-h-96" priority />
        <figcaption className="mt-2 text-xs text-muted-foreground">
          A printer at a maker event; this photograph is not a timed performance test.
          <GuideImageCredit image="printer-makers-party.jpg" />
        </figcaption>
      </figure>

      <AdSlot slot="top" className="my-8" />
      <AffiliatePicks pagePath={`/guides/${SLUG}`} className="my-8" />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-5 text-sm leading-7">
        <p>
          For a specific model, start by slicing it for your intended printer,
          material and settings. Weight alone cannot describe the toolpath. A
          weight-based calculation is useful earlier in planning, when you need
          a rough duration and understand the assumed average rate.
        </p>
        <p>
          FilamentCalcs has not conducted controlled printer timing tests. The
          examples below are calculations from explicit assumptions, not measured
          Benchy times or comparisons between Bambu, Prusa and Creality machines.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Estimate hours from a comparable job</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">
          average_g_per_hour = grams_consumed / elapsed_hours<br />
          estimated_hours = planned_grams / average_g_per_hour
        </p>
        <p>
          Suppose a previous comparable job used 60 g in three elapsed printing
          hours. Its average was 20 g/hour. At that assumed rate, 150 g would take
          7.5 hours. That does not establish how fast a different shape or profile
          will print. Include supports and other consumed material consistently
          in both records, and use the same start/end definition for elapsed time.
        </p>
        <p>
          Average grams per elapsed hour is different from a hotend&apos;s maximum
          volumetric flow in mm³/s. Whole-job time includes movements without
          extrusion and other delays. Multiplying a peak flow limit by density
          does not establish a whole-print average.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Illustrative time calculations</h2>
        <p>
          The rates in this table are assumed inputs. Each result is weight
          divided by the stated rate, using the same formula as the calculator.
          They are not verified printer-class averages or promises for a downloaded model.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <caption className="px-3 py-2 text-left">Examples using assumed average throughput</caption>
            <thead className="bg-muted/50 text-left"><tr>
              <th className="px-3 py-2" scope="col">Filament</th>
              <th className="px-3 py-2" scope="col">Assumed average</th>
              <th className="px-3 py-2" scope="col">Calculated duration</th>
            </tr></thead>
            <tbody>{EXAMPLES.map((row) => (
              <tr key={`${row.grams}-${row.throughput}`} className="border-t">
                <td className="px-3 py-2">{row.grams} g</td>
                <td className="px-3 py-2">{row.throughput} g/hour</td>
                <td className="px-3 py-2">
                  <Link href={`/tools/print-time-estimator?g=${row.grams}&p=custom&t=${row.throughput}`} className="underline">
                    {calculatePrintTime({ gramsUsed: row.grams, throughputGramsPerHour: row.throughput }).formatted}
                  </Link>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <p>
          Open an example to change the inputs in the{" "}
          <Link href="/tools/print-time-estimator" className="underline underline-offset-4">Print Time Estimator</Link>.
          Its named-printer presets are illustrative starting assumptions, not
          manufacturer specifications. Choose Custom to use your own comparable record.
          Rounding the answer to a minute does not imply minute-level accuracy.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Why equal-weight prints can take different times</h2>
        <ul className="list-disc pl-5 space-y-2 marker:text-primary">
          <li><strong>Paths and motion:</strong> short moves and travel between separate parts change how much time is spent extruding. Commanded speed is not the speed reached throughout every move.</li>
          <li><strong>Layer height and detail:</strong> more layers, fine features and overhang settings change the path and speed mix. Re-slice to compare.</li>
          <li><strong>Cooling:</strong> minimum layer time can slow small layers so they cool before the next pass.</li>
          <li><strong>Infill and supports:</strong> these change both consumed material and toolpaths. Use final sliced grams when they are already included.</li>
          <li><strong>Material changes:</strong> unloading, loading, flushing and travel add time. Use the actual multi-color slice rather than a fixed seconds-per-swap rule.</li>
        </ul>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Check the slicer profile before adding a timing allowance</h2>
        <p>
          Use the correct printer profile and check that its motion settings match
          your machine. Prusa&apos;s documentation explains that its time estimate
          accounts for acceleration and other profile settings. A mismatch can
          change the prediction. This guide has no controlled evidence for claiming
          one slicer is always more accurate than another.
        </p>
        <p>
          Log the sliced estimate, actual elapsed time and any separately timed
          startup or handling. Choose an allowance from comparable records and the
          consequence of finishing late. Do not add startup twice if it is already
          included in the duration you are using. No universal percentage buffer
          guarantees a completion time.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Plan long jobs around supervision</h2>
        <p>
          Follow the printer&apos;s safety instructions when deciding when to start.
          Prusa advises against leaving its printers switched on unattended.
          Thermal protection or a camera does not override the manufacturer&apos;s
          instructions. Check that you have enough filament and plan a time when
          you can provide the required supervision; splitting the model can be an
          alternative when a continuous run is impractical.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Sources and references</h2>
        <p className="text-xs text-muted-foreground">Checked November 6, 2026. These explain settings and safety; they do not validate the illustrative rates above.</p>
        <ul className="list-disc pl-5 space-y-2 text-xs leading-6 marker:text-primary">
          <li><a href="https://help.prusa3d.com/article/faq-prusaslicer_1789" className="underline" rel="noreferrer">PrusaSlicer FAQ</a>: matching printer profiles and print-time estimation.</li>
          <li><a href="https://help.prusa3d.com/article/speed-settings_480325" className="underline" rel="noreferrer">PrusaSlicer speed settings</a>: acceleration and actual move speeds.</li>
          <li><a href="https://help.prusa3d.com/article/extruder-blob_2005" className="underline" rel="noreferrer">Prusa extruder-blob guidance</a>: supervision and first-layer problems.</li>
          <li><Link href="/methodology" className="underline">FilamentCalcs methodology</Link>: formula assumptions and limits.</li>
        </ul>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Frequently asked</h2>
        <dl className="space-y-4">{FAQ.map((item) => (
          <div key={item.q} className="space-y-1"><dt className="font-medium">{item.q}</dt>
            <dd className="text-sm leading-7 text-muted-foreground">{item.a}</dd></div>
        ))}</dl>
      </div>

      <AuthorBio />
      <RelatedContent pagePath={`/guides/${SLUG}`} className="mt-8" />
      <AdSlot slot="inline" className="my-10" />
    </article>
  );
}
