import test from "node:test";
import assert from "node:assert/strict";
import { formatDuration, hoursToMinutes, joinHours, minutesToHours, splitHours } from "../src/lib/duration.ts";
import { calculateFilamentCost } from "../src/lib/formulas/filamentCost.ts";
import { calculatePrintPricing } from "../src/lib/formulas/printPricing.ts";
import {
  DEFAULT_PRICING_STATE,
  USD_EXAMPLE_QUERY,
  applyExample,
  changeCurrency,
  clearExample,
  editJobField,
  encodePricingState,
  exampleWouldFill,
  missingJobField,
  missingRateField,
  parsePricingState,
} from "../src/app/tools/print-pricing-calculator/state.ts";

const CODES = ["USD", "EUR", "GBP", "CAD", "AUD", "NZD", "JPY", "INR", "PHP", "SEK", "NOK", "DKK"];
const parse = (query) => parsePricingState(new URLSearchParams(query), CODES);

/** Price shown for a state, to cents, or null when a job detail is unanswered. */
function quote(state) {
  if (missingJobField(state) || missingRateField(state)) return null;
  const result = calculatePrintPricing({
    materialCost: state.materialCost, electricityCost: state.electricityCost, printHours: state.printHours,
    printerPrice: state.printerPrice, printerLifetimeHours: state.printerLifetimeHours,
    failureRatePercent: state.failureRatePercent, laborHours: state.laborHours, laborRate: state.laborRate, markup: state.markup,
  });
  return { price: result.suggestedPrice.toFixed(2), breakEven: result.floorPrice.toFixed(2) };
}

test("a real quote starts with the three job details empty", () => {
  const state = parse("");
  assert.equal(state.materialCost, "");
  assert.equal(state.printHours, "");
  assert.equal(state.laborHours, "");
  assert.equal(missingJobField(state), "m");
  assert.equal(quote(state), null);
  assert.equal(encodePricingState(state), "m=&e=0.2&h=&pp=350&pl=5000&f=8&lh=&lr=15&mk=3&c=USD");
});

test("a handoff carries only the material cost; the times stay empty", () => {
  const carried = String(calculateFilamentCost({ gramsUsed: 182, pricePerKg: 24, wasteFactor: 0.05 }).cost);
  for (const link of [`m=${carried}&c=USD`, `m=${carried}&c=CAD`]) {
    const state = parse(link);
    assert.equal(state.materialCost, Number(carried));
    assert.equal(missingJobField(state), "h");
    assert.equal(quote(state), null, "no price until the times are entered");
  }
  // The AMS calculator's handoff has the same shape.
  assert.equal(missingJobField(parse("m=11.352&c=EUR")), "h");
});

test("the carried cost keeps full precision through the page and back into the link", () => {
  const state = parse("m=3.8219999999999996&c=CAD");
  assert.equal(state.materialCost, 3.8219999999999996);
  assert.equal(new URLSearchParams(encodePricingState(state)).get("m"), "3.8219999999999996");
});

test("job 1: carried 4.5864, 7 h 45 min, 15 min hands-on", () => {
  let state = parse("m=4.5864&c=USD");
  state = editJobField(state, "h", joinHours(7, 45));
  state = editJobField(state, "lh", minutesToHours(15));
  assert.deepEqual(quote(state), { price: "21.13", breakEven: "9.54" });
  // Typing the rounded amount by hand is a different input and gives a different cent.
  assert.equal(quote(editJobField(state, "m", 4.59)).price, "21.14");
});

test("worked jobs 2 to 4 give the documented prices", () => {
  const job = (material, hours, minutes, handsOn) =>
    quote({ ...DEFAULT_PRICING_STATE, materialCost: material, printHours: joinHours(hours, minutes), laborHours: minutesToHours(handsOn) });
  assert.deepEqual(job(0.9933, 1, 52, 5), { price: "5.57", breakEven: "2.69" });
  assert.deepEqual(job(5.192, 11, 20, 20), { price: "25.17", breakEven: "11.72" });
  assert.deepEqual(job(0.252, "", 38, 5), { price: "2.87", breakEven: "1.79" });
});

test("zero hands-on time is an answer; an empty field is not", () => {
  const zero = parse("m=4.5864&h=7.75&lh=0&c=USD");
  assert.equal(zero.laborHours, 0);
  assert.equal(missingJobField(zero), null);
  assert.deepEqual(quote(zero), { price: "17.38", breakEven: "5.79" });
  const empty = parse("m=4.5864&h=7.75&lh=&c=USD");
  assert.equal(empty.laborHours, "");
  assert.equal(missingJobField(empty), "lh");
  assert.equal(quote(empty), null);
  // Both survive a round trip through the link.
  assert.equal(parse(encodePricingState(zero)).laborHours, 0);
  assert.equal(parse(encodePricingState(empty)).laborHours, "");
});

