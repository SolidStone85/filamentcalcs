// Pure math. No React, no browser APIs. Easy to test in isolation.
//
// cost = (grams / 1000) × pricePerKg × (1 + wasteFactor)
//
// wasteFactor is a decimal (0.05 = 5%), not a percentage.

export type FilamentCostInput = {
  gramsUsed: number;
  pricePerKg: number;
  wasteFactor: number; // 0.05 for 5%
};

export type FilamentCostResult = {
  cost: number;
  costPerGram: number;
  effectiveGrams: number; // grams including waste
};

export function calculateFilamentCost({
  gramsUsed,
  pricePerKg,
  wasteFactor,
}: FilamentCostInput): FilamentCostResult {
  const kg = gramsUsed / 1000;
  const effectiveGrams = gramsUsed * (1 + wasteFactor);
  const cost = kg * pricePerKg * (1 + wasteFactor);
  const costPerGram = gramsUsed > 0 ? cost / gramsUsed : 0;
  return { cost, costPerGram, effectiveGrams };
}

// Worked example used in tests + design spec:
//   500g × $20/kg × 5% waste → $10.50
// (500 / 1000) × 20 × 1.05 = 10.5
