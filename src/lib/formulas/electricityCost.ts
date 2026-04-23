// Electricity cost of a 3D print.
//
// kWh = (watts / 1000) * hours
// cost = kWh * rate_per_kwh
//
// Typical realization: electricity is almost always a small fraction of
// filament cost (often under 10%). A 24 hour print on a 115W Bambu X1C
// at $0.18/kWh is about $0.50. Worth calculating so users stop worrying.

export type ElectricityCostInput = {
  watts: number;
  hours: number;
  ratePerKwh: number;
};

export type ElectricityCostResult = {
  kwhUsed: number;
  cost: number;
  costPerHour: number;
};

export function calculateElectricityCost({
  watts,
  hours,
  ratePerKwh,
}: ElectricityCostInput): ElectricityCostResult {
  const kwhUsed = (watts / 1000) * hours;
  const cost = kwhUsed * ratePerKwh;
  const costPerHour = hours > 0 ? cost / hours : 0;
  return { kwhUsed, cost, costPerHour };
}

// Annual projection: cost to run this print profile at a given print
// frequency (hours per week) over a year. Useful for "should I leave
// this thing on all the time" questions.
export function calculateAnnualElectricityCost({
  watts,
  hoursPerWeek,
  ratePerKwh,
}: {
  watts: number;
  hoursPerWeek: number;
  ratePerKwh: number;
}): number {
  const kwhPerYear = (watts / 1000) * hoursPerWeek * 52;
  return kwhPerYear * ratePerKwh;
}
