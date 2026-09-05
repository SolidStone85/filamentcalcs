"use client";

import Link from "next/link";

import { CalculatorSettings } from "@/components/shared/CalculatorSettings";
import { CalculatorSummary } from "@/components/shared/CalculatorSummary";
import { FormulaBreakdown } from "@/components/shared/FormulaBreakdown";
import { InputWithUnit } from "@/components/shared/InputWithUnit";
import { ResultDisplay } from "@/components/shared/ResultDisplay";
import { ShareButton } from "@/components/shared/ShareButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCIES, formatCurrency, type CurrencyCode } from "@/lib/currency";
import { calculateSlicerMaterial, estimateFlushingGrams } from "@/lib/formulas/amsPurgeWaste";
import { useCalculatorState } from "@/lib/useCalculatorState";
import { encodeAmsState, getAmsInputStatus, parseAmsState, type AmsState } from "./state";

const CURRENCY_ITEMS = CURRENCIES.map((c) => ({ value: c.code, label: `${c.symbol} ${c.code}` }));
const MODES = [{ value: "slicer", label: "Slicer totals (recommended)" }, { value: "estimate", label: "Custom estimate" }];
const UNITS = [{ value: "g", label: "g / swap" }, { value: "mm3", label: "mm³ / swap" }];
const parseState = (params: URLSearchParams) => parseAmsState(params, CURRENCIES.map((c) => c.code));

