"use client";

import { useMemo } from "react";
import { useCalculatorState } from "@/lib/useCalculatorState";
import { CalculatorSummary } from "@/components/shared/CalculatorSummary";

import { FormulaBreakdown } from "@/components/shared/FormulaBreakdown";
import { InputWithUnit } from "@/components/shared/InputWithUnit";
import { ResultDisplay } from "@/components/shared/ResultDisplay";
import { ShareButton } from "@/components/shared/ShareButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateEnoughFilament } from "@/lib/formulas/enoughFilament";

// --- URL state helpers ---------------------------------------------------
// State lives in query params so results are shareable. Keys kept short:
//   r = remaining grams, g = print grams, w = waste %, pg = purge grams

type State = {
  remainingGrams: number | "";
  printGrams: number | "";
  wastePercent: number; // 0..15
  purgeGrams: number | "";
};

const DEFAULT_STATE: State = {
  remainingGrams: "",
  printGrams: "",
  wastePercent: 5,
  purgeGrams: "",
};

function parseStateFromParams(params: URLSearchParams): State {
  const toNumOrEmpty = (s: string | null): number | "" => {
    if (s === null || s === "") return "";
    const n = Number(s);
    return Number.isFinite(n) && n >= 0 ? n : "";
  };
  const w = params.get("w");
  return {
    remainingGrams: toNumOrEmpty(params.get("r")),
    printGrams: toNumOrEmpty(params.get("g")),
    wastePercent:
      w === null ? DEFAULT_STATE.wastePercent : Number.isFinite(Number(w)) && w !== "" ? Number(w) : -1,
    purgeGrams: toNumOrEmpty(params.get("pg")),
  };
}

function encodeState(state: State): string {
  const p = new URLSearchParams();
  p.set("r", String(state.remainingGrams));
  p.set("g", String(state.printGrams));
  p.set("w", String(state.wastePercent));
  p.set("pg", String(state.purgeGrams));
  return p.toString();
}

// -----------------------------------------------------------------------

