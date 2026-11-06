import type { Metadata } from "next";
import Image from "next/image";
import { GuideImageCredit } from "@/components/shared/GuideImageCredit";
import Link from "next/link";

import { AdSlot } from "@/components/shared/AdSlot";
import { AffiliatePicks } from "@/components/shared/AffiliatePicks";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { AuthorBio } from "@/components/shared/AuthorBio";
import { AuthorByline } from "@/components/shared/AuthorByline";
import { DryingSettingsTable } from "@/components/shared/DryingSettingsTable";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { AUTHOR_JSONLD } from "@/lib/author";
import { DRYER_LIMITS, DRYING_SETTINGS } from "@/lib/dryingSettings";
import { getGuide } from "@/lib/guides";
import type { Source } from "@/lib/reference";
import { SITE } from "@/lib/tools";

const SLUG = "how-to-dry-filament";
const guide = getGuide(SLUG)!;

const PRUSA_DRYING = "https://help.prusa3d.com/article/drying-filament_332086";
const BAMBU_DRYING = "https://wiki.bambulab.com/en/filament-acc/filament/dry-filament";
// Sources cited in the prose and FAQ that are not table rows.
const EXTRA_SOURCES: Source[] = [
  {
    label: "Bambu Lab Wiki: Bambu reusable spool (no 3D-printed spools for drying)",
    url: "https://wiki.bambulab.com/en/knowledge-sharing/bambu-reusable-spool",
    checked: "2026-10-10",
  },
  {
    label: "Polymaker Wiki: Panchroma PLA (dry only if absorbed moisture)",
    url: "https://wiki.polymaker.com/polymaker-products/polymaker-filaments/panchroma-tm/panchroma-tm-pla",
    checked: "2026-10-10",
  },
  {
    label: "Polymaker Wiki: airflow matters more than heat when drying",
    url: "https://wiki.polymaker.com/the-basics/fun-3d-printing-facts/airflow-is-more-important-than-heat-when-drying",
    checked: "2026-10-10",
  },
];
const BAMBU_PLA_TDS =
  "https://store.bblcdn.com/s7/default/b189de92249a4b9ebed28b8ea1f080f0/Bambu_PLA_Basic_Technical_Data_Sheet.pdf";

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

const FAQ: { q: string; a: string }[] = [
  {
    q: "How do I know if my filament is wet?",
    a: "Popping or hissing at the nozzle, more stringing than usual, rough or fuzzy surfaces, and weaker layers. Moisture comes back quickly: Bambu Lab says freshly dried filament left in a typical room at around 55% relative humidity can absorb enough moisture to affect print quality within 2 to 12 hours, depending on the material.",
  },
  {
    q: "Does PLA actually need drying?",
    a: "Not always. Polymaker lists its Panchroma PLA drying setting as for use only if the filament has absorbed moisture. Dry PLA when you see the symptoms above. When you do, it needs the lowest temperatures in the table, 45 to 55 °C depending on the maker and the equipment.",
  },
  {
    q: "Can I leave filament in a dryer overnight?",
    a: "Stay within the filament maker's time. Prusa says to stick to its recommended times to prevent overdrying, Bambu Lab warns that PC can become brittle after repeated heating and cooling cycles, and Creality says not to go above the filament maker's recommended temperature just to shorten drying time. The longest maker times in our table are 12 hours, in a temperature-controlled dryer. Do not leave a kitchen oven running unattended.",
  },
  {
    q: "How long does dry filament stay dry?",
    a: "Shorter than most people expect. Bambu Lab says that even in a 20% relative humidity environment, filaments generally stay dry for 2 to 7 days depending on the material, and every Bambu data sheet we checked gives under 20% RH, sealed with desiccant, for printing and storage. Keep spools you are not using sealed with fresh desiccant.",
  },
  {
    q: "What about the microwave method?",
    a: "Don't. Bambu Lab says not to use a microwave or a kitchen oven to dry filament, because microwave heating is uneven and its temperature cannot be controlled.",
  },
];

