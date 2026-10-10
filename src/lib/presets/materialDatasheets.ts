// One named product per material family, copied from the manufacturer's
// technical data sheet (TDS) exactly as printed. These are examples of what
// a specific product measured under a specific test, not values for every
// filament sold under the same family name.
//
// The Bambu Lab rows share one lab and method set: HDT per ISO 75 at
// 0.45 and 1.8 MPa; tensile per ISO 527 on printed X-Y specimens; Charpy
// impact per ISO 179 on printed X-Y specimens. Most Bambu specimens were
// annealed and dried before testing (the TDS footnote says so). The nylon
// row comes from Prusament, whose sheet does not state annealing and whose
// tensile figure is yield strength, so it is not directly comparable.

import type { Source } from "../reference";

export type MaterialDatasheet = {
  materialId: string; // matches MATERIALS_FULL ids
  product: string;
  lab: "Bambu Lab" | "Prusament";
  densityGPerCm3: number; // ISO 1183, as printed
  hdtC045: number | null; // heat deflection temperature at 0.45 MPa, °C
  hdtC18: number | null; // heat deflection temperature at 1.8 MPa, °C
  tensileMpa: string; // as printed, with tolerance
  tensileTest: string;
  impactKjM2: string; // as printed, with tolerance
  impactTest: string;
  specimens: string; // print and conditioning of the test specimens
  note?: string;
  source: Source;
};

const CHECKED = "2026-10-10";

export const MATERIAL_DATASHEETS: MaterialDatasheet[] = [
  {
    materialId: "pla",
    product: "Bambu Lab PLA Basic (TDS V3.0)",
    lab: "Bambu Lab",
    densityGPerCm3: 1.24,
    hdtC045: 57,
    hdtC18: 54,
    tensileMpa: "35 ± 4",
    tensileTest: "ISO 527, printed X-Y",
    impactKjM2: "26.6 ± 2.8",
    impactTest: "ISO 179 Charpy, printed X-Y, unnotched",
    specimens: "Annealed and dried at 55 °C for 8 h before testing",
    source: {
      label: "Bambu Lab PLA Basic technical data sheet",
      url: "https://store.bblcdn.com/s7/default/b189de92249a4b9ebed28b8ea1f080f0/Bambu_PLA_Basic_Technical_Data_Sheet.pdf",
      checked: CHECKED,
    },
  },
  {
    materialId: "petg",
    product: "Bambu Lab PETG Basic (TDS V3.0)",
    lab: "Bambu Lab",
    densityGPerCm3: 1.25,
    hdtC045: 71,
    hdtC18: 68,
    tensileMpa: "51 ± 1",
    tensileTest: "ISO 527, printed X-Y",
    impactKjM2: "34.2 ± 4.1",
    impactTest: "ISO 179 Charpy, printed X-Y, notch not stated",
    specimens: "No annealing stated; Bambu advises against annealing PETG Basic prints",
    source: {
      label: "Bambu Lab PETG Basic technical data sheet",
      url: "https://store.bblcdn.com/s1/default/cb94589bf7994fdcbfa833badefae9cd/Bambu_PETG_Basic_Technical_Data_Sheet.pdf",
      checked: CHECKED,
    },
  },
  {
    materialId: "abs",
    product: "Bambu Lab ABS (TDS V3.0)",
    lab: "Bambu Lab",
    densityGPerCm3: 1.05,
    hdtC045: 87,
    hdtC18: 84,
    tensileMpa: "33 ± 3",
    tensileTest: "ISO 527, printed X-Y",
    impactKjM2: "39.3 ± 3.6",
    impactTest: "ISO 179 Charpy, printed X-Y, unnotched",
    specimens: "Annealed and dried at 80 °C for 12 h before testing",
    source: {
      label: "Bambu Lab ABS technical data sheet",
      url: "https://store.bblcdn.com/s7/default/23b4cf2b83d5470bb96d19970b5f3ae8/Bambu_ABS_Technical_Data_Sheet_V3.pdf",
      checked: CHECKED,
    },
  },
  {
    materialId: "asa",
    product: "Bambu Lab ASA (TDS V3.0)",
    lab: "Bambu Lab",
    densityGPerCm3: 1.05,
    hdtC045: 100,
    hdtC18: 92,
    tensileMpa: "37 ± 3",
    tensileTest: "ISO 527, printed X-Y",
    impactKjM2: "41.0 ± 2.3",
    impactTest: "ISO 179 Charpy, printed X-Y, unnotched",
    specimens: "Annealed and dried at 80 °C for 12 h before testing",
    source: {
      label: "Bambu Lab ASA technical data sheet",
      url: "https://store.bblcdn.com/ad7b08230c164e72856cffbe06bb7dc9.pdf",
      checked: CHECKED,
    },
  },
  {
    materialId: "tpu",
    product: "Bambu Lab TPU 95A HF (TDS V1.0)",
    lab: "Bambu Lab",
    densityGPerCm3: 1.22,
    hdtC045: null,
    hdtC18: null,
    tensileMpa: "27.3 ± 0.8",
    tensileTest: "ISO 527, printed X-Y",
    impactKjM2: "123.2",
    impactTest: "ISO 179 Charpy, printed X-Y, notch not stated",
    specimens: "Annealed and dried at 70 °C for 12 h before testing",
    note: "The TDS prints N/A for heat deflection temperature.",
    source: {
      label: "Bambu Lab TPU 95A HF technical data sheet",
      url: "https://store.bblcdn.com/58df32731eab4c90a7dac9b12e13ba88.pdf",
      checked: CHECKED,
    },
  },
  {
    materialId: "pc",
    product: "Bambu Lab PC (TDS V2.0)",
    lab: "Bambu Lab",
    densityGPerCm3: 1.20,
    hdtC045: 112,
    hdtC18: 117,
    tensileMpa: "62 ± 2",
    tensileTest: "ISO 527, printed X-Y, dry state",
    impactKjM2: "34.8 ± 2.1",
    impactTest: "ISO 179 Charpy, printed X-Y, unnotched",
    specimens: "Annealed and dried at 80 °C for 12 h before testing",
    note: "As printed, the 1.8 MPa value is higher than the 0.45 MPa value, which is unusual; treat both as approximate.",
    source: {
      label: "Bambu Lab PC technical data sheet",
      url: "https://store.bblcdn.com/a52afdccddfd448583d119587122c8c5.pdf",
      checked: CHECKED,
    },
  },
  {
    materialId: "nylon",
    product: "Prusament PA11, unfilled (TDS v1.0, July 2026)",
    lab: "Prusament",
    densityGPerCm3: 1.02,
    hdtC045: 58.7,
    hdtC18: 49.9,
    tensileMpa: "38.3 ± 0.8",
    tensileTest: "ISO 527-1 yield strength, printed horizontal",
    impactKjM2: "12.9 ± 2.1",
    impactTest: "ISO 179-1 Charpy edgewise, printed horizontal, notched",
    specimens: "100% infill; annealing not stated",
    note: "Carbon- or glass-filled nylons are very different: their datasheets list roughly 150 to 195 °C. Prusa says annealing raises unfilled PA11's heat resistance.",
    source: {
      label: "Prusament PA11 technical data sheet",
      url: "https://storage.googleapis.com/prusa3d-content-prod-14e8-wordpress-prusament-prod/2026/08/2d2145fc-pa11_tds_eng.pdf",
      checked: CHECKED,
    },
  },
];

export function getMaterialDatasheet(
  materialId: string,
): MaterialDatasheet | undefined {
  return MATERIAL_DATASHEETS.find((d) => d.materialId === materialId);
}
