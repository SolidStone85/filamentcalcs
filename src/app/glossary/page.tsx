import type { Metadata } from "next";
import Link from "next/link";

import { SITE } from "@/lib/tools";

const TITLE = "3D printing glossary: terms hobbyists actually use, plain explanations";
const DESCRIPTION =
  "Plain-English definitions of common 3D printing terms: filament types, slicer settings, hardware components, troubleshooting jargon. From AMS to Z-banding.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE.url}/glossary` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/glossary`,
    type: "article",
  },
};

type Term = {
  term: string;
  definition: string;
  related?: string[];
};

const TERMS: Term[] = [
  {
    term: "ABS",
    definition:
      "Acrylonitrile Butadiene Styrene. A heat-resistant plastic used for parts that see warm conditions (car interiors, automotive trim). Needs an enclosed printer because of warping. Largely replaced by ASA for outdoor use because ABS degrades in UV.",
    related: ["ASA", "Enclosure", "Warping"],
  },
  {
    term: "AMS",
    definition:
      "Automatic Material System. Bambu Lab's multi-color filament feeder. Holds up to 4 spools and swaps between them mid-print. Each color swap purges filament out of the hotend, which is the source of multi-color print waste.",
    related: ["Purge", "Multi-color"],
  },
  {
    term: "ASA",
    definition:
      "Acrylonitrile Styrene Acrylate. Like ABS but UV-stable. Better choice for outdoor parts that ABS would degrade on. Same printing requirements as ABS: enclosure, ventilation, high temps.",
    related: ["ABS", "Outdoor printing"],
  },
  {
    term: "Bambu",
    definition:
      "Bambu Lab. A 3D printer manufacturer founded in 2020 that became dominant in the consumer market with the X1 Carbon, P1S, A1, and A1 mini. Known for fast CoreXY designs and the AMS multi-material system.",
    related: ["AMS", "CoreXY"],
  },
  {
    term: "Bed adhesion",
    definition:
      "How well the first layer of a print sticks to the build plate. Poor adhesion is the single most common cause of print failure. Fixed by cleaning the bed, leveling, adjusting first layer height, or using a glue stick.",
    related: ["First layer", "Warping"],
  },
  {
    term: "Brim",
    definition:
      "Extra material printed around the base of a part to improve bed adhesion. Default brim width is often 8mm; for many prints, 4-5mm is enough. Removed by hand or with a deburring tool after the print finishes.",
    related: ["Bed adhesion", "Skirt"],
  },
  {
    term: "CoreXY",
    definition:
      "A motion system where the print head moves in X and Y while the bed only moves in Z. Faster than bedslinger designs because the bed (heavy) doesn't need to accelerate. Bambu X1C and P1S are CoreXY. Voron 2.4 is a popular DIY CoreXY.",
    related: ["Bedslinger", "Voron"],
  },
  {
    term: "Bedslinger",
    definition:
      "A printer where the bed moves on the Y axis (forward/backward). Most cheap printers and the Ender 3 series are bedslingers. Limits print speed because the bed has mass that takes time to start and stop.",
    related: ["CoreXY"],
  },
  {
    term: "Cura",
    definition:
      "An open-source slicer made by Ultimaker. Free, mature, supports a huge range of printers. Increasingly out of favor for newer Bambu and Prusa printers, which have their own optimized slicers.",
    related: ["Slicer", "OrcaSlicer", "PrusaSlicer"],
  },
  {
    term: "Enclosure",
    definition:
      "A box around a printer that traps heat and reduces drafts. Required for ABS, ASA, and engineering filaments. Useful for PETG and large PLA prints to reduce warping. Can be a printer feature (Bambu X1C) or a DIY add-on.",
    related: ["ABS", "Warping"],
  },
  {
    term: "Extruder",
    definition:
      "The motor and gear assembly that pushes filament into the hotend. Direct-drive extruders sit on the print head; Bowden extruders push filament through a tube to the head. Direct-drive handles flexible filaments better.",
    related: ["Hotend", "TPU"],
  },
  {
    term: "Filament",
    definition:
      "The plastic spool that feeds into a 3D printer. Sold in 1.75mm or 2.85mm diameters; 1.75mm is now standard for hobbyists. Common materials: PLA, PETG, ABS, ASA, TPU, Nylon, PC.",
    related: ["PLA", "PETG", "TPU"],
  },
  {
    term: "First layer",
    definition:
      "The first printed layer that sticks to the build plate. Critical for the success of every print. Slightly thicker, slower, and slightly hotter than other layers. Bad first layers cause about 40% of all print failures.",
    related: ["Bed adhesion", "Print failure"],
  },
  {
    term: "Flush volume",
    definition:
      "On Bambu AMS prints, the amount of filament purged from the hotend during a color change. Default is around 8 grams per swap. The flush volume multiplier in Bambu Studio (default 1.0x) can be tuned down for compatible color pairs.",
    related: ["AMS", "Purge"],
  },
  {
    term: "Gyroid",
    definition:
      "An infill pattern shaped like interconnecting wavy surfaces. Strong in all directions, prints relatively fast, and uses material efficiently. Good default infill for most prints.",
    related: ["Infill"],
  },
  {
    term: "Hotend",
    definition:
      "The heated assembly at the end of the print head that melts filament and extrudes it through the nozzle. Higher-quality hotends (E3D Volcano, Bambu Hotend) handle higher temperatures and faster flow rates.",
    related: ["Extruder", "Nozzle"],
  },
  {
    term: "Infill",
    definition:
      "The internal structure of a 3D print, usually a percentage of total volume. 15% is typical for display parts; 30-50% for mechanical parts. Patterns include grid, gyroid, honeycomb, lightning. Pattern affects strength, weight, and print time.",
    related: ["Gyroid", "Wall count"],
  },
  {
    term: "Klipper",
    definition:
      "Open-source firmware that runs on a Raspberry Pi (or similar) connected to a printer board. Enables high-speed printing through input shaping and pressure advance. Used by Voron printers and many Ender 3 mod builds.",
    related: ["Marlin", "Voron"],
  },
  {
    term: "Layer height",
    definition:
      "The Z thickness of each printed layer. 0.20mm is standard. Smaller layers (0.12-0.16mm) give finer detail but take longer. Larger layers (0.24-0.32mm) print faster with rougher surface.",
    related: ["Print time"],
  },
  {
    term: "Marlin",
    definition:
      "Open-source firmware that runs directly on the printer's main board. Used by most older printers (Ender 3 stock, original Prusa). Less performant than Klipper for high-speed printing but simpler to set up.",
    related: ["Klipper"],
  },
  {
    term: "Multi-color",
    definition:
      "Printing a single object using multiple colors of filament, swapped in by an AMS, MMU, or Palette. Adds significant material waste from purging. Each swap costs 5-25g of filament depending on system.",
    related: ["AMS", "MMU", "Purge"],
  },
  {
    term: "MMU",
    definition:
      "Multi Material Unit. Prusa's multi-color filament feeder. Older MMU2 had reliability issues; MMU3 is improved. Generally purges more filament per swap than the Bambu AMS.",
    related: ["AMS", "Multi-color"],
  },
  {
    term: "Nozzle",
    definition:
      "The brass or hardened-steel tip at the bottom of the hotend that extrudes filament. Standard size is 0.4mm. 0.6mm and 0.8mm nozzles print faster with thicker layer lines. Hardened steel is required for abrasive filaments (carbon-fiber-filled, glow-in-dark).",
    related: ["Hotend"],
  },
  {
    term: "OrcaSlicer",
    definition:
      "A community fork of Bambu Studio with additional features and broader printer support. Popular for users who want Bambu's polished workflow on non-Bambu printers. Updates more frequently than Bambu Studio.",
    related: ["Bambu Studio", "Slicer"],
  },
  {
    term: "PETG",
    definition:
      "Polyethylene Terephthalate Glycol. Tougher than PLA, handles outdoor and warm conditions, prints at higher temperatures (230-250°C). Most common second material after PLA. Strings more than PLA so retraction tuning matters.",
    related: ["PLA", "Stringing"],
  },
  {
    term: "PLA",
    definition:
      "Polylactic Acid. The default 3D printing material. Easy to print, low odor, doesn't need an enclosure, made from corn starch. Softens around 55-60°C, so unsuitable for outdoor or in-car use.",
    related: ["PETG", "PLA+"],
  },
  {
    term: "PLA+",
    definition:
      "PLA with additives that improve impact resistance. Sometimes called Tough PLA. Prints almost identically to standard PLA. Slightly more expensive, often worth it for functional parts.",
    related: ["PLA"],
  },
  {
    term: "PolyTerra",
    definition:
      "A line of matte-finish PLA from Polymaker. Sustainable packaging, consistent quality, prints reliably. Popular community choice when standard PLA is too glossy.",
    related: ["PLA", "Polymaker"],
  },
  {
    term: "Print failure",
    definition:
      "Any print that doesn't complete successfully. Includes detachment from the bed, layer shifts, spaghetti from extrusion failures, support collapse, and warping. Hobbyist failure rates typically 5-10%.",
    related: ["Bed adhesion", "Layer shift"],
  },
  {
    term: "Purge",
    definition:
      "On multi-color prints, the filament dumped from the hotend during a color change to flush out the previous color. Goes into the purge tower or, with newer slicers, into the model itself. The biggest source of multi-color print waste.",
    related: ["AMS", "Multi-color"],
  },
  {
    term: "Retraction",
    definition:
      "Pulling filament back into the extruder during travel moves to prevent oozing. Bowden printers need more retraction than direct-drive. Too much retraction causes clogging; too little causes stringing.",
    related: ["Stringing", "Extruder"],
  },
  {
    term: "Skirt",
    definition:
      "A single-layer outline printed around the part before the print starts. Primes the nozzle and lets you visually confirm bed level. Doesn't touch the part. Different from a brim, which is wider and aids adhesion.",
    related: ["Brim"],
  },
  {
    term: "Slicer",
    definition:
      "Software that converts a 3D model into the layer-by-layer printer instructions (G-code). Common slicers: Bambu Studio, OrcaSlicer, PrusaSlicer, Cura. Each has different defaults and features.",
    related: ["G-code"],
  },
  {
    term: "Stringing",
    definition:
      "Thin strings of filament left between parts of a print, caused by ooze during travel moves. Most common on PETG and TPU. Fixed by tuning retraction, lowering temperature, or increasing travel speed.",
    related: ["Retraction"],
  },
  {
    term: "Support",
    definition:
      "Temporary structure printed under overhangs to keep them from sagging. Removed after print. Tree supports use less material than grid; both add print time. Best avoided by reorienting the part if possible.",
    related: ["Tree support"],
  },
  {
    term: "Tree support",
    definition:
      "An organic-shaped support pattern that grows up from the bed in branching tree-like structures. Uses less material than traditional grid supports and is easier to remove from delicate parts.",
    related: ["Support"],
  },
  {
    term: "TPU",
    definition:
      "Thermoplastic Polyurethane. Flexible filament for phone cases, gaskets, and shock-absorbing parts. Hard to print on Bowden extruders. Sold in different shore hardness ratings; 95A is most common for hobbyist use.",
    related: ["Filament", "Extruder"],
  },
  {
    term: "Voron",
    definition:
      "A series of open-source DIY CoreXY printer designs (Voron 0, 2.4, Trident, Switchwire). Run Klipper firmware. Capable of very high print speeds. Build cost typically $1000-2000 in parts.",
    related: ["CoreXY", "Klipper"],
  },
  {
    term: "Wall count",
    definition:
      "Number of perimeter loops printed for the outside of each layer. Default is 2-3. More walls increase strength and surface quality at a small cost in time and material. For decorative parts, 2 is fine.",
    related: ["Infill"],
  },
  {
    term: "Warping",
    definition:
      "When the corners of a print lift off the bed during printing. Caused by uneven cooling shrinkage, especially in ABS, ASA, and large flat parts in any material. Fixed by enclosure, brim, or material change.",
    related: ["ABS", "Bed adhesion"],
  },
  {
    term: "Z-banding",
    definition:
      "Visible horizontal lines or stripes in print walls, usually caused by Z-axis lead screw issues, inconsistent layer heights, or thermal cycling of the bed. Cosmetic only; doesn't affect strength.",
    related: ["Layer height"],
  },
];

export default function GlossaryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "3D Printing Glossary",
    hasDefinedTerm: TERMS.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
    })),
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Reference
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          3D printing glossary
        </h1>
        <p className="text-sm text-muted-foreground">
          Plain-English definitions of {TERMS.length} terms hobbyists actually
          use. Updated May 2026.
        </p>
      </header>

      <div className="mt-8 space-y-6">
        {TERMS.map((t) => (
          <section
            key={t.term}
            id={t.term.toLowerCase().replace(/\s+/g, "-")}
            className="border-b pb-4"
          >
            <h2 className="text-lg font-semibold text-primary">{t.term}</h2>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              {t.definition}
            </p>
            {t.related && t.related.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="font-medium">Related:</span>{" "}
                {t.related.join(", ")}
              </p>
            )}
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-lg border p-5 text-sm">
        <p className="text-muted-foreground">
          Term missing or definition wrong? Suggest a correction via the{" "}
          <Link href="/contact" className="underline underline-offset-4">
            contact page
          </Link>
          . Glossary is reviewed quarterly along with the calculators.
        </p>
      </section>
    </article>
  );
}
