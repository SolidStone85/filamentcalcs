"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CalculatorSettings } from "@/components/shared/CalculatorSettings";
import { CalculatorSummary } from "@/components/shared/CalculatorSummary";
import { useCalculatorState } from "@/lib/useCalculatorState";
import { savedAmountNotice } from "@/lib/savedAmountNotice";

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
import { calculateFilamentLength } from "@/lib/formulas/filamentLength";
import { MATERIAL_DATASHEETS } from "@/lib/presets/materialDatasheets";
import { MATERIALS_FULL } from "@/lib/presets/materialsFull";

// --- URL state -----------------------------------------------------------
//   d   = direction: "g" (grams to meters) or "m" (meters to grams)
//   a   = amount in grams or meters
//   dia = filament diameter (mm)
//   mat = density preset (datasheet materialId) or "custom"
//   rho = density (g/cm³), only when mat is custom
//   p   = price per kg (optional)
//   cur = currency

type Direction = "g" | "m";

type State = {
  direction: Direction;
  amount: number | "";
  diameter: number | "";
  materialId: string;
  density: number | "";
  pricePerKg: number | "";
  currency: CurrencyCode;
};

const DEFAULT_STATE: State = {
  direction: "g",
  amount: "",
  diameter: 1.75,
  materialId: "pla",
  density: 1.24,
  pricePerKg: "",
  currency: "USD",
};

const DENSITY_PRESETS = MATERIAL_DATASHEETS.map((sheet) => ({
  id: sheet.materialId,
  label: `${MATERIALS_FULL.find((m) => m.id === sheet.materialId)?.label ?? sheet.materialId}: ${sheet.product.replace(/ \(.*\)$/, "")}`,
  density: sheet.densityGPerCm3,
}));

function presetDensity(id: string): number | undefined {
  return DENSITY_PRESETS.find((p) => p.id === id)?.density;
}

function parseStateFromParams(params: URLSearchParams): State {
  const toNumOrEmpty = (s: string | null): number | "" => {
    if (s === null || s === "") return "";
    const n = Number(s);
    return Number.isFinite(n) ? n : "";
  };
  const mat = params.get("mat");
  const materialId =
    mat === "custom" || (mat && presetDensity(mat) !== undefined)
      ? mat
      : DEFAULT_STATE.materialId;
  const cur = params.get("cur") as CurrencyCode | null;

  return {
    direction: params.get("d") === "m" ? "m" : "g",
    amount: toNumOrEmpty(params.get("a")),
    diameter:
      params.get("dia") === null
        ? DEFAULT_STATE.diameter
        : toNumOrEmpty(params.get("dia")),
    materialId,
    density:
      materialId === "custom"
        ? params.get("rho") === null
          ? DEFAULT_STATE.density
          : toNumOrEmpty(params.get("rho"))
        : presetDensity(materialId)!,
    pricePerKg: toNumOrEmpty(params.get("p")),
    currency:
      cur && CURRENCIES.some((x) => x.code === cur)
        ? cur
        : DEFAULT_STATE.currency,
  };
}

function encodeState(state: State): string {
  const p = new URLSearchParams();
  p.set("d", state.direction);
  p.set("a", String(state.amount));
  p.set("dia", String(state.diameter));
  p.set("mat", state.materialId);
  if (state.materialId === "custom") p.set("rho", String(state.density));
  if (state.pricePerKg !== "") p.set("p", String(state.pricePerKg));
  p.set("cur", state.currency);
  return p.toString();
}

const DIRECTION_ITEMS = [
  { value: "g", label: "Grams to length" },
  { value: "m", label: "Length to grams" },
];

const MATERIAL_ITEMS = [
  ...DENSITY_PRESETS.map((p) => ({ value: p.id, label: p.label })),
  { value: "custom", label: "Custom density" },
];

const CURRENCY_ITEMS = CURRENCIES.map((c) => ({
  value: c.code,
  label: `${c.symbol} ${c.code}`,
}));

