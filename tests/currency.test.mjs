import test from "node:test";
import assert from "node:assert/strict";
import { CURRENCIES, formatCurrency } from "../src/lib/currency.ts";
import { DEFAULT_AMS_STATE, encodeAmsState, parseAmsState } from "../src/app/tools/ams-purge-waste-calculator/state.ts";
import { ELECTRICITY_RATE_PRESETS } from "../src/lib/presets/electricityRates.ts";
import { getMaterialPreset } from "../src/lib/presets/materials.ts";

let currencyPresetState;
try {
  currencyPresetState = await import("../src/lib/currencyPresetState.ts");
} catch {
  // Keep the first TDD run an assertion failure while this new helper is absent.
}

function getHelper(name) {
  const helper = currencyPresetState?.[name];
  assert.equal(typeof helper, "function", `currencyPresetState.${name} must be exported`);
  return helper;
}

const newCurrencies = [
  ["PHP", "₱"],
  ["SEK", "SEK"],
  ["NOK", "NOK"],
  ["DKK", "DKK"],
];

test("new currency options format amounts with recognizable symbols or ISO codes", () => {
  for (const [code, marker] of newCurrencies) {
    assert.ok(CURRENCIES.some((currency) => currency.code === code), `${code} should be selectable`);
    const expectedMarker = code === "PHP" ? String.fromCodePoint(8369) : marker;
    assert.ok(formatCurrency(1234.56, code).includes(expectedMarker), `${code} should appear in its formatted amount`);
  }
  assert.equal([...CURRENCIES.find((currency) => currency.code === "PHP").symbol][0].codePointAt(0), 0x20b1);
});

test("AMS shared URLs retain each newly supported currency", () => {
  const allowedCurrencies = CURRENCIES.map((currency) => currency.code);
  for (const [code] of newCurrencies) {
    const state = parseAmsState(new URLSearchParams(`mode=slicer&g=25&flush=3&pp=20&c=${code}`), allowedCurrencies);
    assert.equal(state.currency, code);
    const restored = parseAmsState(new URLSearchParams(encodeAmsState(state)), allowedCurrencies);
    assert.deepEqual(restored, state);
  }
  assert.equal(DEFAULT_AMS_STATE.currency, "USD");
});

test("a mismatched regional electricity preset becomes custom with no borrowed rate", () => {
  const parseElectricityRateState = getHelper("parseElectricityRateState");
  assert.deepEqual(
    parseElectricityRateState(
      new URLSearchParams("r=us-avg&c=EUR"),
      { rateId: "us-avg", customRate: 0.18, currency: "USD" },
      ELECTRICITY_RATE_PRESETS,
      CURRENCIES,
    ),
    { rateId: "custom", customRate: "", currency: "EUR" },
  );
});

test("an explicit local rate survives a mismatched preset URL as a custom rate", () => {
  const parseElectricityRateState = getHelper("parseElectricityRateState");
  assert.deepEqual(
    parseElectricityRateState(
      new URLSearchParams("r=us-avg&c=PHP&rt=0.42"),
      { rateId: "us-avg", customRate: 0.18, currency: "USD" },
      ELECTRICITY_RATE_PRESETS,
      CURRENCIES,
    ),
    { rateId: "custom", customRate: 0.42, currency: "PHP" },
  );
});

test("a custom electricity rate URL without a local amount stays blank", () => {
  const parseElectricityRateState = getHelper("parseElectricityRateState");
  assert.deepEqual(
    parseElectricityRateState(
      new URLSearchParams("r=custom&c=EUR"),
      { rateId: "us-avg", customRate: 0.18, currency: "USD" },
      ELECTRICITY_RATE_PRESETS,
      CURRENCIES,
    ),
    { rateId: "custom", customRate: "", currency: "EUR" },
  );
});

test("changing currency from a regional rate clears the preset and its rate", () => {
  const changeElectricityCurrency = getHelper("changeElectricityCurrency");
  assert.deepEqual(
    changeElectricityCurrency({ rateId: "us-avg", customRate: 0.18, currency: "USD" }, "PHP"),
    { rateId: "custom", customRate: "", currency: "PHP" },
  );
});

test("changing currency on an existing custom rate preserves the entered amount", () => {
  const changeElectricityCurrency = getHelper("changeElectricityCurrency");
  assert.deepEqual(
    changeElectricityCurrency({ rateId: "custom", customRate: 0.37, currency: "USD" }, "PHP"),
    { rateId: "custom", customRate: 0.37, currency: "PHP" },
  );
});

test("choosing a regional electricity rate selects its own currency", () => {
  const chooseElectricityRate = getHelper("chooseElectricityRate");
  assert.deepEqual(
    chooseElectricityRate({ rateId: "custom", customRate: 0.37, currency: "PHP" }, "eu-avg", ELECTRICITY_RATE_PRESETS),
    { rateId: "eu-avg", customRate: 0.37, currency: "EUR" },
  );
});

test("choosing custom from a regional preset requires a new utility rate", () => {
  const chooseElectricityRate = getHelper("chooseElectricityRate");
  assert.deepEqual(
    chooseElectricityRate({ rateId: "us-avg", customRate: 0.18, currency: "USD" }, "custom", ELECTRICITY_RATE_PRESETS),
    { rateId: "custom", customRate: "", currency: "USD" },
  );
});

test("material reference presets use USD while custom selection preserves user prices", () => {
  const applyMaterialPreset = getHelper("applyMaterialPreset");
  const state = {
    grams: 100,
    pricePerKg: 42,
    wasteFactor: 0.14,
    currency: "PHP",
    materialId: "custom",
    priceMode: "kg",
    spoolPrice: 31,
    spoolWeight: 750,
  };
  assert.deepEqual(applyMaterialPreset(state, "pla", getMaterialPreset("pla")), {
    ...state,
    pricePerKg: 20,
    wasteFactor: 0.05,
    currency: "USD",
    materialId: "pla",
  });
  assert.deepEqual(applyMaterialPreset(state, "custom", getMaterialPreset("custom")), state);
  const selectedPreset = applyMaterialPreset(state, "pla", getMaterialPreset("pla"));
  assert.deepEqual(applyMaterialPreset(selectedPreset, "custom", getMaterialPreset("custom")), {
    ...selectedPreset,
    materialId: "custom",
  });
});
