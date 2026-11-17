"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type SetStateAction } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import {
  LEGACY_SETTINGS_KEY,
  SETTINGS_KEY,
  applySaved,
  pageCurrency,
  parseSaved,
  revertTypedAmounts,
  serializeSaved,
  switchCurrency,
  typedMoneyKeys,
  updateSaved,
  withheldAmounts,
  type SavedSettings,
} from "./savedSettings";

function readSaved(): SavedSettings | null {
  return parseSaved(localStorage.getItem(SETTINGS_KEY), localStorage.getItem(LEGACY_SETTINGS_KEY));
}

function writeSaved(saved: SavedSettings) {
  localStorage.setItem(SETTINGS_KEY, serializeSaved(saved));
}

/**
 * Only the named preference fields are stored; individual jobs stay in the URL.
 *
 * Saved amounts of money are kept per currency and never converted or
 * relabelled (see savedSettings.ts). Opening a page or a link never changes
 * what is saved; only the visitor's own edits do.
 */
export function useCalculatorState<T>(
  parse: (params: URLSearchParams) => T,
  encode: (state: T) => string,
  preferenceKeys: Record<string, string>,
  preferenceGroups: string[][] = [],
) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const urlQuery = searchParams.toString();
  const navigationUrl = `${pathname}?${urlQuery}`;
  const initialParams = useRef(searchParams.toString());
  const [state, setStateRaw] = useState(() => parse(new URLSearchParams(initialParams.current)));
  const [ready, setReady] = useState(false);
  const [remember, setRemember] = useState(false);
  const [saved, setSavedState] = useState<SavedSettings | null>(null);
  const [storageError, setStorageError] = useState("");
  const config = useRef({ parse, encode, preferenceKeys, preferenceGroups });
  config.current = { parse, encode, preferenceKeys, preferenceGroups };
  const observedUrl = useRef(navigationUrl);
  const lastWrittenUrl = useRef<string | null>(null);

  // Mirrors for use inside state updaters and effects.
  const savedRef = useRef<SavedSettings | null>(null);
  const rememberRef = useRef(false);
  rememberRef.current = remember;
  /** Saved record as it stood when this visit's state was loaded. */
  const baseline = useRef<SavedSettings | null>(null);
  /** Money fields the visitor changed during this visit. */
  const typedKeys = useRef(new Set<string>());
  /** False until the visitor changes something; loading never saves. */
  const userEdited = useRef(false);
  const lastCurrency = useRef<string | null>(null);
  const defaultsQuery = useRef<string | null>(null);

  function setSaved(next: SavedSettings | null) {
    savedRef.current = next;
    setSavedState(next);
  }

  function getDefaultsQuery() {
    if (defaultsQuery.current === null) {
      defaultsQuery.current = config.current.encode(config.current.parse(new URLSearchParams("")));
    }
    return defaultsQuery.current;
  }

  /** Loads page state from a link plus the saved record. Never writes. */
  function load(query: string, savedNow: SavedSettings | null) {
    const { parse: parseNow, encode: encodeNow, preferenceKeys: keys, preferenceGroups: groups } = config.current;
    const params = savedNow ? applySaved(query, savedNow, keys, groups) : new URLSearchParams(query);
    const next = parseNow(params);
    typedKeys.current = new Set();
    userEdited.current = false;
    baseline.current = savedNow;
    lastCurrency.current = pageCurrency(new URLSearchParams(encodeNow(next)), savedNow, keys);
    setStateRaw(next);
  }

  useEffect(() => {
    try {
      const savedNow = readSaved();
      if (savedNow) {
        setSaved(savedNow);
        setRemember(true);
        load(initialParams.current, savedNow);
      } else {
        lastCurrency.current = pageCurrency(
          new URLSearchParams(config.current.encode(config.current.parse(new URLSearchParams(initialParams.current)))),
          null,
          config.current.preferenceKeys,
        );
      }
    } catch {
      setStorageError("Saved settings are unavailable in this browser.");
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Same-route links and back/forward can retain this mounted component.
  // Re-read real navigations, while ignoring our own history replacements.
  useEffect(() => {
    if (!ready || navigationUrl === observedUrl.current) return;
    observedUrl.current = navigationUrl;
    if (navigationUrl === lastWrittenUrl.current) return;
    let savedNow: SavedSettings | null = null;
    try {
      savedNow = remember ? readSaved() : null;
      if (remember) setSaved(savedNow);
    } catch {
      setStorageError("Saved settings are unavailable in this browser.");
    }
    load(urlQuery, savedNow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationUrl, urlQuery, ready, remember]);

  useEffect(() => {
    if (!ready) return;
    const { encode: encodeNow, preferenceKeys: keys } = config.current;
    const query = encodeNow(state);
    lastWrittenUrl.current = `${window.location.pathname}?${query}`;
    if (window.location.search.slice(1) !== query) {
      window.history.replaceState(null, "", `${window.location.pathname}?${query}${window.location.hash}`);
    }
    // Only the visitor's own changes are saved. Loading a page or link is not one.
    if (!remember || !userEdited.current) return;
    try {
      let next = savedRef.current;
      const currency = pageCurrency(new URLSearchParams(query), next, keys);
      if (next && lastCurrency.current && lastCurrency.current !== currency && typedKeys.current.size > 0) {
        next = revertTypedAmounts(
          next,
          baseline.current,
          [...typedKeys.current].map((key) => keys[key]).filter(Boolean),
          lastCurrency.current,
        );
      }
      next = updateSaved(next, query, keys, getDefaultsQuery(), typedKeys.current);
      writeSaved(next);
      setSaved(next);
      lastCurrency.current = currency;
    } catch {
      setStorageError("Settings could not be saved. This calculation still works.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, ready, remember]);

  /** State setter for the visitor's own changes. */
  const setState = useCallback((update: SetStateAction<T>) => {
    userEdited.current = true;
    setStateRaw((prev) => {
      const next = typeof update === "function" ? (update as (value: T) => T)(prev) : update;
      const { parse: parseNow, encode: encodeNow, preferenceKeys: keys } = config.current;
      const prevQuery = encodeNow(prev);
      const nextQuery = encodeNow(next);
      for (const key of typedMoneyKeys(prevQuery, nextQuery, keys)) typedKeys.current.add(key);
      const adjusted = switchCurrency(
        prevQuery,
        nextQuery,
        rememberRef.current ? savedRef.current : null,
        keys,
        typedKeys.current,
      );
      return adjusted === nextQuery ? next : parseNow(new URLSearchParams(adjusted));
    });
  }, []);

  function clearSaved() {
    setRemember(false);
    try {
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem(LEGACY_SETTINGS_KEY);
      setSaved(null);
      baseline.current = null;
      setStorageError("");
    } catch {
      setStorageError("This browser could not clear its saved settings.");
    }
  }

  const withheld = useMemo(
    () => (remember ? withheldAmounts(config.current.encode(state), saved, config.current.preferenceKeys) : []),
    [state, saved, remember],
  );

  return {
    state,
    setState,
    settings: {
      remember,
      onRememberChange: (enabled: boolean) => {
        if (!enabled) return clearSaved();
        try {
          const { encode: encodeNow, preferenceKeys: keys } = config.current;
          const query = encodeNow(state);
          const next = updateSaved(savedRef.current, query, keys, getDefaultsQuery(), undefined, typedKeys.current);
          writeSaved(next);
          setSaved(next);
          lastCurrency.current = pageCurrency(new URLSearchParams(query), next, keys);
          setRemember(true);
          setStorageError("");
        } catch {
          setStorageError("Settings could not be saved. This calculation still works.");
        }
      },
      onClear: clearSaved,
      onReset: () => {
        try {
          const savedNow = remember ? readSaved() : null;
          if (remember) setSaved(savedNow);
          load("", savedNow);
        } catch {
          setStorageError("Saved settings could not be read. Clear saved settings before resetting.");
        }
      },
      error: storageError,
      /** Saved amounts not used here because they are in another currency. */
      withheld,
      /** An older saved record held amounts with no recorded currency. */
      legacyAmounts: remember && saved?.legacyAmounts === true,
      onDismissLegacy: () => {
        try {
          if (!savedRef.current) return;
          const next: SavedSettings = { prefs: savedRef.current.prefs, money: savedRef.current.money };
          writeSaved(next);
          setSaved(next);
        } catch {
          setStorageError("Settings could not be saved. This calculation still works.");
        }
      },
    },
  };
}
