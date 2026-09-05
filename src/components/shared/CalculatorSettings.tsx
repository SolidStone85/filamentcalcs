"use client";

import { Button } from "@/components/ui/button";

type Props = {
  remember: boolean;
  onRememberChange: (enabled: boolean) => void;
  onClear: () => void;
  onReset: () => void;
  error: string;
};

export function CalculatorSettings({ remember, onRememberChange, onClear, onReset, error }: Props) {
  return (
    <div className="space-y-3 border-t pt-4">
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-5">
        <input type="checkbox" checked={remember} onChange={(event) => onRememberChange(event.target.checked)} className="mt-0.5 size-4 accent-primary" />
        Remember my settings on this device
      </label>
      <p className="text-xs leading-5 text-muted-foreground">
        Saves currency, spool, printer and electricity-rate preferences in this browser. No account or past print jobs. Shared links take priority.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onReset}>Reset inputs</Button>
        <Button type="button" variant="ghost" size="sm" disabled={!remember} onClick={onClear}>Clear saved settings</Button>
      </div>
      {error && <p role="status" className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
