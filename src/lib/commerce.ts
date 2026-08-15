export const AMAZON_DISCLOSURE =
  "As an Amazon Associate I earn from qualifying purchases.";

export type AffiliateProduct = {
  id: string;
  title: string;
  eyebrow: string;
  reason: string;
  url: string;
};

export type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

const AFFILIATE_PRODUCTS: Record<string, AffiliateProduct> = {
  "bambu-a1-mini": {
    id: "bambu-a1-mini",
    title: "Bambu Lab A1 mini 3D printer",
    eyebrow: "Starter printer",
    reason: "The lowest-friction first printer pick for small PLA and PETG parts.",
    url: "https://www.amazon.com/s?k=Bambu+Lab+A1+mini+3D+printer",
  },
  "bambu-a1": {
    id: "bambu-a1",
    title: "Bambu Lab A1 3D printer",
    eyebrow: "Bigger build plate",
    reason: "The same easy workflow as the mini, with more room for practical parts.",
    url: "https://www.amazon.com/s?k=Bambu+Lab+A1+3D+printer",
  },
  "creality-ender-v3-ke": {
    id: "creality-ender-v3-ke",
    title: "Creality Ender 3 V3 KE",
    eyebrow: "Tinkerer pick",
    reason: "A budget Klipper-style machine for people who want to tune and learn.",
    url: "https://www.amazon.com/s?k=Creality+Ender+3+V3+KE+3D+printer",
  },
  "elegoo-neptune-4-plus": {
    id: "elegoo-neptune-4-plus",
    title: "Elegoo Neptune 4 Plus",
    eyebrow: "Large-format pick",
    reason: "A budget route to a much larger build volume for helmets and terrain.",
    url: "https://www.amazon.com/s?k=Elegoo+Neptune+4+Plus+3D+printer",
  },
  "bambu-ams-lite": {
    id: "bambu-ams-lite",
    title: "Bambu AMS lite",
    eyebrow: "Multi-color upgrade",
    reason: "The common four-color add-on for A1 owners, useful when the purge math works.",
    url: "https://www.amazon.com/s?k=Bambu+AMS+lite",
  },
  "ams-purge-bucket": {
    id: "ams-purge-bucket",
    title: "AMS purge bucket or poop chute",
    eyebrow: "Waste control",
    reason: "Keeps flushed filament contained during high-swap multi-color prints.",
    url: "https://www.amazon.com/s?k=Bambu+AMS+purge+bucket+poop+chute",
  },
  "sunlu-s4": {
    id: "sunlu-s4",
    title: "SUNLU S4 filament dryer",
    eyebrow: "Drying",
    reason: "A four-spool dryer for PLA, PETG, TPU, ABS, and AMS-heavy workflows.",
    url: "https://www.amazon.com/SUNLU-Filament-Dryer-S4-Temperature/dp/B0FFGXJXQ5",
  },
  "filament-storage-bags": {
    id: "filament-storage-bags",
    title: "Filament vacuum storage bag kit",
    eyebrow: "Storage",
    reason: "A practical way to keep opened spools dry between prints.",
    url: "https://www.amazon.com/Filament-Storage-Printer-Desiccant-Perfect/dp/B0CNRQ3CPB",
  },
  desiccant: {
    id: "desiccant",
    title: "Rechargeable desiccant packs",
    eyebrow: "Moisture control",
    reason: "Cheap insurance for filament bins, dry boxes, and vacuum bags.",
    url: "https://www.amazon.com/s?k=rechargeable+desiccant+packs+filament",
  },
  hygrometer: {
    id: "hygrometer",
    title: "Mini digital hygrometers",
    eyebrow: "Dry-box check",
    reason: "Lets you see whether storage is actually staying dry.",
    url: "https://www.amazon.com/s?k=mini+digital+hygrometer+filament+storage",
  },
  "overture-pla": {
    id: "overture-pla",
    title: "OVERTURE PLA filament",
    eyebrow: "Baseline PLA",
    reason: "A common, widely available PLA baseline for cost and material comparisons.",
    url: "https://www.amazon.com/OVERTURE-Filament-Printer-Dimensional-Accuracy/dp/B08L14B9FJ",
  },
  "petg-filament": {
    id: "petg-filament",
    title: "PETG filament, 1.75 mm",
    eyebrow: "Tougher material",
    reason: "The common next step when PLA is too brittle or heat-sensitive.",
    url: "https://www.amazon.com/s?k=PETG+filament+1.75mm+1kg",
  },
  "tpu-filament": {
    id: "tpu-filament",
    title: "TPU filament, 95A",
    eyebrow: "Flexible material",
    reason: "A practical flexible-filament starting point for direct-drive printers.",
    url: "https://www.amazon.com/s?k=TPU+filament+95A+1.75mm",
  },
  "digital-scale": {
    id: "digital-scale",
    title: "0.1 g digital scale",
    eyebrow: "Spool weighing",
    reason: "Needed for remaining-spool math and cleaner real-world cost tracking.",
    url: "https://www.amazon.com/filament-scale/s?k=filament+scale",
  },
  "digital-calipers": {
    id: "digital-calipers",
    title: "6 inch digital calipers",
    eyebrow: "Part measuring",
    reason: "Useful for calibration cubes, tolerances, and quick dimensional checks.",
    url: "https://www.amazon.com/YKLSXKC-Electronic-Conversion-Woodworking-Processing/dp/B08T866LYW",
  },
  "kill-a-watt": {
    id: "kill-a-watt",
    title: "P3 Kill A Watt power meter",
    eyebrow: "Electricity use",
    reason: "Measures real printer draw instead of guessing from nameplate wattage.",
    url: "https://www.amazon.com/P3-P4400-Electricity-Usage-Monitor/dp/B00009MDBU",
  },
  "smart-energy-plug": {
    id: "smart-energy-plug",
    title: "Smart plug with energy monitoring",
    eyebrow: "Longer tracking",
    reason: "Useful when you want printer power data over multiple jobs.",
    url: "https://www.amazon.com/s?k=smart+plug+energy+monitoring",
  },
  "nozzle-cleaning-kit": {
    id: "nozzle-cleaning-kit",
    title: "3D printer nozzle cleaning kit",
    eyebrow: "Failure fixes",
    reason: "A small kit for clogs, stuck filament, and routine hotend cleanup.",
    url: "https://www.amazon.com/Printer-Nozzle-Cleaning-Kit-Alternative/dp/B0797XV8ZK",
  },
  "pei-build-plate": {
    id: "pei-build-plate",
    title: "Textured PEI build plate",
    eyebrow: "Bed adhesion",
    reason: "A common first fix for adhesion problems and worn stock plates.",
    url: "https://www.amazon.com/s?k=textured+PEI+build+plate+3D+printer",
  },
};

