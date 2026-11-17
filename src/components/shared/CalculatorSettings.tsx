"use client";

import { Button } from "@/components/ui/button";

type Props = {
  remember: boolean;
  onRememberChange: (enabled: boolean) => void;
  onClear: () => void;
  onReset: () => void;
  error: string;
  /** Passed through from useCalculatorState; shown beside the fields themselves. */
  withheld?: unknown;
  legacyAmounts?: boolean;
  onDismissLegacy?: () => void;
};

export function CalculatorSettings({ remember, onRememberChange, onClear, onReset, error, legacyAmounts, onDismissLegacy }: Props) {
  return (
    <div className="space-y-3 border-t pt-4">
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-5">
        <input type="checkbox" checked={remember} onChange={(event) => onRememberChange(event.target.checked)} className="mt-0.5 size-4 accent-primary" />
        Remember my settings on this device
      </label>
      <p className="text-xs leading-5 text-muted-foreground">
        Saves currency, spool, printer and electricity-rate preferences in this browser. Amounts are remembered per currency and never converted. No account or past print jobs. Shared links take priority.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onReset}>Reset inputs</Button>
        <Button type="button" variant="ghost" size="sm" disabled={!remember} onClick={onClear}>Clear saved settings</Button>
      </div>
      {legacyAmounts && (
        <p role="status" className="rounded-md bg-accent px-3 py-2 text-xs leading-5 text-accent-foreground">
          Prices saved by an earlier version are no longer used, because that version did not record their currency. Enter them again and they will be remembered per currency.{" "}
          <button type="button" onClick={onDismissLegacy} className="font-medium underline underline-offset-4">Got it</button>
        </p>
      )}
      {error && <p role="status" className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
