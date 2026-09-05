import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AdSlot } from "@/components/shared/AdSlot";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { AuthorBio } from "@/components/shared/AuthorBio";
import { AuthorByline } from "@/components/shared/AuthorByline";
import { GuideImagePlaceholder } from "@/components/shared/GuideImagePlaceholder";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { AUTHOR_JSONLD } from "@/lib/author";
import { getGuide } from "@/lib/guides";
import { SITE } from "@/lib/tools";

const SLUG = "best-3d-printer-under-300";
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
    q: "Does under $300 include filament, shipping and tax?",
    a: "The price comparison uses US-dollar base-printer listings before tax, shipping and add-ons. If $300 is your complete budget, leave room for filament and the delivered total. A Combo or accessory bundle is a different purchase from the base printer.",
  },
  {
    q: "Will a 500 mm/s printer finish the same job faster?",
    a: "A maximum toolhead or printing speed is not an average speed for a whole model. Acceleration, material flow, cooling, geometry and your quality settings affect completion time. Slice the same model with each printer's appropriate profile and compare total time and material use.",
  },
  {
    q: "Can these printers print TPU?",
    a: "The manufacturers list TPU support, but the filament's hardness, dryness and profile still matter. These printers use direct-drive extruders; a moving bed does not make a printer Bowden-fed. Check the exact TPU and feeding-system compatibility, and follow its recommended profile instead of applying one speed limit to every flexible filament.",
  },
  {
    q: "Should I buy the largest build volume I can afford?",
    a: "First put a few models you actually want to make into a slicer. Allow space for supports and brims, and check the complete printer footprint and bed travel. A larger plate helps when it avoids splitting a needed part; unused volume does not itself improve print quality.",
  },
  {
    q: "Will a budget printer become obsolete quickly?",
    a: "There is no dependable replacement timetable. Check current spare-part availability, manufacturer documentation and firmware support. A newer release does not stop a working printer from producing the models and materials it already handles.",
  },
];

