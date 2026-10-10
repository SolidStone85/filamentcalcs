import test from "node:test";
import assert from "node:assert/strict";
import { calculateAmsPurgeWaste } from "../src/lib/formulas/amsPurgeWaste.ts";
import { calculateElectricityCost, calculateAnnualElectricityCost } from "../src/lib/formulas/electricityCost.ts";
import { calculateEnoughFilament } from "../src/lib/formulas/enoughFilament.ts";
import { calculateFailureRate } from "../src/lib/formulas/failureRate.ts";
import { calculateFilamentCost } from "../src/lib/formulas/filamentCost.ts";
import { calculateFilamentLength } from "../src/lib/formulas/filamentLength.ts";
import { calculatePrintPricing } from "../src/lib/formulas/printPricing.ts";
import { calculatePrintTime } from "../src/lib/formulas/printTime.ts";
import { calculateRemainingSpool } from "../src/lib/formulas/remainingSpool.ts";

function close(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} should equal ${expected}`);
}

const pricing = {
  materialCost: 2.5, electricityCost: 0.2, printHours: 6,
  printerPrice: 350, printerLifetimeHours: 5000, failureRatePercent: 8,
  laborHours: 0.5, laborRate: 15, markup: 3,
};

test("print time carries rounded minutes into the next hour", () => {
  const result = calculatePrintTime({ gramsUsed: 119.8, throughputGramsPerHour: 60 });
  assert.equal(result.formatted, "2h 0m");
  assert.equal(result.hoursInt, 2);
  assert.equal(result.minutes, 0);
});

test("zero throughput cannot be reported as a zero-duration print", () => {
  assert.ok(Number.isNaN(calculatePrintTime({ gramsUsed: 100, throughputGramsPerHour: 0 }).hours));
});

test("a zero loaded weight below positive tare is flagged", () => {
  const result = calculateRemainingSpool({ currentTotalWeightGrams: 0, emptySpoolWeightGrams: 200, originalFilamentWeightGrams: 1000, pricePerKg: 20 });
  assert.equal(result.belowEmpty, true);
  assert.equal(result.remainingGrams, 0);
});

test("zero observations are not an excellent failure-rate benchmark", () => {
  assert.equal(calculateFailureRate({ successfulPrints: 0, failedPrints: 0, avgGramsPerPrint: 100, pricePerKg: 20 }).benchmark, "no-data");
});

test("pricing uses the supplied valid failure rate instead of silently clamping it", () => {
  close(calculatePrintPricing({ ...pricing, failureRatePercent: 95 }).failureAdjustedCost, 62.4);
});

test("100 percent failures have no finite cost per successful print", () => {
  assert.ok(Number.isNaN(calculatePrintPricing({ ...pricing, failureRatePercent: 100 }).failureAdjustedCost));
});

test("a zero machine lifetime is unavailable, not free machine use", () => {
  assert.ok(Number.isNaN(calculatePrintPricing({ ...pricing, printerLifetimeHours: 0 }).machineCost));
});

test("filament cost includes overhead and counts only complete prints", () => {
  const result = calculateFilamentCost({ gramsUsed: 500, pricePerKg: 20, wasteFactor: 0.05 });
  close(result.cost, 10.5);
  close(result.effectiveGrams, 525);
  assert.equal(result.completePrintsPerKg, 1);
  assert.equal(calculateFilamentCost({ gramsUsed: 1001, pricePerKg: 20, wasteFactor: 0 }).completePrintsPerKg, 0);
});

test("electricity formulas agree with a 100 W, ten-hour, 20-cent example", () => {
  const result = calculateElectricityCost({ watts: 100, hours: 10, ratePerKwh: 0.2 });
  close(result.kwhUsed, 1);
  close(result.cost, 0.2);
  close(result.costPerHour, 0.02);
  close(calculateAnnualElectricityCost({ watts: 100, hoursPerWeek: 10, ratePerKwh: 0.2 }), 10.4);
});

test("spool estimates preserve overfull and shortage evidence", () => {
  const remaining = calculateRemainingSpool({ currentTotalWeightGrams: 1250, emptySpoolWeightGrams: 200, originalFilamentWeightGrams: 1000, pricePerKg: 20 });
  assert.equal(remaining.remainingGrams, 1050);
  assert.equal(remaining.overFull, true);
  close(remaining.percentRemaining, 105);
  const enough = calculateEnoughFilament({ remainingGrams: 320, printGrams: 260, wastePercent: 5, purgeGrams: 0 });
  close(enough.neededGrams, 273);
  close(enough.spareGrams, 47);
  assert.equal(enough.verdict, "plenty");
  assert.equal(calculateEnoughFilament({ remainingGrams: 272, printGrams: 260, wastePercent: 5, purgeGrams: 0 }).verdict, "short");
  assert.equal(calculateEnoughFilament({ remainingGrams: 273, printGrams: 260, wastePercent: 5, purgeGrams: 0 }).verdict, "close");
});

test("failure rate divides failures by all attempts; consumed failed material is an estimate", () => {
  const result = calculateFailureRate({ successfulPrints: 9, failedPrints: 1, avgGramsPerPrint: 50, pricePerKg: 20 });
  close(result.failureRatePercent, 10);
  close(result.wastedGrams, 50);
  close(result.wastedCost, 1);
});

test("pricing example separates production markup from labor", () => {
  const result = calculatePrintPricing(pricing);
  close(result.machineCost, 0.42);
  close(result.productionCost, 3.12);
  close(result.suggestedPrice, 17.67391304347826);
  close(result.floorPrice, 10.891304347826088);
});

test("legacy AMS arithmetic is valid for an explicitly supplied average", () => {
  const result = calculateAmsPurgeWaste({ colorSwaps: 40, purgePerSwapGrams: 0.4, actualPrintGrams: 80, pricePerKg: 20 });
  close(result.totalPurgeGrams, 16);
  close(result.totalFilamentGrams, 96);
  close(result.totalFilamentCost, 1.92);
  close(result.purgeWastePercent, 100 / 6);
  close(calculateAmsPurgeWaste({ colorSwaps: 0, purgePerSwapGrams: 0.4, actualPrintGrams: 80, pricePerKg: 0 }).totalPurgeCost, 0);
});

function near(actual, expected, tolerance) {
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} should be within ${tolerance} of ${expected}`);
}

