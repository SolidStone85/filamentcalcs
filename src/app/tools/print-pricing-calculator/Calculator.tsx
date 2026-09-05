"use client";

import { useMemo } from "react";
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
import { calculatePrintPricing } from "@/lib/formulas/printPricing";

// --- URL state helpers ---------------------------------------------------
// State lives in query params so results are shareable. Keys kept short:
//   m = material cost, e = electricity cost, h = print hours,
//   pp = printer price, pl = printer lifetime hours, f = failure %,
//   lh = labor hours, lr = labor rate, mk = markup, c = currency

type State = {
  materialCost: number | "";
  electricityCost: number | "";
  printHours: number | "";
  printerPrice: number | "";
  printerLifetimeHours: number | "";
  failureRatePercent: number; // 0..99
  laborHours: number | "";
  laborRate: number | "";
  markup: number; // 1..6
  currency: CurrencyCode;
};

const DEFAULT_STATE: State = {
  materialCost: "",
  electricityCost: 0.2,
  printHours: 6,
  printerPrice: 350,
  printerLifetimeHours: 5000,
  failureRatePercent: 8,
  laborHours: 0.5,
  laborRate: 15,
  markup: 3,
  currency: "USD",
};

function parseStateFromParams(params: URLSearchParams): State {
  const toNumOrEmpty = (s: string | null, fallback: number | ""): number | "" => {
    if (s === null) return fallback;
    if (s === "") return "";
    const n = Number(s);
    return Number.isFinite(n) ? n : "";
  };
  const toNumber = (s: string | null, fallback: number): number => {
    if (s === null) return fallback;
    const n = Number(s);
    return Number.isFinite(n) && s !== "" ? n : -1;
  };
  const c = params.get("c") as CurrencyCode | null;

  return {
    materialCost: toNumOrEmpty(params.get("m"), DEFAULT_STATE.materialCost),
    electricityCost: toNumOrEmpty(params.get("e"), DEFAULT_STATE.electricityCost),
    printHours: toNumOrEmpty(params.get("h"), DEFAULT_STATE.printHours),
    printerPrice: toNumOrEmpty(params.get("pp"), DEFAULT_STATE.printerPrice),
    printerLifetimeHours: toNumOrEmpty(
      params.get("pl"),
      DEFAULT_STATE.printerLifetimeHours,
    ),
    failureRatePercent: toNumber(params.get("f"), DEFAULT_STATE.failureRatePercent),
    laborHours: toNumOrEmpty(params.get("lh"), DEFAULT_STATE.laborHours),
    laborRate: toNumOrEmpty(params.get("lr"), DEFAULT_STATE.laborRate),
    markup: toNumber(params.get("mk"), DEFAULT_STATE.markup),
    currency:
      c && CURRENCIES.some((x) => x.code === c) ? c : DEFAULT_STATE.currency,
  };
}

function encodeState(state: State): string {
  const p = new URLSearchParams();
  p.set("m", String(state.materialCost));
  p.set("e", String(state.electricityCost));
  p.set("h", String(state.printHours));
  p.set("pp", String(state.printerPrice));
  p.set("pl", String(state.printerLifetimeHours));
  p.set("f", String(state.failureRatePercent));
  p.set("lh", String(state.laborHours));
  p.set("lr", String(state.laborRate));
  p.set("mk", String(state.markup));
  p.set("c", state.currency);
  return p.toString();
}

// -----------------------------------------------------------------------

