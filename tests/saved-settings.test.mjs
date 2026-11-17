import test from "node:test";
import assert from "node:assert/strict";
import {
  applySaved,
  changedMoneyKeys,
  parseSaved,
  revertTypedAmounts,
  serializeSaved,
  switchCurrency,
  typedMoneyKeys,
  updateSaved,
  withheldAmounts,
} from "../src/lib/savedSettings.ts";

// Preference maps exactly as each calculator declares them.
const PRICING = { c: "currency", pp: "printerPrice", pl: "printerLifetimeHours" };
const FILAMENT_COST = { c: "currency", p: "filamentPricePerKg", pm: "priceMode", sp: "spoolPrice", sw: "pricedSpoolWeight" };
const FILAMENT_COST_GROUPS = [["c", "p", "pm", "sp", "sw"]];
const FAILURE_RATE = { c: "currency", p: "pricePerKg" };
const AMS = { c: "currency", pp: "pricePerKg" };
const LENGTH = { dia: "filamentDiameter", p: "pricePerKg", cur: "currency" };
const ELECTRICITY = { c: "currency", p: "printerId", w: "watts", r: "electricityRateId", rt: "electricityRate" };

// Built-in example state of the pricing page, as its encoder writes it.
const PRICING_DEFAULTS = "m=&e=0.2&h=&pp=350&pl=5000&f=8&lh=&lr=15&mk=3&c=USD";

const usPrinter = () => ({ prefs: { currency: "USD", printerLifetimeHours: "5000" }, money: { USD: { printerPrice: "1000" } } });

test("X1: a saved US$1,000 printer price is not reused on a CAD link", () => {
  const saved = usPrinter();
  const params = applySaved("m=4.5864&c=CAD", saved, PRICING);
  assert.equal(params.get("c"), "CAD");
  assert.equal(params.get("pp"), "", "the field is left empty, never 1000");
  assert.equal(params.get("pl"), "5000", "non-money preferences still apply");
  const [notice] = withheldAmounts(params.toString(), saved, PRICING);
  assert.deepEqual(
    { queryKey: notice.queryKey, currency: notice.currency, amount: notice.amount, pageCurrency: notice.pageCurrency },
    { queryKey: "pp", currency: "USD", amount: "1000", pageCurrency: "CAD" },
  );
  assert.deepEqual(saved, usPrinter(), "loading does not change the saved record");
});

test("X3: the same saved amount returns on a USD link and with no link at all", () => {
  assert.equal(applySaved("m=4.5864&c=USD", usPrinter(), PRICING).get("pp"), "1000");
  const noLink = applySaved("", usPrinter(), PRICING);
  assert.equal(noLink.get("pp"), "1000");
  assert.equal(noLink.get("c"), "USD");
  assert.deepEqual(withheldAmounts(noLink.toString(), usPrinter(), PRICING), []);
});

test("X4: an amount written in the link wins and is not treated as withheld", () => {
  const params = applySaved("m=2.5&pp=800&c=CAD", usPrinter(), PRICING);
  assert.equal(params.get("pp"), "800");
  assert.deepEqual(withheldAmounts(params.toString(), usPrinter(), PRICING), []);
});

test("X5: amounts are remembered per currency", () => {
  let saved = usPrinter();
  saved = updateSaved(saved, "m=1&pp=1300&pl=5000&c=CAD", PRICING, PRICING_DEFAULTS);
  assert.deepEqual(saved.money, { USD: { printerPrice: "1000" }, CAD: { printerPrice: "1300" } });
  assert.equal(saved.prefs.currency, "CAD");
  assert.equal(applySaved("c=USD", saved, PRICING).get("pp"), "1000");
  assert.equal(applySaved("c=CAD", saved, PRICING).get("pp"), "1300");
});

