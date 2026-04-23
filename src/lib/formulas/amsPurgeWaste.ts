// Bambu AMS (and similar multi-material systems) purge waste calculator.
//
// Multi-color prints require purging filament at each color swap to clear
// the hotend of the previous color. Bambu's AMS purges typically 5-15g per
// swap depending on settings. Complex prints can have dozens to hundreds
// of swaps.
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
