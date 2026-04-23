// Full material specs for the Material Comparison tool. Different from
// materials.ts which is a shorter set of price/waste defaults for the
// filament cost calculator. Values are community-consensus typicals.

export type MaterialFull = {
  id: string;
  label: string;
  nozzleTempC: string; // range as string, some slicers want ranges
  bedTempC: string;
  densityGPerCm3: number;
  shrinkagePercent: number;
  typicalPriceUsdPerKg: number;
  difficulty: "Easy" | "Moderate" | "Hard";
  strengthRating: 1 | 2 | 3 | 4 | 5;
  flexRating: 1 | 2 | 3 | 4 | 5;
  outdoorOk: boolean;
  foodSafe: "No" | "Contact-safe (certified)" | "Depends on brand";
  tagline: string;
  bestFor: string[];
  avoidFor: string[];
};

export const MATERIALS_FULL: MaterialFull[] = [
  {
    id: "pla",
    label: "PLA",
    nozzleTempC: "190 to 220",
    bedTempC: "0 to 60",
    densityGPerCm3: 1.24,
    shrinkagePercent: 0.3,
    typicalPriceUsdPerKg: 20,
    difficulty: "Easy",
    strengthRating: 3,
    flexRating: 1,
    outdoorOk: false,
    foodSafe: "Depends on brand",
    tagline: "The default. Easy to print, good for most indoor prints.",
    bestFor: ["Beginners", "Indoor display parts", "Prototyping", "Detailed models"],
    avoidFor: ["Outdoor use", "Hot environments (over 50°C)", "Structural load"],
  },
  {
    id: "petg",
    label: "PETG",
    nozzleTempC: "230 to 250",
    bedTempC: "60 to 80",
    densityGPerCm3: 1.27,
    shrinkagePercent: 0.5,
    typicalPriceUsdPerKg: 25,
    difficulty: "Moderate",
    strengthRating: 4,
    flexRating: 2,
    outdoorOk: true,
    foodSafe: "Contact-safe (certified)",
    tagline: "Stronger than PLA, survives outdoors, stringier.",
    bestFor: ["Outdoor parts", "Functional parts", "Food-contact (certified brands)", "Water bottles"],
    avoidFor: ["Fine detail", "Beginners (stringing)", "Parts that slide or snap together"],
  },
  {
    id: "abs",
    label: "ABS",
    nozzleTempC: "240 to 260",
    bedTempC: "90 to 110",
    densityGPerCm3: 1.04,
    shrinkagePercent: 1.5,
    typicalPriceUsdPerKg: 22,
    difficulty: "Hard",
    strengthRating: 4,
    flexRating: 3,
    outdoorOk: true,
    foodSafe: "No",
    tagline: "High heat resistance, fumes, needs enclosure.",
    bestFor: ["Automotive interior parts", "High-heat environments", "Post-processing (acetone smoothing)"],
    avoidFor: ["Open printers (warping)", "Small rooms (fumes)", "Beginners"],
  },
  {
    id: "asa",
    label: "ASA",
    nozzleTempC: "240 to 260",
    bedTempC: "90 to 110",
    densityGPerCm3: 1.07,
    shrinkagePercent: 1.2,
    typicalPriceUsdPerKg: 28,
    difficulty: "Hard",
    strengthRating: 4,
    flexRating: 3,
    outdoorOk: true,
    foodSafe: "No",
    tagline: "Like ABS but UV-resistant. The outdoor choice.",
    bestFor: ["Outdoor long-term exposure", "UV-resistant parts", "Automotive exterior"],
    avoidFor: ["Open printers", "Beginners", "Small rooms (fumes)"],
  },
  {
    id: "tpu",
    label: "TPU (flexible)",
    nozzleTempC: "210 to 230",
    bedTempC: "30 to 60",
    densityGPerCm3: 1.21,
    shrinkagePercent: 0.8,
    typicalPriceUsdPerKg: 30,
    difficulty: "Moderate",
    strengthRating: 4,
    flexRating: 5,
    outdoorOk: true,
    foodSafe: "No",
    tagline: "Rubbery. Flexible parts, shock absorption, gaskets.",
    bestFor: ["Phone cases", "Wheels", "Gaskets", "Shock absorbers"],
    avoidFor: ["Bowden extruders", "Fast prints", "Rigid structural parts"],
  },
  {
    id: "pc",
    label: "Polycarbonate (PC)",
    nozzleTempC: "260 to 310",
    bedTempC: "100 to 130",
    densityGPerCm3: 1.2,
    shrinkagePercent: 0.7,
    typicalPriceUsdPerKg: 45,
    difficulty: "Hard",
    strengthRating: 5,
    flexRating: 3,
    outdoorOk: true,
    foodSafe: "No",
    tagline: "Engineering material. High heat, impact, transparency options.",
    bestFor: ["Mechanical parts under load", "Transparent prints", "High-temp environments"],
    avoidFor: ["Hobbyist printers", "Open enclosures", "Beginners"],
  },
  {
    id: "nylon",
    label: "Nylon (PA)",
    nozzleTempC: "240 to 280",
    bedTempC: "70 to 100",
    densityGPerCm3: 1.14,
    shrinkagePercent: 1.5,
    typicalPriceUsdPerKg: 45,
    difficulty: "Hard",
    strengthRating: 5,
    flexRating: 4,
    outdoorOk: false,
    foodSafe: "No",
    tagline: "Tough, abrasion resistant, absorbs moisture aggressively.",
    bestFor: ["Gears", "Hinges", "Living parts", "High-abrasion use"],
    avoidFor: ["Humid environments", "Moisture-sensitive storage", "Beginners"],
  },
];

export function getMaterialFull(id: string): MaterialFull | undefined {
  return MATERIALS_FULL.find((m) => m.id === id);
}
