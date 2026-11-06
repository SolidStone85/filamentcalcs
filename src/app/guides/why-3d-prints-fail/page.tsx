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
import { getGuide } from "@/lib/guides";
import { SITE } from "@/lib/tools";

const SLUG = "why-3d-prints-fail";
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
  { q: "What failure rate is normal?", a: "FilamentCalcs has no verified industry benchmark for a normal hobbyist or print-farm failure rate. Compare similar jobs on your own printer using a consistent definition of failure. Zero failures in a recorded batch is possible; it does not guarantee the next attempt will succeed. No recorded attempts means no observed rate." },
  { q: "Why can a print start well and fail later?", a: "Look for the first changed feature or layer: a lifted corner, collision, unsupported area, spool feed problem or extrusion interruption. A good first layer does not rule out later problems. Save the failed part, relevant settings and a photograph so you can investigate the specific symptom." },
  { q: "Can a webcam prevent failures?", a: "It can help you notice a problem, but a camera alone does not stop a printer. Automatic detection and pausing require a supported, configured system and can miss failures. Follow the printer manufacturer's supervision and safety instructions." },
  { q: "Does automatic bed leveling replace first-layer checks?", a: "No. Check the build surface, selected plate and material profile, and the first layer itself. Follow the calibration process for your model; printers differ in whether and how a manual nozzle offset is set." },
  { q: "What should I check after a nozzle change?", a: "Use the replacement and calibration procedure for the exact printer and hotend. Tightening temperature, torque, tools and required calibration differ by design; there is no universal hand-tight rule. Check for leaks or damaged wiring and follow the maker's instructions before printing again." },
];

