// Pure logic behind "Remember my settings". No React, no browser APIs, so it
// can be unit-tested directly.
//
// Rules this module enforces:
//   1. A saved amount of money remembers the currency it was typed in and is
//      only ever offered again in that same currency. Nothing is converted.
//   2. Built-in example amounts are never saved as the visitor's own.
//   3. When a saved amount exists only in another currency, the field is left
//      empty (never borrowed, never relabelled) and the page can say why.
//   4. Non-money preferences (currency choice, spool size, printer lifetime,
//      printer model, watts) are shared across currencies as before.
//
// Storage shape, version 2:
//   { prefs: { currency: "USD", printerLifetimeHours: "5000", ... },
//     money: { USD: { printerPrice: "1000" }, CAD: { printerPrice: "1300" } } }
//
// Version 1 was one flat record with bare amounts and a single currency. Its
// amounts carry no trustworthy currency, so they are not read. The old record
// is left in place untouched; only its non-money preferences are carried over.

export const SETTINGS_KEY = "filamentcalcs-settings-v2";
export const LEGACY_SETTINGS_KEY = "filamentcalcs-settings-v1";
export const DEFAULT_CURRENCY = "USD";

/** Saved setting names that hold an amount of money. Keyed by setting name,
 *  because the same query key means different things on different pages. */
export const MONEY_SETTINGS: readonly string[] = [
  "printerPrice",
  "filamentPricePerKg",
  "spoolPrice",
  "pricePerKg",
  "electricityRate",
];

/** Plain-language names for notices. */
export const MONEY_SETTING_LABELS: Record<string, string> = {
  printerPrice: "printer price",
  filamentPricePerKg: "filament price per kg",
  spoolPrice: "spool price",
  pricePerKg: "filament price per kg",
  electricityRate: "electricity rate",
};

export type PreferenceKeys = Record<string, string>; // query key -> setting name

export type SavedSettings = {
  prefs: Record<string, string>;
  money: Record<string, Record<string, string>>;
  /** True while an older record with currency-less amounts has not been acknowledged. */
  legacyAmounts?: boolean;
};

export type Withheld = {
  queryKey: string;
  setting: string;
  label: string;
  /** Currency the saved amount was typed in. */
  currency: string;
  amount: string;
  /** Currency the page is showing. */
  pageCurrency: string;
};

export function isMoneySetting(setting: string): boolean {
  return MONEY_SETTINGS.includes(setting);
}

function stringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).filter(([, v]) => typeof v === "string"),
  ) as Record<string, string>;
}

/** Reads the saved record. `raw` is the version 2 value, `legacyRaw` the version 1 value. */
export function parseSaved(raw: string | null, legacyRaw: string | null): SavedSettings | null {
  if (raw) {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const record = parsed as Record<string, unknown>;
      const money: Record<string, Record<string, string>> = {};
      if (record.money && typeof record.money === "object" && !Array.isArray(record.money)) {
        for (const [currency, bucket] of Object.entries(record.money as Record<string, unknown>)) {
          const amounts = stringRecord(bucket);
          if (Object.keys(amounts).length > 0) money[currency] = amounts;
        }
      }
      return {
        prefs: stringRecord(record.prefs),
        money,
        ...(record.legacyAmounts === true ? { legacyAmounts: true } : {}),
      };
    }
  }
  if (legacyRaw) {
    const legacy = stringRecord(JSON.parse(legacyRaw));
    const prefs: Record<string, string> = {};
    let hadAmounts = false;
    for (const [setting, value] of Object.entries(legacy)) {
      if (isMoneySetting(setting)) hadAmounts = true;
      else prefs[setting] = value;
    }
    return { prefs, money: {}, ...(hadAmounts ? { legacyAmounts: true } : {}) };
  }
  return null;
}

export function serializeSaved(saved: SavedSettings): string {
  return JSON.stringify({
    prefs: saved.prefs,
    money: saved.money,
    ...(saved.legacyAmounts ? { legacyAmounts: true } : {}),
  });
}

function clone(saved: SavedSettings | null): SavedSettings {
  const money: Record<string, Record<string, string>> = {};
  for (const [currency, bucket] of Object.entries(saved?.money ?? {})) money[currency] = { ...bucket };
  return {
    prefs: { ...(saved?.prefs ?? {}) },
    money,
    ...(saved?.legacyAmounts ? { legacyAmounts: true } : {}),
  };
}