test("X6: an old record's amounts are not read; its other preferences survive", () => {
  const legacy = JSON.stringify({ currency: "CAD", printerPrice: "1000", printerLifetimeHours: "4000", spoolPrice: "20" });
  const saved = parseSaved(null, legacy);
  assert.deepEqual(saved, { prefs: { currency: "CAD", printerLifetimeHours: "4000" }, money: {}, legacyAmounts: true });
  const params = applySaved("", saved, PRICING);
  assert.equal(params.get("pp"), null, "no amount is applied from the old record");
  assert.equal(params.get("pl"), "4000");
  assert.equal(params.get("c"), "CAD");
  // A version 2 record, once written, takes over from the old one.
  const v2 = serializeSaved({ prefs: { currency: "USD" }, money: {} });
  assert.deepEqual(parseSaved(v2, legacy), { prefs: { currency: "USD" }, money: {} });
});

test("an old record with no amounts raises no notice", () => {
  assert.deepEqual(parseSaved(null, JSON.stringify({ currency: "EUR", printerId: "a1" })), { prefs: { currency: "EUR", printerId: "a1" }, money: {} });
  assert.equal(parseSaved(null, null), null);
});

test("X7: built-in example amounts are never saved as the visitor's", () => {
  // Remember ticked on an untouched pricing page.
  const saved = updateSaved(null, PRICING_DEFAULTS, PRICING, PRICING_DEFAULTS);
  assert.deepEqual(saved, { prefs: { currency: "USD", printerLifetimeHours: "5000" }, money: {} });
  // Untouched Filament Cost page: the example $20 spool is not stored.
  const fcDefaults = "g=&p=20&w=0.05&c=USD&m=pla&pm=spool&sp=20&sw=1000";
  assert.deepEqual(updateSaved(null, fcDefaults, FILAMENT_COST, fcDefaults).money, {});
});

test("clearing an amount removes it for that currency only", () => {
  let saved = { prefs: { currency: "CAD" }, money: { USD: { printerPrice: "1000" }, CAD: { printerPrice: "1300" } } };
  saved = updateSaved(saved, "pp=&pl=5000&c=CAD", PRICING, PRICING_DEFAULTS);
  assert.deepEqual(saved.money, { USD: { printerPrice: "1000" } });
});

test("X2: choosing CAD in a menu updates the currency choice but leaves the USD amount alone", () => {
  // Filament Cost, opened with saved settings, nothing typed; visitor picks CAD.
  const before = "g=182&p=20&w=0.05&c=USD&m=pla&pm=spool&sp=20&sw=1000";
  const after = "g=182&p=20&w=0.05&c=CAD&m=pla&pm=spool&sp=20&sw=1000";
  const saved = usPrinter();
  assert.equal(switchCurrency(before, after, saved, FILAMENT_COST, new Set()), after, "examples are left alone");
  const stored = updateSaved(saved, after, FILAMENT_COST, "g=&p=20&w=0.05&c=USD&m=pla&pm=spool&sp=20&sw=1000");
  assert.equal(stored.prefs.currency, "CAD", "the visitor chose CAD");
  assert.deepEqual(stored.money, { USD: { printerPrice: "1000" } });
  // The handoff then arrives on Print Pricing in CAD.
  const params = applySaved("m=3.8219999999999996&c=CAD", stored, PRICING);
  assert.equal(params.get("pp"), "");
  assert.equal(params.get("m"), "3.8219999999999996", "the carried cost keeps full precision");
  assert.equal(withheldAmounts(params.toString(), stored, PRICING)[0].currency, "USD");
});

test("changing currency takes a saved amount off the screen and restores it on the way back", () => {
  const saved = usPrinter();
  const usd = "m=2.5&pp=1000&pl=5000&c=USD";
  const cad = "m=2.5&pp=1000&pl=5000&c=CAD";
  const adjusted = switchCurrency(usd, cad, saved, PRICING, new Set());
  assert.equal(new URLSearchParams(adjusted).get("pp"), "");
  const back = switchCurrency(adjusted, adjusted.replace("c=CAD", "c=USD"), saved, PRICING, new Set());
  assert.equal(new URLSearchParams(back).get("pp"), "1000");
});

