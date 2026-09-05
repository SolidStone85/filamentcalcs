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
    title: "PLA vs PETG vs ABS vs TPU: real use cases and which to pick",
    shortTitle: "Pick the right filament",
    description:
      "Plain-English comparison of the four common filaments: strength, temperature, food safety, and what each is actually good for, job by job.",
    publishedAt: "2026-04-23",
    readMinutes: 8,
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
    slug: "best-3d-printer-under-300",
    title: "3D printers under $300: a practical 2026 buying guide",
    shortTitle: "Printers on a $300 budget",
    description:
      "Compare the A1 mini, A1, Ender-3 V3 KE and Neptune 4 Plus by build size and budget, with dated US prices, manufacturer sources and clear tradeoffs.",
    publishedAt: "2026-04-29",
    readMinutes: 6,
    relatedToolSlugs: [
      "filament-cost-calculator",
      "print-time-estimator",
      "electricity-cost-calculator",
    ],
  },
  {
    slug: "multi-color-printing-ams-worth-it",
    title: "Is multi-color 3D printing actually worth it? The real math on AMS purge waste",
    shortTitle: "Multi-color AMS economics",
    description:
      "Use slicer totals to compare multi-color material costs, avoid counting purge twice, and weigh the extra filament and print time against the result you want.",
    publishedAt: "2026-04-24",
    readMinutes: 6,
    relatedToolSlugs: [
      "ams-purge-waste-calculator",
      "filament-cost-calculator",
      "material-comparison",
    ],
  },
  {
    slug: "how-to-dry-filament",
    title: "How to dry filament: 5 methods compared, with temperatures and times",
    shortTitle: "How to dry filament",
    description:
      "Wet filament causes more print failures than people realize. Oven, dedicated dryer, food dehydrator, vacuum bag with desiccant, and the methods to skip. Real temps, real times, by material.",
    publishedAt: "2026-05-03",
    readMinutes: 9,
    relatedToolSlugs: [
      "failure-rate-calculator",
      "filament-cost-calculator",
      "material-comparison",
    ],
  },
  {
    slug: "slicer-settings-that-waste-filament",
    title: "Slicer settings that secretly waste filament (fix these first)",
    shortTitle: "Slicer settings that waste filament",
    description:
      "Most cost calculators ignore the slicer settings quietly inflating your filament use. Infill type, support style, brim, retraction, and the purge multiplier explained, with the dollar impact of each.",
    publishedAt: "2026-05-03",
    readMinutes: 8,
    relatedToolSlugs: [
      "filament-cost-calculator",
      "ams-purge-waste-calculator",
      "failure-rate-calculator",
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
