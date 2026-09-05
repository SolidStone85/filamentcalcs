import test from "node:test";
import assert from "node:assert/strict";
import { calculateSlicerMaterial, estimateFlushingGrams } from "../src/lib/formulas/amsPurgeWaste.ts";
import { DEFAULT_AMS_STATE, encodeAmsState, getAmsInputStatus, parseAmsState } from "../src/app/tools/ams-purge-waste-calculator/state.ts";

const parse = (query) => parseAmsState(new URLSearchParams(query), ["USD", "CAD", "EUR"]);
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} should equal ${expected}`);

test("slicer totals count each material category once and separate waste share from overhead", () => {
  const result = calculateSlicerMaterial({ modelGrams: 100, supportGrams: 10, flushingGrams: 20, towerGrams: 5, extraGrams: 0, pricePerKg: 20 });
  close(result.totalFilamentGrams, 135);
  close(result.discardedGrams, 35);
  close(result.discardedPercent, 35 / 135 * 100);
  close(result.totalFilamentCost, 2.7);
  close(result.discardedCost, 0.7);
});

test("mm³ uses the explicit density and multiplier exactly once", () => {
  close(estimateFlushingGrams({ colorSwaps: 40, purgePerSwap: 400, unit: "mm3", densityGramsPerCm3: 1.24, flushMultiplier: 1 }), 19.84);
  close(estimateFlushingGrams({ colorSwaps: 40, purgePerSwap: 400, unit: "mm3", densityGramsPerCm3: 1.24, flushMultiplier: 0.5 }), 9.92);
  close(estimateFlushingGrams({ colorSwaps: 40, purgePerSwap: 0.248, unit: "g", densityGramsPerCm3: 1.24, flushMultiplier: 1 }), 9.92);
});

test("startup waste can exist without any color swaps", () => {
  const flush = estimateFlushingGrams({ colorSwaps: 0, purgePerSwap: 0.4, unit: "g", densityGramsPerCm3: 1.24, flushMultiplier: 1 });
  const result = calculateSlicerMaterial({ modelGrams: 10, supportGrams: 0, flushingGrams: flush, towerGrams: 0, extraGrams: 2, pricePerKg: 20 });
  close(result.discardedGrams, 2);
  close(result.totalFilamentCost, 0.24);
});

test("fresh AMS inputs do not impose a hardware purge average", () => {
  const state = parse("");
  assert.equal(state.mode, "slicer");
  assert.equal(state.purgePerSwap, "");
  assert.equal(state.legacyEstimate, false);
  assert.equal(getAmsInputStatus(state).ready, false);
});

test("historical bookmarks preserve explicit grams and are labeled legacy estimates", () => {
  const state = parse("p=bambu-a1&s=40&pg=6&g=80&pp=22&c=CAD");
  assert.equal(state.mode, "estimate");
  assert.equal(state.legacyEstimate, true);
  assert.equal(state.purgePerSwap, 6);
  assert.equal(state.currency, "CAD");
  assert.deepEqual(parse(encodeAmsState(state)), state);
  assert.equal(parse("p=bambu-a1&s=40&g=80").purgePerSwap, 8);
});

test("new estimates preserve sub-gram amounts and zero instead of old slider clamping", () => {
  for (const value of [0, 0.186, 0.4]) {
    const state = parse(`mode=estimate&s=40&pg=${value}&g=80&pp=0`);
    assert.equal(state.purgePerSwap, value);
    assert.equal(state.legacyEstimate, false);
    assert.equal(getAmsInputStatus(state).ready, true);
    assert.deepEqual(parse(encodeAmsState(state)), state);
  }
});

test("explicit blank fields remain blank when bookmarks are reopened", () => {
  const state = { ...DEFAULT_AMS_STATE, pricePerKg: "", towerGrams: "", density: "", multiplier: "" };
  assert.deepEqual(parse(encodeAmsState(state)), state);
});

test("zero-cost and zero-purge jobs are calculable; invalid and missing fields are not", () => {
  const valid = parse("mode=slicer&g=10&flush=0&pp=0");
  assert.equal(getAmsInputStatus(valid).ready, true);
  for (const query of ["mode=slicer&g=-10&flush=1", "mode=slicer&g=10&flush=1&tower=-1", "mode=estimate&g=10&s=2.5&pg=1", "mode=estimate&g=10&s=2&pg=400&unit=mm3&density=0"]) {
    const status = getAmsInputStatus(parse(query));
    assert.equal(status.ready, false);
    assert.equal(status.hasInvalidInput, true);
  }
  for (const query of ["mode=slicer&g=10&flush=NaN", "mode=slicer&g=10&flush=Infinity", "mode=slicer&g=10&flush="]) {
    assert.equal(getAmsInputStatus(parse(query)).ready, false);
  }
});

test("estimate rejects fractional swaps and nonpositive volumetric density", () => {
  const input = { colorSwaps: 40, purgePerSwap: 400, unit: "mm3", densityGramsPerCm3: 1.24, flushMultiplier: 1 };
  assert.ok(Number.isNaN(estimateFlushingGrams({ ...input, colorSwaps: 0.5 })));
  assert.ok(Number.isNaN(estimateFlushingGrams({ ...input, densityGramsPerCm3: 0 })));
  assert.ok(Number.isNaN(estimateFlushingGrams({ ...input, flushMultiplier: Infinity })));
});
