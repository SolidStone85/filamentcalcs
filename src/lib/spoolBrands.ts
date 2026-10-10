// Content for the per-brand empty-spool-weight landing pages (/spools/*).
// Each page embeds the Remaining Spool calculator preset to that brand and
// adds brand-specific tare data. Every row names what is on the scale, its
// evidence type and every source behind its numbers; rows with a presetId
// must match the preset in lib/presets/spools.ts, and summary tiles must
// match a row (tests/reference.test.mjs checks both).

import type { EvidenceType, Source } from "./reference";

export type SpoolAnswerTile = {
  label: string;
  value: string;
  emphasis?: boolean; // the number most visitors came for
  joinBefore?: "+" | "="; // draws an operator before this tile
};

export type SpoolWeightRow = {
  variant: string;
  includes: string; // what is on the scale when this number applies
  grams: string; // display string; ranges allowed ("191-201")
  evidence: EvidenceType;
  sources: Source[]; // every source behind the numbers; empty only if unverified
  presetId?: string; // calculator preset that uses this number, if any
  note: string;
};

export type SpoolBrandPage = {
  slug: string;
  brand: string;
  title: string; // h1 + <title>
  metaDescription: string;
  presetId: string; // default preset for the embedded calculator
  checked: string; // ISO date the evidence on this page was last reviewed
  summary: SpoolAnswerTile[]; // the short answer shown above the calculator
  intro: string[];
  weights: SpoolWeightRow[];
  faq: { q: string; a: string }[];
  furtherReading: Source[]; // useful links that are not weight sources
  correction?: string; // dated note for substantive number changes
};

const CHECKED = "2026-10-10";

const src = (label: string, url: string): Source => ({ label, url, checked: CHECKED });

const BAMBU_134917 = src(
  "Bambu Lab forum: measured spool and core weights",
  "https://forum.bambulab.com/t/why-dont-you-put-the-weight-of-the-spool-on-each-roll/134917",
);
const BAMBU_91401 = src(
  "Bambu Lab forum: filament spool weight thread",
  "https://forum.bambulab.com/t/filament-spool-weight/91401",
);
const PRINTABLES_CATALOG = src(
  "Empty Spool Weight Catalog and its comments (Printables)",
  "https://www.printables.com/model/464663-empty-spool-weight-catalog",
);
const PRINTING_SPACE = src(
  "3D Printing Space forum: empty spool weights",
  "https://3dprintingspace.com/t/empty-spool-weights/1514",
);
const POLYMAKER_TABLE = src(
  "Polymaker product page with spool table (Polymaker Wood PLA)",
  "https://shop.polymaker.com/products/polymaker-wood-pla",
);

