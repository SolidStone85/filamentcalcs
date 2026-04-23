// Electricity rate presets. Values are rough regional averages in local
// currency per kWh. Users should override with their actual utility rate
// for accuracy. Updated April 2026 based on EIA and Eurostat aggregates.

export type ElectricityRatePreset = {
  id: string;
  label: string;
  ratePerKwh: number;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD";
};

export const ELECTRICITY_RATE_PRESETS: ElectricityRatePreset[] = [
  {
    id: "us-avg",
    label: "US national average",
    ratePerKwh: 0.18,
    currency: "USD",
  },
  {
    id: "us-expensive",
    label: "US expensive (CA, HI, MA, NY)",
    ratePerKwh: 0.35,
    currency: "USD",
  },
  {
    id: "us-cheap",
    label: "US cheap (LA, ND, WA)",
    ratePerKwh: 0.12,
    currency: "USD",
  },
  {
    id: "canada-avg",
    label: "Canada average",
    ratePerKwh: 0.17,
    currency: "CAD",
  },
  {
    id: "eu-avg",
    label: "EU average",
    ratePerKwh: 0.27,
    currency: "EUR",
  },
  {
    id: "uk-avg",
    label: "UK average",
    ratePerKwh: 0.27,
    currency: "GBP",
  },
  {
    id: "australia-avg",
    label: "Australia average",
    ratePerKwh: 0.32,
    currency: "AUD",
  },
  {
    id: "custom",
    label: "Custom rate",
    ratePerKwh: 0.18,
    currency: "USD",
  },
];

export function getElectricityRatePreset(
  id: string,
): ElectricityRatePreset | undefined {
  return ELECTRICITY_RATE_PRESETS.find((r) => r.id === id);
}
