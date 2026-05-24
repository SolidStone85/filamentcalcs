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
          Every calculator here runs entirely in your browser. No account is
          required, and no data is sent to a server. URLs include your inputs
          so you can bookmark a result or share it in a Reddit thread or
          Discord channel.
        </p>

        <h2 className="pt-4 text-lg font-semibold tracking-tight text-primary">
          How the site is operated
        </h2>
        <p>
          {SITE.name}.com is operated as an independent editorial
          reference. It is not affiliated with any printer or filament
          manufacturer, slicer team, or distributor, and carries no
          affiliate relationships, sponsorships, or paid product reviews.
        </p>
        <p>
          The angle of authority here is research, not personal print-farm
          mileage. Every calculator is built from cross-referenced sources:
          slicer documentation (Bambu Studio, PrusaSlicer, OrcaSlicer),
          manufacturer datasheets, US EIA residential electricity rate data,
          Eurostat European household rates, and published community testing
          including CNC Kitchen&apos;s tensile and impact comparison series.
          Where sources disagree, the calculator notes which way it leans and
          why. Where confidence is low (print-time estimation being the
          obvious example), the page says so out loud.
        </p>
        <p>
          Corrections from readers are read and integrated into the quarterly
          review cycle. The fastest path to fix a wrong default or a stale
          price is the{" "}
          <Link href="/contact" className="underline underline-offset-4">
            contact page
          </Link>
          .
        </p>

        <h2 className="pt-4 text-lg font-semibold tracking-tight text-primary">
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

        <h2 className="pt-4 text-lg font-semibold tracking-tight text-primary">
          What makes this different from other calculator sites
        </h2>
        <p>
          Most online 3D printing calculators are either too simple (a
          single field for grams and a single field for price-per-kg, with
          no waste factor or material handling), or they are SEO content
          farms with thin tools wrapped in keyword-stuffed copy.
        </p>
        <p>
          The aim here is the opposite: each calculator handles the
          variables that actually affect the answer (waste factor by
          material, failure rate amortization, AMS purge per swap), and
          each page explains what the math is doing and where it falls
          apart. The{" "}
          <Link href="/methodology" className="underline underline-offset-4">
            methodology page
          </Link>{" "}
          documents every formula and the source data it draws on.
        </p>

        <h2 className="pt-4 text-lg font-semibold tracking-tight text-primary">
          Sources and method
        </h2>
        <p>
          Formulas are based on community references including Prusa
          documentation, the Bambu Lab community wiki, slicer source code
          for default values, and well-known maker forum threads. Tensile
          and impact strength data comes from public testing series like
          CNC Kitchen on YouTube. Regional electricity rates use US EIA
          data and Eurostat European household rates.
        </p>
        <p>
          Where estimates have wide error bars (print time being the main
          example), the calculator and its accompanying explainer say so
          explicitly. The intent is to give you a number good enough to
          plan around, not to replace your slicer&apos;s authoritative
          per-file estimate.
        </p>

        <h2 className="pt-4 text-lg font-semibold tracking-tight text-primary">
          How the site is maintained
        </h2>
        <p>
          Every calculator is reviewed quarterly to refresh default
          prices, add new printers as they become relevant, update
          regional electricity rates, and incorporate any reader
          corrections submitted via contact. Major calculator changes get
          a note in the relevant page&apos;s &quot;How this works&quot;
          section.
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

        <h2 className="pt-4 text-lg font-semibold tracking-tight text-primary">
          Monetization and what we do not do
        </h2>
        <p>
          This site carries Google AdSense to offset hosting costs and
          time spent maintaining the calculators. No affiliate links, no
          sponsored placements, no &quot;recommended retailers&quot; or
          paid product reviews. When a guide names a specific printer or
          filament brand, that name was chosen because it&apos;s relevant
          to the topic, not because of any commercial relationship.
        </p>
        <p>
          We do not collect personal data beyond standard Google
          Analytics page views. The calculators themselves run entirely
          in your browser; nothing about your inputs ever leaves your
          device. URLs include your inputs as parameters so you can
          bookmark or share, but those URLs are never sent to our server.
        </p>

        <h2 className="pt-4 text-lg font-semibold tracking-tight text-primary">
          Feedback
        </h2>
        <p>
          Found a bug, disagree with a formula, or have an idea for a
          new calculator? Use the{" "}
          <Link href="/contact" className="underline underline-offset-4">
            contact page
          </Link>
          . Feedback is read within a week and incorporated into the next
          quarterly review where appropriate.
        </p>
      </div>
    </div>
  );
}
