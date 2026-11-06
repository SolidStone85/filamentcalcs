// Central registry of published guides. Used by the index page, sitemap,
// and internal links between calculators and guides.

export type Guide = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  publishedAt: string; // ISO date
  updatedAt?: string; // ISO date of the last substantive content change
  readMinutes: number;
  relatedToolSlugs: string[]; // calculator slugs linked from this article
};

export const GUIDES: Guide[] = [
  {
    "slug": "3d-print-cosplay-helmet-size-cost",
    "title": "3D Printing a Cosplay Helmet: Size, Splits and Real Cost",
    "shortTitle": "Cosplay helmet fit and cost",
    "description": "Plan a 3D printed cosplay helmet: check head and printer fit, compare whole versus split prints, and budget filament, finishing and reprints.",
    "publishedAt": "2026-10-23",
    "readMinutes": 10,
    "relatedToolSlugs": [
      "filament-cost-calculator",
      "enough-filament-calculator",
      "electricity-cost-calculator",
      "print-pricing-calculator",
      "print-time-estimator",
      "material-comparison"
    ],
    "updatedAt": "2026-10-23"
  },
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
    title: "Why Do 3D Prints Fail? 12 Checks by Symptom",
    shortTitle: "Print failure fixes",
    description:
      "Troubleshoot first-layer problems, warping, stringing and other symptoms with manufacturer guidance, consistent failure records and clear material-loss examples.",
    publishedAt: "2026-04-23",
    updatedAt: "2026-11-06",
    readMinutes: 9,
    relatedToolSlugs: ["failure-rate-calculator", "filament-cost-calculator"],
  },
  {
    slug: "3d-printer-electricity-usage",
    title: "3D Printer Electricity Cost: Watts, kWh and Examples",
    shortTitle: "3D printer electricity use",
    description:
      "Work out 3D printer electricity cost per hour, print or month. See labeled watt/kWh examples, measure your Bambu or Prusa, and use the free calculator.",
    publishedAt: "2026-04-23",
    updatedAt: "2026-10-13",
    readMinutes: 5,
    relatedToolSlugs: [
      "electricity-cost-calculator",
      "filament-cost-calculator",
    ],
  },
  {
    slug: "3d-print-time-expectations",
    title: "How Long Does a 3D Print Take? Estimates and Worked Examples",
    shortTitle: "How long prints take",
    description:
      "Estimate print time from grams and an explicit average rate, compare with your slicer, and plan long jobs. Worked examples are assumptions, not printer benchmarks.",
    publishedAt: "2026-04-23",
    updatedAt: "2026-11-06",
    readMinutes: 6,
    relatedToolSlugs: ["print-time-estimator", "filament-cost-calculator"],
  },
  {
    slug: "best-3d-printer-under-300",
    title: "3D Printers Under $300: A1 mini vs A1",
    shortTitle: "Printers on a $300 budget",
    description:
      "Compare A1 mini and A1 build sizes, dated US base prices and setup costs. See which alternatives exceed $300 and why multicolor costs extra.",
    publishedAt: "2026-04-29",
    updatedAt: "2026-10-13",
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
      "Wet filament causes more print failures than people realize. Drying settings from Prusa, Bambu Lab and Polymaker by named product, spool and dryer temperature limits, and which methods to skip.",
    publishedAt: "2026-05-03",
    updatedAt: "2026-10-10",
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
