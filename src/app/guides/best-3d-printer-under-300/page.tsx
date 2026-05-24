import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AdSlot } from "@/components/shared/AdSlot";
import { AuthorBio } from "@/components/shared/AuthorBio";
import { AuthorByline } from "@/components/shared/AuthorByline";
import { GuideImagePlaceholder } from "@/components/shared/GuideImagePlaceholder";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { AUTHOR_JSONLD } from "@/lib/author";
import { getGuide } from "@/lib/guides";
import { SITE } from "@/lib/tools";

const SLUG = "best-3d-printer-under-300";
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
    q: "Is the Bambu A1 mini really good enough for serious printing?",
    a: "Yes, with one caveat. Print quality and reliability are excellent, and the AMS lite supports four-color printing. The caveat is build volume: 180mm cubed is fine for miniatures, phone stands, and most household parts, but limits you on costumes, helmets, or anything that needs single-piece printing larger than that. If 90% of your prints fit in a 180mm box, the A1 mini is the smartest under-$300 buy in 2026.",
  },
  {
    q: "Should I save up for the Bambu P1S instead?",
    a: "Maybe. The P1S costs roughly $700 and adds an enclosure for ABS and ASA, plus a CoreXY motion system that handles harder filaments better. If you only print PLA and PETG, you do not need the P1S. If you want to print engineering-grade plastics or live somewhere cold and dusty, save for it. Most beginners overestimate how often they will need engineering filaments.",
  },
  {
    q: "Are Klipper-based printers like the Ender 3 V3 KE worth the hassle?",
    a: "If you enjoy the tinkering, yes. Klipper printers run a Raspberry-Pi-style controller and offer input shaping, pressure advance, and macros that Marlin printers cannot match. The KE comes pre-configured, so you do not have to set up Klipper yourself. But you will still spend more time on slicer profiles and firmware updates than a Bambu owner would. Buy it for the learning curve, not despite it.",
  },
  {
    q: "What about the Creality K1 or Anycubic Kobra 3?",
    a: "Both sit just above $300 most of the time. The K1 has a notorious quality-control history, and the Kobra 3 is solid but newer than the picks here so it has less long-term reliability data. If you find either at a deep sale below $300, they are worth considering, but at full price the picks in this guide are safer.",
  },
  {
    q: "Will any of these print TPU or flexibles?",
    a: "All four can technically print TPU, but bedslingers (the A1, A1 mini, Ender V3 KE, Neptune 4) are not great at it because the soft filament tends to buckle in the long Bowden-style path on fast travel moves. You will get better TPU results on a direct-drive setup, which all of these have, but you will need to drop print speed dramatically (under 30mm/s) and use 95A or 98A shore hardness, not 85A. For occasional TPU prints, fine. For TPU as your main material, look at a different printer class.",
  },
  {
    q: "How long until these printers are obsolete?",
    a: "Two to three years before something genuinely better lands at the same price point. Bambu drops a new generation roughly every 18 months, but the A1 line is still current as of 2026. Creality refreshes the Ender line annually, mostly with small revisions. As long as you can still buy parts and the firmware is supported, an obsolete printer still prints. Plan to keep any of these for at least three years of regular use.",
  },
];