export const AFFILIATE_PICKS: Record<string, string[]> = {
  "/guides/best-3d-printer-under-300": [
    "bambu-a1-mini",
    "bambu-a1",
    "creality-ender-v3-ke",
    "elegoo-neptune-4-plus",
  ],
  "/guides/multi-color-printing-ams-worth-it": [
    "bambu-ams-lite",
    "ams-purge-bucket",
    "sunlu-s4",
    "filament-storage-bags",
  ],
  "/tools/ams-purge-waste-calculator": [
    "bambu-ams-lite",
    "ams-purge-bucket",
    "sunlu-s4",
  ],
  "/tools/filament-cost-calculator": [
    "overture-pla",
    "digital-scale",
    "sunlu-s4",
  ],
  "/tools/print-pricing-calculator": [
    "digital-scale",
    "kill-a-watt",
    "nozzle-cleaning-kit",
  ],
  "/tools/enough-filament-calculator": [
    "digital-scale",
    "filament-storage-bags",
    "overture-pla",
  ],
  "/tools/print-time-estimator": [
    "digital-calipers",
    "bambu-a1-mini",
    "pei-build-plate",
  ],
  "/tools/material-comparison": [
    "overture-pla",
    "petg-filament",
    "tpu-filament",
    "sunlu-s4",
  ],
  "/tools/electricity-cost-calculator": [
    "kill-a-watt",
    "smart-energy-plug",
    "bambu-a1-mini",
  ],
  "/tools/failure-rate-calculator": [
    "nozzle-cleaning-kit",
    "sunlu-s4",
    "pei-build-plate",
    "filament-storage-bags",
  ],
  "/tools/remaining-spool-calculator": [
    "digital-scale",
    "filament-storage-bags",
    "sunlu-s4",
  ],
  "/spools/bambu-lab": ["digital-scale", "filament-storage-bags"],
  "/spools/polymaker": ["digital-scale", "sunlu-s4"],
  "/spools/esun": ["digital-scale", "filament-storage-bags"],
  "/spools/prusament": ["digital-scale", "sunlu-s4"],
  "/guides/3d-printing-cost-breakdown": [
    "digital-scale",
    "kill-a-watt",
    "overture-pla",
  ],
  "/guides/why-3d-prints-fail": [
    "nozzle-cleaning-kit",
    "sunlu-s4",
    "pei-build-plate",
    "filament-storage-bags",
  ],
  "/guides/3d-printer-electricity-usage": [
    "kill-a-watt",
    "smart-energy-plug",
    "bambu-a1-mini",
  ],
  "/guides/slicer-settings-that-waste-filament": [
    "digital-scale",
    "overture-pla",
    "bambu-ams-lite",
  ],
  "/guides/3d-print-time-expectations": [
    "digital-calipers",
    "bambu-a1-mini",
    "creality-ender-v3-ke",
  ],
  "/guides/pla-vs-petg-vs-abs-vs-tpu": [
    "overture-pla",
    "petg-filament",
    "tpu-filament",
    "sunlu-s4",
  ],
  "/guides/how-to-dry-filament": [
    "sunlu-s4",
    "filament-storage-bags",
    "desiccant",
    "hygrometer",
  ],
};

