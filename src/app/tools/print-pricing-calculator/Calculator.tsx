"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Circle } from "lucide-react";

import { CalculatorSettings } from "@/components/shared/CalculatorSettings";
import { CalculatorSummary } from "@/components/shared/CalculatorSummary";
import { DurationInput } from "@/components/shared/DurationInput";
import { FormulaBreakdown } from "@/components/shared/FormulaBreakdown";
import { InputWithUnit } from "@/components/shared/InputWithUnit";
import { ResultDisplay } from "@/components/shared/ResultDisplay";
import { ShareButton } from "@/components/shared/ShareButton";
import { Card, CardContent } from "@/components/ui/card";
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
import { formatDuration, hoursToMinutes, minutesToHours } from "@/lib/duration";
import { calculatePrintPricing } from "@/lib/formulas/printPricing";
import { savedAmountNotice } from "@/lib/savedAmountNotice";
import { useCalculatorState } from "@/lib/useCalculatorState";

import {
  DEFAULT_PRICING_STATE,
  EXAMPLE_CURRENCY,
  EXAMPLE_JOB,
  USD_EXAMPLE_QUERY,
  applyExample,
  changeCurrency,
  clearExample,
  editJobField,
  encodePricingState,
  exampleWouldFill,
  missingJobField,
  missingRateField,
  parsePricingState,
  type PricingState,
} from "./state";

const CURRENCY_CODES = CURRENCIES.map((c) => c.code);
const parseState = (params: URLSearchParams) => parsePricingState(params, CURRENCY_CODES);

const EYEBROW = "text-xs font-medium uppercase tracking-wide text-muted-foreground";
const QUIET_NOTE = "rounded-lg bg-accent px-4 py-3 text-sm leading-5 text-accent-foreground";
const FEES_LINE = "Before marketplace fees, shipping and packaging.";

const num = (v: number | ""): number => (typeof v === "number" ? v : 0);
const answered = (v: number | "") => v !== "" && Number.isFinite(v) && v >= 0;
const trim = (n: number) => n.toFixed(2).replace(/\.?0+$/, "");