const SPECS = [
  {
    printer: "Bambu A1 mini",
    price: "$219",
    volume: "180 × 180 × 180",
    multicolor: "AMS lite add-on / Combo",
    budget: "Under $300 before extras",
    source: "https://us.store.bambulab.com/products/a1-mini",
  },
  {
    printer: "Bambu A1",
    price: "$299",
    volume: "256 × 256 × 256",
    multicolor: "Compatible AMS add-on / Combo",
    budget: "Under $300 before extras",
    source: "https://us.store.bambulab.com/products/a1",
  },
  {
    printer: "Creality Ender-3 V3 KE",
    price: "$259",
    volume: "220 × 220 × 240",
    multicolor: "Single filament as supplied",
    budget: "Under $300 before extras",
    source: "https://store.creality.com/products/ender-3-v3-ke-3d-printer",
  },
  {
    printer: "Elegoo Neptune 4 Plus",
    price: "$309",
    volume: "320 × 320 × 385",
    multicolor: "Single filament as supplied",
    budget: "Above $300 at this check",
    source: "https://us.elegoo.com/products/neptune-4-plus-fdm-3d-printer",
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
          src="/images/guides/printer-with-spools.jpg"
          alt="A 3D printer next to colored filament spools on a workbench"
          width={1600}
          height={1067}
          className="w-full h-auto rounded-lg object-cover max-h-96"
          priority
        />
        <figcaption className="mt-2 text-xs text-muted-foreground">
          A desktop FDM setup, not a photograph of the four models compared below. Photo via{" "}
          <a href="https://commons.wikimedia.org/wiki/File:BEETHEFIRST_3D_printer_and_3D-printed_filament_spools.jpg" className="underline" rel="noreferrer">Wikimedia Commons</a>.
        </figcaption>
      </figure>

      <AdSlot slot="top" className="my-8" />
      <AffiliatePicks pagePath={`/guides/${SLUG}`} className="my-8" />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-5 text-sm leading-7">
        <p>
          A useful $300 printer purchase starts with the size of your parts and the complete cost of getting started.
          This guide compares four established options. A printer above the budget belongs on a comparison list, not in an under-$300 recommendation just because it was once on sale.
        </p>
        <p>
          This is a specification and budget comparison using manufacturer sources, not a hands-on reliability test.
          Prices shown are indicative US-store base-printer listings in USD, checked September 5, 2026 UTC (September 4 Pacific), before tax, shipping and accessories.
          Select the US region and the base printer, not a Combo, when checking Bambu prices. Affiliate offers may differ from the manufacturer listings.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Four options, with the budget boundary visible</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-3 py-2 font-semibold">Printer / source</th>
                <th className="px-3 py-2 font-semibold">US price</th>
                <th className="px-3 py-2 font-semibold">Build (mm)</th>
                <th className="px-3 py-2 font-semibold">Multicolor</th>
                <th className="px-3 py-2 font-semibold">Budget status</th>
              </tr>
            </thead>
            <tbody>
              {SPECS.map((row) => (
                <tr key={row.printer} className="border-t border-border">
                  <td className="px-3 py-2 font-medium"><a href={row.source} className="underline" rel="noreferrer">{row.printer}</a></td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{row.price}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{row.volume}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row.multicolor}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row.budget}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Check the linked store for the selected model, stock and delivered total. Neither a crossed-out list price nor a bundle&apos;s starting price proves that your chosen configuration fits the budget.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">A1 mini: the lowest-priced option here at $219</h2>
        <p>
          The $219 base A1 mini leaves more of a $300 budget for filament and delivery costs than the other listings here.
          Bambu lists automatic calibration and a 180 mm cube build volume, making it a candidate for compact organizers,
          accessories and small functional parts. Check your actual models in the slicer before paying for a larger machine.
          The A1 mini&apos;s listed maximum bed temperature is 80°C; Bambu identifies PLA, PETG and TPU among its suitable materials.
        </p>
        <p>
          AMS lite supports up to four colors, but the accessory or Combo price belongs in a separate budget check.
          Standard TPU compatibility with the printer does not establish compatibility with the AMS feeder.
          The practical reason to choose the mini is that its size and supported workflow fit your plans, not an untested promise that it never needs attention.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">A1: a larger plate at $299 before extras</h2>
        <p>
          The A1 expands the build volume to 256 × 256 × 256 mm and lists a 100°C maximum bed temperature.
          At the verified $299 base price, it is worth comparing if your intended parts exceed the mini&apos;s usable space,
          but it leaves only $1 of a $300 total for extras. The $399 A1 Combo was above this budget.
          Bambu&apos;s current listing includes AMS lite and other AMS compatibility options; some need an additional hub. Check the exact connection hardware before buying an add-on.
        </p>
        <p>
          For a used A1, check recall status rather than relying on a seller&apos;s purchase year.
          Bambu published a <a href="https://blog.bambulab.com/a1-recall-update/" className="underline" rel="noreferrer">recall update on February 4, 2024</a>;
          the <a href="https://www.cpsc.gov/Recalls/2024/Bambu-Lab-Recalls-A1-3D-Printers-Due-to-Electric-Shock-and-Fire-Hazards" className="underline" rel="noreferrer">US CPSC notice dated June 13, 2024</a> identifies affected units and the remedy.
          Confirm the particular unit with Bambu and follow the applicable recall instructions. A later resale date is not proof that a recalled unit was repaired.
        </p>

        <GuideImagePlaceholder
          slot="build-volume"
          alt="Build volume comparison between four printers shown as transparent cubes"
          prompt="Clean infographic-style illustration showing four transparent cubes side by side, scaled to represent the build volumes of four 3D printers: 180×180×180mm, 256×256×256mm, 220×220×240mm, and 320×320×385mm. Each cube has its dimensions labeled in cyan-on-dark below it. Minimal flat design, dark background, cyan accents. No printers shown, just the volumes. 16:9 aspect ratio."
        />

        <h2 className="text-xl font-semibold tracking-tight pt-4">Ender-3 V3 KE: a verified sub-$300 listing</h2>
        <p>
          Creality&apos;s US store listed the base KE at $259 during this check. Its 220 × 220 × 240 mm build volume sits between the two Bambu sizes.
          The manufacturer specifies a Sprite direct-drive extruder, automatic leveling and USB or network printing.
          Its vibration-compensation sensor and camera are listed as optional accessories, so include them only if you need them.
        </p>
        <p>
          The KE is a reasonable comparison for single-filament jobs that need more room than the mini.
          Review the <a href="https://wiki.creality.com/en/ender-series/ender-3-v3-ke" className="underline" rel="noreferrer">official setup and maintenance guide</a> before buying.
          Do not assume firmware changes or hardware modifications are warranty-neutral. This guide does not rank its long-term reliability against printers we have not tested side by side.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Neptune 4 Plus: larger, and above this budget</h2>
        <p>
          Elegoo&apos;s US listing was $309 for the ribbon-cable version, with a 320 × 320 × 385 mm build volume.
          It includes Klipper firmware, a direct extruder and X/Y acceleration sensors.
          That size may justify a larger budget for a specific project, but $309 before extras does not qualify as an under-$300 pick.
        </p>
        <p>
          Measure the available workspace and the full motion clearance before choosing it.
          Elegoo notes that this version needs compatible parts and local updates. Buy for a demonstrated size requirement;
          a larger plate alone does not establish better or worse precision than the alternatives.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">A short decision process</h2>
        <ol className="list-decimal pl-5 space-y-3 marker:text-primary">
          <li><strong>Set the delivered budget.</strong> If $300 is a hard total, reserve money for filament and tax before comparing printer prices. Keep an AMS purchase separate.</li>
          <li><strong>Check three intended prints.</strong> Slice representative small, medium and largest parts. Confirm that supports and brims fit, not just the bare model.</li>
          <li><strong>Match the material.</strong> A hot nozzle alone does not make an open-frame printer suitable for every engineering plastic. Read the manufacturer&apos;s material guidance and the filament&apos;s requirements.</li>
          <li><strong>Compare support and upkeep.</strong> Read the assembly instructions, check replacement hotend and plate availability, and understand the local return terms.</li>
          <li><strong>Buy the configuration you priced.</strong> Recheck base printer versus Combo, included accessories and stock. A limited sale is not a permanent recommendation.</li>
        </ol>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Leave room for the first prints</h2>
        <p>
          A hypothetical $259 printer plus a $20 spool is already $279 before tax and any shipping.
          That leaves $21 from a $300 total. This is an example budget, not a quoted filament offer.
          Price only the extras your first jobs need; a dryer, spare plate and multicolor feeder do not all have to be bought on day one.
        </p>
        <p>
          Use your spool price and slicer grams in the <Link href="/tools/filament-cost-calculator" className="text-primary underline-offset-4 hover:underline">filament cost calculator</Link>.
          For electricity, enter measured average power and your utility rate in the <Link href="/tools/electricity-cost-calculator" className="text-primary underline-offset-4 hover:underline">electricity calculator</Link>.
          The power-supply rating is not the printer&apos;s average draw for every hour of a print.
        </p>

        <GuideImagePlaceholder
          slot="checklist"
          alt="Illustrated shopping checklist showing printer plus accessories"
          prompt="Minimalist illustration of a 3D-printer-shopping checklist on a tablet screen, with hand-drawn-style cyan checkmarks beside items: 'Printer', 'Filament spool', 'Spare nozzles', 'Build plate', 'Filament dryer'. Top of tablet shows a small icon of a 3D printer. Dark slate background with cyan accent color. Editorial flat-design style, no humans. 16:9 aspect ratio."
        />

        <h2 className="text-xl font-semibold tracking-tight pt-4">Frequently asked questions</h2>
        {FAQ.map((item) => (
          <div key={item.q} className="space-y-1.5">
            <p className="font-semibold text-foreground">{item.q}</p>
            <p>{item.a}</p>
          </div>
        ))}
      </div>

      <AuthorBio />
      <RelatedContent pagePath={`/guides/${SLUG}`} className="mt-8" />
      <AdSlot slot="inline" className="my-8" />
    </article>
  );
}
