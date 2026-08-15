// What to charge for a 3D print. Pure math, no React, no browser APIs.
//
// production = material + electricity + machine wear
// wear       = printer_price / lifetime_hours × print_hours
// adjusted   = production ÷ (1 - failure_rate)
// price      = adjusted × markup + labor
//
// The failure adjustment divides instead of adding a percent because a
// failed print costs a whole print. At a 10% failure rate, every 9 good
// prints have to pay for 1 dead one: production ÷ 0.9, not × 1.1.

export type PrintPricingInput = {
  materialCost: number; // per print, in the user's currency
  electricityCost: number; // per print
  printHours: number;
  printerPrice: number;
  printerLifetimeHours: number;
  failureRatePercent: number; // 0..40 is the realistic band
  laborHours: number;
  laborRate: number; // per hour
  markup: number; // multiplier applied to production cost, not labor
};

export type PrintPricingResult = {
  machineCost: number;
  productionCost: number; // material + electricity + machine
  failureAdjustedCost: number;
  laborCost: number;
  floorPrice: number; // break-even: adjusted cost + labor
  suggestedPrice: number; // adjusted cost × markup + labor
  profit: number; // suggested - floor
  marginPercent: number; // profit / suggested × 100
  effectiveHourlyRate: number; // what the sale pays per labor hour
};

export function calculatePrintPricing({
  materialCost,
  electricityCost,
  printHours,
  printerPrice,
  printerLifetimeHours,
  failureRatePercent,
  laborHours,
  laborRate,
  markup,
}: PrintPricingInput): PrintPricingResult {
  const machineCost =
    printerLifetimeHours > 0
      ? (printerPrice / printerLifetimeHours) * printHours
      : 0;
  const productionCost = materialCost + electricityCost + machineCost;

  // Clamp so a typo like 100% failure doesn't divide by zero.
  const failureFraction =
    Math.min(Math.max(failureRatePercent, 0), 90) / 100;
  const failureAdjustedCost = productionCost / (1 - failureFraction);

  const laborCost = laborHours * laborRate;
  const floorPrice = failureAdjustedCost + laborCost;
  const suggestedPrice = failureAdjustedCost * markup + laborCost;
  const profit = suggestedPrice - floorPrice;
  const marginPercent =
    suggestedPrice > 0 ? (profit / suggestedPrice) * 100 : 0;
  const effectiveHourlyRate =
    laborHours > 0 ? (suggestedPrice - failureAdjustedCost) / laborHours : 0;

  return {
    machineCost,
    productionCost,
    failureAdjustedCost,
    laborCost,
    floorPrice,
    suggestedPrice,
    profit,
    marginPercent,
    effectiveHourlyRate,
  };
}

// Worked example used on the page and in tests:
//   material $2.50, electricity $0.20, 6 h on a $350 printer over 5000 h
//   wear = 350 / 5000 × 6 = $0.42 → production = $3.12
//   8% failures → 3.12 ÷ 0.92 = $3.39
//   labor 0.5 h × $15 = $7.50, markup 3×
//   price = 3.39 × 3 + 7.50 = $17.67
