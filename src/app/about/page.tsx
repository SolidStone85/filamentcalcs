import type { Metadata } from "next";
import Link from "next/link";

import { ORGANIZATION_JSONLD } from "@/lib/author";
import { SITE } from "@/lib/tools";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.name}.com: who runs it, why it exists, and how the calculators work.`,
  alternates: { canonical: `${SITE.url}/about` },
};

export default function AboutPage() {
  // AboutPage schema referencing the site Organization. No personal
  // Profile; the site is operated as an editorial entity.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        url: `${SITE.url}/about`,
        name: `About ${SITE.name}.com`,
        mainEntity: { "@id": `${SITE.url}/#organization` },
      },
      {
        "@id": `${SITE.url}/#organization`,
        ...ORGANIZATION_JSONLD,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="text-3xl font-semibold tracking-tight">About {SITE.name}.com</h1>
      <div className="mt-6 space-y-4 text-sm leading-6 text-muted-foreground">
        <p>
          {SITE.name}.com is an independent utility site built to organize
          common 3D printing cost, filament, electricity, and slicer
          calculations in one place. Formulas are documented on the{" "}
          <Link href="/methodology" className="underline underline-offset-4">
            methodology page
          </Link>
          , source data is linked, and corrections can be reported via the{" "}
          <Link href="/contact" className="underline underline-offset-4">
            contact page
          </Link>
          .
        </p>
        <p>
          Every calculation runs in your browser. No account is
          required. URLs include your inputs
          so you can bookmark a result or share it in a Reddit thread or
          Discord channel.
        </p>

        <h2 className="pt-4 text-lg font-semibold tracking-tight">
          How the site is operated
        </h2>
        <p>
          {SITE.name}.com is operated as an independent editorial
          reference. It is not affiliated with any printer or filament
          manufacturer, slicer team, or distributor. Some pages include
          Amazon affiliate links, but the site does not accept manufacturer
          sponsorships or paid product reviews.
        </p>
        <p>
          This is a research-based reference. We do not operate a print farm
          or claim to have personally tested the printers in our guides.
          Manufacturer specifications and slicer documentation are linked
          where used. Presets are starting assumptions, and your measurements
          are the better input for a particular printer or job.
        </p>
        <p>
          Reader reports help identify corrections. To report a wrong default or a stale
          price is the{" "}
          <Link href="/contact" className="underline underline-offset-4">
            contact page
          </Link>
          .
        </p>

        <h2 className="pt-4 text-lg font-semibold tracking-tight">
          Why this site exists
        </h2>
        <p>
          The 3D printing community is generous with information, but the
          information is scattered. Reddit threads, YouTube videos, slicer
          forum posts, manufacturer wikis, and individual blog posts all
          carry pieces of the same answers. The math behind print cost,
          electricity, failure rate, and AMS purge waste is well known to
          experienced printers but spread across dozens of sources.
        </p>
        <p>
          {SITE.name}.com is an attempt to put the practical math in one
          place, with the calculations actually exposed as tools you can
          use in 30 seconds, plus longer-form context for when you want to
          understand what the numbers mean. The audience is hobbyists with
          one or two printers, not commercial farms.
        </p>

        <h2 className="pt-4 text-lg font-semibold tracking-tight">
          What the calculators include
        </h2>
        <p>
          The tools cover material cost, electricity, printer wear,
          failed attempts, hands-on time and multi-color material use.
        </p>
        <p>
          Each tool explains its assumptions and limitations. The{" "}
          <Link href="/methodology" className="underline underline-offset-4">
            methodology page
          </Link>{" "}
          documents every formula and the source data it draws on.
        </p>

        <h2 className="pt-4 text-lg font-semibold tracking-tight">
          Sources and method
        </h2>
        <p>
          The methodology page links supporting references, including Prusa
          documentation, Bambu Studio source code and material datasheets.
          Reference prices, rates and material properties can vary. Use your
          bill, purchase price or manufacturer&apos;s specification when available.
        </p>
        <p>
          Where estimates have wide error bars (print time being the main
          example), the calculator and its accompanying explainer say so
          explicitly. The intent is to give you a number good enough to
          plan around, not to replace your slicer&apos;s authoritative
          per-file estimate.
        </p>

        <h2 className="pt-4 text-lg font-semibold tracking-tight">
          How the site is maintained
        </h2>
        <p>
          Calculator changes are checked with worked examples and automated
          formula tests. Defaults are starting assumptions; use your own
          measurements and prices for a specific job. Material changes and
          source references are documented with the relevant tool or guide.
        </p>
        <p>
          New guides and calculator additions follow community demand. If
          there&apos;s a calculator you keep wishing existed (resin print
          cost, multi-printer farm economics, enclosure power draw), tell
          us via{" "}
          <Link href="/contact" className="underline underline-offset-4">
            contact
          </Link>
          .
        </p>

        <h2 className="pt-4 text-lg font-semibold tracking-tight">
          Monetization and what we do not do
        </h2>
        <p>
          This site may earn from Amazon affiliate links on pages where a
          product is directly relevant to the calculator or guide. Those
          picks are a small monetization test, not paid reviews, and not
          manufacturer-controlled placements. When a guide names a specific
          printer or filament brand, that name was chosen because it&apos;s
          relevant to the topic.
        </p>
        <p>
          Calculations run in your browser. Vercel Web Analytics provides
          aggregate traffic information, with calculator query parameters
          removed from analytics event URLs. Bookmarked and shared URLs
          contain your inputs, and opening them makes a request to the site.
          Some tools offer optional preferences saved on your device. Read
          the <Link href="/privacy" className="text-primary underline underline-offset-4">privacy policy</Link> for details.
        </p>

        <h2 className="pt-4 text-lg font-semibold tracking-tight">
          Feedback
        </h2>
        <p>
          Found a bug, disagree with a formula, or have an idea for a
          new calculator? Use the{" "}
          <Link href="/contact" className="underline underline-offset-4">
            contact page
          </Link>
          . Include the inputs, the result shown and what you expected so
          the issue can be reproduced.
        </p>
      </div>
    </div>
  );
}