test("1.75 mm filament at 1.24 g/cm3 converts grams and meters both ways", () => {
  const forward = calculateFilamentLength({ amount: 1000, direction: "g", diameterMm: 1.75, densityGPerCm3: 1.24, pricePerKg: 24 });
  near(forward.gramsPerMeter, 2.98255, 1e-5);
  near(forward.meters, 335.284, 1e-3);
  near(forward.costPerMeter, 0.07158, 1e-5);
  close(forward.cost, 24);
  near(calculateFilamentLength({ amount: 250, direction: "g", diameterMm: 1.75, densityGPerCm3: 1.24, pricePerKg: 0 }).meters, 83.8209, 1e-4);
  const reverse = calculateFilamentLength({ amount: 10, direction: "m", diameterMm: 1.75, densityGPerCm3: 1.24, pricePerKg: 0 });
  near(reverse.grams, 29.8255, 1e-4);
  close(reverse.meters, 10);
});

test("2.85 mm filament and a changed density scale grams per meter", () => {
  near(calculateFilamentLength({ amount: 1, direction: "m", diameterMm: 2.85, densityGPerCm3: 1.24, pricePerKg: 0 }).grams, 7.91045, 1e-5);
  near(calculateFilamentLength({ amount: 1, direction: "m", diameterMm: 1.75, densityGPerCm3: 1.05, pricePerKg: 0 }).grams, 2.52554, 1e-5);
});

test("converter rejects zero geometry and negative or invalid inputs", () => {
  assert.equal(calculateFilamentLength({ amount: 0, direction: "g", diameterMm: 1.75, densityGPerCm3: 1.24, pricePerKg: 0 }).meters, 0);
  assert.ok(Number.isNaN(calculateFilamentLength({ amount: 100, direction: "g", diameterMm: 0, densityGPerCm3: 1.24, pricePerKg: 0 }).meters));
  assert.ok(Number.isNaN(calculateFilamentLength({ amount: -5, direction: "g", diameterMm: 1.75, densityGPerCm3: 1.24, pricePerKg: 0 }).meters));
  assert.ok(Number.isNaN(calculateFilamentLength({ amount: 100, direction: "g", diameterMm: 1.75, densityGPerCm3: Number.NaN, pricePerKg: 0 }).meters));
  const negativePrice = calculateFilamentLength({ amount: 100, direction: "g", diameterMm: 1.75, densityGPerCm3: 1.24, pricePerKg: -1 });
  assert.ok(Number.isNaN(negativePrice.cost));
  near(negativePrice.meters, 33.5284, 1e-4);
});
