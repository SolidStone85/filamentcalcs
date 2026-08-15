"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "success" | "caution" | "danger";

type Props = {
  label: string;
  value: string;
  /** Optional unit rendered as a smaller suffix ("g", "kWh"). Display only. */
  unit?: string;
  sublabel?: string;
  copyValue?: string;
  prominent?: boolean;
  /** Semantic color for verdict-style results. Omit for the neutral look. */
  tone?: Tone;
};

// Verdict colors, tuned per theme: darker shades on light, lighter on dark.
const TONE_TEXT: Record<Tone, string> = {
  success: "text-emerald-600 dark:text-emerald-400",
  caution: "text-amber-600 dark:text-amber-400",
  danger: "text-red-600 dark:text-red-400",
};

const TONE_EDGE: Record<Tone, string> = {
  success: "via-emerald-500/60",
  caution: "via-amber-500/60",
  danger: "via-red-500/60",
};

const TONE_GLOW: Record<Tone, string> = {
  success: "bg-emerald-500/10",
  caution: "bg-amber-500/10",
  danger: "bg-red-500/10",
};

const TONE_FRAME: Record<Tone, string> = {
  success: "border-emerald-500/45 ring-1 ring-emerald-500/20",
  caution: "border-amber-500/45 ring-1 ring-amber-500/20",
  danger: "border-red-500/45 ring-1 ring-red-500/20",
};

export function ResultDisplay({
  label,
  value,
  unit,
  sublabel,
  copyValue,
  prominent = false,
  tone,
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
        "glass-card relative gap-2.5 overflow-hidden p-5",
        prominent &&
          (tone ? TONE_FRAME[tone] : "border-primary/45 ring-1 ring-primary/20"),
      )}
    >
      {/* Premium chrome on the hero result: a hairline gradient along the
          top edge plus a soft glow tucked behind the number. Static paint,
          nothing animates, so it never fights the tabular numerals. */}
      {prominent && (
        <>
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
              tone ? TONE_EDGE[tone] : "via-primary/60",
            )}
          />
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute -right-10 -top-12 size-40 rounded-full blur-3xl",
              tone ? TONE_GLOW[tone] : "bg-primary/10",
            )}
          />
        </>
      )}
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
            ? "text-4xl font-medium md:text-5xl"
            : "text-2xl font-medium md:text-[1.75rem]",
          tone ? TONE_TEXT[tone] : prominent && "text-primary",
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