export const RELATED_CONTENT: { path: string; links: RelatedLink[] }[] = [
  {
    path: "/guides/best-3d-printer-under-300",
    links: [
      related("/tools/filament-cost-calculator", "Estimate filament cost", "Price the first spools before you buy."),
      related("/tools/print-time-estimator", "Estimate print time", "Set realistic expectations for different printer classes."),
      related("/guides/3d-printer-electricity-usage", "Printer electricity use", "See what a printer adds to the power bill."),
    ],
  },
  {
    path: "/guides/multi-color-printing-ams-worth-it",
    links: [
      related("/tools/ams-purge-waste-calculator", "Run the AMS purge math", "Calculate waste before buying or slicing."),
      related("/tools/filament-cost-calculator", "Price the filament", "Convert grams of purge into dollars."),
      related("/guides/slicer-settings-that-waste-filament", "Find slicer waste", "Cut the quiet settings that inflate filament use."),
    ],
  },
  {
    path: "/tools/ams-purge-waste-calculator",
    links: [
      related("/guides/multi-color-printing-ams-worth-it", "Is AMS worth it?", "Read the full multi-color economics guide."),
      related("/tools/filament-cost-calculator", "Filament cost calculator", "Convert total grams into real material cost."),
      related("/guides/slicer-settings-that-waste-filament", "Slicer waste settings", "Fix the settings that make purge worse."),
    ],
  },
  {
    path: "/tools/filament-cost-calculator",
    links: [
      related("/tools/print-pricing-calculator", "Turn cost into a price", "Markup, wear, failures, and your time."),
      related("/tools/remaining-spool-calculator", "Remaining spool calculator", "Weigh a spool before starting the print."),
      related("/guides/3d-printing-cost-breakdown", "True cost breakdown", "Add electricity, failure rate, and wear."),
    ],
  },
  {
    path: "/tools/print-pricing-calculator",
    links: [
      related("/tools/filament-cost-calculator", "Start with material cost", "Grams and spool price, waste included."),
      related("/tools/failure-rate-calculator", "Measure your failure rate", "Most people guess low. Track it instead."),
      related("/guides/3d-printing-cost-breakdown", "Every cost line explained", "The full per-print economics, written out."),
    ],
  },
  {
    path: "/tools/enough-filament-calculator",
    links: [
      related("/tools/remaining-spool-calculator", "Weigh what's left first", "Scale weight minus the empty spool weight."),
      related("/tools/ams-purge-waste-calculator", "Multi-color? Count the purge", "Color swaps eat filament the model never sees."),
      related("/tools/filament-cost-calculator", "Price the same print", "Convert the grams into real money."),
    ],
  },
  {
    path: "/tools/print-time-estimator",
    links: [
      related("/guides/3d-print-time-expectations", "Realistic print times", "Understand why slicer time estimates drift."),
      related("/tools/filament-cost-calculator", "Material cost", "Estimate the material side of the same print."),
      related("/guides/best-3d-printer-under-300", "Budget printer guide", "Compare speed expectations before buying."),
    ],
  },
  {
    path: "/tools/material-comparison",
    links: [
      related("/guides/pla-vs-petg-vs-abs-vs-tpu", "Material guide", "Pick the right material for the job."),
      related("/tools/filament-cost-calculator", "Filament cost", "Compare material price per print."),
      related("/guides/how-to-dry-filament", "Dry filament properly", "Match drying method to material type."),
    ],
  },
  {
    path: "/tools/electricity-cost-calculator",
    links: [
      related("/guides/3d-printer-electricity-usage", "Electricity guide", "See realistic watts and kWh by printer class."),
      related("/guides/3d-printing-cost-breakdown", "Full cost breakdown", "Put power cost in context."),
      related("/tools/print-time-estimator", "Print time estimator", "Longer prints drive more power use."),
    ],
  },
  {
    path: "/tools/failure-rate-calculator",
    links: [
      related("/guides/why-3d-prints-fail", "Why prints fail", "Work through the most common failure fixes."),
      related("/guides/how-to-dry-filament", "Dry wet filament", "Moisture is a common hidden failure source."),
      related("/tools/print-pricing-calculator", "Price prints properly", "Your failure rate belongs in every price."),
    ],
  },
  {
    path: "/tools/remaining-spool-calculator",
    links: [
      related("/tools/enough-filament-calculator", "Will it cover the next print?", "Check the spool against the slicer estimate."),
      related("/tools/filament-cost-calculator", "Filament cost calculator", "Use remaining grams in your cost math."),
      related("/guides/how-to-dry-filament", "Dry and store filament", "Keep opened spools usable longer."),
    ],
  },
  {
    path: "/guides/3d-printing-cost-breakdown",
    links: [
      related("/tools/filament-cost-calculator", "Filament cost calculator", "Start with the material number."),
      related("/tools/electricity-cost-calculator", "Electricity cost calculator", "Add power use for long jobs."),
      related("/tools/failure-rate-calculator", "Failure rate calculator", "Account for failed prints over time."),
    ],
  },
  {
    path: "/guides/why-3d-prints-fail",
    links: [
      related("/tools/failure-rate-calculator", "Track failures", "Measure whether fixes are actually working."),
      related("/guides/how-to-dry-filament", "Dry filament guide", "Fix moisture before blaming the printer."),
      related("/tools/material-comparison", "Compare materials", "Some failures are material-choice problems."),
    ],
  },
  {
    path: "/guides/3d-printer-electricity-usage",
    links: [
      related("/tools/electricity-cost-calculator", "Electricity calculator", "Convert watts and hours into dollars."),
      related("/tools/print-time-estimator", "Print time estimator", "Longer jobs change the power math."),
      related("/guides/3d-printing-cost-breakdown", "Full cost breakdown", "See power cost beside material cost."),
    ],
  },
  {
    path: "/guides/slicer-settings-that-waste-filament",
    links: [
      related("/tools/filament-cost-calculator", "Material cost calculator", "Price the extra grams your slicer adds."),
      related("/tools/ams-purge-waste-calculator", "AMS purge calculator", "Model color-swap waste directly."),
      related("/guides/multi-color-printing-ams-worth-it", "AMS economics guide", "Decide when multi-color is worth it."),
    ],
  },
  {
    path: "/guides/3d-print-time-expectations",
    links: [
      related("/tools/print-time-estimator", "Print time estimator", "Get a quick time range before slicing."),
      related("/guides/best-3d-printer-under-300", "Budget printer guide", "Compare machine classes and tradeoffs."),
      related("/tools/electricity-cost-calculator", "Electricity cost calculator", "Long jobs add power cost."),
    ],
  },
  {
    path: "/guides/pla-vs-petg-vs-abs-vs-tpu",
    links: [
      related("/tools/material-comparison", "Material comparison", "Compare material properties side by side."),
      related("/tools/filament-cost-calculator", "Filament cost calculator", "Price each material per print."),
      related("/guides/how-to-dry-filament", "Filament drying guide", "See which materials need drying most."),
    ],
  },
  {
    path: "/guides/how-to-dry-filament",
    links: [
      related("/tools/material-comparison", "Material comparison", "Check which materials absorb moisture fastest."),
      related("/guides/why-3d-prints-fail", "Print failure guide", "Spot moisture-related symptoms."),
      related("/tools/failure-rate-calculator", "Failure rate calculator", "Track whether drying reduces failures."),
    ],
  },
];

export function getAffiliatePicks(pagePath: string): AffiliateProduct[] {
  return (AFFILIATE_PICKS[pagePath] ?? []).map((id) => AFFILIATE_PRODUCTS[id]);
}

export function getRelatedLinks(pagePath: string): RelatedLink[] {
  return RELATED_CONTENT.find((group) => group.path === pagePath)?.links ?? [];
}

function related(href: string, label: string, description: string): RelatedLink {
  return { href, label, description };
}
