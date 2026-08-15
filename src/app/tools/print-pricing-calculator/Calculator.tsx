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
  failureRatePercent: number; // 0..40
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
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };
  const toClamped = (s: string | null, fallback: number, min: number, max: number): number => {
    if (s === null) return fallback;
    const n = Number(s);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
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
    failureRatePercent: toClamped(params.get("f"), DEFAULT_STATE.failureRatePercent, 0, 40),
    laborHours: toNumOrEmpty(params.get("lh"), DEFAULT_STATE.laborHours),
    laborRate: toNumOrEmpty(params.get("lr"), DEFAULT_STATE.laborRate),
    markup: toClamped(params.get("mk"), DEFAULT_STATE.markup, 1, 6),
    currency:
      c && CURRENCIES.some((x) => x.code === c) ? c : DEFAULT_STATE.currency,
  };
}

function encodeState(state: State): string {
  const p = new URLSearchParams();
  if (state.materialCost !== "") p.set("m", String(state.materialCost));
  if (state.electricityCost !== "") p.set("e", String(state.electricityCost));
  if (state.printHours !== "") p.set("h", String(state.printHours));
  if (state.printerPrice !== "") p.set("pp", String(state.printerPrice));
  if (state.printerLifetimeHours !== "")
    p.set("pl", String(state.printerLifetimeHours));
  p.set("f", String(state.failureRatePercent));
  if (state.laborHours !== "") p.set("lh", String(state.laborHours));
  if (state.laborRate !== "") p.set("lr", String(state.laborRate));
  p.set("mk", state.markup.toFixed(2));
  p.set("c", state.currency);
  return p.toString();
}

// -----------------------------------------------------------------------

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

  const num = (v: number | ""): number => (typeof v === "number" ? v : 0);
  const hasInput = num(state.materialCost) > 0;

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

  const currencySymbol =
    CURRENCIES.find((c) => c.code === state.currency)?.symbol ?? "$";
  const fmt = (v: number) => formatCurrency(v, state.currency);
  const laborNum = num(state.laborHours) * num(state.laborRate);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      {/* ----- Inputs ----- */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Costs per print
          </p>

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
            hint="A 6 hour print usually runs 10 to 20 cents, a full day around 50. The Electricity Cost Calculator gives the exact number."
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
              min={0}
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
              value={[state.failureRatePercent]}
              min={0}
              max={40}
              step={1}
              onValueChange={(vals) => {
                const next = Array.isArray(vals) ? vals[0] : vals;
                setState((s) => ({ ...s, failureRatePercent: next }));
              }}
            />
            <p className="text-xs text-muted-foreground">
              Failed prints get amortized into every good one. 5 to 10% is a
              typical hobbyist band. Track yours with the Failure Rate
              Calculator.
            </p>
          </div>

          <p className="pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Your time
          </p>

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
              2× for friends, 3× is the common Etsy hobbyist floor, 4 to 5× if
              you run it like a business. Applied to production cost, not your
              labor.
            </p>
          </div>

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
        </CardContent>
      </Card>

      {/* ----- Results ----- */}
      <div className="space-y-4">
        <ResultDisplay
          prominent
          label="Charge at least"
          value={hasInput ? fmt(result.suggestedPrice) : "-"}
          sublabel={
            hasInput
              ? `${fmt(result.failureAdjustedCost)} cost × ${state.markup.toFixed(2).replace(/\.?0+$/, "")} markup + ${fmt(laborNum)} labor`
              : "Enter your material cost to calculate."
          }
          copyValue={hasInput ? fmt(result.suggestedPrice) : undefined}
        />

        {hasInput && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Break-even price"
                value={fmt(result.floorPrice)}
              />
              <ResultDisplay
                label="Cost per print"
                value={fmt(result.failureAdjustedCost)}
              />
              <ResultDisplay
                label="Profit per sale"
                value={fmt(result.profit)}
              />
              <ResultDisplay
                label="Your effective hourly"
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
                <span className="text-muted-foreground">Sell 10, earn</span>
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
              note="Markup covers profit plus the overhead this calculator can't see: marketplace fees, packaging, shipping supplies, failed experiments, and the spool shelf that keeps growing."
            />
          </>
        )}

        <ShareButton className="w-full" />
      </div>
    </div>
  );
}