export function Calculator() {
  const { state, setState } = useCalculatorState(parseStateFromParams, encodeState, {});

  const remainingNum =
    typeof state.remainingGrams === "number" ? state.remainingGrams : 0;
  const printNum = typeof state.printGrams === "number" ? state.printGrams : 0;
  const purgeNum = typeof state.purgeGrams === "number" ? state.purgeGrams : 0;
  const validInputs = state.remainingGrams !== "" && remainingNum >= 0 && printNum > 0 && purgeNum >= 0 &&
    [remainingNum, printNum, purgeNum].every(Number.isFinite) && state.wastePercent >= 0 && state.wastePercent <= 15;

  const result = useMemo(
    () =>
      calculateEnoughFilament({
        remainingGrams: remainingNum,
        printGrams: printNum,
        wastePercent: state.wastePercent,
        purgeGrams: purgeNum,
      }),
    [remainingNum, printNum, state.wastePercent, purgeNum],
  );
  const hasInput = validInputs && Object.values(result).every((value) => typeof value !== "number" || Number.isFinite(value));

  const tone =
    result.verdict === "plenty"
      ? ("success" as const)
      : result.verdict === "close"
        ? ("caution" as const)
        : ("danger" as const);

  const shortAnswer =
    result.verdict === "plenty"
      ? "Yes"
      : result.verdict === "close"
        ? "Risky"
        : "No";

  const spareLabel =
    result.spareGrams >= 0
      ? `${result.spareGrams.toFixed(0)} g to spare after waste`
      : `short by ${Math.abs(result.spareGrams).toFixed(0)} g`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <CalculatorSummary label="Will it finish?" value={hasInput ? shortAnswer : "Enter weights"} detail={hasInput ? spareLabel : undefined} />
      {/* ----- Inputs ----- */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <InputWithUnit
              id="remaining"
              label="Filament left on the spool"
              value={state.remainingGrams}
              onValueChange={(v) =>
                setState((s) => ({ ...s, remainingGrams: v }))
              }
              unit="g"
              min={0}
              step={5}
              placeholder="320"
            />
            <p className="text-xs leading-5 text-muted-foreground">
              Don't know it? Weigh the spool and subtract the empty weight in
              the{" "}
              <a
                href="/tools/remaining-spool-calculator"
                className="underline underline-offset-4"
              >
                Remaining Filament Calculator
              </a>
              , then choose its link to check a print with that result.
            </p>
          </div>

          <InputWithUnit
            id="print-grams"
            label="Print weight from your slicer"
            value={state.printGrams}
            onValueChange={(v) => setState((s) => ({ ...s, printGrams: v }))}
            unit="g"
            min={0}
            step={5}
            placeholder="260"
            hint="Use the whole slicer total if available. If it includes purge and supports, leave additional purge at 0 to avoid counting it twice."
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Waste margin</Label>
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {state.wastePercent}%
              </span>
            </div>
            <Slider
              aria-label="Extra waste margin"
              value={[state.wastePercent]}
              min={0}
              max={15}
              step={1}
              onValueChange={(vals) => {
                const next = Array.isArray(vals) ? vals[0] : vals;
                setState((s) => ({ ...s, wastePercent: next }));
              }}
            />
            <p className="text-xs text-muted-foreground">
              An optional allowance above the weight entered. Start at 0% for a complete slicer total; add headroom only for material not included in that total.
            </p>
            {(state.wastePercent < 0 || state.wastePercent > 15) && <p className="text-xs text-destructive">Choose an extra waste margin from 0% to 15%.</p>}
          </div>

          <div className="space-y-2">
            <InputWithUnit
              id="purge"
              label="Additional purge not already included"
              value={state.purgeGrams}
              onValueChange={(v) => setState((s) => ({ ...s, purgeGrams: v }))}
              unit="g"
              min={0}
              step={5}
              placeholder="0"
            />
            <p className="text-xs leading-5 text-muted-foreground">
              Leave at 0 when your slicer weight already includes it. For AMS color swaps, get the
              number from the{" "}
              <a
                href="/tools/ams-purge-waste-calculator"
                className="underline underline-offset-4"
              >
                AMS Purge Waste Calculator
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ----- Results ----- */}
      <div id="calculator-results" tabIndex={-1} className="scroll-mt-40 space-y-4 lg:sticky lg:top-24 lg:self-start">
        <ResultDisplay
          prominent
          tone={hasInput ? tone : undefined}
          label="Will it finish?"
          value={hasInput ? shortAnswer : "-"}
          sublabel={
            hasInput
              ? `${result.verdictLabel}: ${spareLabel}.`
              : "Enter what's left and what the print needs."
          }
        />

        {hasInput && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Total needed"
                value={result.neededGrams.toFixed(0)}
                unit="g"
              />
              <ResultDisplay
                tone={tone}
                label={result.spareGrams >= 0 ? "Spare after print" : "Shortfall"}
                value={Math.abs(result.spareGrams).toFixed(0)}
                unit="g"
              />
            </div>

            <div className="rounded-lg border bg-card/70 p-4 text-sm leading-6 text-muted-foreground">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide">
                What I'd do
              </p>
              {result.recommendation}
            </div>

            <FormulaBreakdown
              formula="needed = print_grams × (1 + waste%) + purge"
              steps={[
                { label: "print weight", value: `${printNum} g` },
                {
                  label: `× (1 + ${state.wastePercent}% waste)`,
                  value: `${(printNum * (1 + state.wastePercent / 100)).toFixed(0)} g`,
                },
                {
                  label: `+ purge`,
                  value: `${result.neededGrams.toFixed(0)} g needed`,
                },
                {
                  label: `vs ${remainingNum} g on the spool`,
                  value:
                    result.spareGrams >= 0
                      ? `${result.spareGrams.toFixed(0)} g spare`
                      : `${Math.abs(result.spareGrams).toFixed(0)} g short`,
                },
              ]}
              note="The verdict wants headroom of 8% of the job (at least 10 g) before it calls a print safe. Slicer estimates drift, and the last meters on a spool are the most likely to be kinked or damp."
            />
          </>
        )}

        <ShareButton className="w-full" />
      </div>
    </div>
  );
}