test("existing full links open exactly as before", () => {
  // The page's published worked example.
  assert.deepEqual(quote(parse("m=2.5&e=0.2&h=6&pp=350&pl=5000&f=8&lh=0.5&lr=15&mk=3&c=USD")), { price: "17.67", breakEven: "10.89" });
  // The case Vela checked.
  assert.deepEqual(quote(parse("m=4.5864&e=0.2&h=6&pp=350&pl=5000&f=8&lh=0.5&lr=15&mk=3&c=USD")), { price: "24.48", breakEven: "13.16" });
  // Decimal hours in an old link are kept as written.
  const old = parse("m=5.192&e=0.2&h=11.33&pp=350&pl=5000&f=8&lh=0.33&lr=15&mk=3&c=USD");
  assert.equal(old.printHours, 11.33);
  assert.equal(quote(old).price, "25.12");
  assert.deepEqual(splitHours(old.printHours), { hours: 11, minutes: 19.8 });
  assert.equal(hoursToMinutes(old.laborHours), 19.8);
  assert.deepEqual(parse(encodePricingState(old)), old);
});

test("hours and minutes convert both ways without drift", () => {
  assert.deepEqual(splitHours(7.75), { hours: 7, minutes: 45 });
  assert.equal(joinHours(7, 45), 7.75);
  assert.deepEqual(splitHours(joinHours(11, 20)), { hours: 11, minutes: 20 });
  assert.deepEqual(splitHours(joinHours(26, 30)), { hours: 26, minutes: 30 }, "prints over a day");
  assert.deepEqual(splitHours(joinHours("", 38)), { hours: 0, minutes: 38 }, "minutes alone is a complete answer");
  assert.equal(joinHours(7, ""), 7, "hours alone is a complete answer");
  assert.equal(joinHours("", ""), "", "both empty is unanswered");
  assert.deepEqual(splitHours(""), { hours: "", minutes: "" });
  assert.deepEqual(splitHours(5.9999999), { hours: 6, minutes: 0 });
  assert.equal(hoursToMinutes(minutesToHours(20)), 20);
  assert.equal(hoursToMinutes(minutesToHours(5)), 5);
  assert.equal(hoursToMinutes(""), "");
  assert.equal(formatDuration(7.75), "7 h 45 min");
  assert.equal(formatDuration(38 / 60), "38 min");
  assert.equal(formatDuration(6), "6 h");
});

test("Try an example fills the page's own worked example and marks it", () => {
  // Assumes USD and untouched example setup values.
  const state = applyExample(parse(""));
  assert.deepEqual(state.exampleFields, ["m", "h", "lh"]);
  assert.deepEqual(quote(state), { price: "17.67", breakEven: "10.89" });
  assert.equal(new URLSearchParams(encodePricingState(state)).get("ex"), "m.h.lh");
  assert.deepEqual(parse(encodePricingState(state)), state, "a shared example link still reads as an example");
  assert.deepEqual(clearExample(state), parse(""));
});

test("an example never overwrites a carried or typed value", () => {
  const carried = applyExample(parse("m=4.5864&c=USD"));
  assert.equal(carried.materialCost, 4.5864);
  assert.deepEqual(carried.exampleFields, ["h", "lh"]);
  assert.equal(quote(carried).price, "24.48");
  // Clearing puts back exactly what was there before.
  assert.deepEqual(clearExample(carried), parse("m=4.5864&c=USD"));
  // Replacing one example field leaves the other still marked.
  const partly = editJobField(carried, "h", 7.75);
  assert.deepEqual(partly.exampleFields, ["lh"]);
  const own = editJobField(partly, "lh", 0.25);
  assert.deepEqual(own.exampleFields, []);
  assert.equal(quote(own).price, "21.13");
});

test("an example mark in a link is ignored once the value no longer matches the sample", () => {
  assert.deepEqual(parse("m=2.5&h=7&lh=0.5&ex=m.h.lh").exampleFields, ["m", "lh"]);
  assert.deepEqual(parse("m=9&h=7&lh=1&ex=m.h.lh").exampleFields, []);
});

test("outside USD the example fills the two times and leaves the material cost empty", () => {
  const blank = parse("c=CAD");
  assert.equal(exampleWouldFill(blank), true);
  const state = applyExample(blank);
  assert.equal(state.materialCost, "", "a US-dollar sample must not be shown as CAD");
  assert.equal(state.printHours, 6);
  assert.equal(state.laborHours, 0.5);
  assert.deepEqual(state.exampleFields, ["h", "lh"]);
  assert.equal(quote(state), null, "no price without the visitor's own material cost");
  assert.equal(exampleWouldFill(state), false, "nothing more the example may fill in CAD");
  assert.deepEqual(clearExample(state), blank);
  // A carried cost in CAD is kept exactly and the times are still offered.
  const carried = applyExample(parse("m=4.5864&c=CAD"));
  assert.equal(carried.materialCost, 4.5864);
  assert.deepEqual(carried.exampleFields, ["h", "lh"]);
  assert.equal(new URLSearchParams(encodePricingState(carried)).get("m"), "4.5864");
});

