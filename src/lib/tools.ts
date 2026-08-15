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
    slug: "print-pricing-calculator",
    title: "3D Print Pricing Calculator",
    shortTitle: "Print Pricing",
    description:
      "Work out what to charge for a print: material, electricity, printer wear, failures, and your time.",
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
  {
    slug: "ams-purge-waste-calculator",
    title: "AMS Purge Waste Calculator",
    shortTitle: "AMS Purge Waste",
    description:
      "How much filament your Bambu AMS is actually wasting on color swaps. The calculator nobody else built.",
    available: true,
  },
  {
    slug: "remaining-spool-calculator",
    title: "Remaining Filament Calculator",
    shortTitle: "Remaining Spool",
    description:
      "Weigh your spool on a scale and see exactly how much filament is left. Empty-spool weight presets included for Bambu, Polymaker, eSun, and more.",
    available: true,
  },
  {
    slug: "enough-filament-calculator",
    title: "Enough Filament Calculator",
    shortTitle: "Enough Filament?",
    description:
      "Check whether what's left on the spool covers your next print, before you start it.",
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