export function Calculator() {
  const { state, setState, settings } = useCalculatorState(parseState, encodeAmsState, { c: "currency", pp: "pricePerKg" });

  function setAmount(field: keyof AmsState, value: number | "") {
    setState((s) => ({ ...s, [field]: value, ...(field === "purgePerSwap" ? { legacyEstimate: false } : {}) }));
  }

  const estimate = state.mode === "estimate";
  const { ready, hasInvalidInput } = getAmsInputStatus(state);
  const flushingGrams = estimate ? estimateFlushingGrams({
    colorSwaps: Number(state.colorSwaps), purgePerSwap: Number(state.purgePerSwap),
    unit: state.unit, densityGramsPerCm3: Number(state.density), flushMultiplier: Number(state.multiplier),
  }) : Number(state.flushingGrams);
  const result = calculateSlicerMaterial({ modelGrams: Number(state.modelGrams), supportGrams: Number(state.supportGrams),
    flushingGrams, towerGrams: Number(state.towerGrams), extraGrams: Number(state.extraGrams), pricePerKg: Number(state.pricePerKg) });
  const hasResult = ready && Object.values(result).every(Number.isFinite);
  const error = hasInvalidInput || (ready && !hasResult);
  const money = (amount: number) => formatCurrency(amount, state.currency);
  const resultText = hasResult ? money(result.totalFilamentCost) : error ? "Check inputs" : "Enter amounts";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <CalculatorSummary label={estimate ? "Estimated material cost" : "Material cost from your totals"} value={resultText} detail={hasResult ? `${result.totalFilamentGrams.toFixed(2)} g consumed` : undefined} />
      <Card className="glass-card">
        <CardHeader><CardTitle>Material used for this print</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="ams-mode">Input method</Label>
            <Select value={state.mode} items={MODES} onValueChange={(v) => { if (v) setState((s) => ({ ...s, mode: v as AmsState["mode"], legacyEstimate: false })); }}>
              <SelectTrigger id="ams-mode" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{MODES.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
            </Select>
            <p className="text-xs leading-5 text-muted-foreground">{estimate
              ? "Supply your own average for this print. Color direction, material and printer settings change the amount needed."
              : "Slice the plate first, then enter its separate material totals in grams. Leave unused categories at zero."}</p>
          </div>
          {state.legacyEstimate && <p role="status" className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">Legacy estimate: this saved link uses the previous calculator&apos;s grams-per-swap assumptions. These are not verified manufacturer defaults. Check the average below or switch to slicer totals.</p>}
          <InputWithUnit id="ams-model" label="Useful model material" value={state.modelGrams} onValueChange={(v) => setAmount("modelGrams", v)} unit="g" min={0} step={0.01} placeholder="92" hint="All useful models on the plate, including material flushed into their infill. Exclude the discarded categories below." />
          {!estimate ? <InputWithUnit id="ams-flush" label="Discarded flushing material" value={state.flushingGrams} onValueChange={(v) => setAmount("flushingGrams", v)} unit="g" min={0} step={0.01} placeholder="20" hint="Flushing sent to waste. Do not include material already counted inside useful models or supports. Do not paste mm³ here." /> : <>
            <InputWithUnit id="ams-swaps" label="Number of color swaps" value={state.colorSwaps} onValueChange={(v) => setAmount("colorSwaps", v)} unit="swaps" min={0} step={1} placeholder="40" />
            <InputWithUnit id="ams-average" label="Average discarded flush per swap" value={state.purgePerSwap} onValueChange={(v) => setAmount("purgePerSwap", v)} unit={state.unit} unitOptions={UNITS} onUnitChange={(v) => setState((s) => ({ ...s, unit: v as AmsState["unit"], purgePerSwap: "", legacyEstimate: false }))} min={0} step={0.01} hint="Enter a measured average or an average for your actual transitions. A single matrix cell may not represent the whole print." />
            {state.unit === "mm3" && <InputWithUnit id="ams-density" label="Filament density" value={state.density} onValueChange={(v) => setAmount("density", v)} unit="g/cm³" min={0.01} step={0.01} hint="1.24 is a Bambu PLA Basic example. Replace it with your material datasheet value; mixed materials need a suitable weighted average." />}
            <InputWithUnit id="ams-multiplier" label="Multiplier for an unadjusted baseline" value={state.multiplier} onValueChange={(v) => setAmount("multiplier", v)} unit="×" min={0} step={0.05} hint="Keep at 1 if the value already includes your slicer multiplier. Lower settings need a test print for color bleed and material compatibility." />
          </>}
          <details className="rounded-lg border p-4">
            <summary className="cursor-pointer text-sm font-medium">Supports, tower and other discarded material</summary>
            <div className="mt-4 space-y-4">
              <InputWithUnit id="ams-support" label="Discarded supports" value={state.supportGrams} onValueChange={(v) => setAmount("supportGrams", v)} unit="g" min={0} step={0.01} hint="Include flushing into these supports here, rather than in the flushing field." />
              <InputWithUnit id="ams-tower" label="Discarded prime / wipe tower" value={state.towerGrams} onValueChange={(v) => setAmount("towerGrams", v)} unit="g" min={0} step={0.01} hint="If the tower total includes purging, count that material only here." />
              <InputWithUnit id="ams-extra" label="Other discarded material" value={state.extraGrams} onValueChange={(v) => setAmount("extraGrams", v)} unit="g" min={0} step={0.01} hint="Startup purges, calibration lines, brims or other waste only if not included above. Zero means excluded." />
            </div>
          </details>
          <InputWithUnit id="ams-price" label="Filament price per kg" value={state.pricePerKg} onValueChange={(v) => setAmount("pricePerKg", v)} min={0} step={0.01} hint="For multiple prices use the average weighted by consumed grams. A simple average is only approximate." />
          <div className="space-y-2">
            <Label htmlFor="ams-currency">Currency</Label>
            <Select value={state.currency} items={CURRENCY_ITEMS} onValueChange={(v) => { if (v) setState((s) => ({ ...s, currency: v as CurrencyCode })); }}>
              <SelectTrigger id="ams-currency" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c.code} value={c.code}>{c.symbol} {c.code}, {c.label}</SelectItem>)}</SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Labels your amounts. No exchange-rate conversion.</p>
          </div>
          {error && <p role="alert" className="text-sm text-destructive">Use finite, non-negative amounts, whole swap counts and a positive density. Check any values hidden under discarded material.</p>}
          <CalculatorSettings {...settings} />
        </CardContent>
      </Card>
      <div id="calculator-results" tabIndex={-1} className="scroll-mt-40 space-y-4 lg:sticky lg:top-24 lg:self-start">
        <ResultDisplay prominent label={estimate ? "Estimated total material cost" : "Total material cost from your amounts"} value={resultText} sublabel={hasResult ? `${result.totalFilamentGrams.toFixed(2)} g consumed` : "Enter model, flushing and price. Zero is valid."} copyValue={hasResult ? money(result.totalFilamentCost) : undefined} />
        {hasResult && <>
          <div className="grid gap-3 sm:grid-cols-2">
            <ResultDisplay label="Discarded material" value={`${result.discardedGrams.toFixed(2)} g`} sublabel={`${money(result.discardedCost)} · ${result.discardedPercent.toFixed(1)}% of total`} />
            <ResultDisplay label="Useful models" value={`${Number(state.modelGrams).toFixed(2)} g`} sublabel="Material retained in your models" />
          </div>
          <FormulaBreakdown formula={estimate ? "flush_g = swaps × average × multiplier\nif average is mm³: average_g = mm³ × density / 1000\nconsumed = model + flush + support + tower + other" : "discarded = flush + support + tower + other\nconsumed = model + discarded\ncost = consumed_g / 1000 × price_per_kg"} steps={[
            { label: "Useful model material", value: `${Number(state.modelGrams).toFixed(2)} g` },
            { label: estimate ? "Estimated discarded flush" : "Discarded flush", value: `${flushingGrams.toFixed(2)} g` },
            { label: "Support + tower + other", value: `${(Number(state.supportGrams) + Number(state.towerGrams) + Number(state.extraGrams)).toFixed(2)} g` },
            { label: "Total material", value: `${result.totalFilamentGrams.toFixed(2)} g` },
          ]} note="Each gram belongs in one category. Slicer figures are estimates; actual consumption may differ. Total cost uses the supplied average price." />
          <Link href={`/tools/print-pricing-calculator?m=${result.totalFilamentCost}&c=${state.currency}`} className="block rounded-lg border p-3 text-center text-sm font-medium text-primary">Use this material cost in print pricing →</Link>
        </>}
        <ShareButton className="w-full" />
      </div>
    </div>
  );
}