test("a US-dollar sample amount does not follow a currency switch; the visitor's own number does", () => {
  const example = applyExample(parse(""));
  const switched = changeCurrency(example, "CAD");
  assert.equal(switched.currency, "CAD");
  assert.equal(switched.materialCost, "");
  assert.deepEqual(switched.exampleFields, ["h", "lh"]);
  // Back in USD the sample is offered again, not silently restored.
  const back = changeCurrency(switched, "USD");
  assert.equal(back.materialCost, "");
  assert.equal(exampleWouldFill(back), true);
  assert.deepEqual(applyExample(back), example);
  // An amount the visitor typed is theirs and stays through the switch.
  const own = changeCurrency(editJobField(example, "m", 2.5), "CAD");
  assert.equal(own.materialCost, 2.5);
  // A link that marks a sample amount under another currency is not shown as that currency.
  const link = parse("m=2.5&h=6&lh=0.5&c=EUR&ex=m.h.lh");
  assert.equal(link.materialCost, "");
  assert.deepEqual(link.exampleFields, ["h", "lh"]);
});

test("the complete worked example is a fixed US-dollar link", () => {
  assert.equal(USD_EXAMPLE_QUERY, "m=2.5&e=0.2&h=6&pp=350&pl=5000&f=8&lh=0.5&lr=15&mk=3&c=USD&ex=m.h.lh");
  const state = parse(USD_EXAMPLE_QUERY);
  assert.equal(state.currency, "USD");
  assert.deepEqual(state.exampleFields, ["m", "h", "lh"]);
  assert.deepEqual(quote(state), { price: "17.67", breakEven: "10.89" });
});

test("an unknown currency in a link falls back without touching the amounts", () => {
  const state = parse("m=4.5864&c=XYZ");
  assert.equal(state.currency, "USD");
  assert.equal(state.materialCost, 4.5864);
});

test("a fresh CAD quote with material and times but no CAD rates shows no price", () => {
  // Vela's blocker: this used to price at 24.48 from the untouched US-dollar examples.
  const fresh = parse("m=4.5864&h=6&lh=0.5&c=CAD");
  assert.equal(missingJobField(fresh), null, "the job itself is fully answered");
  assert.equal(fresh.laborRate, "");
  assert.equal(fresh.printerPrice, "");
  assert.equal(fresh.electricityCost, "");
  assert.equal(missingRateField(fresh), "laborRate");
  assert.equal(quote(fresh), null);
  assert.equal(fresh.printerLifetimeHours, 5000, "non-money examples stay");
  // The empty amounts survive a reload as empty.
  assert.deepEqual(parse(encodePricingState(fresh)), fresh);
  // The same job in USD still uses the editable examples.
  assert.equal(quote(parse("m=4.5864&h=6&lh=0.5&c=USD")).price, "24.48");
});

test("CAD rates the visitor enters give a price, and an explicit zero counts", () => {
  const fresh = parse("m=4.5864&h=6&lh=0.5&c=CAD");
  const partly = { ...fresh, laborRate: 20, printerPrice: 500 };
  assert.equal(missingRateField(partly), "electricityCost");
  assert.equal(quote(partly), null, "power is still unanswered");
  const own = { ...partly, electricityCost: 0 };
  assert.equal(missingRateField(own), null);
  assert.equal(quote(own).price, "26.91");
  assert.equal(quote({ ...own, laborRate: 0 }).price, "16.91", "a zero hourly rate is an answer");
  assert.equal(quote({ ...own, printerPrice: 0 }).price, "24.96", "a zero printer price is an answer");
});

test("a full link in another currency keeps every value it spells out", () => {
  const link = parse("m=4.5864&e=0.2&h=6&pp=350&pl=5000&f=8&lh=0.5&lr=15&mk=3&c=CAD");
  assert.equal(quote(link).price, "24.48");
});

test("leaving USD empties untouched example rates; returning to USD brings examples back", () => {
  const usd = parse("m=4.5864&h=6&lh=0.5&c=USD");
  const cad = changeCurrency(usd, "CAD");
  assert.equal(cad.laborRate, "");
  assert.equal(cad.printerPrice, "");
  assert.equal(cad.electricityCost, "");
  assert.equal(cad.materialCost, 4.5864, "the visitor's own material cost follows the currency");
  assert.equal(quote(cad), null);
  assert.deepEqual(changeCurrency(cad, "USD"), usd);
  // Amounts the visitor set are theirs and follow the chosen currency.
  const own = changeCurrency({ ...usd, laborRate: 22, printerPrice: 900, electricityCost: 0 }, "CAD");
  assert.equal(own.laborRate, 22);
  assert.equal(own.printerPrice, 900);
  assert.equal(own.electricityCost, 0);
  assert.notEqual(quote(own), null);
  // Between two non-USD currencies nothing is emptied.
  assert.deepEqual(changeCurrency(own, "EUR"), { ...own, currency: "EUR" });
});
