"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  /** Optional unit rendered as a smaller suffix ("g", "kWh"). Display only. */
  unit?: string;
  sublabel?: string;
  copyValue?: string;
  prominent?: boolean;
};

export function ResultDisplay({
  label,
  value,
  unit,
  sublabel,
  copyValue,
  prominent = false,
}: Props) {
  const [copied, setCopied] = useState(false);
  const canCopy = Boolean(copyValue);

  async function handleCopy() {
    if (!copyValue) return;
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be blocked; silently ignore.
    }
  }

  return (
    <Card
      className={cn(
        "glass-card gap-2.5 p-5",
        prominent && "border-primary/45 ring-1 ring-primary/20",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        {canCopy && (
          <Button
            variant="ghost"
            size="icon"
            className="-mt-1 -mr-1 size-7"
            onClick={handleCopy}
            aria-label={`Copy ${label}`}
          >
            {copied ? (
              <Check className="size-4 text-emerald-500" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
        )}
      </div>
      <div
        className={cn(
          "flex flex-wrap items-baseline gap-x-1.5 font-mono tabular-nums leading-none",
          prominent
            ? "text-4xl font-medium text-primary md:text-5xl"
            : "text-2xl font-medium md:text-[1.75rem]",
        )}
      >
        <span className="break-all">{value}</span>
        {unit && (
          <span className="font-sans text-sm font-normal text-muted-foreground md:text-base">
            {unit}
          </span>
        )}
      </div>
      {sublabel && (
        <div className="text-xs tabular-nums leading-5 text-muted-foreground">
          {sublabel}
        </div>
      )}
    </Card>
  );
}
