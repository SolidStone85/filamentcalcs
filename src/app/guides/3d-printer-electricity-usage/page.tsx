import type { Metadata } from "next";
import Image from "next/image";
import { GuideImageCredit } from "@/components/shared/GuideImageCredit";
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

const SLUG = "3d-printer-electricity-usage";
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
    modifiedTime: guide.updatedAt,
  },
};

const FAQ = [
  {
    q: "How much does a 3D printer cost in electricity per hour?",
    a: "Multiply average watts by your rate per kWh, then divide by 1,000. An assumed 100 W at $0.18/kWh costs $0.018 per hour, or 1.8 cents. Those are example inputs, not a measured printer average or a current national tariff.",
  },
  {
    q: "How much electricity does a Bambu A1, A1 mini or P1S use?",
    a: "There is no single whole-print average established here for these printers. A rated maximum or warmup reading is not the average draw for your print. Measure a complete representative job, including warmup, with a compatible energy meter. Divide its kWh by elapsed hours and multiply by 1,000 to obtain average watts for the calculator.",
  },
  {
    q: "Does leaving a printer on between prints add to the bill?",
    a: "Yes, if it draws power while idle. Calculate that period separately. An assumed 10 W for 24 hours is 0.24 kWh and costs $0.0432 at an assumed $0.18/kWh. Measure your own idle draw; do not add hours already included in the print measurement.",
  },
  {
    q: "Do I include a heated chamber, dryer or other accessory?",
    a: "Include its measured energy if you want the total setup cost. If a meter already measures the printer and accessories together, do not add them again. Separately powered devices need separate measurements. Their added cost depends on draw and operating time; no universal doubling factor applies.",
  },
  {
    q: "Which electricity rate should I use?",
    a: "Use the applicable per-kWh usage charges on your tariff, including per-kWh delivery charges. Fixed monthly fees do not automatically increase with one more print. For time-of-use rates, calculate each period separately. Keep the rate and result in one currency; the calculator does not convert currencies.",
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
        dateModified: guide.updatedAt,
        author: AUTHOR_JSONLD,
        publisher: { "@type": "Organization", name: SITE.name },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/guides/${SLUG}` },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((item) => ({
          "@type": "Question", name: item.q,
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
        <AuthorByline updatedLabel="Updated October 13, 2026" />
        <p className="text-sm leading-7 text-muted-foreground">
          At an assumed 100 W and $0.18/kWh, a ten-hour print uses 1 kWh and costs $0.18.
          Your result depends on measured draw, duration and your tariff. Use the{" "}
          <Link href="/tools/electricity-cost-calculator" className="text-primary underline underline-offset-4">free electricity cost calculator</Link>{" "}
          for your own inputs.
        </p>
      </header>

      <figure className="my-8">
        <Image src="/images/guides/printer-in-action.jpg" alt="A 3D printer with a partially printed object on the build plate" width={3072} height={4080} className="w-full h-auto rounded-lg object-cover max-h-96" priority />
        <figcaption className="mt-2 text-xs text-muted-foreground">
          Illustration only; this guide does not report hands-on printer tests.
          <GuideImageCredit image="printer-in-action.jpg" />
        </figcaption>
      </figure>
      <AdSlot slot="top" className="my-8" />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-5 text-sm leading-7">
        <h2 className="text-xl font-semibold tracking-tight">Calculate cost per hour, print or month</h2>
        <p className="rounded-md bg-muted p-3 font-mono text-xs">energy_kWh = average_watts / 1000 x hours<br />cost = energy_kWh x rate_per_kWh</p>
        <p>Watts measure power. Kilowatt-hours measure energy over time. For a monthly estimate, enter total printing hours for that month. Add idle time and accessories separately when they are outside the printing measurement.</p>
        <p>Every input in the following table is an illustrative assumption. The $0.18/kWh rate is not a current US average, and these wattages are not measurements for named printers.</p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <caption className="px-3 py-2 text-left">Example ten-hour prints at an assumed $0.18/kWh</caption>
            <thead className="bg-muted/50 text-left"><tr><th className="px-3 py-2">Assumed average power</th><th className="px-3 py-2">Energy</th><th className="px-3 py-2">Cost per hour</th><th className="px-3 py-2">Cost per print</th></tr></thead>
            <tbody>
              <tr className="border-t"><td className="px-3 py-2">50 W</td><td className="px-3 py-2">0.5 kWh</td><td className="px-3 py-2">$0.009</td><td className="px-3 py-2">$0.09</td></tr>
              <tr className="border-t"><td className="px-3 py-2">100 W</td><td className="px-3 py-2">1 kWh</td><td className="px-3 py-2">$0.018</td><td className="px-3 py-2">$0.18</td></tr>
              <tr className="border-t"><td className="px-3 py-2">200 W</td><td className="px-3 py-2">2 kWh</td><td className="px-3 py-2">$0.036</td><td className="px-3 py-2">$0.36</td></tr>
            </tbody>
          </table>
        </div>
        <p>For example, 60 printing hours per month at the assumed 100 W use 6 kWh. At the assumed $0.18/kWh, that costs $1.08. A higher rate, longer runtime or additional equipment changes the result.</p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Measure a whole print before choosing watts</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Use an energy meter compatible with your outlet voltage, plug and equipment load. Follow the meter and printer instructions.</li>
          <li>Record the starting kWh reading and elapsed time. Include warmup and the complete print when estimating a whole job.</li>
          <li>Subtract the starting reading from the ending reading to get job energy. Multiply that kWh by your tariff to price the job directly.</li>
          <li>For the calculator&apos;s watts input, divide job kWh by the same elapsed hours and multiply by 1,000. Repeat for a representative job when material or settings change.</li>
        </ol>
        <p>An illustrative 0.9 kWh measured over six hours corresponds to 150 W average. A single instantaneous reading or the power supply&apos;s rating does not establish that average.</p>
        <AffiliatePicks pagePath={`/guides/${SLUG}`} className="my-8" />

        <h2 className="text-xl font-semibold tracking-tight pt-4">Bambu A1, A1 mini and P1S electricity cost</h2>
        <p>For these printers, use a complete job&apos;s measured energy rather than one unsourced watts-per-model number. The bed and nozzle settings, room conditions and job duration can change the result. Printer reference presets in the calculator are editable starting estimates, not measured guarantees.</p>
        <p>For example, <Link href="/tools/electricity-cost-calculator?p=custom&amp;w=100&amp;h=10&amp;r=custom&amp;rt=0.18&amp;c=USD" className="text-primary underline underline-offset-4">calculate the assumed 100 W, ten-hour example</Link>, then replace the watts and tariff with your own values. This example does not claim to measure an A1 or P1S.</p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Use your tariff and count each device once</h2>
        <p>Rates vary by location and billing plan. Use applicable per-kWh usage and delivery charges from your own tariff. Calculate time-of-use periods separately; this simple model does not handle demand charges or tiered billing. A fixed connection fee is not automatically part of the cost of one extra print.</p>
        <p>For multiple printers, dryers or heated chambers, add separately measured kWh. If the whole setup is already measured together, that total includes those devices. There is no fixed percentage of total print cost that electricity must represent.</p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Manufacturer context and sources</h2>
        <p><a href="https://help.prusa3d.com/article/faq-frequently-asked-questions_1932" className="underline" rel="noreferrer">Prusa&apos;s FAQ</a> reports MK-series measurements at a 26 °C room temperature: 80 W for generic PLA and 120 W for generic ABS. These are Prusa&apos;s reported conditions, not our tests or universal values for every MK model. They illustrate why material and conditions matter.</p>
        <p>For US tariff context, the <a href="https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a" className="underline" rel="noreferrer">EIA publishes residential electricity prices by state</a>. Those averages do not replace the rate for your address. The worked examples here deliberately use a labeled assumed rate.</p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">Frequently asked</h2>
        <dl className="space-y-4">{FAQ.map((item) => <div key={item.q} className="space-y-1"><dt className="font-medium">{item.q}</dt><dd className="text-sm leading-7 text-muted-foreground">{item.a}</dd></div>)}</dl>
      </div>
      <AuthorBio />
      <RelatedContent pagePath={`/guides/${SLUG}`} className="mt-8" />
      <AdSlot slot="inline" className="my-10" />
    </article>
  );
}
