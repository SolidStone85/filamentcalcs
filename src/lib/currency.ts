// Currency support. Price inputs are in the chosen currency and don't
// get converted between currencies. User types a USD number, they get
// a USD answer. This is deliberate: FX rates drift daily and nobody
// trusts a calculator that silently changes their numbers.

export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "AUD";

export const CURRENCIES: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
];

export function formatCurrency(
  amount: number,
  code: CurrencyCode,
  options: Intl.NumberFormatOptions = {},
): string {
  const locale = code === "EUR" ? "en-IE" : code === "GBP" ? "en-GB" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}
