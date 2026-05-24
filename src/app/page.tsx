import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTHOR_JSONLD, ORGANIZATION_JSONLD } from "@/lib/author";
import { GUIDES } from "@/lib/guides";
import { SITE, TOOLS } from "@/lib/tools";
import { cn } from "@/lib/utils";

export default function HomePage() {
  // Combined site identity graph: WebSite + Organization + Person.
  // Lets Google connect the dots between filamentcalcs.com, the publisher
  // organization, and Matthew Carvalho as the human behind it. Core
  // E-E-A-T signal for AdSense and Search.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        publisher: { "@id": `${SITE.url}/#organization` },
      },
      {
        "@id": `${SITE.url}/#organization`,
        ...ORGANIZATION_JSONLD,
      },
      AUTHOR_JSONLD,
    ],
  };

  // Latest 3 guides for the homepage feed.
  const latestGuides = [...GUIDES]
    .sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ----- Hero ----- */}
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl">
          Practical calculators and guides for{" "}
          <span className="text-3d">3D</span>{" "}
          printing hobbyists
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Material cost, electricity, print time, failure tracking, and the
          AMS purge math nobody warns you about. Plus longer guides on
          picking filament, fixing failures, and what each setting actually
          does. All free, all in your browser, no sign-up.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/tools/filament-cost-calculator"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Try the filament cost calculator
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/guides"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            Read the guides
          </Link>
        </div>
      </section>

      {/* ----- Latest guides feed ----- */}
      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">
            Latest from the guides
          </h2>
          <Link
            href="/guides"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
          >
            All guides
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latestGuides.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`}>
              <Card className="glass-card fc-card-lift h-full hover:border-primary/70">
                <CardHeader>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {guide.readMinutes} min read
                  </p>
                  <CardTitle className="mt-1 text-base">
                    {guide.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {guide.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ----- Common workflows ----- */}
      <section className="mt-16">
        <h2 className="mb-6 text-xl font-semibold tracking-tight">
          Where to start
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="text-base">
                I want to know what a print costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Start with material cost, layer in electricity, then think
                about failure rate and time.
              </p>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    href="/tools/filament-cost-calculator"
                    className="text-primary underline underline-offset-4"
                  >
                    Filament Cost Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools/electricity-cost-calculator"
                    className="text-primary underline underline-offset-4"
                  >
                    Electricity Cost Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/3d-printing-cost-breakdown"
                    className="text-primary underline underline-offset-4"
                  >
                    Full cost breakdown guide
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="text-base">
                I&apos;m not sure which filament to use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Compare materials head to head, then read the long-form
                guide for context.
              </p>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    href="/tools/material-comparison"
                    className="text-primary underline underline-offset-4"
                  >
                    Material Comparison
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/pla-vs-petg-vs-abs-vs-tpu"
                    className="text-primary underline underline-offset-4"
                  >
                    PLA vs PETG vs ABS vs TPU
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="text-base">
                My prints keep failing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Start by tracking your actual failure rate, then walk the
                fixes ranked by frequency.
              </p>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    href="/tools/failure-rate-calculator"
                    className="text-primary underline underline-offset-4"
                  >
                    Failure Rate Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/why-3d-prints-fail"
                    className="text-primary underline underline-offset-4"
                  >
                    Why prints fail (12 fixes ranked)
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="text-base">
                I&apos;m thinking about multi-color (AMS)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Run the purge math first. Multi-color often costs more in
                wasted filament than the part itself weighs.
              </p>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    href="/tools/ams-purge-waste-calculator"
                    className="text-primary underline underline-offset-4"
                  >
                    AMS Purge Waste Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/multi-color-printing-ams-worth-it"
                    className="text-primary underline underline-offset-4"
                  >
                    Is multi-color worth it?
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="text-base">
                I&apos;m buying a printer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                The under-$300 buyer&apos;s guide covers the realistic
                options and tradeoffs in 2026.
              </p>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    href="/guides/best-3d-printer-under-300"
                    className="text-primary underline underline-offset-4"
                  >
                    Best 3D printer under $300 in 2026
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/3d-printer-electricity-usage"
                    className="text-primary underline underline-offset-4"
                  >
                    Realistic electricity usage by printer
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="text-base">
                I want to estimate print time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Quick ballpark before you slice. Plus what makes your
                slicer estimate often wrong.
              </p>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    href="/tools/print-time-estimator"
                    className="text-primary underline underline-offset-4"
                  >
                    Print Time Estimator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/3d-print-time-expectations"
                    className="text-primary underline underline-offset-4"
                  >
                    Realistic print times by printer class
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="text-base">
                How much filament is left on this spool?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Weigh the spool, pick your brand, see the answer. Includes
                empty-weight presets for Bambu, Polymaker, eSun, and more.
              </p>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    href="/tools/remaining-spool-calculator"
                    className="text-primary underline underline-offset-4"
                  >
                    Remaining Filament Calculator
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ----- All calculators (kept for direct browse) ----- */}
      <section className="mt-16">
        <h2 className="mb-6 text-xl font-semibold tracking-tight">
          All calculators
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const content = (
              <Card
                className={`glass-card h-full ${
                  tool.available
                    ? "fc-card-lift hover:border-primary/70"
                    : "opacity-60"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2 text-base">
                    {tool.shortTitle}
                    {!tool.available && (
                      <span className="rounded bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                        soon
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>
            );

            return tool.available ? (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                {content}
              </Link>
            ) : (
              <div key={tool.slug}>{content}</div>
            );
          })}
        </div>
      </section>

      {/* ----- About / methodology pointer ----- */}
      <section className="mx-auto mt-16 max-w-3xl space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Why this site</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          The 3D printing community has decent calculators scattered across
          slicer forums, spreadsheets, and app stores, but nothing focused,
          fast, and mobile-friendly. {SITE.name}.com is a single place for the
          calculations you actually do, usually while standing next to your
          printer with your phone out.
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Every calculator runs in your browser. Nothing is saved to a server.
          URLs encode your inputs, so you can bookmark a result or paste it in
          a Reddit reply. For the formulas behind each tool and the source
          data, see the{" "}
          <Link
            href="/methodology"
            className="text-primary underline underline-offset-4"
          >
            methodology page
          </Link>
          .
        </p>
      </section>

      {/* ----- Site FAQ ----- */}
      <section className="mx-auto mt-16 max-w-3xl space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Common questions
        </h2>
        <dl className="space-y-5 text-sm leading-6 text-muted-foreground">
          <div>
            <dt className="font-medium text-foreground">
              Are the calculators actually free?
            </dt>
            <dd className="mt-1">
              Yes. No sign-up, no email collection, no paid tier. The site
              runs Google AdSense to offset hosting costs and time spent
              maintaining the calculators.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              How accurate are these compared to my slicer?
            </dt>
            <dd className="mt-1">
              For material cost, electricity, and AMS purge, the calculators
              are accurate to within a few percent for typical inputs. For
              print time, they&apos;re intentionally rough; your slicer
              simulates every move and is always the authoritative source
              for time on a specific file. The{" "}
              <Link
                href="/methodology"
                className="underline underline-offset-4"
              >
                methodology page
              </Link>{" "}
              documents the formulas and where they fall apart.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Do you collect my data?
            </dt>
            <dd className="mt-1">
              No. Calculator inputs never leave your browser. URLs encode
              your inputs as parameters so you can bookmark or share, but
              those URLs are never sent to a server. Standard Google
              Analytics tracks page views; that&apos;s it.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Will you build calculator X?
            </dt>
            <dd className="mt-1">
              Maybe. Suggestions feed the build queue. Common requests
              under consideration: resin printing cost, multi-printer farm
              economics, enclosure heater power. Email via the{" "}
              <Link href="/contact" className="underline underline-offset-4">
                contact page
              </Link>
              .
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              How often are the calculators updated?
            </dt>
            <dd className="mt-1">
              Each calculator is reviewed quarterly to refresh default
              prices, add new printers as they reach hobbyist relevance,
              update regional electricity rates, and incorporate reader
              corrections. Major changes get noted in the relevant
              page&apos;s &quot;How this works&quot; section.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              Are you affiliated with any printer or filament brand?
            </dt>
            <dd className="mt-1">
              No. No affiliate links, no sponsored placements, no paid
              product reviews. When a guide names a specific brand or
              printer, it&apos;s because that name is relevant to the
              topic.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              I&apos;m new to 3D printing. Where should I start?
            </dt>
            <dd className="mt-1">
              The{" "}
              <Link
                href="/guides/best-3d-printer-under-300"
                className="underline underline-offset-4"
              >
                best printer under $300 guide
              </Link>{" "}
              covers the realistic options for first-time buyers. After
              you have a printer, the{" "}
              <Link
                href="/guides/pla-vs-petg-vs-abs-vs-tpu"
                className="underline underline-offset-4"
              >
                filament comparison
              </Link>{" "}
              and the{" "}
              <Link href="/glossary" className="underline underline-offset-4">
                glossary
              </Link>{" "}
              are good next reads.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
