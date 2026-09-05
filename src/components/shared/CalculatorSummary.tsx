"use client";

type Props = { label: string; value: string; detail?: string };

/** Stays above the inputs on phones, never over the keyboard at the bottom. */
export function CalculatorSummary({ label, value, detail }: Props) {
  return (
    <div className="sticky top-16 z-20 flex items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3 lg:hidden">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="break-words font-mono text-xl font-medium tabular-nums">{value}</p>
        {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
      </div>
      <a href="#calculator-results" className="shrink-0 rounded-md px-2 py-2 text-sm font-medium text-primary underline underline-offset-4">Details</a>
    </div>
  );
}
