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
    reason: "A 180 mm build cube for smaller parts. Compare the delivered base-printer price and bundle contents.",
    url: "https://www.amazon.com/s?k=Bambu+Lab+A1+mini+3D+printer",
  },
  "bambu-a1": {
    id: "bambu-a1",
    title: "Bambu Lab A1 3D printer",
    eyebrow: "Bigger build plate",
    reason: "A 256 mm build cube for larger parts. Check the delivered price; a base printer and a Combo are different purchases.",
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
    reason: "Four-spool dryer with a 70°C maximum. Check your exact filament and spool limits; it cannot meet an 80°C drying setting such as Bambu ABS or ASA.",
    url: "https://www.amazon.com/SUNLU-Filament-Dryer-S4-Temperature/dp/B0FFGXJXQ5",
  },
  "filament-storage-bags": {
    id: "filament-storage-bags",
    title: "Filament storage bags",
    eyebrow: "Storage",
    reason: "Compare bag dimensions and whether a pump or desiccant is included. Sealed storage limits moisture exposure; it does not dry an already wet spool.",
    url: "https://www.amazon.com/s?k=filament+vacuum+storage+bags+1kg",
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
    title: "Ordinary PLA filament, 1.75 mm",
    eyebrow: "Baseline PLA",
    reason: "Search for ordinary, unfilled PLA. Confirm your printer's filament diameter, net quantity and a complete spool rather than a refill before buying.",
    url: "https://www.amazon.com/s?k=PLA+filament+1.75mm+1kg",
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
    title: "Digital scale for filament",
    eyebrow: "Spool weighing",
    reason: "Choose capacity above the loaded spool's combined filament and empty-spool weight. Check platform size and accuracy as well as displayed resolution.",
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
    reason: "Read whole-job kWh to price a print. Check outlet voltage, plug type and load rating before buying.",
    url: "https://www.amazon.com/P3-P4400-Electricity-Usage-Monitor/dp/B00009MDBU",
  },
  "smart-energy-plug": {
    id: "smart-energy-plug",
    title: "Smart plug with energy monitoring",
    eyebrow: "Longer tracking",
    reason: "Compare job energy over time. Confirm that the model records kWh and matches your outlet voltage, plug type and load.",
    url: "https://www.amazon.com/s?k=smart+plug+energy+monitoring",
  },
  "nozzle-cleaning-kit": {
    id: "nozzle-cleaning-kit",
    title: "3D printer nozzle cleaning kit",
    eyebrow: "Failure fixes",
    reason: "This listing includes 0.4 mm cleaning needles. Match your nozzle bore and follow the hotend maker's cleaning procedure; it is not universal.",
    url: "https://www.amazon.com/Printer-Nozzle-Cleaning-Kit-Alternative/dp/B0797XV8ZK",
  },
  "pei-build-plate": {
    id: "pei-build-plate",
    title: "Textured PEI build plate",
    eyebrow: "Bed adhesion",
    reason: "Match the printer, plate dimensions and material/surface pairing. Follow the maker's instructions; a plate does not fix every adhesion problem.",
    url: "https://www.amazon.com/s?k=textured+PEI+build+plate+3D+printer",
  },
};

