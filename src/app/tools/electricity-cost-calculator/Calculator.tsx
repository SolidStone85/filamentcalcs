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
import { calculateElectricityCost } from "@/lib/formulas/electricityCost";
import {
  ELECTRICITY_RATE_PRESETS,
  getElectricityRatePreset,
} from "@/lib/presets/electricityRates";
import {
  PRINTER_PRESETS,
  getPrinterPreset,
} from "@/lib/presets/printers";

type State = {
  printerId: string;
  customWatts: number | "";
  hours: number | "";
  rateId: string;
  customRate: number | "";
  currency: CurrencyCode;
};

const DEFAULT_STATE: State = {
  printerId: "bambu-x1c",
  customWatts: 115,
  hours: "",
  rateId: "us-avg",
  customRate: 0.18,
  currency: "USD",
};

function parseStateFromParams(params: URLSearchParams): State {
  const toNumOrEmpty = (s: string | null): number | "" => {
    if (s === null || s === "") return "";
    const n = Number(s);
    return Number.isFinite(n) ? n : "";
  };

  const printerId = params.get("p");
  const rateId = params.get("r");
  const c = params.get("c") as CurrencyCode | null;

  return {
    printerId:
      printerId && PRINTER_PRESETS.some((p) => p.id === printerId)
        ? printerId
        : DEFAULT_STATE.printerId,
    customWatts:
      params.get("w") === null
        ? DEFAULT_STATE.customWatts
        : toNumOrEmpty(params.get("w")),
    hours: toNumOrEmpty(params.get("h")),
    rateId:
      rateId && ELECTRICITY_RATE_PRESETS.some((r) => r.id === rateId)
        ? rateId
        : DEFAULT_STATE.rateId,
    customRate:
      params.get("rt") === null
        ? DEFAULT_STATE.customRate
        : toNumOrEmpty(params.get("rt")),
    currency:
      c && CURRENCIES.some((x) => x.code === c) ? c : DEFAULT_STATE.currency,
  };
}

function encodeState(state: State): string {
  const p = new URLSearchParams();
  p.set("p", state.printerId);
  if (state.printerId === "custom" && state.customWatts !== "") {
    p.set("w", String(state.customWatts));
  }
  if (state.hours !== "") p.set("h", String(state.hours));
  p.set("r", state.rateId);
  if (state.rateId === "custom" && state.customRate !== "") {
    p.set("rt", String(state.customRate));
  }
  p.set("c", state.currency);
  return p.toString();
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

  const printerPreset = getPrinterPreset(state.printerId);
  const watts =
    state.printerId === "custom"
      ? typeof state.customWatts === "number"
        ? state.customWatts
        : 0
      : printerPreset?.wattsAverage ?? 0;

  const ratePreset = getElectricityRatePreset(state.rateId);
  const rate =
    state.rateId === "custom"
      ? typeof state.customRate === "number"
        ? state.customRate
        : 0
      : ratePreset?.ratePerKwh ?? 0;

  // Apply currency from rate preset unless user overrode it
  useEffect(() => {
    if (state.rateId !== "custom" && ratePreset) {
      if (state.currency !== ratePreset.currency) {
        setState((s) => ({ ...s, currency: ratePreset.currency }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.rateId]);

  const hoursNum = typeof state.hours === "number" ? state.hours : 0;
  const hasInput = hoursNum > 0 && watts > 0 && rate > 0;

  const result = useMemo(
    () =>
      calculateElectricityCost({
        watts,
        hours: hoursNum,
        ratePerKwh: rate,
      }),
    [watts, hoursNum, rate],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="printer" className="text-sm font-medium">
              Printer
            </Label>
            <Select
              value={state.printerId}
              onValueChange={(v) => {
                if (v !== null) setState((s) => ({ ...s, printerId: v }));
              }}
            >
              <SelectTrigger id="printer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRINTER_PRESETS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                    {p.id !== "custom" && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ~{p.wattsAverage} W
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {state.printerId === "custom" && (
            <InputWithUnit
              id="watts"
              label="Custom wattage"
              value={state.customWatts}
              onValueChange={(v) =>
                setState((s) => ({ ...s, customWatts: v }))
              }
              unit="W"
              min={0}
              step={5}
              placeholder="115"
              hint="Check your printer's power draw with a wattmeter (Kill A Watt or similar). Ignore idle draw, use print-time average."
            />
          )}

          <InputWithUnit
            id="hours"
            label="Print duration"
            value={state.hours}
            onValueChange={(v) => setState((s) => ({ ...s, hours: v }))}
            unit="hours"
            min={0}
            step={0.25}
            placeholder="8"
            hint="Use your slicer's estimate or the Print Time Estimator."
          />

          <div className="space-y-1.5">
            <Label htmlFor="rate" className="text-sm font-medium">
              Electricity rate
            </Label>
            <Select
              value={state.rateId}
              onValueChange={(v) => {
                if (v !== null) setState((s) => ({ ...s, rateId: v }));
              }}
            >
              <SelectTrigger id="rate">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ELECTRICITY_RATE_PRESETS.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.label}
                    {r.id !== "custom" && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {r.ratePerKwh} {r.currency}/kWh
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Your actual rate is on your utility bill. Regional averages
              are fine for a ballpark.
            </p>
          </div>

          {state.rateId === "custom" && (
            <InputWithUnit
              id="custom-rate"
              label="Custom rate"
              value={state.customRate}
              onValueChange={(v) =>
                setState((s) => ({ ...s, customRate: v }))
              }
              unit="per kWh"
              min={0}
              step={0.01}
              placeholder="0.18"
            />
          )}

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Currency</Label>
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
          label="Electricity cost for this print"
          value={
            hasInput ? formatCurrency(result.cost, state.currency) : "-"
          }
          sublabel={
            hasInput
              ? `${result.kwhUsed.toFixed(2)} kWh at ${rate} ${state.currency}/kWh`
              : "Enter print duration to calculate."
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
                label="kWh used"
                value={`${result.kwhUsed.toFixed(3)} kWh`}
              />
              <ResultDisplay
                label="Cost per hour"
                value={formatCurrency(
                  result.costPerHour,
                  state.currency,
                  { minimumFractionDigits: 3, maximumFractionDigits: 3 },
                )}
              />
            </div>

            <FormulaBreakdown
              formula="cost = (watts ÷ 1000) × hours × rate_per_kWh"
              steps={[
                { label: "watts", value: `${watts} W` },
                {
                  label: "÷ 1000",
                  value: `${(watts / 1000).toFixed(3)} kW`,
                },
                {
                  label: "× hours",
                  value: `${(watts / 1000 * hoursNum).toFixed(3)} kWh`,
                },
                {
                  label: "× rate",
                  value: formatCurrency(result.cost, state.currency),
                },
              ]}
              note="Most hobbyists are surprised how small this number is. A 12 hour print on a Bambu X1C at the US average rate costs under 25 cents. Filament dominates total print cost by a wide margin."
            />
          </>
        )}

        <ShareButton className="w-full" />
      </div>
    </div>
  );
}
