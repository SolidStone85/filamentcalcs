"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CalculatorSettings } from "@/components/shared/CalculatorSettings";
import { CalculatorSummary } from "@/components/shared/CalculatorSummary";
import { useCalculatorState } from "@/lib/useCalculatorState";

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
  priceMode: "spool" | "kg";
  spoolPrice: number | "";
  spoolWeight: number | "";
};

const DEFAULT_STATE: State = {
  grams: "",
  pricePerKg: 20,
  wasteFactor: 0.05,
  currency: "USD",
  materialId: "pla",
  priceMode: "spool",
  spoolPrice: 20,
  spoolWeight: 1000,
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
    priceMode: params.get("pm") === "kg" || (!params.has("pm") && params.has("p")) ? "kg" : "spool",
    spoolPrice: params.has("sp") ? toNumOrEmpty(params.get("sp")) : DEFAULT_STATE.spoolPrice,
    spoolWeight: params.has("sw") ? toNumOrEmpty(params.get("sw")) : DEFAULT_STATE.spoolWeight,
    pricePerKg: p === null ? DEFAULT_STATE.pricePerKg : toNumOrEmpty(p),
    wasteFactor:
      w === null ? DEFAULT_STATE.wasteFactor : Number.isFinite(Number(w)) && w !== "" ? Number(w) : -1,
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
  p.set("g", String(state.grams));
  const price = state.priceMode === "spool" && typeof state.spoolPrice === "number" && typeof state.spoolWeight === "number" && state.spoolWeight > 0
    ? state.spoolPrice * 1000 / state.spoolWeight : state.pricePerKg;
  p.set("p", String(price));
  p.set("w", String(state.wasteFactor));
  p.set("c", state.currency);
  p.set("m", state.materialId);
  p.set("pm", state.priceMode);
  p.set("sp", String(state.spoolPrice));
  p.set("sw", String(state.spoolWeight));
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
  const { state, setState, settings } = useCalculatorState(parseStateFromParams, encodeState, {
    c: "currency", p: "filamentPricePerKg", pm: "priceMode", sp: "spoolPrice", sw: "pricedSpoolWeight",
  }, [["p", "pm", "sp", "sw"]]);

  // When material preset changes, apply its defaults unless "custom".
  function applyMaterial(id: MaterialPreset["id"]) {
    const preset = getMaterialPreset(id);
    if (!preset) return;
    setState((s) => ({
      ...s,
      materialId: id,
      ...(id === "custom"
        ? {}
        : { pricePerKg: preset.pricePerKg, priceMode: "kg", wasteFactor: preset.wasteFactor }),
    }));
  }

  const gramsNum = typeof state.grams === "number" ? state.grams : 0;
  const priceNum = state.priceMode === "spool"
    ? typeof state.spoolPrice === "number" && typeof state.spoolWeight === "number" && state.spoolWeight > 0
      ? state.spoolPrice * 1000 / state.spoolWeight : 0
    : typeof state.pricePerKg === "number" ? state.pricePerKg : 0;
  const validPrice = state.priceMode === "spool"
    ? state.spoolPrice !== "" && state.spoolPrice >= 0 && state.spoolWeight !== "" && state.spoolWeight > 0
    : state.pricePerKg !== "" && state.pricePerKg >= 0;
  const validInputs = gramsNum > 0 && validPrice && Number.isFinite(priceNum) && Number.isFinite(gramsNum) && state.wasteFactor >= 0 && state.wasteFactor <= 0.25;

  const result = useMemo(
    () =>
      calculateFilamentCost({
        gramsUsed: gramsNum,
        pricePerKg: priceNum,
        wasteFactor: state.wasteFactor,
      }),
    [gramsNum, priceNum, state.wasteFactor],
  );
  const hasInput = validInputs && Object.values(result).every((value) => typeof value !== "number" || Number.isFinite(value));

  const currencySymbol =
    CURRENCIES.find((c) => c.code === state.currency)?.symbol ?? "$";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <CalculatorSummary label="Material cost" value={hasInput ? formatCurrency(result.cost, state.currency) : "Enter print weight"} />
      {/* ----- Inputs ----- */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <InputWithUnit
            id="grams"
            label="Print weight"
            value={state.grams}
            onValueChange={(v) => setState((s) => ({ ...s, grams: v }))}
            unit="g"
            min={0}
            step={1}
            placeholder="100"
            hint="Use model weight, or the whole slicer total. If the total already includes supports and purge, set extra waste to 0%."
          />

          <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-medium">Filament price</legend>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2"><input type="radio" name="price-mode" checked={state.priceMode === "spool"} onChange={() => setState((s) => ({ ...s, priceMode: "spool" }))} className="accent-primary" />Spool price</label>
              <label className="flex items-center gap-2"><input type="radio" name="price-mode" checked={state.priceMode === "kg"} onChange={() => setState((s) => ({ ...s, priceMode: "kg", pricePerKg: validPrice ? priceNum : "" }))} className="accent-primary" />Price per kg</label>
            </div>
            {state.priceMode === "spool" ? <>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputWithUnit id="spool-price" label={`Price paid (${currencySymbol})`} value={state.spoolPrice} onValueChange={(v) => setState((s) => ({ ...s, spoolPrice: v, materialId: "custom" }))} min={0} step={0.01} />
                <InputWithUnit id="spool-weight" label="Filament in new spool" value={state.spoolWeight} onValueChange={(v) => setState((s) => ({ ...s, spoolWeight: v, materialId: "custom" }))} unit="g" min={1} step={1} hint="Net filament weight, without the spool." />
              </div>
              <div className="flex flex-wrap gap-2" aria-label="Common spool weights">
                {[250, 500, 750, 1000].map((weight) => <button key={weight} type="button" aria-pressed={state.spoolWeight === weight} onClick={() => setState((s) => ({ ...s, spoolWeight: weight }))} className="rounded-md border px-3 py-2 text-xs hover:bg-accent aria-pressed:border-primary aria-pressed:bg-accent">{weight.toLocaleString()} g</button>)}
              </div>
              {validPrice && <p className="text-xs text-muted-foreground">Equivalent to {formatCurrency(priceNum, state.currency, { maximumFractionDigits: 4 })}/kg. Calculations use the unrounded value.</p>}
            </> : <InputWithUnit id="price" label={`Price per kg (${currencySymbol})`} value={state.pricePerKg} onValueChange={(v) => setState((s) => ({ ...s, pricePerKg: v, materialId: "custom" }))} min={0} step={0.01} placeholder="20" />}
          </fieldset>

          <details className="space-y-3 rounded-lg border p-3">
            <summary className="cursor-pointer text-sm font-medium">Material price presets (optional)</summary>
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
              Illustrative price and waste assumptions, not current market prices. Your actual spool price is more useful.
            </p>
          </div>
          </details>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Extra waste allowance</Label>
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {Math.round(state.wasteFactor * 100)}%
              </span>
            </div>
            <Slider
              aria-label="Extra waste allowance"
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
              An editable allowance above the weight entered. Set to 0% if everything is already in your slicer total; do not count supports or purge twice.
            </p>
            {(state.wasteFactor < 0 || state.wasteFactor > 0.25) && <p className="text-xs text-destructive">Choose an extra waste allowance from 0% to 25%.</p>}
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
            <p className="text-xs text-muted-foreground">
              Sets the symbol. Your numbers stay in the currency you type,
              nothing is converted.
            </p>
          </div>
          <CalculatorSettings {...settings} />
        </CardContent>
      </Card>

      {/* ----- Results ----- */}
      <div id="calculator-results" tabIndex={-1} className="scroll-mt-40 space-y-4 lg:sticky lg:top-24 lg:self-start">
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
                <span className="text-muted-foreground">Complete prints per kg (with waste)</span>
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {result.completePrintsPerKg.toLocaleString()}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/70 px-3 py-1 text-xs">
                <span className="text-muted-foreground">Cost for 10 prints</span>
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {formatCurrency(result.cost * 10, state.currency)}
                </span>
              </span>
            </div>

            <Link href={`/tools/print-pricing-calculator?${new URLSearchParams({ m: String(result.cost), c: state.currency })}`} className="flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground hover:opacity-90">Use this in print pricing</Link>

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
