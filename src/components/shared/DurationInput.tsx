"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { joinHours, splitHours } from "@/lib/duration";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label: string;
  /** Decimal hours, or "" when unanswered. */
  value: number | "";
  onValueChange: (value: number | "") => void;
  hint?: string;
  className?: string;
};

const toText = (value: number | "") => (value === "" ? "" : String(value));
const toNumber = (text: string): number | "" => (text.trim() === "" || Number.isNaN(Number(text)) ? "" : Number(text));
const same = (a: number | "", b: number | "") => (a === "" || b === "" ? a === b : Math.abs(a - b) < 1e-9);

/** Print time the way slicers show it: hours and minutes. Stored as decimal hours. */
export function DurationInput({ id, label, value, onValueChange, hint, className }: Props) {
  const initial = splitHours(value);
  const [hours, setHours] = useState(toText(initial.hours));
  const [minutes, setMinutes] = useState(toText(initial.minutes));

  // Follow changes that come from outside the boxes: a link, Reset, an example.
  useEffect(() => {
    if (same(joinHours(toNumber(hours), toNumber(minutes)), value)) return;
    const next = splitHours(value);
    setHours(toText(next.hours));
    setMinutes(toText(next.minutes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const hoursNum = toNumber(hours);
  const minutesNum = toNumber(minutes);
  const error = (hoursNum !== "" && hoursNum < 0) || (minutesNum !== "" && minutesNum < 0) ? "Enter 0 or more." : "";

  function update(nextHours: string, nextMinutes: string) {
    setHours(nextHours);
    setMinutes(nextMinutes);
    onValueChange(joinHours(toNumber(nextHours), toNumber(nextMinutes)));
  }

  const boxClass = "scroll-mt-40 font-mono text-lg tabular-nums md:text-base";
  const unitClass = "flex h-10 min-w-12 items-center justify-center rounded-lg border bg-muted/60 px-3 font-mono text-sm text-muted-foreground";

  return (
    <fieldset className={cn("space-y-2", className)}>
      <legend className="mb-2 text-sm font-medium leading-none">{label}</legend>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex gap-2">
          <Input
            id={`${id}-hours`}
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            aria-label={`${label}, hours`}
            aria-invalid={Boolean(error)}
            aria-describedby={hint ? `${id}-hint` : undefined}
            value={hours}
            onChange={(event) => update(event.target.value, minutes)}
            className={boxClass}
          />
          <div className={unitClass}>h</div>
        </div>
        <div className="flex gap-2">
          <Input
            id={`${id}-minutes`}
            type="number"
            inputMode="decimal"
            min={0}
            step={1}
            aria-label={`${label}, minutes`}
            aria-invalid={Boolean(error)}
            aria-describedby={hint ? `${id}-hint` : undefined}
            value={minutes}
            onChange={(event) => update(hours, event.target.value)}
            className={boxClass}
          />
          <div className={unitClass}>min</div>
        </div>
      </div>
      {hint && <p id={`${id}-hint`} className="text-xs leading-5 text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </fieldset>
  );
}
