// Central registry of published guides. Used by the index page, sitemap,
// and internal links between calculators and guides.

export type Guide = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  publishedAt: string; // ISO date
  readMinutes: number;
  relatedToolSlugs: string[]; // calculator slugs linked from this article
};

export const GUIDES: Guide[] = [
  {
    slug: "3d-printing-cost-breakdown",
    title: "How much does it really cost to 3D print? Full breakdown for 2026",
    shortTitle: "True cost of a 3D print",
    description:
      "Filament, electricity, printer wear, failures, and time. The real per-print cost, not the marketing number.",
    publishedAt: "2026-04-23",
    readMinutes: 8,
    relatedToolSlugs: [
      "filament-cost-calculator",
      "electricity-cost-calculator",
      "failure-rate-calculator",
    ],
  },
  {
    slug: "pla-vs-petg-vs-abs-vs-tpu",
    title: "PLA vs PETG vs ABS vs TPU: which filament should you actually pick?",
    shortTitle: "Pick the right filament",
    description:
      "Plain-English comparison of the four most common 3D printing materials. When each one is right, and when it isn't.",
    publishedAt: "2026-04-23",
    readMinutes: 7,
    relatedToolSlugs: ["material-comparison", "filament-cost-calculator"],
  },
  {
    slug: "why-3d-prints-fail",
    title: "Why does my 3D print keep failing? 12 fixes ranked by frequency",
    shortTitle: "Print failure fixes",
    description:
      "The twelve most common print failures, how to spot them, and what actually fixes each one.",
    publishedAt: "2026-04-23",
    readMinutes: 9,
    relatedToolSlugs: ["failure-rate-calculator", "filament-cost-calculator"],
  },
  {
    slug: "3d-printer-electricity-usage",
    title: "How much electricity does a 3D printer actually use?",
    shortTitle: "3D printer electricity use",
    description:
      "Real numbers on watts, kWh, and monthly electricity cost. Why most people massively overestimate this.",
    publishedAt: "2026-04-23",
    readMinutes: 6,
    relatedToolSlugs: [
      "electricity-cost-calculator",
      "filament-cost-calculator",
    ],
  },
  {
    slug: "3d-print-time-expectations",
    title: "How long does a 3D print take? Realistic times by printer class",
    shortTitle: "How long prints take",
    description:
      "Bambu, Prusa, Ender, Klipper-tuned. Real g/hr throughput numbers and why your slicer estimate is often wrong.",
    publishedAt: "2026-04-23",
    readMinutes: 6,
    relatedToolSlugs: ["print-time-estimator", "filament-cost-calculator"],
  },
  {
    slug: "multi-color-printing-ams-worth-it",
    title: "Is multi-color 3D printing actually worth it? The real math on AMS purge waste",
    shortTitle: "Multi-color AMS economics",
    description:
      "Bambu AMS can waste more filament on purge than the actual part weighs. When multi-color is worth it, when it isn't, and how to cut the waste.",
    publishedAt: "2026-04-24",
    readMinutes: 8,
    relatedToolSlugs: [
      "ams-purge-waste-calculator",
      "filament-cost-calculator",
      "material-comparison",
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