const SPECS: {
  printer: string;
  price: string;
  volume: string;
  speed: string;
  multicolor: string;
  setup: string;
}[] = [
  {
    printer: "Bambu A1 mini",
    price: "~$200-249",
    volume: "180 × 180 × 180",
    speed: "Fast (500mm/s peak)",
    multicolor: "AMS lite (4 colors, +$159)",
    setup: "15-20 min out of box",
  },
  {
    printer: "Bambu A1",
    price: "~$299-349",
    volume: "256 × 256 × 256",
    speed: "Fast (500mm/s peak)",
    multicolor: "AMS lite (4 colors, +$159)",
    setup: "20-30 min out of box",
  },
  {
    printer: "Creality Ender 3 V3 KE",
    price: "~$269-289",
    volume: "220 × 220 × 240",
    speed: "Fast (500mm/s peak)",
    multicolor: "Single color only",
    setup: "45-60 min, partial assembly",
  },
  {
    printer: "Elegoo Neptune 4 Plus",
    price: "~$269-299",
    volume: "320 × 320 × 385",
    speed: "Fast (500mm/s peak)",
    multicolor: "Single color only",
    setup: "30-45 min, partial assembly",
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
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE.url}/guides/${SLUG}`,
        },
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
          src="/images/guides/printer-with-spools.jpg"
          alt="A 3D printer next to colored filament spools on a workbench"
          width={1600}
          height={1067}
          className="w-full h-auto rounded-lg object-cover max-h-96"
          priority
        />
        <figcaption className="mt-2 text-xs text-muted-foreground">
          A typical desktop FDM printer setup with filament spools on hand.
          Photo via{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:BEETHEFIRST_3D_printer_and_3D-printed_filament_spools.jpg"
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
          Spend ten minutes on r/3Dprinting and you will see the same question
          fifty times: which printer should I buy with $300? The answer used to
          be complicated. In 2026 it mostly is not. Bambu Lab spent the last
          two years pressuring legacy brands so hard that the under-$300 tier
          went from "you will fight your printer for six months" to "it just
          prints." But not all picks at this price are equal, and the wrong
          choice still costs you weeks of frustration.
        </p>

        <p>
          This guide covers four printers I would actually recommend at this
          budget, plus a clear decision tree so you can match the right one to
          how you actually print. No affiliate fluff, no rankings padded with
          machines I have never seen.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          The four picks at a glance
        </h2>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-3 py-2 font-semibold">Printer</th>
                <th className="px-3 py-2 font-semibold">Price</th>
                <th className="px-3 py-2 font-semibold">Build (mm)</th>
                <th className="px-3 py-2 font-semibold">Multicolor</th>
                <th className="px-3 py-2 font-semibold">Setup</th>
              </tr>
            </thead>
            <tbody>
              {SPECS.map((row) => (
                <tr key={row.printer} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{row.printer}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">
                    {row.price}
                  </td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">
                    {row.volume}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {row.multicolor}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {row.setup}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground">
          Prices fluctuate week to week. Always check the current price before
          buying, especially around Black Friday, Prime Day, and Chinese New
          Year sales when these can drop 20% or more.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          1. Bambu A1 mini: the safest buy
        </h2>

        <p>
          If you are reading this guide because you want a printer that just
          works, stop here and buy the A1 mini. At around $200, sometimes $179
          on sale, it is the cheapest path to genuinely modern 3D printing.
          Auto-bed leveling that actually levels. Vibration compensation built
          into the firmware. A heated bed that hits temperature in under a
          minute. Print quality on stock profiles is comparable to printers
          twice the price three years ago.
        </p>

        <p>
          The catch is build volume. 180mm in each axis sounds plenty until
          you try to print a costume helmet and realize it does not fit. For
          miniatures, phone accessories, organizers, household repairs, and
          most functional parts, 180mm is fine. For cosplay, large mechanical
          builds, or single-piece prints over 7 inches, you will hit the wall
          fast.
        </p>

        <p>
          The other catch is the AMS lite. Bambu sells it separately for
          around $159. If you want four-color printing, that pushes the system
          to ~$360, putting it past the budget. Skip it for V1, add it later
          if you find yourself wanting multicolor.
        </p>

        <p>
          <strong className="text-foreground">Best for:</strong> beginners,
          anyone whose prints fit in a 180mm cube, people who do not want to
          tinker.
        </p>
        <p>
          <strong className="text-foreground">Skip if:</strong> you print
          costume parts, large mechanical assemblies, or you specifically want
          a bigger plate from day one.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          2. Bambu A1: same printer, bigger plate
        </h2>

        <p>
          The A1 is the A1 mini scaled up to 256mm cubed of build volume. Same
          motion system, same firmware, same print quality. List price is
          $299, but it floats between $299 and $349 depending on supply.
          During sales it sometimes dips to $269.
        </p>

        <p>
          That extra build volume is the difference between printing a Pip-Boy
          forearm in three pieces or one. For most hobbyists who plan to grow
          beyond miniatures, the A1 is worth the extra $100 over the mini. If
          you can stretch the budget at all, it is the better long-term
          choice.
        </p>

        <p>
          Note: the A1 had a heater wiring recall in late 2024. All units
          shipped after early 2025 use the fixed harness. If you buy used,
          confirm the seller did the recall fix.
        </p>

        <p>
          <strong className="text-foreground">Best for:</strong> anyone with a
          slightly flexible budget who wants the Bambu experience but at a
          bigger build size.
        </p>
        <p>
          <strong className="text-foreground">Skip if:</strong> you cannot
          comfortably afford $300+ or you specifically want to learn the
          Klipper ecosystem.
        </p>

        <GuideImagePlaceholder
          slot="build-volume"
          alt="Build volume comparison between four printers shown as transparent cubes"
          prompt="Clean infographic-style illustration showing four transparent cubes side by side, scaled to represent the build volumes of four 3D printers: 180×180×180mm, 256×256×256mm, 220×220×240mm, and 320×320×385mm. Each cube has its dimensions labeled in cyan-on-dark below it. Minimal flat design, dark background, cyan accents. No printers shown, just the volumes. 16:9 aspect ratio."
        />

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          3. Creality Ender 3 V3 KE: for tinkerers who like Klipper
        </h2>

        <p>
          The Ender brand is the legacy budget standard. The V3 KE drops in
          Klipper-style firmware (technically Creality's own variant of
          Klipper) on a heavily-redesigned chassis. Build volume is 220 by
          220 by 240. Speeds match Bambu on paper.
        </p>

        <p>
          What you get for the same money as the A1: more flexibility under
          the hood. Macros, pressure advance you can tune, input shaping you
          can re-measure. What you trade: out-of-box reliability is good but
          not Bambu-good. Slicer profiles need more attention. The build is
          partial-assembly, so you spend an hour squaring the gantry and
          plugging in the bed cable before your first print.
        </p>

        <p>
          The KE shines for people who want to grow into the printer. You can
          flash mainline Klipper, swap the hotend, install a real BLTouch, or
          add accelerometers without voiding warranty. Bambu locks down most
          of that. If learning printer internals is part of why you are
          buying, the KE is the better teacher.
        </p>

        <p>
          <strong className="text-foreground">Best for:</strong> tinkerers,
          students of the craft, anyone who wants their printer to be a
          long-term project.
        </p>
        <p>
          <strong className="text-foreground">Skip if:</strong> you just want
          a print to come off the bed without thinking.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          4. Elegoo Neptune 4 Plus: when build volume matters most
        </h2>

        <p>
          320 × 320 × 385. That is what you pay for here. The Neptune 4 Plus
          gives you nearly twice the build volume of the A1 at the same
          price. If you print large vases, helmets, terrain pieces, or
          single-piece functional parts, this is the only sub-$300 option
          that gets out of your way on size.
        </p>

        <p>
          Tradeoffs: it is a big bedslinger, so the bed moving in Y at high
          speeds can ghost on tall thin parts. Klipper-driven, but the
          firmware is younger than Creality's KE and has had more bug fixes
          per release. Print quality on stock profiles is a step below the
          Bambu, though within tuning distance.
        </p>

        <p>
          The Neptune 4 Plus is the right answer if and only if you actually
          need the size. If you are buying it because "more is better,"
          reconsider. Most prints are under 200mm, and a smaller printer with
          better motion will give you better results on those.
        </p>

        <p>
          <strong className="text-foreground">Best for:</strong> cosplay,
          terrain, large functional parts, anything that does not fit in a
          smaller printer.
        </p>
        <p>
          <strong className="text-foreground">Skip if:</strong> most of your
          prints are under 200mm and you would benefit more from precision
          than scale.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          The decision tree
        </h2>

        <p>Start at the top. Pick the first one that matches.</p>

        <ol className="list-decimal pl-5 space-y-3 marker:text-primary">
          <li>
            <strong className="text-foreground">First printer ever?</strong>{" "}
            Bambu A1 mini if budget is tight, A1 if you can stretch. Lower
            frustration is the most important variable for a beginner. You can
            always upgrade later.
          </li>
          <li>
            <strong className="text-foreground">
              Want to print bigger than 180mm?
            </strong>{" "}
            Bambu A1 if 256mm is enough, Elegoo Neptune 4 Plus if you need to
            go larger.
          </li>
          <li>
            <strong className="text-foreground">
              Want to learn how printers actually work?
            </strong>{" "}
            Ender 3 V3 KE. The Bambu ecosystem is too closed for that kind of
            learning.
          </li>
          <li>
            <strong className="text-foreground">
              Need multicolor on a budget?
            </strong>{" "}
            None of these in this price range. Save up another $159 for the
            AMS lite and pair it with the A1 mini or A1.
          </li>
          <li>
            <strong className="text-foreground">
              Print TPU or engineering plastics?
            </strong>{" "}
            None of these are great. Plan a P1S or used Prusa MK4 instead.
          </li>
        </ol>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          What to skip
        </h2>

        <p>
          Some printers in this price range get heavy marketing but are not
          worth the money in 2026. Quick rundown:
        </p>

        <ul className="list-disc pl-5 space-y-2 marker:text-primary">
          <li>
            <strong className="text-foreground">Original Ender 3 / Pro:</strong>{" "}
            still sold cheap, but the V3 line obsoletes it. Buy a V3 KE or do
            not buy a Creality.
          </li>
          <li>
            <strong className="text-foreground">Anycubic Kobra Neo:</strong>{" "}
            decent printer, but loses to the Bambu A1 mini on every metric at
            similar pricing.
          </li>
          <li>
            <strong className="text-foreground">
              Anything advertised as "300mm/s" without input shaping:
            </strong>{" "}
            the speed claim is meaningless without proper motion control.
            Marketing trap.
          </li>
          <li>
            <strong className="text-foreground">Used printers under $100:</strong>{" "}
            the math rarely works. By the time you replace consumables, the
            new-printer math wins.
          </li>
        </ul>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          Costs after the printer
        </h2>

        <p>
          Most buyers underestimate the running costs and the hidden
          accessories. A realistic first-year total looks like:
        </p>

        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
          <li>Spare nozzles (set of 3): $15</li>
          <li>First spool of filament: $20-25</li>
          <li>Build plate (PEI replacement): $20-35 after the first one wears</li>
          <li>Glue stick or hairspray: $5</li>
          <li>Filament dryer (recommended for PETG/TPU): $50-80</li>
          <li>Electricity for ~200 hours of printing: $5-15</li>
        </ul>

        <p>
          Plug those into the{" "}
          <Link
            href="/tools/filament-cost-calculator"
            className="text-primary underline-offset-4 hover:underline"
          >
            filament cost calculator
          </Link>{" "}
          and the{" "}
          <Link
            href="/tools/electricity-cost-calculator"
            className="text-primary underline-offset-4 hover:underline"
          >
            electricity cost calculator
          </Link>{" "}
          to get your real per-print cost. The printer itself is the cheap
          part.
        </p>

        <GuideImagePlaceholder
          slot="checklist"
          alt="Illustrated shopping checklist showing printer plus accessories"
          prompt="Minimalist illustration of a 3D-printer-shopping checklist on a tablet screen, with hand-drawn-style cyan checkmarks beside items: 'Printer', 'Filament spool', 'Spare nozzles', 'Build plate', 'Filament dryer'. Top of tablet shows a small icon of a 3D printer. Dark slate background with cyan accent color. Editorial flat-design style, no humans. 16:9 aspect ratio."
        />

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          The honest summary
        </h2>

        <p>
          For 95% of people reading this guide, the answer is the Bambu A1
          mini if you are tight on cash, or the A1 if you can spend a hundred
          more. Bambu earned that recommendation by making printers that
          mostly do not waste your time. The other two picks here are right
          answers for specific people: the Ender 3 V3 KE for tinkerers, the
          Neptune 4 Plus for size hunters.
        </p>

        <p>
          The wrong move is to buy the cheapest thing on Amazon and assume
          you will figure it out. You can, but the time you spend figuring it
          out costs more than the savings. At this budget, in this year, just
          buy the printer that prints.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4 text-primary">
          Frequently asked questions
        </h2>

        {FAQ.map((item) => (
          <div key={item.q} className="space-y-1.5">
            <p className="font-semibold text-foreground">{item.q}</p>
            <p>{item.a}</p>
          </div>
        ))}
      </div>

      <AuthorBio />

      <AdSlot slot="inline" className="my-8" />
    </article>
  );
}