export function Calculator() {
  const { state, setState, settings } = useCalculatorState(parseState, encodePricingState, {
    c: "currency", pp: "printerPrice", pl: "printerLifetimeHours",
  });

  const fmt = (v: number) => formatCurrency(v, state.currency);
  const currencySymbol = CURRENCIES.find((c) => c.code === state.currency)?.symbol ?? "$";
  const decimals = state.currency === "JPY" ? 0 : 2;

  // ---- What is still missing, in the order the visitor meets it ----------
  const missingJob = missingJobField(state);
  const missingPricing = !answered(state.laborRate)
    ? "your hourly rate"
    : state.markup < 1 || state.markup > 6 ? "a markup from 1× to 6×" : null;
  const missingSetup = !answered(state.printerPrice)
    ? "printer price"
    : !(answered(state.printerLifetimeHours) && num(state.printerLifetimeHours) > 0)
      ? "printer lifetime"
      : !answered(state.electricityCost)
        ? "power cost"
        : state.failureRatePercent < 0 || state.failureRatePercent >= 100 ? "a failure rate under 100%" : null;

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
    [state],
  );
  const hasPrice = !missingJob && !missingPricing && !missingSetup &&
    Object.values(result).every((value) => typeof value !== "number" || Number.isFinite(value));

  const nextStep = missingJob === "m" ? "Add material cost"
    : missingJob === "h" ? "Add print time"
      : missingJob === "lh" ? "Add hands-on time"
        : missingPricing ? `Add ${missingPricing}`
          : missingSetup ? `Add ${missingSetup}` : "Check the inputs";

  // A required setup amount that is empty must not hide inside a closed group.
  const [setupOpen, setSetupOpen] = useState(false);
  useEffect(() => {
    if (missingSetup) setSetupOpen(true);
  }, [missingSetup]);

  // ---- Examples versus the visitor's own numbers -------------------------
  const isExample = state.exampleFields.length > 0;
  const canTryExample = missingJob !== null && exampleWouldFill(state);
  const exampleText = state.exampleFields.length === 3
    ? "Example job in US dollars. Sample numbers, not your quote."
    : `Still using an example: ${state.exampleFields.map((field) =>
      field === "m" ? `material cost ${fmt(EXAMPLE_JOB.m)}`
        : field === "h" ? `print time ${formatDuration(EXAMPLE_JOB.h)}`
          : `hands-on time ${formatDuration(EXAMPLE_JOB.lh)}`).join(", ")}.`;
  const exampleCaption = state.currency === "USD"
    ? "Example values. Set your own."
    : "Example amounts are US-dollar figures. Replace them with yours.";
  const inExampleCurrency = state.currency === EXAMPLE_CURRENCY;
  // Sample amounts shown as placeholders are US-dollar figures too.
  const sample = (text: string) => (inExampleCurrency ? text : undefined);
  // Outside USD, any amount still equal to its US-dollar example is flagged on its own.
  const pricingIsExample = state.laborRate === DEFAULT_PRICING_STATE.laborRate &&
    (!inExampleCurrency || state.markup === DEFAULT_PRICING_STATE.markup);
  const setupHasUsdSample = !inExampleCurrency && (
    state.printerPrice === DEFAULT_PRICING_STATE.printerPrice ||
    state.electricityCost === DEFAULT_PRICING_STATE.electricityCost);
  const setupIsExample = state.printerPrice === DEFAULT_PRICING_STATE.printerPrice &&
    state.printerLifetimeHours === DEFAULT_PRICING_STATE.printerLifetimeHours &&
    state.electricityCost === DEFAULT_PRICING_STATE.electricityCost &&
    state.failureRatePercent === DEFAULT_PRICING_STATE.failureRatePercent;

  // The carried cost keeps full precision; the field only shows it as money.
  const material = state.materialCost;
  const carriedNote = typeof material === "number" && Math.abs(material - Number(material.toFixed(decimals))) > 1e-9
    ? `Using the unrounded amount from your last calculation (${formatCurrency(material, state.currency, { maximumFractionDigits: 6 })}).`
    : undefined;

  // ---- Where the price comes from ----------------------------------------
  const laborCost = result.laborCost;
  const markupAdds = result.failureAdjustedCost * (state.markup - 1);
  const failureAllowance = result.failureAdjustedCost - result.productionCost;
  const share = (part: number) => (result.suggestedPrice > 0 ? Math.round((part / result.suggestedPrice) * 100) : 0);
  const priceLabel = isExample ? "Example price" : "Suggested price";
  const handsOnText = formatDuration(num(state.laborHours)) || "0 min";

  const update = (patch: Partial<PricingState>) => setState((s) => ({ ...s, ...patch }));

  // Outside USD the quote needs the visitor's own three setup amounts.
  const ownRatesNote = !inExampleCurrency && missingRateField(state) !== null
    ? `Enter these in ${state.currency}. The US-dollar examples are not used here.`
    : null;
  const checklist: [string, boolean][] = [
    ["Material cost", answered(state.materialCost)],
    ["Print time", answered(state.printHours)],
    ["Hands-on time (0 is fine)", answered(state.laborHours)],
    ...(inExampleCurrency && missingRateField(state) === null ? [] : [
      ["Your hourly rate", answered(state.laborRate)],
      ["Printer price", answered(state.printerPrice)],
      ["Power for this print (0 is fine)", answered(state.electricityCost)],
    ] as [string, boolean][]),
  ];

  // Sample amounts are US-dollar figures. In another currency the example
  // fills times only, and the complete example stays one tap away in USD.
  const usdExampleNote = state.currency !== EXAMPLE_CURRENCY && (canTryExample || isExample) ? (
    <p className="text-xs leading-5 text-muted-foreground">
      In {state.currency} the example fills the two times only. Its amounts are US-dollar figures and are not copied here.{" "}
      <Link href={`/tools/print-pricing-calculator?${USD_EXAMPLE_QUERY}`} className="text-primary underline underline-offset-4">
        See the full example in US dollars
      </Link>
    </p>
  ) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <CalculatorSummary
        label={priceLabel}
        value={hasPrice ? fmt(result.suggestedPrice) : nextStep}
        detail={hasPrice ? `Break-even ${fmt(result.floorPrice)}` : undefined}
      />

      {/* On phones the two input cards sit either side of the result; on
          desktop they stack in the left column beside it. */}
      <div className="contents lg:col-start-1 lg:row-start-1 lg:flex lg:flex-col lg:gap-6">
        {/* ----- This job, and how it is priced ----- */}
        <Card className="glass-card order-1 py-5">
          <CardContent className="space-y-8">
            <section aria-labelledby="job-heading" className="space-y-5">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="job-heading" className={EYEBROW}>This job</h2>
                {canTryExample && (
                  <button
                    type="button"
                    onClick={() => setState((s) => applyExample(s))}
                    className="-my-2 min-h-11 rounded px-1 text-sm font-medium text-primary underline underline-offset-4"
                  >
                    Try an example
                  </button>
                )}
              </div>

              <InputWithUnit
                id="material"
                label={`Material cost (${currencySymbol})`}
                value={state.materialCost}
                onValueChange={(v) => setState((s) => editJobField(s, "m", v))}
                min={0}
                step={0.01}
                placeholder={sample("2.50")}
                blurDecimals={decimals}
                hint={carriedNote ?? "Filament for this print, purge included. The Filament Cost Calculator works it out."}
              />

              <DurationInput
                id="print-time"
                label="Print time"
                value={state.printHours}
                onValueChange={(v) => setState((s) => editJobField(s, "h", v))}
                hint="Copy it from your slicer after slicing. For prints over a day, add 24 hours per day."
              />

              <InputWithUnit
                id="hands-on"
                label="Hands-on time"
                value={hoursToMinutes(state.laborHours)}
                onValueChange={(v) => setState((s) => editJobField(s, "lh", minutesToHours(v)))}
                unit="min"
                min={0}
                step={5}
                hint="Prep, support removal, packing. Enter 0 if none."
              />
            </section>

            <section aria-labelledby="pricing-heading" className="space-y-5 border-t pt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h2 id="pricing-heading" className={EYEBROW}>Your pricing</h2>
                {pricingIsExample && <p className="text-xs text-muted-foreground">{exampleCaption}</p>}
                {!inExampleCurrency && state.laborRate === "" && (
                  <p className="text-xs text-muted-foreground">Enter your rate in {state.currency}.</p>
                )}
              </div>

              <InputWithUnit
                id="labor-rate"
                label={`Your hourly rate (${currencySymbol}/h)`}
                value={state.laborRate}
                onValueChange={(v) => update({ laborRate: v })}
                min={0}
                step={1}
                placeholder={sample("15")}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Markup</Label>
                  <span className="font-mono text-sm tabular-nums text-muted-foreground">{trim(state.markup)}×</span>
                </div>
                <Slider
                  aria-label="Markup"
                  value={[state.markup]}
                  min={1}
                  max={6}
                  step={0.25}
                  onValueChange={(vals) => update({ markup: Array.isArray(vals) ? vals[0] : vals })}
                />
                <p className="text-xs text-muted-foreground">Applied to production cost. Your time is added after.</p>
                {(state.markup < 1 || state.markup > 6) && <p className="text-xs text-destructive">Choose a multiplier from 1× to 6×.</p>}
              </div>
            </section>
          </CardContent>
        </Card>

        {/* ----- Printer, power and failures; currency; saved settings ----- */}
        <Card className="glass-card order-3 py-5">
          <CardContent className="space-y-5">
            <details
              open={setupOpen}
              onToggle={(event) => setSetupOpen(event.currentTarget.open)}
              className="group"
            >
              <summary className="cursor-pointer text-sm font-medium">
                Printer, power and failures
                <span className="mt-1 block text-xs font-normal leading-5 text-muted-foreground">
                  {setupIsExample ? "Example values: " : ""}
                  {state.printerPrice === "" ? "printer price missing" : `${fmt(num(state.printerPrice))} printer`},{" "}
                  {(state.printerLifetimeHours || 0).toLocaleString("en-US")} h life,{" "}
                  {state.electricityCost === "" ? "power missing" : `${fmt(num(state.electricityCost))} power`},{" "}
                  {state.failureRatePercent}% failures
                </span>
              </summary>
              <div className="mt-5 space-y-5">

              {setupHasUsdSample && (
                <p className="text-xs text-muted-foreground">{exampleCaption}</p>
              )}
              {!inExampleCurrency && (state.printerPrice === "" || state.electricityCost === "") && (
                <p className="text-xs text-muted-foreground">
                  Enter the printer price and power cost in {state.currency}. The US-dollar examples are not used here.
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <InputWithUnit
                  id="printer-price"
                  label={`Printer price (${currencySymbol})`}
                  value={state.printerPrice}
                  onValueChange={(v) => update({ printerPrice: v })}
                  min={0}
                  step={10}
                  placeholder={sample("350")}
                  notice={savedAmountNotice(settings.withheld, "pp")}
                />
                <InputWithUnit
                  id="printer-lifetime"
                  label="Expected lifetime"
                  value={state.printerLifetimeHours}
                  onValueChange={(v) => update({ printerLifetimeHours: v })}
                  unit="h"
                  min={1}
                  step={250}
                  placeholder="5000"
                />
              </div>

              <InputWithUnit
                id="electricity"
                label={`Power for this print (${currencySymbol})`}
                value={state.electricityCost}
                onValueChange={(v) => update({ electricityCost: v })}
                min={0}
                step={0.05}
                placeholder={sample("0.20")}
                hint="Your measured or estimated cost for this job. It depends on power use and your tariff."
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Failure rate</Label>
                  <span className="font-mono text-sm tabular-nums text-muted-foreground">{state.failureRatePercent}%</span>
                </div>
                <Slider
                  aria-label="Failure rate"
                  value={[state.failureRatePercent]}
                  min={0}
                  max={99}
                  step={1}
                  onValueChange={(vals) => update({ failureRatePercent: Array.isArray(vals) ? vals[0] : vals })}
                />
                <p className="text-xs text-muted-foreground">
                  Assumes each failed attempt uses the full production cost. Use your tracked rate.
                </p>
                {(state.failureRatePercent < 0 || state.failureRatePercent >= 100) && <p className="text-xs text-destructive">Choose a failure rate from 0% to 99%. At 100%, no successful print can cover the costs.</p>}
              </div>
              </div>
            </details>

            <div className="space-y-2 border-t pt-5">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={state.currency}
                items={CURRENCIES.map((c) => ({ value: c.code, label: `${c.symbol} ${c.code}` }))}
                onValueChange={(v) => setState((s) => changeCurrency(s, v as CurrencyCode))}
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
      </div>

      {/* ----- Result ----- */}
      <div
        id="calculator-results"
        tabIndex={-1}
        className="order-2 scroll-mt-40 space-y-4 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:self-start"
      >
        {isExample && (
          <div role="status" className={`${QUIET_NOTE} flex items-center justify-between gap-3`}>
            <span>{exampleText}</span>
            <button
              type="button"
              onClick={() => setState((s) => clearExample(s))}
              className="-my-2 min-h-11 shrink-0 rounded px-1 font-medium underline underline-offset-4"
            >
              Clear example
            </button>
          </div>
        )}

        {hasPrice ? (
          <>
            {usdExampleNote}
            <ResultDisplay
              prominent
              label={priceLabel}
              value={fmt(result.suggestedPrice)}
              sublabel={FEES_LINE}
              copyValue={fmt(result.suggestedPrice)}
            />

            <Card className="glass-card gap-5 p-5">
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className={EYEBROW}>Break-even</span>
                  <span className="font-mono text-xl font-medium tabular-nums">{fmt(result.floorPrice)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">The costs you entered, with no profit.</p>
              </div>

              <div className="space-y-3 border-t pt-4">
                <h3 className={EYEBROW}>Where the price comes from</h3>
                {result.suggestedPrice > 0 && (
                  <div>
                    {/* Parts are told apart by the gaps and their order, which the
                        line below repeats in words; the tints are a second cue. */}
                    <div className="flex h-2 gap-0.5 overflow-hidden rounded-full" aria-hidden>
                      {([
                        [result.failureAdjustedCost, "bg-primary"],
                        [markupAdds, "bg-primary/80"],
                        [laborCost, "bg-primary/65"],
                      ] as const).filter(([part]) => part > 0).map(([part, tint]) => (
                        <span key={tint} className={tint} style={{ width: `${(part / result.suggestedPrice) * 100}%` }} />
                      ))}
                    </div>
                    <p className="mt-1.5 text-xs tabular-nums text-muted-foreground">
                      Costs {share(result.failureAdjustedCost)}% · Markup {share(markupAdds)}% · Your time {share(laborCost)}%
                    </p>
                  </div>
                )}
                <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1.5 text-sm">
                  <dt className="text-muted-foreground">Material</dt>
                  <dd className="text-right font-mono tabular-nums">{fmt(num(state.materialCost))}</dd>
                  <dt className="text-muted-foreground">Power</dt>
                  <dd className="text-right font-mono tabular-nums">{fmt(num(state.electricityCost))}</dd>
                  <dt className="text-muted-foreground">Printer wear ({formatDuration(num(state.printHours)) || "0 min"})</dt>
                  <dd className="text-right font-mono tabular-nums">{fmt(result.machineCost)}</dd>
                  <dt className="border-t pt-1.5 font-medium">Production cost</dt>
                  <dd className="border-t pt-1.5 text-right font-mono font-medium tabular-nums">{fmt(result.productionCost)}</dd>
                  <dt className="text-muted-foreground">Failed-print allowance ({state.failureRatePercent}%)</dt>
                  <dd className="text-right font-mono tabular-nums">+ {fmt(failureAllowance)}</dd>
                  <dt className="text-muted-foreground">Markup {trim(state.markup)}× adds</dt>
                  <dd className="text-right font-mono tabular-nums">+ {fmt(markupAdds)}</dd>
                  <dt className="text-muted-foreground">Your time ({handsOnText} at {fmt(num(state.laborRate))}/h)</dt>
                  <dd className="text-right font-mono tabular-nums">+ {fmt(laborCost)}</dd>
                </dl>
                <p className="text-xs leading-5 text-muted-foreground">
                  Rows are rounded. The price uses unrounded values.
                </p>
              </div>
            </Card>

            <details className="rounded-lg border bg-card/60 p-4 text-sm">
              <summary className="cursor-pointer font-medium">More numbers</summary>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                All {FEES_LINE.charAt(0).toLowerCase() + FEES_LINE.slice(1)}{" "}
                <Link href="/guides/start-3d-printing-business" className="text-primary underline underline-offset-4">What fees to check</Link>
              </p>
              <dl className="mt-3 grid grid-cols-[1fr_auto] gap-x-6 gap-y-1.5">
                <dt className="text-muted-foreground">Profit</dt>
                <dd className="text-right font-mono tabular-nums">{fmt(result.profit)}</dd>
                <dt className="text-muted-foreground">Per hour of your time</dt>
                <dd className="text-right font-mono tabular-nums">{num(state.laborHours) > 0 ? fmt(result.effectiveHourlyRate) : "-"}</dd>
                <dt className="text-muted-foreground">Margin</dt>
                <dd className="text-right font-mono tabular-nums">{Math.round(result.marginPercent)}%</dd>
                <dt className="text-muted-foreground">Profit on 10 sales</dt>
                <dd className="text-right font-mono tabular-nums">{fmt(result.profit * 10)}</dd>
              </dl>
            </details>

            <div className="rounded-lg border bg-card/60 px-4">
            <FormulaBreakdown
              formula="price = (production ÷ (1 - failure_rate)) × markup + labor"
              steps={[
                { label: "material + power + wear", value: fmt(result.productionCost) },
                { label: `÷ (1 - ${state.failureRatePercent}% failures)`, value: fmt(result.failureAdjustedCost) },
                { label: `× ${trim(state.markup)} markup`, value: fmt(result.failureAdjustedCost * state.markup) },
                { label: `+ labor (${handsOnText} × ${fmt(num(state.laborRate))}/h)`, value: fmt(result.suggestedPrice) },
              ]}
              note="Markup is your chosen allowance. Check that the final price also covers marketplace fees, packaging, shipping and any other costs you have not entered."
            />
            </div>
          </>
        ) : (
          <Card className="glass-card gap-3 p-5">
            <div className={EYEBROW}>No quote yet</div>
            <ul className="space-y-2 text-sm">
              {checklist.map(([label, done]) => {
                return (
                  <li key={label} className="flex items-center gap-2">
                    {done
                      ? <Check className="size-4 shrink-0 text-primary" aria-hidden />
                      : <Circle className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
                    <span className={done ? "text-muted-foreground" : undefined}>{label}</span>
                    <span className="sr-only">{done ? "added" : "still needed"}</span>
                  </li>
                );
              })}
            </ul>
            {!missingJob && (missingPricing || missingSetup) && (
              <p className="text-sm">{nextStep} to see a price.</p>
            )}
            {ownRatesNote && <p className="text-xs leading-5 text-muted-foreground">{ownRatesNote}</p>}
            {canTryExample && (
              <p className="text-sm text-muted-foreground">
                Or{" "}
                <button
                  type="button"
                  onClick={() => setState((s) => applyExample(s))}
                  className="font-medium text-primary underline underline-offset-4"
                >
                  try an example
                </button>
                .
              </p>
            )}
            {usdExampleNote}
          </Card>
        )}

        <ShareButton className="w-full" />
      </div>
    </div>
  );
}
