import type { CurrencyCode } from "./currency";
import type { ElectricityRatePreset } from "./presets/electricityRates";
import type { MaterialPreset } from "./presets/materials";

export type ElectricityRateState = {
  rateId: string;
  customRate: number | "";
  currency: CurrencyCode;
};

type CurrencyOption = { code: CurrencyCode };
type ElectricityRateOption = Pick<ElectricityRatePreset, "id" | "currency">;

function isCurrencyCode(
  value: string | null,
  currencies: readonly CurrencyOption[],
): value is CurrencyCode {
  return value !== null && currencies.some((currency) => currency.code === value);
}

function toFiniteNumberOrEmpty(value: string | null): number | "" {
  if (value === null || value.trim() === "") return "";
  const number = Number(value);
  return Number.isFinite(number) ? number : "";
}

export function parseElectricityRateState(
  params: URLSearchParams,
  defaults: ElectricityRateState,
  ratePresets: readonly ElectricityRateOption[],
  currencies: readonly CurrencyOption[],
): ElectricityRateState {
  const requestedRateId = params.get("r");
  const rateId = requestedRateId && ratePresets.some((rate) => rate.id === requestedRateId)
    ? requestedRateId
    : defaults.rateId;
  const preset = ratePresets.find((rate) => rate.id === rateId);
  const requestedCurrency = params.get("c");
  const currency = isCurrencyCode(requestedCurrency, currencies)
    ? requestedCurrency
    : preset?.currency ?? defaults.currency;
  const requestedCustomRate = params.get("rt");
  const customRate = requestedCustomRate === null
    ? defaults.customRate
    : toFiniteNumberOrEmpty(requestedCustomRate);

  if (rateId === "custom") {
    return {
      rateId,
      currency,
      customRate: requestedCustomRate === null ? "" : customRate,
    };
  }

  if (preset && currency !== preset.currency) {
    return {
      rateId: "custom",
      currency,
      customRate: requestedCustomRate === null ? "" : customRate,
    };
  }

  return { rateId, customRate, currency };
}

export function changeElectricityCurrency<T extends ElectricityRateState>(
  state: T,
  currency: CurrencyCode,
): T {
  if (state.currency === currency) return state;
  if (state.rateId === "custom") return { ...state, currency } as T;
  return { ...state, rateId: "custom", customRate: "", currency } as T;
}

export function chooseElectricityRate<T extends ElectricityRateState>(
  state: T,
  rateId: string,
  ratePresets: readonly ElectricityRateOption[],
): T {
  if (rateId === "custom") {
    return state.rateId === "custom"
      ? state
      : { ...state, rateId: "custom", customRate: "" } as T;
  }

  const preset = ratePresets.find((rate) => rate.id === rateId);
  return preset ? { ...state, rateId: preset.id, currency: preset.currency } as T : state;
}

type FilamentPriceState = {
  currency: CurrencyCode;
  materialId: MaterialPreset["id"];
  pricePerKg: number | "";
  priceMode: "spool" | "kg";
  wasteFactor: number;
};

export function applyMaterialPreset<T extends FilamentPriceState>(
  state: T,
  materialId: MaterialPreset["id"],
  preset: MaterialPreset | undefined,
): T {
  if (!preset) return state;
  if (materialId === "custom") return { ...state, materialId };

  return {
    ...state,
    materialId,
    pricePerKg: preset.pricePerKg,
    priceMode: "kg",
    wasteFactor: preset.wasteFactor,
    currency: "USD",
  };
}
