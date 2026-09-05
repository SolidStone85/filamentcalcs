import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ORGANIZATION_JSONLD } from "@/lib/author";
import { GUIDES } from "@/lib/guides";
import { SITE, TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  alternates: { canonical: SITE.url },
};

const TOOL_GROUPS = [
  {
    title: "What will it cost?",
    description: "From a spool of filament to a selling price.",
    slugs: ["filament-cost-calculator", "print-pricing-calculator", "electricity-cost-calculator"],
  },
  {
    title: "Do I have enough filament?",
    description: "Plan your next print before loading the spool.",
    slugs: ["remaining-spool-calculator", "enough-filament-calculator", "ams-purge-waste-calculator"],
  },
  {
    title: "What should I plan for?",
    description: "Compare materials, estimate time and count failures.",
    slugs: ["material-comparison", "print-time-estimator", "failure-rate-calculator"],
  },
];

export default function HomePage() {
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
      { "@id": `${SITE.url}/#organization`, ...ORGANIZATION_JSONLD },
    ],
  };
  const guides = ["3d-printing-cost-breakdown", "best-3d-printer-under-300", "multi-color-printing-ams-worth-it"]
    .map((slug) => GUIDES.find((guide) => guide.slug === slug)!)
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="flex items-center justify-between gap-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            A little math. A better <span className="text-3d">3D</span> <span className="text-primary">print.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Work out print costs, set a price and check your remaining filament.
            Nine free calculators, ready when you are. No sign-up.
          </p>
        </div>
        <Image
          src="/images/printer-illustration.png"
          alt=""
          width={160}
          height={160}
          sizes="160px"
          className="hidden size-40 shrink-0 rounded-2xl border border-border md:block"
        />
      </header>

      <section aria-label="Choose a calculator" className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-3 lg:gap-8">
        {TOOL_GROUPS.map((group) => (
          <div key={group.title}>
            <h2 className="text-lg font-semibold tracking-tight">{group.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.description}</p>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {group.slugs.map((slug) => {
                const tool = TOOLS.find((item) => item.slug === slug)!;
                return (
                  <li key={slug}>
                    <Link href={`/tools/${slug}`} className="group flex min-h-24 items-start gap-3 rounded-md px-2 py-4 transition-colors hover:bg-muted/70">
                      <div className="flex-1">
                        <span className="font-medium text-primary group-hover:underline group-hover:underline-offset-4">{tool.shortTitle}</span>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{tool.description}</p>
                      </div>
                      <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-xl border border-border bg-card px-5 py-5 sm:flex sm:items-center sm:justify-between sm:gap-8">
        <div className="max-w-2xl">
          <h2 className="font-semibold">Your inputs. The math explained.</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Results update as you type. Edit the assumptions, check the formula,
            and bookmark or share a calculation. For a specific print, use your
            slicer&apos;s totals whenever you have them.
          </p>
        </div>
        <Link href="/methodology" className="mt-3 inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium text-primary underline underline-offset-4 sm:mt-0">
          How the calculators work <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>

      <section className="mt-14">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">A bit more guidance</h2>
          <Link href="/guides" className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4">All guides</Link>
        </div>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          {guides.map((guide) => (
            <article key={guide.slug} className="border-t border-border pt-4">
              <h3 className="font-medium leading-6">
                <Link href={`/guides/${guide.slug}`} className="hover:text-primary hover:underline hover:underline-offset-4">{guide.title}</Link>
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{guide.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tight">Common questions</h2>
        <dl className="mt-6 space-y-6 text-sm leading-6">
          <div>
            <dt className="font-medium">Are the calculators free?</dt>
            <dd className="mt-1 text-muted-foreground">Yes. There is no account or paid tier. Some pages include relevant Amazon links that may earn a commission at no extra cost to you.</dd>
          </div>
          <div>
            <dt className="font-medium">How accurate are the results?</dt>
            <dd className="mt-1 text-muted-foreground">The formulas calculate from the values you enter. Prices, power use, waste and spool weights vary, so replace example defaults with your measurements. Print time is a rough estimate; your slicer is the better source for a particular file.</dd>
          </div>
          <div>
            <dt className="font-medium">Can I save a calculation?</dt>
            <dd className="mt-1 text-muted-foreground">Use Share this result or bookmark its URL. Some tools also offer optional settings saved on this device. Shared URLs contain your inputs, so share them only with people you intend to see those values. <Link href="/privacy" className="text-primary underline underline-offset-4">Privacy details</Link>.</dd>
          </div>
          <div>
            <dt className="font-medium">Found a problem or missing tool?</dt>
            <dd className="mt-1 text-muted-foreground">Send the calculator name, your inputs and the result you expected through the <Link href="/contact" className="text-primary underline underline-offset-4">contact page</Link>. That makes a correction much easier to check.</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
