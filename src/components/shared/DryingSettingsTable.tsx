"use client";

import { useState } from "react";

import { DRYING_SETTINGS } from "@/lib/dryingSettings";
import { cn } from "@/lib/utils";

const MATERIALS = [...new Set(DRYING_SETTINGS.map((row) => row.material))];

// Maker drying settings with a material picker, so a reader can cut the
// table down to the two to four rows for their filament. Every row is in
// the server-rendered HTML; the picker only hides rows.
export function DryingSettingsTable() {
  const [material, setMaterial] = useState<string | null>(null);
  const rows = material
    ? DRYING_SETTINGS.filter((row) => row.material === material)
    : DRYING_SETTINGS;

  return (
    <div className="not-prose space-y-3">
      <div
        role="group"
        aria-label="Show drying settings for one material"
        className="flex flex-wrap gap-2"
      >
        {[null, ...MATERIALS].map((option) => {
          const active = material === option;
          return (
            <button
              key={option ?? "all"}
              type="button"
              aria-pressed={active}
              onClick={() => setMaterial(option)}
              className={cn(
                "min-h-9 rounded-md border px-3 text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted",
              )}
            >
              {option ?? "All materials"}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-xs leading-6">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-2 text-left font-medium">Material</th>
              <th className="px-3 py-2 text-left font-medium">Product</th>
              <th className="px-3 py-2 text-left font-medium">Equipment</th>
              <th className="px-3 py-2 text-left font-medium">Setting</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const firstOfMaterial =
                i === 0 || rows[i - 1].material !== row.material;
              return (
                <tr
                  key={`${row.product}-${row.method}`}
                  className={cn(
                    "align-top",
                    firstOfMaterial && i > 0 ? "border-t-2" : "border-t",
                  )}
                >
                  <td className="px-3 py-2 font-medium">
                    {firstOfMaterial ? row.material : ""}
                  </td>
                  <td className="px-3 py-2">
                    <a
                      href={row.source.url}
                      className="underline"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {row.product}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {row.method}
                  </td>
                  <td className="px-3 py-2 font-mono tabular-nums whitespace-nowrap">
                    {row.tempC} °C, {row.hours} h
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
