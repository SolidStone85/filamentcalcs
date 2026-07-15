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
import { calculateRemainingSpool } from "@/lib/formulas/remainingSpool";
import { SPOOL_PRESETS, getSpoolPreset } from "@/lib/presets/spools";
import { cn } from "@/lib/utils";

// --- URL state -----------------------------------------------------------
//   c = current total weight (g)
//   e = empty spool weight (g)
//   o = original filament weight (g)
//   p = price per kg
//   cur = currency
//   sp = spool preset id

type State = {
  currentWeight: number | "";
  emptySpoolWeight: number | "";
  originalWeight: number | "";
  pricePerKg: number | "";
  currency: CurrencyCode;
  spoolPresetId: string;
};

const DEFAULT_STATE: State = {
  currentWeight: "",
  emptySpoolWeight: 220,
  originalWeight: 1000,
  pricePerKg: 22,
  currency: "USD",
  spoolPresetId: "standard-plastic",
};

function parseStateFromParams(params: URLSearchParams): State {
  const toNumOrEmpty = (s: string | null): number | "" => {
    if (s === null || s === "") return "";
    const n = Number(s);
    return Number.isFinite(n) ? n : "";
  };

  const cur = params.get("cur") as CurrencyCode | null;
  const spId = params.get("sp");

  return {
    currentWeight: toNumOrEmpty(params.get("c")),
    emptySpoolWeight:
      params.get("e") === null
        ? DEFAULT_STATE.emptySpoolWeight
        : toNumOrEmpty(params.get("e")),
    originalWeight:
      params.get("o") === null
        ? DEFAULT_STATE.originalWeight
        : toNumOrEmpty(params.get("o")),
    pricePerKg:
      params.get("p") === null
        ? DEFAULT_STATE.pricePerKg
        : toNumOrEmpty(params.get("p")),
    currency:
      cur && CURRENCIES.some((x) => x.code === cur)
        ? cur
        : DEFAULT_STATE.currency,
    spoolPresetId:
      spId && SPOOL_PRESETS.some((p) => p.id === spId)
        ? spId
        : DEFAULT_STATE.spoolPresetId,
  };
}

function encodeState(state: State): string {
  const p = new URLSearchParams();
  if (state.currentWeight !== "") p.set("c", String(state.currentWeight));
  if (state.emptySpoolWeight !== "") p.set("e", String(state.emptySpoolWeight));
  if (state.originalWeight !== "") p.set("o", String(state.originalWeight));
  if (state.pricePerKg !== "") p.set("p", String(state.pricePerKg));
  p.set("cur", state.currency);
  p.set("sp", state.spoolPresetId);
  return p.toString();
}

const SPOOL_ITEMS = SPOOL_PRESETS.map((p) => ({
  value: p.id,
  label: p.label,
}));

const CURRENCY_ITEMS = CURRENCIES.map((c) => ({
  value: c.code,
  label: `${c.symbol} ${c.code}`,
}));

const STATUS_COLORS: Record<"plenty" | "low" | "near-empty", string> = {
  plenty: "text-emerald-500",
  low: "text-amber-500",
  "near-empty": "text-destructive",
};

// -----------------------------------------------------------------------

type CalculatorProps = {
  /**
   * Preset to start on when the URL carries no spool state. Used by the
   * per-brand landing pages; the shared calculator page passes nothing.
   * Display-level default only: any `sp` URL param still wins.
   */
  initialSpoolPresetId?: string;
};