export const AFFILIATE_PICKS: Record<string, string[]> = {
  "/guides/how-to-start-3d-printing": ["overture-pla"],
  "/guides/3d-printing-beginner-equipment": ["overture-pla", "digital-scale", "filament-storage-bags"],
  "/guides/useful-3d-prints-save-money": ["digital-calipers", "digital-scale"],
  "/guides/start-3d-printing-business": ["digital-scale", "kill-a-watt"],
  "/guides/best-3d-printer-under-300": ["bambu-a1-mini", "bambu-a1"],
  "/guides/multi-color-printing-ams-worth-it": [
    "bambu-ams-lite",
    "ams-purge-bucket",
    "sunlu-s4",
    "filament-storage-bags",
  ],
  "/tools/ams-purge-waste-calculator": ["digital-scale", "ams-purge-bucket"],
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
  "/tools/print-time-estimator": ["digital-scale"],
  "/tools/material-comparison": [
    "overture-pla",
    "petg-filament",
    "tpu-filament",
    "sunlu-s4",
  ],
  "/tools/electricity-cost-calculator": ["kill-a-watt", "smart-energy-plug"],
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
  "/guides/3d-printer-electricity-usage": ["kill-a-watt", "smart-energy-plug"],
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
    path: "/guides/how-to-start-3d-printing",
    links: [
      related("/guides/3d-printing-beginner-equipment", "Plan a beginner setup", "Separate essential equipment from upgrades."),
      related("/tools/filament-cost-calculator", "Cost your first attempt", "Use the whole-job grams from your slicer."),
      related("/tools/remaining-spool-calculator", "Check the remaining spool", "Subtract the matching empty-spool weight."),
    ],
  },
  {
    path: "/guides/3d-printing-beginner-equipment",
    links: [
      related("/guides/how-to-start-3d-printing", "Make a first useful print", "Follow the model-to-slicer-to-printer workflow."),
      related("/guides/best-3d-printer-under-300", "Compare a dated budget shortlist", "Check current regional prices and full checkout costs."),
      related("/tools/material-comparison", "Check material limits", "Read named-product data rather than family promises."),
    ],
  },
  {
    path: "/guides/useful-3d-prints-save-money",
    links: [
      related("/tools/filament-cost-calculator", "Price the material", "Include supports and purge only once."),
      related("/tools/electricity-cost-calculator", "Add measured energy", "Use your tariff and a whole-job measurement."),
      related("/guides/3d-printing-cost-breakdown", "Review the complete cost", "Keep equipment, failed attempts and labor visible."),
    ],
  },
  {
    path: "/guides/start-3d-printing-business",
    links: [
      related("/tools/print-pricing-calculator", "Build a production estimate", "Then add packaging, fees and excluded overhead."),
      related("/tools/failure-rate-calculator", "Track rejected attempts", "Record actual consumed grams and comparable jobs."),
      related("/guides/useful-3d-prints-save-money", "Evaluate a useful product", "Start with the customer's actual alternative."),
    ],
  },
  {
    path: "/guides/3d-print-cosplay-helmet-size-cost",
    links: [
      related("/tools/filament-cost-calculator", "Cost the sliced job", "Include supports, brims and connectors once."),
      related("/tools/enough-filament-calculator", "Check the spool", "Compare remaining filament with the whole job."),
      related("/tools/print-pricing-calculator", "Budget finishing time", "Keep machine time and hands-on work separate."),
    ],
  },
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
      related("/tools/filament-length-converter", "Grams to meters", "See how much length is left on the spool."),
    ],
  },
  {
    path: "/tools/filament-length-converter",
    links: [
      related("/tools/remaining-spool-calculator", "Weigh what's left first", "Scale weight minus the empty spool weight."),
      related("/tools/filament-cost-calculator", "Filament cost calculator", "Price the grams with waste included."),
      related("/tools/material-comparison", "Material comparison", "Heat and strength data for the same products."),
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
    path: "/guides/fit-and-clearance-3d-printed-parts",
    links: [
      related("/tools/material-comparison", "Compare materials", "Review material properties before choosing filament for a fit test or final part."),
      related("/tools/filament-cost-calculator", "Estimate filament cost", "Compare the material cost for test pieces and a final part."),
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

export function getAmazonLinkLabel(rawUrl: string): string {
  return new URL(rawUrl).searchParams.has("k") ? "Search Amazon.com" : "View on Amazon.com";
}

export function getRelatedLinks(pagePath: string): RelatedLink[] {
  return RELATED_CONTENT.find((group) => group.path === pagePath)?.links ?? [];
}

function related(href: string, label: string, description: string): RelatedLink {
  return { href, label, description };
}
