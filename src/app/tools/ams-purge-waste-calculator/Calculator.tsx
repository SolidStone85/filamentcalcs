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
import { calculateAmsPurgeWaste } from "@/lib/formulas/amsPurgeWaste";
import { cn } from "@/lib/utils";

// AMS profile presets. Purge grams per swap vary by printer + slicer settings.
// These are community-consensus defaults.
const AMS_PROFILES: {
  id: string;
  label: string;
  purgePerSwap: number;
}[] = [
  { id: "bambu-x1c-default", label: "Bambu X1C / P1S (default)", purgePerSwap: 8 },
  { id: "bambu-a1", label: "Bambu A1 / A1 Mini", purgePerSwap: 6 },
  { id: "bambu-light", label: "Bambu light purge (tuned)", purgePerSwap: 5 },
  { id: "bambu-heavy", label: "Bambu heavy purge (default settings)", purgePerSwap: 12 },
  { id: "custom", label: "Custom", purgePerSwap: 8 },
];

type State = {
  profileId: string;
  colorSwaps: number | "";
  purgePerSwap: number;
  actualPrintGrams: number | "";
  pricePerKg: number | "";
  currency: CurrencyCode;
};

const DEFAULT_STATE: State = {
  profileId: "bambu-x1c-default",
  colorSwaps: "",
  purgePerSwap: 8,
  actualPrintGrams: "",
  pricePerKg: 20,
  currency: "USD",
};

function parseStateFromParams(params: URLSearchParams): State {
  const toNumOrEmpty = (s: string | null): number | "" => {
    if (s === null || s === "") return "";
    const n = Number(s);
    return Number.isFinite(n) ? n : "";
  };
  const pid = params.get("p");
  const c = params.get("c") as CurrencyCode | null;
  return {
    profileId:
      pid && AMS_PROFILES.some((p) => p.id === pid) ? pid : DEFAULT_STATE.profileId,
    colorSwaps: toNumOrEmpty(params.get("s")),
    purgePerSwap:
      params.get("pg") === null
        ? DEFAULT_STATE.purgePerSwap
        : Math.max(2, Math.min(30, Number(params.get("pg")) || 8)),
    actualPrintGrams: toNumOrEmpty(params.get("g")),
    pricePerKg:
      params.get("pp") === null
        ? DEFAULT_STATE.pricePerKg
        : toNumOrEmpty(params.get("pp")),
    currency:
      c && CURRENCIES.some((x) => x.code === c) ? c : DEFAULT_STATE.currency,
  };
}

function encodeState(state: State): string {
  const p = new URLSearchParams();
  p.set("p", state.profileId);
  if (state.colorSwaps !== "") p.set("s", String(state.colorSwaps));
  p.set("pg", String(state.purgePerSwap));
  if (state.actualPrintGrams !== "") p.set("g", String(state.actualPrintGrams));
  if (state.pricePerKg !== "") p.set("pp", String(state.pricePerKg));
  p.set("c", state.currency);
  return p.toString();
}