test("changing currency swaps in the amount saved for the new currency", () => {
  const saved = { prefs: { currency: "USD" }, money: { USD: { printerPrice: "1000" }, CAD: { printerPrice: "1300" } } };
  const adjusted = switchCurrency("pp=1000&c=USD", "pp=1000&c=CAD", saved, PRICING, new Set());
  assert.equal(new URLSearchParams(adjusted).get("pp"), "1300");
});

test("X8: an amount typed this visit follows the currency the visitor then chooses", () => {
  // Fresh profile, Remember on, visitor types 1,000 while the page says USD.
  let saved = updateSaved(null, PRICING_DEFAULTS, PRICING, PRICING_DEFAULTS);
  const baseline = saved;
  const typed = new Set(changedMoneyKeys("pp=350&c=USD", "pp=1000&c=USD", PRICING));
  assert.deepEqual([...typed], ["pp"]);
  saved = updateSaved(saved, "pp=1000&pl=5000&c=USD", PRICING, PRICING_DEFAULTS);
  assert.deepEqual(saved.money, { USD: { printerPrice: "1000" } });
  // Then picks CAD: the number stays on screen.
  assert.equal(switchCurrency("pp=1000&c=USD", "pp=1000&c=CAD", saved, PRICING, typed), "pp=1000&c=CAD");
  saved = revertTypedAmounts(saved, baseline, ["printerPrice"], "USD");
  saved = updateSaved(saved, "pp=1000&pl=5000&c=CAD", PRICING, PRICING_DEFAULTS);
  assert.deepEqual(saved.money, { CAD: { printerPrice: "1000" } }, "the record holds no USD amount");
  const reopened = applySaved("", saved, PRICING);
  assert.equal(reopened.get("c"), "CAD");
  assert.equal(reopened.get("pp"), "1000");
  assert.deepEqual(withheldAmounts(reopened.toString(), saved, PRICING), []);
});

test("reverting a typed amount restores what was saved before the visit", () => {
  const baseline = usPrinter();
  let saved = updateSaved(baseline, "pp=1200&pl=5000&c=USD", PRICING, PRICING_DEFAULTS);
  saved = revertTypedAmounts(saved, baseline, ["printerPrice"], "USD");
  assert.equal(saved.money.USD.printerPrice, "1000");
});

test("every calculator that saves an amount keeps it with its currency", () => {
  const saved = { prefs: { currency: "USD" }, money: { USD: { pricePerKg: "24", electricityRate: "0.18", filamentPricePerKg: "24", spoolPrice: "24" } } };
  for (const [name, keys, key, query] of [
    ["failure rate", FAILURE_RATE, "p", "c=EUR"],
    ["AMS purge", AMS, "pp", "c=EUR"],
    ["length converter", LENGTH, "p", "cur=EUR"],
    ["electricity", ELECTRICITY, "rt", "c=EUR"],
  ]) {
    assert.equal(applySaved(query, saved, keys).get(key), "", `${name}: not reused in EUR`);
    assert.equal(withheldAmounts(applySaved(query, saved, keys).toString(), saved, keys).length, 1, `${name}: says why`);
    const home = query.replace("EUR", "USD");
    assert.notEqual(applySaved(home, saved, keys).get(key), "", `${name}: still offered in USD`);
  }
  // Filament Cost treats a link that sets the currency as self-contained, as before.
  const fc = applySaved("g=182&c=EUR", saved, FILAMENT_COST, FILAMENT_COST_GROUPS);
  assert.equal(fc.get("sp"), null);
  assert.equal(fc.get("p"), null);
  // With no link currency it gets its saved USD prices back.
  assert.equal(applySaved("g=182", saved, FILAMENT_COST, FILAMENT_COST_GROUPS).get("sp"), "24");
});