/** The query key that carries the currency on this page ("c" or "cur"), if any. */
export function currencyQueryKey(preferenceKeys: PreferenceKeys): string | undefined {
  return Object.entries(preferenceKeys).find(([, setting]) => setting === "currency")?.[0];
}

/** Currency the page shows: the link's, else the saved choice, else the default. */
export function pageCurrency(
  params: URLSearchParams,
  saved: SavedSettings | null,
  preferenceKeys: PreferenceKeys,
): string {
  const key = currencyQueryKey(preferenceKeys);
  return (key && params.get(key)) || saved?.prefs.currency || DEFAULT_CURRENCY;
}

function savedElsewhere(saved: SavedSettings, setting: string, currency: string) {
  for (const [other, bucket] of Object.entries(saved.money)) {
    if (other !== currency && bucket[setting] !== undefined) return { currency: other, amount: bucket[setting] };
  }
  return undefined;
}

/** Fills in saved preferences that the link does not set itself. */
export function applySaved(
  query: string,
  saved: SavedSettings,
  preferenceKeys: PreferenceKeys,
  preferenceGroups: string[][] = [],
): URLSearchParams {
  const params = new URLSearchParams(query);
  const explicit = new URLSearchParams(query);
  const currency = pageCurrency(explicit, saved, preferenceKeys);
  for (const [queryKey, setting] of Object.entries(preferenceKeys)) {
    const explicitGroup = preferenceGroups.some(
      (group) => group.includes(queryKey) && group.some((key) => explicit.has(key)),
    );
    if (explicitGroup || params.has(queryKey)) continue;
    if (isMoneySetting(setting)) {
      const same = saved.money[currency]?.[setting];
      if (same !== undefined) params.set(queryKey, same);
      else if (savedElsewhere(saved, setting, currency)) params.set(queryKey, "");
    } else if (saved.prefs[setting] !== undefined) {
      params.set(queryKey, saved.prefs[setting]);
    }
  }
  return params;
}

/** Amounts left empty on the page because the visitor's saved value is in another currency. */
export function withheldAmounts(
  query: string,
  saved: SavedSettings | null,
  preferenceKeys: PreferenceKeys,
): Withheld[] {
  if (!saved) return [];
  const params = new URLSearchParams(query);
  const currency = pageCurrency(params, saved, preferenceKeys);
  const result: Withheld[] = [];
  for (const [queryKey, setting] of Object.entries(preferenceKeys)) {
    if (!isMoneySetting(setting)) continue;
    const value = params.get(queryKey);
    if (value !== null && value !== "") continue;
    if (saved.money[currency]?.[setting] !== undefined) continue;
    const other = savedElsewhere(saved, setting, currency);
    if (other) {
      result.push({
        queryKey,
        setting,
        label: MONEY_SETTING_LABELS[setting] ?? "amount",
        currency: other.currency,
        amount: other.amount,
        pageCurrency: currency,
      });
    }
  }
  return result;
}

/**
 * Returns the record after the visitor changed something. `defaultsQuery` is
 * the page's own built-in example state; an amount equal to its example is
 * not saved as the visitor's unless explicitly typed. `explicitlyEnteredKeys`
 * also preserves that distinction when Remember is turned on. When `typedKeys`
 * is given, only those amounts
 * are written: an amount that merely arrived in a link, and that the visitor
 * never touched, is not adopted as theirs.
 */
export function updateSaved(
  saved: SavedSettings | null,
  query: string,
  preferenceKeys: PreferenceKeys,
  defaultsQuery = "",
  typedKeys?: ReadonlySet<string>,
  explicitlyEnteredKeys: ReadonlySet<string> | undefined = typedKeys,
): SavedSettings {
  const next = clone(saved);
  const params = new URLSearchParams(query);
  const defaults = new URLSearchParams(defaultsQuery);
  const currency = pageCurrency(params, next, preferenceKeys);
  for (const [queryKey, setting] of Object.entries(preferenceKeys)) {
    const value = params.get(queryKey);
    if (isMoneySetting(setting)) {
      if (typedKeys && !typedKeys.has(queryKey)) continue;
      const bucket = (next.money[currency] ??= {});
      if (value !== null && value !== "" && (explicitlyEnteredKeys?.has(queryKey) || value !== defaults.get(queryKey))) bucket[setting] = value;
      else delete bucket[setting];
      if (Object.keys(bucket).length === 0) delete next.money[currency];
    } else if (value !== null && value !== "") {
      next.prefs[setting] = value;
    } else {
      delete next.prefs[setting];
    }
  }
  return next;
}

