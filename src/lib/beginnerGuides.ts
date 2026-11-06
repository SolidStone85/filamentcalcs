import type { Metadata } from "next";

import { getGuide, type Guide } from "@/lib/guides";
import { SITE } from "@/lib/tools";

export type BeginnerGuideFaq = {
  q: string;
  a: string;
};

export type BeginnerGuide = Guide & {
  faq: BeginnerGuideFaq[];
};

// The guide registry remains the source of truth for route metadata. This
// module holds only the page-specific FAQ copy used in its structured data.
const BEGINNER_GUIDE_FAQ: Record<string, BeginnerGuideFaq[]> = {
  "how-to-start-3d-printing": [
    {
      q: "What is a good first 3D print?",
      a: "Choose a small, noncritical object with a flat base, no assembly and no need for supports. A desk tray is useful while keeping the cost of a failed first attempt modest.",
    },
    {
      q: "Do I need to own a printer to try 3D printing?",
      a: "No. You can practice model placement and slicing in software, or ask a makerspace or printing service to make a sample before buying equipment. Availability and fees vary.",
    },
    {
      q: "Should I adjust the nozzle height if a first layer comes loose?",
      a: "First check the build surface, selected material profile and the calibration procedure for your exact printer. Follow its manual rather than applying a generic nozzle-height adjustment.",
    },
  ],
  "3d-printing-beginner-equipment": [
    {
      q: "What equipment do I need for a first filament print?",
      a: "Start with a compatible printer and build surface, one spool of filament supported by that printer, a supported slicer and the tools specified by the startup manual. Check what is included before buying extras.",
    },
    {
      q: "Do beginners need a filament dryer?",
      a: "Not automatically. Use the filament maker's instructions, storage conditions and print results to decide. If drying is required, follow settings for the exact filament, dryer and spool.",
    },
    {
      q: "Is automatic bed leveling a guarantee that every first layer will stick?",
      a: "No. It can reduce some setup work, but plate cleanliness, correct installation, material settings and the printer's calibration procedure still matter.",
    },
  ],
  "useful-3d-prints-save-money": [
    {
      q: "Which 3D prints are most likely to save money?",
      a: "A specific part that must fit an awkward space, replace an unavailable item or solve a real storage problem may compare well. Use the price of the alternative you would actually buy and count the full printing costs.",
    },
    {
      q: "What costs belong in a print-versus-buy comparison?",
      a: "At minimum, compare material, electricity and a clearly stated equipment allowance. Add failed attempts, finishing, delivery and other costs that apply, and decide separately whether to count design and hands-on time.",
    },
    {
      q: "Will a 3D printer pay for itself?",
      a: "There is no universal payback date. It depends on purchases you would genuinely avoid and the extra costs of making those particular objects.",
    },
  ],
  "start-3d-printing-business": [
    {
      q: "Should I buy several printers before testing a product idea?",
      a: "Start with a representative sample and small paid order, which can be produced by a service if you do not own suitable equipment. Track what customers actually order before treating machine capacity as the bottleneck.",
    },
    {
      q: "Can I sell a print made from a paid STL file?",
      a: "Payment for a file does not by itself grant commercial printing rights. Read the license for that model and confirm that the seller has authority to grant the rights you need.",
    },
    {
      q: "Does a commercial STL license alone make a 3D print eligible for Etsy?",
      a: "No. The platform's Creativity Standards set their own category rules. A commercial license and marketplace eligibility are separate checks.",
    },
  ],
};

export function getBeginnerGuide(slug: string): BeginnerGuide | undefined {
  const guide = getGuide(slug);
  const faq = BEGINNER_GUIDE_FAQ[slug];

  if (!guide || !faq) return undefined;

  return { ...guide, faq };
}

export function beginnerGuideMetadata(slug: string): Metadata {
  const guide = getGuide(slug);

  if (!guide) {
    throw new Error(`Unknown beginner guide: ${slug}`);
  }

  const url = `${SITE.url}/guides/${guide.slug}`;

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      type: "article",
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt ?? guide.publishedAt,
    },
  };
}
