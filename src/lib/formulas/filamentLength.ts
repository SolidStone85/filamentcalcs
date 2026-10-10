// Filament length <-> weight converter. Pure math.
//
// A 1 m piece of filament is a cylinder: cross-section π × (d/2)² mm²,
// times 1000 mm long = π × (d/2)² cm³ (1000 mm³ = 1 cm³). So
//
//   grams_per_meter = density_g_per_cm3 × π × (diameter_mm / 2)²
//   meters          = grams / grams_per_meter
//   cost_per_meter  = grams_per_meter / 1000 × price_per_kg
//
// Real filament diameter and density vary a little by product and batch,
// so results are estimates; use the product's own density when known.

export type FilamentLengthInput = {
  amount: number; // grams when direction is "g", meters when "m"
  direction: "g" | "m";
  diameterMm: number;
  densityGPerCm3: number;
  pricePerKg: number; // 0 when unknown
};

export type FilamentLengthResult = {
  gramsPerMeter: number;
  grams: number;
  meters: number;
  costPerMeter: number;
  cost: number;
};

export function calculateFilamentLength({
  amount,
  direction,
  diameterMm,
  densityGPerCm3,
  pricePerKg,
}: FilamentLengthInput): FilamentLengthResult {
  const valid =
    [amount, diameterMm, densityGPerCm3].every(Number.isFinite) &&
    amount >= 0 &&
    diameterMm > 0 &&
    densityGPerCm3 > 0;
  if (!valid) {
    return { gramsPerMeter: NaN, grams: NaN, meters: NaN, costPerMeter: NaN, cost: NaN };
  }

  const gramsPerMeter = densityGPerCm3 * Math.PI * (diameterMm / 2) ** 2;
  const grams = direction === "g" ? amount : amount * gramsPerMeter;
  const meters = direction === "m" ? amount : amount / gramsPerMeter;
  // An invalid optional price only removes the cost results.
  const price = Number.isFinite(pricePerKg) && pricePerKg >= 0 ? pricePerKg : NaN;

  return {
    gramsPerMeter,
    grams,
    meters,
    costPerMeter: (gramsPerMeter / 1000) * price,
    cost: (grams / 1000) * price,
  };
}