/**
 * Adjusts the page when the visitor picks another currency.
 *  - Amounts typed during this visit stay on screen (the visitor is naming
 *    the currency of what they typed).
 *  - Amounts that came from the saved record for the old currency come off
 *    the screen. The new currency's saved amount replaces them, or the field
 *    is left empty.
 *  - Built-in examples and empty fields are left alone.
 * Returns the adjusted query, or `nextQuery` unchanged.
 */
export function switchCurrency(
  prevQuery: string,
  nextQuery: string,
  saved: SavedSettings | null,
  preferenceKeys: PreferenceKeys,
  typedKeys: ReadonlySet<string>,
): string {
  const key = currencyQueryKey(preferenceKeys);
  if (!key || !saved) return nextQuery;
  const prev = new URLSearchParams(prevQuery);
  const next = new URLSearchParams(nextQuery);
  const oldCurrency = prev.get(key) || DEFAULT_CURRENCY;
  const newCurrency = next.get(key) || DEFAULT_CURRENCY;
  if (oldCurrency === newCurrency) return nextQuery;
  let changed = false;
  for (const [queryKey, setting] of Object.entries(preferenceKeys)) {
    if (!isMoneySetting(setting) || typedKeys.has(queryKey)) continue;
    const current = next.get(queryKey);
    const savedNew = saved.money[newCurrency]?.[setting];
    const savedOld = saved.money[oldCurrency]?.[setting];
    if (savedNew !== undefined) {
      if (current !== savedNew) { next.set(queryKey, savedNew); changed = true; }
    } else if (savedOld !== undefined && current === savedOld) {
      next.set(queryKey, "");
      changed = true;
    }
  }
  return changed ? next.toString() : nextQuery;
}

/** Money query keys whose value differs between two states of the page. */
export function changedMoneyKeys(
  prevQuery: string,
  nextQuery: string,
  preferenceKeys: PreferenceKeys,
): string[] {
  const prev = new URLSearchParams(prevQuery);
  const next = new URLSearchParams(nextQuery);
  return Object.entries(preferenceKeys)
    .filter(([queryKey, setting]) => isMoneySetting(setting) && prev.get(queryKey) !== next.get(queryKey))
    .map(([queryKey]) => queryKey);
}

/**
 * Money query keys the visitor typed in this change. A change that also
 * switches the currency is the visitor choosing a currency, not typing an
 * amount: any amount the page empties, restores or swaps at that moment is
 * not theirs and must not be saved or deleted on their behalf.
 */
export function typedMoneyKeys(
  prevQuery: string,
  nextQuery: string,
  preferenceKeys: PreferenceKeys,
): string[] {
  const key = currencyQueryKey(preferenceKeys);
  if (key && new URLSearchParams(prevQuery).get(key) !== new URLSearchParams(nextQuery).get(key)) return [];
  return changedMoneyKeys(prevQuery, nextQuery, preferenceKeys);
}

/**
 * When the visitor typed an amount and then chose a different currency in the
 * same visit, the amount belongs to the currency they chose. This puts the
 * old currency's saved amount back to what it was before the visit began.
 */
export function revertTypedAmounts(
  saved: SavedSettings,
  baseline: SavedSettings | null,
  typedSettings: readonly string[],
  currency: string,
): SavedSettings {
  const next = clone(saved);
  for (const setting of typedSettings) {
    const before = baseline?.money[currency]?.[setting];
    if (before !== undefined) (next.money[currency] ??= {})[setting] = before;
    else if (next.money[currency]) delete next.money[currency][setting];
  }
  if (next.money[currency] && Object.keys(next.money[currency]).length === 0) delete next.money[currency];
  return next;
}
