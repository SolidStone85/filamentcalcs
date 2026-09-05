"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const STORAGE_KEY = "filamentcalcs-settings-v1";
type Preferences = Record<string, string>;

function readSettings(): Preferences | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  return Object.fromEntries(Object.entries(parsed).filter(([, value]) => typeof value === "string"));
}

function saveSettings(query: string, preferenceKeys: Record<string, string>) {
  const saved = readSettings() ?? {};
  const params = new URLSearchParams(query);
  for (const [queryKey, settingKey] of Object.entries(preferenceKeys)) {
    const value = params.get(queryKey);
    if (value !== null && value !== "") saved[settingKey] = value;
    else delete saved[settingKey];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

function withSavedSettings(
  query: string,
  saved: Preferences,
  preferenceKeys: Record<string, string>,
  preferenceGroups: string[][],
) {
  const params = new URLSearchParams(query);
  const explicitParams = new URLSearchParams(query);
  for (const [queryKey, settingKey] of Object.entries(preferenceKeys)) {
    const explicitGroup = preferenceGroups.some((group) => group.includes(queryKey) && group.some((key) => explicitParams.has(key)));
    if (!explicitGroup && !params.has(queryKey) && saved[settingKey] !== undefined) params.set(queryKey, saved[settingKey]);
  }
  return params;
}

/** Only the named preference fields are stored; individual jobs stay in the URL. */
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
  const [state, setState] = useState(() => parse(new URLSearchParams(initialParams.current)));
  const [ready, setReady] = useState(false);
  const [remember, setRemember] = useState(false);
  const [storageError, setStorageError] = useState("");
  const config = useRef({ parse, encode, preferenceKeys, preferenceGroups });
  config.current = { parse, encode, preferenceKeys, preferenceGroups };
  const observedUrl = useRef(navigationUrl);
  const lastWrittenUrl = useRef<string | null>(null);

  useEffect(() => {
    try {
      const saved = readSettings();
      if (saved) {
        const params = withSavedSettings(initialParams.current, saved, config.current.preferenceKeys, config.current.preferenceGroups);
        setState(config.current.parse(params));
        setRemember(true);
      }
    } catch {
      setStorageError("Saved settings are unavailable in this browser.");
    }
    setReady(true);
  }, []);

  // Same-route links and back/forward can retain this mounted component.
  // Re-read real navigations, while ignoring our own history replacements.
  useEffect(() => {
    if (!ready || navigationUrl === observedUrl.current) return;
    observedUrl.current = navigationUrl;
    if (navigationUrl === lastWrittenUrl.current) return;
    let params = new URLSearchParams(urlQuery);
    try {
      const saved = remember ? readSettings() ?? {} : {};
      params = withSavedSettings(urlQuery, saved, config.current.preferenceKeys, config.current.preferenceGroups);
    } catch {
      setStorageError("Saved settings are unavailable in this browser.");
    }
    setState(config.current.parse(params));
  }, [navigationUrl, urlQuery, ready, remember]);

  useEffect(() => {
    if (!ready) return;
    const query = config.current.encode(state);
    lastWrittenUrl.current = `${window.location.pathname}?${query}`;
    if (window.location.search.slice(1) !== query) {
      window.history.replaceState(null, "", `${window.location.pathname}?${query}${window.location.hash}`);
    }
    if (!remember) return;
    try {
      saveSettings(query, config.current.preferenceKeys);
    } catch {
      setStorageError("Settings could not be saved. This calculation still works.");
    }
  }, [state, ready, remember]);

  function clearSaved() {
    setRemember(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
      setStorageError("");
    } catch {
      setStorageError("This browser could not clear its saved settings.");
    }
  }

  return {
    state,
    setState,
    settings: {
      remember,
      onRememberChange: (enabled: boolean) => {
        if (!enabled) return clearSaved();
        try {
          saveSettings(config.current.encode(state), config.current.preferenceKeys);
          setRemember(true);
          setStorageError("");
        } catch {
          setStorageError("Settings could not be saved. This calculation still works.");
        }
      },
      onClear: clearSaved,
      onReset: () => {
        try {
          const saved = remember ? readSettings() ?? {} : {};
          const params = withSavedSettings("", saved, config.current.preferenceKeys, config.current.preferenceGroups);
          setState(config.current.parse(params));
        } catch {
          setStorageError("Saved settings could not be read. Clear saved settings before resetting.");
        }
      },
      error: storageError,
    },
  };
}
