"use client";

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
}: Props) {
  const hasUnitSelector = unitOptions && unitOptions.length > 1 && onUnitChange;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          value={value === "" ? "" : value}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") return onValueChange("");
            const num = Number(raw);
            if (!Number.isNaN(num)) onValueChange(num);
          }}
          className="font-mono"
        />
        {hasUnitSelector ? (
          <Select
            value={unit}
            onValueChange={(v) => {
              if (v !== null) onUnitChange!(v);
            }}
          >
            <SelectTrigger className="w-28">
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
          <div className="flex h-9 min-w-16 items-center justify-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
            {unit}
          </div>
        ) : null}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