export function Calculator({ initialSpoolPresetId }: CalculatorProps = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [state, setState] = useState<State>(() => {
    const parsed = parseStateFromParams(
      new URLSearchParams(searchParams.toString()),
    );
    // Apply the brand-page default only when the URL carries no explicit
    // spool state at all. Any bookmarked `sp` or `e` param must still win.
    if (
      initialSpoolPresetId &&
      !searchParams.get("sp") &&
      !searchParams.get("e") &&
      SPOOL_PRESETS.some((p) => p.id === initialSpoolPresetId)
    ) {
      const preset = getSpoolPreset(initialSpoolPresetId);
      return {
        ...parsed,
        spoolPresetId: preset.id,
        emptySpoolWeight: preset.emptyWeightGrams,
      };
    }
    return parsed;
  });

  useEffect(() => {
    router.replace(`?${encodeState(state)}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const currentWeight =
    typeof state.currentWeight === "number" ? state.currentWeight : 0;
  const emptySpoolWeight =
    typeof state.emptySpoolWeight === "number" ? state.emptySpoolWeight : 0;
  const originalWeight =
    typeof state.originalWeight === "number" ? state.originalWeight : 1000;
  const pricePerKg =
    typeof state.pricePerKg === "number" ? state.pricePerKg : 0;

  const hasInput = currentWeight > 0 && emptySpoolWeight > 0;

  const result = useMemo(
    () =>
      calculateRemainingSpool({
        currentTotalWeightGrams: currentWeight,
        emptySpoolWeightGrams: emptySpoolWeight,
        originalFilamentWeightGrams: originalWeight,
        pricePerKg,
      }),
    [currentWeight, emptySpoolWeight, originalWeight, pricePerKg],
  );

  const status: "plenty" | "low" | "near-empty" =
    result.percentRemaining >= 30
      ? "plenty"
      : result.percentRemaining >= 10
        ? "low"
        : "near-empty";

  const statusLabel: Record<typeof status, string> = {
    plenty: "Plenty left",
    low: "Getting low",
    "near-empty": "Near empty",
  };

  const presetIsCustom = state.spoolPresetId === "custom";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <InputWithUnit
            id="current-weight"
            label="Current total weight on scale"
            value={state.currentWeight}
            onValueChange={(v) =>
              setState((s) => ({ ...s, currentWeight: v }))
            }
            unit="g"
            min={0}
            step={1}
            placeholder="540"
            hint="Weigh the spool with filament still on it. A kitchen scale is plenty accurate."
          />

          <div className="space-y-2">
            <Label htmlFor="spool-type">Spool type</Label>
            <Select
              value={state.spoolPresetId}
              items={SPOOL_ITEMS}
              onValueChange={(v) => {
                if (v === null) return;
                const preset = getSpoolPreset(v);
                setState((s) => ({
                  ...s,
                  spoolPresetId: v,
                  emptySpoolWeight:
                    v === "custom" ? s.emptySpoolWeight : preset.emptyWeightGrams,
                }));
              }}
            >
              <SelectTrigger id="spool-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPOOL_PRESETS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                    {p.id !== "custom" && (
                      <span className="ml-2 text-muted-foreground">
                        ~{p.emptyWeightGrams} g
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <InputWithUnit
            id="empty-spool"
            label="Empty spool weight"
            value={state.emptySpoolWeight}
            onValueChange={(v) =>
              setState((s) => ({
                ...s,
                emptySpoolWeight: v,
                spoolPresetId: "custom",
              }))
            }
            unit="g"
            min={0}
            step={5}
            placeholder="220"
            hint={
              presetIsCustom
                ? "Weigh an empty spool of the same type once. Save the number for next time."
                : "Auto-set from spool type. Override if your spool weighs differently."
            }
          />

          <InputWithUnit
            id="original-weight"
            label="Original filament weight"
            value={state.originalWeight}
            onValueChange={(v) => setState((s) => ({ ...s, originalWeight: v }))}
            unit="g"
            min={0}
            step={50}
            placeholder="1000"
            hint="Filament weight when the spool was new. Standard 1 kg spool = 1000 g."
          />

          <InputWithUnit
            id="price"
            label="Spool price per kg (optional)"
            value={state.pricePerKg}
            onValueChange={(v) => setState((s) => ({ ...s, pricePerKg: v }))}
            min={0}
            step={0.5}
            placeholder="22"
            hint="Used to estimate the dollar value of filament left on the spool."
          />

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={state.currency}
              items={CURRENCY_ITEMS}
              onValueChange={(v) => {
                if (v !== null)
                  setState((s) => ({ ...s, currency: v as CurrencyCode }));
              }}
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

      <div className="space-y-4">
        <ResultDisplay
          prominent
          label="Filament remaining"
          value={hasInput ? result.remainingGrams.toFixed(0) : "-"}
          unit={hasInput ? "g" : undefined}
          sublabel={
            hasInput
              ? `${result.percentRemaining.toFixed(1)}% of original ${originalWeight} g spool`
              : "Enter current weight + spool type to calculate."
          }
          copyValue={
            hasInput ? `${result.remainingGrams.toFixed(0)} g` : undefined
          }
        />

        {hasInput && (
          <>
            <Card className="glass-card gap-2 p-5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Status
              </div>
              <div
                className={cn("text-lg font-medium", STATUS_COLORS[status])}
              >
                {statusLabel[status]}
              </div>
              <div className="text-xs text-muted-foreground">
                Plenty: 30%+ remaining. Low: 10 to 30%. Near empty: under
                10%, time to think about ordering more.
              </div>
            </Card>

            {pricePerKg > 0 && (
              <ResultDisplay
                label="Approximate value remaining"
                value={formatCurrency(result.valueRemaining, state.currency)}
                sublabel={`At ${formatCurrency(pricePerKg, state.currency)} per kg`}
              />
            )}

            {result.belowEmpty && (
              <Card className="glass-card gap-2 border-destructive/40 p-5">
                <div className="text-xs font-medium uppercase tracking-wide text-destructive">
                  Input check
                </div>
                <div className="text-sm text-destructive">
                  Current weight is less than the empty spool weight. Either
                  the spool is fully empty, or one of the input values is
                  wrong.
                </div>
              </Card>
            )}

            {result.overFull && !result.belowEmpty && (
              <Card className="glass-card gap-2 border-amber-500/40 p-5">
                <div className="text-xs font-medium uppercase tracking-wide text-amber-500">
                  Input check
                </div>
                <div className="text-sm text-amber-500">
                  Calculated remaining is more than the original filament
                  weight. Probably means the empty spool weight is set too
                  low for this spool type.
                </div>
              </Card>
            )}

            <FormulaBreakdown
              formula="remaining = current_total_weight - empty_spool_weight"
              steps={[
                { label: "current total weight", value: `${currentWeight} g` },
                { label: "empty spool weight", value: `${emptySpoolWeight} g` },
                {
                  label: "remaining filament",
                  value: `${result.remainingGrams.toFixed(0)} g`,
                },
                {
                  label: "percent remaining",
                  value: `${result.percentRemaining.toFixed(1)}%`,
                },
              ]}
              note="Empty spool weight varies by manufacturer (Bambu reusable spool with a refill core ~233 g, cardboard spools ~140-205 g, most plastic spools 200-230 g). Weigh one empty spool of each type you use, write it on the spool with a Sharpie, save yourself this question forever."
            />
          </>
        )}

        <ShareButton className="w-full" />
      </div>
    </div>
  );
}
