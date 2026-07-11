"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { FormulaBreakdown } from "@/components/shared/FormulaBreakdown";
import { InputWithUnit } from "@/components/shared/InputWithUnit";
import { ResultDisplay } from "@/components/shared/ResultDisplay";
import { ShareButton } from "@/components/shared/ShareButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CURRENCIES, formatCurrency, type CurrencyCode } from "@/lib/currency";
import { calculateFilamentCost } from "@/lib/formulas/filamentCost";
import {
  MATERIAL_PRESETS,
  getMaterialPreset,
  type MaterialPreset,
} from "@/lib/presets/materials";

// --- URL state helpers ---------------------------------------------------
// State lives in query params so results are shareable. Keys kept short:
//   g = grams, p = price per kg, w = waste (decimal), c = currency, m = material preset

type State = {
  grams: number | "";
  pricePerKg: number | "";
  wasteFactor: number; // 0..0.25
  currency: CurrencyCode;
  materialId: MaterialPreset["id"];
};

const DEFAULT_STATE: State = {
  grams: "",
  pricePerKg: 20,
  wasteFactor: 0.05,
  currency: "USD",
  materialId: "pla",
};

function parseStateFromParams(params: URLSearchParams): State {
  const g = params.get("g");
  const p = params.get("p");
  const w = params.get("w");
  const c = params.get("c") as CurrencyCode | null;
  const m = params.get("m") as MaterialPreset["id"] | null;

  const toNumOrEmpty = (s: string | null): number | "" => {
    if (s === null || s === "") return "";
    const n = Number(s);
    return Number.isFinite(n) ? n : "";
  };

  return {
    grams: toNumOrEmpty(g),
    pricePerKg: p === null ? DEFAULT_STATE.pricePerKg : toNumOrEmpty(p),
    wasteFactor:
      w === null || Number.isNaN(Number(w))
        ? DEFAULT_STATE.wasteFactor
        : Math.min(0.25, Math.max(0, Number(w))),
    currency:
      c && CURRENCIES.some((x) => x.code === c) ? c : DEFAULT_STATE.currency,
    materialId:
      m && MATERIAL_PRESETS.some((x) => x.id === m)
        ? m
        : DEFAULT_STATE.materialId,
  };
}

function encodeState(state: State): string {
  const p = new URLSearchParams();
  if (state.grams !== "") p.set("g", String(state.grams));
  if (state.pricePerKg !== "") p.set("p", String(state.pricePerKg));
  p.set("w", state.wasteFactor.toFixed(3));
  p.set("c", state.currency);
  p.set("m", state.materialId);
  return p.toString();
}

// -----------------------------------------------------------------------

const MATERIAL_ITEMS = MATERIAL_PRESETS.map((m) => ({
  value: m.id,
  label: m.label,
}));

const CURRENCY_ITEMS = CURRENCIES.map((c) => ({
  value: c.code,
  label: `${c.symbol} ${c.code}`,
}));

