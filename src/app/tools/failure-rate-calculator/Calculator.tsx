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
import { CURRENCIES, formatCurrency, type CurrencyCode } from "@/lib/currency";
import { calculateFailureRate } from "@/lib/formulas/failureRate";
import { cn } from "@/lib/utils";

type State = {
  successful: number | "";
  failed: number | "";
  avgGrams: number | "";
  pricePerKg: number | "";
  currency: CurrencyCode;
};

const DEFAULT_STATE: State = {
  successful: "",
  failed: "",
  avgGrams: 50,
  pricePerKg: 20,
  currency: "USD",
};

function parseStateFromParams(params: URLSearchParams): State {
  const toNumOrEmpty = (s: string | null): number | "" => {
    if (s === null || s === "") return "";
    const n = Number(s);
    return Number.isFinite(n) ? n : "";
  };

  const c = params.get("c") as CurrencyCode | null;

  return {
    successful: toNumOrEmpty(params.get("s")),
    failed: toNumOrEmpty(params.get("f")),
    avgGrams:
      params.get("g") === null
        ? DEFAULT_STATE.avgGrams
        : toNumOrEmpty(params.get("g")),
    pricePerKg:
      params.get("p") === null
        ? DEFAULT_STATE.pricePerKg
        : toNumOrEmpty(params.get("p")),
    currency:
      c && CURRENCIES.some((x) => x.code === c) ? c : DEFAULT_STATE.currency,
  };
}

function encodeState(state: State): string {
  const p = new URLSearchParams();
  if (state.successful !== "") p.set("s", String(state.successful));
  if (state.failed !== "") p.set("f", String(state.failed));
  if (state.avgGrams !== "") p.set("g", String(state.avgGrams));
  if (state.pricePerKg !== "") p.set("p", String(state.pricePerKg));
  p.set("c", state.currency);
  return p.toString();
}

const BENCHMARK_COLORS: Record<
  "excellent" | "typical" | "investigate" | "serious",
  string
> = {
  excellent: "text-emerald-500",
  typical: "text-primary",
  investigate: "text-amber-500",
  serious: "text-destructive",
};

export function Calculator() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [state, setState] = useState<State>(() =>
    parseStateFromParams(new URLSearchParams(searchParams.toString())),
  );

  useEffect(() => {
    router.replace(`?${encodeState(state)}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const successful = typeof state.successful === "number" ? state.successful : 0;
  const failed = typeof state.failed === "number" ? state.failed : 0;
  const avgGrams = typeof state.avgGrams === "number" ? state.avgGrams : 0;
  const pricePerKg =
    typeof state.pricePerKg === "number" ? state.pricePerKg : 0;

  const hasInput = successful + failed > 0;

  const result = useMemo(
    () =>
      calculateFailureRate({
        successfulPrints: successful,
        failedPrints: failed,
        avgGramsPerPrint: avgGrams,
        pricePerKg: pricePerKg,
      }),
    [successful, failed, avgGrams, pricePerKg],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <InputWithUnit
            id="successful"
            label="Successful prints"
            value={state.successful}
            onValueChange={(v) => setState((s) => ({ ...s, successful: v }))}
            unit="prints"
            min={0}
            step={1}
            placeholder="20"
            hint="Prints completed without issue over your tracking period."
          />

          <InputWithUnit
            id="failed"
            label="Failed prints"
            value={state.failed}
            onValueChange={(v) => setState((s) => ({ ...s, failed: v }))}
            unit="prints"
            min={0}
            step={1}
            placeholder="3"
            hint="Prints you had to stop, trash, or reprint."
          />

          <InputWithUnit
            id="avg-grams"
            label="Average filament per print"
            value={state.avgGrams}
            onValueChange={(v) => setState((s) => ({ ...s, avgGrams: v }))}
            unit="g"
            min={0}
            step={5}
            placeholder="50"
            hint="Rough typical weight of your prints. Used to estimate wasted filament."
          />

          <InputWithUnit
            id="price"
            label="Filament price per kg"
            value={state.pricePerKg}
            onValueChange={(v) =>
              setState((s) => ({ ...s, pricePerKg: v }))
            }
            min={0}
            step={0.5}
            placeholder="20"
          />

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-primary">Currency</Label>
            <Select
              value={state.currency}
              onValueChange={(v) => {
                if (v !== null)
                  setState((s) => ({ ...s, currency: v as CurrencyCode }));
              }}
            >
              <SelectTrigger>
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

      <div className="space-y-4">
        <ResultDisplay
          prominent
          label="Failure rate"
          value={hasInput ? `${result.failureRatePercent.toFixed(1)}%` : "-"}
          sublabel={
            hasInput
              ? `${failed} of ${result.totalPrints} prints failed`
              : "Enter successful + failed print counts to calculate."
          }
          copyValue={
            hasInput ? `${result.failureRatePercent.toFixed(1)}%` : undefined
          }
        />

        {hasInput && (
          <>
            <Card className="glass-card gap-2 p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Benchmark
              </div>
              <div
                className={cn(
                  "text-lg font-medium",
                  BENCHMARK_COLORS[result.benchmark],
                )}
              >
                {result.benchmarkLabel}
              </div>
              <div className="text-xs text-muted-foreground">
                Under 5% excellent, 5 to 10% typical, 10 to 20%
                investigate, over 20% serious issue.
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Filament wasted"
                value={`${result.wastedGrams.toFixed(0)} g`}
                sublabel={`${failed} failed × ${avgGrams} g avg`}
              />
              <ResultDisplay
                label="Money wasted"
                value={formatCurrency(result.wastedCost, state.currency)}
              />
            </div>

            <FormulaBreakdown
              formula="failure_rate = failed / (successful + failed) × 100"
              steps={[
                { label: "successful", value: `${successful} prints` },
                { label: "failed", value: `${failed} prints` },
                { label: "total", value: `${result.totalPrints} prints` },
                {
                  label: "failure rate",
                  value: `${result.failureRatePercent.toFixed(1)}%`,
                },
              ]}
              note="Benchmark bands are community consensus, not scientific. Your mileage will vary with printer, filament brand, and what you're printing. Tracking the number over time is more useful than a single snapshot."
            />
          </>
        )}

        <ShareButton className="w-full" />
      </div>
    </div>
  );
}