export function Calculator() {
  const { state, setState, settings } = useCalculatorState(parseStateFromParams, encodeState, {
    c: "currency", pp: "printerPrice", pl: "printerLifetimeHours",
  });

  const num = (v: number | ""): number => (typeof v === "number" ? v : 0);
  const validInputs = [state.materialCost, state.electricityCost, state.printHours, state.printerPrice, state.printerLifetimeHours, state.laborHours, state.laborRate]
    .every((v) => v !== "" && Number.isFinite(v) && v >= 0) && num(state.printerLifetimeHours) > 0 &&
    state.failureRatePercent >= 0 && state.failureRatePercent < 100 && state.markup >= 1 && state.markup <= 6;

  const result = useMemo(
    () =>
      calculatePrintPricing({
        materialCost: num(state.materialCost),
        electricityCost: num(state.electricityCost),
        printHours: num(state.printHours),
        printerPrice: num(state.printerPrice),
        printerLifetimeHours: num(state.printerLifetimeHours),
        failureRatePercent: state.failureRatePercent,
        laborHours: num(state.laborHours),
        laborRate: num(state.laborRate),
        markup: state.markup,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  );
  const hasInput = validInputs && Object.values(result).every((value) => typeof value !== "number" || Number.isFinite(value));

  const currencySymbol =
    CURRENCIES.find((c) => c.code === state.currency)?.symbol ?? "$";
  const fmt = (v: number) => formatCurrency(v, state.currency);
  const laborNum = num(state.laborHours) * num(state.laborRate);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <CalculatorSummary label="Suggested price" value={hasInput ? fmt(result.suggestedPrice) : "Enter costs"} />
      {/* ----- Inputs ----- */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <InputWithUnit
            id="material"
            label={`Material cost (${currencySymbol})`}
            value={state.materialCost}
            onValueChange={(v) => setState((s) => ({ ...s, materialCost: v }))}
            min={0}
            step={0.25}
            placeholder="2.50"
            hint="Filament for this print, purge included. Get it from the Filament Cost Calculator."
          />

          <details className="space-y-4 rounded-lg border p-4">
            <summary className="cursor-pointer text-sm font-medium">
              Production assumptions
              <span className="mt-1 block text-xs font-normal leading-5 text-muted-foreground">Power {state.electricityCost === "" ? "missing" : fmt(num(state.electricityCost))} · {state.printHours || 0} h · printer {state.printerPrice === "" ? "missing" : fmt(num(state.printerPrice))} / {state.printerLifetimeHours || 0} h · {state.failureRatePercent}% failures</span>
            </summary>
          <InputWithUnit
            id="electricity"
            label={`Electricity cost (${currencySymbol})`}
            value={state.electricityCost}
            onValueChange={(v) =>
              setState((s) => ({ ...s, electricityCost: v }))
            }
            min={0}
            step={0.05}
            placeholder="0.20"
            hint="Enter your measured or estimated cost for this job. The default is an editable example; actual cost depends on power use and your tariff."
          />

          <p className="pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Printer wear
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <InputWithUnit
              id="printer-price"
              label={`Printer price (${currencySymbol})`}
              value={state.printerPrice}
              onValueChange={(v) =>
                setState((s) => ({ ...s, printerPrice: v }))
              }
              min={0}
              step={10}
              placeholder="350"
            />
            <InputWithUnit
              id="printer-lifetime"
              label="Expected lifetime"
              value={state.printerLifetimeHours}
              onValueChange={(v) =>
                setState((s) => ({ ...s, printerLifetimeHours: v }))
              }
              unit="h"
              min={1}
              step={250}
              placeholder="5000"
            />
          </div>

          <InputWithUnit
            id="print-hours"
            label="Print time for this job"
            value={state.printHours}
            onValueChange={(v) => setState((s) => ({ ...s, printHours: v }))}
            unit="h"
            min={0}
            step={0.5}
            placeholder="6"
            hint="Machine hours convert printer price into a per-print wear cost."
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Failure rate</Label>
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {state.failureRatePercent}%
              </span>
            </div>
            <Slider
              aria-label="Failure rate"
              value={[state.failureRatePercent]}
              min={0}
              max={99}
              step={1}
              onValueChange={(vals) => {
                const next = Array.isArray(vals) ? vals[0] : vals;
                setState((s) => ({ ...s, failureRatePercent: next }));
              }}
            />
            <p className="text-xs text-muted-foreground">
              Assumes each failed attempt uses the full production cost. Replace this example rate with your tracked failure rate.
            </p>
            {(state.failureRatePercent < 0 || state.failureRatePercent >= 100) && <p className="text-xs text-destructive">Choose a failure rate from 0% to 99%. At 100%, no successful print can cover the costs.</p>}
          </div>
          </details>

          <details className="space-y-4 rounded-lg border p-4">
            <summary className="cursor-pointer text-sm font-medium">Labor and markup<span className="mt-1 block text-xs font-normal leading-5 text-muted-foreground">{state.laborHours === "" ? "Missing time" : `${state.laborHours} h`} × {state.laborRate === "" ? "missing rate" : `${fmt(num(state.laborRate))}/h`} · {state.markup.toFixed(2)}× production cost</span></summary>

          <div className="grid gap-4 sm:grid-cols-2">
            <InputWithUnit
              id="labor-hours"
              label="Hands-on time"
              value={state.laborHours}
              onValueChange={(v) => setState((s) => ({ ...s, laborHours: v }))}
              unit="h"
              min={0}
              step={0.25}
              placeholder="0.5"
            />
            <InputWithUnit
              id="labor-rate"
              label={`Your rate (${currencySymbol}/h)`}
              value={state.laborRate}
              onValueChange={(v) => setState((s) => ({ ...s, laborRate: v }))}
              min={0}
              step={1}
              placeholder="15"
            />
          </div>
          <p className="-mt-3 text-xs text-muted-foreground">
            Slicing, plate prep, support removal, sanding, packing. Machine
            time doesn't count; the printer works unattended.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Markup</Label>
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {state.markup.toFixed(2).replace(/\.?0+$/, "")}×
              </span>
            </div>
            <Slider
              aria-label="Markup"
              value={[state.markup]}
              min={1}
              max={6}
              step={0.25}
              onValueChange={(vals) => {
                const next = Array.isArray(vals) ? vals[0] : vals;
                setState((s) => ({ ...s, markup: next }));
              }}
            />
            <p className="text-xs text-muted-foreground">
              Your chosen pricing assumption, not a guaranteed market price. Applied to production cost; labor is added afterward. A 3× multiplier means 200% markup.
            </p>
            {(state.markup < 1 || state.markup > 6) && <p className="text-xs text-destructive">Choose a multiplier from 1× to 6×.</p>}
          </div>
          </details>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={state.currency}
              items={CURRENCIES.map((c) => ({
                value: c.code,
                label: `${c.symbol} ${c.code}`,
              }))}
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
          label="Suggested selling price"
          value={hasInput ? fmt(result.suggestedPrice) : "-"}
          sublabel={
            hasInput
              ? `${fmt(result.failureAdjustedCost)} cost × ${state.markup.toFixed(2).replace(/\.?0+$/, "")} markup + ${fmt(laborNum)} labor`
              : "Complete the cost inputs and check the assumptions to calculate."
          }
          copyValue={hasInput ? fmt(result.suggestedPrice) : undefined}
        />

        {hasInput && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Break-even (entered costs)"
                value={fmt(result.floorPrice)}
              />
              <ResultDisplay
                label="Production incl. failures"
                value={fmt(result.failureAdjustedCost)}
                sublabel="Labor is separate"
              />
              <ResultDisplay
                label="Profit before other costs"
                value={fmt(result.profit)}
              />
              <ResultDisplay
                label="Hourly before other costs"
                value={
                  num(state.laborHours) > 0
                    ? fmt(result.effectiveHourlyRate)
                    : "-"
                }
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/70 px-3 py-1 text-xs">
                <span className="text-muted-foreground">Margin</span>
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {Math.round(result.marginPercent)}%
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/70 px-3 py-1 text-xs">
                <span className="text-muted-foreground">Machine wear</span>
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {fmt(result.machineCost)}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/70 px-3 py-1 text-xs">
                <span className="text-muted-foreground">10 sales, before other costs</span>
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {fmt(result.profit * 10)}
                </span>
              </span>
            </div>

            <FormulaBreakdown
              formula="price = (production ÷ (1 - failure_rate)) × markup + labor"
              steps={[
                {
                  label: "material + power + wear",
                  value: fmt(result.productionCost),
                },
                {
                  label: `÷ (1 - ${state.failureRatePercent}% failures)`,
                  value: fmt(result.failureAdjustedCost),
                },
                {
                  label: `× ${state.markup.toFixed(2).replace(/\.?0+$/, "")} markup`,
                  value: fmt(result.failureAdjustedCost * state.markup),
                },
                {
                  label: `+ labor (${num(state.laborHours)} h × ${fmt(num(state.laborRate))})`,
                  value: fmt(result.suggestedPrice),
                },
              ]}
              note="Markup is your chosen allowance. Check that the final price also covers marketplace fees, packaging, shipping and any other costs you have not entered."
            />
          </>
        )}

        <ShareButton className="w-full" />
      </div>
    </div>
  );
}