const CHECKS = [
  {
    title: "First layer does not stick",
    symptoms: "Lines fail to join, lift with the nozzle, or detach from the plate.",
    next: "Check the selected plate and material profile. Clean the surface and calibrate the first layer using the plate and printer maker's instructions. Solvents and adhesion or release products are surface-specific. A brim can help some shapes, but it does not repair a calibration or contamination problem.",
  },
  {
    title: "Popping, bubbles or inconsistent extrusion",
    symptoms: "These can be signs of moisture, although extrusion problems have other possible causes.",
    next: "Check the filament maker's drying instructions and the limits of both spool and dryer. Use the named-product settings in our drying guide rather than one temperature for an entire material family. Store dried filament appropriately and compare a small test before changing several print settings.",
  },
  {
    title: "Under-extrusion or a possible nozzle blockage",
    symptoms: "Walls have gaps, extrusion becomes thin or irregular, or filament stops feeding.",
    next: "Check for a tangled spool, restricted feed path, incorrect profile or extruder problem before assuming the nozzle is blocked. Follow the hotend maker's cleaning or cold-pull procedure. Cold-pull temperatures depend on the material and hotend. Replace parts only with the correct model-specific instructions.",
  },
  {
    title: "Corners curl upward",
    symptoms: "Warping lifts an edge and can lead to detachment or a nozzle collision.",
    next: "Check surface preparation, the material profile and unwanted drafts. A brim or a different orientation may help. Use an enclosure only where the printer and material instructions support it, with the required ventilation. More heat or an enclosure is not a universal fix for every material.",
  },
  {
    title: "Layers suddenly shift sideways",
    symptoms: "A section of the model moves in X or Y while later layers continue above it.",
    next: "Check for obstructions, collisions, pulley alignment and belt condition using the printer's maintenance procedure. Use the maker's belt-tension method rather than a generic tightening instruction. Check whether an altered speed or acceleration profile exceeds what the machine can handle.",
  },
  {
    title: "Strings appear between features",
    symptoms: "Fine strands or blobs remain where the nozzle travels between printed areas.",
    next: "Start with the right material profile, a clean nozzle and dry filament. Review the slicer's retraction and travel settings for your extruder. Change one relevant setting and compare a test; direct-drive and Bowden settings are not interchangeable. Do not assume slower travel or a universal retraction distance will fix it.",
  },
  {
    title: "Loose spaghetti or material collects on the nozzle",
    symptoms: "The printer extrudes without building the intended shape, or a blob starts to accumulate.",
    next: "Stop a failed job following the printer's instructions. Check whether the part or a support detached before it failed. Investigate the original loss of adhesion or support, rather than only removing loose material. A blob around heater wiring needs the manufacturer's removal procedure; do not pull it off by force.",
  },
  {
    title: "Supports collapse or fuse to the model",
    symptoms: "Supported areas sag, supports detach, or removal damages the part.",
    next: "Inspect the sliced support paths, orientation and contact settings. Use the slicer's supported profile for your nozzle, layer height and material. Test support spacing on a small section. Different support materials may need different contact settings and compatible hardware.",
  },
  {
    title: "Bridges sag across a gap",
    symptoms: "Unsupported horizontal strands droop or fail to reach the opposite side.",
    next: "Check bridge direction, span and the slicer's material-specific cooling and bridge settings. Prusa's bridging guide suggests testing reduced bridge speed and flow, not automatically adding more material. Reorient the part or add supports when the span cannot be bridged reliably.",
  },
  {
    title: "The bottom edge spreads outward",
    symptoms: "An elephant's-foot shape makes the first layers wider than the model above them.",
    next: "Inspect first-layer calibration and the bed-temperature profile for the selected plate and material. If the first layer is otherwise correct, test the slicer's elephant-foot compensation on a small fit sample. Avoid copying a nozzle-offset adjustment from a different printer design.",
  },
  {
    title: "Filament stops before the job finishes",
    symptoms: "The spool empties, tangles or meets resistance in the feed path.",
    next: "Weigh the remaining filament after subtracting the correct spool tare and compare with the complete sliced consumption, including supports and flushing. Run-out can occur at any job weight if the spool is partly used. Check any run-out sensor and recovery feature in your model's manual.",
  },
  {
    title: "The sliced job differs from what you intended",
    symptoms: "Unexpected supports, missing features, an unusual duration, or a wrong material/nozzle selection.",
    next: "Verify printer, nozzle, plate and material profiles, then inspect the layer preview and consumption summary. Keep the last known-good project so you can compare one change at a time. A successful small test reduces uncertainty but does not guarantee a long or different print.",
  },
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
        <Image src="/images/guides/spaghetti-fail.jpg" alt="A failed 3D print resembling tangled spaghetti on the print bed"
          width={1536} height={2048} className="w-full h-auto rounded-lg object-cover max-h-96" priority />
        <figcaption className="mt-2 text-xs text-muted-foreground">
          A spaghetti-type failure. Record what detached or stopped working first.
          <GuideImageCredit image="spaghetti-fail.jpg" />
        </figcaption>
      </figure>
      <AdSlot slot="top" className="my-8" />
      <AffiliatePicks pagePath={`/guides/${SLUG}`} className="my-8" />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-5 text-sm leading-7">
        <p>
          Start with the symptom and the point where the print first went wrong.
          These twelve checks are a troubleshooting index, not a measured ranking
          by frequency. This is research-based guidance; FilamentCalcs does not
          claim hands-on tests of the printers or fixes discussed here.
        </p>
        <p>
          The <Link href="/tools/failure-rate-calculator" className="underline underline-offset-4">Failure Rate Calculator</Link>{" "}
          tracks your recorded attempts and estimated lost material. This site has
          no verified industry benchmark for a normal hobbyist or print-farm
          failure rate. Its display bands are descriptive tracking ranges, not a
          diagnosis. Compare similar jobs, keep the sample size, and use the same
          definition of failure over time.
        </p>

        {CHECKS.map((item, index) => (
          <section key={item.title} className="space-y-3 pt-4">
            <h2 className="text-xl font-semibold tracking-tight">{index + 1}. {item.title}</h2>
            <p>{item.symptoms}</p><p>{item.next}</p>
          </section>
        ))}

        <h2 className="text-xl font-semibold tracking-tight pt-4">Record failures and the material they actually consumed</h2>
        <p>
          Keep the model, profile, material, outcome, failed layer or feature, and
          discarded grams beside each attempt. Nine successes and one failure
          give an observed 10% failure rate. If that failed attempt used 5 g at
          $20/kg, its material loss is $0.10. The intended weight of the completed
          part does not tell you how much an early failure consumed.
        </p>
        <p>
          Include discarded supports or purge consistently if you want them in
          your failed-attempt average. Keep ordinary successful-print consumption
          separate and count each gram once. Electricity, machine time and labor
          are additional costs outside this material-loss calculation.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Sources and next checks</h2>
        <p className="text-xs text-muted-foreground">Checked November 6, 2026. Apply the instructions for your own model; these sources do not establish an industry failure rate.</p>
        <ul className="list-disc pl-5 space-y-2 text-xs leading-6 marker:text-primary">
          <li><a href="https://www.klipper3d.org/Bed_Level.html" className="underline" rel="noreferrer">Klipper bed leveling</a>: choose the calibration method for the machine.</li>
          <li><Link href="/guides/how-to-dry-filament" className="underline">Drying guide with named-product manufacturer sources</Link>: filament, spool and equipment limits.</li>
          <li><a href="https://help.prusa3d.com/article/layer-shifting_2020" className="underline" rel="noreferrer">Prusa layer shifting</a>: obstructions, pulleys and model-specific belt checks.</li>
          <li><a href="https://help.prusa3d.com/article/stringing-and-oozing_1805" className="underline" rel="noreferrer">Prusa stringing and oozing</a>: profile and retraction checks.</li>
          <li><a href="https://help.prusa3d.com/article/poor-bridging_1802" className="underline" rel="noreferrer">Prusa poor bridging</a>: speed, flow, cooling and orientation.</li>
          <li><a href="https://help.prusa3d.com/article/warping_2011" className="underline" rel="noreferrer">Prusa warping</a>: material and environment considerations.</li>
          <li><a href="https://help.prusa3d.com/article/extruder-blob_2005" className="underline" rel="noreferrer">Prusa extruder blobs</a>: first-layer checks, removal precautions and supervision.</li>
          <li><a href="https://help.prusa3d.com/article/changing-or-replacing-the-nozzle-mk2-5-s-mk3-s-mk3-5-s_2069" className="underline" rel="noreferrer">Prusa MK2.5/MK3 nozzle procedure</a> and <a href="https://help.prusa3d.com/guide/how-to-replace-the-prusa-nozzle-mk4-mk3-9_421215" className="underline" rel="noreferrer">MK4/MK3.9 nozzle procedure</a>: examples of why replacement instructions differ by hotend.</li>
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
