import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AdSlot } from "@/components/shared/AdSlot";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { getGuide } from "@/lib/guides";
import { SITE } from "@/lib/tools";

const SLUG = "how-to-dry-filament";
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
    q: "How do I know if my filament is wet?",
    a: "Three signs: popping or crackling sounds at the nozzle during printing, surface stringing and 'fuzz' on otherwise smooth walls, and prints that snap easily under light pressure. PETG and TPU show problems first because they absorb moisture fastest. PLA can sit open for a few weeks before symptoms show.",
  },
  {
    q: "Does PLA actually need drying?",
    a: "Most of the time, no. PLA absorbs less water than PETG, ABS, or nylon, and most spools last a month or two open without issues. Dry it if prints suddenly look fuzzy after a humid week, or if your spool sat opened in a garage all summer. Otherwise don't waste the energy.",
  },
  {
    q: "Can I leave filament in a dryer overnight?",
    a: "For dedicated filament dryers like the Sunlu S2, yes, that's what they're built for. For ovens, only if you're confident in the thermostat (some home ovens overshoot by 10-20°C, which would melt PLA). For food dehydrators, generally yes, but check after the first hour to make sure the temperature is stable.",
  },
  {
    q: "How long does dry filament stay dry?",
    a: "In open air at typical humidity (40-60% RH), maybe 2-4 weeks before reabsorbing enough water to print poorly. In a sealed dry box with active silica gel, several months. In vacuum-sealed bags with desiccant, almost indefinitely.",
  },
  {
    q: "What about the microwave method?",
    a: "Don't. Microwaves heat unevenly, can melt small spots in the filament, and can damage the spool's plastic core. The 'a few seconds in the microwave' tips you see on Reddit are bad advice. Stick to ovens or dehydrators.",
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
        author: { "@type": "Organization", name: SITE.name },
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
        <p className="text-sm text-muted-foreground">Updated May 2026</p>
      </header>

      <figure className="my-8">
        <Image
          src="/images/guides/filament-spools-helsinki.jpg"
          alt="Stacked spools of colored 3D printing filament on a shelf"
          width={1600}
          height={1067}
          className="w-full h-auto rounded-lg object-cover max-h-96"
          priority
        />
        <figcaption className="mt-2 text-xs text-muted-foreground">
          Filament spools left out of sealed storage absorb moisture from the
          surrounding air. Photo via{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Helsinki,_Oodi,_3D_printer_filament.jpg"
            className="underline"
            rel="noreferrer"
          >
            Wikimedia Commons
          </a>
          .
        </figcaption>
      </figure>

      <AdSlot slot="top" className="my-8" />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-5 text-sm leading-7">
        <p>
          Wet filament is the cause of more failed prints than people
          realize. The symptoms look like printer or slicer issues:
          stringing that wasn&apos;t there last week, fuzzy walls, weak
          layer adhesion, popping sounds at the nozzle. The actual problem
          is the spool absorbed moisture from the air, and now the water
          flashes to steam during extrusion.
        </p>

        <p>
          The fix is simple in concept, fiddly in practice: heat the
          filament to a temperature that drives moisture out without
          softening the polymer, hold it for several hours, then store it
          in a sealed environment with desiccant. Different methods cost
          different amounts and give different results.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          Drying temperatures by material
        </h2>
        <p>
          The numbers below are conservative. Higher temperatures dry
          faster but risk softening the spool. Lower is always safer.
        </p>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">Material</th>
                <th className="px-3 py-2 text-left font-medium">Temp</th>
                <th className="px-3 py-2 text-left font-medium">Time</th>
                <th className="px-3 py-2 text-left font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-2">PLA</td>
                <td className="px-3 py-2">45°C</td>
                <td className="px-3 py-2">4 hours</td>
                <td className="px-3 py-2">Glass transition is 60°C, do not exceed 50°C</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">PETG</td>
                <td className="px-3 py-2">65°C</td>
                <td className="px-3 py-2">5 hours</td>
                <td className="px-3 py-2">Most common candidate for drying</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">ABS / ASA</td>
                <td className="px-3 py-2">80°C</td>
                <td className="px-3 py-2">4-6 hours</td>
                <td className="px-3 py-2">Watch for spool warping above 80°C</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">TPU</td>
                <td className="px-3 py-2">50°C</td>
                <td className="px-3 py-2">8 hours</td>
                <td className="px-3 py-2">Slow to release moisture, needs longer time</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Nylon (PA)</td>
                <td className="px-3 py-2">80°C</td>
                <td className="px-3 py-2">8-12 hours</td>
                <td className="px-3 py-2">Most hygroscopic; often needs drying mid-print</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Polycarbonate</td>
                <td className="px-3 py-2">85°C</td>
                <td className="px-3 py-2">6-8 hours</td>
                <td className="px-3 py-2">Very hygroscopic, dry before every print</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          Method 1: Kitchen oven (free, works for most filaments)
        </h2>
        <p>
          The cheapest method if you already have an oven. Set to the
          temperature for your material, leave the spool on a baking sheet
          for the time listed above, then move to a sealed container.
        </p>
        <p>
          Risks: many home ovens overshoot the set temperature by 10-20°C,
          especially when first heating up. PLA at 60°C softens enough
          that the spool can deform under its own weight. Use an oven
          thermometer to verify, or use a different method for PLA. Gas
          ovens are worse than electric here.
        </p>
        <p>
          One trick: preheat the oven, turn it OFF, then put the spool in
          and let it cool slowly. This avoids overshoot at the cost of
          taking longer.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          Method 2: Food dehydrator ($40-60, best cheap option)
        </h2>
        <p>
          A food dehydrator like the Presto 06300 or Cosori CFD-N051
          holds steady temperature in the 40-70°C range, perfect for most
          filaments. Single-tray models can hold one spool at a time.
          Stackable models can dry several spools simultaneously, which
          matters if you go through filament fast.
        </p>
        <p>
          Cost vs benefit: a dehydrator pays for itself if you print PETG,
          ABS, or TPU regularly. For a PLA-only printer, an oven works
          fine and a dehydrator is overkill. Dehydrators run very low
          power (around 250W), so leaving one on for 6 hours costs about
          25 cents at average US electricity rates.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          Method 3: Dedicated filament dryer ($60-150)
        </h2>
        <p>
          The Sunlu S2 (single spool, $60), Sunlu S4 (four spools, $130),
          and Eibos Polyphemus ($150) are purpose-built. They go up to
          70°C reliably, hold humidity well, and most can feed filament
          while drying so you can print straight from the dryer for
          materials that re-absorb moisture quickly.
        </p>
        <p>
          Worth buying if: you print PETG, nylon, or TPU often, you live in
          a humid climate, or you want a "set and forget" solution.
        </p>
        <p>
          Skip if: you print PLA almost exclusively and your filament
          doesn&apos;t sit open for long.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          Method 4: Vacuum bag plus desiccant (preventive, not corrective)
        </h2>
        <p>
          This doesn&apos;t dry already-wet filament; it keeps dry
          filament dry. Cheap food vacuum-seal bags plus 50-100 grams of
          color-changing silica gel per bag will hold a spool at &lt;15%
          relative humidity for months.
        </p>
        <p>
          The color-changing silica is important. It turns from blue or
          orange to pink as it absorbs water, so you can see when to
          recharge it. Recharge by baking the silica at 120°C for an hour.
        </p>
        <p>
          Best workflow: dry a fresh spool once after opening, then store
          in a vacuum bag with fresh desiccant whenever it&apos;s not on
          the printer.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          Method 5: Microwave (don&apos;t)
        </h2>
        <p>
          You will see this advice on Reddit. It is bad advice. Microwaves
          heat unevenly. Some spots on the filament melt while others
          stay cool. The plastic spool itself can warp. Microwaves are
          built to excite water molecules in food, not to evenly heat a
          large plastic object.
        </p>
        <p>
          Even when it appears to work, you&apos;ve introduced
          microscopic deformations in the filament that cause stringing
          and inconsistent extrusion later. Use any other method.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          Cost summary
        </h2>
        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
          <li>
            <span className="font-medium">Oven:</span> $0 upfront, ~$0.30
            per drying session in electricity
          </li>
          <li>
            <span className="font-medium">Food dehydrator:</span> $40-60
            upfront, ~$0.25 per session
          </li>
          <li>
            <span className="font-medium">Dedicated dryer:</span> $60-150
            upfront, ~$0.20 per session, can dry while printing
          </li>
          <li>
            <span className="font-medium">Vacuum bag plus desiccant:</span>{" "}
            $30 upfront for bags and 1 kg silica, runs indefinitely
          </li>
          <li>
            <span className="font-medium">Microwave:</span> avoid; ruins
            filament regardless of cost
          </li>
        </ul>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          When wet filament becomes a real cost
        </h2>
        <p>
          Wet filament can push your effective failure rate from 5% to
          15% or higher. On a heavy-print month, that&apos;s real money in
          wasted material. The{" "}
          <Link
            href="/tools/failure-rate-calculator"
            className="underline underline-offset-4"
          >
            Failure Rate Calculator
          </Link>{" "}
          can help you spot this trend over time. If your monthly failure
          rate spikes after a humid week, drying is usually the answer.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
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

      <AdSlot slot="inline" className="my-10" />

      <nav className="mt-10 rounded-lg border p-5 text-sm">
        <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
          Related calculators and guides
        </p>
        <ul className="space-y-2">
          <li>
            <Link
              href="/tools/failure-rate-calculator"
              className="underline underline-offset-4"
            >
              Failure Rate Calculator
            </Link>
          </li>
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
              href="/guides/why-3d-prints-fail"
              className="underline underline-offset-4"
            >
              Why does my 3D print keep failing?
            </Link>
          </li>
          <li>
            <Link
              href="/guides/pla-vs-petg-vs-abs-vs-tpu"
              className="underline underline-offset-4"
            >
              PLA vs PETG vs ABS vs TPU
            </Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}
