import type { Metadata } from "next";

import { AdSlot } from "@/components/shared/AdSlot";
import { AuthorBio } from "@/components/shared/AuthorBio";
import { AuthorByline } from "@/components/shared/AuthorByline";
import { Highlight3D } from "@/components/shared/Highlight3D";
import { RelatedContent } from "@/components/shared/RelatedContent";
import { AUTHOR_JSONLD } from "@/lib/author";
import { getGuide } from "@/lib/guides";
import { SITE } from "@/lib/tools";

const SLUG = "fit-and-clearance-3d-printed-parts";
const guide = getGuide(SLUG)!;
const UPDATED_AT = "2026-11-17";

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: SITE.url + "/guides/" + SLUG },
  openGraph: {
    title: guide.title,
    description: guide.description,
    url: SITE.url + "/guides/" + SLUG,
    type: "article",
    publishedTime: guide.publishedAt,
    modifiedTime: UPDATED_AT,
  },
};

export default function GuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: UPDATED_AT,
    author: AUTHOR_JSONLD,
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: { "@type": "WebPage", "@id": SITE.url + "/guides/" + SLUG },
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
        <AuthorByline updatedLabel="Reviewed November 17, 2026 (UTC)" />
      </header>

      <AdSlot slot="top" className="my-8" />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-5 text-sm leading-7">
        <p>
          Two parts can match perfectly in CAD and still bind when printed. A
          sliding lid may stick, a snap may not catch, or a press fit may fall
          apart. The gap you draw is only a starting point: printer setup,
          material, part orientation and the first layer all affect the surfaces
          that meet. Before committing to a long print, make a small test of the
          joint itself.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Clearance, accuracy and fit are different things
        </h2>
        <p>
          <strong>Clearance</strong> is the space designed between two surfaces
          that need to assemble or move. A positive gap can let a pin slide in a
          hole, but the printed gap may differ from the CAD gap.
        </p>
        <p>
          <strong>Accuracy</strong> describes how closely a printed dimension
          matches its target. It is not a clearance to add. Prusa reports an
          accuracy figure for an Original Prusa, but that is separate from its
          starting value for movable-part clearance. Neither statement sets a
          universal allowance for every mating pair.
        </p>
        <p>
          <strong>Press fit</strong> means the parts are designed to interfere
          so contact and deformation hold them together. The result depends on
          the shape, material and how the parts are loaded. The sources below do
          not establish a universal press-fit interference value.
        </p>
        <p>
          <strong>Snap fit</strong> uses a flexible feature, such as a tab, that
          bends over a catch and springs back into place. It needs room to
          assemble, but its flexibility and orientation matter as much as the
          clearance. Treat snap-fit guidance separately from a plain moving gap.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Published starting points, in context
        </h2>
        <p>
          Published values are useful only when you keep the source and joint
          type attached to them. These sources do not give one number for every
          printed fit.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <caption className="px-3 py-2 text-left">
              Published fit guidance and its design context
            </caption>
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-3 py-2" scope="col">Source</th>
                <th className="px-3 py-2" scope="col">Published guidance</th>
                <th className="px-3 py-2" scope="col">How to use it</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <th className="px-3 py-2 text-left font-medium" scope="row">
                  <a
                    href="https://help.prusa3d.com/article/modeling-with-3d-printing-in-mind_164135"
                    className="underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Prusa Knowledge Base: Modeling with 3D printing in mind
                  </a>
                </th>
                <td className="px-3 py-2">
                  At least 0.3 mm as an initial clearance for movable parts.
                  The article separately reports at least 0.2 mm accuracy for
                  an Original Prusa.
                </td>
                <td className="px-3 py-2">
                  The movable-part value is a starting point for that use. The
                  accuracy figure is not another gap to add.
                </td>
              </tr>
              <tr className="border-t">
                <th className="px-3 py-2 text-left font-medium" scope="row">
                  <a
                    href="https://www.hubs.com/knowledge-base/how-design-snap-fit-joints-3d-printing/"
                    className="underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Protolabs Network: How to design snap-fit joints for 3D printing
                  </a>
                </th>
                <td className="px-3 py-2">
                  0.5 mm clearance for FDM snap-fit connectors.
                </td>
                <td className="px-3 py-2">
                  Use it as snap-fit context, not a general sliding-fit or
                  press-fit recommendation.
                </td>
              </tr>
              <tr className="border-t">
                <th className="px-3 py-2 text-left font-medium" scope="row">
                  <a
                    href="https://help.prusa3d.com/article/elephant-foot-compensation_114487"
                    className="underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Prusa Knowledge Base: Elephant foot compensation
                  </a>
                </th>
                <td className="px-3 py-2">
                  A first layer pressed against the heated bed can spread wider
                  and affect precise fits.
                </td>
                <td className="px-3 py-2">
                  Check the mating area near the bed when choosing a test
                  orientation and first-layer setup.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          Sources reopened and checked November 17, 2026 (UTC). The listed
          starting points apply to the named design contexts and do not establish
          a universal gap or press-fit interference value.
        </p>
        <p>
          These figures answer different design questions, so they are not
          competing measurements of one universal gap. If a part should move,
          Prusa's movable-part starting point is the more relevant one to try.
          For an FDM snap-fit connector, use the snap-fit source as context for
          its own joint type. Do not average the two values, treat printer
          accuracy as a gap, or transfer a snap-fit number to a press fit.
        </p>
        <p>
          When choosing a test model, check how its author defines clearance. A
          gap on each side of a pin is different from the total difference
          between pin and hole diameters. Label that convention in your own
          model and notes; do not assume these brief source recommendations
          specify it. For a press fit, neither figure above supplies an
          interference value, so use joint-specific design guidance and a small
          sample.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Why the same CAD gap can print differently
        </h2>
        <p>
          The printer and its settings affect the size and finish of a feature.
          A hole and a shaft can each depart from their CAD dimensions, and the
          combined fit depends on both surfaces. Material behavior and cooling
          can also change the final shape. A value that works with one printer
          and filament is not guaranteed to work with another.
        </p>
        <p>
          Orientation changes both surface quality and strength. A snap tab
          flexes along a particular direction, while printed layers bond in a
          particular direction. Protolabs Network advises avoiding a snap-fit
          cantilever oriented vertically in Z when feasible because the joint
          can be weaker across layer bonds. Check how the joint will flex and
          load, not only whether it fits at rest.
        </p>
        <p>
          The first layer deserves a separate check. Prusa's guidance on
          elephant-foot compensation explains that a layer squished against the
          heated bed can spread wider and interfere with precise fits. A joint
          near the bed may therefore bind even when the rest of the part has
          the clearance you intended. Consider the printed contact area and
          orientation when making a test.
        </p>

        <h2 className="text-xl font-semibold tracking-tight pt-4">
          Test the joint before printing the full part
        </h2>
        <ol className="list-decimal pl-5 space-y-3 marker:text-primary">
          <li>
            <strong>Decide what the joint must do.</strong> Is it a sliding fit,
            a removable snap, or a press fit that should stay assembled? Those
            goals need different geometry and should not share one assumed
            clearance.
          </li>
          <li>
            <strong>Choose a sourced starting point for that job.</strong> Use
            the movable-part guidance for a moving part or the snap-fit guidance
            for an FDM snap connector. Keep accuracy claims separate from gap
            dimensions.
          </li>
          <li>
            <strong>Make a small fit sample.</strong> Include the actual mating
            shape, such as the pin and hole, tab and catch, or two press-fit
            surfaces. If comparing options, place several candidate gaps in one
            compact test piece and label them in the model. Change the clearance
            in small steps rather than changing multiple design features at once.
          </li>
          <li>
            <strong>Print with the intended setup.</strong> Use the same
            printer, filament, orientation, slicer profile and first-layer
            settings planned for the full job. A test made in a different
            orientation or with a different profile may not answer the question
            you care about.
          </li>
          <li>
            <strong>Check the function, not just the dimension.</strong> See
            whether the parts slide, rotate, snap together or stay assembled as
            intended. If the joint is tight or loose, adjust the relevant
            surfaces and print another small sample. Do not force a snap feature
            past a catch if it appears to be failing.
          </li>
          <li>
            <strong>Record what worked.</strong> Note the model revision,
            printer, material, orientation, profile and fit result. Reuse the
            result only for similar conditions, then inspect the full sliced
            part before a long job.
          </li>
        </ol>

        <p>
          A small test narrows uncertainty on your printer; it does not
          establish a universal number. For parts where failure could cause
          damage or injury, validate the design for its real load and use
          conditions with an appropriate engineering review.
        </p>
      </div>

      <AuthorBio />
      <RelatedContent pagePath={"/guides/" + SLUG} className="mt-8" />
      <AdSlot slot="inline" className="my-10" />
    </article>
  );
}