function SourceLink({ source, children }: { source: Source; children: React.ReactNode }) {
  return (
    <a href={source.url} className="underline" rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
}

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
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  const sources = [
    ...DRYING_SETTINGS.map((row) => row.source),
    ...DRYER_LIMITS.map((row) => row.source),
    ...EXTRA_SOURCES,
  ].filter((source, i, all) => all.findIndex((s) => s.url === source.url) === i);

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
        <AuthorByline updatedLabel="Settings rechecked October 10, 2026" />
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
          Stored filament can absorb moisture; follow the material maker&apos;s drying instructions.
          <GuideImageCredit image="filament-spools-helsinki.jpg" />
        </figcaption>
      </figure>

      <AdSlot slot="top" className="my-8" />

      <AffiliatePicks pagePath={`/guides/${SLUG}`} className="my-8" />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-5 text-sm leading-7">
        <p>
          Wet filament causes problems that look like printer or slicer
          issues: stringing that wasn&apos;t there last week, fuzzy walls,
          weak layer adhesion, popping sounds at the nozzle. The spool has
          absorbed moisture from the air, and the water boils off as the
          filament melts.
        </p>

        <p>
          The fix: heat the filament to the temperature its maker
          recommends, hold it for the stated time, then store it sealed with
          desiccant. The right setting depends on the exact filament, the
          equipment and the spool it is wound on, so this guide gives each
          maker&apos;s own number instead of one setting per material.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Drying settings from the filament makers
        </h2>
        <p>
          Use the row for your filament. If your brand is not listed, use
          its own data sheet. Makers disagree: Prusa dries its PETG at 55 °C
          while Bambu Lab uses 65 °C for PETG Basic, and Bambu&apos;s own PLA
          setting drops from 50 °C for 8 hours in a drying oven to 45 °C for
          12 hours in an AMS. Neither number is wrong for its product and
          equipment, so do not average them. Prusa warns that going above
          its temperatures makes filament soften and stick together.
        </p>
        <DryingSettingsTable />
        <p className="text-xs text-muted-foreground">
          Each product name links to the maker&apos;s page or data sheet,
          checked October 10, 2026. &ldquo;Forced-air drying oven&rdquo; is
          Bambu&apos;s term for a lab-style convection drying oven, not a
          kitchen oven.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Check the spool and the dryer before you heat
        </h2>
        <p>
          The filament setting is only half the limit. The spool has its own,
          and so does the equipment:
        </p>
        <ul className="list-disc pl-5 space-y-2 marker:text-primary">
          <li>
            <span className="font-medium">Bambu Lab spools.</span>{" "}Bambu&apos;s
            data sheets list PLA and PETG on an ABS spool rated to 70 °C, and
            ABS, ASA, PC, TPU and nylon on a PC + ABS spool rated to 90 °C
            (see the{" "}
            <a href={BAMBU_PLA_TDS} className="underline" rel="noopener noreferrer" target="_blank">
              PLA Basic data sheet
            </a>
            ). Bambu also warns that some third-party spools may deform during
            drying and says not to dry filament on a 3D-printed spool.
          </li>
          <li>
            <span className="font-medium">Prusament spools.</span>{" "}Prusa says
            its current black spool withstands up to 90 °C. The older black
            spool with a cardboard center is safe only to 45 °C unless you add
            a screw holding the sides together, and the older grey spool&apos;s
            glue withstands up to 90 °C.{" "}
            <a href={PRUSA_DRYING} className="underline" rel="noopener noreferrer" target="_blank">
              Prusa&apos;s drying article
            </a>{" "}
            shows how to tell them apart.
          </li>
          <li>
            <span className="font-medium">Other brands.</span>{" "}Polymaker&apos;s
            pages give drying settings but no spool limit. For a cardboard or
            unknown spool, check with the maker before going above the
            filament&apos;s listed temperature.
          </li>
        </ul>
        <p>Dryer maximums, from each maker:</p>
        <ul className="list-disc pl-5 space-y-1 marker:text-primary">
          {DRYER_LIMITS.map((row) => (
            <li key={row.equipment}>
              <SourceLink source={row.source}>{row.equipment}</SourceLink>: up
              to {row.maxC} °C
            </li>
          ))}
        </ul>
        <p>
          A 70 °C dryer cannot reach several settings in this table, including
          Bambu ABS and ASA at 80 °C and the higher-temperature PC and nylon
          settings. Match the exact filament, required time, spool limit and
          equipment before buying; a material-family name alone is not enough.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Method 1: Kitchen oven (risky; Bambu says don&apos;t)
        </h2>
        <p>
          Bambu Lab says plainly not to use a kitchen oven: heat is uneven,
          and the area near the heating element runs hotter than the
          setting. Prusa allows a home oven with care, but warns that many
          cannot be set low enough to dry filament without damaging it.
          If you try it anyway, check the actual temperature with a separate
          oven thermometer, keep the spool away from the element, stay
          within the maker&apos;s setting, and do not leave it unattended.
          PLA, with the lowest settings, is the riskiest.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Method 2: Food dehydrator
        </h2>
        <p>
          A food dehydrator with a thermostat can hold a low, steady
          temperature, which suits PLA, PETG and TPU settings. Check your
          model&apos;s maximum temperature against the table and confirm the
          real temperature with a thermometer. Some need a modified tray to
          fit a spool.
        </p>
        <p>
          Running cost is mostly electricity, and it is small. A 250 W
          dehydrator running for 6 hours at full power uses 1.5 kWh, about
          25 cents at $0.17/kWh; the heater cycles, so real use is usually
          lower. Enter your own numbers in the{" "}
          <Link href="/tools/electricity-cost-calculator" className="underline underline-offset-4">
            electricity cost calculator
          </Link>
          .
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Method 3: Dedicated filament dryer
        </h2>
        <p>
          Purpose-built dryers hold temperature, circulate air and keep the
          spool enclosed. Some let you feed filament to the printer while it
          dries. Polymaker notes that airflow matters more than simply
          raising the temperature. The main limit is the maximum temperature
          listed above: several popular hobby dryers, including SUNLU&apos;s S2
          and S4 and Creality&apos;s Space Pi Plus, stop at 70 °C.
        </p>
        <p>
          A dryer can help when your filament needs drying and the equipment
          can reach its specified settings within the spool&apos;s limits. A
          70 °C model is not a substitute for equipment required by a hotter
          drying schedule. If you print PLA almost exclusively and keep
          spools sealed, you may rarely need one.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Method 4: Sealed bag or box with desiccant (prevention, not drying)
        </h2>
        <p>
          Storage doesn&apos;t dry already-wet filament; it keeps dry
          filament dry. Every Bambu data sheet we checked lists under 20%
          relative humidity, sealed with desiccant, for printing and storage.
          A cheap hygrometer in the box shows whether you are there.
        </p>
        <p>
          Color-changing silica gel shows when it is saturated. Regenerate
          it the way its maker specifies; temperatures and times differ
          between products.
        </p>
        <p>
          Best workflow: dry a spool when it shows symptoms or before a
          moisture-sensitive print, then store it sealed with fresh
          desiccant whenever it is not on the printer.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Method 5: Microwave (don&apos;t)
        </h2>
        <p>
          Bambu Lab says not to use one: microwave heating is uneven and its
          temperature cannot be controlled. Use any other method.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          When wet filament becomes a real cost
        </h2>
        <p>
          Wet filament can raise your failure rate, and failed prints waste
          material. The{" "}
          <Link
            href="/tools/failure-rate-calculator"
            className="underline underline-offset-4"
          >
            Failure Rate Calculator
          </Link>{" "}
          can help you spot the trend. If failures spike after a humid week,
          drying is a good first check.
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

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Sources and references
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-xs leading-6 marker:text-primary">
          <li>
            <a href={BAMBU_DRYING} className="underline" rel="noopener noreferrer" target="_blank">
              Bambu Lab Wiki: filament drying
            </a>{" "}
            (methods, kitchen-oven and microwave warnings, storage times)
          </li>
          {sources
            .filter((source) => source.url !== BAMBU_DRYING)
            .map((source) => (
              <li key={source.url}>
                <SourceLink source={source}>{source.label}</SourceLink>
              </li>
            ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Correction note:</span>{" "}
          October 10, 2026: replaced a single generic temperature table (for
          example PETG at 65 °C for 5 hours, with no brand named) with each
          maker&apos;s own settings, removed advice that lower temperatures
          are always safer and that oven or overnight drying is generally
          fine, and replaced a broken Polymaker link.
        </p>
      </div>

      <AuthorBio />

      <RelatedContent pagePath={`/guides/${SLUG}`} className="mt-8" />

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