test("no amount is ever multiplied or altered", () => {
  const saved = { prefs: { currency: "USD" }, money: { USD: { printerPrice: "1000" }, JPY: { printerPrice: "150000" } } };
  for (const currency of ["USD", "CAD", "EUR", "JPY", "INR"]) {
    const value = applySaved(`c=${currency}`, saved, PRICING).get("pp");
    assert.ok(["1000", "150000", ""].includes(value), `${currency}: ${value}`);
    assert.equal(value, saved.money[currency]?.printerPrice ?? "");
  }
});

test("a visitor with nothing saved in any currency keeps the built-in examples", () => {
  const saved = { prefs: { currency: "USD" }, money: {} };
  assert.equal(applySaved("c=CAD", saved, PRICING).get("pp"), null);
  assert.deepEqual(withheldAmounts("pp=350&c=CAD", saved, PRICING), []);
  assert.deepEqual(withheldAmounts("pp=&c=CAD", null, PRICING), []);
});

test("an amount that only arrived in a shared link is not adopted when another field is edited", () => {
  const saved = usPrinter();
  // Someone else's link sets a CA$800 printer; the visitor then edits only the material cost.
  const afterEdit = updateSaved(saved, "m=3&pp=800&pl=5000&c=CAD", PRICING, PRICING_DEFAULTS, new Set());
  assert.deepEqual(afterEdit.money, { USD: { printerPrice: "1000" } });
  // Once the visitor types the printer price themselves, it is theirs.
  const afterTyping = updateSaved(saved, "m=3&pp=900&pl=5000&c=CAD", PRICING, PRICING_DEFAULTS, new Set(["pp"]));
  assert.deepEqual(afterTyping.money, { USD: { printerPrice: "1000" }, CAD: { printerPrice: "900" } });
});

test("a change that switches the currency is not the visitor typing an amount", () => {
  // Same currency: a changed amount is typed.
  assert.deepEqual(typedMoneyKeys("pp=350&c=USD", "pp=900&c=USD", PRICING), ["pp"]);
  // The page empties or restores an example while the currency changes: not typed.
  assert.deepEqual(typedMoneyKeys("pp=350&c=USD", "pp=&c=CAD", PRICING), []);
  assert.deepEqual(typedMoneyKeys("pp=&c=CAD", "pp=350&c=USD", PRICING), []);
  // Electricity: choosing a currency turns a preset into an empty custom rate.
  assert.deepEqual(typedMoneyKeys("r=us-avg&c=USD", "r=custom&rt=&c=EUR", ELECTRICITY), []);
});

test("switching currency offers the saved amount for the new currency and keeps the record", () => {
  // Found on the Electricity page: the saved EUR rate was deleted and the field left empty.
  const saved = { prefs: { currency: "USD" }, money: { EUR: { electricityRate: "0.4321" } } };
  const prev = "r=us-avg&c=USD";
  const next = "r=custom&rt=&c=EUR";
  const typed = new Set(typedMoneyKeys(prev, next, ELECTRICITY));
  const shown = switchCurrency(prev, next, saved, ELECTRICITY, typed);
  assert.equal(new URLSearchParams(shown).get("rt"), "0.4321");
  const after = updateSaved(saved, shown, ELECTRICITY, "", typed);
  assert.deepEqual(after.money, { EUR: { electricityRate: "0.4321" } });
  assert.equal(after.prefs.currency, "EUR");
});

test("an explicitly entered CAD price equal to the USD example is genuine money", () => {
  const saved = updateSaved(usPrinter(), "pp=350&pl=5000&c=CAD", PRICING, PRICING_DEFAULTS, new Set(["pp"]));
  assert.equal(saved.money.CAD.printerPrice, "350");
  assert.equal(saved.money.USD.printerPrice, "1000");
  assert.equal(applySaved("c=CAD", saved, PRICING).get("pp"), "350");
});
test("turning Remember on after entering a default-valued CAD amount keeps it", () => {
  const saved = updateSaved(usPrinter(), "pp=350&pl=5000&c=CAD", PRICING, PRICING_DEFAULTS, undefined, new Set(["pp"]));
  assert.equal(saved.money.CAD?.printerPrice, "350");
  assert.equal(saved.money.USD.printerPrice, "1000");
});