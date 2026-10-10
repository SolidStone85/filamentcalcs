// Manufacturer drying settings for the drying guide, one row per named
// product and method, copied from the maker's own page or data sheet.
// Makers disagree for the same material family, and the equipment changes
// the number, so the guide shows each row with its source instead of
// averaging them into one "PETG" setting.

import type { Source } from "./reference";

export type DryingSetting = {
  material: string; // family, for grouping
  product: string; // named product as the maker lists it
  method: string; // the equipment the setting is for
  tempC: string;
  hours: string;
  source: Source;
};

const CHECKED = "2026-10-10";

const PRUSA: Source = {
  label: "Prusa Knowledge Base: drying filament",
  url: "https://help.prusa3d.com/article/drying-filament_332086",
  checked: CHECKED,
};
const BAMBU_WIKI: Source = {
  label: "Bambu Lab Wiki: filament drying",
  url: "https://wiki.bambulab.com/en/filament-acc/filament/dry-filament",
  checked: CHECKED,
};
const bambuTds = (product: string, url: string): Source => ({
  label: `Bambu Lab ${product} technical data sheet`,
  url,
  checked: CHECKED,
});
const polymakerWiki = (product: string, path: string): Source => ({
  label: `Polymaker Wiki: ${product}`,
  url: `https://wiki.polymaker.com/polymaker-products/polymaker-filaments/prime-materials/${path}`,
  checked: CHECKED,
});

const PRUSA_METHOD = "Dryer or oven";
const BAMBU_OVEN = "Forced-air drying oven";
const POLYMAKER_METHOD = "Not specified";

export const DRYING_SETTINGS: DryingSetting[] = [
  { material: "PLA", product: "Prusament PLA", method: PRUSA_METHOD, tempC: "45", hours: "6", source: PRUSA },
  { material: "PLA", product: "Bambu PLA Basic", method: BAMBU_OVEN, tempC: "50", hours: "8", source: BAMBU_WIKI },
  { material: "PLA", product: "Bambu PLA Basic", method: "AMS 2 Pro / AMS HT", tempC: "45", hours: "12", source: BAMBU_WIKI },
  { material: "PLA", product: "Polymaker PolyLite PLA", method: POLYMAKER_METHOD, tempC: "55", hours: "6", source: polymakerWiki("PolyLite PLA", "functional-pla/polylite-tm-pla") },

  { material: "PETG", product: "Prusament PETG", method: PRUSA_METHOD, tempC: "55", hours: "6", source: PRUSA },
  { material: "PETG", product: "Bambu PETG Basic", method: BAMBU_OVEN, tempC: "65", hours: "8", source: bambuTds("PETG Basic", "https://store.bblcdn.com/s1/default/cb94589bf7994fdcbfa833badefae9cd/Bambu_PETG_Basic_Technical_Data_Sheet.pdf") },
  { material: "PETG", product: "Polymaker PETG", method: POLYMAKER_METHOD, tempC: "60", hours: "6", source: polymakerWiki("Polymaker PETG", "petg/polymaker-tm-petg-new") },

  { material: "ABS", product: "Bambu ABS", method: BAMBU_OVEN, tempC: "80", hours: "8", source: bambuTds("ABS", "https://store.bblcdn.com/s7/default/23b4cf2b83d5470bb96d19970b5f3ae8/Bambu_ABS_Technical_Data_Sheet_V3.pdf") },
  { material: "ABS", product: "Polymaker PolyLite ABS", method: POLYMAKER_METHOD, tempC: "70", hours: "6", source: polymakerWiki("PolyLite ABS", "abs-and-asa/polylite-tm-abs") },

  { material: "ASA", product: "Prusament ASA", method: PRUSA_METHOD, tempC: "80", hours: "4", source: PRUSA },
  { material: "ASA", product: "Bambu ASA", method: BAMBU_OVEN, tempC: "80", hours: "8", source: bambuTds("ASA", "https://store.bblcdn.com/ad7b08230c164e72856cffbe06bb7dc9.pdf") },
  { material: "ASA", product: "Polymaker ASA", method: POLYMAKER_METHOD, tempC: "70", hours: "7", source: polymakerWiki("Polymaker ASA", "abs-and-asa/polymaker-tm-asa") },

  { material: "TPU", product: "Prusament TPU", method: PRUSA_METHOD, tempC: "60", hours: "4-6", source: PRUSA },
  { material: "TPU", product: "Bambu TPU 95A HF", method: BAMBU_OVEN, tempC: "70", hours: "8", source: bambuTds("TPU 95A HF", "https://store.bblcdn.com/58df32731eab4c90a7dac9b12e13ba88.pdf") },
  { material: "TPU", product: "Polymaker PolyFlex TPU95", method: POLYMAKER_METHOD, tempC: "70", hours: "8", source: polymakerWiki("PolyFlex TPU95", "flexible-tpu/polyflex-tm-tpu95") },

  { material: "PC", product: "Prusament PC Blend", method: PRUSA_METHOD, tempC: "85", hours: "5", source: PRUSA },
  { material: "PC", product: "Bambu PC", method: "Not specified", tempC: "80", hours: "8", source: bambuTds("PC", "https://store.bblcdn.com/a52afdccddfd448583d119587122c8c5.pdf") },
  { material: "PC", product: "Polymaker PolyLite PC", method: POLYMAKER_METHOD, tempC: "75", hours: "6", source: polymakerWiki("PolyLite PC", "polycarbonate/polylite-tm-pc") },

  { material: "Nylon", product: "Prusament PA11 Carbon Fiber", method: PRUSA_METHOD, tempC: "90", hours: "6", source: PRUSA },
  { material: "Nylon", product: "Bambu PAHT-CF", method: BAMBU_OVEN, tempC: "80", hours: "8-12", source: bambuTds("PAHT-CF", "https://store.bblcdn.com/7166b20bc68f4c87b32c972b856eeb4b.pdf") },
  { material: "Nylon", product: "Polymaker PolyMide CoPA", method: POLYMAKER_METHOD, tempC: "100", hours: "8", source: polymakerWiki("PolyMide CoPA", "nylon-pa/polymide-tm-copa") },
];

// Highest temperature each piece of drying equipment reaches, per its maker.
export type DryerLimit = { equipment: string; maxC: number; source: Source };

export const DRYER_LIMITS: DryerLimit[] = [
  {
    equipment: "SUNLU FilaDryer S2",
    maxC: 70,
    source: { label: "SUNLU FilaDryer S2 product page and manual", url: "https://www.sunlu.com/products/filadryer-s2-filament-dryer", checked: CHECKED },
  },
  {
    equipment: "SUNLU FilaDryer S4",
    maxC: 70,
    source: { label: "SUNLU FilaDryer S4 product page and manual", url: "https://www.sunlu.com/products/filadryer-s4-filament-dryer", checked: CHECKED },
  },
  {
    equipment: "Creality Space Pi Plus",
    maxC: 70,
    source: { label: "Creality Space Pi Plus manual", url: "https://store.creality.com/blogs/buying-guides/space-pi-filament-dryer-plus-manual", checked: CHECKED },
  },
  {
    equipment: "Bambu AMS 2 Pro",
    maxC: 65,
    source: { label: "Bambu Lab Wiki: AMS 2 Pro drying function", url: "https://wiki.bambulab.com/en/ams-2-pro/manual/drying-function", checked: CHECKED },
  },
  {
    equipment: "Bambu AMS HT",
    maxC: 85,
    source: { label: "Bambu Lab Wiki: AMS 2 Pro drying function", url: "https://wiki.bambulab.com/en/ams-2-pro/manual/drying-function", checked: CHECKED },
  },
];
