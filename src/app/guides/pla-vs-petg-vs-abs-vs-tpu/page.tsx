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

const SLUG = "pla-vs-petg-vs-abs-vs-tpu";
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
    q: "What's the single easiest filament to print with?",
    a: "PLA, no contest. It's forgiving on temperature, prints at relatively low heat, doesn't warp much, doesn't need an enclosure, and most printers come tuned for it out of the box. Every hobbyist should start here and stay on it until they have a specific reason to switch.",
  },
  {
    q: "Why does PETG string so much?",
    a: "PETG is naturally more oozy than PLA because it stays semi-molten at a wider temperature range. The fix is slower retractions, a slightly lower nozzle temp within its range, and sometimes reducing speed on travel moves. Every brand tunes differently, so first layer calibration matters more for PETG than PLA.",
  },
  {
    q: "Can I print ABS on an open Bambu A1 or Ender 3?",
    a: "Technically yes, practically no. ABS warps aggressively without an enclosure because uneven cooling makes the print curl off the bed. You'll get failures on anything larger than a small part. ASA has the same issue. If you need either, get an enclosed printer (P1S, X1C, or a DIY enclosure).",
  },
  {
    q: "Is TPU the only flexible option?",
    a: "It's the most common. TPE (softer, rarer) and TPC also exist. TPU ranges from shore 85A (super soft, like rubber band) to 98A (stiff but still bendable). Bambu's generic TPU is around 95A, a good middle ground. Start there before trying softer.",
  },
  {
    q: "What about PLA+?",
    a: "PLA+ is a marketing term with no standard definition. In practice it usually means PLA with small additives for better layer adhesion and toughness. It prints almost identically to regular PLA at the same temperature. Worth a slight premium if you're printing functional parts, overkill for display models.",
  },
  {
    q: "Is 3D printed PLA or PETG food safe?",
    a: "Not in any certified sense, and anyone who tells you otherwise is skipping the details. The problem isn't only the plastic: layer lines trap bacteria that washing doesn't fully clear, colorants and additives are rarely food-rated, and brass nozzles can shed trace lead into the first prints after a nozzle change. If you accept those limits, PETG is the better candidate for short-contact items like cookie cutters: rinse before use, hand wash cold, and treat them as semi-disposable. PLA deforms in hot water so it fails even the dishwasher test. For anything holding food or drink for real, use a food-safe epoxy coating or just buy the part.",
  },
  {
    q: "PETG or TPU for a phone case or anything that needs grip?",
    a: "TPU, almost every time. PETG is stiff with a little spring; TPU actually flexes and absorbs impact, which is the whole point of a case, a gasket, or a foot. Reach for PETG instead when the part needs to hold a shape under constant load, live outside, or slide smoothly against other parts, because TPU's grippy surface drags.",
  },
  {
    q: "Which filament should I use for outdoor parts?",
    a: "PETG for most outdoor jobs: planters, brackets, mounts, garden fittings. It shrugs off moisture and UV far better than PLA, which gets brittle and chalky within a season. If the part also bakes in direct sun or sits in a hot car, step up to ASA (the outdoor-grade cousin of ABS). PLA outdoors is a one-summer part.",
  },
  {
    q: "Does filament expire?",
    a: "Sort of. Dry filament in a sealed bag with silica packs is good for years. Filament exposed to humid air absorbs moisture, and wet filament prints badly (popping, brittleness, stringing). PLA tolerates some humidity. PETG and TPU absorb moisture fast and need a filament dryer before use if stored open.",
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
        <AuthorByline updatedLabel="Updated April 2026" />
      </header>

      <figure className="my-8">
        <Image
          src="/images/guides/filament-types-qidi.png"
          alt="A range of 3D printer filament types in different colors"
          width={1600}
          height={1067}
          className="w-full h-auto rounded-lg object-cover max-h-96"
          priority
        />
        <figcaption className="mt-2 text-xs text-muted-foreground">
          Different filament chemistries print, behave, and age very
          differently. Photo via{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:QiDi_3D_Printer_Filaments.png"
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
          Four materials cover more than 90% of hobbyist 3D printing: PLA,
          PETG, ABS, and TPU. Every other material (ASA, PC, Nylon,
          fiber-reinforced) is a variation or upgrade path from one of those
          four. If you can pick the right base material, you rarely need the
          exotic stuff.
        </p>
        <p>
          This guide walks through each one in plain language: what it's
          good at, what it's bad at, when to reach for it, when to avoid
          it. The{" "}
          <Link
            href="/tools/material-comparison"
            className="underline underline-offset-4"
          >
            Material Comparison tool
          </Link>{" "}
          has the specs side by side if you prefer a table.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          PLA: the default, and the right default
        </h2>
        <p>
          Polylactic acid. Plant-based plastic. Prints at 190 to 220°C with a
          bed around 50 to 60°C. Hardly warps. Works on open printers. Most
          hobbyist printers come tuned for PLA out of the box.
        </p>
        <p>
          <strong>Use PLA for:</strong> anything indoor, display models,
          prototyping, figurines, detailed prints, organizers, brackets for
          light-duty applications, miniatures, desk toys, pretty much
          anything you'd 3D print for fun.
        </p>
        <p>
          <strong>Avoid PLA for:</strong> outdoor parts (degrades in UV),
          anything that lives in a car in summer (softens around 55°C),
          parts that need to flex repeatedly (brittle, snaps), food-safe
          applications (layer lines trap bacteria even on food-safe PLA
          brands).
        </p>
        <p>
          Typical price: $18 to $25 per kg for decent-quality PLA. Below
          $15 you're getting unknown-origin material that often prints
          inconsistently.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          PETG: PLA's tougher cousin
        </h2>
        <p>
          Polyethylene terephthalate glycol. Chemically related to the
          plastic in water bottles. Prints at 230 to 250°C with a bed at 70
          to 80°C. Stronger than PLA, more flexible, handles outdoor use.
        </p>
        <p>
          <strong>Use PETG for:</strong> outdoor parts, functional parts
          under load, parts that need some impact resistance, water
          bottles or storage containers (certified food-contact brands
          only), garage and shed items, tool holders, parts exposed to heat
          up to about 75°C.
        </p>
        <p>
          <strong>Avoid PETG for:</strong> fine detail (stringing is harder
          to tune out), parts that slide or snap together tightly (PETG is
          softer than PLA and deforms under pressure), beginners on their
          first week of printing.
        </p>
        <p>
          Typical price: $22 to $30 per kg. Slightly more expensive than
          PLA, worth it for functional parts.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          ABS: legacy tough-guy, mostly outclassed now
        </h2>
        <p>
          Acrylonitrile butadiene styrene. The plastic in LEGO bricks.
          Prints at 240 to 260°C with a bed at 90 to 110°C. Requires an
          enclosed printer and good ventilation (fumes are unpleasant and
          possibly harmful over long exposure).
        </p>
        <p>
          <strong>Use ABS for:</strong> parts that need high heat
          resistance (up to about 100°C), parts you want to acetone-smooth,
          automotive interior parts, traditional manufacturing-style
          mechanical parts.
        </p>
        <p>
          <strong>Avoid ABS for:</strong> open printers (will warp), parts
          exposed to sunlight (UV degrades it badly, use ASA instead),
          anything where you don't want fumes in your living space.
        </p>
        <p>
          Typical price: $20 to $28 per kg. ABS is cheap but the enclosure
          requirement raises the total cost of ownership significantly.
          Most hobbyists skip it in favor of ASA or just use PETG.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          TPU: the flexible one
        </h2>
        <p>
          Thermoplastic polyurethane. Rubbery, bends, stretches, bounces
          back. Prints at 210 to 230°C with a bed at 30 to 60°C. Comes in
          different hardness grades (shore 85A to 98A).
        </p>
        <p>
          <strong>Use TPU for:</strong> phone cases, gaskets, shoe soles,
          wheels for small vehicles, shock absorbers, cable protectors,
          furniture feet, grippy handles.
        </p>
        <p>
          <strong>Avoid TPU for:</strong> Bowden extruders (the flexible
          filament bunches up in the tube, direct-drive is strongly
          preferred), rigid structural parts (it will deform under load),
          fast prints (slow speeds are required for clean TPU results,
          usually 30 to 50 mm/s max).
        </p>
        <p>
          Typical price: $25 to $35 per kg. Premium brands go higher. Worth
          paying for brand name because cheap TPU often has inconsistent
          hardness that makes prints unpredictable.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Decision shortcut
        </h2>
        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
          <li>Indoor display or prototype? <strong>PLA.</strong></li>
          <li>Outdoor or functional load-bearing? <strong>PETG.</strong></li>
          <li>Needs to bend or grip? <strong>TPU.</strong></li>
          <li>High heat (car interior, kitchen adjacent)? <strong>ABS or ASA.</strong></li>
          <li>Outdoor AND high heat? <strong>ASA.</strong></li>
        </ul>
        <p>
          The{" "}
          <Link
            href="/tools/filament-cost-calculator"
            className="underline underline-offset-4"
          >
            Filament Cost Calculator
          </Link>{" "}
          has the price defaults for each of these plus a custom option.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Which filament for which job
        </h2>
        <p>
          Same decision, longer list. These are the jobs people actually
          print, matched to the material I&apos;d reach for first and the
          one I&apos;d avoid.
        </p>
        <div className="overflow-x-auto rounded-md border not-prose">
          <table className="w-full text-xs leading-6">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 text-left font-medium">The job</th>
                <th className="px-3 py-2 text-left font-medium">Print it in</th>
                <th className="px-3 py-2 text-left font-medium">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-3 py-2">Miniatures, display models, desk toys</td>
                <td className="px-3 py-2 font-medium">PLA</td>
                <td className="px-3 py-2 text-muted-foreground">Best detail, easiest to print, no warping drama</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Planters, garden fittings, outdoor mounts</td>
                <td className="px-3 py-2 font-medium">PETG</td>
                <td className="px-3 py-2 text-muted-foreground">Handles moisture and UV; PLA goes brittle in a season</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Phone cases, gaskets, feet, grips</td>
                <td className="px-3 py-2 font-medium">TPU</td>
                <td className="px-3 py-2 text-muted-foreground">Actually flexes and absorbs impact instead of cracking</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Load-bearing brackets and hooks</td>
                <td className="px-3 py-2 font-medium">PETG</td>
                <td className="px-3 py-2 text-muted-foreground">Tougher than PLA, bends before it snaps</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Anything living in a car</td>
                <td className="px-3 py-2 font-medium">ABS or ASA</td>
                <td className="px-3 py-2 text-muted-foreground">Summer dashboards pass 60°C; PLA and PETG soften</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Cookie cutters, food-adjacent tools</td>
                <td className="px-3 py-2 font-medium">PETG, with caveats</td>
                <td className="px-3 py-2 text-muted-foreground">See the food-safety section below before printing these</td>
              </tr>
              <tr className="border-b">
                <td className="px-3 py-2">Drone frames, RC parts</td>
                <td className="px-3 py-2 font-medium">PETG (or ABS)</td>
                <td className="px-3 py-2 text-muted-foreground">Impact tolerance; add TPU for bumpers and mounts</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Replacement knobs, clips, appliance parts</td>
                <td className="px-3 py-2 font-medium">PETG</td>
                <td className="px-3 py-2 text-muted-foreground">Repeated handling and load; PLA clips fatigue and snap</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Is PLA, PETG, ABS, or TPU food safe?
        </h2>
        <p>
          Short version: no 3D printed part is food safe in a certified
          sense, no matter which filament you buy. Saying that out loud
          matters, because &quot;food safe PLA&quot; marketing skips three
          separate problems that have nothing to do with the base plastic.
        </p>
        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
          <li>
            <strong>Layer lines trap bacteria.</strong> The microscopic
            grooves between layers hold residue that normal washing
            doesn&apos;t fully clear. This is the problem that never goes
            away, on any filament.
          </li>
          <li>
            <strong>Colorants and additives aren&apos;t food rated.</strong>{" "}
            The base polymer might be; the pigment, the flow additives, and
            whatever else is in the pellets usually are not tested at all.
          </li>
          <li>
            <strong>The nozzle contaminates the plastic.</strong> Standard
            brass nozzles contain lead, and the first prints after a nozzle
            or filament change can carry traces of whatever ran through
            before.
          </li>
        </ul>
        <p>
          The practical hierarchy, if you accept those limits: PETG is the
          least-bad option for short-contact items like cookie cutters,
          because it tolerates washing and doesn&apos;t soak up water. Hand
          wash cold, rinse before use, and treat them as semi-disposable.
          PLA fails even sooner: it deforms in hot water, so one dishwasher
          cycle ruins it. ABS is a no (styrene chemistry), and TPU is a no
          (the surface grips and absorbs). For anything that holds food or
          drink for real, either seal the part with a food-safe epoxy
          coating or buy the finished item; a printed prototype is for
          checking fit, not for eating off.
        </p>

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
          Related tools
        </p>
        <ul className="space-y-2">
          <li>
            <Link
              href="/tools/material-comparison"
              className="underline underline-offset-4"
            >
              Material Comparison Tool
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
        </ul>
      </nav>
    </article>
  );
}
