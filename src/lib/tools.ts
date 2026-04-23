// Central list of all calculator tools. Used by the homepage grid, site nav,
// sitemap, and JSON-LD. Keep this source of truth in one place.

export type Tool = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  available: boolean;
};

export const TOOLS: Tool[] = [
  {
    slug: "filament-cost-calculator",
    title: "Filament Cost Calculator",
    shortTitle: "Filament Cost",
    description:
      "Calculate the material cost of any 3D print from weight and spool price.",
    available: true,
  },
  {
    slug: "print-time-estimator",
    title: "Print Time Estimator",
    shortTitle: "Print Time",
    description:
      "Estimate how long a print will take based on weight and printer class.",
    available: true,
  },
  {
    slug: "material-comparison",
    title: "Material Comparison",
    shortTitle: "Materials",
    description:
      "Compare PLA, PETG, ABS, TPU, and more side by side on price, strength, and temperature.",
    available: true,
  },
  {
    slug: "electricity-cost-calculator",
    title: "Electricity Cost Calculator",
    shortTitle: "Electricity",
    description:
      "Figure out what each print actually costs to run based on wattage and local rates.",
    available: true,
  },
  {
    slug: "failure-rate-calculator",
    title: "Failure Rate Calculator",
    shortTitle: "Failure Rate",
    description:
      "Track your real-world failure rate and compare it to hobbyist benchmarks.",
    available: true,
  },
];

export const SITE = {
  name: "filamentcalcs",
  domain: "filamentcalcs.com",
  url: "https://filamentcalcs.com",
  tagline: "Free calculators for 3D printing hobbyists",
  description:
    "Free, fast, mobile-friendly 3D printing calculators: filament cost, print time, electricity, material comparison, and more.",
};
