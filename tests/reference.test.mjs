import test from "node:test";
import assert from "node:assert/strict";
import { DRYER_LIMITS, DRYING_SETTINGS } from "../src/lib/dryingSettings.ts";
import { calculateEnoughFilament } from "../src/lib/formulas/enoughFilament.ts";
import { calculateRemainingSpool } from "../src/lib/formulas/remainingSpool.ts";
import { MATERIAL_DATASHEETS } from "../src/lib/presets/materialDatasheets.ts";
import { MATERIALS_FULL } from "../src/lib/presets/materialsFull.ts";
import { SPOOL_PRESETS } from "../src/lib/presets/spools.ts";
import { SPOOL_BRAND_PAGES } from "../src/lib/spoolBrands.ts";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Every number in a display string such as "~253 (245-260)" or "140 ± 7 g".
function numbersIn(text) {
  return (text.match(/\d+(\.\d+)?/g) ?? []).map(Number);
}

function assertSource(source, where) {
  assert.ok(source, `${where} needs a source`);
  assert.match(source.url, /^https:\/\//, `${where} source must be an https URL`);
  assert.ok(source.label.length > 0, `${where} source needs a label`);
  assert.match(source.checked, ISO_DATE, `${where} source needs an ISO checked date`);
}

test("every spool row says what is weighed and names a source unless unverified", () => {
  for (const page of SPOOL_BRAND_PAGES) {
    assert.match(page.checked, ISO_DATE);
    for (const row of page.weights) {
      const where = `${page.slug}: ${row.variant}`;
      assert.ok(row.includes.length > 0, `${where} must say what is on the scale`);
      if (row.evidence === "unverified") {
        assert.equal(row.presetId, undefined, `${where} is unverified and cannot feed a preset`);
      } else {
        assert.ok(row.sources.length > 0, `${where} needs at least one source`);
        row.sources.forEach((source, i) => assertSource(source, `${where} source ${i + 1}`));
      }
    }
  }
});

test("calculator presets match the brand-page rows that cite them", () => {
  for (const page of SPOOL_BRAND_PAGES) {
    const defaultRow = page.weights.find((row) => row.presetId === page.presetId);
    assert.ok(defaultRow, `${page.slug} default preset must have a sourced row`);
    for (const row of page.weights.filter((r) => r.presetId)) {
      const preset = SPOOL_PRESETS.find((p) => p.id === row.presetId);
      assert.ok(preset, `${row.presetId} must exist`);
      assert.ok(
        numbersIn(row.grams).includes(preset.emptyWeightGrams),
        `${row.presetId} preset ${preset.emptyWeightGrams} g must appear in "${row.grams}"`,
      );
    }
  }
});

test("every answer tile repeats numbers from a sourced row", () => {
  for (const page of SPOOL_BRAND_PAGES) {
    assert.ok(page.summary.length > 0, `${page.slug} needs a summary`);
    for (const tile of page.summary) {
      const tileNumbers = numbersIn(tile.value);
      assert.ok(tileNumbers.length > 0, `${page.slug}: ${tile.label} needs a number`);
      const match = page.weights.some((row) => {
        const rowNumbers = numbersIn(row.grams);
        return tileNumbers.every((n) => rowNumbers.includes(n));
      });
      assert.ok(match, `${page.slug}: tile "${tile.value}" must match a row's grams`);
    }
  }
});

test("a 25 g tare difference flips a close print from enough to short", () => {
  const lighterTare = calculateRemainingSpool({ currentTotalWeightGrams: 300, emptySpoolWeightGrams: 200, originalFilamentWeightGrams: 1000, pricePerKg: 0 });
  const heavierTare = calculateRemainingSpool({ currentTotalWeightGrams: 300, emptySpoolWeightGrams: 225, originalFilamentWeightGrams: 1000, pricePerKg: 0 });
  assert.equal(lighterTare.remainingGrams, 100);
  assert.equal(heavierTare.remainingGrams, 75);
  const enough = (remainingGrams) => calculateEnoughFilament({ remainingGrams, printGrams: 80, wastePercent: 0, purgeGrams: 0 });
  assert.equal(enough(100).spareGrams, 20);
  assert.equal(enough(100).verdict, "plenty");
  assert.equal(enough(75).spareGrams, -5);
  assert.equal(enough(75).verdict, "short");
});

test("drying rows name a product, equipment, numeric setting and source", () => {
  const range = /^\d+(-\d+)?$/;
  for (const row of DRYING_SETTINGS) {
    const where = `${row.product} (${row.method})`;
    assert.match(row.tempC, range, `${where} temperature`);
    assert.match(row.hours, range, `${where} hours`);
    assert.ok(row.method.length > 0);
    assertSource(row.source, where);
  }
  for (const dryer of DRYER_LIMITS) assertSource(dryer.source, dryer.equipment);
});

test("material datasheet rows map to a family, name their tests and cite a sheet", () => {
  for (const sheet of MATERIAL_DATASHEETS) {
    assert.ok(MATERIALS_FULL.some((m) => m.id === sheet.materialId), `${sheet.materialId} family`);
    assert.ok(sheet.tensileTest.length > 0 && sheet.impactTest.length > 0, `${sheet.product} tests`);
    assert.equal(sheet.hdtC045 === null, sheet.hdtC18 === null, `${sheet.product} HDT pair`);
    assertSource(sheet.source, sheet.product);
  }
  assert.equal(new Set(MATERIAL_DATASHEETS.map((s) => s.materialId)).size, MATERIAL_DATASHEETS.length);
});
