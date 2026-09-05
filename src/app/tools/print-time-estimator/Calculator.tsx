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
import { calculatePrintTime } from "@/lib/formulas/printTime";
import {
  PRINTER_PRESETS,
  getPrinterPreset,
} from "@/lib/presets/printers";

type State = {
  grams: number | "";
  printerId: string;
  customThroughput: number | "";
};

const DEFAULT_STATE: State = {
  grams: "",
  printerId: "bambu-x1c",
  customThroughput: 20,
};

function parseStateFromParams(params: URLSearchParams): State {
  const g = params.get("g");
  const id = params.get("p");
  const t = params.get("t");

  const toNumOrEmpty = (s: string | null): number | "" => {
    if (s === null || s === "") return "";
    const n = Number(s);
    return Number.isFinite(n) ? n : "";
  };

  return {
    grams: toNumOrEmpty(g),
    printerId:
      id && PRINTER_PRESETS.some((p) => p.id === id)
        ? id
        : DEFAULT_STATE.printerId,
    customThroughput:
      t === null ? DEFAULT_STATE.customThroughput : toNumOrEmpty(t),
  };
}

function encodeState(state: State): string {
  const p = new URLSearchParams();
  p.set("g", String(state.grams));
  p.set("p", state.printerId);
  if (state.printerId === "custom") {
    p.set("t", String(state.customThroughput));
  }
  return p.toString();
}

const PRINTER_ITEMS = PRINTER_PRESETS.map((p) => ({
  value: p.id,
  label: p.label,
}));

export function Calculator() {
  const { state, setState, settings } = useCalculatorState(parseStateFromParams, encodeState, { p: "printerId", t: "throughput" });

  const preset = getPrinterPreset(state.printerId);
  const throughput =
    state.printerId === "custom"
      ? typeof state.customThroughput === "number"
        ? state.customThroughput
        : 0
      : preset?.throughputGramsPerHour ?? 0;

  const gramsNum = typeof state.grams === "number" ? state.grams : 0;
  const validInputs = gramsNum > 0 && throughput > 0 && [gramsNum, throughput].every(Number.isFinite);

  const result = useMemo(
    () =>
      calculatePrintTime({
        gramsUsed: gramsNum,
        throughputGramsPerHour: throughput,
      }),
    [gramsNum, throughput],
  );
  const hasInput = validInputs && Object.values(result).every((value) => typeof value !== "number" || Number.isFinite(value));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <CalculatorSummary label="Estimated print time" value={hasInput ? result.formatted : "Enter weight"} />
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="printer">Printer class</Label>
            <Select
              value={state.printerId}
              items={PRINTER_ITEMS}
              onValueChange={(v) => {
                if (v !== null) setState((s) => ({ ...s, printerId: v }));
              }}
            >
              <SelectTrigger id="printer" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRINTER_PRESETS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                    {p.id !== "custom" && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {p.throughputGramsPerHour} g/hr
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Throughput is how many grams of filament your printer extrudes
              per hour at typical settings. Picking the right class sets a
              realistic starting number.
            </p>
          </div>

          <InputWithUnit
            id="grams"
            label="Filament used"
            value={state.grams}
            onValueChange={(v) => setState((s) => ({ ...s, grams: v }))}
            unit="g"
            min={0.01}
            step={1}
            placeholder="500"
            hint="Copy from your slicer's filament weight estimate."
          />

          {state.printerId === "custom" && (
            <InputWithUnit
              id="throughput"
              label="Custom throughput"
              value={state.customThroughput}
              onValueChange={(v) =>
                setState((s) => ({ ...s, customThroughput: v }))
              }
              unit="g/hr"
              min={0.01}
              step={1}
              placeholder="20"
              hint="Check your last few slicer estimates: divide grams by hours."
            />
          )}
          <CalculatorSettings {...settings} />
        </CardContent>
      </Card>

      <div id="calculator-results" tabIndex={-1} className="scroll-mt-40 space-y-4 lg:sticky lg:top-24 lg:self-start">
        <ResultDisplay
          prominent
          label="Estimated print time"
          value={hasInput ? result.formatted : "-"}
          sublabel={
            hasInput
              ? `${gramsNum} g at ${throughput} g/hr = ${result.hours.toFixed(2)} hours`
              : "Enter filament weight to estimate."
          }
          copyValue={hasInput ? result.formatted : undefined}
        />

        {hasInput && (
          <FormulaBreakdown
            formula="time_hours = grams / throughput_g_per_hour"
            steps={[
              { label: "grams used", value: `${gramsNum} g` },
              { label: "÷ throughput", value: `${throughput} g/hr` },
              {
                label: "= raw hours",
                value: result.hours.toFixed(3),
              },
              { label: "formatted", value: result.formatted },
            ]}
            note="This is a rough ballpark. Real print time varies with layer height, speed, infill, and geometry. Your slicer's estimate is always more accurate for a specific file."
          />
        )}

        <ShareButton className="w-full" />
      </div>
    </div>
  );
}
