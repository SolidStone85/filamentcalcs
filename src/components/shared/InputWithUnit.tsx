"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type UnitOption = { value: string; label: string };

type Props = {
  id: string;
  label: string;
  value: number | "";
  onValueChange: (value: number | "") => void;
  unit?: string;
  unitOptions?: UnitOption[];
  onUnitChange?: (unit: string) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  hint?: string;
  className?: string;
  integer?: boolean;
  /** Extra line under the field, for example why a saved amount was not used. */
  notice?: string;
  /** Show the value rounded to this many decimals while the field is not being edited.
   *  The stored value keeps its full precision. */
  blurDecimals?: number;
  inputMode?: "decimal" | "numeric";
};

export function InputWithUnit({
  id,
  label,
  value,
  onValueChange,
  unit,
  unitOptions,
  onUnitChange,
  min,
  max,
  step,
  placeholder,
  hint,
  className,
  integer,
  notice,
  blurDecimals,
  inputMode = "decimal",
}: Props) {
  const [focused, setFocused] = useState(false);
  const shown = value === "" || blurDecimals === undefined || !Number.isFinite(value)
    ? value
    : Number(value.toFixed(focused ? Math.max(blurDecimals, 6) : blurDecimals));
  const hasUnitSelector = unitOptions && unitOptions.length > 1 && onUnitChange;
  const error = value === "" ? "" : !Number.isFinite(value) ? "Enter a finite number." :
    min !== undefined && value < min ? `Enter ${min} or more.` :
    max !== undefined && value > max ? `Enter ${max} or less.` :
    integer && !Number.isInteger(value) ? "Enter a whole number of prints." : "";

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={id}
          type="number"
          inputMode={inputMode}
          min={min}
          max={max}
          step={step}
          // A field left empty on purpose must look empty: no sample hint beside the notice.
          placeholder={notice ? undefined : placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          value={shown === "" ? "" : shown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") return onValueChange("");
            const num = Number(raw);
            if (!Number.isNaN(num)) onValueChange(num);
          }}
          className="scroll-mt-40 font-mono text-lg tabular-nums md:text-base"
        />
        {hasUnitSelector ? (
          <Select
            value={unit}
            items={unitOptions!.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            onValueChange={(v) => {
              if (v !== null) onUnitChange!(v);
            }}
          >
            <SelectTrigger className="h-10 w-28" aria-label={`${label} unit`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {unitOptions!.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : unit ? (
          <div className="flex h-10 min-w-16 items-center justify-center rounded-lg border bg-muted/60 px-3 font-mono text-sm text-muted-foreground">
            {unit}
          </div>
        ) : null}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-xs leading-5 text-muted-foreground">{hint}</p>
      )}
      {error && <p id={`${id}-error`} className="text-xs text-destructive">{error}</p>}
      {notice && <p role="status" className="rounded-md bg-accent px-3 py-2 text-xs leading-5 text-accent-foreground">{notice}</p>}
    </div>
  );
}
