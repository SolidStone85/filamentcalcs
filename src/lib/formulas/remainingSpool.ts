// Remaining Spool calculator: figures out how much filament is left on a spool
// from the current weight on a scale, the empty spool weight, and the original
// filament weight.
//
//   remaining_grams = current_total_weight - empty_spool_weight
//   percent_remaining = remaining_grams / original_filament_weight × 100
//   value_remaining = (remaining_grams / 1000) × price_per_kg
//
// The empty spool weight is the trickiest input because it varies by
// manufacturer. Bambu reusable spool + refill core: ~233g. Polymaker
// cardboard spool: ~140g. Standard plastic spool (eSun, most others):
// 200 to 250g. Some heavier "premium" spools hit 280g. See
// lib/presets/spools.ts for the maintained per-brand figures.

export type RemainingSpoolInput = {
  currentTotalWeightGrams: number;
  emptySpoolWeightGrams: number;
  originalFilamentWeightGrams: number;
  pricePerKg: number;
};

export type RemainingSpoolResult = {
  remainingGrams: number;
  percentRemaining: number;
  valueRemaining: number;
  // sanity flags
  belowEmpty: boolean; // current weight < empty spool weight (input error)
  overFull: boolean;   // remaining > original (input error or extra material)
};

export function calculateRemainingSpool(
  input: RemainingSpoolInput,
): RemainingSpoolResult {
  const remainingGrams = Math.max(
    0,
    input.currentTotalWeightGrams - input.emptySpoolWeightGrams,
  );

  const percentRemaining =
    input.originalFilamentWeightGrams > 0
      ? (remainingGrams / input.originalFilamentWeightGrams) * 100
      : 0;

  const valueRemaining = (remainingGrams / 1000) * input.pricePerKg;

  return {
    remainingGrams,
    percentRemaining,
    valueRemaining,
    belowEmpty:
      input.currentTotalWeightGrams < input.emptySpoolWeightGrams,
    overFull:
      input.originalFilamentWeightGrams > 0 &&
      remainingGrams > input.originalFilamentWeightGrams,
  };
}
