// Currency support. Price inputs are in the chosen currency and don't
// get converted between currencies. User types a USD number, they get
// a USD answer. This is deliberate: FX rates drift daily and nobody
// trusts a calculator that silently changes their numbers.

export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "CAD"
  | "AUD"
  | "NZD"
  | "JPY"
  | "INR";

export const CURRENCIES: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "NZD", symbol: "NZ$", label: "New Zealand Dollar" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
];

export function formatCurrency(
  amount: number,
  code: CurrencyCode,
  options: Intl.NumberFormatOptions = {},
): string {
  const locale =
    code === "EUR"
      ? "en-IE"
      : code === "GBP"
        ? "en-GB"
        : code === "INR"
          ? "en-IN"
          : "en-US";
  // Yen has no minor unit; forcing two decimals would look wrong (¥25.00).
  const fractionDigits = code === "JPY" ? 0 : 2;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
    ...options,
  }).format(amount);
}