export const SPOOL_BRAND_PAGES: SpoolBrandPage[] = [
  {
    slug: "bambu-lab",
    brand: "Bambu Lab",
    title: "Bambu Lab empty spool weight: reusable spool, refill core, cardboard",
    metaDescription:
      "Bambu Lab empty spool weights with sources: reusable spool plus refill core 245 to 260 g, bare reusable spool 208 to 216 g, PPA-CF cardboard spool about 196 g. Weigh your spool and get grams of filament left.",
    presetId: "bambu-refill",
    checked: CHECKED,
    summary: [
      { label: "Bare reusable spool", value: "208-216 g" },
      { label: "Refill cardboard core", value: "~37 g", joinBefore: "+" },
      { label: "With a refill mounted", value: "245-260 g", joinBefore: "=", emphasis: true },
    ],
    intro: [
      "Bambu Lab does not publish a clear empty weight for its spools. Its store lists the reusable spool at 250 g but does not say whether that is the empty spool or the packed item. The numbers below come from people who weighed their own spools, and each row links to where they came from.",
      "What matters most is what is on your scale. With a refill mounted, the reusable plastic spool plus the refill's cardboard core measured 245 to 260 g. The calculator below starts at 253 g, the middle of those measurements.",
    ],
    weights: [
      {
        variant: "Reusable spool + refill core",
        includes: "Plastic reusable spool with the refill's cardboard core inside",
        grams: "~253 (245-260)",
        evidence: "community",
        presetId: "bambu-refill",
        note: "Five spools weighed by three people: 245, 253, 253, 255 and 260 g, across white, transparent and light-grey spools.",
        sources: [BAMBU_134917, BAMBU_91401, PRINTABLES_CATALOG],
      },
      {
        variant: "Reusable spool, bare",
        includes: "Plastic reusable spool only, no cardboard core",
        grams: "208-216",
        evidence: "community",
        note: "Four people's measurements: 208 g (one person, four spools), 210 g, 212 g and 216 g (two people, one of whom did not say whether the core was on). Sources disagree on which color is the high-temperature version, so we do not split by rating.",
        sources: [BAMBU_91401, PRINTABLES_CATALOG],
      },
      {
        variant: "Refill cardboard core alone",
        includes: "The cardboard ring a refill is wound on",
        grams: "~37 (37-38)",
        evidence: "community",
        note: "One person's measurement. Another reported 35 g but later said their scale had problems.",
        sources: [
          BAMBU_134917,
          src(
            "Bambu Lab forum: refill weight and scale issues",
            "https://forum.bambulab.com/t/bbl-refills-really-only-930gr-or-less-scale-issues/203232",
          ),
        ],
      },
      {
        variant: "Cardboard spool (PPA-CF)",
        includes: "Empty all-cardboard spool from a 0.75 kg PPA-CF roll",
        grams: "~196 (195-196)",
        evidence: "community",
        presetId: "bambu-cardboard",
        note: "Two separate measurements of PPA-CF spools. Other Bambu cardboard-spool products were not measured, and cardboard can shift about 6 g with humidity.",
        sources: [
          src(
            "Bambu Lab forum: PPA-CF cardboard spool weight",
            "https://forum.bambulab.com/t/ppa-cf-weight-of-cardboard-spool/140461",
          ),
          src(
            "Bambu Lab forum: calculating the remains on a spool",
            "https://forum.bambulab.com/t/calculating-the-remains-on-a-spool/123429",
          ),
        ],
      },
      {
        variant: "Bambu store listing, reusable spool",
        includes: "Not stated: empty spool or packed item",
        grams: "250",
        evidence: "manufacturer",
        note: "Bambu's store lists \"Weight 250 g\" for both temperature versions without saying what is weighed. Measured bare spools are lighter, so treat this as a shipping-style figure.",
        sources: [
          src(
            "Bambu Lab store: reusable spool",
            "https://us.store.bambulab.com/products/bambu-reusable-spool",
          ),
        ],
      },
    ],
    faq: [
      {
        q: "Why doesn't Bambu Lab print the spool weight on the spool?",
        a: "Bambu has not said, and owners keep asking on its forum. Until it does, weigh one empty spool of each type you own and write the number on it. The presets get you close, but your own measurement is exact.",
      },
      {
        q: "How much does the refill cardboard core weigh on its own?",
        a: "About 37 g in the most careful measurement we found (37 to 38 g). Owners measured the reusable spool at 208 to 216 g bare and 245 to 260 g with a refill mounted; the core is most of the difference, and individual spools and cores vary. If you weigh a spool with a refill on it, use the with-core figure.",
      },
      {
        q: "Can I weigh the spool while it's in the AMS?",
        a: "No, take it out. The AMS rollers support the spool, so a reading taken while it is docked is not its weight. Pull the spool, weigh it on a kitchen scale, put it back.",
      },
      {
        q: "Do the high-temp and low-temp reusable spools weigh the same?",
        a: "Close enough that the measurements do not separate them: every bare measurement we could confirm landed between 208 and 216 g. The rating matters for drying instead. Bambu's datasheets list PLA and PETG on an ABS spool rated to 70 °C, and ABS, ASA, PC, TPU and nylon on a PC + ABS spool rated to 90 °C.",
      },
    ],
    furtherReading: [
      src(
        "Bambu PLA Basic datasheet (spool material and 70 °C rating)",
        "https://store.bblcdn.com/s7/default/b189de92249a4b9ebed28b8ea1f080f0/Bambu_PLA_Basic_Technical_Data_Sheet.pdf",
      ),
      src(
        "Bambu ABS datasheet (spool material and 90 °C rating)",
        "https://store.bblcdn.com/s7/default/23b4cf2b83d5470bb96d19970b5f3ae8/Bambu_ABS_Technical_Data_Sheet_V3.pdf",
      ),
    ],
    correction:
      "October 10, 2026: the refill-core preset changed from 233 g to 253 g, and the cardboard-spool preset from 205 g to 196 g, after we traced each number to its source. The old 233 g assumed a 25 g core; measured cores are 37 to 38 g, so it overstated remaining filament by about 20 g. A 250 to 264 g first-generation range, whose 264 g upper end we could not trace, was removed.",
  },
  {
    slug: "polymaker",
    brand: "Polymaker",
    title: "Polymaker empty spool weight: cardboard spool vs older plastic",
    metaDescription:
      "Polymaker spool weights from Polymaker's own spec table: 1 kg cardboard spool 140 ± 7 g, 0.5 kg 190 ± 7 g, 2 kg 370 g. Weigh your spool and get grams of filament left.",
    presetId: "polymaker",
    checked: CHECKED,
    summary: [
      { label: "1 kg cardboard spool", value: "140 ± 7 g", emphasis: true },
      { label: "0.5 kg cardboard spool", value: "190 ± 7 g" },
      { label: "Older 1 kg plastic spool", value: "~250 g" },
    ],
    intro: [
      "Polymaker publishes a spool table on some of its product pages: the 1 kg cardboard spool weighs 140 g give or take 7 g. Most current Polymaker filament ships on cardboard spools. If you still have older stock on a plastic spool, it is much heavier; the one community figure we found is 250 g, and Polymaker does not publish one.",
      "So the first question is which spool you are holding. Cardboard also drifts a few grams with humidity, because it absorbs moisture along with your filament, so weigh one once if you want to be exact.",
    ],
    weights: [
      {
        variant: "Cardboard spool, 1 kg",
        includes: "Empty cardboard spool",
        grams: "140 ± 7",
        evidence: "manufacturer",
        presetId: "polymaker",
        note: "Polymaker's spool table. Polymaker has since described a newer cardboard spool with reinforced edges and has not published a separate weight for it.",
        sources: [POLYMAKER_TABLE],
      },
      {
        variant: "Cardboard spool, 0.75 kg",
        includes: "Empty cardboard spool",
        grams: "125 ± 7",
        evidence: "manufacturer",
        note: "Same Polymaker spool table.",
        sources: [POLYMAKER_TABLE],
      },
      {
        variant: "Cardboard spool, 0.5 kg",
        includes: "Empty cardboard spool",
        grams: "190 ± 7",
        evidence: "manufacturer",
        note: "Same table. Heavier than the 1 kg spool as published; weigh yours if the number matters.",
        sources: [POLYMAKER_TABLE],
      },
      {
        variant: "Cardboard spool, 2 kg",
        includes: "Empty cardboard spool",
        grams: "370 ± 18.5",
        evidence: "manufacturer",
        note: "Same Polymaker spool table.",
        sources: [POLYMAKER_TABLE],
      },
      {
        variant: "Plastic spool, 1 kg (older stock)",
        includes: "Empty plastic spool",
        grams: "~250",
        evidence: "community-db",
        presetId: "polymaker-plastic",
        note: "One community database entry for PolyLite PLA on a plastic spool. Polymaker publishes no figure for its older plastic spools.",
        sources: [
          src(
            "SpoolmanDB community spool database: Polymaker",
            "https://raw.githubusercontent.com/Donkie/SpoolmanDB/main/filaments/polymaker.json",
          ),
        ],
      },
    ],
    faq: [
      {
        q: "Is my Polymaker spool cardboard or plastic?",
        a: "Most current Polymaker filament ships on a recycled cardboard spool, which Polymaker specs at 140 g for the 1 kg size. If your spool is solid plastic, it is older stock and much heavier. When in doubt, weigh the empty spool and pick Custom.",
      },
      {
        q: "Why does my cardboard spool weigh more than 140 g empty?",
        a: "Polymaker's own figure carries a plus-or-minus 7 g tolerance, and cardboard absorbs moisture, so a spool that lived in a humid room can read several grams heavier than one from a dry box. Anything in the low-to-mid 140s is normal.",
      },
      {
        q: "Does Polymaker publish official spool weights?",
        a: "Yes, for cardboard spools. A spool table on some Polymaker product pages lists 140 ± 7 g for 1 kg, 125 ± 7 g for 0.75 kg, 190 ± 7 g for 0.5 kg and 370 ± 18.5 g for 2 kg. We found no Polymaker figure for older plastic spools. Either way, your own scale is the final word.",
      },
    ],
    furtherReading: [],
    correction:
      "October 10, 2026: the older plastic-spool preset changed from 215 g to 250 g. We could not trace 215 g to any source; 250 g is the one community database entry we found. The cardboard source link now points to a Polymaker page that shows the spool table.",
  },
  {
    slug: "esun",
    brand: "eSun",
    title: "eSun empty spool weight: what your scale should read",
    metaDescription:
      "eSun empty spool weights with sources: cardboard spools about 170 g in a community database, plastic spools measured from about 209 to 265 g. Weigh your spool and calculate remaining filament in grams.",
    presetId: "esun",
    checked: CHECKED,
    summary: [
      { label: "1 kg cardboard spool", value: "~170 g", emphasis: true },
      { label: "Clear plastic spool", value: "209-225 g" },
      { label: "Black plastic spool", value: "230-265 g" },
    ],
    intro: [
      "eSun is the hardest brand to pin down. eSun publishes no spool weight, it has used several spool designs across its lines and years, and people's measurements of its plastic spools run from about 209 g to 265 g.",
      "Many current eSun PLA lines ship on cardboard spools, which a community database lists at 170 g. The calculator below starts there. If yours is a plastic spool and the answer matters, weigh an empty eSun spool from the same line and use Custom: a 50 g spread between spool designs is exactly the margin that ruins a close call.",
    ],
    weights: [
      {
        variant: "Cardboard spool, 1 kg",
        includes: "Empty cardboard spool",
        grams: "~170",
        evidence: "community-db",
        presetId: "esun",
        note: "Listed for PLA-Basic, PLA+, PLA-Matte and similar 1 kg lines. eSun itself publishes no spool weight.",
        sources: [
          src(
            "SpoolmanDB community spool database: eSun",
            "https://raw.githubusercontent.com/Donkie/SpoolmanDB/main/filaments/esun.json",
          ),
        ],
      },
      {
        variant: "Clear plastic spool, 1 kg",
        includes: "Empty plastic spool",
        grams: "209-225",
        evidence: "community",
        note: "Five measurements across three sources: 209, 210, 212, 222 and 225 g. eSun has used more than one clear spool design.",
        sources: [
          src(
            "Bambu Lab forum: eSun empty spool weights",
            "https://forum.bambulab.com/t/help-empty-weight-esun-crystal-clear-spool/11744",
          ),
          PRINTING_SPACE,
          PRINTABLES_CATALOG,
        ],
      },
      {
        variant: "Black plastic spool, 1 kg",
        includes: "Empty plastic spool",
        grams: "230-265",
        evidence: "community",
        note: "One person measured 230 g; another found all of theirs between 255 and 265 g.",
        sources: [
          PRINTING_SPACE,
          src(
            "Bambu Lab forum: eSun empty spool weights",
            "https://forum.bambulab.com/t/help-empty-weight-esun-crystal-clear-spool/11744",
          ),
        ],
      },
    ],
    faq: [
      {
        q: "Why do eSun spool weights vary so much?",
        a: "eSun has changed spool designs more than most brands, and different filament lines have shipped on different spools in the same year. Two eSun spools on your shelf can genuinely be 50 g apart empty. That is not your scale's fault.",
      },
      {
        q: "Which number should I use for eSun PLA+?",
        a: "If it came on a cardboard spool, start with about 170 g. If it is plastic, weigh an empty one from the same line: measured plastic spools range from about 209 to 265 g. Once you know your number, write it on the spool and the question is settled.",
      },
      {
        q: "Does the calculator handle a spool weight I measured myself?",
        a: "Yes. Pick Custom in the spool type dropdown and type your measured weight. Your own measurement always beats a preset.",
      },
    ],
    furtherReading: [],
    correction:
      "October 10, 2026: the eSun preset changed from a 200 g \"typical\" plastic spool, which we could not trace to a source, to the 170 g cardboard spool listed in a community database. Plastic eSun spools vary too much for one preset; weigh yours.",
  },
  {
    slug: "prusament",
    brand: "Prusament",
    title: "Prusament empty spool weight, measured instead of guessed",
    metaDescription:
      "Prusament's original 1 kg spool weighs about 191 to 201 g empty; one community entry lists the redesigned NFC spool at 280 g. Weigh your spool and get grams of filament remaining.",
    presetId: "prusament",
    checked: CHECKED,
    summary: [
      { label: "Original 1 kg spool", value: "191-201 g", emphasis: true },
      { label: "Redesigned NFC spool (one entry)", value: "~280 g" },
    ],
    intro: [
      "Prusament's original spool, with black plastic sides and a cardboard center, comes to 191 to 201 g empty in the figures owners have posted. The calculator below starts at 194 g, the middle of those figures. Prusa publishes no general empty weight, and humidity moves the cardboard center a few grams.",
      "In October 2025 Prusa introduced a redesigned spool with a plastic core instead of the cardboard one. The one figure we found for it, a community database entry for 0.8 kg of ASA, is 280 g, so weigh one before relying on the older number. Prusa's spool-check web tool uses each spool's own manufacturing data to turn your measured weight into remaining length.",
    ],
    weights: [
      {
        variant: "Original 1 kg spool",
        includes: "Empty spool: black plastic sides and cardboard center",
        grams: "~194 (191-201)",
        evidence: "community",
        presetId: "prusament",
        note: "Measurements of 191, 192.8, 193.8 and 200 g (2020-2021), plus 201 g from Prusa's per-spool data quoted by an owner (2019).",
        sources: [
          src(
            "Prusa forum: empty spool weight",
            "https://forum.prusa3d.com/forum/english-forum-general-discussion-announcements-and-releases/empty-spool-weight/",
          ),
          src(
            "Prusa forum: weight of a Prusament PETG spool",
            "https://forum.prusa3d.com/forum/english-forum-general-discussion-announcements-and-releases/weight-of-prusament-petg-spool/",
          ),
          PRINTING_SPACE,
        ],
      },
      {
        variant: "Redesigned NFC spool (from October 2025)",
        includes: "Plastic sides and plastic core; entry is for a 0.8 kg ASA spool",
        grams: "~280",
        evidence: "community-db",
        note: "One community database entry. Prusa describes the redesign (plastic core, recycled polycarbonate) but publishes no general empty weight. Weigh one empty spool and use Custom.",
        sources: [
          src(
            "SpoolmanDB community spool database: Prusament",
            "https://raw.githubusercontent.com/Donkie/SpoolmanDB/main/filaments/prusament.json",
          ),
          src(
            "Prusa blog: the redesigned Prusament spool",
            "https://blog.prusa3d.com/the-openprinttag-is-here-a-brand-new-nfc-tag-standard-for-smart-filament-is-now-shipped-with-a-new-redesigned-prusament-spool_123878/",
          ),
        ],
      },
    ],
    faq: [
      {
        q: "Why does my Prusament spool read differently from the preset?",
        a: "Figures for the original spool already span about 10 g, and the cardboard center gains and loses a few grams with humidity. If you have the newer plastic-core spool, the one figure we found is much heavier, about 280 g. For tighter numbers, weigh yours and use Custom.",
      },
      {
        q: "Doesn't Prusa publish the exact data for my spool?",
        a: "Close. Prusa publishes no general empty weight, but each Prusament spool has a code that links to its manufacturing record, and Prusa's spool-check tool uses that data to convert your measured spool-plus-filament weight into remaining length. This page is for the fast version: scale, subtract, done.",
      },
      {
        q: "Does the preset work for every Prusament product?",
        a: "Only for the original 1 kg spool. Larger spools, refills and the redesigned spool are different; weigh those once before trusting any preset.",
      },
    ],
    furtherReading: [
      src(
        "Prusament: check filament length on your spool",
        "https://prusament.com/check-filament-length-on-your-prusament-spool/",
      ),
    ],
    correction:
      "October 10, 2026: the preset changed from 200 g to 194 g, the middle of the figures we could trace. The previous 192 to 207 g range had an upper end we could not find in any source.",
  },
];

export function getSpoolBrandPage(slug: string): SpoolBrandPage | undefined {
  return SPOOL_BRAND_PAGES.find((p) => p.slug === slug);
}