export function Calculator() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [state, setState] = useState<State>(() =>
    parseStateFromParams(new URLSearchParams(searchParams.toString())),
  );

  // Push state to URL (replace, not push; don't spam history).
  useEffect(() => {
    const query = encodeState(state);
    router.replace(`?${query}`, { scroll: false });
    // router is stable; only re-sync when state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // When material preset changes, apply its defaults unless "custom".
  function applyMaterial(id: MaterialPreset["id"]) {
    const preset = getMaterialPreset(id);
    if (!preset) return;
    setState((s) => ({
      ...s,
      materialId: id,
      ...(id === "custom"
        ? {}
        : { pricePerKg: preset.pricePerKg, wasteFactor: preset.wasteFactor }),
    }));
  }

  const gramsNum = typeof state.grams === "number" ? state.grams : 0;
  const priceNum =
    typeof state.pricePerKg === "number" ? state.pricePerKg : 0;
  const hasInput = gramsNum > 0 && priceNum > 0;

  const result = useMemo(
    () =>
      calculateFilamentCost({
        gramsUsed: gramsNum,
        pricePerKg: priceNum,
        wasteFactor: state.wasteFactor,
      }),
    [gramsNum, priceNum, state.wasteFactor],
  );

  const currencySymbol =
    CURRENCIES.find((c) => c.code === state.currency)?.symbol ?? "$";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      {/* ----- Inputs ----- */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Select
              value={state.materialId}
              items={MATERIAL_ITEMS}
              onValueChange={(v) => applyMaterial(v as MaterialPreset["id"])}
            >
              <SelectTrigger id="material" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MATERIAL_PRESETS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                    {m.id !== "custom" && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {currencySymbol}
                        {m.pricePerKg}/kg · {Math.round(m.wasteFactor * 100)}%
                        waste
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Picks typical price and waste for the material. Pick Custom to
              set your own.
            </p>
          </div>

          <InputWithUnit
            id="grams"
            label="Filament used"
            value={state.grams}
            onValueChange={(v) => setState((s) => ({ ...s, grams: v }))}
            unit="g"
            min={0}
            step={1}
            placeholder="500"
            hint="Copy this from your slicer's estimated weight."
          />

          <InputWithUnit
            id="price"
            label={`Price per kg (${currencySymbol})`}
            value={state.pricePerKg}
            onValueChange={(v) =>
              setState((s) => ({
                ...s,
                pricePerKg: v,
                materialId: "custom",
              }))
            }
            min={0}
            step={0.5}
            placeholder="20"
            hint="What you paid for the spool, divided by its weight in kg."
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Waste factor</Label>
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {Math.round(state.wasteFactor * 100)}%
              </span>
            </div>
            <Slider
              value={[state.wasteFactor * 100]}
              min={0}
              max={25}
              step={1}
              onValueChange={(vals) => {
                const next = Array.isArray(vals) ? vals[0] : vals;
                setState((s) => ({
                  ...s,
                  wasteFactor: next / 100,
                  materialId: "custom",
                }));
              }}
            />
            <p className="text-xs text-muted-foreground">
              Accounts for purges, skirts, and small failures. 5% is typical
              for PLA, higher for ABS/TPU.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={state.currency}
              items={CURRENCY_ITEMS}
              onValueChange={(v) =>
                setState((s) => ({ ...s, currency: v as CurrencyCode }))
              }
            >
              <SelectTrigger id="currency" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.symbol} {c.code}, {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ----- Results ----- */}
      <div className="space-y-4">
        <ResultDisplay
          prominent
          label="Total cost for this print"
          value={
            hasInput ? formatCurrency(result.cost, state.currency) : "-"
          }
          sublabel={
            hasInput
              ? `${gramsNum.toLocaleString()} g × ${formatCurrency(priceNum, state.currency)}/kg × ${(1 + state.wasteFactor).toFixed(2)} (${Math.round(state.wasteFactor * 100)}% waste)`
              : "Enter filament weight and price to calculate."
          }
          copyValue={
            hasInput
              ? formatCurrency(result.cost, state.currency)
              : undefined
          }
        />

        {hasInput && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Cost per gram"
                value={formatCurrency(result.costPerGram, state.currency, {
                  minimumFractionDigits: 4,
                  maximumFractionDigits: 4,
                })}
              />
              <ResultDisplay
                label="Filament used (incl. waste)"
                value={result.effectiveGrams.toFixed(1)}
                unit="g"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/70 px-3 py-1 text-xs">
                <span className="text-muted-foreground">Prints per kg</span>
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {Math.max(1, Math.floor(1000 / gramsNum)).toLocaleString()}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/70 px-3 py-1 text-xs">
                <span className="text-muted-foreground">Cost for 10 prints</span>
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {formatCurrency(result.cost * 10, state.currency)}
                </span>
              </span>
              {result.cost >= 1 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/70 px-3 py-1 text-xs">
                  <span className="text-muted-foreground">≈ coffees ($5)</span>
                  <span className="font-mono font-medium tabular-nums text-foreground">
                    {(result.cost / 5).toFixed(1)}
                  </span>
                </span>
              )}
            </div>

            <FormulaBreakdown
              formula="cost = (grams ÷ 1000) × price_per_kg × (1 + waste_factor)"
              steps={[
                { label: "grams used", value: `${gramsNum} g` },
                { label: "÷ 1000", value: `${(gramsNum / 1000).toFixed(3)} kg` },
                {
                  label: "× price/kg",
                  value: formatCurrency(
                    (gramsNum / 1000) * priceNum,
                    state.currency,
                  ),
                },
                {
                  label: `× (1 + ${Math.round(state.wasteFactor * 100)}% waste)`,
                  value: formatCurrency(result.cost, state.currency),
                },
              ]}
              note="Waste factor covers purges, skirts, and small-scale failures. It does not include full-print failures. Use the Failure Rate Calculator for that."
            />
          </>
        )}

        <ShareButton className="w-full" />
      </div>
    </div>
  );
}
