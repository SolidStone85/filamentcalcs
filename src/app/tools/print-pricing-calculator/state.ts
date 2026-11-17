import type { CurrencyCode } from "@/lib/currency";

// URL state for the Print Pricing calculator. Pure; no React.
// Keys are unchanged from earlier versions so shared links keep working:
//   m = material cost, e = electricity cost, h = print hours (decimal),
//   pp = printer price, pl = printer lifetime hours, f = failure %,
//   lh = hands-on hours (decimal), lr = hourly rate, mk = markup, c = currency
// One optional key was added:
//   ex = job fields still holding the "Try an example" sample, e.g. "m.h.lh"

export type ExampleField = "m" | "h" | "lh";

export type PricingState = {
  materialCost: number | "";
  electricityCost: number | "";
  printHours: number | "";
  printerPrice: number | "";
  printerLifetimeHours: number | "";
  failureRatePercent: number; // 0..99
  laborHours: number | "";
  laborRate: number | "";
  markup: number; // 1..6
  currency: CurrencyCode;
  exampleFields: ExampleField[];
};

// The three facts about a job start empty: a real quote needs real numbers.
// The setup values start as editable examples, in US dollars only. In any
// other currency the three setup amounts start empty (see RATE_FIELDS).
export const DEFAULT_PRICING_STATE: PricingState = {
  materialCost: "",
  electricityCost: 0.2,
  printHours: "",
  printerPrice: 350,
  printerLifetimeHours: 5000,
  failureRatePercent: 8,
  laborHours: "",
  laborRate: 15,
  markup: 3,
  currency: "USD",
  exampleFields: [],
};

/** The page's published worked example: $2.50 of filament, 6 hours, 30 minutes hands-on. */
export const EXAMPLE_JOB: Record<ExampleField, number> = { m: 2.5, h: 6, lh: 0.5 };

/** The sample amount is a US-dollar figure, so it is only ever used in USD.
 *  In any other currency the example fills the two times and leaves money empty. */
export const EXAMPLE_CURRENCY: CurrencyCode = "USD";

const JOB_FIELD: Record<ExampleField, "materialCost" | "printHours" | "laborHours"> = {
  m: "materialCost",
  h: "printHours",
  lh: "laborHours",
};
const EXAMPLE_ORDER: ExampleField[] = ["m", "h", "lh"];

export function parsePricingState(params: URLSearchParams, allowedCurrencies: readonly string[]): PricingState {
  const toNumOrEmpty = (s: string | null, fallback: number | ""): number | "" => {
    if (s === null) return fallback;
    if (s === "") return "";
    const n = Number(s);
    return Number.isFinite(n) ? n : "";
  };
  const toNumber = (s: string | null, fallback: number): number => {
    if (s === null) return fallback;
    const n = Number(s);
    return Number.isFinite(n) && s !== "" ? n : -1;
  };
  const c = params.get("c");
  const currency = (c && allowedCurrencies.includes(c) ? c : DEFAULT_PRICING_STATE.currency) as CurrencyCode;
  // A US-dollar example amount is never the starting value of a quote in another currency.
  const example = (value: number | ""): number | "" => (currency === EXAMPLE_CURRENCY ? value : "");
  const state: PricingState = {
    materialCost: toNumOrEmpty(params.get("m"), DEFAULT_PRICING_STATE.materialCost),
    electricityCost: toNumOrEmpty(params.get("e"), example(DEFAULT_PRICING_STATE.electricityCost)),
    printHours: toNumOrEmpty(params.get("h"), DEFAULT_PRICING_STATE.printHours),
    printerPrice: toNumOrEmpty(params.get("pp"), example(DEFAULT_PRICING_STATE.printerPrice)),
    printerLifetimeHours: toNumOrEmpty(params.get("pl"), DEFAULT_PRICING_STATE.printerLifetimeHours),
    failureRatePercent: toNumber(params.get("f"), DEFAULT_PRICING_STATE.failureRatePercent),
    laborHours: toNumOrEmpty(params.get("lh"), DEFAULT_PRICING_STATE.laborHours),
    laborRate: toNumOrEmpty(params.get("lr"), example(DEFAULT_PRICING_STATE.laborRate)),
    markup: toNumber(params.get("mk"), DEFAULT_PRICING_STATE.markup),
    currency,
    exampleFields: [],
  };
  // A field counts as an example only while it still holds the sample value.
  const marked = (params.get("ex") ?? "").split(".");
  state.exampleFields = EXAMPLE_ORDER.filter(
    (field) => marked.includes(field) && state[JOB_FIELD[field]] === EXAMPLE_JOB[field],
  );
  return dropForeignSample(state);
}

