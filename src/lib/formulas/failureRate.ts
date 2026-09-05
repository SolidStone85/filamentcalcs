// Failure rate tracker. Turns "I had a bad week" into real numbers.
//
// failure_rate = failed / (successful + failed) * 100
// wasted_grams = failed * avg_grams_per_print
// wasted_cost = (wasted_grams / 1000) * price_per_kg
//
// Display bands are descriptive buckets, not measured industry benchmarks.
// avgGramsPerPrint means average material actually consumed by a failed attempt.

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
  benchmark: "no-data" | "excellent" | "typical" | "investigate" | "serious";
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
  if (totalPrints === 0) {
    benchmark = "no-data";
    benchmarkLabel = "No attempts recorded.";
  } else if (failureRatePercent < 5) {
    benchmark = "excellent";
    benchmarkLabel = "Under 5% of recorded attempts failed.";
  } else if (failureRatePercent < 10) {
    benchmark = "typical";
    benchmarkLabel = "5% to under 10% of recorded attempts failed.";
  } else if (failureRatePercent < 20) {
    benchmark = "investigate";
    benchmarkLabel =
      "10% to under 20% of recorded attempts failed.";
  } else {
    benchmark = "serious";
    benchmarkLabel =
      "20% or more of recorded attempts failed.";
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
