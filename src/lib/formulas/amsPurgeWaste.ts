// Legacy average-per-swap arithmetic, retained for saved estimates.
// The caller supplies the average; there is no manufacturer grams-per-swap default.
//
// total_purge_grams = color_swaps * purge_per_swap_grams
// total_purge_cost = (total_purge_grams / 1000) * price_per_kg
// purge_waste_percent = total_purge_grams / (total_purge_grams + actual_print_grams) * 100

export type AmsPurgeInput = {
  colorSwaps: number;
  purgePerSwapGrams: number;
  actualPrintGrams: number;
  pricePerKg: number;
};

export type AmsPurgeResult = {
  totalPurgeGrams: number;
  totalPurgeCost: number;
  purgeWastePercent: number;
  totalFilamentGrams: number;
  totalFilamentCost: number;
  costPerSwap: number;
};

export function calculateAmsPurgeWaste({
  colorSwaps,
  purgePerSwapGrams,
  actualPrintGrams,
  pricePerKg,
}: AmsPurgeInput): AmsPurgeResult {
  const totalPurgeGrams = colorSwaps * purgePerSwapGrams;
  const totalPurgeCost = (totalPurgeGrams / 1000) * pricePerKg;
  const totalFilamentGrams = totalPurgeGrams + actualPrintGrams;
  const totalFilamentCost = (totalFilamentGrams / 1000) * pricePerKg;
  const purgeWastePercent =
    totalFilamentGrams > 0
      ? (totalPurgeGrams / totalFilamentGrams) * 100
      : 0;
  const costPerSwap = colorSwaps > 0 ? totalPurgeCost / colorSwaps : 0;

  return {
    totalPurgeGrams,
    totalPurgeCost,
    purgeWastePercent,
    totalFilamentGrams,
    totalFilamentCost,
    costPerSwap,
  };
}

export type AmsEstimateInput = {
  colorSwaps: number;
  purgePerSwap: number;
  unit: "g" | "mm3";
  densityGramsPerCm3: number;
  flushMultiplier: number;
};

// mm³ / 1000 converts to cm³ before applying density in g/cm³.
// Apply a multiplier only to a baseline that has not already been adjusted.
export function estimateFlushingGrams(input: AmsEstimateInput): number {
  const { colorSwaps, purgePerSwap, unit, densityGramsPerCm3, flushMultiplier } = input;
  if (![colorSwaps, purgePerSwap, flushMultiplier].every((n) => Number.isFinite(n) && n >= 0) || !Number.isInteger(colorSwaps)) return NaN;
  if (unit === "mm3" && (!Number.isFinite(densityGramsPerCm3) || densityGramsPerCm3 <= 0)) return NaN;
  const gramsPerSwap = unit === "mm3" ? purgePerSwap * densityGramsPerCm3 / 1000 : purgePerSwap;
  return colorSwaps * gramsPerSwap * flushMultiplier;
}

export type SlicerMaterialInput = {
  modelGrams: number;
  supportGrams: number;
  flushingGrams: number;
  towerGrams: number;
  extraGrams: number;
  pricePerKg: number;
};

export function calculateSlicerMaterial(input: SlicerMaterialInput) {
  const discardedGrams = input.supportGrams + input.flushingGrams + input.towerGrams + input.extraGrams;
  const totalFilamentGrams = input.modelGrams + discardedGrams;
  return {
    discardedGrams,
    totalFilamentGrams,
    discardedPercent: totalFilamentGrams > 0 ? discardedGrams / totalFilamentGrams * 100 : 0,
    discardedCost: discardedGrams / 1000 * input.pricePerKg,
    totalFilamentCost: totalFilamentGrams / 1000 * input.pricePerKg,
  };
}
