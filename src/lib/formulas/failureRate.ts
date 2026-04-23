// Failure rate tracker. Turns "I had a bad week" into real numbers.
//
// failure_rate = failed / (successful + failed) * 100
// wasted_grams = failed * avg_grams_per_print
// wasted_cost = (wasted_grams / 1000) * price_per_kg
//
// Benchmark bands (community consensus, not scientific):
//   under 5%: excellent, well-tuned printer
//   5 to 10%: typical hobbyist
//   10 to 20%: something's wrong, diagnose
//   over 20%: investigate seriously (bed adhesion, extruder, filament moisture)

export type FailureRateInput = {
  successfulPrints: number;
  failedPrints: number;
  avgGramsPerPrint: number;
  pricePerKg: number;
};

export type FailureRateResult = {
  failureRatePercent: number;
  totalPrints: number;
  wastedGrams: number;
  wastedCost: number;
  benchmark: "excellent" | "typical" | "investigate" | "serious";
  benchmarkLabel: string;
};

export function calculateFailureRate({
  successfulPrints,
  failedPrints,
  avgGramsPerPrint,
  pricePerKg,
}: FailureRateInput): FailureRateResult {
  const totalPrints = successfulPrints + failedPrints;
  const failureRatePercent =
    totalPrints > 0 ? (failedPrints / totalPrints) * 100 : 0;
  const wastedGrams = failedPrints * avgGramsPerPrint;
  const wastedCost = (wastedGrams / 1000) * pricePerKg;

  let benchmark: FailureRateResult["benchmark"];
  let benchmarkLabel: string;
  if (failureRatePercent < 5) {
    benchmark = "excellent";
    benchmarkLabel = "Excellent. Your printer is well-tuned.";
  } else if (failureRatePercent < 10) {
    benchmark = "typical";
    benchmarkLabel = "Typical hobbyist range. Room to improve with tuning.";
  } else if (failureRatePercent < 20) {
    benchmark = "investigate";
    benchmarkLabel =
      "Above average. Worth investigating bed adhesion and filament moisture.";
  } else {
    benchmark = "serious";
    benchmarkLabel =
      "Investigate seriously. Likely a mechanical or calibration issue.";
  }

  return {
    failureRatePercent,
    totalPrints,
    wastedGrams,
    wastedCost,
    benchmark,
    benchmarkLabel,
  };
}
