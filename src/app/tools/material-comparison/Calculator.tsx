"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, X } from "lucide-react";

import { ShareButton } from "@/components/shared/ShareButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MATERIALS_FULL,
  type MaterialFull,
} from "@/lib/presets/materialsFull";
import { cn } from "@/lib/utils";

const DEFAULT_SELECTED = ["pla", "petg", "abs"];

function parseSelected(params: URLSearchParams): string[] {
  const m = params.get("m");
  if (!m) return DEFAULT_SELECTED;
  const ids = m.split(",").filter((id) => MATERIALS_FULL.some((mat) => mat.id === id));
  return ids.length > 0 ? ids : DEFAULT_SELECTED;
}

function encodeSelected(ids: string[]): string {
  const p = new URLSearchParams();
  p.set("m", ids.join(","));
  return p.toString();
}

function StarRating({ value }: { value: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 w-4 rounded-sm",
            i <= value ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: MaterialFull["difficulty"] }) {
  const colors: Record<MaterialFull["difficulty"], string> = {
    Easy: "bg-emerald-500/15 text-emerald-500",
    Moderate: "bg-amber-500/15 text-amber-500",
    Hard: "bg-destructive/15 text-destructive",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        colors[difficulty],
      )}
    >
      {difficulty}
    </span>
  );
}

export function Calculator() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selected, setSelected] = useState<string[]>(() =>
    parseSelected(new URLSearchParams(searchParams.toString())),
  );

  useEffect(() => {
    router.replace(`?${encodeSelected(selected)}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  function toggle(id: string) {
    setSelected((s) => {
      if (s.includes(id)) {
        // Don't allow zero selected
        if (s.length === 1) return s;
        return s.filter((x) => x !== id);
      }
      // Max 4 for readability
      if (s.length >= 4) return s;
      return [...s, id];
    });
  }

  const materials = selected
    .map((id) => MATERIALS_FULL.find((m) => m.id === id))
    .filter((m): m is MaterialFull => !!m);

  return (
    <div className="space-y-6">
      {/* Selector */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Pick materials to compare (up to 4)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {MATERIALS_FULL.map((m) => {
              const isSelected = selected.includes(m.id);
              const disabled = !isSelected && selected.length >= 4;
              return (
                <Button
                  key={m.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggle(m.id)}
                  disabled={disabled}
                  className={cn(disabled && "opacity-40")}
                >
                  {isSelected && <Check className="mr-1 h-3.5 w-3.5" />}
                  {m.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Comparison grid */}
      <div
        className={cn(
          "grid gap-4",
          materials.length === 1 && "sm:grid-cols-1",
          materials.length === 2 && "sm:grid-cols-2",
          materials.length === 3 && "sm:grid-cols-3",
          materials.length === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {materials.map((m) => (
          <Card key={m.id} className="glass-card">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle>{m.label}</CardTitle>
                <DifficultyBadge difficulty={m.difficulty} />
              </div>
              <p className="text-sm text-muted-foreground">{m.tagline}</p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-2">
                <dt className="text-muted-foreground">Nozzle</dt>
                <dd className="font-mono">{m.nozzleTempC}°C</dd>
                <dt className="text-muted-foreground">Bed</dt>
                <dd className="font-mono">{m.bedTempC}°C</dd>
                <dt className="text-muted-foreground">Density</dt>
                <dd className="font-mono">{m.densityGPerCm3} g/cm³</dd>
                <dt className="text-muted-foreground">Shrinkage</dt>
                <dd className="font-mono">~{m.shrinkagePercent}%</dd>
                <dt className="text-muted-foreground">Typical price</dt>
                <dd className="font-mono">${m.typicalPriceUsdPerKg}/kg</dd>
              </dl>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Strength</span>
                  <StarRating value={m.strengthRating} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Flex</span>
                  <StarRating value={m.flexRating} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Outdoor OK</span>
                  {m.outdoorOk ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Food safe</span>
                  <span className="text-right text-xs">{m.foodSafe}</span>
                </div>
              </div>

              <div className="space-y-2 border-t pt-3">
                <div>
                  <div className="text-xs font-medium text-emerald-500">
                    Best for
                  </div>
                  <ul className="mt-1 text-xs text-muted-foreground">
                    {m.bestFor.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-medium text-destructive">
                    Avoid for
                  </div>
                  <ul className="mt-1 text-xs text-muted-foreground">
                    {m.avoidFor.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <ShareButton />
      </div>
    </div>
  );
}