export function Calculator() {
  const { state, setState, settings } = useCalculatorState(
    parseStateFromParams,
    encodeState,
    { dia: "filamentDiameter", p: "pricePerKg", cur: "currency" },
  );

  const amount = typeof state.amount === "number" ? state.amount : 0;
  const diameter = typeof state.diameter === "number" ? state.diameter : 0;
  const density = typeof state.density === "number" ? state.density : 0;
  const pricePerKg = typeof state.pricePerKg === "number" ? state.pricePerKg : 0;

  const result = useMemo(
    () =>
      calculateFilamentLength({
        amount,
        direction: state.direction,
        diameterMm: diameter,
        densityGPerCm3: density,
        pricePerKg,
      }),
    [amount, state.direction, diameter, density, pricePerKg],
  );
  const hasInput =
    state.amount !== "" &&
    state.diameter !== "" &&
    state.density !== "" &&
    Number.isFinite(result.meters);
  const hasPrice = hasInput && pricePerKg > 0 && Number.isFinite(result.cost);
  const gramsLabel = state.direction === "g";

  const headline = !hasInput
    ? gramsLabel
      ? "Enter grams"
      : "Enter meters"
    : gramsLabel
      ? `${result.meters.toFixed(1)} m`
      : `${result.grams.toFixed(1)} g`;

  const costLink = new URLSearchParams({ g: String(Math.round(result.grams * 10) / 10) });
  if (hasPrice) costLink.set("p", String(pricePerKg));
  costLink.set("c", state.currency);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <CalculatorSummary
        label={gramsLabel ? "Filament length" : "Filament weight"}
        value={headline}
      />
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="direction">Convert</Label>
            <Select
              value={state.direction}
              items={DIRECTION_ITEMS}
              onValueChange={(v) => {
                if (v === "g" || v === "m")
                  setState((s) => ({ ...s, direction: v }));
              }}
            >
              <SelectTrigger id="direction" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIRECTION_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <InputWithUnit
            id="amount"
            label={gramsLabel ? "Filament weight" : "Filament length"}
            value={state.amount}
            onValueChange={(v) => setState((s) => ({ ...s, amount: v }))}
            unit={gramsLabel ? "g" : "m"}
            min={0}
            step={gramsLabel ? 1 : 0.1}
            placeholder={gramsLabel ? "250" : "10"}
            hint={
              gramsLabel
                ? "Net filament only. On a spool, subtract the empty spool weight first."
                : "Slicers often report filament used in meters."
            }
          />

          <InputWithUnit
            id="diameter"
            label="Filament diameter"
            value={state.diameter}
            onValueChange={(v) => setState((s) => ({ ...s, diameter: v }))}
            unit="mm"
            min={0}
            step={0.05}
            placeholder="1.75"
            hint="Most printers use 1.75 mm; some use 2.85 mm."
          />

          <div className="space-y-2">
            <Label htmlFor="material">Density</Label>
            <Select
              value={state.materialId}
              items={MATERIAL_ITEMS}
              onValueChange={(v) => {
                if (v === null) return;
                setState((s) => ({
                  ...s,
                  materialId: v,
                  density: v === "custom" ? s.density : presetDensity(v)!,
                }));
              }}
            >
              <SelectTrigger id="material" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DENSITY_PRESETS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                    <span className="ml-2 text-muted-foreground">
                      {p.density} g/cm³
                    </span>
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom density</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Presets come from each named product&apos;s data sheet. Other
              brands and blends differ; use your filament&apos;s own density
              if its data sheet lists one.
            </p>
          </div>

          <InputWithUnit
            id="density"
            label="Density value"
            value={state.density}
            onValueChange={(v) =>
              setState((s) => ({ ...s, density: v, materialId: "custom" }))
            }
            unit="g/cm³"
            min={0}
            step={0.01}
            placeholder="1.24"
            hint="Auto-set from the preset. Typing here switches to a custom density."
          />

          <InputWithUnit
            id="price"
            label="Spool price per kg (optional)"
            value={state.pricePerKg} notice={savedAmountNotice(settings.withheld, "p")}
            onValueChange={(v) => setState((s) => ({ ...s, pricePerKg: v }))}
            min={0}
            step={0.5}
            placeholder="24"
            hint="Adds cost per meter and the cost of this amount."
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
            <p className="text-xs text-muted-foreground">
              Sets the symbol. Your numbers stay in the currency you type,
              nothing is converted.
            </p>
          </div>
          <CalculatorSettings {...settings} />
        </CardContent>
      </Card>

      <div id="calculator-results" tabIndex={-1} className="scroll-mt-40 space-y-4 lg:sticky lg:top-24 lg:self-start">
        <ResultDisplay
          prominent
          label={gramsLabel ? "Filament length" : "Filament weight"}
          value={
            hasInput
              ? gramsLabel
                ? result.meters.toFixed(1)
                : result.grams.toFixed(1)
              : "-"
          }
          unit={hasInput ? (gramsLabel ? "m" : "g") : undefined}
          sublabel={
            hasInput
              ? gramsLabel
                ? `${(result.meters * 3.28084).toFixed(0)} ft at ${diameter} mm and ${density} g/cm³`
                : `${result.meters} m at ${diameter} mm and ${density} g/cm³`
              : "Enter an amount, diameter and density to calculate."
          }
          copyValue={hasInput ? headline : undefined}
        />

        {hasInput && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay
                label="Weight per meter"
                value={result.gramsPerMeter.toFixed(3)}
                unit="g/m"
              />
              <ResultDisplay
                label="Length per kg"
                value={(1000 / result.gramsPerMeter).toFixed(0)}
                unit="m"
              />
            </div>

            {hasPrice && (
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay
                  label="Cost per meter"
                  value={formatCurrency(result.costPerMeter, state.currency, {
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })}
                />
                <ResultDisplay
                  label="Cost of this amount"
                  value={formatCurrency(result.cost, state.currency)}
                />
              </div>
            )}

            <Link
              href={`/tools/filament-cost-calculator?${costLink}`}
              className="flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Price these grams with waste included
            </Link>

            <FormulaBreakdown
              formula="g_per_m = density × π × (diameter ÷ 2)²"
              steps={[
                { label: "diameter", value: `${diameter} mm` },
                { label: "density", value: `${density} g/cm³` },
                { label: "weight per meter", value: `${result.gramsPerMeter.toFixed(3)} g` },
                gramsLabel
                  ? { label: "meters = grams ÷ g_per_m", value: `${result.meters.toFixed(2)} m` }
                  : { label: "grams = meters × g_per_m", value: `${result.grams.toFixed(2)} g` },
              ]}
              note="A 1 m length of filament is a cylinder; its volume in cm³ equals the cross-section area in mm². Real filament diameter and density vary a little by product and batch, so treat the result as an estimate."
            />
          </>
        )}

        <ShareButton className="w-full" />
      </div>
    </div>
  );
}