function verdictForPercent(percent: number): {
  label: string;
  color: string;
  advice: string;
} {
  if (percent < 15) {
    return {
      label: "Reasonable",
      color: "text-emerald-500",
      advice: "Purge waste is in the normal range for multi-color prints.",
    };
  }
  if (percent < 30) {
    return {
      label: "Noticeable",
      color: "text-primary",
      advice: "Purge is a real cost here. Worth double-checking swap count.",
    };
  }
  if (percent < 50) {
    return {
      label: "High",
      color: "text-amber-500",
      advice:
        "You are wasting more than a quarter of your filament on purge. Consider reducing colors or swap count.",
    };
  }
  return {
    label: "Extreme",
    color: "text-destructive",
    advice:
      "Over half of your filament is going to purge. For this print, multi-color is costing more than the print itself.",
  };
}

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

  function applyProfile(id: string) {
    const profile = AMS_PROFILES.find((p) => p.id === id);
    if (!profile) return;
    setState((s) => ({
      ...s,
      profileId: id,
      ...(id === "custom" ? {} : { purgePerSwap: profile.purgePerSwap }),
    }));
  }

  const swaps = typeof state.colorSwaps === "number" ? state.colorSwaps : 0;
  const grams =
    typeof state.actualPrintGrams === "number" ? state.actualPrintGrams : 0;
  const price = typeof state.pricePerKg === "number" ? state.pricePerKg : 0;
  const hasInput = swaps > 0 && grams > 0 && price > 0;

  const result = useMemo(
    () =>
      calculateAmsPurgeWaste({
        colorSwaps: swaps,
        purgePerSwapGrams: state.purgePerSwap,
        actualPrintGrams: grams,
        pricePerKg: price,
      }),
    [swaps, state.purgePerSwap, grams, price],
  );

  const verdict = verdictForPercent(result.purgeWastePercent);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="profile" className="text-sm font-medium text-primary">
              AMS profile
            </Label>
            <Select
              value={state.profileId}
              onValueChange={(v) => {
                if (v !== null) applyProfile(v);
              }}
            >
              <SelectTrigger id="profile">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AMS_PROFILES.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                    {p.id !== "custom" && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {p.purgePerSwap}g per swap
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Pick your printer and typical purge settings. Custom lets you set
              the exact grams-per-swap yourself.
            </p>
          </div>

          <InputWithUnit
            id="swaps"
            label="Number of color swaps"
            value={state.colorSwaps}
            onValueChange={(v) =>
              setState((s) => ({ ...s, colorSwaps: v }))
            }
            unit="swaps"
            min={0}
            step={1}
            placeholder="40"
            hint="Look at your slicer's multi-color preview or swap counter. Bambu Studio shows this under 'flush data.'"
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-primary">
                Purge per swap
              </Label>
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {state.purgePerSwap} g
              </span>
            </div>
            <Slider
              value={[state.purgePerSwap]}
              min={2}
              max={30}
              step={1}
              onValueChange={(vals) => {
                const next = Array.isArray(vals) ? vals[0] : vals;
                setState((s) => ({
                  ...s,
                  purgePerSwap: next,
                  profileId: "custom",
                }));
              }}
            />
            <p className="text-xs text-muted-foreground">
              Bambu&apos;s default flush is 8g per swap. Tuned profiles can drop
              to 4-6g. Default-setting prints can hit 12-15g.
            </p>
          </div>

          <InputWithUnit
            id="actual-grams"
            label="Actual print weight (excluding purge)"
            value={state.actualPrintGrams}
            onValueChange={(v) =>
              setState((s) => ({ ...s, actualPrintGrams: v }))
            }
            unit="g"
            min={0}
            step={1}
            placeholder="80"
            hint="The weight of the model itself, not including flushed material. Bambu Studio separates this in the preview."
          />

          <InputWithUnit
            id="price"
            label="Avg filament price per kg"
            value={state.pricePerKg}
            onValueChange={(v) =>
              setState((s) => ({ ...s, pricePerKg: v }))
            }
            min={0}
            step={0.5}
            placeholder="20"
            hint="For multi-color prints, use an average across the colors you&apos;re using."
          />

          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-primary">
              Currency
            </Label>
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
          label="Purge waste for this print"
          value={
            hasInput
              ? formatCurrency(result.totalPurgeCost, state.currency)
              : "-"
          }
          sublabel={
            hasInput
              ? `${result.totalPurgeGrams.toFixed(0)} g wasted (${result.purgeWastePercent.toFixed(1)}% of all filament)`
              : "Enter swaps, print weight, and price to calculate."
          }
          copyValue={
            hasInput
              ? formatCurrency(result.totalPurgeCost, state.currency)
              : undefined
          }
        />

        {hasInput && (
          <>
            <Card className="glass-card gap-2 p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Verdict
              </div>
              <div className={cn("text-lg font-medium", verdict.color)}>
                {verdict.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {verdict.advice}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Total filament used"
                value={`${result.totalFilamentGrams.toFixed(0)} g`}
                sublabel={formatCurrency(
                  result.totalFilamentCost,
                  state.currency,
                )}
              />
              <ResultDisplay
                label="Cost per color swap"
                value={formatCurrency(result.costPerSwap, state.currency, {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })}
              />
            </div>

            <FormulaBreakdown
              formula="purge_grams = swaps × grams_per_swap
waste_percent = purge_grams / (purge + print) × 100"
              steps={[
                { label: "color swaps", value: `${swaps}` },
                {
                  label: "× purge per swap",
                  value: `${state.purgePerSwap} g`,
                },
                {
                  label: "= total purge",
                  value: `${result.totalPurgeGrams.toFixed(0)} g`,
                },
                {
                  label: "purge cost",
                  value: formatCurrency(
                    result.totalPurgeCost,
                    state.currency,
                  ),
                },
                {
                  label: "waste fraction",
                  value: `${result.purgeWastePercent.toFixed(1)}%`,
                },
              ]}
              note="Purge waste is not captured in most filament cost calculators. For multi-color prints it can dominate the total cost. Bambu Studio's 'flush data' panel shows the exact per-swap purge being used by your current settings."
            />
          </>
        )}

        <ShareButton className="w-full" />
      </div>
    </div>
  );
}
