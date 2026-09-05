import type { CurrencyCode } from "@/lib/currency";

export type AmsState = {
  mode: "slicer" | "estimate";
  unit: "g" | "mm3";
  modelGrams: number | "";
  supportGrams: number | "";
  flushingGrams: number | "";
  towerGrams: number | "";
  extraGrams: number | "";
  colorSwaps: number | "";
  purgePerSwap: number | "";
  density: number | "";
  multiplier: number | "";
  pricePerKg: number | "";
  currency: CurrencyCode;
  legacyEstimate: boolean;
};

export const DEFAULT_AMS_STATE: AmsState = {
  mode: "slicer", unit: "g", modelGrams: "", supportGrams: 0,
  flushingGrams: "", towerGrams: 0, extraGrams: 0, colorSwaps: "",
  purgePerSwap: "", density: 1.24, multiplier: 1, pricePerKg: 20,
  currency: "USD", legacyEstimate: false,
};

const NUMBER_PARAMS = {
  modelGrams: "g", supportGrams: "support", flushingGrams: "flush",
  towerGrams: "tower", extraGrams: "extra", colorSwaps: "s",
  purgePerSwap: "pg", density: "density", multiplier: "mult", pricePerKg: "pp",
} as const;

export function parseAmsState(params: URLSearchParams, currencies: readonly string[]): AmsState {
  const legacyEstimate = params.get("legacy") === "1" ||
    (!params.has("mode") && ["p", "s", "pg"].some((key) => params.has(key)));
  const state = { ...DEFAULT_AMS_STATE, legacyEstimate };
  state.mode = legacyEstimate || params.get("mode") === "estimate" ? "estimate" : "slicer";
  state.unit = params.get("unit") === "mm3" ? "mm3" : "g";
  for (const [field, key] of Object.entries(NUMBER_PARAMS)) {
    const raw = params.get(key);
    if (raw !== null) {
      const number = Number(raw);
      state[field as keyof typeof NUMBER_PARAMS] = raw.trim() !== "" && Number.isFinite(number) ? number : "";
    }
  }
  // Historical links without pg used the old calculator's 8 g fallback.
  // Retain that number only in explicitly labeled legacy estimates.
  if (legacyEstimate && !params.has("pg")) state.purgePerSwap = 8;
  const currency = params.get("c");
  if (currency && currencies.includes(currency)) state.currency = currency as CurrencyCode;
  return state;
}

export function encodeAmsState(state: AmsState): string {
  const params = new URLSearchParams({ mode: state.mode, unit: state.unit, c: state.currency });
  for (const [field, key] of Object.entries(NUMBER_PARAMS)) {
    const value = state[field as keyof typeof NUMBER_PARAMS];
    // Explicit blanks must not turn into default values on reload.
    params.set(key, String(value));
  }
  if (state.legacyEstimate) params.set("legacy", "1");
  return params.toString();
}

export function getAmsInputStatus(state: AmsState) {
  const isAmount = (value: number | "") => typeof value === "number" && Number.isFinite(value) && value >= 0;
  const estimate = state.mode === "estimate";
  const common = [state.modelGrams, state.supportGrams, state.towerGrams, state.extraGrams, state.pricePerKg];
  const modeInputs = estimate
    ? [state.colorSwaps, state.purgePerSwap, state.multiplier, ...(state.unit === "mm3" ? [state.density] : [])]
    : [state.flushingGrams];
  const allInputs = [...common, ...modeInputs];
  const hasInvalidInput = allInputs.some((v) => v !== "" && !isAmount(v)) ||
    (estimate && state.colorSwaps !== "" && !Number.isInteger(state.colorSwaps)) ||
    (estimate && state.unit === "mm3" && state.density === 0);
  return { ready: !hasInvalidInput && allInputs.every(isAmount), hasInvalidInput };
}
