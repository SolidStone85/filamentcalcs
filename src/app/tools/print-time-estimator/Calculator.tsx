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
  if (state.grams !== "") p.set("g", String(state.grams));
  p.set("p", state.printerId);
  if (state.printerId === "custom" && state.customThroughput !== "") {
    p.set("t", String(state.customThroughput));
  }
  return p.toString();
}

export function Calculator() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [state, setState] = useState<State>(() =>
    parseStateFromParams(new URLSearchParams(searchParams.toString())),
  );

  useEffect(() => {
    const query = encodeState(state);
    router.replace(`?${query}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const preset = getPrinterPreset(state.printerId);
  const throughput =
    state.printerId === "custom"
      ? typeof state.customThroughput === "number"
        ? state.customThroughput
        : 0
      : preset?.throughputGramsPerHour ?? 0;

  const gramsNum = typeof state.grams === "number" ? state.grams : 0;
  const hasInput = gramsNum > 0 && throughput > 0;

  const result = useMemo(
    () =>
      calculatePrintTime({
        gramsUsed: gramsNum,
        throughputGramsPerHour: throughput,
      }),
    [gramsNum, throughput],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="printer" className="text-sm font-medium text-primary">
              Printer class
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
            min={0}
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
              min={1}
              step={1}
              placeholder="20"
              hint="Check your last few slicer estimates: divide grams by hours."
            />
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
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
