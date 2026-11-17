import { CURRENCIES, formatCurrency, type CurrencyCode } from "./currency";
import type { Withheld } from "./savedSettings";

/** One plain sentence explaining why a saved amount was left out of a field. */
export function savedAmountNotice(withheld: readonly Withheld[], queryKey: string): string | undefined {
  const item = withheld.find((entry) => entry.queryKey === queryKey);
  if (!item) return undefined;
  const amount = Number(item.amount);
  const known = CURRENCIES.some((currency) => currency.code === item.currency);
  const shown = known && Number.isFinite(amount) ? formatCurrency(amount, item.currency as CurrencyCode) : item.amount;
  return `Your saved ${item.label} is ${shown} in ${item.currency}, so it is not used here in ${item.pageCurrency}. Nothing is converted. Enter it in ${item.pageCurrency}.`;
}