export function encodePricingState(state: PricingState): string {
  const p = new URLSearchParams();
  p.set("m", String(state.materialCost));
  p.set("e", String(state.electricityCost));
  p.set("h", String(state.printHours));
  p.set("pp", String(state.printerPrice));
  p.set("pl", String(state.printerLifetimeHours));
  p.set("f", String(state.failureRatePercent));
  p.set("lh", String(state.laborHours));
  p.set("lr", String(state.laborRate));
  p.set("mk", String(state.markup));
  p.set("c", state.currency);
  if (state.exampleFields.length > 0) p.set("ex", state.exampleFields.join("."));
  return p.toString();
}

const exampleFills = (state: PricingState, field: ExampleField) =>
  state[JOB_FIELD[field]] === "" && (field !== "m" || state.currency === EXAMPLE_CURRENCY);

/** True when "Try an example" would fill at least one empty job field. */
export function exampleWouldFill(state: PricingState): boolean {
  return EXAMPLE_ORDER.some((field) => exampleFills(state, field));
}

/** A US-dollar sample amount never stays on a page showing another currency. */
function dropForeignSample(state: PricingState): PricingState {
  if (state.currency === EXAMPLE_CURRENCY || !state.exampleFields.includes("m")) return state;
  return { ...state, materialCost: "", exampleFields: state.exampleFields.filter((field) => field !== "m") };
}

/** The three setup amounts that are money. Their built-in examples are US-dollar figures. */
export const RATE_FIELDS = ["laborRate", "printerPrice", "electricityCost"] as const;
export type RateField = (typeof RATE_FIELDS)[number];

/**
 * The visitor picks a currency. Their own numbers stay and follow it.
 *  - Leaving USD: a setup amount still equal to its US-dollar example is
 *    emptied, so it cannot be priced as the new currency.
 *  - Returning to USD: an empty setup amount gets its example back.
 */
export function changeCurrency(state: PricingState, currency: CurrencyCode): PricingState {
  const next = dropForeignSample({ ...state, currency });
  const leaving = state.currency === EXAMPLE_CURRENCY && currency !== EXAMPLE_CURRENCY;
  const returning = state.currency !== EXAMPLE_CURRENCY && currency === EXAMPLE_CURRENCY;
  for (const field of RATE_FIELDS) {
    if (leaving && next[field] === DEFAULT_PRICING_STATE[field]) next[field] = "";
    if (returning && next[field] === "") next[field] = DEFAULT_PRICING_STATE[field];
  }
  return next;
}

/** First setup amount still unanswered. 0 is an answer; an empty field is not. */
export function missingRateField(state: PricingState): RateField | null {
  return RATE_FIELDS.find((field) => !answered(state[field])) ?? null;
}

/** Fills only the job fields that are empty. Never overwrites a carried or typed value.
 *  Outside USD it fills the two times only and leaves the material cost empty. */
export function applyExample(state: PricingState): PricingState {
  const next = { ...state, exampleFields: [...state.exampleFields] };
  for (const field of EXAMPLE_ORDER) {
    if (exampleFills(next, field)) {
      next[JOB_FIELD[field]] = EXAMPLE_JOB[field];
      if (!next.exampleFields.includes(field)) next.exampleFields.push(field);
    }
  }
  next.exampleFields = EXAMPLE_ORDER.filter((field) => next.exampleFields.includes(field));
  return next;
}

/** Empties only the fields the example filled. */
export function clearExample(state: PricingState): PricingState {
  const next = { ...state, exampleFields: [] as ExampleField[] };
  for (const field of state.exampleFields) next[JOB_FIELD[field]] = "";
  return next;
}

/** The visitor's own entry: the field stops being an example. */
export function editJobField(state: PricingState, field: ExampleField, value: number | ""): PricingState {
  return {
    ...state,
    [JOB_FIELD[field]]: value,
    exampleFields: state.exampleFields.filter((entry) => entry !== field),
  };
}

const answered = (value: number | "") => value !== "" && Number.isFinite(value) && value >= 0;

/** First job detail still unanswered. 0 is an answer; an empty field is not. */
export function missingJobField(state: PricingState): ExampleField | null {
  if (!answered(state.materialCost)) return "m";
  if (!answered(state.printHours)) return "h";
  if (!answered(state.laborHours)) return "lh";
  return null;
}

/** The complete worked example, every value spelled out, always in US dollars.
 *  Nothing saved on the device can change it. */
export const USD_EXAMPLE_QUERY = encodePricingState(applyExample(DEFAULT_PRICING_STATE));
